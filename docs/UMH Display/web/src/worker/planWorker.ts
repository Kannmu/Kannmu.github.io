/// <reference lib="webworker" />
/**
 * Planning / field worker.  Planning takes tens of milliseconds and field maps
 * a few hundred, so both run off the main thread and the UI never stutters.
 */
import { plan } from '../motion/planner.ts';
import type { AppConfig } from '../config/types.ts';
import { fieldShape, FieldModel } from '../physics/field.ts';

interface PlanRequest {
  type: 'plan';
  id: number;
  cfg: AppConfig;
  name: string;
  maxPoints?: number;
  periodS?: number;
}

interface DisplayFieldRequest {
  type: 'display-field';
  id: number;
  mode: number;
  tableDistanceMm: number;
  focusOffsetMm: number;
  radiusMm?: number;
  phaseSpan?: number;
  heightMm: number;
  extentMm: number;
  grid: number;
  bead: { diameterMm: number; densityKgM3: number };
}

type Request = PlanRequest | DisplayFieldRequest | { type: 'warmup'; id: number };

interface FieldMapResponse {
  width: number;
  height: number;
  values: Float32Array;
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
}

function percentileRange(values: Float32Array): { lo: number; hi: number } {
  const sample: number[] = [];
  const stride = Math.max(1, Math.floor(values.length / 4000));
  for (let i = 0; i < values.length; i += stride) sample.push(values[i]);
  sample.sort((a, b) => a - b);
  const pick = (q: number): number => sample[Math.min(sample.length - 1, Math.max(0, Math.floor(q * (sample.length - 1))))];
  return { lo: pick(0.02), hi: pick(0.98) };
}

function normalize(values: Float32Array, lo: number, hi: number): void {
  const span = Math.max(hi - lo, 1e-12);
  for (let i = 0; i < values.length; i++) values[i] = Math.max(0, Math.min(1, (values[i] - lo) / span));
}

function displayField(request: DisplayFieldRequest): FieldMapResponse {
  const model = new FieldModel(
    request.bead,
    request.tableDistanceMm,
    request.mode,
    [0, 0],
    request.focusOffsetMm,
    undefined,
    { radiusMm: request.radiusMm, phaseSpan: request.phaseSpan }
  );
  const n = request.grid;
  const half = request.extentMm * 0.5;
  const z = model.tableZ - request.heightMm * 1e-3;
  const points = new Float64Array(n * n * 3);
  for (let iy = 0; iy < n; iy++) {
    for (let ix = 0; ix < n; ix++) {
      const at = (iy * n + ix) * 3;
      points[at] = (-half + (2 * half * ix) / (n - 1)) * 1e-3;
      points[at + 1] = (-half + (2 * half * iy) / (n - 1)) * 1e-3;
      points[at + 2] = z;
    }
  }
  const pressure = model.pressure(points);
  const values = new Float32Array(n * n);
  for (let i = 0; i < values.length; i++) {
    values[i] = pressure.re[i] * pressure.re[i] + pressure.im[i] * pressure.im[i];
  }
  const range = percentileRange(values);
  normalize(values, range.lo, range.hi);
  return { width: n, height: n, values, xMin: -half, xMax: half, yMin: -half, yMax: half };
}

function reply(message: Record<string, unknown>, transfer?: Transferable[]): void {
  (self as unknown as DedicatedWorkerGlobalScope).postMessage(message, transfer ?? []);
}

(self as unknown as DedicatedWorkerGlobalScope).onmessage = (event: MessageEvent<Request>) => {
  const request = event.data;
  try {
    if (request.type === 'warmup') {
      const started = performance.now();
      fieldShape({ diameterMm: 3, densityKgM3: 25 }, 95, 0, 0);
      fieldShape({ diameterMm: 3, densityKgM3: 25 }, 95, 4, 0, { radiusMm: 2, phaseSpan: 0 });
      reply({ type: 'ready', id: request.id, ms: performance.now() - started });
      return;
    }
    if (request.type === 'plan') {
      const started = performance.now();
      const result = plan(request.cfg, request.name, {
        maxPoints: request.maxPoints,
        periodS: request.periodS
      });
      reply({
        type: 'plan-result',
        id: request.id,
        plan: result,
        ms: performance.now() - started
      });
      return;
    }
    if (request.type === 'display-field') {
      const result = displayField(request);
      reply({ type: 'field-result', id: request.id, map: result }, [result.values.buffer]);
      return;
    }
  } catch (error) {
    reply({
      type: 'error',
      id: (request as { id?: number }).id ?? -1,
      message: error instanceof Error ? error.message : String(error)
    });
  }
};
