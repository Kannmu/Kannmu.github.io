/** The down-firing display page: controls, plan pipeline, 3D view, playback. */
import { clear, el, formatNumber, icon } from '../core/dom.ts';
import { formatDuration } from '../core/math.ts';
import type { AppConfig } from '../config/types.ts';
import { acousticPower } from '../physics/trap.ts';
import { lateralAccelOf, setLateralAccel, trapModeOf } from '../config/defaults.ts';
import { clearConfig, downloadConfig, readConfigFile, saveConfig } from '../config/store.ts';
import { SHAPES } from '../shapes/library.ts';
import type { Plan } from '../motion/planner.ts';
import { Session, SessionState } from '../device/session.ts';
import type { MotionStatus } from '../device/protocol.ts';
import type { DeviceManager, LinkState } from './DeviceManager.ts';
import type { PlanClient } from './PlanClient.ts';
import type { AppHost, UiState } from './workspace.ts';
import { DisplayScene, type DisplayView } from '../scene/DisplayScene.ts';
import {
  button,
  colorField,
  EventLog,
  MetricBar,
  renderReadout,
  renderWarnings,
  section,
  segmented,
  setLoading,
  shapeGrid,
  slider,
  textInput,
  toggle,
  type SliderHandle,
  type ToggleHandle
} from '../ui/kit.ts';
import { drawPlanChart, drawSpeedChart, type FieldMap } from '../ui/charts.ts';
import { toast } from '../ui/toast.ts';
import { mountIcons } from '../ui/icons.ts';

const SHAPE_NAMES = [...Object.keys(SHAPES), 'text'];
const SHAPE_LABELS: Record<string, string> = {
  circle: '圆',
  square: '方',
  triangle: '三角',
  hexagon: '六边',
  star: '五角星',
  heart: '心形',
  rose: '玫瑰线',
  lissajous: '李萨如',
  infinity: '无穷',
  text: '文字'
};

function must<T extends HTMLElement>(id: string): T {
  const node = document.getElementById(id);
  if (!node) throw new Error(`missing element #${id}`);
  return node as T;
}

const RAW_LOOP_MIN_MS = 1;
const RAW_LOOP_MAX_MS = 60000;
const RAW_RATE_MIN = 0.001;
const RAW_RATE_MAX = 1;
const RAW_LOOP_DECADES = Math.log10(RAW_LOOP_MAX_MS);
const RAW_RATE_DECADES = Math.log10(RAW_RATE_MAX / RAW_RATE_MIN);

function posToRawLoop(pos: number): number {
  return Math.max(RAW_LOOP_MIN_MS, Math.min(RAW_LOOP_MAX_MS, 10 ** ((pos / 1000) * RAW_LOOP_DECADES)));
}

function rawLoopToPos(ms: number): number {
  return (1000 * Math.log10(Math.max(RAW_LOOP_MIN_MS, Math.min(RAW_LOOP_MAX_MS, ms)))) / RAW_LOOP_DECADES;
}

function posToRawRate(pos: number): number {
  return Math.max(RAW_RATE_MIN, Math.min(RAW_RATE_MAX, 10 ** (Math.log10(RAW_RATE_MIN) + (pos / 1000) * RAW_RATE_DECADES)));
}

function rawRateToPos(rate: number): number {
  return (1000 * (Math.log10(Math.max(RAW_RATE_MIN, Math.min(RAW_RATE_MAX, rate))) - Math.log10(RAW_RATE_MIN))) / RAW_RATE_DECADES;
}

export class DisplayWorkspace {
  private readonly cfg: AppConfig;
  private readonly log: EventLog;
  private metrics: MetricBar;
  private readonly scene: DisplayScene;
  private plan: Plan | null = null;
  private session: Session | null = null;
  private sessionVersion = -1;
  private selectedShape: string;
  private view: DisplayView;
  private playing = false;
  private phase = 0;
  private speed: number;
  private lastFrame = 0;
  private raf = 0;
  private lastChart = 0;
  private planSeq = 0;
  private planning = false;
  private pendingPlan = false;
  private lastStatus: MotionStatus | null = null;
  private pollTimer = 0;
  private pollBusy = false;
  private fieldCache = new Map<string, FieldMap>();
  private fieldSeq = 0;
  private spinArmed = false;
  private lastDeviceVersion = -1;
  private visible = false;
  private readonly levelSlider: SliderHandle;
  private readonly lateralSlider: SliderHandle;
  private readonly refreshSlider: SliderHandle;
  private readonly normalMotion: HTMLElement;
  private readonly motionRoot: HTMLElement;
  private readonly rawMotion: HTMLElement;
  private readonly rawLoop: SliderHandle;
  private readonly rawRate: SliderHandle;
  private readonly rawActual: HTMLElement;
  private readonly unlimitedToggle: ToggleHandle;
  private readonly spanEl: HTMLElement;
  private readonly textRow: HTMLElement;
  private readonly textField: HTMLInputElement;
  private readonly shapeGridHandle: ReturnType<typeof shapeGrid>;
  private readonly levelFill: HTMLElement;
  private readonly levelCaption: HTMLElement;
  private readonly spinButton: HTMLElement;
  private readonly playButton: HTMLElement;
  private readonly stickyPlay: HTMLElement;
  private readonly loading: HTMLElement;
  private readonly loadingText: HTMLElement;
  private readonly stageError: HTMLElement;
  private readonly loopFill: HTMLElement;
  private readonly clock: HTMLElement;
  private readonly paletteStrip: HTMLElement;
  private readonly resizeObserver: ResizeObserver;

  constructor(
    private readonly host: AppHost,
    private readonly devices: DeviceManager,
    private readonly client: PlanClient,
    private readonly ui: UiState
  ) {
    this.cfg = host.cfg;
    this.selectedShape = SHAPE_NAMES.includes(ui.displayShape) ? ui.displayShape : 'circle';
    this.view = ui.displayView;
    this.speed = ui.speed || 1;

    this.log = new EventLog(must('displayLog'));
    this.metrics = this.createMetrics();

    this.scene = new DisplayScene(must<HTMLCanvasElement>('displayCanvas'), must('displayStage'));
    this.scene.onStats = (fps) => this.host.setFps(fps);

    this.levelFill = el('i');
    this.levelCaption = el('div', { class: 'level-caption' });
    this.loading = must('displayLoading');
    this.loadingText = must('displayLoadingText');
    this.stageError = must('displayStageError');
    this.loopFill = must('displayLoopFill');
    this.clock = must('displayClock');
    this.paletteStrip = el('div', { class: 'palette-strip' });
    this.resizeObserver = new ResizeObserver(() => this.drawCharts(this.phase));
    this.resizeObserver.observe(must('displayMetrics'));
    this.resizeObserver.observe(must('speedChart').parentElement!);

    const mode = this.buildModeSection();
    const trap = this.buildTrapSection();
    const shape = this.buildShapeSection();
    const colour = this.buildColourSection();
    const motion = this.buildMotionSection();
    const config = this.buildConfigSection();
    must('displayControls').append(mode.root, trap.root, shape.root, colour.root, motion.root, config);
    mountIcons(must('displayControls'));

    this.levelSlider = trap.level;
    this.lateralSlider = motion.lateral;
    this.refreshSlider = motion.refresh;
    this.normalMotion = motion.normal;
    this.motionRoot = motion.root;
    this.rawMotion = mode.raw;
    this.rawLoop = mode.rawLoop;
    this.rawRate = mode.rawRate;
    this.rawActual = mode.rawActual;
    this.unlimitedToggle = mode.toggle;
    this.spanEl = shape.span;
    this.textRow = shape.textRow;
    this.textField = shape.textField;
    this.shapeGridHandle = shape.grid;
    this.spinButton = trap.spin;
    this.playButton = must('displayPlay');
    const stickyPlan = button('规划', { icon: 'scan-line', variant: 'primary', onClick: () => void this.replan(true) });
    this.stickyPlay = button('播放', { icon: 'play', onClick: () => void this.togglePlayback() });
    const stickyStop = button('停止', { icon: 'square', onClick: () => void this.stopPlayback() });
    const rail = must('displayRail');
    rail.insertBefore(
      el('div', { class: 'rail-actions' }, stickyPlan, this.stickyPlay, stickyStop),
      rail.querySelector('.rail-foot')
    );

    this.syncUnlimitedUi();
    this.bindHud();
    this.bindPlayback();
    this.syncShapeUi();
    this.updateLevelMeter();
    this.syncSpeedSelect();
    this.applyView(this.view, false);
    this.log.add('工作区就绪 · 规则来自原 Python 实现', 'ok');
    this.log.add(this.devices.isDemo ? '演示硬件已加载（未连接真实设备）' : `已连接 ${this.devices.state.label}`, 'info');
    this.pollTimer = window.setInterval(() => void this.pollStatus(), 700);
  }

  // ------------------------------------------------------------------ controls
  private buildTrapSection(): {
    root: HTMLElement;
    level: SliderHandle;
    drawLevel: SliderHandle;
    spin: HTMLElement;
  } {
    const cfg = this.cfg;
    const level = slider({
      label: '悬停强度',
      min: 20,
      max: 255,
      step: 1,
      value: cfg.trap.level,
      unit: '/255',
      onInput: (value) => {
        cfg.trap.level = Math.round(value);
        this.updateLevelMeter();
        this.host.saveConfig();
      },
      onChange: (value) => {
        const levelValue = Math.round(value);
        cfg.trap.level = levelValue;
        this.updateLevelMeter();
        this.host.saveConfig();
        if (this.session?.state === SessionState.Hover) {
          this.session.setLevel(levelValue).catch((error) => this.fail(error));
        }
      }
    });
    const drawLevel = slider({
      label: '绘制强度',
      min: 0,
      max: 255,
      step: 1,
      value: cfg.planner.drawLevel,
      unit: '/255',
      hint: '0 = 沿用悬停强度；255 是满功率。',
      onInput: (value) => {
        cfg.planner.drawLevel = Math.round(value);
      },
      onChange: () => {
        this.host.saveConfig();
        this.schedulePlan();
      }
    });
    const meter = el('div', { class: 'level-meter' }, this.levelFill);
    const levitate = button('起浮 / 接管', {
      icon: 'power',
      variant: 'primary',
      block: true,
      onClick: () => void this.levitate()
    });
    const drop = button('落球', { icon: 'arrow-down', onClick: () => void this.dropBead() });
    const spin = button('Spin 标定', { icon: 'gauge', onClick: () => void this.onSpin() });
    const estop = button('急停', { icon: 'zap', variant: 'danger', title: '立即关场（E-STOP）', onClick: () => void this.emergencyStop() });

    const root = section(
      {
        title: '声场与强度',
        eyebrow: 'TRAP',
        actions: el('span', { class: 'eyebrow', text: 'MOTION v7' })
      },
      level.root,
      drawLevel.root,
      meter,
      this.levelCaption,
      el('div', { class: 'btn-row' }, estop),
      el('div', { class: 'btn-row' }, levitate),
      el('div', { class: 'btn-row' }, drop, spin),
      el('p', { class: 'section-note', text: '先打开陷阱，再把泡沫小球放进声场。Spin 标定把横向强度写进配置。' })
    );
    return { root, level, drawLevel, spin };
  }

  private buildShapeSection(): {
    root: HTMLElement;
    grid: ReturnType<typeof shapeGrid>;
    textRow: HTMLElement;
    textField: HTMLInputElement;
    span: HTMLElement;
  } {
    const cfg = this.cfg;
    const grid = shapeGrid(SHAPE_NAMES, this.selectedShape, (name) => this.selectShape(name));
    const textField = textInput(cfg.display.text, {
      placeholder: '输入英文、数字或符号',
      ariaLabel: '文字内容',
      onCommit: (value) => {
        cfg.display.text = value.toUpperCase();
        this.selectedShape = 'text';
        this.ui.displayShape = 'text';
        this.shapeGridHandle.setActive('text');
        this.syncShapeUi();
        this.schedulePlan(true);
      }
    });
    const textRow = el('div', { class: 'inline-row' }, textField, button('绘制', { variant: 'small', onClick: () => this.textField.blur() }));
    const size = slider({
      label: '图形尺寸',
      min: 2,
      max: 60,
      step: 0.5,
      value: cfg.display.sizeMm,
      unit: 'mm',
      onInput: (value) => {
        cfg.display.sizeMm = value;
      },
      onChange: () => {
        this.host.saveConfig();
        this.schedulePlan();
      }
    });
    const height = slider({
      label: '文字高度',
      min: 2,
      max: 30,
      step: 0.5,
      value: cfg.display.textHeightMm,
      unit: 'mm',
      onInput: (value) => {
        cfg.display.textHeightMm = value;
      },
      onChange: () => {
        this.host.saveConfig();
        if (this.selectedShape === 'text') this.schedulePlan();
      }
    });
    const cx = slider({
      label: '中心 X',
      min: -35,
      max: 35,
      step: 0.5,
      value: cfg.display.centerXMm,
      unit: 'mm',
      onInput: (value) => {
        cfg.display.centerXMm = value;
      },
      onChange: () => {
        this.host.saveConfig();
        this.schedulePlan();
      }
    });
    const cy = slider({
      label: '中心 Y',
      min: -35,
      max: 35,
      step: 0.5,
      value: cfg.display.centerYMm,
      unit: 'mm',
      onInput: (value) => {
        cfg.display.centerYMm = value;
      },
      onChange: () => {
        this.host.saveConfig();
        this.schedulePlan();
      }
    });
    const span = el('span', { class: 'eyebrow', text: 'SHAPE' });
    const root = section(
      { title: '图形与摆放', eyebrow: 'SHAPE', actions: span },
      grid.root,
      textRow,
      size.root,
      height.root,
      cx.root,
      cy.root,
      el('p', { class: 'section-note', text: '小图形画得更快；图形离阵列轴心越远，陷阱越弱。' })
    );
    return { root, grid, textRow, textField, span };
  }

  private buildColourSection(): { root: HTMLElement } {
    const cfg = this.cfg;
    const scheme = segmented(
      [
        { value: 'wheel', label: '色轮' },
        { value: 'gradient', label: '渐变' },
        { value: 'solid', label: '单色' }
      ],
      cfg.display.colorScheme,
      (value) => {
        cfg.display.colorScheme = value;
        this.host.saveConfig();
        this.schedulePlan();
      },
      'seg-wide'
    );
    const swatches = el(
      'div',
      { class: 'swatch-row' },
      colorField('A', cfg.display.colorA, (rgb) => {
        cfg.display.colorA = rgb;
        this.host.saveConfig();
      }),
      colorField('B', cfg.display.colorB, (rgb) => {
        cfg.display.colorB = rgb;
        this.host.saveConfig();
      })
    );
    const flow = slider({
      label: '颜色流动',
      min: 0,
      max: 1.55,
      step: 0.05,
      value: cfg.display.hueSpinRevS,
      unit: 'rev/s',
      onInput: (value) => {
        cfg.display.hueSpinRevS = value;
      },
      onChange: () => this.host.saveConfig()
    });
    const brightness = slider({
      label: '亮度',
      min: 0,
      max: 1,
      step: 0.02,
      value: cfg.display.brightness,
      format: (value) => `${Math.round(value * 100)}`,
      unit: '%',
      onInput: (value) => {
        cfg.display.brightness = value;
      },
      onChange: () => {
        this.host.saveConfig();
        this.schedulePlan();
      }
    });
    const even = slider({
      label: '慢处调暗',
      min: 0,
      max: 1,
      step: 0.05,
      value: cfg.display.evenLines,
      format: (value) => `${Math.round(value * 100)}`,
      unit: '%',
      hint: '让拐角与笔画端点不过曝，整条线曝光一致。',
      onInput: (value) => {
        cfg.display.evenLines = value;
      },
      onChange: () => {
        this.host.saveConfig();
        this.schedulePlan();
      }
    });
    const apply = button('实时上色', {
      icon: 'palette',
      onClick: () => void this.recolor()
    });
    const root = section(
      { title: '颜色与光', eyebrow: 'COLOUR' },
      scheme.root,
      swatches,
      this.paletteStrip,
      flow.root,
      brightness.root,
      even.root,
      el('div', { class: 'btn-row' }, apply)
    );
    return { root };
  }

  private buildModeSection(): {
    root: HTMLElement;
    raw: HTMLElement;
    rawLoop: SliderHandle;
    rawRate: SliderHandle;
    rawActual: HTMLElement;
    toggle: ToggleHandle;
  } {
    const cfg = this.cfg;
    const rawToggle = toggle({
      label: '解除所有限制',
      checked: cfg.unlimited.enabled,
      hint: '原始轨迹：不提前规划、不做动力学仿真。关闭后恢复速度规划与校验。',
      onChange: (checked) => void this.setUnlimited(checked).catch((error) => this.fail(error))
    });
    rawToggle.input.id = 'unlimitedToggle';
    const rawActual = el('div', { class: 'raw-summary' });
    const rawLoop = slider({
      label: '基础周期',
      min: 0,
      max: 1000,
      step: 1,
      value: rawLoopToPos(cfg.unlimited.loopMs),
      format: (pos) => formatDuration(posToRawLoop(pos)),
      hint: '固件循环长度：1 ms – 60 s。',
      onInput: (pos) => {
        cfg.unlimited.loopMs = Math.round(posToRawLoop(pos));
        this.updateRawSummary();
      },
      onChange: (pos) => {
        cfg.unlimited.loopMs = Math.round(posToRawLoop(pos));
        this.host.saveConfig();
        this.updateRawSummary();
        if (this.playing) toast('基础周期在下次播放生效', 'info');
        else this.schedulePlan(true);
      }
    });
    rawLoop.input.id = 'rawLoop';
    const rawRate = slider({
      label: '播放速度',
      min: 0,
      max: 1000,
      step: 1,
      value: rawRateToPos(cfg.unlimited.rate),
      format: (pos) => `${posToRawRate(pos).toFixed(3)}×`,
      hint: '固件速率分频 0.001× – 1×；播放中也可实时调整。',
      onInput: (pos) => {
        cfg.unlimited.rate = posToRawRate(pos);
        this.updateRawSummary();
      },
      onChange: (pos) => {
        const rate = posToRawRate(pos);
        cfg.unlimited.rate = rate;
        this.host.saveConfig();
        if (this.playing && this.plan?.raw) void this.applyRawRate(rate);
        else {
          this.updateRawSummary();
          this.schedulePlan(true);
        }
      }
    });
    rawRate.input.id = 'rawRate';
    const raw = el(
      'div',
      { class: 'raw-group' },
      rawLoop.root,
      rawRate.root,
      rawActual,
      el('p', {
        class: 'section-note',
        text: '固件按上传点线性插值循环播放：无前馈、无速度/加速度约束、无共振滤波、无仿真校验。硬边界只有固件点数和 60 s 循环。'
      })
    );
    const root = section({ title: '模式', eyebrow: 'MODE' }, rawToggle.root, raw);
    return { root, raw, rawLoop, rawRate, rawActual, toggle: rawToggle };
  }

  private buildMotionSection(): {
    root: HTMLElement;
    lateral: SliderHandle;
    refresh: SliderHandle;
    normal: HTMLElement;
  } {
    const cfg = this.cfg;
    const refresh = slider({
      label: '刷新率',
      min: 0,
      max: 100,
      step: 0.5,
      value: cfg.display.refreshHz,
      unit: 'Hz',
      hint: '0 = 自动：在模型力用 60% 内取最快循环。',
      onInput: (value) => {
        cfg.display.refreshHz = value;
      },
      onChange: (value) => {
        cfg.display.refreshHz = value;
        this.host.saveConfig();
        this.schedulePlan();
      }
    });
    const lateral = slider({
      label: '横向陷阱强度',
      min: 5,
      max: 3000,
      step: 1,
      value: lateralAccelOf(cfg),
      unit: 'm/s²',
      hint: '255 级时测得的横向加速度；Spin 标定会自动写入。',
      onInput: (value) => {
        setLateralAccel(cfg, value);
      },
      onChange: () => {
        this.host.saveConfig();
        this.schedulePlan();
      }
    });
    const smoothing = slider({
      label: 'jerk 平滑窗口',
      min: 0,
      max: 30,
      step: 0.5,
      value: cfg.planner.jerkTimeMs,
      unit: 'ms',
      onInput: (value) => {
        cfg.planner.jerkTimeMs = value;
      },
      onChange: () => {
        this.host.saveConfig();
        this.schedulePlan();
      }
    });
    const corner = slider({
      label: '拐角圆角',
      min: 0,
      max: 6,
      step: 0.1,
      value: cfg.planner.cornerRadiusMm,
      unit: 'mm',
      onInput: (value) => {
        cfg.planner.cornerRadiusMm = value === 0 ? 0.01 : value;
      },
      onChange: () => {
        this.host.saveConfig();
        this.schedulePlan();
      }
    });
    const interpolation = segmented(
      [
        { value: 'catmull', label: 'Catmull-Rom' },
        { value: 'linear', label: '线性' }
      ],
      cfg.planner.interpolation,
      (value) => {
        cfg.planner.interpolation = value;
        this.host.saveConfig();
      },
      'seg-wide'
    );
    const normal = el(
      'div',
      { class: 'normal-motion' },
      refresh.root,
      lateral.root,
      smoothing.root,
      corner.root,
      interpolation.root,
      el('p', { class: 'section-note', text: '规划器做时间最优速度、抗共振滤波与前馈；仿真只给提示，不限制播放。' })
    );
    const root = section({ title: '运动与预览', eyebrow: 'MOTION' }, normal);
    return { root, lateral, refresh, normal };
  }

  private createMetrics(): MetricBar {
    if (this.cfg.unlimited.enabled) {
      return new MetricBar(must('displayMetrics'), [
        { key: 'period', label: '一圈用时', digits: 0, accent: true },
        { key: 'speed', label: '平均速度', unit: 'mm/s', digits: 3 },
        { key: 'length', label: '路径总长', unit: 'mm', digits: 1 },
        { key: 'loop', label: '基础周期', digits: 0 },
        { key: 'rate', label: '速度倍率', unit: '×', digits: 3 },
        { key: 'points', label: '设备点', unit: 'pts', digits: 0 }
      ]);
    }
    return new MetricBar(must('displayMetrics'), [
      { key: 'refresh', label: '刷新率', unit: 'Hz', digits: 1, accent: true },
      { key: 'speed', label: '峰值速度', unit: 'mm/s', digits: 0 },
      { key: 'accel', label: '峰值加速度', unit: 'm/s²', digits: 0 },
      { key: 'force', label: '力用', unit: '%', digits: 0 },
      { key: 'lead', label: '前馈前导', unit: 'mm', digits: 2 },
      { key: 'points', label: '设备点', unit: 'pts', digits: 0 }
    ]);
  }

  private syncUnlimitedUi(): void {
    const raw = this.cfg.unlimited.enabled;
    this.normalMotion.hidden = raw;
    this.motionRoot.hidden = raw;
    this.rawMotion.hidden = !raw;
    this.unlimitedToggle.setChecked(raw);
    if (this.rawLoop) this.rawLoop.setValue(rawLoopToPos(this.cfg.unlimited.loopMs), true);
    if (this.rawRate) this.rawRate.setValue(rawRateToPos(this.cfg.unlimited.rate), true);
    this.metrics = this.createMetrics();
    must('displayHudEyebrow').textContent = raw ? 'LIGHT PAINTING · RAW TRAJECTORY' : 'LIGHT PAINTING · STANDING WAVE';
    this.updateRawSummary();
  }

  private updateRawSummary(): void {
    if (!this.rawActual) return;
    const effectiveMs =
      this.playing && this.plan?.raw
        ? this.plan.periodS * 1000
        : (this.cfg.unlimited.loopMs / 1000 / Math.max(this.cfg.unlimited.rate, 0.001)) * 1000;
    const lengthMm = this.plan?.raw ? this.plan.metrics.lengthMm : 0;
    const speed = lengthMm > 0 ? lengthMm / (effectiveMs / 1000) : 0;
    clear(this.rawActual);
    this.rawActual.append(
      el('span', { text: '实际一圈 ' }),
      el('strong', { text: formatDuration(effectiveMs) }),
      el('span', { text: ' · 平均 ' }),
      el('strong', { text: speed > 0 ? `${formatNumber(speed, speed < 1 ? 3 : 1)} mm/s` : '—' })
    );
  }

  private async setUnlimited(enabled: boolean): Promise<void> {
    if (enabled === this.cfg.unlimited.enabled) return;
    if (this.playing) await this.stopPlayback();
    this.cfg.unlimited.enabled = enabled;
    this.host.saveConfig();
    this.syncUnlimitedUi();
    this.log.add(enabled ? '已解除限制：使用原始轨迹' : '已恢复速度规划与动力学校验', 'warn');
    this.host.setHint(
      enabled
        ? '原始轨迹模式：无前馈、无速度/加速度规划；播放速度可实时调整'
        : '规划模式：时间最优速度、抗共振滤波与仿真校验'
    );
    await this.replan(true);
  }

  private async applyRawRate(rate: number): Promise<void> {
    try {
      await this.ensureSession().setPlaybackRate(rate);
      const plan = this.plan;
      if (!plan?.raw) return;
      this.updateRawPlanSpeed();
      const m = plan.metrics;
      this.metrics.update({
        period: formatDuration(m.periodMs),
        speed: m.vMaxMmS,
        length: m.lengthMm,
        loop: formatDuration(m.deviceLoopMs),
        rate: m.playbackRate,
        points: plan.points.length
      });
      must('displayPlanSub').textContent =
        `一圈 ${formatDuration(m.periodMs)} · ${plan.points.length} 点 · 平均 ${formatNumber(m.vMaxMmS, m.vMaxMmS < 1 ? 4 : 2)} mm/s`;
      must('planChartNote').textContent = `${formatDuration(m.periodMs)} · ${plan.points.length} pts`;
      this.host.setHint(`原始轨迹 · 一圈 ${formatDuration(m.periodMs)} · 速度倍率 ${m.playbackRate.toFixed(3)}×`);
      this.renderReadout();
      this.drawCharts(this.phase);
    } catch (error) {
      this.fail(error);
    }
  }

  private updateRawPlanSpeed(): void {
    const plan = this.plan;
    if (!plan?.raw) return;
    const periodS = Math.max(plan.periodS, 1e-9);
    const speedMmS = plan.metrics.lengthMm / periodS;
    plan.metrics.periodMs = periodS * 1000;
    plan.metrics.refreshHz = 1 / periodS;
    plan.metrics.vMaxMmS = speedMmS;
    plan.metrics.vLitMeanMmS = speedMmS;
    plan.metrics.playbackRate = plan.playbackRate ?? this.cfg.unlimited.rate;
    plan.speed.fill(speedMmS * 1e-3);
    this.updateRawSummary();
  }

  private buildConfigSection(): HTMLElement {
    const file = el('input', {
      type: 'file',
      accept: 'application/json,.json',
      style: { display: 'none' }
    }) as HTMLInputElement;
    file.addEventListener('change', () => {
      const selected = file.files?.[0];
      if (!selected) return;
      void readConfigFile(selected)
        .then((imported) => {
          saveConfig(imported);
          toast('配置已导入，正在重载…', 'ok');
          window.setTimeout(() => window.location.reload(), 450);
        })
        .catch((error) => this.fail(error));
    });
    const exportButton = button('导出 JSON', {
      icon: 'download',
      onClick: () => downloadConfig(this.cfg)
    });
    const importButton = button('导入 JSON', {
      icon: 'upload',
      onClick: () => file.click()
    });
    const resetButton = button('恢复默认', {
      icon: 'rotate-ccw',
      variant: 'small',
      onClick: () => {
        if (!window.confirm('恢复默认配置并重载？当前参数与会话设置会丢失。')) return;
        clearConfig();
        window.location.reload();
      }
    });
    return section(
      { title: '配置', eyebrow: 'CONFIG' },
      el('div', { class: 'btn-row' }, exportButton, importButton),
      el('div', { class: 'btn-row' }, resetButton),
      file,
      el('p', {
        class: 'section-note',
        text: '配置保存在浏览器 localStorage，可导出备份；也可以直接导入原 Python 程序的 ~/.umh_display.json。'
      })
    );
  }

  private bindHud(): void {
    for (const buttonEl of document.querySelectorAll<HTMLElement>('[data-display-view]')) {
      buttonEl.addEventListener('click', () => {
        const view = buttonEl.dataset.displayView as DisplayView;
        this.applyView(view, true);
      });
    }
    must('displayResetView').addEventListener('click', () => this.scene.resetView());
    must('displayClearLog').addEventListener('click', () => this.log.clear());
    this.refreshSlider.setValue(this.cfg.display.refreshHz);
    this.lateralSlider.setValue(lateralAccelOf(this.cfg));
    this.updateLevelMeter();
  }

  private bindPlayback(): void {
    this.playButton.addEventListener('click', () => void this.togglePlayback());
    must('displaySpeed').addEventListener('change', (event) => {
      this.speed = Number((event.target as HTMLSelectElement).value);
      this.ui.speed = this.speed;
      this.host.saveUiState();
    });
  }

  private syncSpeedSelect(): void {
    const select = must<HTMLSelectElement>('displaySpeed');
    select.value = String(this.speed);
  }

  private selectShape(name: string): void {
    this.selectedShape = name;
    this.ui.displayShape = name;
    this.host.saveUiState();
    this.shapeGridHandle.setActive(name);
    this.syncShapeUi();
    if (name === 'text') {
      this.textField.focus();
      this.textField.select();
    }
    if (this.playing) {
      toast('绘制中：停止后可重新规划', 'info');
      return;
    }
    this.schedulePlan(true);
  }

  private syncShapeUi(): void {
    const isText = this.selectedShape === 'text';
    this.textRow.hidden = !isText;
    this.spanEl.textContent = isText ? 'TEXT' : 'SHAPE';
    this.textField.value = this.cfg.display.text;
  }

  private updateLevelMeter(): void {
    const level = this.cfg.trap.level;
    const power = acousticPower(level);
    this.levelFill.style.width = `${Math.max(2, (level / 255) * 100)}%`;
    this.levelCaption.innerHTML = '';
    this.levelCaption.append(
      el('span', { text: `声功率 ${Math.round(power * 100)}%` }),
      el('span', { text: `duty ${Math.round((level * 128) / 255)}/128` })
    );
  }

  private applyView(view: DisplayView, requestMap: boolean): void {
    this.view = view;
    this.ui.displayView = view;
    this.host.saveUiState();
    for (const buttonEl of document.querySelectorAll<HTMLElement>('[data-display-view]')) {
      buttonEl.classList.toggle('is-active', buttonEl.dataset.displayView === view);
    }
    this.scene.setView(view);
    if (view === 'field' && requestMap) void this.requestField();
  }

  // ------------------------------------------------------------------- plans
  private shapeName(): string {
    return this.selectedShape === 'text' ? `text:${this.cfg.display.text}` : this.selectedShape;
  }

  private schedulePlan(immediate = false): void {
    if (this.playing) return;
    if (this.planning) {
      this.pendingPlan = true;
      return;
    }
    const delay = immediate ? 0 : 240;
    if (this.planTimer !== null) window.clearTimeout(this.planTimer);
    this.planTimer = window.setTimeout(() => {
      this.planTimer = null;
      void this.replan(false);
    }, delay);
  }

  private planTimer: number | null = null;

  async replan(manual: boolean): Promise<Plan | null> {
    if (this.planning) {
      this.pendingPlan = true;
      return this.plan;
    }
    this.planning = true;
    this.pendingPlan = false;
    const seq = ++this.planSeq;
    setLoading(
      this.loading,
      this.loadingText,
      true,
      this.cfg.unlimited.enabled ? '正在生成原始轨迹…' : '正在规划：速度 / 滤波 / 前馈…'
    );
    this.stageError.hidden = true;
    try {
      const plan = await this.client.plan(
        this.cfg,
        this.shapeName(),
        this.devices.current.profile.maxPathPoints
      );
      if (seq !== this.planSeq) return null;
      this.applyPlan(plan);
      if (manual) {
        this.log.add(
          plan.raw
            ? `原始轨迹 ${plan.name}: 一圈 ${formatDuration(plan.metrics.periodMs)} · ${plan.points.length} 点`
            : `规划 ${plan.name}: ${plan.metrics.refreshHz.toFixed(1)} Hz · ${plan.points.length} 点`,
          'ok'
        );
      }
      return plan;
    } catch (error) {
      this.stageError.hidden = false;
      this.stageError.textContent = `规划失败：${error instanceof Error ? error.message : String(error)}`;
      this.log.add(`规划失败：${String(error)}`, 'error');
      return null;
    } finally {
      this.planning = false;
      setLoading(this.loading, this.loadingText, false);
      if (this.pendingPlan) {
        this.pendingPlan = false;
        this.schedulePlan(true);
      }
    }
  }

  private applyPlan(plan: Plan): void {
    this.plan = plan;
    this.phase = 0;
    this.scene.setPlan(plan);
    this.scene.setProgress(0, false);
    const badge = must('displayRefreshBadge');
    if (plan.raw) {
      const m = plan.metrics;
      this.metrics.update({
        period: formatDuration(m.periodMs),
        speed: m.vMaxMmS,
        length: m.lengthMm,
        loop: formatDuration(m.deviceLoopMs),
        rate: m.playbackRate,
        points: plan.points.length
      });
      badge.textContent = '原始轨迹';
      badge.style.borderColor = 'rgba(101,216,231,.42)';
      badge.style.color = '#9be7f0';
      must('displayPlanSub').textContent =
        `一圈 ${formatDuration(m.periodMs)} · ${plan.points.length} 点 · 平均 ${formatNumber(m.vMaxMmS, m.vMaxMmS < 1 ? 4 : 2)} mm/s`;
      must('planChartNote').textContent = `${formatDuration(m.periodMs)} · ${plan.points.length} pts`;
      renderWarnings(
        must('displayWarnings'),
        plan.warnings,
        '原始轨迹：无前馈、无速度/加速度约束、无共振滤波、无仿真校验'
      );
      this.host.setHint(`原始轨迹 · 一圈 ${formatDuration(m.periodMs)} · 速度倍率 ${m.playbackRate.toFixed(3)}×`);
    } else {
      this.metrics.update(
        {
          refresh: plan.metrics.refreshHz,
          speed: plan.metrics.vMaxMmS,
          accel: plan.metrics.aMaxMS2,
          force: plan.metrics.forceUse * 100,
          lead: plan.metrics.leadMaxMm,
          points: plan.points.length
        },
        plan.metrics.forceUse > 0.85 ? ['force'] : [],
        plan.metrics.forceUse > 1 ? ['force'] : []
      );
      badge.textContent = plan.warnings.some((warning) => warning.startsWith('LOST'))
        ? 'LOST'
        : `${plan.metrics.refreshHz.toFixed(1)} Hz`;
      badge.style.borderColor = plan.warnings.some((warning) => warning.startsWith('LOST'))
        ? 'rgba(255,93,108,.5)'
        : '';
      badge.style.color = plan.warnings.some((warning) => warning.startsWith('LOST')) ? '#ff8d96' : '';
      must('displayPlanSub').textContent =
        `周期 ${plan.metrics.periodMs.toFixed(0)} ms · 力用 ${Math.round(plan.metrics.forceUse * 100)}% · ` +
        `形状误差 ${plan.metrics.shapeErrMm.toFixed(2)} mm · 前导 ${plan.metrics.leadMaxMm.toFixed(2)} mm`;
      must('planChartNote').textContent = `${plan.metrics.periodMs.toFixed(0)} ms · ${plan.points.length} pts`;
      renderWarnings(must('displayWarnings'), plan.warnings);
    }
    must('displayPlanTitle').textContent = plan.name.startsWith('text:')
      ? `文字 · ${plan.name.slice(5)}`
      : `${SHAPE_LABELS[plan.name] ?? plan.name}`;
    this.renderPalette(plan);
    this.updateRawSummary();
    this.renderReadout();
    this.drawCharts(0);
    if (this.view === 'field') void this.requestField();
  }

  private renderPalette(plan: Plan): void {
    clear(this.paletteStrip);
    for (const [r, g, b] of plan.palette) {
      this.paletteStrip.append(
        el('span', { style: { background: `rgb(${r},${g},${b})` } })
      );
    }
  }

  // ------------------------------------------------------------------- scene
  private drawCharts(progress: number): void {
    drawSpeedChart(must<HTMLCanvasElement>('speedChart'), this.plan, progress);
    drawPlanChart(must<HTMLCanvasElement>('planChart'), this.plan, progress);
  }

  private async requestField(): Promise<void> {
    const mode = trapModeOf(this.cfg);
    const heightMm = this.plan?.trapModel.heightMm ?? 2.26;
    const key = `${mode}|${heightMm.toFixed(2)}|${this.cfg.trap.tableDistanceMm}|${this.cfg.bead.diameterMm}|${this.cfg.bead.densityKgM3}`;
    const cached = this.fieldCache.get(key);
    if (cached) {
      this.scene.setField(cached);
      this.scene.setView('field');
      return;
    }
    const seq = ++this.fieldSeq;
    setLoading(this.loading, this.loadingText, true, '正在计算桌面上方声场…');
    try {
      const map = await this.client.displayField({
        mode,
        tableDistanceMm: this.cfg.trap.tableDistanceMm,
        focusOffsetMm: this.cfg.trap.focusOffsetMm,
        heightMm,
        extentMm: 60,
        grid: 96,
        bead: { diameterMm: this.cfg.bead.diameterMm, densityKgM3: this.cfg.bead.densityKgM3 }
      });
      if (seq !== this.fieldSeq) return;
      this.fieldCache.set(key, map);
      this.scene.setField(map);
      this.scene.setView('field');
    } catch (error) {
      this.log.add(`声场计算失败：${String(error)}`, 'error');
    } finally {
      if (seq === this.fieldSeq) setLoading(this.loading, this.loadingText, false);
    }
  }

  // ------------------------------------------------------------------ session
  private ensureSession(): Session {
    const state = this.devices.state;
    if (!this.session || this.sessionVersion !== state.version) {
      this.session = new Session(state.device, this.cfg);
      this.sessionVersion = state.version;
    }
    return this.session;
  }

  async levitate(): Promise<void> {
    try {
      const session = this.ensureSession();
      const message = await session.levitate();
      this.cfg.trap.level = session.level;
      this.levelSlider.setValue(session.level);
      this.updateLevelMeter();
      this.host.saveConfig();
      this.log.add(message, 'ok');
      toast(message, 'ok');
      this.renderReadout();
    } catch (error) {
      this.fail(error);
    }
  }

  async dropBead(): Promise<void> {
    this.stopPlaybackLocal();
    try {
      await this.ensureSession().drop();
      this.log.add('声场关闭，小球落下', 'info');
      this.renderReadout();
    } catch (error) {
      this.fail(error);
    }
  }

  async emergencyStop(): Promise<void> {
    this.stopPlaybackLocal();
    try {
      await this.session?.emergencyStop();
      await this.devices.current.clear();
      this.log.add('E-STOP 已发送：立即关场', 'error');
      toast('E-STOP：声场立即关闭', 'error');
    } catch (error) {
      this.fail(error);
    }
  }

  async recolor(): Promise<void> {
    if (this.session?.state === SessionState.Running && this.session.plan) {
      const previous = this.session.plan;
      const plan = await this.client.plan(this.cfg, previous.name, previous.points.length, previous.periodS);
      await this.session.recolor(plan);
      this.applyPlan(plan);
      this.log.add('颜色已实时更新（路径几何不变）', 'ok');
      toast('颜色已实时更新', 'ok');
      return;
    }
    await this.replan(true);
  }

  // ----------------------------------------------------------------- playback
  private async togglePlayback(): Promise<void> {
    if (this.playing) {
      await this.stopPlayback();
      return;
    }
    try {
      const session = this.ensureSession();
      if (session.state === SessionState.Idle) {
        const message = await session.levitate();
        this.log.add(message, 'ok');
        toast('陷阱已打开：确保小球在声场里，再播放', 'info');
      }
      const plan = (await this.replan(false)) ?? this.plan;
      if (!plan) return;
      await session.play(plan);
      this.playing = true;
      this.phase = 0;
      this.lastFrame = performance.now();
      this.lastChart = 0;
      this.setPlayIcon(true);
      this.updatePlayUi();
      this.log.add(
        plan.raw
          ? `开始原始轨迹 ${plan.name}：一圈 ${formatDuration(plan.metrics.periodMs)}`
          : `开始绘制 ${plan.name} @ ${plan.metrics.refreshHz.toFixed(1)} Hz`,
        'ok'
      );
      this.animate();
    } catch (error) {
      this.fail(error);
    }
  }

  async stopPlayback(): Promise<void> {
    this.stopPlaybackLocal();
    try {
      if (this.session?.state === SessionState.Running) {
        await this.session.stopDrawing();
        this.log.add(this.plan?.raw ? '原始轨迹已停止，停在当前位置悬停' : '沿路径减速，停在当前位置悬停', 'info');
      }
      this.updatePlayUi();
      this.renderReadout();
    } catch (error) {
      this.fail(error);
    }
  }

  private stopPlaybackLocal(): void {
    this.playing = false;
    cancelAnimationFrame(this.raf);
    this.phase = 0;
    this.loopFill.style.width = '0%';
    this.clock.textContent = '0.0 ms';
    if (this.plan) this.scene.setProgress(0, false);
    this.setPlayIcon(false);
    this.updatePlayUi();
  }

  private animate = (): void => {
    if (!this.playing || !this.plan) return;
    const now = performance.now();
    const dt = Math.min(0.06, (now - this.lastFrame) / 1000);
    this.lastFrame = now;
    this.phase = (this.phase + (dt * this.speed) / this.plan.periodS) % 1;
    this.scene.setProgress(this.phase, true);
    this.loopFill.style.width = `${this.phase * 100}%`;
    this.clock.textContent = formatDuration(this.phase * this.plan.periodS * 1000);
    if (now - this.lastChart > 120) {
      this.lastChart = now;
      this.drawCharts(this.phase);
    }
    this.raf = requestAnimationFrame(this.animate);
  };

  private setPlayIcon(playing: boolean): void {
    clear(this.playButton);
    this.playButton.append(icon(playing ? 'pause' : 'play', 15));
    mountIcons(this.playButton);
    this.playButton.setAttribute('aria-label', playing ? '暂停绘制' : '播放');
  }

  private updatePlayUi(): void {
    this.playButton.classList.toggle('is-live', this.playing);
    if (!this.stickyPlay) return;
    clear(this.stickyPlay);
    this.stickyPlay.append(icon(this.playing ? 'pause' : 'play', 14), el('span', { text: this.playing ? '暂停' : '播放' }));
    mountIcons(this.stickyPlay);
    this.stickyPlay.classList.toggle('is-live', this.playing);
  }

  // --------------------------------------------------------------------- spin
  private async onSpin(): Promise<void> {
    if (this.spinArmed) {
      this.spinArmed = false;
      this.spinButton.classList.remove('is-armed');
      this.spinButton.querySelector('span')!.textContent = '标定中…';
      this.fell.value = true;
      return;
    }
    const session = this.session;
    if (!session || session.state !== SessionState.Hover) {
      toast('先起浮小球，再做 Spin 标定', 'error');
      return;
    }
    if (!window.confirm('Spin 标定：小球会在 8 mm 圆上越转越快约 15 秒。跳出场或掉下时点「它甩出了！」，程序会反解 255 级的横向陷阱强度。是否开始？')) {
      return;
    }
    this.fell.value = false;
    this.spinArmed = true;
    this.spinButton.classList.add('is-armed');
    this.spinButton.querySelector('span')!.textContent = '它甩出了！';
    this.log.add('Spin 标定开始：8 mm 圆，指数扫频', 'info');
    try {
      const accel = await session.spinTest(this.fell, {
        report: (hz) => this.host.setHint(`Spin 标定：${hz.toFixed(1)} Hz`)
      });
      if (accel === null || !Number.isFinite(accel)) {
        toast('未观察到甩出（或一开始就掉下）：未保存，可调高横向强度后重试', 'error');
        this.log.add('Spin 标定无有效折点', 'warn');
        return;
      }
      setLateralAccel(this.cfg, Math.round(accel));
      this.lateralSlider.setValue(Math.round(accel));
      saveConfig(this.cfg);
      this.log.add(`横向强度 ${accel.toFixed(0)} m/s² @255 已保存`, 'ok');
      toast(`横向强度 ${accel.toFixed(0)} m/s² 已保存，重新规划`, 'ok');
      await this.replan(true);
    } catch (error) {
      this.fail(error);
    } finally {
      this.spinArmed = false;
      this.spinButton.classList.remove('is-armed');
      this.spinButton.querySelector('span')!.textContent = 'Spin 标定';
    }
  }

  private readonly fell = { value: false };

  // ------------------------------------------------------------------- status
  private async pollStatus(): Promise<void> {
    if (!this.session || this.pollBusy) return;
    this.pollBusy = true;
    try {
      const status = await this.session.dev.motionStatus();
      this.lastStatus = status;
      this.renderReadout();
      if (this.visible) {
        this.host.setHint(
          `${this.plan?.raw ? '原始轨迹' : '规划'} · ${status.stateName} · ` +
            `(${(status.xUm / 1000).toFixed(2)}, ${(status.yUm / 1000).toFixed(2)}) mm · ` +
            `${status.fps.toFixed(0)} fps · 服务 ${status.serviceAvgUs}/${status.serviceMaxUs} µs`
        );
      }
    } catch {
      /* the link may be reconnecting; DeviceManager reports it */
    } finally {
      this.pollBusy = false;
    }
  }

  private renderReadout(): void {
    const plan = this.plan;
    const status = this.lastStatus;
    const model = plan?.trapModel;
    const fmt = (value: number | undefined, digits = 1): string =>
      value === undefined || !Number.isFinite(value) ? '—' : formatNumber(value, digits);
    const rows: Parameters<typeof renderReadout>[1] = [];
    if (plan?.raw) {
      const m = plan.metrics;
      rows.push({
        title: '原始轨迹',
        meta: 'NO LIMITS',
        rows: [
          { label: '一圈用时', value: formatDuration(m.periodMs) },
          { label: '基础周期', value: formatDuration(m.deviceLoopMs) },
          { label: '速度倍率', value: `${m.playbackRate.toFixed(3)}×` },
          { label: '平均速度', value: `${fmt(m.vMaxMmS, m.vMaxMmS < 1 ? 4 : 2)} mm/s` },
          { label: '路径总长', value: `${fmt(m.lengthMm, 1)} mm` },
          { label: '点亮长度', value: `${fmt(m.litMm, 1)} mm` },
          { label: '设备点', value: `${m.points}` },
          { label: '路径采样', value: `${m.pathSamples}` },
          { label: '控制器', value: '线性插值 · 循环', state: 'good' }
        ]
      });
    } else if (plan) {
      const m = plan.metrics;
      rows.push({
        title: '规划',
        meta: `${m.refreshHz.toFixed(1)} Hz`,
        rows: [
          { label: '周期', value: `${fmt(m.periodMs, 0)} ms` },
          { label: 'TOPP 周期', value: `${fmt(m.toppPeriodMs, 1)} ms` },
          { label: '路径总长', value: `${fmt(m.lengthMm, 1)} mm` },
          { label: '点亮长度', value: `${fmt(m.litMm, 1)} mm` },
          { label: '峰值速度', value: `${fmt(m.vMaxMmS, 0)} mm/s` },
          { label: '点亮平均速度', value: `${fmt(m.vLitMeanMmS, 0)} mm/s` },
          { label: '峰值加速度', value: `${fmt(m.aMaxMS2, 0)} m/s²` },
          { label: '峰值 jerk', value: `${fmt(m.jerkMaxMS3 / 1000, 1)} k m/s³` },
          { label: '模型力用', value: `${fmt(m.forceUse * 100, 0)}%`, state: m.forceUse > 1 ? 'bad' : m.forceUse > 0.85 ? 'warn' : 'good' },
          { label: '最大前导', value: `${fmt(m.leadMaxMm, 2)} mm` },
          { label: '离轴力保留', value: `${fmt(m.offaxisForceMin * 100, 0)}%` },
          { label: '参考误差', value: `${fmt(m.refErrMm, 3)} mm` }
        ]
      });
      rows.push({
        title: '仿真验证',
        meta: `±${(this.cfg.planner.robustForceError * 100).toFixed(0)}% 力`,
        rows: [
          { label: '跟踪误差 max', value: `${fmt(m.trackErrMm, 2)} mm` },
          { label: '跟踪误差 RMS', value: `${fmt(m.trackRmsMm, 2)} mm` },
          { label: '形状误差', value: `${fmt(m.shapeErrMm, 2)} mm`, state: m.shapeErrMm > this.cfg.planner.maxTrackingErrorMm ? 'warn' : 'good' },
          { label: '形状误差 (worst)', value: `${fmt(m.shapeErrWorstMm, 2)} mm` },
          { label: '稳态偏移', value: `${fmt(m.offsetSteadyMm, 2)} mm` },
          { label: '逃逸半径', value: `${fmt(m.offsetLimitMm, 1)} mm` },
          { label: '设备重构误差', value: `${fmt(m.reconErrMm, 3)} mm`, state: m.reconErrMm > 0.15 ? 'warn' : 'good' },
          { label: '每帧步长', value: `${fmt(m.frameStepMm, 3)} mm` },
          { label: '每帧相位步长', value: `${fmt(m.phaseStepDeg, 2)}°` }
        ]
      });
    }
    if (model) {
      rows.push({
        title: '陷阱模型',
        meta: plan?.name,
        rows: [
          { label: '小球质量', value: `${fmt(model.mass * 1e6, 3)} mg` },
          { label: '峰值力', value: `${fmt(model.fMax * 1e6, 1)} µN` },
          { label: '力峰偏移 d_pk', value: `${fmt(model.dPk * 1e3, 2)} mm` },
          { label: '逃逸半径', value: `${fmt(model.basin * 1e3, 1)} mm` },
          { label: '离轴尺度 r0', value: `${fmt(model.offaxisR0 * 1e3, 1)} mm` },
          { label: '固有频率', value: `${fmt(Math.sqrt((model.fMax * Math.PI) / (2 * model.dPk) / model.mass) / (2 * Math.PI), 1)} Hz` },
          { label: '悬停高度', value: `${fmt(model.heightMm, 2)} mm` }
        ]
      });
    }
    rows.push({
      title: '设备与链路',
      meta: this.devices.state.label,
      rows: status
        ? [
            { label: '状态', value: status.stateName, state: status.running ? 'good' : 'dim' },
            { label: '陷阱位置', value: `${(status.xUm / 1000).toFixed(2)}, ${(status.yUm / 1000).toFixed(2)} mm` },
            { label: '输出帧率', value: `${status.fps.toFixed(0)} fps` },
            { label: '路径点', value: `${status.pathPoints}` },
            { label: '循环', value: `${status.loopMs} ms` },
            { label: '服务耗时', value: `${status.serviceAvgUs}/${status.serviceMaxUs} µs` },
            { label: '丢帧 / 错误', value: `${status.missedDeadlines} / ${status.frameErrors}` },
            { label: '链路', value: this.devices.isDemo ? '演示（无硬件）' : this.devices.state.label, state: this.devices.isDemo ? 'dim' : 'good' }
          ]
        : [
            { label: '状态', value: '未连接/未起浮', state: 'dim' },
            { label: '链路', value: this.devices.isDemo ? '演示（无硬件）' : this.devices.state.label }
          ]
    });
    renderReadout(must('displayReadout'), rows);
  }

  // ------------------------------------------------------------------ plumbing
  private fail(error: unknown): void {
    const message = error instanceof Error ? error.message : String(error);
    this.log.add(message, 'error');
    toast(message, 'error', 4200);
    this.host.setHint(message);
  }

  onDeviceChanged(): void {
    const state: LinkState = this.devices.state;
    if (state.version === this.lastDeviceVersion) return;
    this.lastDeviceVersion = state.version;
    this.session = null;
    this.sessionVersion = -1;
    this.lastStatus = null;
    this.stopPlaybackLocal();
    this.log.add(
      this.devices.isDemo
        ? `硬件已断开或未连接：使用演示设备（${state.error || '演示模式'}）`
        : `已连接 ${state.label} · ${state.device.profile.firmware}`,
      this.devices.isDemo ? 'warn' : 'ok'
    );
    this.pollStatusSoon();
    void this.replan(false);
  }

  private pollStatusSoon(): void {
    window.setTimeout(() => void this.pollStatus(), 150);
  }

  activate(): void {
    this.visible = true;
    this.scene.setVisible(true);
    this.scene.resize();
    this.drawCharts(this.phase);
  }

  deactivate(): void {
    this.visible = false;
    this.stopPlaybackLocal();
    this.scene.setVisible(false);
    const session = this.session;
    if (session && session.state !== SessionState.Idle) {
      session
        .drop()
        .then(() => this.log.add('工作区隐藏：光绘声场已关闭', 'info'))
        .catch(() => undefined);
    }
  }

  async start(): Promise<void> {
    this.lastDeviceVersion = this.devices.state.version;
    await this.replan(false);
    this.drawCharts(0);
    this.updatePlayUi();
  }

  isFieldActive(): boolean {
    return this.playing || (this.session !== null && this.session.state !== SessionState.Idle);
  }

  setFpsListener(): void {
    this.scene.onStats = (fps) => this.host.setFps(fps);
  }

  dispose(): void {
    window.clearInterval(this.pollTimer);
    this.resizeObserver.disconnect();
    cancelAnimationFrame(this.raf);
    this.scene.dispose();
    void this.session?.emergencyStop();
  }
}



