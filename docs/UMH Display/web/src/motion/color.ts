/**
 * Colour encoding for the device: a 16-entry RGB ring plus one palette byte
 * per path point.  Port of ``umh_display/motion/color.py``.
 */
import { hsvToRgb } from '../core/fft.ts';
import { clamp, mod, pyRound } from '../core/math.ts';
import type { AppConfig, RGB } from '../config/types.ts';

export const RING = 16;

function gammaRgb(rgb: RGB, gamma: number): RGB {
  return rgb.map((c) => pyRound(255 * clamp(c / 255, 0, 1) ** gamma)) as RGB;
}

export function hueRing(gamma: number): RGB[] {
  const ring: RGB[] = [];
  for (let i = 0; i < RING; i++) {
    const [r, g, b] = hsvToRgb(i / RING, 1, 1);
    ring.push(gammaRgb([255 * r, 255 * g, 255 * b], gamma));
  }
  return ring;
}

function mix(a: RGB, b: RGB, t: number): RGB {
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
}

export interface ColorEncoding {
  palette: RGB[];
  paletteByte: Uint8Array;
  level: Uint8Array;
  spinX10: number;
}

/** -> palette, palette byte per sample, level byte per sample, palette_spin_x10. */
export function encodeColor(
  cfg: AppConfig,
  hue: ArrayLike<number>,
  intensity: ArrayLike<number>
): ColorEncoding {
  const d = cfg.display;
  let palette: RGB[];
  let pos: Float64Array;
  let spin = 0;
  if (d.colorScheme === 'solid') {
    palette = [gammaRgb(d.colorA, d.gamma)];
    pos = new Float64Array(hue.length);
  } else if (d.colorScheme === 'gradient') {
    const half = Math.floor(RING / 2);
    palette = [];
    for (let i = 0; i < half; i++) palette.push(gammaRgb(mix(d.colorA, d.colorB, i / half), d.gamma));
    for (let i = 0; i < half; i++) palette.push(gammaRgb(mix(d.colorB, d.colorA, i / half), d.gamma));
    pos = Float64Array.from(hue);
    spin = d.hueSpinRevS;
  } else {
    palette = hueRing(d.gamma);
    pos = Float64Array.from(hue);
    spin = d.hueSpinRevS;
  }

  const paletteByte = new Uint8Array(hue.length);
  const level = new Uint8Array(hue.length);
  for (let i = 0; i < hue.length; i++) {
    paletteByte[i] = pyRound(mod(pos[i], 1) * 256) & 0xff;
    level[i] = pyRound(255 * clamp(intensity[i], 0, 1));
  }
  const spinX10 = palette.length > 1 ? pyRound(Math.min(250, Math.max(0, spin * palette.length * 10))) : 0;
  return { palette, paletteByte, level, spinX10 };
}

/** LED colour the firmware produces (spin frozen at 0). */
export function previewRgb(palette: RGB[], paletteByte: ArrayLike<number>, level: ArrayLike<number>): RGB[] {
  const count = palette.length;
  const out: RGB[] = new Array(paletteByte.length);
  for (let i = 0; i < paletteByte.length; i++) {
    const pos = (paletteByte[i] * count) / 256;
    let r: number, g: number, b: number;
    if (count === 1) {
      [r, g, b] = palette[0];
    } else {
      const base = Math.floor(pos) % count;
      const frac = pos - Math.floor(pos);
      const a = palette[base];
      const c = palette[(base + 1) % count];
      r = a[0] + (c[0] - a[0]) * frac;
      g = a[1] + (c[1] - a[1]) * frac;
      b = a[2] + (c[2] - a[2]) * frac;
    }
    const lv = level[i] / 255;
    out[i] = [Math.floor(r * lv), Math.floor(g * lv), Math.floor(b * lv)];
  }
  return out;
}

