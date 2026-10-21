/** Small numeric helpers shared by the physics, planner and renderer. */

export const TAU = Math.PI * 2;
export const DEG = Math.PI / 180;
export const G = 9.81;

export function clamp(value: number, lo: number, hi: number): number {
  return value < lo ? lo : value > hi ? hi : value;
}

/** Python's round(): half-way cases go to the nearest even integer. */
export function pyRound(value: number): number {
  const floor = Math.floor(value);
  const frac = value - floor;
  if (frac > 0.5) return floor + 1;
  if (frac < 0.5) return floor;
  return floor % 2 === 0 ? floor : floor + 1;
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/** numpy-style modulo: always in [0, m). */
export function mod(value: number, m: number): number {
  const r = value % m;
  return r < 0 ? r + m : r;
}

export function wrap01(value: number): number {
  return mod(value, 1);
}

export function hypot2(x: number, y: number): number {
  return Math.sqrt(x * x + y * y);
}

/** Cyclic shortest distance on [0,1): ((a-b+0.5) mod 1) - 0.5. */
export function cyclicDelta(a: number, b: number): number {
  return mod(b - a + 0.5, 1) - 0.5;
}

export function mean(values: ArrayLike<number>): number {
  if (values.length === 0) return 0;
  let sum = 0;
  for (let i = 0; i < values.length; i++) sum += values[i];
  return sum / values.length;
}

/** numpy.linspace, endpoint included. */
export function linspace(start: number, stop: number, count: number): Float64Array {
  const out = new Float64Array(count);
  if (count === 1) {
    out[0] = start;
    return out;
  }
  const step = (stop - start) / (count - 1);
  for (let i = 0; i < count; i++) out[i] = start + step * i;
  return out;
}

/** numpy.arange. */
export function arange(start: number, stop?: number, step = 1): Float64Array {
  if (stop === undefined) {
    stop = start;
    start = 0;
  }
  const count = Math.max(0, Math.ceil((stop - start) / step));
  const out = new Float64Array(count);
  for (let i = 0; i < count; i++) out[i] = start + step * i;
  return out;
}

/** numpy.interp with endpoint clamping (x may be unsorted). */
export function interp(x: number, xp: ArrayLike<number>, fp: ArrayLike<number>): number {
  const n = xp.length;
  if (n === 0) return NaN;
  if (n === 1) return fp[0];
  if (x <= xp[0]) return fp[0];
  if (x >= xp[n - 1]) return fp[n - 1];
  let lo = 0;
  let hi = n - 1;
  while (hi - lo > 1) {
    const mid = (lo + hi) >> 1;
    if (xp[mid] <= x) lo = mid;
    else hi = mid;
  }
  const span = xp[hi] - xp[lo];
  if (span <= 0) return fp[lo];
  return fp[lo] + ((fp[hi] - fp[lo]) * (x - xp[lo])) / span;
}

export function interpolateArray(xs: ArrayLike<number>, xp: ArrayLike<number>, fp: ArrayLike<number>): Float64Array {
  const out = new Float64Array(xs.length);
  for (let i = 0; i < xs.length; i++) out[i] = interp(xs[i], xp, fp);
  return out;
}

/** numpy.gradient(values, coords) with edge_order=1. */
export function gradient(values: ArrayLike<number>, coords: ArrayLike<number>): Float64Array {
  const n = values.length;
  const out = new Float64Array(n);
  if (n < 2) return out;
  out[0] = (values[1] - values[0]) / (coords[1] - coords[0]);
  out[n - 1] = (values[n - 1] - values[n - 2]) / (coords[n - 1] - coords[n - 2]);
  for (let i = 1; i < n - 1; i++) {
    out[i] = (values[i + 1] - values[i - 1]) / (coords[i + 1] - coords[i - 1]);
  }
  return out;
}

/** numpy.percentile(values, q) with linear interpolation (q in 0..100). */
export function percentile(values: ArrayLike<number>, q: number): number {
  const n = values.length;
  if (n === 0) return NaN;
  const sorted = Float64Array.from(values).sort();
  if (n === 1) return sorted[0];
  const pos = (clamp(q, 0, 100) / 100) * (n - 1);
  const lo = Math.floor(pos);
  const hi = Math.ceil(pos);
  return sorted[lo] + (sorted[hi] - sorted[lo]) * (pos - lo);
}

export function argmin(values: ArrayLike<number>, start = 0, stop = values.length): number {
  let best = start;
  for (let i = start + 1; i < stop; i++) if (values[i] < values[best]) best = i;
  return best;
}

export function argmax(values: ArrayLike<number>, start = 0, stop = values.length): number {
  let best = start;
  for (let i = start + 1; i < stop; i++) if (values[i] > values[best]) best = i;
  return best;
}

/** numpy.argsort (stable), ascending. */
export function argsort(values: ArrayLike<number>): number[] {
  const idx: number[] = new Array(values.length);
  for (let i = 0; i < values.length; i++) idx[i] = i;
  idx.sort((a, b) => values[a] - values[b] || a - b);
  return idx;
}

/** numpy.searchsorted(a, v, side='left'). */
export function searchsorted(a: ArrayLike<number>, v: number, side: 'left' | 'right' = 'left'): number {
  let lo = 0;
  let hi = a.length;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (side === 'left' ? a[mid] < v : a[mid] <= v) lo = mid + 1;
    else hi = mid;
  }
  return lo;
}

export function norm3(x: number, y: number, z: number): number {
  return Math.sqrt(x * x + y * y + z * z);
}

/** Normalise a 2-vector; returns [0,0] for a zero vector (text layout uses this). */
export function unit2(x: number, y: number): [number, number] {
  const n = Math.sqrt(x * x + y * y);
  return n > 1e-12 ? [x / n, y / n] : [0, 0];
}

/** Angle between two 2-vectors, 0 when either is zero (as in shapes/text.py). */
export function angle2(ax: number, ay: number, bx: number, by: number): number {
  if ((ax === 0 && ay === 0) || (bx === 0 && by === 0)) return 0;
  const dot = ax * bx + ay * by;
  return Math.acos(clamp(dot, -1, 1));
}

export function gcd(a: number, b: number): number {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) [a, b] = [b, a % b];
  return a;
}

/** Small seeded RNG (mulberry32) for deterministic demos / field dithering. */
export function mulberry32(seed: number): () => number {
  let a = seed | 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function formatFixed(value: number, digits: number): string {
  if (!Number.isFinite(value)) return '—';
  return value.toFixed(digits);
}
