/** Keyboard and browser gamepad input for the gravity gun. */

const KEY_AXES: Record<string, [number, number]> = {
  ArrowLeft: [0, -1],
  a: [0, -1],
  ArrowRight: [0, 1],
  d: [0, 1],
  ArrowDown: [1, -1],
  s: [1, -1],
  ArrowUp: [1, 1],
  w: [1, 1],
  PageDown: [2, -1],
  f: [2, -1],
  PageUp: [2, 1],
  r: [2, 1]
};

const CENTRE_KEYS = new Set([' ', 'Spacebar', 'Home']);
const DROP_KEYS = new Set(['Escape']);

export const KEY_HELP = '方向键 / WASD 移动 xy · R·PageUp / F·PageDown 升降 · Space 回中 · Esc 关场';

function editableTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  return ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName) || target.isContentEditable;
}

export class KeyboardInput {
  private readonly pressed = new Set<string>();
  centre = false;
  drop = false;
  enabled = false;
  private readonly onDown = (event: KeyboardEvent): void => {
    if (!this.enabled || editableTarget(event.target) || event.ctrlKey || event.metaKey || event.altKey) return;
    if (document.querySelector('dialog[open]')) return;
    const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
    if (CENTRE_KEYS.has(key)) {
      this.centre = true;
      event.preventDefault();
      return;
    }
    if (DROP_KEYS.has(key)) {
      this.drop = true;
      event.preventDefault();
      return;
    }
    if (KEY_AXES[key]) {
      this.pressed.add(key);
      event.preventDefault();
    }
  };
  private readonly onUp = (event: KeyboardEvent): void => {
    const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
    if (CENTRE_KEYS.has(key)) this.centre = false;
    if (DROP_KEYS.has(key)) this.drop = false;
    this.pressed.delete(key);
  };
  private readonly onBlur = (): void => this.clear();

  attach(): void {
    if (this.enabled) return;
    this.enabled = true;
    window.addEventListener('keydown', this.onDown);
    window.addEventListener('keyup', this.onUp);
    window.addEventListener('blur', this.onBlur);
  }

  detach(): void {
    if (!this.enabled) return;
    this.enabled = false;
    window.removeEventListener('keydown', this.onDown);
    window.removeEventListener('keyup', this.onUp);
    window.removeEventListener('blur', this.onBlur);
    this.clear();
  }

  clear(): void {
    this.pressed.clear();
    this.centre = false;
    this.drop = false;
  }

  aim(): [number, number, number] {
    const aim: [number, number, number] = [0, 0, 0];
    for (const key of this.pressed) {
      const entry = KEY_AXES[key];
      if (entry) aim[entry[0]] += entry[1];
    }
    return [Math.max(-1, Math.min(1, aim[0])), Math.max(-1, Math.min(1, aim[1])), Math.max(-1, Math.min(1, aim[2]))];
  }
}

export interface PadState {
  aim: [number, number, number];
  centre: boolean;
  drop: boolean;
}

export class GamepadReader {
  available = false;
  name = '';
  error = '';
  deadzone = 0.12;
  private padIndex = -1;
  private previousButtons = new Set<number>();

  scan(): boolean {
    if (!('getGamepads' in navigator)) {
      this.error = '此浏览器不支持 Gamepad API';
      this.available = false;
      return false;
    }
    const pads = navigator.getGamepads();
    for (const pad of pads) {
      if (!pad || !pad.connected) continue;
      this.padIndex = pad.index;
      this.name = pad.id.replace(/\s*\(.*?\)\s*/g, ' ').trim();
      this.available = true;
      this.error = '';
      return true;
    }
    this.available = false;
    this.error = '未发现手柄：请先配对 Xbox 手柄再重试';
    return false;
  }

  stop(): void {
    this.available = false;
    this.padIndex = -1;
    this.previousButtons.clear();
  }

  private dead(value: number): number {
    if (Math.abs(value) <= this.deadzone) return 0;
    const scaled = (Math.abs(value) - this.deadzone) / (1 - this.deadzone);
    return (value > 0 ? 1 : -1) * Math.min(1, scaled);
  }

  poll(): PadState {
    const state: PadState = { aim: [0, 0, 0], centre: false, drop: false };
    if (!this.available || this.padIndex < 0) return state;
    const pad = navigator.getGamepads()[this.padIndex];
    if (!pad || !pad.connected) {
      this.available = false;
      this.error = '手柄已断开';
      return state;
    }
    const x = this.dead(pad.axes[0] ?? 0);
    const y = this.dead(pad.axes[1] ?? 0);
    let z = -this.dead(pad.axes[3] ?? 0);
    const lt = pad.axes[2] ?? -1;
    const rt = pad.axes[5] ?? -1;
    z += 0.5 * Math.max(0, (lt + 1) * 0.5) - 0.5 * Math.max(0, (rt + 1) * 0.5);
    state.aim = [x, y, Math.max(-1, Math.min(1, z))];
    const pressed = new Set<number>();
    pad.buttons.forEach((button, index) => {
      if (button.pressed) pressed.add(index);
    });
    state.centre = pressed.has(0) && !this.previousButtons.has(0);
    state.drop = pressed.has(1) && !this.previousButtons.has(1);
    this.previousButtons = pressed;
    return state;
  }
}
