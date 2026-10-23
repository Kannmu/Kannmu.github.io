/** Continuous XY jogging for the unrestricted mode: WASD + Xbox left stick. */
export interface LiveMotionConfig {
  speedMmS: number;
  accelMmS2: number;
}

export interface LiveSample {
  xMm: number;
  yMm: number;
  vxMmS: number;
  vyMmS: number;
}

const KEY_CODES = new Set(['KeyW', 'KeyA', 'KeyS', 'KeyD']);
const DEADZONE = 0.12;

function editable(target: EventTarget | null): boolean {
  return (
    target instanceof HTMLElement &&
    (target.matches('input, textarea, select') || target.isContentEditable)
  );
}

export class LiveController {
  private x = 0;
  private y = 0;
  private vx = 0;
  private vy = 0;
  private raf = 0;
  private last = 0;
  private lastEmit = 0;
  private readonly keys = new Set<string>();
  private running = false;
  private readonly boundsMm: number;

  constructor(
    private readonly config: () => LiveMotionConfig,
    private readonly onMove: (sample: LiveSample) => void,
    boundsMm = 40
  ) {
    this.boundsMm = boundsMm;
  }

  get position(): { xMm: number; yMm: number } {
    return { xMm: this.x, yMm: this.y };
  }

  get active(): boolean {
    return this.running;
  }

  start(xMm: number, yMm: number): void {
    this.stop();
    this.x = xMm;
    this.y = yMm;
    this.vx = 0;
    this.vy = 0;
    this.running = true;
    this.last = performance.now();
    this.lastEmit = 0;
    window.addEventListener('keydown', this.keyDown);
    window.addEventListener('keyup', this.keyUp);
    window.addEventListener('blur', this.clearKeys);
    this.onMove(this.sample());
    this.raf = requestAnimationFrame(this.loop);
  }

  stop(): void {
    this.running = false;
    cancelAnimationFrame(this.raf);
    this.raf = 0;
    window.removeEventListener('keydown', this.keyDown);
    window.removeEventListener('keyup', this.keyUp);
    window.removeEventListener('blur', this.clearKeys);
    this.keys.clear();
    this.vx = 0;
    this.vy = 0;
  }

  /** Slider/center change: jump to the new target and zero the velocity. */
  setPosition(xMm: number, yMm: number): void {
    this.x = Math.max(-this.boundsMm, Math.min(this.boundsMm, xMm));
    this.y = Math.max(-this.boundsMm, Math.min(this.boundsMm, yMm));
    this.vx = 0;
    this.vy = 0;
    if (this.running) this.onMove(this.sample());
  }

  private sample(): LiveSample {
    return { xMm: this.x, yMm: this.y, vxMmS: this.vx, vyMmS: this.vy };
  }

  private keyDown = (event: KeyboardEvent): void => {
    if (!this.running || event.ctrlKey || event.metaKey || event.altKey) return;
    if (editable(event.target) || document.querySelector('dialog[open]')) return;
    if (!KEY_CODES.has(event.code)) return;
    event.preventDefault();
    this.keys.add(event.code);
  };

  private keyUp = (event: KeyboardEvent): void => {
    if (!KEY_CODES.has(event.code)) return;
    this.keys.delete(event.code);
  };

  private clearKeys = (): void => {
    this.keys.clear();
  };

  private gamepad(): { x: number; y: number } {
    if (!navigator.getGamepads) return { x: 0, y: 0 };
    const pads = navigator.getGamepads();
    for (const pad of pads) {
      if (!pad?.connected) continue;
      const ax = pad.axes[0] ?? 0;
      const ay = pad.axes[1] ?? 0;
      const mag = Math.hypot(ax, ay);
      if (mag < DEADZONE) return { x: 0, y: 0 };
      const scale = (mag - DEADZONE) / ((1 - DEADZONE) * mag);
      return { x: ax * scale, y: -ay * scale };
    }
    return { x: 0, y: 0 };
  }

  private loop = (now: number): void => {
    if (!this.running) return;
    const dt = Math.min(0.05, Math.max(0.001, (now - this.last) / 1000));
    this.last = now;
    const keyX = (this.keys.has('KeyD') ? 1 : 0) - (this.keys.has('KeyA') ? 1 : 0);
    const keyY = (this.keys.has('KeyW') ? 1 : 0) - (this.keys.has('KeyS') ? 1 : 0);
    const pad = this.gamepad();
    let ix = keyX + pad.x;
    let iy = keyY + pad.y;
    const mag = Math.hypot(ix, iy);
    if (mag > 1) {
      ix /= mag;
      iy /= mag;
    }
    const { speedMmS, accelMmS2 } = this.config();
    const targetVx = ix * speedMmS;
    const targetVy = iy * speedMmS;
    const maxDv = Math.max(0.001, accelMmS2) * dt;
    const dvx = targetVx - this.vx;
    const dvy = targetVy - this.vy;
    this.vx += Math.max(-maxDv, Math.min(maxDv, dvx));
    this.vy += Math.max(-maxDv, Math.min(maxDv, dvy));
    if (Math.abs(this.vx) < 1e-5) this.vx = 0;
    if (Math.abs(this.vy) < 1e-5) this.vy = 0;

    const previousX = this.x;
    const previousY = this.y;
    this.x = Math.max(-this.boundsMm, Math.min(this.boundsMm, this.x + this.vx * dt));
    this.y = Math.max(-this.boundsMm, Math.min(this.boundsMm, this.y + this.vy * dt));
    if (this.x === previousX && this.vx !== 0) this.vx = 0;
    if (this.y === previousY && this.vy !== 0) this.vy = 0;

    const moving = Math.abs(this.vx) > 1e-5 || Math.abs(this.vy) > 1e-5;
    if (moving || this.x !== previousX || this.y !== previousY) {
      if (now - this.lastEmit > 20) {
        this.lastEmit = now;
        this.onMove(this.sample());
      }
    }
    this.raf = requestAnimationFrame(this.loop);
  };
}
