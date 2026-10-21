/**
 * Demo hardware: the same DeviceLike surface as a real controller, with a
 * synthetic profile and motion status.  It lets the whole UI,
 * planning pipeline and playback work without a UMH board connected.
 */
import { ELEMENT_FACE_Z_MM, ELEMENT_XY_MM } from '../geometry/elements.ts';
import {
  CAP_MOTION_DISPLAY,
  CAP_MOTION_LONG_PATH,
  MotionConfig,
  MotionPoint,
  MODE_PATH,
  SYS_FPGA_READY,
  SYS_LEVITATION,
  type MotionStatus,
  type Profile
} from './protocol.ts';
import type { DeviceLike } from './types.ts';

function demoProfile(): Profile {
  return {
    model: 'UMH-84 demo',
    firmware: '7.4.0-demo',
    channelCount: ELEMENT_XY_MM.length,
    carrierHz: 40000,
    soundSpeedUmS: 343000000,
    capabilityFlags: CAP_MOTION_DISPLAY | CAP_MOTION_LONG_PATH,
    coordinatesUm: ELEMENT_XY_MM.map(([x, y]) => [Math.round(x * 1000), Math.round(y * 1000), ELEMENT_FACE_Z_MM * 1000] as [number, number, number]),
    hasDisplay: true,
    maxPathPoints: 1024
  };
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

  async systemFlags(): Promise<number> {
    let flags = SYS_FPGA_READY;
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

  async close(): Promise<void> {
    this.running = false;
    this.hover = false;
  }
}

