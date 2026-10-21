/**
 * Demo hardware: the same DeviceLike surface as a real controller, with a
 * synthetic profile, motion status and calibration.  It lets the whole UI,
 * planning pipeline and playback work without a UMH board connected.
 */
import { ELEMENT_FACE_Z_MM, ELEMENT_XY_MM } from '../geometry/elements.ts';
import {
  CAL_RESULT_SIZE,
  CAP_HOLOGRAM,
  CAP_MOTION_DISPLAY,
  CAP_MOTION_LONG_PATH,
  HologramConfig,
  MotionConfig,
  MotionPoint,
  MODE_PATH,
  SYS_FPGA_READY,
  SYS_CALIBRATION_VALID,
  SYS_LEVITATION,
  parseCalResult,
  type CalResult,
  type HologramStatus,
  type MotionStatus,
  type Profile
} from './protocol.ts';
import type { DeviceLike } from './types.ts';

const sleep = (ms: number): Promise<void> => new Promise((resolve) => window.setTimeout(resolve, ms));

function demoProfile(): Profile {
  return {
    model: 'UMH-84 demo',
    firmware: '7.4.0-demo',
    channelCount: ELEMENT_XY_MM.length,
    carrierHz: 40000,
    soundSpeedUmS: 343000000,
    capabilityFlags: CAP_MOTION_DISPLAY | CAP_MOTION_LONG_PATH | CAP_HOLOGRAM,
    coordinatesUm: ELEMENT_XY_MM.map(([x, y]) => [Math.round(x * 1000), Math.round(y * 1000), ELEMENT_FACE_Z_MM * 1000] as [number, number, number]),
    hasDisplay: true,
    hasHologram: true,
    maxPathPoints: 1024
  };
}

function buildDemoCalBytes(): Uint8Array {
  const body = new Uint8Array(CAL_RESULT_SIZE);
  const view = new DataView(body.buffer);
  for (let i = 0; i < 84; i++) {
    body[i] = (Math.round(6 * Math.sin(i * 0.7) + 3 * Math.cos(i * 0.31)) + 256) & 0xff;
  }
  body[84] = 100; // progress
  body[85] = 4; // good mics
  body[86] = 0; // fault
  body[87] = 0; // quality flags
  body[88] = 5; // OK
  body[91] = 0;
  const f32 = (offset: number, value: number): void => view.setFloat32(offset, value, true);
  f32(95, 4.6); // static RMS
  f32(99, 0.9); // pair sd
  f32(107, 0); // saturated
  f32(111, 0.0948); // table 94.8 mm
  f32(115, 0.12);
  f32(119, -0.08);
  f32(123, 18.4);
  f32(131, 1.8);
  const e = 135;
  f32(e, 3.4);
  f32(e + 4, 0.86);
  f32(e + 8, 1.12);
  view.setUint16(e + 12, 206, true);
  body[e + 14] = 81;
  body[e + 15] = 0;
  body[e + 16] = 2;
  body[e + 17] = 2;
  body[e + 18] = 1;
  body[e + 19] = 2;
  body.fill(128, e + 20, e + 104);
  body.fill(4, e + 104, e + 188);
  return body;
}

function buildDemoEeprom(): Uint8Array {
  const body = new Uint8Array(320);
  for (let i = 0; i < 84; i++) {
    const code = Math.round(18 * Math.sin(i * 0.43) + 8 * Math.cos(i * 0.17));
    // upper byte is the 8-bit correction the renderer uses
    new DataView(body.buffer).setUint16(12 + 2 * i, ((code & 0xff) << 8) >>> 0, true);
  }
  body.fill(250, 12 + 168, 12 + 168 + 84);
  body[291] = 1;
  new DataView(body.buffer).setUint16(297, 47, true);
  return body;
}

function smoothstep(value: number): number {
  const t = Math.max(0, Math.min(1, value));
  return t * t * (3 - 2 * t);
}

export class DemoDevice implements DeviceLike {
  readonly profile = demoProfile();
  readonly label = '演示设备 · UMH-84';
  private points: MotionPoint[] = [];
  private config = new MotionConfig();
  private targetX = 0;
  private targetY = 0;
  private level = 88;
  private running = false;
  private hover = false;
  private pathMode = false;
  private startedAt = 0;
  private phase = 0;
  private loopMs = 1000;
  private rateTarget = 1;
  private rateInitial = 1;
  private rampMs = 0;
  private lastCal: CalResult;
  private holoRunning = false;
  private holoFrames = 0;
  readonly eeprom = buildDemoEeprom();

  constructor() {
    this.lastCal = parseCalResult(buildDemoCalBytes());
    this.lastCal.summary = this.lastCal.summary.replace('and saved', 'and saved · 演示数据');
  }

  async systemFlags(): Promise<number> {
    let flags = SYS_FPGA_READY | SYS_CALIBRATION_VALID;
    if (this.hover || this.running) flags |= SYS_LEVITATION;
    return flags;
  }

  async motionStatus(): Promise<MotionStatus> {
    const now = performance.now();
    let x = this.targetX;
    let y = this.targetY;
    if (this.pathMode && this.running && this.points.length > 0) {
      const elapsed = (now - this.startedAt) / 1000;
      const rampS = this.rampMs / 1000;
      let rate: number;
      if (rampS > 0 && elapsed < rampS) {
        rate = this.rateInitial + (this.rateTarget - this.rateInitial) * smoothstep(elapsed / rampS);
      } else {
        rate = this.rateTarget;
      }
      const period = Math.max(0.005, this.loopMs / 1000);
      this.phase = (this.phase + (rate * 0.001) / period) % 1; // status polls run ~1 kHz equivalent
      const n = this.points.length;
      const pos = this.phase * n;
      const i = Math.floor(pos) % n;
      const j = (i + 1) % n;
      const u = pos - Math.floor(pos);
      x = (this.points[i].xUm * (1 - u) + this.points[j].xUm * u) / 1000;
      y = (this.points[i].yUm * (1 - u) + this.points[j].yUm * u) / 1000;
    }
    const state = this.running ? 2 : this.hover ? 1 : 0;
    return {
      state,
      flags: this.pathMode ? 0x0e : 0x06,
      outputRateHz: this.config.outputRateHz,
      pathPoints: this.points.length,
      loopMs: this.loopMs,
      xUm: Math.round(x * 1000),
      yUm: Math.round(y * 1000),
      zUm: 102000,
      level: this.level,
      trapMode: this.config.trapMode,
      phase: this.phase,
      serviceMaxUs: 42,
      serviceAvgUs: 21,
      renderMaxUs: 61,
      renderAvgUs: 33,
      submitMaxUs: 9,
      submitAvgUs: 4,
      frames: Math.floor(now / 5),
      missedDeadlines: 0,
      frameErrors: 0,
      fps: 2000,
      stateName: this.running ? 'RUNNING' : this.hover ? 'READY' : 'OFF',
      running: this.running
    };
  }

  async eepromCalLevel(): Promise<number | null> {
    return 47;
  }

  async eepromRead(): Promise<Uint8Array> {
    return this.eeprom.slice();
  }

  async calibrationResult(): Promise<CalResult> {
    return this.lastCal;
  }

  async calibrate(progress?: (result: CalResult) => void, timeoutS = 30): Promise<CalResult> {
    void timeoutS;
    const stages: Array<[number, number, string]> = [
      [10, 1, 'WAIT'],
      [25, 2, 'MEASURE'],
      [48, 2, 'MEASURE'],
      [66, 3, 'SOLVE'],
      [82, 4, 'VERIFY'],
      [100, 5, 'OK']
    ];
    for (const [pct, state] of stages) {
      await sleep(550);
      const bytes = buildDemoCalBytes();
      bytes[84] = pct;
      bytes[88] = state;
      this.lastCal = parseCalResult(bytes);
      progress?.(this.lastCal);
    }
    this.lastCal.summary = `${this.lastCal.summary} · 演示数据`;
    return this.lastCal;
  }

  async upload(points: MotionPoint[], keepPhase = false): Promise<void> {
    void keepPhase;
    if (points.length > this.profile.maxPathPoints) throw new Error('演示设备路径点数超限');
    this.points = points.map((p) => new MotionPoint(p.xUm, p.yUm, p.zUm, p.level, p.palette));
    if (this.points.length > 0) {
      this.targetX = this.points[0].xUm / 1000;
      this.targetY = this.points[0].yUm / 1000;
    }
  }

  async configure(config: MotionConfig): Promise<void> {
    this.config = config;
    this.level = config.level;
    this.loopMs = config.loopMs;
    this.rateInitial = config.rateInitial;
    this.rateTarget = config.rateTarget;
    this.rampMs = config.rateRampMs;
    this.pathMode = config.mode === MODE_PATH;
    this.running = this.pathMode;
    this.hover = true;
    this.startedAt = performance.now();
    if (this.pathMode) this.phase = 0;
  }

  async target(point: MotionPoint): Promise<void> {
    this.targetX = point.xUm / 1000;
    this.targetY = point.yUm / 1000;
    this.level = point.level;
  }

  async rate(target: number, rampMs: number): Promise<void> {
    this.rateTarget = target;
    this.rampMs = rampMs;
    this.startedAt = performance.now();
  }

  async start(): Promise<void> {
    this.running = true;
    this.hover = true;
    this.startedAt = performance.now();
    this.phase = 0;
  }

  async stop(): Promise<void> {
    this.running = false;
    this.hover = false;
    this.phase = 0;
  }

  async clear(): Promise<void> {
    this.running = false;
    this.hover = false;
    this.phase = 0;
  }

  async holoUpload(frames: Array<readonly [Uint8Array, Uint8Array]>, firstIndex = 0): Promise<void> {
    void firstIndex;
    this.holoFrames = frames.length;
  }

  async holoConfigure(config: HologramConfig): Promise<void> {
    this.holoFrames = config.keyframes;
  }

  async holoStart(): Promise<void> {
    this.holoRunning = true;
  }

  async holoStop(): Promise<void> {
    this.holoRunning = false;
  }

  async holoStatus(): Promise<HologramStatus> {
    return {
      state: this.holoRunning ? 2 : 0,
      flags: 2,
      outputRateHz: 200,
      keyframes: this.holoFrames,
      currentKeyframe: 0,
      alpha: 0.5,
      serviceMaxUs: 18,
      serviceAvgUs: 9,
      renderMaxUs: 26,
      renderAvgUs: 14,
      submitMaxUs: 5,
      submitAvgUs: 2,
      frames: 999,
      skipped: 0,
      missedDeadlines: 0,
      frameErrors: 0,
      fps: 199.8,
      stateName: this.holoRunning ? 'RUNNING' : 'OFF',
      running: this.holoRunning
    };
  }

  async close(): Promise<void> {
    this.running = false;
    this.hover = false;
    this.holoRunning = false;
  }
}

