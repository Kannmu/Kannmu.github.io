/**
 * Demo hardware: the same DeviceLike surface as a real controller, with a
 * synthetic profile and motion status.  It lets the whole UI,
 * planning pipeline and playback work without a UMH board connected.
 *
 * Since v7.5 the controller can also hold a small set of full 84-channel
 * holograms and morph between them on its own clock; this class keeps the same
 * contract so the hologram panel and its preview work offline too.
 */
import { ELEMENT_FACE_Z_MM, ELEMENT_XY_MM } from '../geometry/elements.ts';
import {
  CAP_FOCUSED_AM,
  CAP_HOLOGRAM,
  CAP_MOTION,
  CAP_MOTION_DISPLAY,
  CAP_MOTION_LONG_PATH,
  HOLO_FLAG_RUNNING,
  HologramConfig,
  MotionConfig,
  MotionPoint,
  MODE_PATH,
  SYS_CONNECTED,
  SYS_FPGA_READY,
  SYS_PLAYING,
  TRAP_VORTEX,
  type HologramKeyframe,
  type HologramStatus,
  type MotionStatus,
  type Profile
} from './protocol.ts';
import type { DeviceLike } from './types.ts';

function demoProfile(): Profile {
  const capabilityFlags =
    CAP_FOCUSED_AM | CAP_MOTION | CAP_HOLOGRAM | CAP_MOTION_DISPLAY | CAP_MOTION_LONG_PATH;
  return {
    model: 'UMH-84 demo',
    firmware: '7.5.1-demo',
    channelCount: ELEMENT_XY_MM.length,
    carrierHz: 40000,
    soundSpeedUmS: 343000000,
    capabilityFlags,
    coordinatesUm: ELEMENT_XY_MM.map(([x, y]) => [Math.round(x * 1000), Math.round(y * 1000), ELEMENT_FACE_Z_MM * 1000] as [number, number, number]),
    hasDisplay: true,
    hasMotion: true,
    hasHologram: true,
    hasFocusAm: true,
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
  readonly hasHologram = true;
  private points: MotionPoint[] = [];
  private config = new MotionConfig({ trapMode: TRAP_VORTEX });
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

  private holo: HologramKeyframe[] = [];
  private holoConfig = new HologramConfig({ keyframes: 1, transitionMs: 3000 });
  private holoRunning = false;
  private holoStopping = false;
  private holoStartedAt = 0;
  private holoFrames = 0;
  private holoSkipped = 0;
  private holoState: 'off' | 'ready' | 'running' | 'stopping' = 'off';

  async systemFlags(): Promise<number> {
    let flags = SYS_CONNECTED | SYS_FPGA_READY;
    if (this.hover || this.running || this.holoRunning || this.holoStopping) flags |= SYS_PLAYING;
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
      fps: this.config.outputRateHz,
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
    this.holoRunning = false;
    this.holoStopping = false;
    if (this.holoState !== 'off') this.holoState = 'ready';
  }

  async close(): Promise<void> {
    this.running = false;
    this.hover = false;
    this.holoRunning = false;
  }

  /* -------------------------------------------------------------- hologram */

  async holoUpload(frames: HologramKeyframe[], firstIndex = 0): Promise<void> {
    frames.forEach((frame, i) => {
      const slot = firstIndex + i;
      if (slot >= 10) throw new Error('演示设备全息帧槽只有 10 个');
      this.holo[slot] = {
        phase: Uint8Array.from(frame.phase),
        level: Uint8Array.from(frame.level)
      };
    });
    if (this.holoState === 'off') this.holoState = 'ready';
  }

  async holoConfigure(config: HologramConfig): Promise<void> {
    this.holoConfig = config;
    if (this.holoState === 'off') this.holoState = 'ready';
  }

  async holoStart(): Promise<void> {
    if (this.holo.length === 0) throw new Error('演示设备还没有全息关键帧');
    this.holoRunning = true;
    this.holoStopping = false;
    this.holoState = 'running';
    this.holoStartedAt = performance.now();
    this.holoFrames = 0;
    this.holoSkipped = 0;
    /* START takes the output away from the motion engine, exactly like the
     * firmware hand-over. */
    this.running = false;
    this.hover = false;
  }

  async holoStop(): Promise<void> {
    if (!this.holoRunning) return;
    this.holoRunning = false;
    this.holoStopping = true;
    this.holoState = 'stopping';
    setTimeout(() => {
      this.holoStopping = false;
      this.holoState = 'ready';
    }, 40);
  }

  async holoStatus(): Promise<HologramStatus> {
    const count = Math.max(1, Math.min(10, this.holoConfig.keyframes || this.holo.length || 1));
    const transitionMs = Math.max(1, this.holoConfig.transitionMs);
    const loopMs = this.holoConfig.loopMs | 0;
    const segmentCount = count;
    const periodUs = loopMs > 0 ? loopMs * 1000 : segmentCount * transitionMs * 1000;
    let current = 0;
    let alpha = 0;
    let frames = this.holoFrames;
    if (this.holoState === 'running') {
      const elapsedUs = (performance.now() - this.holoStartedAt) * 1000;
      const cycle = loopMs > 0 ? periodUs : segmentCount * transitionMs * 1000;
      const within = elapsedUs % Math.max(1, cycle);
      const segmentUs = Math.max(1, transitionMs * 1000);
      current = Math.min(count - 1, Math.floor(within / segmentUs));
      alpha = Math.min(1, (within - current * segmentUs) / segmentUs);
      frames = Math.floor(elapsedUs / (1e6 / Math.max(1, this.holoConfig.outputRateHz)));
      const staticFrames = count > 1 ? 0 : Math.floor(frames / 2);
      this.holoSkipped = staticFrames;
    }
    const state = this.holoState === 'off' ? 0 : this.holoState === 'ready' ? 1 : this.holoState === 'running' ? 2 : 3;
    return {
      state,
      flags: this.holoConfig.flags | (this.holoState === 'running' ? HOLO_FLAG_RUNNING : 0) | (count === 1 ? 8 : 0),
      outputRateHz: this.holoConfig.outputRateHz,
      keyframeCount: count,
      currentKeyframe: current,
      alpha,
      serviceMaxUs: 48,
      serviceAvgUs: 24,
      renderMaxUs: 6,
      renderAvgUs: 3,
      submitMaxUs: 11,
      submitAvgUs: 5,
      frames,
      skipped: this.holoSkipped,
      missedDeadlines: 0,
      frameErrors: 0,
      fps: this.holoState === 'running' ? this.holoConfig.outputRateHz : 0,
      stateName: state === 0 ? 'OFF' : state === 1 ? 'READY' : state === 2 ? 'RUNNING' : 'STOPPING',
      running: this.holoState === 'running' || this.holoStopping
    };
  }
}
