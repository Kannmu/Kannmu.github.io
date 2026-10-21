/** The gravity-gun page: bottle beam controls, 3D view and live steering. */
import { clamp } from '../core/math.ts';
import { el, formatNumber } from '../core/dom.ts';
import type { AppConfig } from '../config/types.ts';
import type { DeviceManager } from './DeviceManager.ts';
import type { PlanClient } from './PlanClient.ts';
import type { AppHost } from './workspace.ts';
import { GravityGunSession } from '../gravity/session.ts';
import { GamepadReader, KeyboardInput } from '../gravity/inputs.ts';
import { FreeSpace, clampSplit, coreRadius } from '../physics/bottle.ts';
import { SessionState } from '../device/session.ts';
import { GunScene, type GunView } from '../scene/GunScene.ts';
import {
  button,
  EventLog,
  MetricBar,
  renderReadout,
  section,
  setLoading,
  slider,
  type SliderHandle
} from '../ui/kit.ts';
import { drawFieldMap, drawSpeedTrace, type FieldMap } from '../ui/charts.ts';
import { toast } from '../ui/toast.ts';
import { mountIcons } from '../ui/icons.ts';

function must<T extends HTMLElement>(id: string): T {
  const node = document.getElementById(id);
  if (!node) throw new Error(`missing element #${id}`);
  return node as T;
}

export class GunWorkspace {
  private readonly cfg: AppConfig;
  private readonly scene: GunScene;
  private readonly log: EventLog;
  private readonly metrics: MetricBar;
  private session: GravityGunSession | null = null;
  private sessionVersion = -1;
  private lastDeviceVersion = -1;
  private active = false;
  private tickTimer = 0;
  private lastTick = 0;
  private sliceTimer = 0;
  private sliceSeq = 0;
  private sliceCache = new Map<string, FieldMap>();
  private readonly speedHistory: Array<{ t: number; v: number }> = [];
  private readonly keyboard = new KeyboardInput();
  private readonly pad = new GamepadReader();
  private view: GunView = 'scene';
  private readonly generateButton: HTMLElement;
  private readonly loading: HTMLElement;
  private readonly loadingText: HTMLElement;
  private readonly padDot: HTMLElement;
  private readonly padName: HTMLElement;
  private readonly resizeObserver: ResizeObserver;
  private statusTimer = 0;
  private holoStatusText = '—';
  private previewCoreMm = 0;

  constructor(
    private readonly host: AppHost,
    private readonly devices: DeviceManager,
    private readonly client: PlanClient
  ) {
    this.cfg = host.cfg;
    this.log = new EventLog(must('gunLog'));
    this.metrics = new MetricBar(must('gunMetrics'), [
      { key: 'x', label: 'X 位置', unit: 'mm', digits: 1 },
      { key: 'y', label: 'Y 位置', unit: 'mm', digits: 1 },
      { key: 'z', label: '高度', unit: 'mm', digits: 1, accent: true },
      { key: 'speed', label: '陷阱速度', unit: 'mm/s', digits: 0 },
      { key: 'core', label: '空腔半径', unit: 'mm', digits: 2 },
      { key: 'disc', label: '反相盘', unit: 'mm', digits: 1 }
    ]);
    this.scene = new GunScene(must<HTMLCanvasElement>('gunCanvas'), must('gunStage'));
    this.scene.onStats = (fps) => this.host.setFps(fps);
    this.loading = must('gunLoading');
    this.loadingText = must('gunLoadingText');
    this.resizeObserver = new ResizeObserver(() => this.drawCharts());
    this.resizeObserver.observe(must('gunMetrics'));
    this.resizeObserver.observe(must('gunSliceChart').parentElement!);

    const bottle = this.buildBottleSection();
    const steering = this.buildSteeringSection();
    must('gunControls').append(bottle.root, steering.root);
    mountIcons(must('gunControls'));
    this.generateButton = bottle.generate;
    this.padDot = steering.padDot;
    this.padName = steering.padName;

    this.bindHud();
    this.scene.setActive(false);
    this.applyView(this.view, false);
    this.updateMetrics();
    this.renderReadout();
    this.log.add('重力枪工作区就绪 · 0xA0 全息通路', 'ok');
    this.statusTimer = window.setInterval(() => void this.pollHolo(), 900);
    this.lastTick = performance.now();
    this.scene.setVisible(false);
  }

  // ------------------------------------------------------------------ controls
  private buildBottleSection(): {
    root: HTMLElement;
    level: SliderHandle;
    height: SliderHandle;
    split: SliderHandle;
    generate: HTMLElement;
  } {
    const gg = this.cfg.gravityGun;
    const level = slider({
      label: '全息驱动强度',
      min: 10,
      max: 128,
      step: 1,
      value: gg.level,
      unit: '/128',
      hint: '128 = 满占空比。驱动越强，瓶壁越高，捕获越稳。',
      onInput: (value) => {
        gg.level = Math.round(value);
      },
      onChange: () => {
        this.host.saveConfig();
        if (this.active) void this.session?.push(true);
      }
    });
    const height = slider({
      label: '声瓶高度',
      min: 40,
      max: 115,
      step: 1,
      value: gg.heightMm,
      unit: 'mm',
      onInput: (value) => {
        gg.heightMm = value;
        if (this.active && this.session) this.session.target[2] = value;
      },
      onChange: () => {
        this.host.saveConfig();
        if (this.active) void this.session?.push(true);
        this.updateMetrics();
      }
    });
    const split = slider({
      label: '反相盘半径（捕获尺寸）',
      min: 28,
      max: 36,
      step: 0.5,
      value: gg.splitMm,
      unit: 'mm',
      hint: '28–36 mm 是暗核跟随指令的区间；越大空腔越大。',
      onInput: (value) => {
        gg.splitMm = value;
      },
      onChange: () => {
        this.host.saveConfig();
        if (this.active) {
          void this.session?.push(true);
          this.scheduleSlice(120);
        }
        this.updateMetrics();
      }
    });
    const generate = button('生成声瓶', {
      icon: 'sparkles',
      variant: 'primary',
      block: true,
      onClick: () => void this.generate()
    });
    const centre = button('回中心', { icon: 'crosshair', onClick: () => void this.centre() });
    const off = button('关场', { icon: 'power', onClick: () => void this.off() });
    const estop = button('急停', { icon: 'zap', variant: 'danger', onClick: () => void this.emergencyStop() });
    const coreReadout = el('div', { class: 'gun-status-grid' }, el('div', { class: 'gun-status-cell' }, el('span', { text: '空腔半径' }), el('strong', { text: '—', id: 'gunCoreValue' })), el('div', { class: 'gun-status-cell' }, el('span', { text: '反相盘' }), el('strong', { text: '—', id: 'gunSplitValue' })));
    const root = section(
      { title: '瓶状声场', eyebrow: 'BOTTLE BEAM', actions: el('span', { class: 'eyebrow', text: '0xA0' }) },
      level.root,
      height.root,
      split.root,
      coreReadout,
      el('div', { class: 'btn-row' }, generate),
      el('div', { class: 'btn-row' }, centre, off),
      el('div', { class: 'btn-row' }, estop),
      el('p', { class: 'section-note', text: '暗核 + 瓶壁把物体罩在空中；单面阵列只能推开物体，亮焦点抓不住任何东西。' })
    );
    return { root, level, height, split, generate };
  }

  private buildSteeringSection(): {
    root: HTMLElement;
    padDot: HTMLElement;
    padName: HTMLElement;
  } {
    const gg = this.cfg.gravityGun;
    const padDot = el('span', { class: 'pad-dot' });
    const padName = el('span', { class: 'pad-name', text: 'pad: 未扫描' });
    const rescan = button('扫描手柄', {
      icon: 'gamepad-2',
      variant: 'small',
      onClick: () => this.scanPad()
    });
    const sensitivity = slider({
      label: '摇杆灵敏度',
      min: 10,
      max: 200,
      step: 1,
      value: gg.sensitivityMmS,
      unit: 'mm/s',
      onInput: (value) => {
        gg.sensitivityMmS = value;
      },
      onChange: () => this.host.saveConfig()
    });
    const smoothing = slider({
      label: '指令平滑',
      min: 10,
      max: 200,
      step: 5,
      value: gg.smoothingMs,
      unit: 'ms',
      hint: '陷阱是物理对象，阶跃指令会让它振铃。',
      onInput: (value) => {
        gg.smoothingMs = value;
      },
      onChange: () => this.host.saveConfig()
    });
    const rate = slider({
      label: '全息更新率',
      min: 10,
      max: 50,
      step: 1,
      value: gg.updateHz,
      unit: 'Hz',
      onInput: (value) => {
        gg.updateHz = value;
      },
      onChange: () => this.host.saveConfig()
    });
    const keys = el(
      'div',
      { class: 'key-help' },
      el('kbd', { text: 'W' }),
      el('kbd', { text: 'A' }),
      el('kbd', { text: 'S' }),
      el('kbd', { text: 'D' }),
      ' 移动 xy · ',
      el('kbd', { text: 'R' }),
      ' / ',
      el('kbd', { text: 'PageUp' }),
      ' 上升 · ',
      el('kbd', { text: 'F' }),
      ' / ',
      el('kbd', { text: 'PageDown' }),
      ' 下降 · ',
      el('kbd', { text: 'Space' }),
      ' 回中 · ',
      el('kbd', { text: 'Esc' }),
      ' 急停'
    );
    const root = section(
      { title: '三维控制', eyebrow: 'STEERING' },
      el('div', { class: 'pad-row' }, padDot, padName, rescan),
      sensitivity.root,
      smoothing.root,
      rate.root,
      keys,
      el('p', { class: 'section-note', text: '手柄：左摇杆 xy，右摇杆与扳机 z，A 回中，B 急停。' })
    );
    return { root, padDot, padName };
  }

  private bindHud(): void {
    for (const buttonEl of document.querySelectorAll<HTMLElement>('[data-gun-view]')) {
      buttonEl.addEventListener('click', () => {
        const view = buttonEl.dataset.gunView as GunView;
        this.applyView(view, true);
      });
    }
    must('gunResetView').addEventListener('click', () => this.scene.resetView());
    must('gunClearLog').addEventListener('click', () => this.log.clear());
    must('gunRailHint').textContent = `暗核 + 瓶壁 · ${this.cfg.gravityGun.splitMm.toFixed(1)} mm disc`;
  }

  private applyView(view: GunView, request: boolean): void {
    this.view = view;
    for (const buttonEl of document.querySelectorAll<HTMLElement>('[data-gun-view]')) {
      buttonEl.classList.toggle('is-active', buttonEl.dataset.gunView === view);
    }
    this.scene.setView(view);
    if (view === 'slice' && request) this.scheduleSlice(0);
  }

  private scanPad(): void {
    if (this.pad.scan()) {
      this.padDot.classList.add('is-on');
      this.padName.textContent = this.pad.name;
      this.log.add(`手柄已连接：${this.pad.name}`, 'ok');
    } else {
      this.padDot.classList.remove('is-on');
      this.padName.textContent = this.pad.error;
    }
  }

  // ------------------------------------------------------------------ session
  private ensureSession(): GravityGunSession {
    const state = this.devices.state;
    if (!this.session || this.sessionVersion !== state.version) {
      this.session = new GravityGunSession(state.device, this.cfg);
      this.sessionVersion = state.version;
    }
    return this.session;
  }

  async generate(): Promise<void> {
    try {
      const session = this.ensureSession();
      if (!session.holo) await session.open();
      const message = await session.start();
      this.active = true;
      this.lastTick = performance.now();
      this.speedHistory.length = 0;
      this.scene.setActive(true);
      this.updateSceneTarget();
      this.hudTitle(message);
      this.startLoop();
      this.log.add(message, 'ok');
      this.generateButton.querySelector('span')!.textContent = '重新生成';
      toast('声瓶已生成，用键盘或手柄移动它', 'ok');
      this.scheduleSlice(0);
    } catch (error) {
      this.fail(error);
    }
  }

  private startLoop(): void {
    if (this.tickTimer) window.clearTimeout(this.tickTimer);
    this.tickTimer = 0;
    this.tick();
  }

  private tick = (): void => {
    if (!this.active) return;
    const session = this.session;
    if (!session || session.state !== SessionState.Hover) return;
    const now = performance.now();
    const dt = clamp((now - this.lastTick) / 1000, 0.001, 0.1);
    this.lastTick = now;
    const padState = this.pad.poll();
    let aim = this.keyboard.aim();
    if (this.pad.available) {
      aim = [
        clamp(aim[0] + padState.aim[0], -1, 1),
        clamp(aim[1] + padState.aim[1], -1, 1),
        clamp(aim[2] + padState.aim[2], -1, 1)
      ];
    }
    if (this.keyboard.centre || padState.centre) {
      this.keyboard.centre = false;
      void this.centre();
    }
    if (this.keyboard.drop || padState.drop) {
      this.keyboard.drop = false;
      void this.emergencyStop();
      return;
    }
    void session
      .step(aim, dt)
      .then(() => {
        this.updateSceneTarget();
        const speed = session.speedMmS;
        this.speedHistory.push({ t: now / 1000, v: speed });
        if (this.speedHistory.length > 420) this.speedHistory.shift();
        this.updateMetrics();
        if (Math.random() < 0.12) this.drawSpeedChart();
        window.clearTimeout(this.sliceTimer);
        this.sliceTimer = window.setTimeout(() => this.scheduleSlice(0), 320);
        this.tickTimer = window.setTimeout(this.tick, 20);
      })
      .catch((error) => {
        this.fail(error);
        this.active = false;
      });
  };

  private updateSceneTarget(): void {
    const session = this.session;
    if (!session) return;
    this.scene.setTarget(session.target, session.splitMm, session.coreMm);
    const splitEl = document.getElementById('gunSplitValue');
    if (splitEl) splitEl.textContent = `${session.splitMm.toFixed(1)} mm`;
    const coreEl = document.getElementById('gunCoreValue');
    if (coreEl) coreEl.textContent = `${session.coreMm.toFixed(2)} mm`;
    const telemetry = must('gunHudTelemetry');
    telemetry.textContent = `x ${session.target[0].toFixed(1)} · y ${session.target[1].toFixed(1)} · z ${session.target[2].toFixed(
      1
    )} mm · |v| ${session.speedMmS.toFixed(0)} mm/s`;
    const title = must('gunTitle');
    title.textContent = `声瓶 · ${session.target[2].toFixed(0)} mm`;
    const sub = must('gunSub');
    sub.textContent = `disc ${session.splitMm.toFixed(1)} mm · 空腔 ${session.coreMm.toFixed(1)} mm · level ${
      this.cfg.gravityGun.level
    }${session.morphErrors ? ` · ${session.morphErrors} 次形变错误` : ''}`;
    this.renderReadout();
  }

  private updateMetrics(): void {
    const session = this.session;
    const target = session?.target ?? [0, 0, this.cfg.gravityGun.heightMm];
    const split = session?.splitMm ?? this.cfg.gravityGun.splitMm;
    const core = session?.coreMm ?? this.previewCoreMm;
    this.metrics.update({
      x: target[0],
      y: target[1],
      z: target[2],
      speed: session?.speedMmS ?? 0,
      core,
      disc: split
    });
  }

  private hudTitle(message: string): void {
    must('gunTitle').textContent = `声瓶 · ${this.cfg.gravityGun.heightMm.toFixed(0)} mm`;
    must('gunSub').textContent = message;
    must('gunModeBadge').textContent = 'HOLOGRAM';
  }

  async centre(): Promise<void> {
    try {
      await this.session?.centre();
      this.updateSceneTarget();
      this.log.add('声瓶回到中心', 'info');
    } catch (error) {
      this.fail(error);
    }
  }

  async off(): Promise<void> {
    this.stopLoop();
    try {
      await this.session?.release();
      this.active = false;
      this.scene.setActive(false);
      must('gunTitle').textContent = '待生成';
      must('gunSub').textContent = '声瓶已关闭。点「生成声瓶」重新开始。';
      this.generateButton.querySelector('span')!.textContent = '生成声瓶';
      this.log.add('声瓶已关闭', 'info');
      this.showPreviewBottle();
      this.renderReadout();
    } catch (error) {
      this.fail(error);
    }
  }

  async emergencyStop(): Promise<void> {
    this.stopLoop();
    try {
      await this.session?.emergencyStop();
      await this.devices.current.clear();
    } catch {
      /* abort path */
    }
    this.active = false;
    this.scene.setActive(false);
    this.log.add('E-STOP：声场立即关闭', 'error');
    toast('E-STOP：声瓶已关闭', 'error');
    must('gunSub').textContent = 'E-STOP 已触发。';
    this.showPreviewBottle();
    this.renderReadout();
  }

  private stopLoop(): void {
    this.active = false;
    window.clearTimeout(this.tickTimer);
    this.tickTimer = 0;
    this.keyboard.clear();
    this.pad.stop();
    this.padDot.classList.remove('is-on');
    this.padName.textContent = 'pad: 未启动';
  }

  // -------------------------------------------------------------------- slice
  private scheduleSlice(delay: number): void {
    window.clearTimeout(this.sliceTimer);
    this.sliceTimer = window.setTimeout(() => void this.requestSlice(), delay);
  }

  private async requestSlice(): Promise<void> {
    const gg = this.cfg.gravityGun;
    const target = this.session?.target ?? [0, 0, gg.heightMm];
    const split = this.session?.splitMm ?? gg.splitMm;
    const key = `${target[0].toFixed(1)}|${target[1].toFixed(1)}|${target[2].toFixed(1)}|${split.toFixed(
      1
    )}|${gg.level}`;
    const cached = this.sliceCache.get(key);
    if (cached) {
      this.scene.setSlice(cached);
      this.drawCharts();
      return;
    }
    const seq = ++this.sliceSeq;
    setLoading(this.loading, this.loadingText, true, '正在合成瓶状声场截面…');
    try {
      const map = await this.client.gunSlice({
        coordinatesUm: this.devices.current.profile.coordinatesUm,
        xMm: target[0],
        yMm: target[1],
        heightMm: target[2],
        splitMm: split,
        xHalfMm: 55,
        zMaxMm: 130,
        gridX: 108,
        gridZ: 120
      });
      if (seq !== this.sliceSeq) return;
      if (this.sliceCache.size > 24) this.sliceCache.clear();
      this.sliceCache.set(key, map);
      this.scene.setSlice(map);
      this.drawCharts();
      this.updateMetrics();
    } catch (error) {
      this.log.add(`截面计算失败：${String(error)}`, 'error');
    } finally {
      if (seq === this.sliceSeq) setLoading(this.loading, this.loadingText, false);
    }
  }

  private drawCharts(): void {
    drawSpeedTrace(must<HTMLCanvasElement>('gunSpeedChart'), this.speedHistory, this.cfg.gravityGun.speedLimitMmS);
    const session = this.session;
    const target = session?.target ?? [0, 0, this.cfg.gravityGun.heightMm];
    const key = `${target[0].toFixed(1)}|${target[1].toFixed(1)}|${target[2].toFixed(1)}|${(
      session?.splitMm ?? this.cfg.gravityGun.splitMm
    ).toFixed(1)}|${this.cfg.gravityGun.level}`;
    const map = this.sliceCache.get(key);
    drawFieldMap(must<HTMLCanvasElement>('gunSliceChart'), map ?? null, { x: target[0], y: target[2] });
    must('gunSliceNote').textContent = map ? `沿 y = ${target[1].toFixed(0)} mm` : '等待截面';
  }

  private drawSpeedChart(): void {
    drawSpeedTrace(must<HTMLCanvasElement>('gunSpeedChart'), this.speedHistory, this.cfg.gravityGun.speedLimitMmS);
  }

  private async pollHolo(): Promise<void> {
    const session = this.session;
    if (!session?.holo || !this.active) return;
    try {
      const status = await session.holo.status();
      this.holoStatusText = `${status.stateName} · ${status.fps.toFixed(0)} fps · ${status.serviceAvgUs}/${status.serviceMaxUs} µs`;
      this.renderReadout();
    } catch {
      this.holoStatusText = '状态读取失败';
    }
  }

  private fail(error: unknown): void {
    const message = error instanceof Error ? error.message : String(error);
    this.log.add(message, 'error');
    toast(message, 'error', 4200);
    const stageError = document.getElementById('gunStageError');
    if (stageError) {
      stageError.hidden = false;
      stageError.textContent = message;
      window.setTimeout(() => (stageError.hidden = true), 5000);
    }
  }

  private renderReadout(): void {
    const session = this.session;
    const gg = this.cfg.gravityGun;
    const target = session?.target ?? [0, 0, gg.heightMm];
    const fmt = (value: number, digits = 1): string => (Number.isFinite(value) ? formatNumber(value, digits) : '—');
    renderReadout(must('gunReadout'), [
      {
        title: '声瓶',
        meta: this.active ? 'ACTIVE' : 'IDLE',
        rows: [
          { label: '目标', value: `${fmt(target[0], 1)}, ${fmt(target[1], 1)}, ${fmt(target[2], 1)} mm` },
          { label: '反相盘半径', value: `${fmt(session?.splitMm ?? gg.splitMm, 1)} mm` },
          { label: '空腔半径', value: `${fmt(session?.coreMm ?? 0, 2)} mm` },
          { label: '陷阱速度', value: `${fmt(session?.speedMmS ?? 0, 0)} mm/s` },
          { label: '更新率', value: `${fmt(gg.updateHz, 0)} Hz` },
          { label: '平滑', value: `${fmt(gg.smoothingMs, 0)} ms` },
          { label: '形变错误', value: `${session?.morphErrors ?? 0}`, state: (session?.morphErrors ?? 0) > 0 ? 'warn' : 'good' }
        ]
      },
      {
        title: '全息与固件',
        meta: session?.holo?.calValid ? 'CAL OK' : 'NO CAL',
        rows: [
          { label: '状态', value: this.holoStatusText },
          { label: '校准相位', value: session?.holo?.calValid ? '已读取 EEPROM' : '未读取', state: session?.holo?.calValid ? 'good' : 'dim' },
          { label: '载波', value: `${this.devices.current.profile.carrierHz / 1000} kHz` },
          { label: '阵元', value: `${this.devices.current.profile.channelCount} 路` },
          { label: '能力位', value: `0x${this.devices.current.profile.capabilityFlags.toString(16).toUpperCase()}` },
          { label: '链路', value: this.devices.isDemo ? '演示（无硬件）' : this.devices.state.label, state: this.devices.isDemo ? 'dim' : 'good' }
        ]
      },
      {
        title: '边界',
        rows: [
          { label: 'xy 范围', value: `±${gg.boundsMm[0]} / ±${gg.boundsMm[1]} mm` },
          { label: '高度范围', value: `${gg.bottomMm}–${gg.heightMaxMm} mm` },
          { label: '速度上限', value: `${gg.speedLimitMmS} mm/s` }
        ]
      }
    ]);
  }

  activate(): void {
    this.scene.setVisible(true);
    this.keyboard.attach();
    if (!this.active) this.showPreviewBottle();
    if (!this.pad.available && !this.pad.error) this.scanPad();
    this.scene.resize();
    this.drawCharts();
  }

  deactivate(): void {
    this.scene.setVisible(false);
    this.keyboard.detach();
    this.stopLoop();
    if (this.session?.state === SessionState.Hover) {
      this.session
        .release()
        .then(() => this.log.add('切换到光绘显示器：声瓶已关闭', 'info'))
        .catch(() => undefined);
    }
    this.active = false;
    this.scene.setActive(false);
  }

  onDeviceChanged(): void {
    const version = this.devices.state.version;
    if (version === this.lastDeviceVersion) return;
    this.lastDeviceVersion = version;
    this.stopLoop();
    this.session = null;
    this.sessionVersion = -1;
    this.scene.setActive(false);
    this.holoStatusText = '—';
    this.log.add(
      this.devices.isDemo
        ? '重力枪：使用演示设备'
        : `重力枪：已连接 ${this.devices.state.label} · ${this.devices.state.device.profile.firmware}`,
      this.devices.isDemo ? 'warn' : 'ok'
    );
    this.renderReadout();
    this.showPreviewBottle();
    this.scheduleSlice(200);
  }

  private showPreviewBottle(): void {
    const gg = this.cfg.gravityGun;
    const space = new FreeSpace(this.devices.current.profile.coordinatesUm);
    const split = clampSplit(space, gg.splitMm);
    const target = this.session?.target ?? [0, 0, gg.heightMm];
    this.previewCoreMm = coreRadius(split);
    this.scene.showPreview(target, split, this.previewCoreMm);
    const coreEl = document.getElementById('gunCoreValue');
    if (coreEl) coreEl.textContent = `${this.previewCoreMm.toFixed(2)} mm`;
    const splitEl = document.getElementById('gunSplitValue');
    if (splitEl) splitEl.textContent = `${split.toFixed(1)} mm`;
    this.updateMetrics();
  }

  async start(): Promise<void> {
    this.lastDeviceVersion = this.devices.state.version;
    this.updateMetrics();
    this.renderReadout();
    this.showPreviewBottle();
    this.scheduleSlice(0);
  }

  isFieldActive(): boolean {
    return this.active || (this.session !== null && this.session.state !== SessionState.Idle);
  }

  setFpsListener(): void {
    this.scene.onStats = (fps) => this.host.setFps(fps);
  }

  dispose(): void {
    window.clearInterval(this.statusTimer);
    window.clearTimeout(this.tickTimer);
    this.resizeObserver.disconnect();
    this.keyboard.detach();
    this.pad.stop();
    this.scene.dispose();
    void this.session?.emergencyStop();
  }
}



