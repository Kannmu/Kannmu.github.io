/**
 * Reduced trap model shared by the planner and the simulator.
 * Port of ``umh_display/physics/trap.py``: the force shape (d_pk, basin,
 * off-axis falloff) comes from the field model, the scale from the calibrated
 * lateral acceleration.
 */
import { clamp, G } from '../core/math.ts';
import { beadMassKg, dropLevelOf, lateralAccelOf, trapModeOf } from '../config/defaults.ts';
import type { AppConfig } from '../config/types.ts';
import { fieldShape } from './field.ts';

export const AIR_DENSITY = 1.2;
export const AIR_VISCOSITY = 1.81e-5;

/** MOTION_CONFIG level (0..255) -> FPGA duty level (0..128). */
export function wireDuty(configLevel: number): number {
  return (clamp(configLevel, 0, 255) * 128) / 255;
}

/** Radiated power relative to 50 % duty: fundamental of the square wave squared. */
export function acousticPower(configLevel: number): number {
  return Math.sin((Math.PI * wireDuty(configLevel)) / 256) ** 2;
}

export interface TrapModel {
  mass: number;
  radius: number;
  fMax: number;
  dPk: number;
  gravityInPlane: number;
  extraZeta: number;
  holdRatio: number;
  basin: number;
  heightMm: number;
  pumping: number;
  offaxisR0: number;
}

export function trapModelFromConfig(cfg: AppConfig, level?: number): TrapModel {
  const trap = cfg.trap;
  const activeLevel = level ?? trap.level;
  const mass = beadMassKg(cfg.bead.diameterMm, cfg.bead.densityKgM3);
  const mode = trapModeOf(cfg);
  let dPkMm = 3.5;
  let basinMm = 7;
  let heightMm = 0;
  let pumping = 0;
  let r0Mm = 0;
  try {
    const shape = fieldShape(cfg.bead, trap.tableDistanceMm, mode, trap.focusOffsetMm, {
      radiusMm: trap.patternRadiusMm,
      phaseSpan: trap.phaseSpan
    });
    dPkMm = shape.peakOffsetMm;
    basinMm = shape.basinMm;
    heightMm = shape.heightMm;
    pumping = shape.pumping;
    r0Mm = shape.offaxisR0Mm;
  } catch {
    // no axial well for this field: keep the historical constants so the
    // planner can still run and explain why the plan is infeasible
  }

  const power = acousticPower(activeLevel);
  const drop = dropLevelOf(cfg);
  const hold = drop ? power / Math.max(1e-9, acousticPower(drop)) : 0;
  let gPlane = 0;
  let a255 = lateralAccelOf(cfg);
  if (trap.mount === 'side') {
    gPlane = G;
    a255 = drop ? G / Math.max(1e-9, acousticPower(drop)) : lateralAccelOf(cfg);
  }
  return {
    mass,
    radius: cfg.bead.diameterMm * 0.5e-3,
    fMax: mass * Math.max(a255, 1e-6) * power,
    dPk: dPkMm * 1e-3,
    gravityInPlane: gPlane,
    extraZeta: trap.extraDampingRatio,
    holdRatio: hold,
    basin: basinMm * 1e-3,
    heightMm,
    pumping,
    offaxisR0: r0Mm * 1e-3
  };
}

export function forceAt(model: TrapModel, d: number): number {
  if (d < 0) d = -d;
  const x = clamp(d / model.dPk, 0, 2);
  const f = model.fMax * Math.sin(0.5 * Math.PI * x);
  return model.basin > 0 && d > model.basin ? 0 : f;
}

export function forceArray(model: TrapModel, d: ArrayLike<number>): Float64Array {
  const out = new Float64Array(d.length);
  for (let i = 0; i < d.length; i++) out[i] = forceAt(model, d[i]);
  return out;
}

export function escapeOffset(model: TrapModel): number {
  return model.basin > 0 ? model.basin : 2 * model.dPk;
}

export function leadLimit(model: TrapModel): number {
  return Math.min(model.dPk, 0.6 * escapeOffset(model));
}

export function offsetForForce(model: TrapModel, f: number): number {
  const ratio = clamp(f / model.fMax, 0, 1);
  return Math.min((model.dPk * Math.asin(ratio) * 2) / Math.PI, leadLimit(model));
}

export function offsetForForceArray(model: TrapModel, f: ArrayLike<number>): Float64Array {
  const out = new Float64Array(f.length);
  for (let i = 0; i < f.length; i++) out[i] = offsetForForce(model, f[i]);
  return out;
}

export function stiffness(model: TrapModel): number {
  return (model.fMax * 0.5 * Math.PI) / model.dPk;
}

export function naturalHz(model: TrapModel): number {
  return Math.sqrt(stiffness(model) / model.mass) / (2 * Math.PI);
}

export function accelMax(model: TrapModel): number {
  return model.fMax / model.mass;
}

/** Air drag magnitude with the Schiller-Naumann correction. */
export function drag(model: TrapModel, v: number): number {
  const speed = Math.abs(v);
  const re = (AIR_DENSITY * speed * 2 * model.radius) / AIR_VISCOSITY;
  return 6 * Math.PI * AIR_VISCOSITY * model.radius * speed * (1 + 0.15 * re ** 0.687);
}

export function dragArray(model: TrapModel, v: ArrayLike<number>): Float64Array {
  const out = new Float64Array(v.length);
  for (let i = 0; i < v.length; i++) out[i] = drag(model, v[i]);
  return out;
}

/** Linear damping (N s/m): Stokes plus the configured extra ratio. */
export function dampingC(model: TrapModel): number {
  const stokes = 6 * Math.PI * AIR_VISCOSITY * model.radius;
  return stokes + 2 * model.extraZeta * Math.sqrt(stiffness(model) * model.mass);
}

/** Lateral force scale (0..1] with the trap at x,y (m); array version. */
export function falloffAt(model: TrapModel, x: number, y: number): number {
  if (model.offaxisR0 <= 0) return 1;
  return Math.exp(-(x * x + y * y) / (model.offaxisR0 * model.offaxisR0));
}

export function falloffArray(model: TrapModel, x: ArrayLike<number>, y: ArrayLike<number>): Float64Array {
  const out = new Float64Array(x.length);
  for (let i = 0; i < x.length; i++) out[i] = falloffAt(model, x[i], y[i]);
  return out;
}

export function usableAccel(model: TrapModel, fraction: number): number {
  return Math.max(fraction * accelMax(model) - model.gravityInPlane, 0);
}

export function trapSummary(model: TrapModel): Record<string, number> {
  return {
    massMg: model.mass * 1e6,
    fMaxUN: model.fMax * 1e6,
    accelMaxMS2: accelMax(model),
    stiffnessNM: stiffness(model),
    naturalHz: naturalHz(model),
    holdRatio: model.holdRatio
  };
}

// ------------------------------------------------------------------ spin test
function orbitReach(model: TrapModel, fMax: number, omega: number, rTrap: number): number {
  const fall = falloffAt(model, rTrap, 0);
  const cLin = Math.max(dampingC(model) - 6 * Math.PI * AIR_VISCOSITY * model.radius, 0);
  const count = 4001;
  let best = 0;
  for (let i = 0; i < count; i++) {
    const rb = rTrap + ((2 * model.dPk * i) / (count - 1));
    const v = omega * rb;
    const fRad = model.mass * omega * omega * rb;
    const fTan = drag(model, v) + cLin * v;
    const f = Math.hypot(fRad, fTan);
    const ratio = f / (fMax * fall);
    if (!(ratio < 1) || f <= 0) continue;
    const d = (model.dPk * Math.asin(Math.min(ratio, 1)) * 2) / Math.PI;
    const reach = Math.hypot(rb - (d * fRad) / f, (d * fTan) / f);
    if (reach > best) best = reach;
  }
  return best;
}

/** Level-255 lateral acceleration whose orbit folds at fHz on this circle. */
export function spinFoldAccel(model: TrapModel, fHz: number, radiusM: number, level: number): number {
  const omega = 2 * Math.PI * fHz;
  let lo = 1e-7;
  let hi = 1.0;
  for (let i = 0; i < 80; i++) {
    const mid = Math.sqrt(lo * hi);
    // "the trap reaches the commanded circle" means the force is above the
    // fold; the fold itself is the smallest f_max for which that holds.
    if (orbitReach(model, mid, omega, radiusM) >= radiusM) hi = mid;
    else lo = mid;
  }
  return hi / (model.mass * Math.max(acousticPower(level), 1e-9));
}

/** Frequency at which the bead flies off a lead-free circle of radiusM. */
export function spinFoldHz(model: TrapModel, radiusM: number): number {
  let lo = 0.1;
  let hi = 500;
  for (let i = 0; i < 60; i++) {
    const mid = Math.sqrt(lo * hi);
    if (orbitReach(model, model.fMax, 2 * Math.PI * mid, radiusM) >= radiusM) lo = mid;
    else hi = mid;
  }
  return lo;
}

