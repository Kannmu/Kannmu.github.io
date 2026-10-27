/** The down-firing display page: controls, plan pipeline, 3D view, playback. */
import { clear, el, formatNumber, icon } from '../core/dom.ts';
import { formatDuration } from '../core/math.ts';
import type { AppConfig } from '../config/types.ts';
import { acousticPower } from '../physics/trap.ts';
import { FIELD_LABELS, FIELDS, lateralAccelOf, setLateralAccel, trapModeOf } from '../config/defaults.ts';
import { clearConfig, downloadConfig, readConfigFile, saveConfig } from '../config/store.ts';
import { SHAPES } from '../shapes/library.ts';
import type { Plan } from '../motion/planner.ts';
import { LiveController, type LiveSample } from '../realtime/liveController.ts';
import { Session, SessionState } from '../device/session.ts';
import {
  HOLOGRAM_MAX_KEYFRAMES,
  HOLOGRAM_MAX_RATE_HZ,
  HOLOGRAM_MIN_RATE_HZ,
  SYS_RECORDING,
  SYS_TRIGGER,
  SYS_USB_AUDIO,
  type HologramKeyframe,
  type HologramStatus,
  type MotionStatus
} from '../device/protocol.ts';
import { hologramFieldMap, interpolateKeyframes, shapeKeyframe } from '../motion/hologram.ts';
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
  private readonly cxSlider: SliderHandle;
  private readonly cySlider: SliderHandle;
  private liveLevel = 255;
  private liveSpeedNow = 0;
  private realtime = false;
  private autoLevitated = false;
  private liveSending = false;
  private livePending = false;
  private liveSaveTimer = 0;
  private liveHudAt = 0;
  private readonly live = new LiveController(
    () => ({ speedMmS: this.cfg.unlimited.speedMmS, accelMmS2: this.cfg.unlimited.accelMmS2 }),
    (sample) => this.onLiveMove(sample),
    35
  );
  private readonly normalMotion: HTMLElement;
  private readonly motionRoot: HTMLElement;
  private readonly rawMotion: HTMLElement;
  private readonly liveX: SliderHandle;
  private readonly liveY: SliderHandle;
  private readonly liveSpeed: SliderHandle;
  private readonly liveAccel: SliderHandle;
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
  private patternSeg: ReturnType<typeof segmented<string>> | null = null;
  private patternRadiusSlider: SliderHandle | null = null;
  private patternSpanSlider: SliderHandle | null = null;
  private patternCaption: HTMLElement | null = null;
  private holoStatusEl: HTMLElement | null = null;
  private holoListEl: HTMLElement | null = null;
  private holoFrames: HologramKeyframe[] = [];
  private lastHolo: HologramStatus | null = null;
  private holoPreviewAt = 0;
  private lastFlags = 0;

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
    const holo = this.buildHoloSection();
    const ulm = this.buildUlmSection();
    const config = this.buildConfigSection();
    must('displayControls').append(mode.root, trap.root, shape.root, colour.root, motion.root, holo, ulm, config);
    mountIcons(must('displayControls'));

    this.levelSlider = trap.level;
    this.lateralSlider = motion.lateral;
    this.refreshSlider = motion.refresh;
    this.cxSlider = shape.cx;
    this.cySlider = shape.cy;
    this.normalMotion = motion.normal;
    this.motionRoot = motion.root;
    this.rawMotion = mode.raw;
    this.liveX = mode.liveX;
    this.liveY = mode.liveY;
    this.liveSpeed = mode.liveSpeed;
    this.liveAccel = mode.liveAccel;
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
    this.syncPatternUi();
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
        if (this.cfg.unlimited.enabled) {
          this.liveLevel = levelValue;
          this.livePending = true;
          void this.flushLiveTarget();
          this.updateLiveUi();
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
    /* The six patterns motion_rebuild_pattern() synthesises on the MCU.  The
     * firmware rejects 6 and above with -4, so the picker is the enum, not a
     * free-form field name. */
    const pattern = segmented<string>(
      Object.keys(FIELDS).map((key) => ({
        value: key,
        label: FIELD_LABELS[key] ?? key,
        title: `${FIELD_LABELS[key] ?? key} · trap_mode ${FIELDS[key]}`
      })),
      cfg.trap.field,
      (value) => {
        cfg.trap.field = value as AppConfig['trap']['field'];
        this.host.saveConfig();
        this.syncPatternUi();
        this.schedulePlan(true);
        void this.applyOutputConfig();
      },
      'segmented-wrap'
    );
    const patternCaption = el('p', { class: 'section-note' });
    const radius = slider({
      label: '图案半径',
      min: 0.5,
      max: 20,
      step: 0.1,
      value: cfg.trap.patternRadiusMm,
      unit: 'mm',
      hint: '环形 / 涡旋 / 双环的中心半径，双焦的间距；固件下限 0.5 mm。',
      onInput: (value) => {
        cfg.trap.patternRadiusMm = value;
      },
      onChange: () => {
        this.host.saveConfig();
        this.schedulePlan(true);
        void this.applyOutputConfig();
      }
    });
    const span = slider({
      label: '涡旋相位跨度',
      min: 0,
      max: 255,
      step: 1,
      value: cfg.trap.phaseSpan,
      unit: '/256',
      hint: '0 = 一整圈；只在涡旋（mode 4）下有效。',
      onInput: (value) => {
        cfg.trap.phaseSpan = Math.round(value);
      },
      onChange: () => {
        this.host.saveConfig();
        this.schedulePlan(true);
        void this.applyOutputConfig();
      }
    });
    this.patternSeg = pattern;
    this.patternRadiusSlider = radius;
    this.patternSpanSlider = span;
    this.patternCaption = patternCaption;
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
        actions: el('span', { class: 'eyebrow', text: 'MOTION v7.5' })
      },
      pattern.root,
      patternCaption,
      radius.root,
      span.root,
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
    cx: SliderHandle;
    cy: SliderHandle;
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
        if (cfg.unlimited.enabled) this.applyLiveCenter();
      },
      onChange: () => {
        this.host.saveConfig();
        if (!cfg.unlimited.enabled) this.schedulePlan();
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
        if (cfg.unlimited.enabled) this.applyLiveCenter();
      },
      onChange: () => {
        this.host.saveConfig();
        if (!cfg.unlimited.enabled) this.schedulePlan();
      }
    });
    cx.root.classList.add('center-duplicate');
    cy.root.classList.add('center-duplicate');
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
    return { root, grid, textRow, textField, span, cx, cy };
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
    liveX: SliderHandle;
    liveY: SliderHandle;
    liveSpeed: SliderHandle;
    liveAccel: SliderHandle;
    rawActual: HTMLElement;
    toggle: ToggleHandle;
  } {
    const cfg = this.cfg;
    const rawToggle = toggle({
      label: '解除所有限制',
      checked: cfg.unlimited.enabled,
      hint: '开启后自动起浮，中心 X/Y、手柄左摇杆与 WASD 直接实时下发，不走规划和播放。',
      onChange: (checked) => void this.setUnlimited(checked).catch((error) => this.fail(error))
    });
    rawToggle.input.id = 'unlimitedToggle';
    const rawActual = el('div', { class: 'raw-summary' });
    const liveX = slider({
      label: '中心 X',
      min: -35,
      max: 35,
      step: 0.1,
      value: cfg.display.centerXMm,
      unit: 'mm',
      onInput: (value) => {
        cfg.display.centerXMm = value;
        this.applyLiveCenter();
      },
      onChange: () => this.host.saveConfig()
    });
    liveX.input.id = 'liveX';
    const liveY = slider({
      label: '中心 Y',
      min: -35,
      max: 35,
      step: 0.1,
      value: cfg.display.centerYMm,
      unit: 'mm',
      onInput: (value) => {
        cfg.display.centerYMm = value;
        this.applyLiveCenter();
      },
      onChange: () => this.host.saveConfig()
    });
    liveY.input.id = 'liveY';
    const liveSpeed = slider({
      label: '移动速度',
      min: 0.01,
      max: 50,
      step: 0.01,
      value: cfg.unlimited.speedMmS,
      unit: 'mm/s',
      hint: '手柄左摇杆 / WASD 的目标速度；可播放中实时改。',
      onInput: (value) => {
        cfg.unlimited.speedMmS = value;
        this.updateRawSummary();
      },
      onChange: () => {
        this.host.saveConfig();
        this.updateRawSummary();
        if (this.realtime) this.updateLiveUi();
      }
    });
    liveSpeed.input.id = 'liveSpeed';
    const liveAccel = slider({
      label: '加速度',
      min: 0.1,
      max: 500,
      step: 0.1,
      value: cfg.unlimited.accelMmS2,
      unit: 'mm/s²',
      hint: '速度向目标值逼近的加速度；越小越柔和。',
      onInput: (value) => {
        cfg.unlimited.accelMmS2 = value;
        this.updateRawSummary();
      },
      onChange: () => {
        this.host.saveConfig();
        this.updateRawSummary();
        if (this.realtime) this.updateLiveUi();
      }
    });
    liveAccel.input.id = 'liveAccel';
    const raw = el(
      'div',
      { class: 'raw-group' },
      liveX.root,
      liveY.root,
      liveSpeed.root,
      liveAccel.root,
      rawActual,
      el('p', {
        class: 'section-note',
        text: '开启即自动打开声场：修改中心 X/Y 会立即下发；Xbox 左摇杆或 WASD 以设定的速度/加速度连续移动。不生成路径、不需要规划或播放。'
      })
    );
    const root = section({ title: '模式', eyebrow: 'MODE' }, rawToggle.root, raw);
    return { root, raw, liveX, liveY, liveSpeed, liveAccel, rawActual, toggle: rawToggle };
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

  /** Keep the trap-pattern controls in step with the chosen firmware mode. */
  private syncPatternUi(): void {
    const mode = trapModeOf(this.cfg);
    this.patternSeg?.setValue(this.cfg.trap.field);
    /* Span only means something for the orbital ring; radius is meaningless
     * for a plain single focus, so both are disabled instead of silently
     * ignored. */
    this.patternSpanSlider?.setDisabled(mode !== 4);
    this.patternRadiusSlider?.setDisabled(mode === 0);
    if (this.patternCaption) {
      const label = FIELD_LABELS[this.cfg.trap.field] ?? this.cfg.trap.field;
      const span = this.cfg.trap.phaseSpan === 0 ? '整圈' : `${this.cfg.trap.phaseSpan}/256`;
      this.patternCaption.textContent =
        mode === 0
          ? `${label} · 固件 trap_mode 0（无图案偏移）`
          : `${label} · 固件 trap_mode ${mode} · 半径 ${this.cfg.trap.patternRadiusMm.toFixed(1)} mm · 跨度 ${span}`;
    }
  }

  /** Push a pattern / radius / ULM edit into whatever program is running. */
  private async applyOutputConfig(): Promise<void> {
    if (!this.session) return;
    try {
      await this.session.applyOutputConfig();
    } catch (error) {
      this.log.add(`声场参数下发失败：${String(error)}`, 'warn');
    }
  }

  /* --------------------------------------------------------- hologram morph */

  private buildHoloSection(): HTMLElement {
    const cfg = this.cfg;
    const status = el('p', { class: 'section-note' });
    this.holoStatusEl = status;
    const list = el('div', { class: 'holo-list' });
    this.holoListEl = list;

    const picker = el('select', { class: 'mini-select holo-picker', attrs: { 'aria-label': '添加全息关键帧' } }) as HTMLSelectElement;
    for (const name of [...Object.keys(SHAPES), 'text']) {
      const option = document.createElement('option');
      option.value = name;
      option.textContent = SHAPE_LABELS[name] ?? name;
      picker.append(option);
    }
    const add = button('添加关键帧', {
      variant: 'small',
      onClick: () => {
        if (cfg.holo.shapes.length >= HOLOGRAM_MAX_KEYFRAMES) {
          toast(`两次上传之间最多 ${HOLOGRAM_MAX_KEYFRAMES} 帧`, 'info');
          return;
        }
        cfg.holo.shapes = [...cfg.holo.shapes, picker.value];
        this.host.saveConfig();
        this.renderHoloList();
        this.holoFrames = [];
      }
    });
    const reset = button('清空', {
      variant: 'small',
      onClick: () => {
        cfg.holo.shapes = [];
        this.host.saveConfig();
        this.renderHoloList();
        this.holoFrames = [];
      }
    });

    const transition = slider({
      label: '形变时间',
      min: 50,
      max: 10000,
      step: 50,
      value: cfg.holo.transitionMs,
      unit: 'ms',
      hint: '相邻关键帧之间在设备端插值的时长。',
      onInput: (value) => {
        cfg.holo.transitionMs = Math.round(value);
      },
      onChange: () => {
        this.host.saveConfig();
        void this.applyHoloConfig();
      }
    });
    const rate = slider({
      label: '全息帧率',
      min: HOLOGRAM_MIN_RATE_HZ,
      max: HOLOGRAM_MAX_RATE_HZ,
      step: 10,
      value: cfg.holo.outputRateHz,
      unit: 'Hz',
      onInput: (value) => {
        cfg.holo.outputRateHz = Math.round(value);
      },
      onChange: () => {
        this.host.saveConfig();
        void this.applyHoloConfig();
      }
    });
    const level = slider({
      label: '全息幅度',
      min: 0,
      max: 128,
      step: 1,
      value: cfg.holo.level,
      unit: '/128',
      hint: '线性幅度：128 就是 50% 占空比的满幅度。',
      onInput: (value) => {
        cfg.holo.level = Math.round(value);
      },
      onChange: () => {
        this.host.saveConfig();
        void this.applyHoloConfig();
      }
    });
    const loop = slider({
      label: '循环周期',
      min: 0,
      max: 20000,
      step: 100,
      value: cfg.holo.loopMs,
      unit: 'ms',
      hint: '0 = 由帧数 × 形变时间推导。',
      onInput: (value) => {
        cfg.holo.loopMs = Math.round(value);
      },
      onChange: () => {
        this.host.saveConfig();
        void this.applyHoloConfig();
      }
    });
    const holdLast = toggle({
      label: '停在最后一帧',
      checked: cfg.holo.holdLast,
      hint: '关闭则回卷到第 0 帧继续循环。',
      onChange: (checked) => {
        cfg.holo.holdLast = checked;
        this.host.saveConfig();
        void this.applyHoloConfig();
      }
    });
    const gamma = toggle({
      label: '幅度 γ 校正',
      checked: cfg.holo.gamma,
      hint: '把线性幅度经 sin(π·l/256) 反查成占空比，低声压更细腻。',
      onChange: (checked) => {
        cfg.holo.gamma = checked;
        this.host.saveConfig();
        void this.applyHoloConfig();
      }
    });

    const start = button('上传并开始', {
      icon: 'layers',
      variant: 'primary',
      block: true,
      onClick: () => void this.holoRun()
    });
    const preview = button('场图预览', { icon: 'waves', onClick: () => void this.holoPreviewNow() });
    const stop = button('停止形变', { icon: 'square', onClick: () => void this.holoHalt() });

    this.renderHoloList();
    this.updateHoloStatus();
    return section(
      { title: '全息变形', eyebrow: 'HOLOGRAM', actions: el('span', { class: 'eyebrow', text: '0xA0..0xA5' }) },
      el('p', {
        class: 'section-note',
        text: '把多个图形上传成 84 路相位关键帧，由设备端按自己的帧时钟插值 —— USB 抖动不会让声场跳变。'
      }),
      el('p', {
        class: 'section-note',
        text: '40 kHz 在 100 mm 处的焦斑约 20 mm：比这更小的图形会糊成一团。想看清晰的形变，先把「图形尺寸」调到 30 mm 以上。'
      }),
      list,
      el('div', { class: 'inline-row' }, picker, add, reset),
      transition.root,
      rate.root,
      level.root,
      loop.root,
      holdLast.root,
      gamma.root,
      el('div', { class: 'btn-row' }, start),
      el('div', { class: 'btn-row' }, preview, stop),
      status
    );
  }

  private renderHoloList(): void {
    const list = this.holoListEl;
    if (!list) return;
    clear(list);
    const shapes = this.cfg.holo.shapes;
    if (shapes.length === 0) {
      list.append(el('p', { class: 'section-note', text: '还没有关键帧：先添加至少一帧。' }));
      return;
    }
    shapes.forEach((name, index) => {
      const chip = el(
        'span',
        { class: 'holo-chip' },
        el('b', { text: String(index) }),
        el('span', { text: SHAPE_LABELS[name] ?? name }),
        el('button', {
          type: 'button',
          class: 'chip-x',
          text: '×',
          title: `移除第 ${index} 帧`,
          attrs: { 'aria-label': `移除第 ${index} 帧` }
        })
      );
      chip.querySelector('button')?.addEventListener('click', () => {
        this.cfg.holo.shapes = this.cfg.holo.shapes.filter((_, i) => i !== index);
        this.host.saveConfig();
        this.renderHoloList();
        this.holoFrames = [];
      });
      list.append(chip);
    });
  }

  private updateHoloStatus(): void {
    const el0 = this.holoStatusEl;
    if (!el0) return;
    const status = this.lastHolo;
    if (!status) {
      el0.textContent = this.devices.current.profile.hasHologram
        ? '全息引擎待命（capability bit11 已就绪）。'
        : '当前固件没有全息引擎：请烧录 v7.5+ 固件。';
      return;
    }
    const key = `${status.stateName} · 第 ${status.currentKeyframe + 1}/${status.keyframeCount} 帧 · α ${(status.alpha * 100).toFixed(0)}% · ${status.fps.toFixed(0)} fps · 服务 ${status.serviceAvgUs}/${status.serviceMaxUs} µs · 丢帧 ${status.missedDeadlines}`;
    el0.textContent = key;
  }

  private async applyHoloConfig(): Promise<void> {
    if (!this.session || this.session.state !== SessionState.Hologram) return;
    try {
      await this.session.holoUpdate(this.session.holoConfig(this.holoFrames.length || this.cfg.holo.shapes.length));
    } catch (error) {
      this.log.add(`全息配置下发失败：${String(error)}`, 'warn');
    }
  }

  private holoFrameList(): HologramKeyframe[] {
    return this.cfg.holo.shapes.map((name) => shapeKeyframe(this.cfg, name, { samples: 56 }).frame);
  }

  private async holoRun(): Promise<void> {
    try {
      if (!this.devices.current.hasHologram) {
        toast('当前设备固件没有全息关键帧引擎', 'error');
        return;
      }
      if (this.cfg.holo.shapes.length === 0) {
        toast('先添加至少一个关键帧', 'info');
        return;
      }
      this.stopPlaybackLocal();
      const session = this.ensureSession();
      this.holoFrames = this.holoFrameList();
      await session.holoStart(this.holoFrames, session.holoConfig(this.holoFrames.length));
      this.lastHolo = await this.devices.current.holoStatus();
      this.updateHoloStatus();
      this.log.add(
        `全息形变接管输出：${this.holoFrames.length} 帧 × ${this.cfg.holo.transitionMs} ms`,
        'ok'
      );
      toast('全息形变已开始', 'ok');
      void this.holoPreviewNow();
    } catch (error) {
      this.fail(error);
    }
  }

  private async holoHalt(): Promise<void> {
    try {
      await this.ensureSession().holoStop();
      this.lastHolo = await this.devices.current.holoStatus().catch(() => null);
      this.updateHoloStatus();
      this.log.add('全息形变已停止', 'info');
    } catch (error) {
      this.fail(error);
    }
  }

  /** Field map of the frame the device is showing right now. */
  private async holoPreviewNow(): Promise<void> {
    if (this.holoFrames.length === 0) this.holoFrames = this.holoFrameList();
    if (this.holoFrames.length === 0) {
      toast('先添加关键帧再预览', 'info');
      return;
    }
    if (this.view !== 'field') this.applyView('field', false);
    this.holoPreviewAt = 0;
    await this.holoPreviewFrame();
  }

  /* ------------------------------------------------------------------- ULM */

  private buildUlmSection(): HTMLElement {
    const cfg = this.cfg;
    const enabled = toggle({
      label: 'ULM 触觉调制',
      checked: cfg.ulm.enabled,
      hint: '焦点在路径上宏观移动的同时以触觉频率横向振荡（固件 flag bit7）。',
      onChange: (checked) => {
        cfg.ulm.enabled = checked;
        this.host.saveConfig();
        void this.applyOutputConfig();
      }
    });
    const frequency = slider({
      label: '调制频率',
      min: 1,
      max: 1000,
      step: 1,
      value: cfg.ulm.frequencyHz,
      unit: 'Hz',
      hint: '皮肤最敏感的 100–300 Hz 区间。',
      onInput: (value) => {
        cfg.ulm.frequencyHz = Math.round(value);
      },
      onChange: () => {
        this.host.saveConfig();
        void this.applyOutputConfig();
      }
    });
    const amplitude = slider({
      label: '振幅',
      min: 0,
      max: 50000,
      step: 10,
      value: cfg.ulm.amplitudeUm,
      unit: 'µm',
      hint: '0 = 由波速与频率推导（A = v / 2πf）。',
      onInput: (value) => {
        cfg.ulm.amplitudeUm = Math.round(value);
      },
      onChange: () => {
        this.host.saveConfig();
        void this.applyOutputConfig();
      }
    });
    const speed = slider({
      label: '波速',
      min: 0,
      max: 10000,
      step: 50,
      value: cfg.ulm.waveSpeedMmS,
      unit: 'mm/s',
      hint: '0 = 固件默认 5000 mm/s；只在振幅为 0 时参与推导。',
      onInput: (value) => {
        cfg.ulm.waveSpeedMmS = Math.round(value);
      },
      onChange: () => {
        this.host.saveConfig();
        void this.applyOutputConfig();
      }
    });
    const axis = segmented(
      [
        { value: 'x', label: 'X 轴' },
        { value: 'y', label: 'Y 轴' },
        { value: 'ring', label: '环形' }
      ],
      cfg.ulm.axis,
      (value) => {
        cfg.ulm.axis = value;
        this.host.saveConfig();
        void this.applyOutputConfig();
      }
    );
    const sawtooth = toggle({
      label: '单向锯齿',
      checked: cfg.ulm.sawtooth,
      hint: '锯齿每秒产生一次从 +A 到 −A 的跳变，用于单向扫掠触感。',
      onChange: (checked) => {
        cfg.ulm.sawtooth = checked;
        this.host.saveConfig();
        void this.applyOutputConfig();
      }
    });
    return section(
      { title: '触觉 ULM', eyebrow: 'ULM', actions: el('span', { class: 'eyebrow', text: 'MOTION_CONFIG 69..75' }) },
      enabled.root,
      frequency.root,
      amplitude.root,
      speed.root,
      axis.root,
      sawtooth.root,
      el('p', {
        class: 'section-note',
        text: 'ULM 与光绘路径同时生效：位模式仍按规划播放，焦点在每个输出帧被横向偏移。先低幅度试手感。'
      })
    );
  }

  private createMetrics(): MetricBar {
    if (this.cfg.unlimited.enabled) {
      return new MetricBar(must('displayMetrics'), [
        { key: 'x', label: '中心 X', unit: 'mm', digits: 2, accent: true },
        { key: 'y', label: '中心 Y', unit: 'mm', digits: 2 },
        { key: 'speed', label: '速度', unit: 'mm/s', digits: 2 },
        { key: 'accel', label: '加速度', unit: 'mm/s²', digits: 1 },
        { key: 'level', label: '电平', unit: '/255', digits: 0 },
        { key: 'mode', label: '输出', digits: 0 }
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
    this.liveX.setValue(this.cfg.display.centerXMm, true);
    this.liveY.setValue(this.cfg.display.centerYMm, true);
    this.liveSpeed.setValue(this.cfg.unlimited.speedMmS, true);
    this.liveAccel.setValue(this.cfg.unlimited.accelMmS2, true);
    this.metrics = this.createMetrics();
    must('displayHudEyebrow').textContent = raw ? 'LIGHT PAINTING · LIVE TARGET' : 'LIGHT PAINTING · STANDING WAVE';
    this.updateRawSummary();
  }

  private updateRawSummary(): void {
    if (!this.rawActual) return;
    const live = this.realtime ? this.live.position : { xMm: this.cfg.display.centerXMm, yMm: this.cfg.display.centerYMm };
    clear(this.rawActual);
    this.rawActual.append(
      el('span', { text: '实时目标 ' }),
      el('strong', { text: `X ${formatNumber(live.xMm, 2)} / Y ${formatNumber(live.yMm, 2)} mm` }),
      el('span', { text: ` · ${formatNumber(this.cfg.unlimited.speedMmS, 2)} mm/s · ` }),
      el('strong', { text: `${formatNumber(this.cfg.unlimited.accelMmS2, 1)} mm/s²` })
    );
  }

  private async setUnlimited(enabled: boolean): Promise<void> {
    if (enabled === this.cfg.unlimited.enabled) return;
    if (this.playing) await this.stopPlayback();
    if (enabled) {
      this.cfg.unlimited.enabled = true;
      this.host.saveConfig();
      this.syncUnlimitedUi();
      this.log.add('已解除限制：实时 XY 输出', 'warn');
      const ok = await this.startRealtime();
      if (!ok) {
        this.cfg.unlimited.enabled = false;
        this.host.saveConfig();
        this.syncUnlimitedUi();
        await this.replan(true);
      }
      return;
    }
    this.cfg.unlimited.enabled = false;
    this.host.saveConfig();
    await this.stopRealtime();
    this.syncUnlimitedUi();
    this.log.add('已恢复速度规划与动力学校验', 'warn');
    this.host.setHint('规划模式：时间最优速度、抗共振滤波与仿真校验');
    await this.replan(true);
  }

  private async startRealtime(): Promise<boolean> {
    if (this.realtime) return true;
    this.plan = null;
    this.scene.setPlan(null);
    this.scene.setLiveTarget(0, 0, false);
    this.drawCharts(0);
    try {
      const session = this.ensureSession();
      if (session.state === SessionState.Running) await session.stopDrawing();
      if (session.state === SessionState.Idle) {
        const message = await session.levitate();
        this.autoLevitated = true;
        this.log.add(message, 'ok');
      }
      this.liveLevel = Math.max(1, Math.min(255, Math.round(this.cfg.trap.level)));
      await session.setLevel(this.liveLevel);
      const x = this.cfg.display.centerXMm;
      const y = this.cfg.display.centerYMm;
      this.realtime = true;
      document.body.classList.add('is-realtime');
      this.live.start(x, y);
      this.scene.setLiveTarget(x, y, true);
      this.livePending = true;
      void this.flushLiveTarget();
      this.updateLiveUi(true);
      this.log.add(`实时输出已启动：X ${x.toFixed(2)} / Y ${y.toFixed(2)} mm`, 'ok');
      toast('实时输出：左摇杆 / WASD 移动，中心 X/Y 直接下发', 'ok', 3500);
      return true;
    } catch (error) {
      this.realtime = false;
      this.live.stop();
      document.body.classList.remove('is-realtime');
      this.scene.setLiveTarget(0, 0, false);
      if (this.autoLevitated && this.session && this.session.state !== SessionState.Idle) {
        await this.session.drop().catch(() => undefined);
        this.autoLevitated = false;
      }
      this.fail(error);
      return false;
    }
  }

  private async stopRealtime(): Promise<void> {
    if (!this.realtime) return;
    this.realtime = false;
    this.live.stop();
    this.livePending = false;
    window.clearTimeout(this.liveSaveTimer);
    this.liveSaveTimer = 0;
    document.body.classList.remove('is-realtime');
    this.scene.setLiveTarget(0, 0, false);
    this.host.saveConfig();
    const session = this.session;
    if (this.autoLevitated && session && session.state !== SessionState.Idle) {
      await session.drop().catch(() => undefined);
    }
    this.autoLevitated = false;
  }

  private applyLiveCenter(): void {
    const x = this.cfg.display.centerXMm;
    const y = this.cfg.display.centerYMm;
    this.cxSlider.setValue(x, true);
    this.cySlider.setValue(y, true);
    this.liveX.setValue(x, true);
    this.liveY.setValue(y, true);
    this.liveX.setValue(x, true);
    this.liveY.setValue(y, true);
    if (this.realtime) {
      this.live.setPosition(x, y);
      return;
    }
    this.scene.setLiveTarget(x, y, true);
    this.updateRawSummary();
  }

  private onLiveMove(sample: LiveSample): void {
    if (!this.realtime) return;
    const x = Math.max(-35, Math.min(35, sample.xMm));
    const y = Math.max(-35, Math.min(35, sample.yMm));
    this.cfg.display.centerXMm = x;
    this.cfg.display.centerYMm = y;
    this.cxSlider.setValue(x, true);
    this.cySlider.setValue(y, true);
    this.liveX.setValue(x, true);
    this.liveY.setValue(y, true);
    this.liveSpeedNow = Math.hypot(sample.vxMmS, sample.vyMmS);
    this.scene.setLiveTarget(x, y, true);
    this.livePending = true;
    void this.flushLiveTarget();
    this.scheduleLiveSave();
    const now = performance.now();
    if (now - this.liveHudAt > 100) {
      this.liveHudAt = now;
      this.updateLiveUi();
    }
  }

  private async flushLiveTarget(): Promise<void> {
    if (this.liveSending || !this.realtime) return;
    const session = this.session;
    if (!session || session.state !== SessionState.Hover) return;
    this.liveSending = true;
    try {
      while (this.livePending && this.realtime) {
        this.livePending = false;
        if (this.session?.state !== SessionState.Hover) break;
        const { xMm, yMm } = this.live.position;
        await session.liveTarget(xMm, yMm, this.liveLevel);
      }
    } catch (error) {
      this.fail(error);
    } finally {
      this.liveSending = false;
    }
  }

  private scheduleLiveSave(): void {
    window.clearTimeout(this.liveSaveTimer);
    this.liveSaveTimer = window.setTimeout(() => {
      this.liveSaveTimer = 0;
      this.host.saveConfig();
    }, 500);
  }

  private updateLiveUi(initial = false): void {
    const { xMm, yMm } = this.live.position;
    const active = this.session?.state === SessionState.Hover;
    this.metrics.update({
      x: xMm,
      y: yMm,
      speed: this.liveSpeedNow,
      accel: this.cfg.unlimited.accelMmS2,
      level: this.liveLevel,
      mode: active ? 'LIVE' : 'IDLE'
    });
    must('displayPlanTitle').textContent = '实时输出';
    const badge = must('displayRefreshBadge');
    badge.textContent = active ? 'LIVE' : 'IDLE';
    badge.style.borderColor = active ? 'rgba(101,216,231,.42)' : 'rgba(255,182,72,.32)';
    badge.style.color = active ? '#9be7f0' : '#ffc46b';
    must('displayPlanSub').textContent =
      `X ${formatNumber(xMm, 2)} · Y ${formatNumber(yMm, 2)} mm · ` +
      `${formatNumber(this.liveSpeedNow, 2)} mm/s · a ${formatNumber(this.cfg.unlimited.accelMmS2, 1)} mm/s²`;
    must('planChartNote').textContent = '实时坐标';
    this.host.setHint(
      `实时输出 · X ${formatNumber(xMm, 2)} / Y ${formatNumber(yMm, 2)} mm · ` +
        `${formatNumber(this.liveSpeedNow, 2)} mm/s`
    );
    if (initial) {
      must('displayHudEyebrow').textContent = 'LIGHT PAINTING · LIVE TARGET';
      renderWarnings(must('displayWarnings'), [], '实时模式：无规划、无播放；中心坐标直接下发设备');
    }
    this.updateRawSummary();
    this.renderReadout();
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
    if (this.cfg.unlimited.enabled || this.playing) return;
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
    if (this.cfg.unlimited.enabled) return null;
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
    const radiusMm = this.cfg.trap.patternRadiusMm;
    const phaseSpan = this.cfg.trap.phaseSpan;
    const key = `${mode}|${radiusMm.toFixed(1)}|${phaseSpan}|${heightMm.toFixed(2)}|${this.cfg.trap.tableDistanceMm}|${this.cfg.bead.diameterMm}|${this.cfg.bead.densityKgM3}`;
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
        radiusMm,
        phaseSpan,
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
      if (this.cfg.unlimited.enabled) {
        this.liveLevel = Math.max(1, Math.min(255, Math.round(session.level)));
        if (!this.realtime) {
          await this.startRealtime();
        } else {
          await session.setLevel(this.liveLevel);
          this.livePending = true;
          void this.flushLiveTarget();
          this.updateLiveUi();
        }
      }
    } catch (error) {
      this.fail(error);
    }
  }

  async dropBead(): Promise<void> {
    this.stopPlaybackLocal();
    try {
      await this.ensureSession().drop();
      this.log.add('声场关闭，小球落下', 'info');
      this.liveSpeedNow = 0;
      if (this.realtime) this.updateLiveUi();
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
      this.liveSpeedNow = 0;
      if (this.realtime) this.updateLiveUi();
    } catch (error) {
      this.fail(error);
    }
  }

  async recolor(): Promise<void> {
    if (this.cfg.unlimited.enabled) {
      toast('实时模式没有路径颜色；关闭限制后再使用实时上色', 'info');
      return;
    }
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
    if (this.cfg.unlimited.enabled) {
      toast('实时模式不需要播放：用中心 X/Y、左摇杆或 WASD 直接移动', 'info');
      return;
    }
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
      this.lastFlags = await this.session.dev.systemFlags().catch(() => this.lastFlags);
      const hologram = this.session.state === SessionState.Hologram;
      if (hologram && this.devices.current.hasHologram) {
        this.lastHolo = await this.devices.current.holoStatus().catch(() => this.lastHolo);
        this.updateHoloStatus();
        if (this.visible && this.view === 'field') void this.holoPreviewFrame();
      } else if (this.lastHolo && !hologram) {
        this.lastHolo = null;
        this.updateHoloStatus();
      }
      this.renderReadout();
      if (this.visible) {
        const trigger = (this.lastFlags & SYS_TRIGGER) !== 0 ? ' · 扳机按下' : '';
        this.host.setHint(
          `${this.realtime ? '实时' : '规划'} · ${status.stateName} · ` +
            `(${(status.xUm / 1000).toFixed(2)}, ${(status.yUm / 1000).toFixed(2)}) mm · ` +
            `${status.fps.toFixed(0)} fps · 服务 ${status.serviceAvgUs}/${status.serviceMaxUs} µs${trigger}`
        );
      }
    } catch {
      /* the link may be reconnecting; DeviceManager reports it */
    } finally {
      this.pollBusy = false;
    }
  }

  /** Cheap in-place refresh of the morph preview while the field view is open. */
  private async holoPreviewFrame(): Promise<void> {
    if (performance.now() - this.holoPreviewAt < 500) return;
    this.holoPreviewAt = performance.now();
    if (this.holoFrames.length === 0) this.holoFrames = this.holoFrameList();
    if (this.holoFrames.length === 0) return;
    const status = this.lastHolo;
    const index = status ? Math.min(status.currentKeyframe, this.holoFrames.length - 1) : 0;
    const next = Math.min(index + 1, this.holoFrames.length - 1);
    const frame = interpolateKeyframes(this.holoFrames[index], this.holoFrames[next], status ? status.alpha : 0);
    /* The keyframes target the configured focus plane, so the preview slice
     * must sit exactly there: height above the table = -focusOffset.  Showing
     * it at the bead height would smear a ring into a filled donut. */
    this.scene.setField(
      hologramFieldMap(frame, {
        heightMm: -this.cfg.trap.focusOffsetMm,
        extentMm: 60,
        grid: 64,
        tableDistanceMm: this.cfg.trap.tableDistanceMm
      })
    );
  }

  private renderReadout(): void {
    const plan = this.plan;
    const status = this.lastStatus;
    const model = plan?.trapModel;
    const fmt = (value: number | undefined, digits = 1): string =>
      value === undefined || !Number.isFinite(value) ? '—' : formatNumber(value, digits);
    const rows: Parameters<typeof renderReadout>[1] = [];
    if (this.realtime) {
      const live = this.live.position;
      rows.push({
        title: '实时输出',
        meta: this.session?.state === SessionState.Hover ? 'LIVE' : 'IDLE',
        rows: [
          { label: '中心 X', value: `${fmt(live.xMm, 2)} mm` },
          { label: '中心 Y', value: `${fmt(live.yMm, 2)} mm` },
          { label: '当前速度', value: `${fmt(this.liveSpeedNow, 2)} mm/s` },
          { label: '加速度', value: `${fmt(this.cfg.unlimited.accelMmS2, 1)} mm/s²` },
          { label: '目标速度', value: `${fmt(this.cfg.unlimited.speedMmS, 2)} mm/s` },
          { label: '电平', value: `${this.liveLevel}/255` },
          { label: '控制器', value: '左摇杆 / WASD · 直接下发', state: 'good' }
        ]
      });
    } else if (plan?.raw) {
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
            { label: '空间合成', value: `${status.renderAvgUs}/${status.renderMaxUs} µs` },
            { label: 'FPGA 帧事务', value: `${status.submitAvgUs}/${status.submitMaxUs} µs` },
            { label: '丢帧 / 错误', value: `${status.missedDeadlines} / ${status.frameErrors}` },
            { label: '链路', value: this.devices.isDemo ? '演示（无硬件）' : this.devices.state.label, state: this.devices.isDemo ? 'dim' : 'good' }
          ]
        : [
            { label: '状态', value: '未连接/未起浮', state: 'dim' },
            { label: '链路', value: this.devices.isDemo ? '演示（无硬件）' : this.devices.state.label }
          ]
    });
    const flags = this.lastFlags;
    rows.push({
      title: '固件能力',
      meta: `${this.devices.current.profile.model} · ${this.devices.current.profile.firmware}`,
      rows: [
        {
          label: '光绘扩展',
          value: this.devices.current.profile.hasDisplay ? 'v7.3 DISPLAY' : '不支持',
          state: this.devices.current.profile.hasDisplay ? 'good' : 'bad'
        },
        {
          label: '长路径 1024',
          value: this.devices.current.profile.maxPathPoints > 255 ? `${this.devices.current.profile.maxPathPoints} 点` : '255 点',
          state: this.devices.current.profile.maxPathPoints > 255 ? 'good' : 'dim'
        },
        {
          label: '全息引擎',
          value: this.devices.current.profile.hasHologram ? 'bit11 HOLOGRAM' : '不支持',
          state: this.devices.current.profile.hasHologram ? 'good' : 'bad'
        },
        {
          label: '超声枪扳机',
          value: (flags & SYS_TRIGGER) !== 0 ? '按下（正在发射）' : '松开',
          state: (flags & SYS_TRIGGER) !== 0 ? 'warn' : 'dim'
        },
        {
          label: '语音 / USB 音频',
          value:
            (flags & SYS_RECORDING) !== 0 ? '录音中' : (flags & SYS_USB_AUDIO) !== 0 ? 'USB 音频' : '空闲',
          state: (flags & (SYS_RECORDING | SYS_USB_AUDIO)) !== 0 ? 'good' : 'dim'
        }
      ]
    });
    if (this.lastHolo) {
      const holo = this.lastHolo;
      rows.push({
        title: '全息引擎',
        meta: holo.stateName,
        rows: [
          { label: '当前帧', value: `${holo.currentKeyframe + 1} / ${holo.keyframeCount}` },
          { label: '段内进度', value: `${(holo.alpha * 100).toFixed(0)} %` },
          { label: '提交帧率', value: `${holo.fps.toFixed(0)} / ${holo.outputRateHz} Hz`, state: holo.fps >= holo.outputRateHz * 0.9 ? 'good' : 'warn' },
          { label: '换算耗时', value: `${holo.serviceAvgUs}/${holo.serviceMaxUs} µs` },
          { label: '提交事务', value: `${holo.submitAvgUs}/${holo.submitMaxUs} µs` },
          { label: '已提交 / 跳过', value: `${holo.frames} / ${holo.skipped}` },
          { label: '丢帧 / 错误', value: `${holo.missedDeadlines} / ${holo.frameErrors}`, state: holo.frameErrors > 0 ? 'bad' : 'good' }
        ]
      });
    }
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
    if (this.cfg.unlimited.enabled) {
      this.realtime = false;
      this.live.stop();
      document.body.classList.remove('is-realtime');
      void this.startRealtime();
    } else {
      void this.replan(false);
    }
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
    if (this.cfg.unlimited.enabled) await this.startRealtime();
    else await this.replan(false);
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
    this.live.stop();
    this.scene.dispose();
    void this.session?.emergencyStop();
  }
}



