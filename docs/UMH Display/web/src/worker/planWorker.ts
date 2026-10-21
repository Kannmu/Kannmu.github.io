/// <reference lib="webworker" />
/**
 * Planning / field worker.  Planning takes tens of milliseconds and field maps
 * a few hundred, so both run off the main thread and the UI never stutters.
 */
import { plan } from '../motion/planner.ts';
import type { AppConfig } from '../config/types.ts';
import { fieldShape, FieldModel } from '../physics/field.ts';
import { FreeSpace, bottlePhase } from '../physics/bottle.ts';

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
  heightMm: number;
  extentMm: number;
  grid: number;
  bead: { diameterMm: number; densityKgM3: number };
}

interface GunSliceRequest {
  type: 'gun-slice';
  id: number;
  coordinatesUm: Array<[number, number, number]>;
  xMm: number;
  yMm: number;
  heightMm: number;
  splitMm: number;
  xHalfMm: number;
  zMaxMm: number;
  gridX: number;
  gridZ: number;
}

type Request = PlanRequest | DisplayFieldRequest | GunSliceRequest | { type: 'warmup'; id: number };

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
    request.focusOffsetMm
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

function gunSlice(request: GunSliceRequest): FieldMapResponse {
  const space = new FreeSpace(request.coordinatesUm);
  const drive = bottlePhase(space, request.xMm, request.yMm, request.heightMm, request.splitMm);
  const nx = request.gridX;
  const nz = request.gridZ;
  const xHalf = request.xHalfMm;
  const zMax = request.zMaxMm;
  const values = new Float32Array(nx * nz);
  const k = (2 * Math.PI * 40000) / 343;
  const planeZ = space.planeZ;
  for (let iz = 0; iz < nz; iz++) {
    const height = (zMax * iz) / (nz - 1);
    const z = planeZ + height * 1e-3;
    for (let ix = 0; ix < nx; ix++) {
      const x = (-xHalf + (2 * xHalf * ix) / (nx - 1)) * 1e-3;
      let re = 0;
      let im = 0;
      for (let j = 0; j < space.channels; j++) {
        const dx = x - space.positions[j * 3];
        const dy = -space.positions[j * 3 + 1];
        const dz = z - space.positions[j * 3 + 2];
        const r = Math.sqrt(dx * dx + dy * dy + dz * dz);
        if (r < 1e-9) continue;
        const angle = k * r;
        const c = Math.cos(angle);
        const s = Math.sin(angle);
        const amp = 1 / r;
        // drive * exp(i k r) / r
        re += (drive.re[j] * c - drive.im[j] * s) * amp;
        im += (drive.re[j] * s + drive.im[j] * c) * amp;
      }
      values[iz * nx + ix] = re * re + im * im;
    }
  }
  const range = percentileRange(values);
  normalize(values, range.lo, range.hi);
  return { width: nx, height: nz, values, xMin: -xHalf, xMax: xHalf, yMin: 0, yMax: zMax };
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
      fieldShape({ diameterMm: 3, densityKgM3: 25 }, 95, 6, 0);
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
    if (request.type === 'gun-slice') {
      const result = gunSlice(request);
      reply({ type: 'slice-result', id: request.id, map: result }, [result.values.buffer]);
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
