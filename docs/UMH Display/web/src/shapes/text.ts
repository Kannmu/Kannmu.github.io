/**
 * English text as one closed POV path: single-stroke glyphs joined by blank
 * transits.  Port of ``umh_display/shapes/text.py`` (glyph table included).
 */
import { angle2, unit2 } from '../core/math.ts';
import type { Planar } from './base.ts';

export const CAP = 6.0;
export const GAP = 1.6;
export const OVERSHOOT = 1.2;
export const BLANK_RADIUS = 1.6;
export const CORNER_DEG = 30.0;
const APEX_TOL_MM = 0.4;
const LIT_RADIUS_MAX = 0.15;
const ARC_STEP_DEG = 15.0;

type Pt = [number, number];
type Stroke = Pt[];

function arc(cx: number, cy: number, rx: number, ry: number, a0: number, a1: number): Stroke {
  const n = Math.max(2, Math.ceil(Math.abs(a1 - a0) / ARC_STEP_DEG));
  const out: Stroke = [];
  for (let i = 0; i <= n; i++) {
    const t = ((a0 + ((a1 - a0) * i) / n) * Math.PI) / 180;
    out.push([cx + rx * Math.cos(t), cy + ry * Math.sin(t)]);
  }
  return out;
}

function dot(x: number, y: number, r = 0.4): Stroke {
  return arc(x, y, r, r, 0, 360);
}

function cat(...parts: Stroke[]): Stroke {
  const out: Stroke = [];
  for (const p of parts) out.push(...p);
  return out;
}

/** char -> (advance width, strokes); y up, baseline 0, cap height CAP. */
export const GLYPHS: Record<string, [number, Stroke[]]> = {
  A: [4, [[[0, 0], [2, 6], [4, 0]], [[0.8, 2.4], [3.2, 2.4]]]],
  B: [4, [cat([[0, 3], [2.5, 3]], arc(2.5, 1.5, 1.5, 1.5, 90, -90), [[0, 0], [0, 6], [2.3, 6]], arc(2.3, 4.5, 1.5, 1.5, 90, -90))]],
  C: [4, [arc(2, 3, 2, 3, 50, 310)]],
  D: [4, [cat([[0, 0], [0, 6], [1.5, 6]], arc(1.5, 3, 2.5, 3, 90, -90), [[0, 0]])]],
  E: [3.5, [[[3.5, 6], [0, 6], [0, 0], [3.5, 0]], [[0, 3], [2.8, 3]]]],
  F: [3.5, [[[3.5, 6], [0, 6], [0, 0]], [[0, 3], [2.8, 3]]]],
  G: [4, [cat(arc(2, 3, 2, 3, 50, 360), [[2.2, 3]])]],
  H: [4, [[[0, 0], [0, 6]], [[4, 0], [4, 6]], [[0, 3], [4, 3]]]],
  I: [0, [[[0, 0], [0, 6]]]],
  J: [3, [cat([[3, 6]], arc(1.5, 1.5, 1.5, 1.5, 0, -180))]],
  K: [3.5, [[[0, 0], [0, 6]], [[3.5, 6], [0, 2.4]], [[1.3, 3.74], [3.5, 0]]]],
  L: [3.5, [[[0, 6], [0, 0], [3.5, 0]]]],
  M: [5, [[[0, 0], [0, 6], [2.5, 2], [5, 6], [5, 0]]]],
  N: [4, [[[0, 0], [0, 6], [4, 0], [4, 6]]]],
  O: [4, [arc(2, 3, 2, 3, 0, 360)]],
  P: [4, [cat([[0, 0], [0, 6], [2.3, 6]], arc(2.3, 4.5, 1.5, 1.5, 90, -90), [[0, 3]])]],
  Q: [4.3, [arc(2, 3, 2, 3, 0, 360), [[2.6, 1.3], [4.3, -0.4]]]],
  R: [4, [cat([[0, 0], [0, 6], [2.3, 6]], arc(2.3, 4.5, 1.5, 1.5, 90, -90), [[0, 3]]), [[1.8, 3], [4, 0]]]],
  S: [4, [cat(arc(2, 4.5, 2, 1.5, 20, 270), arc(2, 1.5, 2, 1.5, 90, -160))]],
  T: [4, [[[0, 6], [4, 6]], [[2, 6], [2, 0]]]],
  U: [4, [cat([[0, 6]], arc(2, 2, 2, 2, 180, 360), [[4, 6]])]],
  V: [4, [[[0, 6], [2, 0], [4, 6]]]],
  W: [5.5, [[[0, 6], [1.3, 0], [2.75, 4.2], [4.2, 0], [5.5, 6]]]],
  X: [4, [[[0, 6], [4, 0]], [[4, 6], [0, 0]]]],
  Y: [4, [[[0, 6], [2, 3], [4, 6]], [[2, 3], [2, 0]]]],
  Z: [4, [[[0, 6], [4, 6], [0, 0], [4, 0]]]],
  '0': [3.5, [arc(1.75, 3, 1.75, 3, 0, 360)]],
  '1': [2, [[[0, 4.6], [1.5, 6], [1.5, 0]]]],
  '2': [4, [cat(arc(2, 4.2, 2, 1.8, 160, -30), [[0, 0], [4, 0]])]],
  '3': [4, [cat(arc(2, 4.5, 1.8, 1.5, 150, -90), arc(2, 1.5, 2, 1.5, 90, -150))]],
  '4': [4, [[[3, 0], [3, 6], [0, 1.8], [4, 1.8]]]],
  '5': [4, [cat([[3.8, 6], [0.6, 6]], arc(1.9, 1.9, 1.9, 1.9, 145, -145))]],
  '6': [4, [cat(arc(2, 1.8, 2, 4.2, 70, 180), arc(2, 1.8, 2, 1.8, 180, 540))]],
  '7': [4, [[[0, 6], [4, 6], [1.2, 0]]]],
  '8': [4, [cat(arc(2, 4.5, 1.7, 1.5, -90, 270), arc(2, 1.5, 2, 1.5, 90, -270))]],
  '9': [4, [cat(arc(2, 4.2, 2, 1.8, 0, -360), [[3.5, 0]])]],
  '.': [0.8, [dot(0.4, 0.4)]],
  ',': [0.8, [[[0.6, 0.6], [0.2, -0.8]]]],
  '!': [0.8, [[[0.4, 6], [0.4, 2]], dot(0.4, 0.4)]],
  '?': [3.5, [cat(arc(1.75, 4.4, 1.75, 1.6, 160, -60), [[1.75, 1.8]]), dot(1.75, 0.4)]],
  '-': [2.5, [[[0, 3], [2.5, 3]]]],
  '+': [3.5, [[[0, 3], [3.5, 3]], [[1.75, 1.25], [1.75, 4.75]]]],
  ':': [0.8, [dot(0.4, 0.4), dot(0.4, 3.6)]],
  "'": [0.5, [[[0.25, 6], [0.25, 4.5]]]],
  '/': [3, [[[0, 0], [3, 6]]]],
  '=': [3, [[[0, 2], [3, 2]], [[0, 4], [3, 4]]]],
  ' ': [2.5, []]
};

const TURN_COST = 1.0;
const MAX_ROTATIONS = 24;

function clean(stroke: Stroke): Stroke {
  if (stroke.length === 0) return [];
  const out: Stroke = [stroke[0]];
  for (let i = 1; i < stroke.length; i++) {
    const prev = out[out.length - 1];
    if (Math.hypot(stroke[i][0] - prev[0], stroke[i][1] - prev[1]) > 1e-6) out.push(stroke[i]);
  }
  return out;
}

function unitOf(dx: number, dy: number): Pt {
  return unit2(dx, dy);
}

function angleOf(u: Pt, w: Pt): number {
  return angle2(u[0], u[1], w[0], w[1]);
}

function isClosed(p: Stroke): boolean {
  if (p.length <= 3) return false;
  return Math.hypot(p[0][0] - p[p.length - 1][0], p[0][1] - p[p.length - 1][1]) < 1e-6;
}

function variants(p: Stroke): Stroke[] {
  const out: Stroke[] = [];
  if (isClosed(p)) {
    const ring = p.slice(0, -1);
    for (let r = 0; r < ring.length; r++) {
      const fwd: Stroke = [...ring.slice(r), ...ring.slice(0, r), ring[r]];
      out.push(fwd);
      out.push(fwd.slice().reverse());
    }
  } else {
    out.push(p);
    if (p.length > 1) out.push(p.slice().reverse());
  }
  return out;
}

function allVariants(p: Stroke): Stroke[] {
  const out = variants(p);
  if (out.length > 2 * MAX_ROTATIONS) {
    const half = Math.floor(out.length / 2);
    const keep: number[] = [];
    for (let k = 0; k < MAX_ROTATIONS; k++) {
      keep.push(Math.trunc((k * (half - 1)) / (MAX_ROTATIONS - 1)));
    }
    const sampled: Stroke[] = [];
    for (const k of keep) {
      if (out[2 * k]) sampled.push(out[2 * k]);
      if (out[2 * k + 1]) sampled.push(out[2 * k + 1]);
    }
    return sampled;
  }
  return out;
}

function hopCost(a: Stroke, b: Stroke): number {
  const eDir = unitOf(a[a.length - 1][0] - a[a.length - 2][0], a[a.length - 1][1] - a[a.length - 2][1]);
  const sDir = unitOf(b[1][0] - b[0][0], b[1][1] - b[0][1]);
  const hx = b[0][0] - a[a.length - 1][0];
  const hy = b[0][1] - a[a.length - 1][1];
  const d = Math.hypot(hx, hy);
  if (d < 1e-6) return TURN_COST * angleOf(eDir, sDir);
  const h = unitOf(hx, hy);
  return d + 2 * OVERSHOOT + TURN_COST * (angleOf(eDir, h) + angleOf(h, sDir));
}

interface TourEntry {
  stroke: number;
  path: Stroke;
}

/** Order and orient every stroke of the string as one closed tour. */
function orderStrokes(strokes: Stroke[], start: Pt): Stroke[] {
  const variantsByStroke = strokes.map(allVariants);
  const n = strokes.length;
  const left = new Set<number>();
  for (let i = 0; i < n; i++) left.add(i);
  const tour: TourEntry[] = [];
  let pen: Stroke = [[start[0] - 1, start[1]], [start[0], start[1]]];

  while (left.size) {
    let bestCost = Infinity;
    let bestIndex = -1;
    let bestPath: Stroke | null = null;
    for (const i of left) {
      for (const v of variantsByStroke[i]) {
        const cost = hopCost(pen, v);
        if (cost < bestCost) {
          bestCost = cost;
          bestIndex = i;
          bestPath = v;
        }
      }
    }
    if (!bestPath) break;
    tour.push({ stroke: bestIndex, path: bestPath });
    left.delete(bestIndex);
    pen = bestPath;
  }
  if (n < 2) return tour.map((entry) => entry.path);

  for (let round = 0; round < 50; round++) {
    let improved = false;
    for (let i = 0; i < n - 1; i++) {
      for (let j = i + 1; j < n; j++) {
        if (i === 0 && j === n - 1) continue;
        const a = tour[(i - 1 + n) % n].path;
        const b = tour[(j + 1) % n].path;
        const old = hopCost(a, tour[i].path) + hopCost(tour[j].path, b);
        const newCost = hopCost(a, tour[j].path.slice().reverse()) + hopCost(tour[i].path.slice().reverse(), b);
        if (newCost < old - 1e-9) {
          const sliced = tour.slice(i, j + 1).reverse();
          tour.splice(i, j - i + 1, ...sliced.map((entry) => ({ stroke: entry.stroke, path: entry.path.slice().reverse() })));
          improved = true;
        }
      }
    }
    for (let k = 0; k < n; k++) {
      const entry = tour[k];
      const prev = tour[(k - 1 + n) % n].path;
      const next = tour[(k + 1) % n].path;
      let base = hopCost(prev, entry.path) + hopCost(entry.path, next);
      for (const v of variantsByStroke[entry.stroke]) {
        const c = hopCost(prev, v) + hopCost(v, next);
        if (c < base - 1e-9) {
          tour[k] = { stroke: entry.stroke, path: v };
          base = c;
          improved = true;
        }
      }
    }
    if (!improved) break;
  }
  return tour.map((entry) => entry.path);
}

interface RawPoint {
  x: number;
  y: number;
  lit: boolean;
  corner: boolean;
  radius: number;
}

/** Lay out ``text`` (A-Z, 0-9, basic punctuation; case-folded) as a Planar path. */
export function layoutText(text: string, heightMm: number, centerMm: readonly [number, number] = [0, 0]): Planar {
  const upper = text.toUpperCase();
  const chars = [...upper].map((c) => (c in GLYPHS ? c : '?'));
  let cursor = 0;
  let glyphs: Stroke[][] = [];
  for (const c of chars) {
    const [w, strokes] = GLYPHS[c];
    glyphs.push(strokes.map((s) => clean(s).map(([x, y]): Pt => [x + cursor, y])));
    cursor += w + GAP;
  }
  glyphs = glyphs.filter((g) => g.length > 0);
  if (glyphs.length === 0) throw new Error('text has nothing to draw');

  let loX = Infinity;
  let loY = Infinity;
  let hiX = -Infinity;
  let hiY = -Infinity;
  for (const g of glyphs) {
    for (const s of g) {
      for (const [x, y] of s) {
        if (x < loX) loX = x;
        if (y < loY) loY = y;
        if (x > hiX) hiX = x;
        if (y > hiY) hiY = y;
      }
    }
  }
  const strokes = orderStrokes(glyphs.flat(), [loX - 2.0, 0.5 * CAP]);

  const pts: RawPoint[] = [];
  const n = strokes.length;
  const meet = new Array<boolean>(n).fill(false);
  for (let k = 0; k < n; k++) {
    const s = strokes[k];
    const nxt = strokes[(k + 1) % n];
    const eDir = unitOf(s[s.length - 1][0] - s[s.length - 2][0], s[s.length - 1][1] - s[s.length - 2][1]);
    const sDir = unitOf(nxt[1][0] - nxt[0][0], nxt[1][1] - nxt[0][1]);
    if (Math.hypot(nxt[0][0] - s[s.length - 1][0], nxt[0][1] - s[s.length - 1][1]) < 1e-6) {
      meet[(k + 1) % n] = (angleOf(eDir, sDir) * 180) / Math.PI > CORNER_DEG;
    }
  }
  for (let k = 0; k < n; k++) {
    const s = strokes[k];
    const nxt = strokes[(k + 1) % n];
    for (let i = 0; i < s.length - 1; i++) {
      let turn = 0;
      if (i > 0) {
        const u = unitOf(s[i][0] - s[i - 1][0], s[i][1] - s[i - 1][1]);
        const w = unitOf(s[i + 1][0] - s[i][0], s[i + 1][1] - s[i][1]);
        turn = (angleOf(u, w) * 180) / Math.PI;
      }
      pts.push({ x: s[i][0], y: s[i][1], lit: true, corner: turn > CORNER_DEG || (i === 0 && meet[k]), radius: NaN });
    }
    const end = s[s.length - 1];
    const start = nxt[0];
    const eDir = unitOf(s[s.length - 1][0] - s[s.length - 2][0], s[s.length - 1][1] - s[s.length - 2][1]);
    const sDir = unitOf(nxt[1][0] - nxt[0][0], nxt[1][1] - nxt[0][1]);
    if (Math.hypot(start[0] - end[0], start[1] - end[1]) < 1e-6) continue;
    pts.push({ x: end[0], y: end[1], lit: false, corner: false, radius: NaN });
    pts.push({ x: end[0] + OVERSHOOT * eDir[0], y: end[1] + OVERSHOOT * eDir[1], lit: false, corner: true, radius: BLANK_RADIUS });
    pts.push({ x: start[0] - OVERSHOOT * sDir[0], y: start[1] - OVERSHOOT * sDir[1], lit: false, corner: true, radius: BLANK_RADIUS });
  }

  const count = pts.length;
  const xyX = new Float64Array(count);
  const xyY = new Float64Array(count);
  for (let i = 0; i < count; i++) {
    xyX[i] = pts[i].x;
    xyY[i] = pts[i].y;
  }
  const scale = heightMm / CAP;
  const midX = 0.5 * (loX + hiX);
  const midY = 0.5 * (loY + hiY);
  const xMm = new Float64Array(count);
  const yMm = new Float64Array(count);
  const radiusMm = new Float64Array(count);
  const corners = new Uint8Array(count);
  const visible = new Uint8Array(count);
  const hue = new Float64Array(count);
  for (let i = 0; i < count; i++) {
    xMm[i] = (xyX[i] - midX) * scale + centerMm[0];
    yMm[i] = (xyY[i] - midY) * scale + centerMm[1];
    radiusMm[i] = Number.isNaN(pts[i].radius) ? NaN : pts[i].radius * scale;
    corners[i] = pts[i].corner ? 1 : 0;
    visible[i] = pts[i].lit ? 1 : 0;
    hue[i] = Math.min(0.55, Math.max(0, (0.55 * (xyX[i] - loX)) / Math.max(1e-9, hiX - loX)));
  }

  for (let i = 0; i < count; i++) {
    const ux = xyX[i] - xyX[(i - 1 + count) % count];
    const uy = xyY[i] - xyY[(i - 1 + count) % count];
    const wx = xyX[(i + 1) % count] - xyX[i];
    const wy = xyY[(i + 1) % count] - xyY[i];
    const denom = Math.max(Math.hypot(ux, uy) * Math.hypot(wx, wy), 1e-12);
    const cosT = (ux * wx + uy * wy) / denom;
    const half = 0.5 * Math.acos(Math.min(1, Math.max(-1, cosT)));
    const tip = APEX_TOL_MM / Math.max(1 / Math.cos(Math.min(half, 1.55)) - 1, 1e-6);
    if (corners[i] && !Number.isFinite(radiusMm[i])) {
      radiusMm[i] = Math.min(tip, LIT_RADIUS_MAX * heightMm);
    }
  }

  return { name: `text:${text}`, xMm, yMm, corners, hue, visible, radiusMm };
}
