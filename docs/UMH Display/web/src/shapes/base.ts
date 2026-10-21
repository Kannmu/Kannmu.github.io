/** Shape container: one closed planar stroke in unit coordinates. */

export interface Shape {
  name: string;
  /** Unit coordinates, closed polyline (last joins first). */
  x: Float64Array;
  y: Float64Array;
  /** Tangent is discontinuous at this vertex. */
  corners: Uint8Array;
  /** Cyclic colour coordinate 0..1. */
  hue: Float64Array;
  /** Segment i -> i+1 is lit. */
  visible: Uint8Array;
}

export interface Planar {
  name: string;
  /** Drawing-plane coordinates in millimetres. */
  xMm: Float64Array;
  yMm: Float64Array;
  corners: Uint8Array;
  hue: Float64Array;
  visible: Uint8Array;
  /** Per-vertex fillet radius (mm); NaN = planner default. */
  radiusMm: Float64Array;
}

export function perimeterHue(x: ArrayLike<number>, y: ArrayLike<number>): Float64Array {
  const n = x.length;
  const seg = new Float64Array(n);
  let sum = 0;
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n;
    seg[i] = Math.hypot(x[j] - x[i], y[j] - y[i]);
    sum += seg[i];
  }
  const hue = new Float64Array(n);
  let acc = 0;
  for (let i = 0; i < n; i++) {
    hue[i] = sum > 0 ? acc / sum : 0;
    acc += seg[i];
  }
  return hue;
}

export function smoothShape(
  name: string,
  x: Float64Array,
  y: Float64Array,
  hue?: Float64Array,
  cornerIdx: readonly number[] = []
): Shape {
  const n = x.length;
  const corners = new Uint8Array(n);
  for (const i of cornerIdx) corners[i] = 1;
  return { name, x, y, corners, hue: hue ?? perimeterHue(x, y), visible: new Uint8Array(n).fill(1) };
}

export function polygonShape(name: string, x: Float64Array, y: Float64Array): Shape {
  const n = x.length;
  return {
    name,
    x,
    y,
    corners: new Uint8Array(n).fill(1),
    hue: perimeterHue(x, y),
    visible: new Uint8Array(n).fill(1)
  };
}

export function place(shape: Shape, sizeMm: number, centerMm: readonly [number, number] = [0, 0]): Planar {
  const n = shape.x.length;
  const xMm = new Float64Array(n);
  const yMm = new Float64Array(n);
  const radiusMm = new Float64Array(n).fill(NaN);
  for (let i = 0; i < n; i++) {
    xMm[i] = shape.x[i] * (0.5 * sizeMm) + centerMm[0];
    yMm[i] = shape.y[i] * (0.5 * sizeMm) + centerMm[1];
  }
  return {
    name: shape.name,
    xMm,
    yMm,
    corners: shape.corners.slice(),
    hue: shape.hue.slice(),
    visible: shape.visible.slice(),
    radiusMm
  };
}

export function subset(planar: Planar, keep: Uint8Array | boolean[]): Planar {
  const xs: number[] = [];
  const ys: number[] = [];
  const corners: number[] = [];
  const hue: number[] = [];
  const visible: number[] = [];
  const radius: number[] = [];
  for (let i = 0; i < planar.xMm.length; i++) {
    if (!keep[i]) continue;
    xs.push(planar.xMm[i]);
    ys.push(planar.yMm[i]);
    corners.push(planar.corners[i]);
    hue.push(planar.hue[i]);
    visible.push(planar.visible[i]);
    radius.push(planar.radiusMm[i]);
  }
  return {
    name: planar.name,
    xMm: Float64Array.from(xs),
    yMm: Float64Array.from(ys),
    corners: Uint8Array.from(corners),
    hue: Float64Array.from(hue),
    visible: Uint8Array.from(visible),
    radiusMm: Float64Array.from(radius)
  };
}
