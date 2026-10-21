/** Built-in planar figures (unit bounding radius, drawn close to the reflector). */
import { smoothShape, polygonShape, type Shape } from './base.ts';

function ring(n: number, radius = 1, phase = 0): { x: Float64Array; y: Float64Array } {
  const x = new Float64Array(n);
  const y = new Float64Array(n);
  for (let i = 0; i < n; i++) {
    const a = phase + (2 * Math.PI * i) / n;
    x[i] = radius * Math.cos(a);
    y[i] = radius * Math.sin(a);
  }
  return { x, y };
}

export function circle(n = 360): Shape {
  const { x, y } = ring(n);
  return smoothShape('circle', x, y);
}

export function regularPolygon(sides: number, name: string, phaseDeg: number): Shape {
  const { x, y } = ring(sides, 1, (phaseDeg * Math.PI) / 180);
  return polygonShape(name, x, y);
}

export function star(points = 5, inner = 0.42): Shape {
  const count = 2 * points;
  const x = new Float64Array(count);
  const y = new Float64Array(count);
  for (let i = 0; i < count; i++) {
    const a = Math.PI / 2 + (Math.PI * i) / points;
    const r = i % 2 === 0 ? 1 : inner;
    x[i] = r * Math.cos(a);
    y[i] = r * Math.sin(a);
  }
  return polygonShape('star', x, y);
}

export function heart(n = 400): Shape {
  const x = new Float64Array(n);
  const y = new Float64Array(n);
  let maxNorm = 0;
  for (let i = 0; i < n; i++) {
    const t = (2 * Math.PI * i) / n;
    const xx = 16 * Math.sin(t) ** 3;
    const yy = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t) - 2.5;
    x[i] = xx;
    y[i] = yy;
    maxNorm = Math.max(maxNorm, Math.hypot(xx, yy));
  }
  for (let i = 0; i < n; i++) {
    x[i] /= maxNorm;
    y[i] /= maxNorm;
  }
  // cusp and bottom tip: argmin |t| and argmin |t - pi|
  let cusp = 0;
  let tip = 0;
  let dCusp = Infinity;
  let dTip = Infinity;
  for (let i = 0; i < n; i++) {
    const t = (2 * Math.PI * i) / n;
    const dc = Math.abs(t);
    const dt = Math.abs(t - Math.PI);
    if (dc < dCusp) {
      dCusp = dc;
      cusp = i;
    }
    if (dt < dTip) {
      dTip = dt;
      tip = i;
    }
  }
  return smoothShape('heart', x, y, undefined, [cusp, tip]);
}

export function rose(petals = 3, n = 720): Shape {
  const x = new Float64Array(n);
  const y = new Float64Array(n);
  for (let i = 0; i < n; i++) {
    const t = (2 * Math.PI * i) / n;
    const r = Math.cos(petals * t);
    x[i] = r * Math.cos(t);
    y[i] = r * Math.sin(t);
  }
  return smoothShape('rose', x, y);
}

export function lissajous(a = 3, b = 2, n = 720): Shape {
  const x = new Float64Array(n);
  const y = new Float64Array(n);
  let maxNorm = 0;
  for (let i = 0; i < n; i++) {
    const t = (2 * Math.PI * i) / n;
    const xx = Math.sin(a * t + Math.PI / 2);
    const yy = Math.sin(b * t);
    x[i] = xx;
    y[i] = yy;
    maxNorm = Math.max(maxNorm, Math.hypot(xx, yy));
  }
  for (let i = 0; i < n; i++) {
    x[i] /= maxNorm;
    y[i] /= maxNorm;
  }
  return smoothShape('lissajous', x, y);
}

export function infinity(n = 480): Shape {
  const x = new Float64Array(n);
  const y = new Float64Array(n);
  for (let i = 0; i < n; i++) {
    const t = (2 * Math.PI * i) / n;
    x[i] = Math.cos(t);
    y[i] = 0.5 * Math.sin(2 * t);
  }
  return smoothShape('infinity', x, y);
}

export const SHAPES: Record<string, () => Shape> = {
  circle,
  square: () => regularPolygon(4, 'square', 45),
  triangle: () => regularPolygon(3, 'triangle', 90),
  hexagon: () => regularPolygon(6, 'hexagon', 0),
  star,
  heart,
  rose,
  lissajous,
  infinity
};

export const SHAPE_LABELS: Record<string, string> = {
  circle: '圆',
  square: '方',
  triangle: '三角',
  hexagon: '六边',
  star: '星',
  heart: '心',
  rose: '玫瑰',
  lissajous: '李萨如',
  infinity: '无穷',
  text: '文字'
};

export function make(name: string): Shape {
  const factory = SHAPES[name];
  if (!factory) throw new Error(`unknown shape ${JSON.stringify(name)}; choose from ${Object.keys(SHAPES).join(', ')} or text`);
  return factory();
}
