/**
 * The gravity-gun loop: bottle hologram on the device, aim on a stick.
 * Port of ``umh_display/gravity_gun/session.py``.
 */
import { FreeSpace, bottlePhase, clampSplit, coreRadius } from '../physics/bottle.ts';
import { HologramDevice } from '../device/holo.ts';
import { HologramConfig, HOLOGRAM_FLAG_HOLD_LAST, SYS_VORTEX_ALT, SYS_VORTEX_STEADY } from '../device/protocol.ts';
import type { DeviceLike } from '../device/types.ts';
import type { AppConfig } from '../config/types.ts';
import { SessionError, SessionState } from '../device/session.ts';

const OUTPUT_RATE_HZ = 200;

const now = (): number => performance.now() / 1000;

export class GravityGunSession {
  state = SessionState.Idle;
  readonly abort = { value: false };
  holo: HologramDevice | null = null;
  readonly space: FreeSpace;
  target: [number, number, number] = [0, 0, 0];
  velocity: [number, number, number] = [0, 0, 0];
  morphErrors = 0;
  readonly trail: Array<[number, number, number]> = [];
  private segFrom: [number, number, number] = [0, 0, 0];
  private segMove: [number, number, number] = [0, 0, 0];
  private segStart = 0;

  constructor(
    readonly dev: DeviceLike,
    readonly cfg: AppConfig
  ) {
    this.space = new FreeSpace(dev.profile.coordinatesUm);
  }

  get gg() {
    return this.cfg.gravityGun;
  }

  get splitMm(): number {
    return clampSplit(this.space, this.gg.splitMm);
  }

  get coreMm(): number {
    return coreRadius(this.splitMm);
  }

  async open(): Promise<void> {
    if (!this.dev.profile.hasHologram) {
      throw new SessionError(
        `firmware ${this.dev.profile.firmware} has no hologram path (capability bit 11 / message 0xA0), which the bottle beam needs`
      );
    }
    this.holo = HologramDevice.open(this.dev);
    try {
      await this.holo.loadCalibration();
    } catch {
      if (this.holo) this.holo.calValid = false;
    }
  }

  frameFor(xMm: number, yMm: number, heightMm: number): [Uint8Array, Uint8Array] {
    if (!this.holo) throw new SessionError('the hologram device is not open');
    const drive = bottlePhase(this.space, xMm, yMm, heightMm, this.splitMm);
    return this.holo.phaseOnlyFrame(drive, this.gg.level, this.gg.phaseSign, this.gg.useCalibration);
  }

  private async segment(here: readonly number[], target: readonly number[], transitionMs: number): Promise<void> {
    if (!this.holo) throw new SessionError('the hologram device is not open');
    await this.holo.morph(
      this.frameFor(here[0], here[1], here[2]),
      this.frameFor(target[0], target[1], target[2]),
      transitionMs,
      this.gg.level,
      OUTPUT_RATE_HZ
    );
  }

  async start(): Promise<string> {
    if (!this.holo) await this.open();
    const flags = await this.dev.systemFlags();
    if (flags & (SYS_VORTEX_STEADY | SYS_VORTEX_ALT)) {
      throw new SessionError('a defoam vortex program is running; stop it on the device first');
    }
    this.abort.value = false;
    if ((await this.dev.motionStatus()).running) {
      await this.dev.stop();
      await new Promise((resolve) => window.setTimeout(resolve, 150));
    }
    this.target = [0, 0, this.gg.heightMm];
    this.velocity = [0, 0, 0];
    this.segFrom = [...this.target];
    this.segMove = [0, 0, 0];
    const interval = this.intervalMs();
    const frame = this.frameFor(...this.target);
    await this.holo!.upload([frame, frame], 0);
    await this.holo!.configure(
      new HologramConfig({
        flags: HOLOGRAM_FLAG_HOLD_LAST,
        outputRateHz: OUTPUT_RATE_HZ,
        transitionMs: Math.round(interval),
        level: this.gg.level,
        keyframes: 2
      })
    );
    await this.holo!.start();
    this.segStart = now();
    this.state = SessionState.Hover;
    this.trail.length = 0;
    return `声瓶已生成：(${this.target[0].toFixed(0)}, ${this.target[1].toFixed(0)}, ${this.target[2].toFixed(
      0
    )}) mm · disc ${this.splitMm.toFixed(1)} mm · 空腔 ${this.coreMm.toFixed(1)} mm · level ${this.gg.level}`;
  }

  async release(): Promise<void> {
    if (this.holo) {
      try {
        await this.holo.stop();
      } catch {
        /* closing anyway */
      }
    }
    this.state = SessionState.Idle;
  }

  async emergencyStop(): Promise<void> {
    this.abort.value = true;
    this.velocity = [0, 0, 0];
    try {
      await this.holo?.stop();
    } catch {
      /* abort path */
    }
    try {
      await this.dev.clear();
    } catch {
      /* abort path */
    }
    this.state = SessionState.Idle;
    this.trail.length = 0;
  }

  intervalMs(): number {
    return Math.max(10, 1000 / Math.max(1, this.gg.updateHz));
  }

  async step(aim: readonly [number, number, number], dt: number): Promise<void> {
    if (this.state !== SessionState.Hover || !this.holo) return;
    const g = this.gg;
    const tau = Math.max(1e-3, g.smoothingMs * 1e-3);
    const blend = Math.min(1, dt / tau);
    const want: [number, number, number] = [
      aim[0] * g.sensitivityMmS,
      aim[1] * g.sensitivityMmS,
      aim[2] * g.zSpeedMmS
    ];
    for (let i = 0; i < 3; i++) this.velocity[i] += (want[i] - this.velocity[i]) * blend;
    const speed = Math.hypot(...this.velocity);
    if (g.speedLimitMmS > 0 && speed > g.speedLimitMmS) {
      const k = g.speedLimitMmS / speed;
      this.velocity = [this.velocity[0] * k, this.velocity[1] * k, this.velocity[2] * k];
    }
    this.target = [
      this.target[0] + this.velocity[0] * dt,
      this.target[1] + this.velocity[1] * dt,
      this.target[2] + this.velocity[2] * dt
    ];
    const [bx, by] = g.boundsMm;
    this.target[0] = Math.max(-bx, Math.min(bx, this.target[0]));
    this.target[1] = Math.max(-by, Math.min(by, this.target[1]));
    this.target[2] = Math.max(g.bottomMm, Math.min(g.heightMaxMm, this.target[2]));
    await this.push();
  }

  async push(force = false): Promise<void> {
    if (this.state !== SessionState.Hover || !this.holo) return;
    const time = now();
    const interval = this.intervalMs();
    if (!force && time - this.segStart < 0.35 * (interval / 1000)) return;
    const alpha = Math.max(0, Math.min(1, ((time - this.segStart) * 1000) / interval));
    const here: [number, number, number] = [
      this.segFrom[0] + alpha * this.segMove[0],
      this.segFrom[1] + alpha * this.segMove[1],
      this.segFrom[2] + alpha * this.segMove[2]
    ];
    try {
      await this.segment(here, this.target, interval);
    } catch {
      this.morphErrors += 1;
      return;
    }
    this.segFrom = here;
    this.segMove = [
      this.target[0] - here[0],
      this.target[1] - here[1],
      this.target[2] - here[2]
    ];
    this.segStart = time;
  }

  async centre(): Promise<void> {
    this.target[0] = 0;
    this.target[1] = 0;
    this.velocity = [0, 0, 0];
    await this.push(true);
  }

  hold(): void {
    this.velocity = [0, 0, 0];
  }

  get speedMmS(): number {
    return Math.hypot(...this.velocity);
  }
}
