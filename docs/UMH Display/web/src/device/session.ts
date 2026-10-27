/**
 * Bead-safe sequencing of device commands.
 * Port of ``umh_display/device/session.py`` with promises instead of threads.
 */
import { clamp } from '../core/math.ts';
import {
  FLAG_DIRECT,
  FLAG_LINEAR,
  FLAG_LOOP,
  FLAG_RGB,
  FLAG_ULM,
  HOLO_FLAG_GAMMA,
  HOLO_FLAG_HOLD_LAST,
  HologramConfig,
  MODE_LIVE,
  MODE_PATH,
  MotionConfig,
  MotionPoint,
  SYS_PLAYING,
  ULM_AXIS_RING,
  ULM_AXIS_X,
  ULM_AXIS_Y,
  ULM_SAWTOOTH,
  type HologramKeyframe,
  type MotionStatus
} from './protocol.ts';
import type { DeviceLike } from './types.ts';
import type { AppConfig } from '../config/types.ts';
import { focusZmmOf, trapModeOf } from '../config/defaults.ts';
import { drawLevel, type Plan } from '../motion/planner.ts';
import { spinFoldAccel, spinFoldHz, trapModelFromConfig } from '../physics/trap.ts';

export enum SessionState {
  Idle = 'idle',
  Hover = 'hover',
  Running = 'running',
  Hologram = 'hologram'
}

export class SessionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'SessionError';
  }
}

export interface FellState {
  value: boolean;
}

const sleep = (ms: number): Promise<void> => new Promise((resolve) => window.setTimeout(resolve, ms));

export const SPIN_RADIUS_MM = 8.0;
const SPIN_START = 0.4;
const SPIN_TOP = 2.2;
const SPIN_SETTLE_S = 1.0;
const SPIN_SWEEP_S = 15.0;
const SPIN_TICK_S = 0.05;
const SPIN_REACTION_S = 0.3;

export class Session {
  state = SessionState.Idle;
  plan: Plan | null = null;
  level: number;
  hoverLevel: number;
  hoverXUm: number;
  hoverYUm: number;
  readonly abort = { value: false };
  private runSince = 0;
  playbackRate = 1;

  constructor(
    readonly dev: DeviceLike,
    readonly cfg: AppConfig
  ) {
    if (!dev.profile.hasDisplay) {
      throw new SessionError(
        `firmware ${dev.profile.firmware} lacks the MOTION_DISPLAY extension (v7.3+); flash the UMH Controller build first`
      );
    }
    this.level = cfg.trap.level;
    this.hoverLevel = this.level;
    this.hoverXUm = cfg.display.centerXMm * 1000;
    this.hoverYUm = cfg.display.centerYMm * 1000;
  }

  private liveConfig(palette?: Array<[number, number, number]>): MotionConfig {
    const pc = this.cfg.planner;
    return new MotionConfig({
      mode: MODE_LIVE,
      flags: FLAG_RGB | this.ulmFlags(),
      outputRateHz: pc.outputRateHz,
      maxSpeedMmS: Math.trunc(pc.seekSpeedMmS),
      maxAccelMmS2: Math.trunc(pc.seekAccelMmS2),
      level: this.level,
      ...this.patternFields(),
      ...this.ulmFields(),
      palette: palette ?? [[255, 255, 255]]
    });
  }

  /** trap_mode plus the pattern radius / vortex span the firmware expects. */
  private patternFields(): { trapMode: number; trapRadiusUm: number; trapPhaseSpan: number } {
    const trap = this.cfg.trap;
    return {
      trapMode: trapModeOf(this.cfg),
      trapRadiusUm: Math.round(trap.patternRadiusMm * 1000),
      trapPhaseSpan: Math.round(trap.phaseSpan)
    };
  }

  private ulmFlags(): number {
    return this.cfg.ulm.enabled ? FLAG_ULM : 0;
  }

  private ulmFields(): {
    ulmFrequencyHz: number;
    ulmAmplitudeUm: number;
    ulmWaveSpeedMmS: number;
    ulmAxis: number;
  } {
    const ulm = this.cfg.ulm;
    if (!ulm.enabled) {
      return { ulmFrequencyHz: 0, ulmAmplitudeUm: 0, ulmWaveSpeedMmS: 0, ulmAxis: 0 };
    }
    const axis = ulm.axis === 'x' ? ULM_AXIS_X : ulm.axis === 'y' ? ULM_AXIS_Y : ULM_AXIS_RING;
    return {
      ulmFrequencyHz: Math.round(ulm.frequencyHz),
      ulmAmplitudeUm: Math.max(0, Math.round(ulm.amplitudeUm)),
      ulmWaveSpeedMmS: Math.max(0, Math.round(ulm.waveSpeedMmS)),
      ulmAxis: axis | (ulm.sawtooth ? ULM_SAWTOOTH : 0)
    };
  }

  private hoverPoint(xUm: number, yUm: number): MotionPoint {
    const brightness = Math.round(255 * this.cfg.display.hoverBrightness ** this.cfg.display.gamma);
    return new MotionPoint(xUm, yUm, focusZmmOf(this.cfg) * 1000, brightness, 0);
  }

  async levitate(): Promise<string> {
    this.abort.value = false;
    let status = await this.dev.motionStatus();
    const flags = await this.dev.systemFlags();
    if ((flags & SYS_PLAYING) !== 0 && !status.running) {
      throw new SessionError('设备正在执行其他输出（块流 / 全息 / 枪模式），请先在设备上停止');
    }
    if (status.running) {
      if (status.trapMode !== trapModeOf(this.cfg)) {
        throw new SessionError(
          `motion trap_mode ${status.trapMode} is running (we want ${trapModeOf(this.cfg)}); stop it first`
        );
      }
      await this.dev.rate(0, this.cfg.planner.rampMs);
      await sleep(this.cfg.planner.rampMs + 50);
      status = await this.dev.motionStatus();
      if (status.outputRateHz === 50) this.level = status.level;
      await this.dev.configure(this.liveConfig());
      await this.dev.target(this.hoverPoint(status.xUm, status.yUm));
      this.hoverXUm = status.xUm;
      this.hoverYUm = status.yUm;
      this.state = SessionState.Hover;
      return `已接管悬浮小球，陷阱强度 ${this.level}`;
    }
    await this.dev.configure(this.liveConfig());
    await this.dev.target(this.hoverPoint(this.hoverXUm, this.hoverYUm));
    await this.dev.start();
    this.state = SessionState.Hover;
    return `陷阱已打开（强度 ${this.level}）：请把小球放进声场`;
  }

  async setLevel(level: number): Promise<void> {
    this.level = Math.max(1, Math.min(255, Math.round(level)));
    if (this.state !== SessionState.Running) this.hoverLevel = this.level;
    if (this.state === SessionState.Hover) await this.dev.configure(this.liveConfig());
  }

  /** Direct live target for the unrestricted mode (no path/plan). */
  async liveTarget(xMm: number, yMm: number, level = this.level): Promise<void> {
    if (this.state === SessionState.Idle) throw new SessionError('levitate the bead first');
    if (this.state === SessionState.Running) await this.stopDrawing();
    this.hoverXUm = xMm * 1000;
    this.hoverYUm = yMm * 1000;
    await this.dev.target(new MotionPoint(this.hoverXUm, this.hoverYUm, focusZmmOf(this.cfg) * 1000, level, 0));
  }

  async moveHover(xMm: number, yMm: number): Promise<void> {
    if (this.state !== SessionState.Hover) throw new SessionError('hover moves need a hovering bead');
    this.hoverXUm = xMm * 1000;
    this.hoverYUm = yMm * 1000;
    await this.dev.target(this.hoverPoint(this.hoverXUm, this.hoverYUm));
  }

  private async waitAt(xUm: number, yUm: number, timeoutS: number, tolUm = 30): Promise<void> {
    const deadline = performance.now() + timeoutS * 1000;
    let still = 0;
    while (performance.now() < deadline) {
      if (this.abort.value) throw new SessionError('aborted');
      const status: MotionStatus = await this.dev.motionStatus();
      if (Math.hypot(status.xUm - xUm, status.yUm - yUm) < tolUm) {
        still++;
        if (still >= 3) {
          await sleep(150);
          return;
        }
      } else {
        still = 0;
      }
      await sleep(25);
    }
    throw new SessionError('seek timed out');
  }

  private pathConfig(plan: Plan, rateInitial: number, rateTarget: number, rampMs: number): MotionConfig {
    let flags = FLAG_DIRECT | FLAG_LOOP | FLAG_RGB;
    if (plan.raw || this.cfg.planner.interpolation === 'linear') flags |= FLAG_LINEAR;
    flags |= this.ulmFlags();
    const loopS = plan.deviceLoopS ?? plan.periodS;
    const rawRate = plan.playbackRate ?? 1;
    return new MotionConfig({
      mode: MODE_PATH,
      flags,
      outputRateHz: plan.rateHz,
      loopMs: Math.max(1, Math.min(60000, Math.round(loopS * 1000))),
      maxSpeedMmS: plan.raw ? 10000 : undefined,
      maxAccelMmS2: plan.raw ? 65535 : undefined,
      level: this.level,
      ...this.patternFields(),
      ...this.ulmFields(),
      palette: plan.palette,
      paletteSpinX10: plan.paletteSpinX10,
      rateInitial: plan.raw ? rawRate : rateInitial,
      rateTarget: plan.raw ? rawRate : rateTarget,
      rateRampMs: plan.raw ? 0 : rampMs
    });
  }

  /** Re-send CONFIG for whatever program is running (pattern, ULM, level). */
  async applyOutputConfig(): Promise<void> {
    if (this.state === SessionState.Hover) await this.dev.configure(this.liveConfig());
    else if (this.state === SessionState.Running && this.plan) {
      await this.dev.configure(this.pathConfig(this.plan, 1, 1, 0));
    }
  }

  /* ------------------------------------------------------------ holograms */

  /** Upload keyframes, configure and take over the output in one go. */
  async holoStart(frames: HologramKeyframe[], config: HologramConfig): Promise<void> {
    if (!this.dev.hasHologram) {
      throw new SessionError('当前设备固件没有全息关键帧引擎（capability bit11）');
    }
    if (frames.length === 0) throw new SessionError('全息模式至少需要一张关键帧');
    this.abort.value = true;
    await this.dev.holoUpload(frames);
    config.keyframes = frames.length;
    await this.dev.holoConfigure(config);
    await this.dev.holoStart();
    this.state = SessionState.Hologram;
  }

  /** Re-send CONFIG for a running morph (rate, level, transition, loop). */
  async holoUpdate(config: HologramConfig): Promise<void> {
    if (this.state !== SessionState.Hologram) return;
    await this.dev.holoConfigure(config);
  }

  async holoStop(): Promise<void> {
    if (this.state !== SessionState.Hologram) return;
    await this.dev.holoStop();
    this.state = SessionState.Idle;
  }

  /** Hologram CONFIG built from the persisted panel state. */
  holoConfig(frames: number): HologramConfig {
    const holo = this.cfg.holo;
    return new HologramConfig({
      flags:
        (holo.holdLast ? HOLO_FLAG_HOLD_LAST : 0) | (holo.gamma ? HOLO_FLAG_GAMMA : 0),
      outputRateHz: holo.outputRateHz,
      loopMs: holo.loopMs,
      transitionMs: holo.transitionMs,
      level: holo.level,
      keyframes: frames
    });
  }

  /** Change the raw-trajectory rate live; the firmware divides the loop rate. */
  async setPlaybackRate(rate: number): Promise<number> {
    if (!this.plan?.raw) throw new SessionError('playback rate is only adjustable in raw mode');
    if (this.state !== SessionState.Running) throw new SessionError('nothing is running');
    const factor = Math.max(0.001, Math.min(1, rate));
    await this.dev.rate(factor, 0);
    this.playbackRate = factor;
    this.plan.playbackRate = factor;
    this.plan.periodS = (this.plan.deviceLoopS ?? this.plan.periodS) / factor;
    return this.plan.periodS;
  }

  async play(plan: Plan): Promise<void> {
    if (this.state === SessionState.Running) await this.stopDrawing();
    if (this.state !== SessionState.Hover) throw new SessionError('levitate the bead first');
    this.abort.value = false;
    await this.dev.upload(plan.points);
    const start = plan.points[0];
    const distance = Math.hypot(start.xUm - this.hoverXUm, start.yUm - this.hoverYUm);
    await this.dev.target(this.hoverPoint(start.xUm, start.yUm));
    await this.waitAt(start.xUm, start.yUm, 3 + distance * 1e-3 / this.cfg.planner.seekSpeedMmS);
    this.hoverXUm = start.xUm;
    this.hoverYUm = start.yUm;
    this.hoverLevel = this.level;
    this.level = plan.level;
    this.playbackRate = plan.playbackRate ?? 1;
    await this.dev.configure(this.pathConfig(plan, 0, 1, plan.rampMs));
    this.plan = plan;
    this.runSince = performance.now() / 1000;
    this.state = SessionState.Running;
  }

  async stopDrawing(): Promise<void> {
    if (this.state !== SessionState.Running) return;
    const ramp = this.plan?.raw ? 0 : this.cfg.planner.rampMs;
    await this.dev.rate(0, ramp);
    await sleep(ramp + 80);
    const status = await this.dev.motionStatus();
    await this.dev.target(this.hoverPoint(status.xUm, status.yUm));
    this.level = this.hoverLevel;
    await this.dev.configure(this.liveConfig());
    this.hoverXUm = status.xUm;
    this.hoverYUm = status.yUm;
    this.state = SessionState.Hover;
  }

  async recolor(plan: Plan): Promise<void> {
    if (this.state !== SessionState.Running || !this.plan) throw new SessionError('nothing is running');
    const same =
      plan.points.length === this.plan.points.length &&
      Math.abs(plan.periodS - this.plan.periodS) < 1e-6 &&
      plan.points.every(
        (point, i) =>
          Math.abs(point.xUm - this.plan!.points[i].xUm) < 10 &&
          Math.abs(point.yUm - this.plan!.points[i].yUm) < 10
      );
    if (!same) throw new SessionError('geometry changed: stop and play the new plan instead');
    const wait = (this.plan?.raw ? 0 : this.cfg.planner.rampMs) - (performance.now() / 1000 - this.runSince) * 1000;
    if (wait > 0) await sleep(wait);
    await this.dev.upload(plan.points, true);
    await this.dev.configure(this.pathConfig(plan, 1, 1, 0));
    this.plan = plan;
  }

  async drop(): Promise<void> {
    await this.dev.stop();
    this.state = SessionState.Idle;
  }

  async emergencyStop(): Promise<void> {
    this.abort.value = true;
    await this.dev.clear();
    this.state = SessionState.Idle;
  }

  /** Lower the trap level in steps while hovering until `fell` is set. */
  async dropTest(fell: FellState, floor = 16, step = 2, dwellS = 0.8, report?: (level: number) => void): Promise<number | null> {
    if (this.state !== SessionState.Hover) throw new SessionError('hover the bead first');
    const start = this.level;
    let level = start;
    while (level > floor && !fell.value && !this.abort.value) {
      level -= step;
      await this.setLevel(level);
      report?.(level);
      const end = performance.now() + dwellS * 1000;
      while (performance.now() < end && !fell.value) await sleep(20);
    }
    if (!fell.value) {
      await this.setLevel(start);
      return null;
    }
    await this.drop();
    this.level = start;
    return Math.min(start, level + 2 * step);
  }

  /**
   * Measure the lateral trap strength: spin the bead on a circle, faster and
   * faster, until `fell` is set (it flies out or drops).
   */
  async spinTest(
    fell: FellState,
    options: {
      radiusMm?: number;
      sweepS?: number;
      report?: (hz: number) => void;
    } = {}
  ): Promise<number | null> {
    if (this.state !== SessionState.Hover) throw new SessionError('hover the bead first');
    const radiusMm = options.radiusMm ?? SPIN_RADIUS_MM;
    const sweepS = options.sweepS ?? SPIN_SWEEP_S;
    const cfg = this.cfg;
    const pc = cfg.planner;
    const level = drawLevel(cfg);
    const model = trapModelFromConfig(cfg, level);
    const radius = radiusMm * 1e-3;
    const fModel = spinFoldHz(model, radius);
    const loopMs = Math.max(5, Math.round(1000 / (SPIN_TOP * fModel)));
    const fTop = 1000 / loopMs;
    const r0 = Math.min((SPIN_START * fModel) / fTop, 0.5);
    const n = Math.min(256, this.dev.profile.maxPathPoints);
    const cx = cfg.display.centerXMm * 1000;
    const cy = cfg.display.centerYMm * 1000;
    const points: MotionPoint[] = [];
    for (let i = 0; i < n; i++) {
      const angle = (2 * Math.PI * i) / n;
      points.push(this.hoverPoint(cx + radiusMm * 1000 * Math.cos(angle), cy + radiusMm * 1000 * Math.sin(angle)));
    }
    this.abort.value = false;
    await this.dev.upload(points);
    const first = points[0];
    const distance = Math.hypot(first.xUm - this.hoverXUm, first.yUm - this.hoverYUm);
    await this.dev.target(this.hoverPoint(first.xUm, first.yUm));
    await this.waitAt(first.xUm, first.yUm, 3 + distance * 1e-3 / pc.seekSpeedMmS);
    this.hoverXUm = first.xUm;
    this.hoverYUm = first.yUm;
    this.hoverLevel = this.level;
    this.level = level;
    await this.dev.configure(
      new MotionConfig({
        mode: MODE_PATH,
        flags: FLAG_DIRECT | FLAG_LOOP | FLAG_RGB,
        outputRateHz: pc.outputRateHz,
        loopMs,
        level,
        trapMode: trapModeOf(cfg),
        palette: [[255, 255, 255]],
        rateInitial: 0,
        rateTarget: r0,
        rateRampMs: Math.trunc(SPIN_SETTLE_S * 1000)
      })
    );
    this.plan = null;
    this.runSince = performance.now() / 1000;
    this.state = SessionState.Running;

    const tau = sweepS / Math.log(1 / r0);
    const log: Array<[number, number]> = [[0, 0]];
    const t0 = performance.now();
    while (!fell.value && !this.abort.value) {
      const t = (performance.now() - t0) / 1000;
      let rate: number;
      if (t < SPIN_SETTLE_S) {
        const u = t / SPIN_SETTLE_S;
        rate = r0 * u * u * (3 - 2 * u);
      } else {
        rate = Math.min(r0 * Math.exp((t - SPIN_SETTLE_S) / tau), 1);
        await this.dev.rate(rate, Math.trunc(SPIN_TICK_S * 1000));
      }
      log.push([t, rate]);
      options.report?.(rate * fTop);
      if (rate >= 1 && t > SPIN_SETTLE_S + sweepS + 1) break;
      await sleep(SPIN_TICK_S * 1000);
    }
    if (this.abort.value) throw new SessionError('aborted');
    if (!fell.value) {
      await this.stopDrawing();
      return null;
    }
    const tFold = Math.max(0, (performance.now() - t0) / 1000 - SPIN_REACTION_S);
    let rFold = 0;
    for (let i = log.length - 1; i >= 0; i--) {
      if (log[i][0] <= tFold) {
        rFold = log[i][1];
        break;
      }
    }
    await this.drop();
    this.level = this.hoverLevel;
    if (rFold * fTop < 0.2 * fModel) return null;
    return spinFoldAccel(model, rFold * fTop, radius, level);
  }
}

export const clampLevel = (level: number): number => clamp(level, 1, 255);
