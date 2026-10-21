/**
 * Bit-for-bit models of what motion_engine.c does with an uploaded path.
 * Port of ``umh_display/device/emulation.py``.
 */
import { pyRound } from '../core/math.ts';
import type { RGB } from '../config/types.ts';
import type { MotionPoint } from './protocol.ts';

function catmull(p0: number, p1: number, p2: number, p3: number, t: number): number {
  const t2 = t * t;
  const t3 = t2 * t;
  return 0.5 * (2 * p1 + (-p0 + p2) * t + (2 * p0 - 5 * p1 + 4 * p2 - p3) * t2 + (-p0 + 3 * p1 - 3 * p2 + p3) * t3);
}

export interface SampledPath {
  x: Float64Array;
  y: Float64Array;
  z: Float64Array;
  level: Float64Array;
  palette: Float64Array;
}

/** motion_sample_path() for a looped path in SMOOTH_PALETTE mode. */
export function samplePath(
  xyzUm: Float64Array,
  level: ArrayLike<number>,
  palettePos: ArrayLike<number>,
  phase: ArrayLike<number>,
  linear = false,
  paletteCount = 16
): SampledPath {
  const n = xyzUm.length / 3;
  const m = phase.length;
  const x = new Float64Array(m);
  const y = new Float64Array(m);
  const z = new Float64Array(m);
  const lev = new Float64Array(m);
  const pal = new Float64Array(m);
  for (let k = 0; k < m; k++) {
    const s = phase[k] * n;
    let i1 = Math.floor(s);
    const frac = s - i1;
    i1 = ((i1 % n) + n) % n;
    const i0 = (i1 - 1 + n) % n;
    const i2 = (i1 + 1) % n;
    const i3 = (i1 + 2) % n;
    if (linear || n < 4) {
      x[k] = xyzUm[i1 * 3] + (xyzUm[i2 * 3] - xyzUm[i1 * 3]) * frac;
      y[k] = xyzUm[i1 * 3 + 1] + (xyzUm[i2 * 3 + 1] - xyzUm[i1 * 3 + 1]) * frac;
      z[k] = xyzUm[i1 * 3 + 2] + (xyzUm[i2 * 3 + 2] - xyzUm[i1 * 3 + 2]) * frac;
    } else {
      x[k] = catmull(xyzUm[i0 * 3], xyzUm[i1 * 3], xyzUm[i2 * 3], xyzUm[i3 * 3], frac);
      y[k] = catmull(xyzUm[i0 * 3 + 1], xyzUm[i1 * 3 + 1], xyzUm[i2 * 3 + 1], xyzUm[i3 * 3 + 1], frac);
      z[k] = catmull(xyzUm[i0 * 3 + 2], xyzUm[i1 * 3 + 2], xyzUm[i2 * 3 + 2], xyzUm[i3 * 3 + 2], frac);
    }
    lev[k] = level[i1] + (level[i2] - level[i1]) * frac;
    const span = paletteCount;
    let delta = palettePos[i2] - palettePos[i1];
    if (delta > 0.5 * span) delta -= span;
    else if (delta < -0.5 * span) delta += span;
    if (paletteCount > 1) {
      let value = (palettePos[i1] + delta * frac) % span;
      if (value < 0) value += span;
      pal[k] = value;
    } else {
      pal[k] = palettePos[i1];
    }
  }
  return { x, y, z, level: lev, palette: pal };
}

/** Quantise exactly as MotionPoint.pack() does and return firmware-side arrays. */
export function pointsArrays(points: MotionPoint[], paletteCount: number): {
  xyzUm: Float64Array;
  level: Float64Array;
  palettePos: Float64Array;
} {
  const n = points.length;
  const xyzUm = new Float64Array(n * 3);
  const level = new Float64Array(n);
  const palettePos = new Float64Array(n);
  for (let i = 0; i < n; i++) {
    xyzUm[i * 3] = pyRound(points[i].xUm / 10) * 10;
    xyzUm[i * 3 + 1] = pyRound(points[i].yUm / 10) * 10;
    xyzUm[i * 3 + 2] = pyRound(points[i].zUm / 10) * 10;
    level[i] = Math.min(255, Math.max(0, pyRound(points[i].level)));
    palettePos[i] = Math.min(255, Math.max(0, pyRound(points[i].palette))) * (paletteCount / 256);
  }
  return { xyzUm, level, palettePos };
}

/** motion_palette_color(): linear blend between neighbouring entries, wrapped. */
export function paletteColor(palette: RGB[], pos: ArrayLike<number>): RGB[] {
  const count = palette.length;
  const out: RGB[] = new Array(pos.length);
  for (let i = 0; i < pos.length; i++) {
    if (count === 1) {
      out[i] = [...palette[0]] as RGB;
      continue;
    }
    const base = Math.floor(pos[i]);
    const frac = pos[i] - base;
    const idx = ((base % count) + count) % count;
    const nxt = (idx + 1) % count;
    out[i] = [
      Math.floor(palette[idx][0] + (palette[nxt][0] - palette[idx][0]) * frac + 0.5),
      Math.floor(palette[idx][1] + (palette[nxt][1] - palette[idx][1]) * frac + 0.5),
      Math.floor(palette[idx][2] + (palette[nxt][2] - palette[idx][2]) * frac + 0.5)
    ];
  }
  return out;
}

/** Per-frame loop phase including the smoothstep path-rate ramp from 0 to 1. */
export function framePhases(
  periodS: number,
  rateHz: number,
  durationS: number,
  rampS = 0,
  startPhase = 0
): Float64Array {
  const dt = 1 / rateHz;
  const n = pyRound(durationS * rateHz);
  const phase = new Float64Array(n);
  let ph = startPhase;
  let elapsed = 0;
  for (let k = 0; k < n; k++) {
    phase[k] = ph;
    let rate = 1;
    if (rampS > 0 && elapsed < rampS) {
      elapsed += dt;
      const s = Math.min(1, elapsed / rampS);
      rate = s * s * (3 - 2 * s);
    }
    ph = (ph + (rate * dt) / periodS) % 1;
  }
  return phase;
}

