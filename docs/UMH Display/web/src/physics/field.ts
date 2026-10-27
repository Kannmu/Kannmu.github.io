/**
 * Acoustic field of the 84-piston array firing at the table, and the Gor'kov
 * potential on the bead.  Faithful port of ``umh_display/physics/field.py``:
 * baffled pistons plus their rigid-reflector images, analytic pressure with a
 * locally constant piston directivity, and the derived trap-shape parameters
 * the planner consumes (d_pk, basin, off-axis falloff, rung heights).
 */
import { clamp, gradient, interp, linspace } from '../core/math.ts';
import { CARRIER_HZ, SOUND_SPEED_M_S, elementPositionsM, type ElementPositions } from '../geometry/elements.ts';
import type { BeadConfig } from '../config/types.ts';

export const RHO0 = 1.2;
export const K = (2 * Math.PI * CARRIER_HZ) / SOUND_SPEED_M_S;
export const OMEGA = 2 * Math.PI * CARRIER_HZ;
export const WAVELENGTH = SOUND_SPEED_M_S / CARRIER_HZ;
export const PISTON_RADIUS = 4.5e-3;

export const TRAP_FOCUS = 0;
export const TRAP_VORTEX = 6;

export interface ComplexField {
  re: Float64Array;
  im: Float64Array;
}

export interface GradField extends ComplexField {
  gre: Float64Array; // gradient xyz interleaved: [x,y,z] per point
  gim: Float64Array;
}

/** Bessel J1, series for the small arguments this model uses. */
export function besselJ1(x: number): number {
  const ax = Math.abs(x);
  if (ax < 1e-12) return 0.5 * x;
  if (ax < 10) {
    const half = x * 0.5;
    let term = half;
    let sum = half;
    const x2 = -half * half;
    for (let k = 1; k < 48; k++) {
      term *= x2 / (k * (k + 1));
      sum += term;
      if (Math.abs(term) < Math.abs(sum) * 1e-17) break;
    }
    return sum;
  }
  return Math.sqrt(2 / (Math.PI * ax)) * Math.cos(ax - (3 * Math.PI) / 4);
}

export interface DriveField {
  re: Float64Array;
  im: Float64Array;
}

/** Firmware-rendered complex drive per element (phase corrections aside), |q| <= 1. */
export function elementDrive(
  trapMode: number,
  focus: readonly [number, number, number],
  src: ElementPositions,
  radius = 2e-3,
  phaseSpan = 0
): DriveField {
  const n = src.count;
  const re = new Float64Array(n);
  const im = new Float64Array(n);
  if (trapMode === TRAP_VORTEX) {
    for (let j = 0; j < n; j++) {
      const ex = src.xyz[j * 3] - focus[0];
      const ey = src.xyz[j * 3 + 1] - focus[1];
      const ez = src.xyz[j * 3 + 2] - focus[2];
      const phase = Math.atan2(ey, ex) - K * Math.hypot(ex, ey, ez);
      re[j] = Math.cos(phase);
      im[j] = Math.sin(phase);
    }
    return { re, im };
  }

  const r = Math.max(radius, 0.5e-3);
  const span = phaseSpan === 0 ? 256 : phaseSpan;
  const ring: Array<[number, number, number]> = [];
  for (let i = 0; i < 8; i++) {
    const a = (2 * Math.PI * i) / 8;
    ring.push([r * Math.cos(a), r * Math.sin(a), 0]);
  }
  let offsets: Array<[number, number, number]>;
  let phases: number[];
  switch (trapMode) {
    case 1:
      offsets = [[0, 0, r], [0, 0, -r]];
      phases = [0, Math.PI];
      break;
    case 2:
      offsets = [[0, r, 0], [0, -r, 0]];
      phases = [0, Math.PI];
      break;
    case 3:
      offsets = ring;
      phases = ring.map((_, i) => Math.PI * (i & 1));
      break;
    case 4:
      offsets = ring;
      phases = ring.map((_, i) => (2 * Math.PI * Math.floor((i * span) / 8)) / 256);
      break;
    case 5:
      offsets = [
        ...ring.filter((_, i) => i % 2 === 0).map(([x, y]): [number, number, number] => [x, y, 0.5 * r]),
        ...ring.filter((_, i) => i % 2 === 0).map(([x, y]): [number, number, number] => [x, y, -0.5 * r])
      ];
      phases = [0, 0, 0, 0, Math.PI, Math.PI, Math.PI, Math.PI];
      break;
    default:
      offsets = [[0, 0, 0]];
      phases = [0];
  }

  const qRe = new Float64Array(n);
  const qIm = new Float64Array(n);
  const inv = 1 / Math.sqrt(offsets.length);
  for (let p = 0; p < offsets.length; p++) {
    const [ox, oy, oz] = offsets[p];
    const ph = phases[p];
    for (let j = 0; j < n; j++) {
      const dx = src.xyz[j * 3] - (focus[0] + ox);
      const dy = src.xyz[j * 3 + 1] - (focus[1] + oy);
      const dz = src.xyz[j * 3 + 2] - (focus[2] + oz);
      const d = Math.hypot(dx, dy, dz);
      const angle = ph - K * d;
      qRe[j] += Math.cos(angle) * inv;
      qIm[j] += Math.sin(angle) * inv;
    }
  }
  for (let j = 0; j < n; j++) {
    const mag = Math.hypot(qRe[j], qIm[j]);
    if (mag > 1) {
      qRe[j] /= mag;
      qIm[j] /= mag;
    }
    re[j] = qRe[j];
    im[j] = qIm[j];
  }
  return { re, im };
}

/** Piston directivity for the angle cosine of one element->point ray. */
export function directivity(cosT: number): number {
  const arg = K * PISTON_RADIUS * Math.sqrt(clamp(1 - cosT * cosT, 0, 1));
  let out = 1;
  if (arg > 1e-9) out = (2 * besselJ1(arg)) / arg;
  return cosT > 0 ? out : 0;
}

export interface PatternOptions {
  /** Ring radius / twin separation in millimetres (firmware clamps to >= 0.5). */
  radiusMm?: number;
  /** Vortex span in carrier units; 0 means one full turn, exactly like the MCU. */
  phaseSpan?: number;
}

const PATTERN_RADIUS_DEFAULT_MM = 2.0;

export class FieldModel {
  readonly src: ElementPositions;
  readonly tableZ: number;
  readonly trapMode: number;
  readonly focus: [number, number, number];
  readonly drive: DriveField;
  readonly image: Float64Array;
  readonly k1: number;
  readonly k2: number;
  readonly beadRadius: number;
  readonly bead: BeadConfig;
  readonly tableDistanceMm: number;
  readonly focusOffsetMm: number;
  readonly patternRadiusMm: number;
  readonly phaseSpan: number;

  constructor(
    bead: BeadConfig,
    tableDistanceMm: number,
    trapMode: number,
    focusXYMm: readonly [number, number] = [0, 0],
    focusOffsetMm = 0,
    src?: ElementPositions,
    pattern: PatternOptions = {}
  ) {
    this.bead = { ...bead };
    this.tableDistanceMm = tableDistanceMm;
    this.focusOffsetMm = focusOffsetMm;
    this.patternRadiusMm = pattern.radiusMm ?? PATTERN_RADIUS_DEFAULT_MM;
    this.phaseSpan = pattern.phaseSpan ?? 0;
    this.src = src ?? elementPositionsM();
    let zSum = 0;
    for (let j = 0; j < this.src.count; j++) zSum += this.src.xyz[j * 3 + 2];
    this.tableZ = zSum / this.src.count + tableDistanceMm * 1e-3;
    this.trapMode = trapMode;
    this.focus = [focusXYMm[0] * 1e-3, focusXYMm[1] * 1e-3, this.tableZ + focusOffsetMm * 1e-3];
    this.drive = elementDrive(trapMode, this.focus, this.src, this.patternRadiusMm * 1e-3, this.phaseSpan);
    this.image = new Float64Array(this.src.xyz.length);
    for (let j = 0; j < this.src.count; j++) {
      this.image[j * 3] = this.src.xyz[j * 3];
      this.image[j * 3 + 1] = this.src.xyz[j * 3 + 1];
      this.image[j * 3 + 2] = 2 * this.tableZ - this.src.xyz[j * 3 + 2];
    }
    const r = bead.diameterMm * 0.5e-3;
    const v = (4 / 3) * Math.PI * r ** 3;
    const f2 = (2 * (bead.densityKgM3 - RHO0)) / (2 * bead.densityKgM3 + RHO0);
    this.k1 = v / (4 * RHO0 * SOUND_SPEED_M_S ** 2);
    this.k2 = (3 * v * f2) / (8 * RHO0 * OMEGA ** 2);
    this.beadRadius = r;
  }

  zOfHeight(h: number): number {
    return this.tableZ - h;
  }

  /** Complex pressure and analytic gradient at points given as flat xyz (m). */
  pressure(points: Float64Array): GradField {
    const n = points.length / 3;
    const re = new Float64Array(n);
    const im = new Float64Array(n);
    const gre = new Float64Array(n * 3);
    const gim = new Float64Array(n * 3);
    this.accumulate(points, re, im, gre, gim);
    return { re, im, gre, gim };
  }

  /** Gor'kov potential (J, for a 1 Pa*m source); gravity not included. */
  potential(points: Float64Array): Float64Array {
    const n = points.length / 3;
    const re = new Float64Array(n);
    const im = new Float64Array(n);
    const gre = new Float64Array(n * 3);
    const gim = new Float64Array(n * 3);
    this.accumulate(points, re, im, gre, gim);
    const out = new Float64Array(n);
    for (let i = 0; i < n; i++) {
      const p2 = re[i] * re[i] + im[i] * im[i];
      let g2 = 0;
      for (let c = 0; c < 3; c++) {
        const a = gre[i * 3 + c];
        const b = gim[i * 3 + c];
        g2 += a * a + b * b;
      }
      out[i] = this.k1 * p2 - this.k2 * g2;
    }
    return out;
  }

  /** Time-averaged acoustic intensity vector (W/m^2 for a 1 Pa*m source). */
  intensity(points: Float64Array): Float64Array {
    const { re, im, gre, gim } = this.pressure(points);
    const n = re.length;
    const out = new Float64Array(n * 3);
    const scale = 1 / (2 * OMEGA * RHO0);
    for (let i = 0; i < n; i++) {
      for (let c = 0; c < 3; c++) {
        // Im(conj(p) * grad) = p_re*g_im - p_im*g_re
        out[i * 3 + c] = (re[i] * gim[i * 3 + c] - im[i] * gre[i * 3 + c]) * scale;
      }
    }
    return out;
  }

  private accumulate(
    points: Float64Array,
    pRe: Float64Array,
    pIm: Float64Array,
    gRe: Float64Array,
    gIm: Float64Array
  ): void {
    const n = points.length / 3;
    const count = this.src.count;
    const s = this.src.xyz;
    const img = this.image;
    const dr = this.drive.re;
    const di = this.drive.im;
    const k = K;
    for (let pass = 0; pass < 2; pass++) {
      const sign = pass === 0 ? 1 : -1;
      const src = pass === 0 ? s : img;
      for (let i = 0; i < n; i++) {
        const x = points[i * 3];
        const y = points[i * 3 + 1];
        const z = points[i * 3 + 2];
        let pr = pRe[i];
        let pi = pIm[i];
        let gxr = gRe[i * 3];
        let gxi = gIm[i * 3];
        let gyr = gRe[i * 3 + 1];
        let gyi = gIm[i * 3 + 1];
        let gzr = gRe[i * 3 + 2];
        let gzi = gIm[i * 3 + 2];
        for (let j = 0; j < count; j++) {
          const dx = x - src[j * 3];
          const dy = y - src[j * 3 + 1];
          const dz = z - src[j * 3 + 2];
          const r = Math.sqrt(dx * dx + dy * dy + dz * dz);
          if (r < 1e-12) continue;
          const dir = directivity((sign * dz) / r);
          if (dir === 0) continue;
          const theta = k * r;
          const c = Math.cos(theta);
          const sn = Math.sin(theta);
          const amp = dir / r;
          const drv = dr[j];
          const dvi = di[j];
          const gr = (drv * c - dvi * sn) * amp;
          const gi = (drv * sn + dvi * c) * amp;
          pr += gr;
          pi += gi;

          const fr = -1 / (r * r);
          const fi = k / r;
          // (gr + i gi) * (fr + i fi)
          const hr = gr * fr - gi * fi;
          const hi = gr * fi + gi * fr;
          gxr += hr * dx;
          gxi += hi * dx;
          gyr += hr * dy;
          gyi += hi * dy;
          gzr += hr * dz;
          gzi += hi * dz;
        }
        pRe[i] = pr;
        pIm[i] = pi;
        gRe[i * 3] = gxr;
        gIm[i * 3] = gxi;
        gRe[i * 3 + 1] = gyr;
        gIm[i * 3 + 1] = gyi;
        gRe[i * 3 + 2] = gzr;
        gIm[i * 3 + 2] = gzi;
      }
    }
  }

  /**
   * Standing-wave rungs along z, and the peak upward force each offers.
   * Port of ``axial_wells``.
   */
  axialWells(hMaxMm = 30, x = 0, y = 0): AxialWell[] {
    const n = Math.trunc(hMaxMm * 60);
    const h = linspace(this.beadRadius, hMaxMm * 1e-3, n);
    const z = new Float64Array(n);
    const pts = new Float64Array(n * 3);
    for (let i = 0; i < n; i++) {
      z[i] = this.tableZ - h[i];
      pts[i * 3] = x;
      pts[i * 3 + 1] = y;
      pts[i * 3 + 2] = z[i];
    }
    const u = this.potential(pts);
    const du = gradient(u, z);
    const wells: AxialWell[] = [];
    for (let i = 1; i < n - 1; i++) {
      if (u[i] < u[i - 1] && u[i] <= u[i + 1]) {
        let j = i;
        while (j > 0 && u[j - 1] >= u[j]) j--;
        let peak = -Infinity;
        for (let k = j; k <= i; k++) if (du[k] > peak) peak = du[k];
        wells.push({ heightMm: h[i] * 1e3, z: z[i], forceUp: peak });
      }
    }
    return wells;
  }

  /**
   * Lateral restoring force towards the trap centre vs offset along ±x, bead
   * free to settle in z (port of ``lateral_law``).
   */
  lateralLaw(
    z0: number,
    xMaxMm = 9,
    relaxMm = 1.2,
    y = 0,
    sign = 1
  ): { xs: Float64Array; force: Float64Array } {
    const xs = linspace(0, xMaxMm * 1e-3, Math.trunc(xMaxMm * 5) + 1);
    const zz = new Float64Array(Math.trunc(relaxMm * 10) * 2 + 1);
    for (let i = 0; i < zz.length; i++) {
      zz[i] = z0 + (-relaxMm + (2 * relaxMm * i) / (zz.length - 1)) * 1e-3;
    }
    const u = new Float64Array(xs.length);
    for (let ix = 0; ix < xs.length; ix++) {
      const px = sign * xs[ix] + this.focus[0];
      const py = y + this.focus[1];
      let best = Infinity;
      for (let iz = 0; iz < zz.length; iz++) {
        const value = this.potentialPoint(px, py, zz[iz]);
        if (value < best) best = value;
      }
      u[ix] = best;
    }
    return { xs, force: gradient(u, xs) };
  }

  /** Single-point potential, allocation-free (used by the lateral law). */
  potentialPoint(x: number, y: number, z: number): number {
    let pRe = 0;
    let pIm = 0;
    let gReX = 0;
    let gImX = 0;
    let gReY = 0;
    let gImY = 0;
    let gReZ = 0;
    let gImZ = 0;
    const count = this.src.count;
    for (let pass = 0; pass < 2; pass++) {
      const sign = pass === 0 ? 1 : -1;
      const src = pass === 0 ? this.src.xyz : this.image;
      for (let j = 0; j < count; j++) {
        const dx = x - src[j * 3];
        const dy = y - src[j * 3 + 1];
        const dz = z - src[j * 3 + 2];
        const r = Math.sqrt(dx * dx + dy * dy + dz * dz);
        if (r < 1e-12) continue;
        const dir = directivity((sign * dz) / r);
        if (dir === 0) continue;
        const theta = K * r;
        const c = Math.cos(theta);
        const sn = Math.sin(theta);
        const amp = dir / r;
        const drv = this.drive.re[j];
        const dvi = this.drive.im[j];
        const gr = (drv * c - dvi * sn) * amp;
        const gi = (drv * sn + dvi * c) * amp;
        pRe += gr;
        pIm += gi;
        const fr = -1 / (r * r);
        const fi = K / r;
        const hr = gr * fr - gi * fi;
        const hi = gr * fi + gi * fr;
        gReX += hr * dx;
        gImX += hi * dx;
        gReY += hr * dy;
        gImY += hi * dy;
        gReZ += hr * dz;
        gImZ += hi * dz;
      }
    }
    const p2 = pRe * pRe + pIm * pIm;
    const g2 = gReX * gReX + gImX * gImX + gReY * gReY + gImY * gImY + gReZ * gReZ + gImZ * gImZ;
    return this.k1 * p2 - this.k2 * g2;
  }

  /** Equilibrium offset / commanded offset in the rung plane. */
  xyGain(z0: number, commandMm = 8): number {
    const m = new FieldModel(
      this.bead,
      this.tableDistanceMm,
      this.trapMode,
      [commandMm, 0],
      this.focusOffsetMm,
      this.src,
      { radiusMm: this.patternRadiusMm, phaseSpan: this.phaseSpan }
    );
    const xs = linspace((commandMm - 1.5) * 1e-3, (commandMm + 1.5) * 1e-3, 301);
    const pts = new Float64Array(xs.length * 3);
    for (let i = 0; i < xs.length; i++) {
      pts[i * 3] = xs[i];
      pts[i * 3 + 2] = z0;
    }
    const u = m.potential(pts);
    let idx = 0;
    for (let i = 1; i < u.length; i++) if (u[i] < u[idx]) idx = i;
    const clamped = Math.min(Math.max(idx, 1), xs.length - 2);
    const a = u[clamped - 1];
    const b = u[clamped];
    const c = u[clamped + 1];
    const dx = xs[1] - xs[0];
    const denom = a - 2 * b + c;
    const xEq = xs[clamped] + (denom !== 0 ? 0.5 * dx * ((a - c) / denom) : 0);
    return xEq / (commandMm * 1e-3);
  }
}

export interface AxialWell {
  heightMm: number;
  z: number;
  forceUp: number;
}

export interface FieldShape {
  trapMode: number;
  rungHeightsMm: number[];
  heightMm: number;
  axialForce: number;
  lateralPeak: number;
  lateralToAxial: number;
  peakOffsetMm: number;
  basinMm: number;
  xyGain: number;
  pumping: number;
  midForce: number;
  offaxisR0Mm: number;
}

export const OFFAXIS_PROBE_MM = 20.0;

/** Gaussian scale of the lateral-force loss when the trap is steered off axis. */
export function offaxisR0Mm(
  bead: BeadConfig,
  tableDistanceMm: number,
  trapMode: number,
  focusOffsetMm: number,
  onAxisPeak: number,
  probeMm = OFFAXIS_PROBE_MM,
  pattern: PatternOptions = {}
): number {
  const m = new FieldModel(bead, tableDistanceMm, trapMode, [probeMm, 0], focusOffsetMm, undefined, pattern);
  const wells = m.axialWells(12, m.focus[0], m.focus[1]);
  if (wells.length === 0 || onAxisPeak <= 0) return 0;
  const z0 = wells[0].z;
  let peak = Infinity;
  for (const sign of [1, -1]) {
    const { force } = m.lateralLaw(z0, 9, 1.2, 0, sign);
    let max = -Infinity;
    for (let i = 0; i < force.length; i++) if (force[i] > max) max = force[i];
    peak = Math.min(peak, max);
  }
  const ratio = peak / onAxisPeak;
  if (!(ratio > 0 && ratio < 0.999)) return 0;
  return probeMm / Math.sqrt(-Math.log(ratio));
}

function shapeOf(
  bead: BeadConfig,
  tableDistanceMm: number,
  trapMode: number,
  focusOffsetMm: number,
  pattern: PatternOptions = {}
): FieldShape {
  const model = new FieldModel(bead, tableDistanceMm, trapMode, [0, 0], focusOffsetMm, undefined, pattern);
  const wells = model.axialWells(30);
  if (wells.length === 0) throw new Error('no stable height on the axis for this field');
  const low = wells[0];
  const { xs, force } = model.lateralLaw(low.z);
  let edge = xs.length - 1;
  for (let i = 2; i < force.length; i++) {
    if (force[i] < 0) {
      edge = i;
      break;
    }
  }
  const stop = Math.min(edge + 1, force.length);
  let ipk = 0;
  for (let i = 1; i < stop; i++) if (force[i] > force[ipk]) ipk = i;
  const peak = force[ipk];

  const r = 0.5e-3;
  const probe = new Float64Array([r, 0, low.z]);
  const iPhi = model.intensity(probe)[1];
  const beta = (Math.PI * model.beadRadius ** 2 * iPhi) / SOUND_SPEED_M_S / r;
  const kLat = interp(r, xs, force) / r;

  const midHeight = tableDistanceMm * 0.5;
  const midWells = model.axialWells(midHeight + WAVELENGTH * 1e3);
  let midForce = 0;
  if (midWells.length > 0) {
    let best = midWells[0];
    for (const w of midWells) {
      if (Math.abs(w.heightMm - midHeight) < Math.abs(best.heightMm - midHeight)) best = w;
    }
    midForce = best.forceUp;
  }

  return {
    trapMode,
    rungHeightsMm: wells.map((w) => Math.round(w.heightMm * 100) / 100),
    heightMm: low.heightMm,
    axialForce: low.forceUp,
    lateralPeak: peak,
    lateralToAxial: peak / low.forceUp,
    peakOffsetMm: xs[ipk] * 1e3,
    basinMm: xs[edge] * 1e3,
    xyGain: model.xyGain(low.z),
    pumping: kLat > 0 ? Math.abs(beta) / kLat : Infinity,
    midForce,
    offaxisR0Mm: offaxisR0Mm(bead, tableDistanceMm, trapMode, focusOffsetMm, peak, OFFAXIS_PROBE_MM, pattern)
  };
}

const shapeCache = new Map<string, FieldShape>();

export function fieldShape(
  bead: BeadConfig,
  tableDistanceMm: number,
  trapMode: number,
  focusOffsetMm = 0,
  pattern: PatternOptions = {}
): FieldShape {
  const key = [
    Math.round(bead.diameterMm * 1000) / 1000,
    Math.round(bead.densityKgM3 * 1000) / 1000,
    Math.round(tableDistanceMm * 100) / 100,
    trapMode,
    Math.round(focusOffsetMm * 100) / 100,
    Math.round((pattern.radiusMm ?? PATTERN_RADIUS_DEFAULT_MM) * 100) / 100,
    Math.round((pattern.phaseSpan ?? 0) * 100) / 100
  ].join('|');
  const hit = shapeCache.get(key);
  if (hit) return hit;
  const shape = shapeOf(bead, tableDistanceMm, trapMode, focusOffsetMm, pattern);
  shapeCache.set(key, shape);
  return shape;
}

export function clearFieldShapeCache(): void {
  shapeCache.clear();
}

/** Lateral force law the planner uses (for the UI chart). */
export function trapForceCurve(
  bead: BeadConfig,
  tableDistanceMm: number,
  trapMode: number,
  focusOffsetMm = 0,
  pattern: PatternOptions = {}
): { xsMm: Float64Array; force: Float64Array } {
  const shape = fieldShape(bead, tableDistanceMm, trapMode, focusOffsetMm, pattern);
  const m = new FieldModel(bead, tableDistanceMm, trapMode, [0, 0], focusOffsetMm, undefined, pattern);
  const well = shape.heightMm * 1e-3;
  void well;
  const wells = m.axialWells(30);
  const z0 = wells[0]?.z ?? m.tableZ - 2e-3;
  const { xs, force } = m.lateralLaw(z0, 10);
  const xsMm = new Float64Array(xs.length);
  for (let i = 0; i < xs.length; i++) xsMm[i] = xs[i] * 1e3;
  return { xsMm, force };
}
