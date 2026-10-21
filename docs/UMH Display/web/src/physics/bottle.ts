/**
 * Single-sided bottle beam: focusing phase plus a half-turn step inside a disc.
 * Port of ``umh_display/physics/bottle.py``.  The host computes the 84-channel
 * phase pattern; the firmware's 0xA0 hologram path renders it.
 */
import { interp } from '../core/math.ts';
import { elementPositionsM, type ElementPositions } from '../geometry/elements.ts';
import { K } from './field.ts';

/** Disc radii over which the dark core stays on the commanded point. */
export const SPLIT_WORKING_MM: [number, number] = [28.0, 36.0];

/** (split radius, hollow-core radius) from studies/s6_bottle_up.py, aimed at 70 mm. */
export const SPLIT_TO_CORE: ReadonlyArray<readonly [number, number]> = [
  [28.0, 5.2],
  [30.0, 5.2],
  [32.0, 1.8],
  [34.0, 1.8],
  [36.0, 1.6]
];

export class FreeSpace {
  readonly aperture: ElementPositions;
  readonly positions: Float64Array;
  readonly radii: Float64Array;
  readonly apertureRadiusMm: number;
  readonly planeZ: number;

  constructor(coordinatesUm?: ReadonlyArray<readonly [number, number, number]> | null) {
    this.aperture = elementPositionsM(coordinatesUm);
    this.positions = this.aperture.xyz;
    const n = this.aperture.count;
    let cx = 0;
    let cy = 0;
    for (let i = 0; i < n; i++) {
      cx += this.positions[i * 3];
      cy += this.positions[i * 3 + 1];
    }
    cx /= n;
    cy /= n;
    this.radii = new Float64Array(n);
    let max = 0;
    for (let i = 0; i < n; i++) {
      const dx = this.positions[i * 3] - cx;
      const dy = this.positions[i * 3 + 1] - cy;
      this.radii[i] = Math.hypot(dx, dy);
      if (this.radii[i] > max) max = this.radii[i];
    }
    this.apertureRadiusMm = max * 1e3;
    let zSum = 0;
    for (let i = 0; i < n; i++) zSum += this.positions[i * 3 + 2];
    this.planeZ = zSum / n;
  }

  get channels(): number {
    return this.aperture.count;
  }

  /** Device z (m) of a height above the array face. */
  zOf(heightMm: number): number {
    return this.planeZ + heightMm * 1e-3;
  }

  heightOf(zM: number): number {
    return (zM - this.planeZ) * 1e3;
  }
}

export interface ComplexDrive {
  re: Float64Array;
  im: Float64Array;
}

/** Unit-modulus complex drive of the bottle: focus phase plus a disc step. */
export function bottlePhase(
  space: FreeSpace,
  xMm: number,
  yMm: number,
  heightMm: number,
  rSplitMm: number,
  innerPhase = Math.PI
): ComplexDrive {
  const n = space.channels;
  const tx = xMm * 1e-3;
  const ty = yMm * 1e-3;
  const tz = space.zOf(heightMm);
  const rSplit = rSplitMm * 1e-3;
  const re = new Float64Array(n);
  const im = new Float64Array(n);
  for (let j = 0; j < n; j++) {
    const dx = space.positions[j * 3] - tx;
    const dy = space.positions[j * 3 + 1] - ty;
    const dz = space.positions[j * 3 + 2] - tz;
    const d = Math.hypot(dx, dy, dz);
    const step = space.radii[j] <= rSplit ? innerPhase : 0;
    const phase = -K * d + step;
    re[j] = Math.cos(phase);
    im[j] = Math.sin(phase);
  }
  return { re, im };
}

/** Keep the disc radius inside the band where the core tracks the aim. */
export function clampSplit(space: FreeSpace, splitMm: number): number {
  const [lo, hi] = SPLIT_WORKING_MM;
  return Math.min(Math.max(splitMm, lo), Math.min(hi, space.apertureRadiusMm * 0.99));
}

/** Nominal hollow-core radius (mm) for a disc radius. */
export function coreRadius(splitMm: number): number {
  const xs = SPLIT_TO_CORE.map((entry) => entry[0]);
  const ys = SPLIT_TO_CORE.map((entry) => entry[1]);
  return interp(splitMm, xs, ys);
}
