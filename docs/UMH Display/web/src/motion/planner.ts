/**
 * Shape -> device path.  Faithful TypeScript port of
 * ``umh_display/motion/planner.py``:
 *
 *   1. fillet corners, sample by arc length, curvature
 *   2. time-optimal speed profile under a friction-circle limit
 *   3. uniform-time resampling, jerk-limiting FIR, robust anti-resonance prefilter
 *   4. model-inversion feedforward (lead the bead by the offset that produces
 *      the required force)
 *   5. LED intensity per sample, gamma / blanking / dwell compensation
 *   6. resample to the device point budget and verify with the bead simulation
 */
import { clamp, interp, percentile, pyRound, searchsorted } from '../core/math.ts';
import { irfft, rfft } from '../core/fft.ts';
import type { AppConfig } from '../config/types.ts';
import { focusZmmOf, trapModeOf } from '../config/defaults.ts';
import { elementPositionsM } from '../geometry/elements.ts';
import { simulate } from '../physics/dynamics.ts';
import {
  AIR_VISCOSITY,
  dampingC,
  drag,
  dragArray,
  falloffArray,
  offsetForForceArray,
  trapModelFromConfig,
  type TrapModel
} from '../physics/trap.ts';
import { encodeColor, previewRgb } from './color.ts';
import { buildDense, type DensePath } from './path.ts';
import { place, type Planar } from '../shapes/base.ts';
import { make } from '../shapes/library.ts';
import { layoutText } from '../shapes/text.ts';
import { samplePath, pointsArrays, framePhases } from '../device/emulation.ts';
import { MotionPoint, TRAP_DARK_VORTEX } from '../device/protocol.ts';

const GRID_HZ = 4000;
const MIN_DWELL_LIGHT = 0.12;
const OFFAXIS_WARN = 0.8;
const KAPPA_GRID = 96;
const LOOP_SAMPLES = 12;
const FILTER_TOP = 8;
const W_MAX = 1.25;
const SLIP_MARGIN = 0.9;

export type RGB = [number, number, number];

export interface Plan {
  name: string;
  periodS: number;
  points: MotionPoint[];
  palette: RGB[];
  paletteSpinX10: number;
  focusZUm: number;
  rateHz: number;
  rampMs: number;
  level: number;
  t: Float64Array;
  beadX: Float64Array;
  beadY: Float64Array;
  trapX: Float64Array;
  trapY: Float64Array;
  ledR: Float64Array;
  ledG: Float64Array;
  ledB: Float64Array;
  speed: Float64Array;
  accel: Float64Array;
  simBeadX: Float64Array | null;
  simBeadY: Float64Array | null;
  targetX: Float64Array;
  targetY: Float64Array;
  beadLit: Uint8Array;
  metrics: Record<string, number>;
  warnings: string[];
  path: DensePath;
  trapModel: TrapModel;
}

export interface PlanOptions {
  planar?: Planar;
  verify?: boolean;
  maxPoints?: number;
  periodS?: number;
}

export function topp(path: DensePath, aLim: number | Float64Array, vMax: number, aNShare = 0.85): Float64Array {
  const m = path.ds.length;
  const v = new Float64Array(m);
  const al = new Float64Array(m);
  for (let i = 0; i < m; i++) {
    const kappa = Math.max(path.curvature[i], 1e-9);
    const limit = typeof aLim === 'number' ? aLim : aLim[i];
    al[i] = limit;
    v[i] = Math.min(vMax, Math.sqrt((aNShare * limit) / kappa));
    if (path.stop[i]) v[i] = 0;
  }
  const aT = (speed: number, i: number): number => {
    const an = speed * speed * path.curvature[i];
    return Math.sqrt(Math.max(al[i] * al[i] - an * an, 0));
  };
  for (let lap = 0; lap < 2; lap++) {
    for (let i = 0; i < m; i++) {
      const j = (i + 1) % m;
      const cap = Math.sqrt(v[i] * v[i] + 2 * aT(v[i], i) * path.ds[i]);
      if (cap < v[j]) v[j] = cap;
    }
    for (let i = m - 1; i >= 0; i--) {
      const j = (i + 1) % m;
      const cap = Math.sqrt(v[j] * v[j] + 2 * aT(v[j], j) * path.ds[i]);
      if (cap < v[i]) v[i] = cap;
    }
  }
  return v;
}

export function jerkGain(n: number, window: number): Float64Array {
  if (window < 2) return new Float64Array(Math.floor(n / 2) + 1).fill(1);
  const box = new Float64Array(n);
  const shift = Math.floor(window / 2);
  for (let j = 0; j < window; j++) box[(j - shift + n) % n] = 1 / window;
  const spec = rfft(box);
  const out = new Float64Array(spec.re.length);
  for (let i = 0; i < out.length; i++) {
    const s = spec.re[i] * spec.re[i] + spec.im[i] * spec.im[i];
    out[i] = s * (2 - s);
  }
  return out;
}

function linearDamping(model: TrapModel): number {
  return Math.max(dampingC(model) - 6 * Math.PI * AIR_VISCOSITY * model.radius, 0);
}

interface LoopSamples {
  count: number;
  /** count triples: use, fall, speed. */
  data: Float64Array;
}

export function loopSamples(
  use: Float64Array,
  fall: Float64Array,
  speed: Float64Array,
  force: Float64Array,
  count = LOOP_SAMPLES
): LoopSamples {
  const n = use.length;
  const stiff = new Float64Array(n);
  for (let i = 0; i < n; i++) {
    const u = Math.min(use[i], 1);
    stiff[i] = fall[i] * Math.sqrt(Math.max(1 - u * u, 0));
  }
  const f2 = new Float64Array(n);
  let f2Sum = 0;
  for (let i = 0; i < n; i++) {
    f2[i] = force[i] * force[i];
    f2Sum += f2[i];
  }
  const order = Array.from({ length: n }, (_, i) => i).sort((a, b) => stiff[a] - stiff[b] || a - b);
  const w = new Float64Array(n);
  for (let i = 0; i < n; i++) w[i] = 0.5 / n + (0.5 * f2[i]) / Math.max(f2Sum, 1e-30);
  const cw = new Float64Array(n);
  let acc = 0;
  for (let k = 0; k < n; k++) {
    const i = order[k];
    acc += w[i];
    cw[k] = acc;
  }
  const data = new Float64Array(count * 3);
  for (let k = 0; k < count; k++) {
    const q = ((k + 0.5) / count) * cw[n - 1];
    let idx = searchsorted(cw, q, 'left');
    if (idx > n - 1) idx = n - 1;
    const pick = order[idx];
    data[k * 3] = use[pick];
    data[k * 3 + 1] = fall[pick];
    data[k * 3 + 2] = speed[pick];
  }
  return { count, data };
}

interface Transfer {
  re: Float64Array;
  im: Float64Array;
  f: Float64Array;
}

/** G = X_bead / X_ref per harmonic, loop sample and force scale. */
export function trapResponse(
  model: TrapModel,
  fHz: Float64Array,
  samples: LoopSamples,
  rho: number,
  cLin = 0
): Transfer {
  const rhoC = clamp(rho, 0, 0.9);
  const s = 1;
  const F = fHz.length;
  const S = samples.count;
  const K = KAPPA_GRID;
  const re = new Float64Array(F * S * K);
  const im = new Float64Array(F * S * K);
  const kap = new Float64Array(K);
  for (let k = 0; k < K; k++) kap[k] = s * (1 + rhoC * (((k + 0.5) / K) * 2 - 1));
  const stiff = model.fMax * 0.5 * Math.PI / model.dPk;
  for (let si = 0; si < S; si++) {
    const u = clamp(samples.data[si * 3], 1e-4, 0.999);
    const fall = Math.max(samples.data[si * 3 + 1], 1e-3);
    const v = Math.max(samples.data[si * 3 + 2], 1e-6);
    const thF = Math.asin(Math.min(u / s, 0.999));
    const cd = drag(model, v) / v + cLin;
    const denomStiff = stiff * fall;
    for (let ki = 0; ki < K; ki++) {
      const thT = Math.asin(Math.min(u / kap[ki], 0.999));
      const lag = (thF - thT) / u;
      const tq = kap[ki] * Math.cos(thT);
      for (let fi = 0; fi < F; fi++) {
        const w = 2 * Math.PI * fHz[fi];
        const bRe = (-model.mass * w * w) / denomStiff;
        const bIm = (w * cd) / denomStiff;
        // q = b*t / (t + b)
        const zRe = tq + bRe;
        const zIm = bIm;
        const den = zRe * zRe + zIm * zIm;
        const numRe = bRe * tq;
        const numIm = bIm * tq;
        const qRe = den > 1e-30 ? (numRe * zRe + numIm * zIm) / den : 0;
        const qIm = den > 1e-30 ? (numIm * zRe - numRe * zIm) / den : 0;
        const idx = (fi * S + si) * K + ki;
        re[idx] = 1 + lag * qRe;
        im[idx] = lag * qIm;
      }
    }
  }
  return { re, im, f: fHz };
}

interface FilterResult {
  re: Float64Array;
  im: Float64Array;
  resid: Float64Array;
}

/** Robust per-harmonic prefilter for the bead reference, and its residual. */
export function resonanceFilter(
  model: TrapModel,
  fHz: Float64Array,
  samples: LoopSamples,
  rho: number,
  cLin = 0,
  keep = 2
): FilterResult {
  const top = FILTER_TOP * Math.sqrt(model.fMax * 0.5 * Math.PI / model.dPk / model.mass) / (2 * Math.PI);
  let low = 0;
  while (low < fHz.length && fHz[low] < top) low++;
  const extended = new Float64Array(low + 1);
  extended.set(fHz.subarray(0, low));
  extended[low] = top;
  const g = trapResponse(model, extended, samples, rho, cLin);
  const S = samples.count * KAPPA_GRID;
  const F = extended.length;
  const egRe = new Float64Array(F);
  const egIm = new Float64Array(F);
  const eg2 = new Float64Array(F);
  for (let fi = 0; fi < F; fi++) {
    let sumRe = 0;
    let sumIm = 0;
    let sum2 = 0;
    const base = fi * S;
    for (let j = 0; j < S; j++) {
      const gr = g.re[base + j];
      const gi = g.im[base + j];
      sumRe += gr;
      sumIm += gi;
      sum2 += gr * gr + gi * gi;
    }
    egRe[fi] = sumRe / S;
    egIm[fi] = sumIm / S;
    eg2[fi] = sum2 / S;
  }
  const wRe = new Float64Array(F);
  const wIm = new Float64Array(F);
  for (let fi = 0; fi < F; fi++) {
    const den = Math.max(eg2[fi], 1e-12);
    wRe[fi] = egRe[fi] / den;
    wIm[fi] = -egIm[fi] / den;
    const mag = Math.hypot(wRe[fi], wIm[fi]);
    if (mag > W_MAX) {
      wRe[fi] *= W_MAX / Math.max(mag, 1e-12);
      wIm[fi] *= W_MAX / Math.max(mag, 1e-12);
    }
  }
  const outRe = new Float64Array(fHz.length);
  const outIm = new Float64Array(fHz.length);
  const resid = new Float64Array(fHz.length);
  for (let k = 0; k < fHz.length; k++) {
    const idx = Math.min(k, low);
    let r = 1;
    let i = 0;
    if (k > keep) {
      r = wRe[idx];
      i = wIm[idx];
    }
    outRe[k] = r;
    outIm[k] = i;
    const mag2 = r * r + i * i;
    resid[k] = Math.max(mag2 * eg2[idx] - 2 * (r * egRe[idx] - i * egIm[idx]) + 1, 0);
  }
  return { re: outRe, im: outIm, resid };
}

interface TrailError {
  max: number;
  rms: number;
}

/** Geometric error of a periodic trail against the figure (long exposure). */
export function trailError(
  x: ArrayLike<number>,
  y: ArrayLike<number>,
  lit: Uint8Array | boolean[],
  targetX: ArrayLike<number>,
  targetY: ArrayLike<number>,
  sub = 8
): TrailError {
  const n = x.length;
  if (targetX.length === 0 || targetY.length === 0) return { max: 0, rms: 0 };
  let anyLit = false;
  for (let i = 0; i < n; i++) if (lit[i]) {
    anyLit = true;
    break;
  }
  if (!anyLit) return { max: 0, rms: 0 };
  const px: number[] = [];
  const py: number[] = [];
  let chords = 0;
  for (let i = 0; i < n; i++) {
    if (lit[i] && lit[(i + 1) % n]) {
      chords++;
      const j = (i + 1) % n;
      for (let k = 0; k < sub; k++) {
        const u = k / sub;
        px.push(x[i] + (x[j] - x[i]) * u);
        py.push(y[i] + (y[j] - y[i]) * u);
      }
    }
  }
  if (chords === 0) {
    for (let i = 0; i < n; i++) {
      if (lit[i]) {
        px.push(x[i]);
        py.push(y[i]);
      }
    }
  }
  let maxOut = 0;
  let sumSq = 0;
  for (let i = 0; i < px.length; i++) {
    let best = Infinity;
    for (let j = 0; j < targetX.length; j++) {
      const dx = px[i] - targetX[j];
      const dy = py[i] - targetY[j];
      const d2 = dx * dx + dy * dy;
      if (d2 < best) best = d2;
    }
    const d = Math.sqrt(best);
    sumSq += d * d;
    if (d > maxOut) maxOut = d;
  }
  let maxBack = 0;
  for (let j = 0; j < targetX.length; j++) {
    let best = Infinity;
    for (let i = 0; i < px.length; i++) {
      const dx = targetX[j] - px[i];
      const dy = targetY[j] - py[i];
      const d2 = dx * dx + dy * dy;
      if (d2 < best) best = d2;
    }
    const d = Math.sqrt(best);
    if (d > maxBack) maxBack = d;
  }
  return { max: Math.max(maxOut, maxBack), rms: Math.sqrt(sumSq / Math.max(1, px.length)) };
}

interface Derivatives {
  vx: Float64Array;
  vy: Float64Array;
  ax: Float64Array;
  ay: Float64Array;
  jx: Float64Array;
  jy: Float64Array;
}

function derivs(x: Float64Array, y: Float64Array, dt: number): Derivatives {
  const n = x.length;
  const vx = new Float64Array(n);
  const vy = new Float64Array(n);
  const ax = new Float64Array(n);
  const ay = new Float64Array(n);
  const jx = new Float64Array(n);
  const jy = new Float64Array(n);
  for (let i = 0; i < n; i++) {
    const p = (i - 1 + n) % n;
    const q = (i + 1) % n;
    vx[i] = (x[q] - x[p]) / (2 * dt);
    vy[i] = (y[q] - y[p]) / (2 * dt);
    ax[i] = (x[q] - 2 * x[i] + x[p]) / (dt * dt);
    ay[i] = (y[q] - 2 * y[i] + y[p]) / (dt * dt);
  }
  for (let i = 0; i < n; i++) {
    const p = (i - 1 + n) % n;
    const q = (i + 1) % n;
    jx[i] = (ax[q] - ax[p]) / (2 * dt);
    jy[i] = (ay[q] - ay[p]) / (2 * dt);
  }
  return { vx, vy, ax, ay, jx, jy };
}

function timing(path: DensePath, v: Float64Array): Float64Array {
  const n = v.length;
  const out = new Float64Array(n);
  for (let i = 0; i < n; i++) {
    const vv = v[i] + v[(i + 1) % n];
    out[i] = vv > 1e-9 ? (2 * path.ds[i]) / Math.max(vv, 1e-12) : 0;
  }
  return out;
}

export function isText(name: string): boolean {
  return name === 'text' || name.startsWith('text:');
}

export function placeShape(cfg: AppConfig, name: string): Planar {
  const d = cfg.display;
  const center: [number, number] = [d.centerXMm, d.centerYMm];
  if (isText(name)) {
    return layoutText(name.startsWith('text:') ? name.slice(5) : d.text, d.textHeightMm, center);
  }
  return place(make(name), d.sizeMm, center);
}

export function drawLevel(cfg: AppConfig): number {
  const lvl = Math.trunc(cfg.planner.drawLevel);
  return lvl > 0 ? Math.max(cfg.trap.level, lvl) : cfg.trap.level;
}

interface Shaped {
  n: number;
  dt: number;
  tt: Float64Array;
  s: Float64Array;
  rawX: Float64Array;
  rawY: Float64Array;
  beadX: Float64Array;
  beadY: Float64Array;
  speed: Float64Array;
  accel: Float64Array;
  jerk: Float64Array;
  fMag: Float64Array;
  fReqX: Float64Array;
  fReqY: Float64Array;
  fall: Float64Array;
  worst: number;
  pred: number;
  window: number;
  intentX: Float64Array;
  intentY: Float64Array;
  wgtRe: Float64Array;
  wgtIm: Float64Array;
  specX: { re: Float64Array; im: Float64Array };
  specY: { re: Float64Array; im: Float64Array };
}

function boxAverage(x: Float64Array, pick: Float64Array): Float64Array {
  const n = x.length;
  const prefix = new Float64Array(3 * n + 1);
  for (let i = 0; i < 3 * n; i++) prefix[i + 1] = prefix[i] + x[i % n];
  const out = new Float64Array(pick.length);
  const half = (0.5 * n) / pick.length;
  for (let i = 0; i < pick.length; i++) {
    let lo = pyRound(pick[i] - half);
    let hi = pyRound(pick[i] + half);
    hi = Math.max(hi, lo + 1);
    lo += n;
    hi += n;
    out[i] = (prefix[hi] - prefix[lo]) / (hi - lo);
  }
  return out;
}

function planOnce(
  cfg: AppConfig,
  planar: Planar,
  verify: boolean,
  maxPoints: number,
  periodSOverride?: number
): Plan {
  const pc = cfg.planner;
  const dc = cfg.display;
  const level = drawLevel(cfg);
  const model = trapModelFromConfig(cfg, level);
  const path = buildDense(planar, pc.cornerRadiusMm, pc.sampleStepMm, pc.cornerMode);
  const warnings: string[] = [];

  const vMax = pc.maxSpeedMmS * 1e-3;
  const budget = new Float64Array(path.x.length);
  const fall = falloffArray(model, path.x, path.y);
  for (let i = 0; i < budget.length; i++) budget[i] = pc.accelFraction * model.fMax * fall[i];
  const carry = model.mass * model.gravityInPlane;
  const cLin = linearDamping(model);

  const room = (v: number): Float64Array => {
    const out = new Float64Array(path.x.length);
    const dv = drag(model, v);
    for (let i = 0; i < out.length; i++) out[i] = (budget[i] - carry - dv - cLin * v) / model.mass;
    return out;
  };
  const minRoom = (v: number): number => {
    const r = room(v);
    let min = Infinity;
    for (let i = 0; i < r.length; i++) if (r[i] < min) min = r[i];
    return min;
  };

  let vTop = vMax;
  if (minRoom(vTop) <= 0.5) {
    let a0 = minRoom(0);
    if (a0 <= 1.0) {
      warnings.push(
        'the trap is too weak for motion at this level (model): raise the draw level or the lateral strength'
      );
      a0 = Math.max(a0, 1.0);
    }
    let lo = 0;
    let hi = vMax;
    for (let i = 0; i < 30; i++) {
      const mid = 0.5 * (lo + hi);
      if (minRoom(mid) > 0.5 * a0) lo = mid;
      else hi = mid;
    }
    vTop = lo;
  }
  let v = topp(path, room(vTop), vTop);
  const aLim = new Float64Array(path.x.length);
  {
    const v11 = Float64Array.from(v, (x) => x * 1.1);
    const drag11 = dragArray(model, v11);
    for (let i = 0; i < aLim.length; i++) {
      aLim[i] = Math.max((budget[i] - carry - drag11[i] - cLin * v11[i]) / model.mass, 0.5);
    }
  }
  v = topp(path, aLim, vTop);
  const segT = timing(path, v);
  let tMin = 0;
  for (let i = 0; i < segT.length; i++) tMin += segT[i];

  const nPath = path.x.length;
  const sNodes = new Float64Array(nPath + 1);
  const tUnit = new Float64Array(nPath + 1);
  for (let i = 0; i < nPath; i++) {
    sNodes[i + 1] = sNodes[i] + path.ds[i];
    tUnit[i + 1] = tUnit[i] + segT[i];
  }
  for (let i = 1; i < tUnit.length; i++) tUnit[i] /= tMin;
  const xyNodesX = new Float64Array(nPath + 1);
  const xyNodesY = new Float64Array(nPath + 1);
  xyNodesX.set(path.x);
  xyNodesX[nPath] = path.x[0];
  xyNodesY.set(path.y);
  xyNodesY[nPath] = path.y[0];
  const rfe = pc.robustForceError;

  interface ForceSet {
    vx: Float64Array;
    vy: Float64Array;
    ax: Float64Array;
    ay: Float64Array;
    jx: Float64Array;
    jy: Float64Array;
    speed: Float64Array;
    fMag: Float64Array;
    fall: Float64Array;
    use: Float64Array;
    fReqX: Float64Array;
    fReqY: Float64Array;
  }

  const forcesOf = (bx: Float64Array, by: Float64Array, dt: number): ForceSet => {
    const d = derivs(bx, by, dt);
    const speed = new Float64Array(bx.length);
    const fReqX = new Float64Array(bx.length);
    const fReqY = new Float64Array(bx.length);
    const fMag = new Float64Array(bx.length);
    const fFall = new Float64Array(bx.length);
    const use = new Float64Array(bx.length);
    for (let i = 0; i < bx.length; i++) {
      speed[i] = Math.hypot(d.vx[i], d.vy[i]);
      const c = drag(model, speed[i]) / Math.max(speed[i], 1e-9) + cLin;
      fReqX[i] = model.mass * d.ax[i] + c * d.vx[i];
      fReqY[i] = model.mass * (d.ay[i] + model.gravityInPlane) + c * d.vy[i];
      fMag[i] = Math.hypot(fReqX[i], fReqY[i]);
      fFall[i] = falloff_A(model, bx[i], by[i]);
      use[i] = fMag[i] / (model.fMax * fFall[i]);
    }
    return { ...d, speed, fMag, fall: fFall, use, fReqX, fReqY };
  };

  const shaped = (period: number): Shaped => {
    const n = Math.max(64, pyRound(period * GRID_HZ));
    const dt = period / n;
    const tt = new Float64Array(n);
    const s = new Float64Array(n);
    for (let i = 0; i < n; i++) {
      tt[i] = i * dt;
      s[i] = interp(tt[i] / period, tUnit, sNodes);
    }
    const rawX = new Float64Array(n);
    const rawY = new Float64Array(n);
    for (let i = 0; i < n; i++) {
      rawX[i] = interp(s[i], sNodes, xyNodesX);
      rawY[i] = interp(s[i], sNodes, xyNodesY);
    }
    const window = Math.max(4, pyRound(Math.min(pc.jerkTimeMs * 1e-3, 0.1 * period) * GRID_HZ));
    const gain = jerkGain(n, window);
    // numpy applies the jerk gain to the spectrum once, and the anti-resonance
    // filter then multiplies that same shaped spectrum (spec * wgt), not the
    // raw one.  Applying the gain here keeps both paths identical.
    const specX = rfft(rawX);
    const specY = rfft(rawY);
    for (let i = 0; i < gain.length; i++) {
      specX.re[i] *= gain[i];
      specX.im[i] *= gain[i];
      specY.re[i] *= gain[i];
      specY.im[i] *= gain[i];
    }
    const intentX = irfft(specX.re, specX.im, n);
    const intentY = irfft(specY.re, specY.im, n);
    const f0 = forcesOf(intentX, intentY, dt);
    const samples = loopSamples(f0.use, f0.fall, f0.speed, f0.fMag);
    const k = new Float64Array(specX.re.length);
    for (let i = 0; i < k.length; i++) k[i] = i / period;
    const filt = resonanceFilter(model, k, samples, rfe, cLin);
    const tunedXRe = new Float64Array(k.length);
    const tunedXIm = new Float64Array(k.length);
    const tunedYRe = new Float64Array(k.length);
    const tunedYIm = new Float64Array(k.length);
    for (let i = 0; i < k.length; i++) {
      const wr = filt.re[i];
      const wi = filt.im[i];
      tunedXRe[i] = specX.re[i] * wr - specX.im[i] * wi;
      tunedXIm[i] = specX.re[i] * wi + specX.im[i] * wr;
      tunedYRe[i] = specY.re[i] * wr - specY.im[i] * wi;
      tunedYIm[i] = specY.re[i] * wi + specY.im[i] * wr;
    }
    const beadX = irfft(tunedXRe, tunedXIm, n);
    const beadY = irfft(tunedYRe, tunedYIm, n);
    const f = forcesOf(beadX, beadY, dt);
    const share = new Float64Array(k.length).fill(2);
    share[0] = 1;
    if (n % 2 === 0) share[k.length - 1] = 1;
    let predSum = 0;
    for (let i = 0; i < k.length; i++) {
      const power = specX.re[i] ** 2 + specX.im[i] ** 2 + specY.re[i] ** 2 + specY.im[i] ** 2;
      predSum += share[i] * filt.resid[i] * power;
    }
    const pred = Math.sqrt(predSum / (n * n));
    let worst = 0;
    for (let i = 0; i < f.use.length; i++) if (f.use[i] > worst) worst = f.use[i];
    return {
      n,
      dt,
      tt,
      s,
      rawX,
      rawY,
      beadX,
      beadY,
      speed: f.speed,
      accel: Float64Array.from(f.ax, (value, i) => Math.hypot(value, f.ay[i])),
      jerk: Float64Array.from(f.jx, (value, i) => Math.hypot(value, f.jy[i])),
      fMag: f.fMag,
      fReqX: f.fReqX,
      fReqY: f.fReqY,
      fall: f.fall,
      worst,
      pred,
      window,
      intentX,
      intentY,
      wgtRe: filt.re,
      wgtIm: filt.im,
      specX,
      specY
    };
  };

  const msFloor = Math.max(1, Math.ceil(pc.minPeriodMs - 1e-6));
  let periodS: number;
  let sh: Shaped;
  if (periodSOverride === undefined && dc.refreshHz > 0) periodSOverride = 1 / dc.refreshHz;
  if (periodSOverride !== undefined) {
    const ms = Math.max(pyRound(periodSOverride * 1000), msFloor);
    sh = shaped(ms * 1e-3);
    periodS = ms * 1e-3;
  } else {
    const target = pc.accelFraction;
    const excess = (candidate: Shaped): number =>
      Math.max(Math.sqrt(candidate.worst / target), maxOf(candidate.speed) / vMax);
    let period = Math.max(tMin, msFloor * 1e-3);
    const tried = new Map<number, Shaped>();
    for (let it = 0; it < 12; it++) {
      const ms = Math.max(Math.ceil(period * 1000 - 1e-6), msFloor);
      if (tried.has(ms)) break;
      const candidate = shaped(ms * 1e-3);
      tried.set(ms, candidate);
      const x = excess(candidate);
      if ((x >= 0.985 && x <= 1.0) || (x < 1.0 && ms === msFloor)) break;
      period = ms * 1e-3 * x * (x > 1 ? 1.002 : 1);
    }
    let chosen: number | null = null;
    for (const [ms, candidate] of tried) {
      if (excess(candidate) <= 1 + 1e-9 && (chosen === null || ms < chosen)) chosen = ms;
    }
    if (chosen === null) {
      chosen = 0;
      for (const ms of tried.keys()) if (ms > chosen) chosen = ms;
    }
    sh = tried.get(chosen)!;
    periodS = chosen * 1e-3;
  }

  if (sh.worst > 1.0) {
    warnings.push(
      `needs ${(sh.worst * 100).toFixed(0)}% of the modelled trap force at ${(1 / periodS).toFixed(1)} Hz: ` +
        'the lead saturates and the bead lags or flies out - lower the refresh, raise the draw level, ' +
        'or measure the lateral strength (spin test)'
    );
  }

  const n = sh.n;
  const s = sh.s;
  const sPath = new Float64Array(nPath);
  {
    let acc = 0;
    for (let i = 0; i < nPath; i++) {
      sPath[i] = acc;
      acc += path.ds[i];
    }
  }
  const idx = new Uint32Array(n);
  const lit = new Uint8Array(n);
  for (let i = 0; i < n; i++) {
    let k = searchsorted(sPath, s[i], 'right') - 1;
    if (k < 0) k = 0;
    else if (k > nPath - 1) k = nPath - 1;
    idx[i] = k;
    lit[i] = path.visible[k];
  }

  const beadX = sh.beadX;
  const beadY = sh.beadY;
  const speed = sh.speed;
  const fMag = sh.fMag;
  const fFall = sh.fall;

  // feedforward lead
  const leadMag = offsetForForceArray(model, Float64Array.from(fMag, (value, i) => value / fFall[i]));
  const leadX = new Float64Array(n);
  const leadY = new Float64Array(n);
  const trapX = new Float64Array(n);
  const trapY = new Float64Array(n);
  for (let i = 0; i < n; i++) {
    const inv = 1 / Math.max(fMag[i], 1e-15);
    leadX[i] = leadMag[i] * (sh.fReqX[i] * inv);
    leadY[i] = leadMag[i] * (sh.fReqY[i] * inv);
    trapX[i] = beadX[i] + leadX[i];
    trapY[i] = beadY[i] + leadY[i];
  }

  const hueNodes = new Float64Array(nPath + 1);
  hueNodes.set(path.hue);
  hueNodes[nPath] = path.hue[0] + pyRound(path.hue[nPath - 1] - path.hue[0]);
  const hue = new Float64Array(n);
  for (let i = 0; i < n; i++) hue[i] = mod1(interp(s[i], sNodes, hueNodes));

  const intensity = new Float64Array(n);
  let anyLit = false;
  for (let i = 0; i < n; i++) {
    intensity[i] = lit[i] * dc.brightness ** dc.gamma;
    if (lit[i]) anyLit = true;
  }
  if (dc.evenLines > 0 && anyLit) {
    const litSpeeds: number[] = [];
    for (let i = 0; i < n; i++) if (lit[i]) litSpeeds.push(speed[i]);
    const vRef = percentile(litSpeeds, 80);
    for (let i = 0; i < n; i++) {
      const rel = clamp(speed[i] / Math.max(vRef, 1e-6), MIN_DWELL_LIGHT, 1);
      intensity[i] *= rel ** dc.evenLines;
    }
  }

  const npts = Math.min(maxPoints, n);
  const pos = new Float64Array(npts);
  const pick = new Uint32Array(npts);
  for (let i = 0; i < npts; i++) {
    pos[i] = (i * n) / npts;
    pick[i] = pyRound(pos[i]) % n;
  }
  const trapPtsX = new Float64Array(npts);
  const trapPtsY = new Float64Array(npts);
  const posExt = new Float64Array(npts + 1);
  posExt.set(pos);
  posExt[npts] = n;
  const trapExtX = new Float64Array(n + 1);
  trapExtX.set(trapX);
  trapExtX[n] = trapX[0];
  const trapExtY = new Float64Array(n + 1);
  trapExtY.set(trapY);
  trapExtY[n] = trapY[0];
  for (let i = 0; i < npts; i++) {
    trapPtsX[i] = interp(pos[i], posExt, trapExtX);
    trapPtsY[i] = interp(pos[i], posExt, trapExtY);
  }
  const pointInt = boxAverage(intensity, pos);
  for (let i = 0; i < npts; i++) if (pointInt[i] < 0.5 / 255) pointInt[i] = 0;
  const color = encodeColor(cfg, hue, intensity);
  const levelPts = new Uint8Array(npts);
  for (let i = 0; i < npts; i++) levelPts[i] = pyRound(255 * clamp(pointInt[i], 0, 1));
  const zUm = focusZmmOf(cfg) * 1000;
  const points: MotionPoint[] = [];
  for (let i = 0; i < npts; i++) {
    points.push(new MotionPoint(trapPtsX[i] * 1e6, trapPtsY[i] * 1e6, zUm, levelPts[i], color.paletteByte[pick[i]]));
  }
  const gridLevel = new Float64Array(n);
  const levelExt = new Float64Array(npts + 1);
  levelExt.set(levelPts);
  levelExt[npts] = levelPts[0];
  for (let i = 0; i < n; i++) gridLevel[i] = interp(i, posExt, levelExt);
  const led = previewRgb(color.palette, color.paletteByte, gridLevel);
  const ledR = new Float64Array(n);
  const ledG = new Float64Array(n);
  const ledB = new Float64Array(n);
  for (let i = 0; i < n; i++) {
    ledR[i] = led[i][0];
    ledG[i] = led[i][1];
    ledB[i] = led[i][2];
  }

  let targetCount = 0;
  for (let i = 0; i < nPath; i++) if (path.visible[i]) targetCount++;
  const targetX = new Float64Array(targetCount);
  const targetY = new Float64Array(targetCount);
  let ti = 0;
  for (let i = 0; i < nPath; i++) {
    if (path.visible[i]) {
      targetX[ti] = path.x[i];
      targetY[ti] = path.y[i];
      ti++;
    }
  }
  const beadLit = lit;
  const refErr = trailError(beadX, beadY, beadLit, targetX, targetY).max;

  let litLength = 0;
  for (let i = 0; i < nPath; i++) if (path.visible[i]) litLength += path.ds[i];
  const litSpeeds: number[] = [];
  for (let i = 0; i < n; i++) if (lit[i]) litSpeeds.push(speed[i]);

  const metrics: Record<string, number> = {
    periodMs: periodS * 1e3,
    refreshHz: 1 / periodS,
    lengthMm: path.length * 1e3,
    litMm: litLength * 1e3,
    toppPeriodMs: tMin * 1e3,
    vMaxMmS: maxOf(speed) * 1e3,
    vLitMeanMmS: average(litSpeeds) * 1e3,
    aMaxMS2: maxOf(Float64Array.from(sh.accel)),
    jerkMaxMS3: maxOf(sh.jerk),
    forceUse: sh.worst,
    leadMaxMm: maxHypot(leadX, leadY) * 1e3,
    refErrMm: refErr * 1e3,
    shapePredMm: sh.pred * 1e3,
    jerkWindowMs: (sh.window / GRID_HZ) * 1e3,
    trapHz: Math.sqrt((model.fMax * 0.5 * Math.PI / model.dPk) / model.mass) / (2 * Math.PI),
    trapAccelMaxMS2: model.fMax / model.mass,
    points: npts,
    level,
    offaxisForceMin: 1
  };
  let fallMin = Infinity;
  for (let i = 0; i < fFall.length; i++) if (fFall[i] < fallMin) fallMin = fFall[i];
  metrics.offaxisForceMin = fallMin;

  if (fallMin < OFFAXIS_WARN) {
    warnings.push(
      `the figure reaches ${(Math.sqrt(-Math.log(fallMin)) * model.offaxisR0 * 1e3).toFixed(0)} mm ` +
        `off the array axis, where the trap keeps only ${(fallMin * 100).toFixed(0)}% of its force; ` +
        'centre or shrink it to draw faster'
    );
  }

  const result: Plan = {
    name: planar.name,
    periodS,
    points,
    palette: color.palette,
    paletteSpinX10: color.spinX10,
    focusZUm: zUm,
    rateHz: pc.outputRateHz,
    rampMs: pc.rampMs,
    level,
    t: sh.tt,
    beadX,
    beadY,
    trapX,
    trapY,
    ledR,
    ledG,
    ledB,
    speed,
    accel: sh.accel,
    simBeadX: null,
    simBeadY: null,
    targetX,
    targetY,
    beadLit,
    metrics,
    warnings,
    path,
    trapModel: model
  };
  if (verify) verifyPlan(cfg, model, result);
  return result;
}

function maxOf(values: ArrayLike<number>): number {
  let max = -Infinity;
  for (let i = 0; i < values.length; i++) if (values[i] > max) max = values[i];
  return max;
}

function average(values: ArrayLike<number>): number {
  if (values.length === 0) return 0;
  let sum = 0;
  for (let i = 0; i < values.length; i++) sum += values[i];
  return sum / values.length;
}

function maxHypot(x: ArrayLike<number>, y: ArrayLike<number>): number {
  let max = 0;
  for (let i = 0; i < x.length; i++) {
    const d = Math.hypot(x[i], y[i]);
    if (d > max) max = d;
  }
  return max;
}

function mod1(value: number): number {
  const r = value % 1;
  return r < 0 ? r + 1 : r;
}

function falloff_A(model: TrapModel, x: number, y: number): number {
  if (model.offaxisR0 <= 0) return 1;
  return Math.exp(-(x * x + y * y) / (model.offaxisR0 * model.offaxisR0));
}

export function plan(cfg: AppConfig, name: string, options: PlanOptions = {}): Plan {
  const planar = options.planar ?? placeShape(cfg, name);
  const budget = Math.min(
    Math.trunc(cfg.planner.maxPoints),
    Math.trunc(options.maxPoints ?? cfg.planner.maxPoints)
  );
  return planOnce(cfg, planar, options.verify ?? true, budget, options.periodS);
}

export interface DeviceFrames {
  phase: Float64Array;
  x: Float64Array;
  y: Float64Array;
  level: Float64Array;
  palette: Float64Array;
}

/** Trap positions (m) the firmware will emit for each frame, ramp included. */
export function deviceFrames(result: Plan, durationS: number, rampS: number, linear = false): DeviceFrames {
  const { xyzUm, level, palettePos } = pointsArrays(result.points, result.palette.length);
  const phase = framePhases(result.periodS, result.rateHz, durationS, rampS);
  const sampled = samplePath(xyzUm, level, palettePos, phase, linear, result.palette.length);
  return {
    phase,
    x: Float64Array.from(sampled.x, (v) => v * 1e-6),
    y: Float64Array.from(sampled.y, (v) => v * 1e-6),
    level: sampled.level,
    palette: sampled.palette
  };
}

/** Largest per-element carrier phase change between consecutive frames. */
export function phaseStepDeg(
  trapX: ArrayLike<number>,
  trapY: ArrayLike<number>,
  focusZ: number,
  elements: Float64Array,
  trapMode = 0
): number {
  const k = (2 * Math.PI * 40000) / 343;
  const count = elements.length / 3;
  const frames = trapX.length;
  let previous = new Float64Array(count);
  let max = 0;
  for (let f = 0; f < frames; f++) {
    const current = new Float64Array(count);
    for (let j = 0; j < count; j++) {
      const ex = elements[j * 3] - trapX[f];
      const ey = elements[j * 3 + 1] - trapY[f];
      const ez = elements[j * 3 + 2] - focusZ;
      let phi = -k * Math.hypot(ex, ey, ez);
      if (trapMode === TRAP_DARK_VORTEX) phi += Math.atan2(ey, ex);
      current[j] = phi;
      if (f > 0) {
        let d = current[j] - previous[j];
        d = ((d + Math.PI) % (2 * Math.PI)) - Math.PI;
        const deg = Math.abs(d) * (180 / Math.PI);
        if (deg > max) max = deg;
      }
    }
    previous = current;
  }
  return max;
}

function onFrames(x: Float64Array, phase: Float64Array): Float64Array {
  const n = x.length;
  const ext = new Float64Array(n + 1);
  ext.set(x);
  ext[n] = x[0];
  const out = new Float64Array(phase.length);
  for (let i = 0; i < phase.length; i++) out[i] = interp(phase[i] * n, INDEX_CACHE(n), ext);
  return out;
}

const indexCache = new Map<number, Float64Array>();
function INDEX_CACHE(n: number): Float64Array {
  let arr = indexCache.get(n);
  if (!arr) {
    arr = new Float64Array(n + 1);
    for (let i = 0; i <= n; i++) arr[i] = i;
    indexCache.set(n, arr);
  }
  return arr;
}

/** Emulate the device and simulate the bead; attach metrics and warnings. */
export function verifyPlan(cfg: AppConfig, model: TrapModel, result: Plan): void {
  const pc = cfg.planner;
  const rampS = pc.rampMs * 1e-3;
  const tau = (2 * model.mass) / Math.max(dampingC(model), 1e-12);
  const settle = Math.min(Math.max(0.6, 5 * tau), 3.0);
  const loops = Math.max(3, Math.ceil(settle / result.periodS));
  const duration = rampS + (loops + 1) * result.periodS;
  const frames = deviceFrames(result, duration, rampS, pc.interpolation === 'linear');
  const rate = result.rateHz;
  const total = frames.phase.length;
  const lastStart = total - pyRound(result.periodS * rate);
  const steadyStart = Math.min(pyRound((rampS + settle) * rate), lastStart);
  const litDev = new Uint8Array(total - lastStart);
  for (let i = lastStart; i < total; i++) litDev[i - lastStart] = frames.level[i] > 0 ? 1 : 0;

  const idealX = onFrames(result.trapX, frames.phase);
  const idealY = onFrames(result.trapY, frames.phase);
  const wantX = onFrames(result.beadX, frames.phase);
  const wantY = onFrames(result.beadY, frames.phase);
  let recon = 0;
  let step = 0;
  for (let i = lastStart; i < total; i++) {
    const d = Math.hypot(frames.x[i] - idealX[i], frames.y[i] - idealY[i]);
    if (d > recon) recon = d;
    if (i > 0) {
      const s2 = Math.hypot(frames.x[i] - frames.x[i - 1], frames.y[i] - frames.y[i - 1]);
      if (s2 > step) step = s2;
    }
  }

  const rfe = pc.robustForceError;
  const scales = [1, 1 - rfe, 1 + rfe];
  let worstErr = 0;
  let worstSlip = 0;
  let worstShape = 0;
  let simLastX: Float64Array | null = null;
  let simLastY: Float64Array | null = null;
  const runs: Array<[number, number, number]> = [];
  const shapes: TrailError[] = [];
  for (let i = 0; i < scales.length; i++) {
    const state = simulate(model, frames.x, frames.y, rate, { forceScale: scales[i] });
    const lastCount = total - lastStart;
    let errMax = 0;
    let errSum = 0;
    const lastX = new Float64Array(lastCount);
    const lastY = new Float64Array(lastCount);
    for (let k = 0; k < lastCount; k++) {
      const frame = lastStart + k;
      const dx = state.data[frame * 4] - wantX[frame];
      const dy = state.data[frame * 4 + 1] - wantY[frame];
      const e = Math.hypot(dx, dy);
      if (e > errMax) errMax = e;
      errSum += e * e;
      lastX[k] = state.data[frame * 4];
      lastY[k] = state.data[frame * 4 + 1];
    }
    let offsetMax = 0;
    let slip = 0;
    for (let k = 0; k < total; k++) {
      const d = Math.hypot(state.data[k * 4] - frames.x[k], state.data[k * 4 + 1] - frames.y[k]);
      if (d > offsetMax) offsetMax = d;
      if (k >= steadyStart && d > slip) slip = d;
    }
    runs.push([errMax, Math.sqrt(errSum / lastCount), offsetMax]);
    if (slip > worstSlip) worstSlip = slip;
    const shape = trailError(lastX, lastY, litDev, result.targetX, result.targetY);
    shapes.push(shape);
    if (errMax > worstErr) worstErr = errMax;
    if (shape.max > worstShape) worstShape = shape.max;
    if (i === 0) {
      simLastX = lastX;
      simLastY = lastY;
    }
  }
  let worstOffset = 0;
  for (const r of runs) if (r[2] > worstOffset) worstOffset = r[2];

  const offsetLimit = model.basin > 0 ? model.basin : 2 * model.dPk;
  const slipLimit = SLIP_MARGIN * Math.min(model.dPk, 0.6 * offsetLimit);
  const elements = elementPositionsM().xyz;
  result.simBeadX = simLastX;
  result.simBeadY = simLastY;
  result.metrics.trackErrMm = runs[0][0] * 1e3;
  result.metrics.trackRmsMm = runs[0][1] * 1e3;
  result.metrics.trackErrWorstMm = worstErr * 1e3;
  result.metrics.offsetWorstMm = worstOffset * 1e3;
  result.metrics.offsetSteadyMm = worstSlip * 1e3;
  result.metrics.shapeErrMm = shapes[0].max * 1e3;
  result.metrics.shapeRmsMm = shapes[0].rms * 1e3;
  result.metrics.shapeErrWorstMm = worstShape * 1e3;
  result.metrics.offsetNominalMm = runs[0][2] * 1e3;
  result.metrics.offsetLimitMm = offsetLimit * 1e3;
  result.metrics.slipLimitMm = slipLimit * 1e3;
  result.metrics.reconErrMm = recon * 1e3;
  result.metrics.frameStepMm = step * 1e3;
  result.metrics.phaseStepDeg = phaseStepDeg(
    frames.x,
    frames.y,
    result.focusZUm * 1e-6,
    elements,
    trapModeOf(cfg)
  );

  if (runs[0][2] > offsetLimit) {
    result.warnings.push(
      `LOST: at the modelled lateral strength the simulated bead lags the trap by ${(runs[0][2] * 1e3).toFixed(2)} mm ` +
        `(> ${(offsetLimit * 1e3).toFixed(1)} mm, the escape radius) - lower the refresh, raise the draw level, ` +
        `or measure the strength (spin test)`
    );
  } else if (worstOffset > offsetLimit) {
    result.warnings.push(
      `at risk: the bead escapes in the simulation if the trap is ${(rfe * 100).toFixed(0)}% weaker than modelled - ` +
        'run the spin test, or keep a margin on the refresh'
    );
  } else if (worstSlip > slipLimit) {
    result.warnings.push(
      `simulated bead is pushed ${(worstSlip * 1e3).toFixed(2)} mm off the trap, near the force peak ` +
        `(${(model.dPk * 1e3).toFixed(1)} mm) where it slips and bends the trail - lower the refresh or raise the draw level`
    );
  } else if (worstShape > pc.maxTrackingErrorMm * 1e-3) {
    result.warnings.push(
      `shape distortion up to ${(worstShape * 1e3).toFixed(2)} mm if the lateral strength is ` +
        `${(rfe * 100).toFixed(0)}% off; the spin test calibrates it`
    );
  }
  if (recon > 0.15e-3) {
    result.warnings.push(
      `device interpolation error ${(recon * 1e3).toFixed(2)} mm: the path needs more than ${result.points.length} points - ` +
        'slow it down or shrink it'
    );
  }
  if (result.periodS > 1 / 8) {
    result.warnings.push(
      `refresh ${(1 / result.periodS).toFixed(1)} Hz is below persistence of vision; use a long camera exposure or a smaller shape`
    );
  }
}




