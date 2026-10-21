/**
 * Bead-in-trap simulation: planar RK4 with the sine trap law, drag and gravity.
 * Port of ``umh_display/physics/dynamics.py`` (the numba kernel, plain TS).
 */
import { AIR_DENSITY, AIR_VISCOSITY, dampingC, drag, offsetForForce, type TrapModel } from './trap.ts';

export interface SimState {
  /** Flat [x, y, vx, vy] per device frame. */
  data: Float64Array;
  frames: number;
}

function accel(
  x: number, y: number, vx: number, vy: number,
  tx: number, ty: number,
  mass: number, radius: number, fMax: number, dPk: number,
  cLin: number, gY: number, kDrag: number,
  out: Float64Array
): void {
  const dx = tx - x;
  const dy = ty - y;
  const d = Math.sqrt(dx * dx + dy * dy);
  let fx = 0;
  let fy = 0;
  if (d > 1e-12) {
    const u = d / dPk;
    const f = u < 2 ? fMax * Math.sin(0.5 * Math.PI * u) : 0;
    fx = (f * dx) / d;
    fy = (f * dy) / d;
  }
  const v = Math.sqrt(vx * vx + vy * vy);
  const re = (AIR_DENSITY * v * 2 * radius) / AIR_VISCOSITY;
  const c = kDrag * (1 + 0.15 * Math.pow(re, 0.687)) + cLin;
  out[0] = (fx - c * vx) / mass;
  out[1] = (fy - c * vy) / mass - gY;
}

export interface SimOptions {
  startXyM?: readonly [number, number] | null;
  startV?: readonly [number, number] | null;
  forceScale?: number;
  substeps?: number;
}

/** Bead state after each device frame, trap held for the whole frame. */
export function simulate(
  model: TrapModel,
  trapX: ArrayLike<number>,
  trapY: ArrayLike<number>,
  rateHz: number,
  options: SimOptions = {}
): SimState {
  const n = trapX.length;
  const forceScale = options.forceScale ?? 1;
  const substeps = options.substeps ?? 2;
  const fMax0 = model.fMax * forceScale;
  const cLin = Math.max(dampingC(model) - 6 * Math.PI * AIR_VISCOSITY * model.radius, 0);
  let x0: number;
  let y0: number;
  if (options.startXyM) {
    [x0, y0] = options.startXyM;
  } else {
    const sag = model.gravityInPlane ? offsetForForce(model, model.mass * model.gravityInPlane) : 0;
    x0 = trapX[0];
    y0 = trapY[0] - sag;
  }
  let vx = options.startV?.[0] ?? 0;
  let vy = options.startV?.[1] ?? 0;
  const frameDt = 1 / rateHz;
  const h = frameDt / substeps;
  const kDrag = 6 * Math.PI * AIR_VISCOSITY * model.radius;
  const invR0Sq = model.offaxisR0 > 0 ? 1 / (model.offaxisR0 * model.offaxisR0) : 0;
  const out = new Float64Array(n * 4);
  const a1 = new Float64Array(2);
  const a2 = new Float64Array(2);
  const a3 = new Float64Array(2);
  const a4 = new Float64Array(2);

  let x = x0;
  let y = y0;
  for (let k = 0; k < n; k++) {
    const tx = trapX[k];
    const ty = trapY[k];
    const fMax = fMax0 * Math.exp(-(tx * tx + ty * ty) * invR0Sq);
    for (let s = 0; s < substeps; s++) {
      accel(x, y, vx, vy, tx, ty, model.mass, model.radius, fMax, model.dPk, cLin, model.gravityInPlane, kDrag, a1);
      const x2 = x + 0.5 * h * vx;
      const y2 = y + 0.5 * h * vy;
      const vx2 = vx + 0.5 * h * a1[0];
      const vy2 = vy + 0.5 * h * a1[1];
      accel(x2, y2, vx2, vy2, tx, ty, model.mass, model.radius, fMax, model.dPk, cLin, model.gravityInPlane, kDrag, a2);
      const x3 = x + 0.5 * h * vx2;
      const y3 = y + 0.5 * h * vy2;
      const vx3 = vx + 0.5 * h * a2[0];
      const vy3 = vy + 0.5 * h * a2[1];
      accel(x3, y3, vx3, vy3, tx, ty, model.mass, model.radius, fMax, model.dPk, cLin, model.gravityInPlane, kDrag, a3);
      const x4 = x + h * vx3;
      const y4 = y + h * vy3;
      const vx4 = vx + h * a3[0];
      const vy4 = vy + h * a3[1];
      accel(x4, y4, vx4, vy4, tx, ty, model.mass, model.radius, fMax, model.dPk, cLin, model.gravityInPlane, kDrag, a4);
      x += (h / 6) * (vx + 2 * vx2 + 2 * vx3 + vx4);
      y += (h / 6) * (vy + 2 * vy2 + 2 * vy3 + vy4);
      vx += (h / 6) * (a1[0] + 2 * a2[0] + 2 * a3[0] + a4[0]);
      vy += (h / 6) * (a1[1] + 2 * a2[1] + 2 * a3[1] + a4[1]);
    }
    out[k * 4] = x;
    out[k * 4 + 1] = y;
    out[k * 4 + 2] = vx;
    out[k * 4 + 3] = vy;
  }
  return { data: out, frames: n };
}

/** Air drag at speed v (re-exported for the planner's damping split). */
export { drag };
