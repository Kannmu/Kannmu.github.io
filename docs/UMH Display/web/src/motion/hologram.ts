/**
 * Hologram keyframe synthesis for the controller's device-side keyframe
 * executor (``hologram_engine.c``, message group 0xA0..0xA5).
 *
 * The host computes complete 84-channel holograms; the device interpolates
 * between consecutive keyframes on its own frame clock and submits the result
 * through the ordinary FPGA frame transaction.  Everything here is pure maths:
 * no DOM, no worker, no device access, so the same code drives the panel, the
 * offline preview and the tests.
 *
 * Phase convention matches the firmware's spatial renderer: a channel with
 * phase ``phi`` contributes ``exp(i(phi + k*|e_k - r|))``, so focusing on a
 * target means ``phi_k = -k*|e_k - r|`` modulo one turn.  For several targets
 * the complex contributions are summed first (time reversal / multi-focus
 * superposition), which is exactly what ``spatial_renderer_accumulate_point``
 * does on the MCU when a pattern is synthesised.
 */
import type { AppConfig } from '../config/types.ts';
import { focusZmmOf } from '../config/defaults.ts';
import { HOLOGRAM_CHANNELS, type HologramKeyframe } from '../device/protocol.ts';
import { ELEMENT_FACE_Z_MM, elementPositionsM, type ElementPositions } from '../geometry/elements.ts';
import { directivity, K } from '../physics/field.ts';
import { placeShape } from '../motion/planner.ts';
import type { FieldMap } from '../ui/charts.ts';

/** Full spatial amplitude: the firmware treats 128 as a 50 % duty carrier. */
export const HOLOGRAM_LEVEL_MAX = 128;
const PHASE_TURN = 256;

export interface HologramTarget {
  xMm: number;
  yMm: number;
  zMm: number;
  weight?: number;
}

export interface HologramQuality {
  /** Peak pressure on the target set over the mean level of the target plane. */
  peakToMean: number;
  /** Mean |p|^2 on the targets, normalised to one coherent focus at that range. */
  energy: number;
  /** Strongest unwanted level relative to the peak on the targets (dB, <= 0). */
  sidelobeDb: number;
}

export interface HologramOptions {
  coordinatesUm?: ReadonlyArray<readonly [number, number, number]> | null;
  /** Scale applied to the normalised amplitudes before the 0..128 clamp. */
  levelScale?: number;
}

export interface ShapeKeyframeOptions extends HologramOptions {
  /** Outline samples; 64 covers a 100 mm shape at ~1.5 mm spacing. */
  samples?: number;
  /** Target plane; defaults to the configured levitation focus. */
  zMm?: number;
}

export interface FieldMapOptions {
  /** Height above the table plane, millimetres. */
  heightMm: number;
  /** Square extent centred on the array axis, millimetres. */
  extentMm: number;
  /** Samples per axis. */
  grid: number;
  /** Array-to-table distance, only needed to place the plane in z. */
  tableDistanceMm?: number;
}

function requireChannels(frame: HologramKeyframe): void {
  if (frame.phase.length !== HOLOGRAM_CHANNELS || frame.level.length !== HOLOGRAM_CHANNELS) {
    throw new Error(`hologram frame must carry ${HOLOGRAM_CHANNELS} channels`);
  }
}

function wrapPhase(value: number): number {
  const turn = Math.round((value * PHASE_TURN) / (2 * Math.PI));
  return ((turn % PHASE_TURN) + PHASE_TURN) % PHASE_TURN;
}

/** Mean level (pressure amplitude) of a frame, for previews and sanity checks. */
export function meanLevel(frame: HologramKeyframe): number {
  requireChannels(frame);
  let sum = 0;
  for (let i = 0; i < HOLOGRAM_CHANNELS; i++) sum += frame.level[i];
  return sum / HOLOGRAM_CHANNELS;
}

/**
 * Multi-focus phase hologram: every channel gets the phase of the summed
 * time-reversed contribution of all targets, and an amplitude proportional to
 * how well that channel serves them all.
 */
export function synthesizeHologram(
  targets: HologramTarget[],
  options: HologramOptions = {}
): { frame: HologramKeyframe; quality: HologramQuality } {
  if (targets.length === 0) throw new Error('hologram synthesis needs at least one target');
  const src = elementPositionsM(options.coordinatesUm ?? null);
  const n = src.count;
  const scale = options.levelScale ?? 1;
  const re = new Float64Array(n);
  const im = new Float64Array(n);
  const rx = targets.map((t) => t.xMm * 1e-3);
  const ry = targets.map((t) => t.yMm * 1e-3);
  const rz = targets.map((t) => t.zMm * 1e-3);
  const rw = targets.map((t) => (t.weight === undefined ? 1 : t.weight));
  const xyz = src.xyz;
  for (let t = 0; t < targets.length; t++) {
    const w = rw[t];
    if (w === 0) continue;
    for (let k = 0; k < n; k++) {
      const dx = xyz[k * 3] - rx[t];
      const dy = xyz[k * 3 + 1] - ry[t];
      const dz = xyz[k * 3 + 2] - rz[t];
      const d = Math.sqrt(dx * dx + dy * dy + dz * dz);
      if (d < 1e-9) continue;
      /* Unit-magnitude time-reversed contribution: a single target therefore
       * gets a pure phase hologram at full amplitude on every channel, which
       * is the maximum-pressure focus the array can produce. */
      const angle = -K * d;
      re[k] += w * Math.cos(angle);
      im[k] += w * Math.sin(angle);
    }
  }
  const phase = new Uint8Array(HOLOGRAM_CHANNELS);
  const level = new Uint8Array(HOLOGRAM_CHANNELS);
  let weightSum = 0;
  for (let t = 0; t < rw.length; t++) weightSum += Math.abs(rw[t]);
  if (!(weightSum > 0)) throw new Error('hologram synthesis needs a non-zero total weight');
  for (let k = 0; k < n; k++) {
    phase[k] = wrapPhase(Math.atan2(im[k], re[k]));
    /* |sum| / sum(w) is 1 when every target agrees on this channel's phase and
     * drops where they fight, so the hologram keeps the pressure it can hold. */
    const amp = Math.hypot(re[k], im[k]) / weightSum;
    const value = amp * HOLOGRAM_LEVEL_MAX * scale;
    level[k] = Math.max(0, Math.min(HOLOGRAM_LEVEL_MAX, Math.round(value)));
  }
  return {
    frame: { phase, level },
    quality: qualityOf(targets, { phase, level }, src)
  };
}

/** Resample a closed polyline by arc length, so strokes get an even share. */
function resampleClosed(xs: ArrayLike<number>, ys: ArrayLike<number>, samples: number): Array<[number, number]> {
  const n = xs.length;
  if (n === 0) return [];
  const seg = new Float64Array(n);
  let total = 0;
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n;
    seg[i] = Math.hypot(xs[j] - xs[i], ys[j] - ys[i]);
    total += seg[i];
  }
  if (!(total > 0)) return [[xs[0], ys[0]]];
  const out: Array<[number, number]> = [];
  for (let s = 0; s < samples; s++) {
    const want = (s / samples) * total;
    let acc = 0;
    let i = 0;
    while (i < n - 1 && acc + seg[i] < want) {
      acc += seg[i];
      i++;
    }
    const j = (i + 1) % n;
    const u = seg[i] > 0 ? Math.min(1, (want - acc) / seg[i]) : 0;
    out.push([xs[i] + (xs[j] - xs[i]) * u, ys[i] + (ys[j] - ys[i]) * u]);
  }
  return out;
}

/**
 * One keyframe for a library shape or a text string, using the same placement
 * rules as the light-painting planner (``display.sizeMm`` / centre / text
 * height), so the morph lines up with what the bead would have drawn.
 */
export function shapeKeyframe(
  cfg: AppConfig,
  shapeName: string,
  options: ShapeKeyframeOptions = {}
): { frame: HologramKeyframe; quality: HologramQuality } {
  const planar = placeShape(cfg, shapeName);
  const samples = Math.max(8, Math.round(options.samples ?? 64));
  const outline = resampleClosed(planar.xMm, planar.yMm, samples);
  const zMm = options.zMm ?? focusZmmOf(cfg);
  const targets: HologramTarget[] = outline.map(([xMm, yMm]) => ({ xMm, yMm, zMm }));
  return synthesizeHologram(targets, options);
}

/**
 * The firmware's own 8-bit phase interpolation: both keyframes are blended
 * along the shortest wrap path, levels linearly.  Used for the preview.
 */
export function interpolateKeyframes(a: HologramKeyframe, b: HologramKeyframe, alpha: number): HologramKeyframe {
  requireChannels(a);
  requireChannels(b);
  const t = Math.max(0, Math.min(1, alpha));
  const phase = new Uint8Array(HOLOGRAM_CHANNELS);
  const level = new Uint8Array(HOLOGRAM_CHANNELS);
  for (let i = 0; i < HOLOGRAM_CHANNELS; i++) {
    let delta = (b.phase[i] - a.phase[i]) | 0;
    if (delta > 127) delta -= 256;
    else if (delta < -128) delta += 256;
    phase[i] = (a.phase[i] + Math.round(delta * t)) & 0xff;
    level[i] = Math.round(a.level[i] + (b.level[i] - a.level[i]) * t);
  }
  return { phase, level };
}

/** Normalised 0..1 percentile stretch, matching the planning worker. */
function percentileRange(values: Float32Array): { lo: number; hi: number } {
  const sample: number[] = [];
  const stride = Math.max(1, Math.floor(values.length / 4000));
  for (let i = 0; i < values.length; i += stride) sample.push(values[i]);
  sample.sort((a, b) => a - b);
  const pick = (q: number): number =>
    sample[Math.min(sample.length - 1, Math.max(0, Math.floor(q * (sample.length - 1))))];
  return { lo: pick(0.02), hi: pick(0.98) };
}

/** Pressure magnitude of a keyframe on a flat grid; used for quality and preview. */
function pressureMagnitude(
  frame: HologramKeyframe,
  src: ElementPositions,
  xs: Float64Array,
  ys: Float64Array,
  z: number,
  tableZ: number
): Float64Array {
  requireChannels(frame);
  const n = xs.length;
  const count = src.count;
  const xyz = src.xyz;
  const out = new Float64Array(n);
  for (let i = 0; i < n; i++) {
    let pr = 0;
    let pi = 0;
    for (let pass = 0; pass < 2; pass++) {
      const sign = pass === 0 ? 1 : -1;
      for (let k = 0; k < count; k++) {
        const sx = xyz[k * 3];
        const sy = xyz[k * 3 + 1];
        /* The rigid table reflects the array: the image is mirrored about the
         * table plane, exactly like FieldModel's ``image`` array. */
        const sz = pass === 0 ? xyz[k * 3 + 2] : 2 * tableZ - xyz[k * 3 + 2];
        const dx = xs[i] - sx;
        const dy = ys[i] - sy;
        const dz = z - sz;
        const r = Math.sqrt(dx * dx + dy * dy + dz * dz);
        if (r < 1e-9) continue;
        const dir = directivity((sign * dz) / r);
        if (dir === 0) continue;
        const phi = (frame.phase[k] * 2 * Math.PI) / PHASE_TURN + K * r;
        const amp = (dir * frame.level[k]) / HOLOGRAM_LEVEL_MAX / r;
        pr += amp * Math.cos(phi);
        pi += amp * Math.sin(phi);
      }
    }
    out[i] = Math.hypot(pr, pi);
  }
  return out;
}

function qualityOf(
  targets: HologramTarget[],
  frame: HologramKeyframe,
  src: ElementPositions
): HologramQuality {
  const n = Math.max(24, Math.min(64, targets.length * 2));
  const extent = 80;
  const half = extent * 0.5;
  const grid = n * n;
  const xs = new Float64Array(grid);
  const ys = new Float64Array(grid);
  for (let iy = 0; iy < n; iy++) {
    for (let ix = 0; ix < n; ix++) {
      const at = iy * n + ix;
      xs[at] = -half + (2 * half * ix) / (n - 1);
      ys[at] = -half + (2 * half * iy) / (n - 1);
    }
  }
  const z = (targets[0]?.zMm ?? 102) * 1e-3;
  const map = pressureMagnitude(frame, src, xs, ys, z, z);
  let sum = 0;
  for (let i = 0; i < grid; i++) sum += map[i];
  const mean = sum / grid;
  let peak = 0;
  for (let i = 0; i < grid; i++) if (map[i] > peak) peak = map[i];
  /* Pressure right on the targets, in the same units as the grid. */
  const tx = Float64Array.from(targets, (t) => t.xMm * 1e-3);
  const ty = Float64Array.from(targets, (t) => t.yMm * 1e-3);
  const onTarget = pressureMagnitude(frame, src, tx, ty, z, z);
  let targetPeak = 0;
  let targetEnergy = 0;
  for (let i = 0; i < onTarget.length; i++) {
    if (onTarget[i] > targetPeak) targetPeak = onTarget[i];
    targetEnergy += onTarget[i] * onTarget[i];
  }
  targetEnergy /= Math.max(1, onTarget.length);
  /* One coherent focus at the same range would give sum(level)/128/z. */
  const coherent = HOLOGRAM_LEVEL_MAX / Math.max(1e-9, z);
  return {
    peakToMean: mean > 0 ? peak / mean : 0,
    energy: coherent > 0 ? targetEnergy / (coherent * coherent) : 0,
    sidelobeDb: targetPeak > 0 ? 20 * Math.log10(mean / targetPeak) : -Infinity
  };
}

/**
 * Normalised acoustic pressure of a keyframe on a horizontal plane, laid out
 * like the planning worker's field map so the existing 3D field view and the
 * 2D charts can render it unchanged.
 */
export function hologramFieldMap(frame: HologramKeyframe, options: FieldMapOptions): FieldMap {
  const grid = Math.max(16, Math.round(options.grid));
  const half = options.extentMm * 0.5;
  const src = elementPositionsM(null);
  const tableDistanceMm = options.tableDistanceMm ?? 95;
  const zMm = ELEMENT_FACE_Z_MM + tableDistanceMm - options.heightMm;
  const xs = new Float64Array(grid * grid);
  const ys = new Float64Array(grid * grid);
  for (let iy = 0; iy < grid; iy++) {
    for (let ix = 0; ix < grid; ix++) {
      const at = iy * grid + ix;
      xs[at] = (-half + (2 * half * ix) / (grid - 1)) * 1e-3;
      ys[at] = (-half + (2 * half * iy) / (grid - 1)) * 1e-3;
    }
  }
  const magnitude = pressureMagnitude(frame, src, xs, ys, zMm * 1e-3, (ELEMENT_FACE_Z_MM + tableDistanceMm) * 1e-3);
  const values = new Float32Array(grid * grid);
  for (let i = 0; i < values.length; i++) values[i] = magnitude[i] * magnitude[i];
  const range = percentileRange(values);
  const span = Math.max(range.hi - range.lo, 1e-12);
  for (let i = 0; i < values.length; i++) {
    values[i] = Math.max(0, Math.min(1, (values[i] - range.lo) / span));
  }
  return { width: grid, height: grid, values, xMin: -half, xMax: half, yMin: -half, yMax: half };
}
