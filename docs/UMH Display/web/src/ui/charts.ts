/**
 * Canvas charts.  Deliberately dependency-free: the plan already carries every
 * array, so drawing is a few strokes and one ImageData blit.
 */
import type { Plan } from '../motion/planner.ts';

const CYAN = '#65d8e7';
const AMBER = '#ffb648';
const MAGENTA = '#ff6f9f';
const GRID = 'rgba(255,255,255,0.075)';
const TEXT = 'rgba(183,196,207,0.62)';
const DIM = 'rgba(127,142,156,0.8)';
const MONO = '10px ui-monospace, SFMono-Regular, Consolas, monospace';

interface Surface {
  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;
}

function surface(canvas: HTMLCanvasElement): Surface | null {
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  if (width < 8 || height < 8) return null;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const pixelWidth = Math.round(width * dpr);
  const pixelHeight = Math.round(height * dpr);
  if (canvas.width !== pixelWidth || canvas.height !== pixelHeight) {
    canvas.width = pixelWidth;
    canvas.height = pixelHeight;
  }
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, width, height);
  return { ctx, width, height };
}

function line(
  ctx: CanvasRenderingContext2D,
  points: ArrayLike<number>,
  xs: ArrayLike<number>,
  color: string,
  width = 1.2
): void {
  if (points.length === 0) return;
  ctx.beginPath();
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.lineJoin = 'round';
  for (let i = 0; i < points.length; i++) {
    if (i === 0) ctx.moveTo(xs[i], points[i]);
    else ctx.lineTo(xs[i], points[i]);
  }
  ctx.stroke();
}

/** Speed and acceleration over one loop. */
export function drawSpeedChart(canvas: HTMLCanvasElement, plan: Plan | null, progress = 0): void {
  const surfaceData = surface(canvas);
  if (!surfaceData) return;
  const { ctx, width, height } = surfaceData;
  const left = 34;
  const right = 30;
  const top = 10;
  const bottom = 17;
  const plotW = width - left - right;
  const plotH = height - top - bottom;
  if (plotW < 10 || plotH < 10) return;

  ctx.fillStyle = 'rgba(255,255,255,0.018)';
  ctx.fillRect(left, top, plotW, plotH);

  ctx.strokeStyle = GRID;
  ctx.lineWidth = 1;
  ctx.fillStyle = TEXT;
  ctx.font = MONO;
  ctx.textAlign = 'right';
  ctx.textBaseline = 'middle';
  for (let i = 0; i <= 4; i++) {
    const y = top + (plotH * i) / 4;
    ctx.beginPath();
    ctx.moveTo(left, y);
    ctx.lineTo(left + plotW, y);
    ctx.stroke();
  }

  if (!plan || plan.speed.length === 0) {
    ctx.fillStyle = DIM;
    ctx.textAlign = 'center';
    ctx.fillText('无规划数据', left + plotW / 2, top + plotH / 2);
    return;
  }

  let speedMax = 0;
  let accelMax = 0;
  for (let i = 0; i < plan.speed.length; i++) {
    if (plan.speed[i] > speedMax) speedMax = plan.speed[i];
    if (plan.accel[i] > accelMax) accelMax = plan.accel[i];
  }
  speedMax = Math.max(speedMax * 1e3 * 1.12, 1);
  accelMax = Math.max(accelMax * 1.12, 1);
  const n = plan.speed.length;
  const periodMs = plan.periodS * 1e3;
  const xs = new Float64Array(n);
  const ysSpeed = new Float64Array(n);
  const ysAccel = new Float64Array(n);
  for (let i = 0; i < n; i++) {
    xs[i] = left + (plotW * i) / (n - 1 || 1);
    ysSpeed[i] = top + plotH - (plan.speed[i] * 1e3 * plotH) / speedMax;
    ysAccel[i] = top + plotH - (plan.accel[i] * plotH) / accelMax;
  }

  const gradient = ctx.createLinearGradient(0, top, 0, top + plotH);
  gradient.addColorStop(0, 'rgba(101,216,231,0.22)');
  gradient.addColorStop(1, 'rgba(101,216,231,0)');
  ctx.beginPath();
  ctx.moveTo(xs[0], top + plotH);
  for (let i = 0; i < n; i++) ctx.lineTo(xs[i], ysSpeed[i]);
  ctx.lineTo(xs[n - 1], top + plotH);
  ctx.closePath();
  ctx.fillStyle = gradient;
  ctx.fill();

  line(ctx, ysAccel, xs, 'rgba(255,182,72,0.72)', 1);
  line(ctx, ysSpeed, xs, CYAN, 1.6);

  // axis labels
  ctx.fillStyle = TEXT;
  ctx.textAlign = 'right';
  ctx.textBaseline = 'top';
  ctx.fillText(`${speedMax.toFixed(0)}`, left - 6, top);
  ctx.fillStyle = 'rgba(101,216,231,0.75)';
  ctx.fillText('mm/s', left - 6, top + 11);
  ctx.textAlign = 'left';
  ctx.fillStyle = 'rgba(255,182,72,0.78)';
  ctx.fillText(`${accelMax.toFixed(0)} m/s²`, left + plotW + 5, top);
  ctx.fillStyle = TEXT;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.fillText('0', left, top + plotH + 4);
  ctx.fillText(`${(periodMs / 2).toFixed(0)}`, left + plotW / 2, top + plotH + 4);
  ctx.fillText(`${periodMs.toFixed(0)} ms`, left + plotW, top + plotH + 4);

  // cursor
  const cx = left + plotW * Math.max(0, Math.min(1, progress));
  ctx.strokeStyle = 'rgba(255,255,255,0.36)';
  ctx.setLineDash([2, 3]);
  ctx.beginPath();
  ctx.moveTo(cx, top);
  ctx.lineTo(cx, top + plotH);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.fillStyle = AMBER;
  ctx.beginPath();
  ctx.arc(cx, top + plotH - (plan.accel[Math.min(n - 1, Math.floor(progress * n))] / accelMax) * plotH, 2, 0, Math.PI * 2);
  ctx.fill();
}

interface Bounds {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
}

function planBounds(plan: Plan): Bounds {
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;
  const include = (xs: ArrayLike<number>, ys: ArrayLike<number>, step = 1): void => {
    for (let i = 0; i < xs.length; i += step) {
      // plan arrays are metres; the chart works in millimetres
      const x = xs[i] * 1e3;
      const y = ys[i] * 1e3;
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
  };
  include(plan.targetX, plan.targetY);
  include(plan.trapX, plan.trapY, 2);
  include(plan.beadX, plan.beadY, 2);
  if (!Number.isFinite(minX)) return { minX: -10, maxX: 10, minY: -10, maxY: 10 };
  const pad = Math.max(2, (maxX - minX) * 0.08, (maxY - minY) * 0.08);
  return { minX: minX - pad, maxX: maxX + pad, minY: minY - pad, maxY: maxY + pad };
}

/** Top-down plan view: LED-coloured bead trail, dashed trap, device points. */
export function drawPlanChart(canvas: HTMLCanvasElement, plan: Plan | null, progress = 0): void {
  const surfaceData = surface(canvas);
  if (!surfaceData) return;
  const { ctx, width, height } = surfaceData;
  const pad = 16;
  const footer = 14;
  const plotW = width - pad * 2;
  const plotH = height - pad * 2 - footer;
  if (plotW < 10 || plotH < 10) return;

  ctx.fillStyle = 'rgba(255,255,255,0.016)';
  ctx.fillRect(pad, pad, plotW, plotH);

  if (!plan) {
    ctx.fillStyle = DIM;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('无规划数据', width / 2, height / 2);
    return;
  }

  const bounds = planBounds(plan);
  const scale = Math.min(plotW / (bounds.maxX - bounds.minX), plotH / (bounds.maxY - bounds.minY));
  const cx = pad + plotW / 2;
  const cy = pad + plotH / 2;
  const midX = (bounds.minX + bounds.maxX) / 2;
  const midY = (bounds.minY + bounds.maxY) / 2;
  const px = (x: number): number => cx + (x - midX) * scale;
  const py = (y: number): number => cy - (y - midY) * scale;

  // millimetre grid
  const extent = Math.max(bounds.maxX - bounds.minX, bounds.maxY - bounds.minY);
  const step = extent > 60 ? 20 : extent > 30 ? 10 : 5;
  ctx.strokeStyle = 'rgba(255,255,255,0.05)';
  ctx.lineWidth = 1;
  for (let gx = Math.ceil(bounds.minX / step) * step; gx <= bounds.maxX; gx += step) {
    ctx.beginPath();
    ctx.moveTo(px(gx), py(bounds.minY));
    ctx.lineTo(px(gx), py(bounds.maxY));
    ctx.stroke();
  }
  for (let gy = Math.ceil(bounds.minY / step) * step; gy <= bounds.maxY; gy += step) {
    ctx.beginPath();
    ctx.moveTo(px(bounds.minX), py(gy));
    ctx.lineTo(px(bounds.maxX), py(gy));
    ctx.stroke();
  }

  const n = plan.beadX.length;
  // faint full figure (the persistence-of-vision image)
  ctx.lineWidth = 3.4;
  ctx.lineCap = 'round';
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n;
    if (plan.ledR[i] + plan.ledG[i] + plan.ledB[i] < 6) continue;
    const alpha = 0.34;
    ctx.strokeStyle = `rgba(${Math.round(plan.ledR[i])},${Math.round(plan.ledG[i])},${Math.round(plan.ledB[i])},${alpha})`;
    ctx.beginPath();
    ctx.moveTo(px(plan.beadX[i] * 1e3), py(plan.beadY[i] * 1e3));
    ctx.lineTo(px(plan.beadX[j] * 1e3), py(plan.beadY[j] * 1e3));
    ctx.stroke();
  }
  // bright current segment window
  const head = Math.floor(progress * n);
  const tailLength = Math.max(6, Math.floor(n * 0.12));
  ctx.lineWidth = 2.2;
  for (let k = 0; k < tailLength; k++) {
    const i = (head - k + n * 2) % n;
    const j = (i + 1) % n;
    if (plan.ledR[i] + plan.ledG[i] + plan.ledB[i] < 6) continue;
    ctx.strokeStyle = `rgb(${Math.round(plan.ledR[i])},${Math.round(plan.ledG[i])},${Math.round(plan.ledB[i])})`;
    ctx.beginPath();
    ctx.moveTo(px(plan.beadX[i] * 1e3), py(plan.beadY[i] * 1e3));
    ctx.lineTo(px(plan.beadX[j] * 1e3), py(plan.beadY[j] * 1e3));
    ctx.stroke();
  }

  // trap path
  ctx.strokeStyle = 'rgba(170,184,196,0.42)';
  ctx.lineWidth = 1;
  ctx.setLineDash([3, 4]);
  ctx.beginPath();
  for (let i = 0; i < plan.trapX.length; i += 2) {
    const x = px(plan.trapX[i] * 1e3);
    const y = py(plan.trapY[i] * 1e3);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.stroke();
  ctx.setLineDash([]);

  // device points
  ctx.fillStyle = 'rgba(255,182,72,0.5)';
  for (const point of plan.points) {
    ctx.fillRect(px(point.xUm / 1000) - 0.8, py(point.yUm / 1000) - 0.8, 1.6, 1.6);
  }

  // simulated bead
  if (plan.simBeadX && plan.simBeadY) {
    ctx.strokeStyle = 'rgba(255,255,255,0.6)';
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    for (let i = 0; i < plan.simBeadX.length; i += 2) {
      const x = px(plan.simBeadX[i] * 1e3);
      const y = py(plan.simBeadY[i] * 1e3);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }

  // moving bead marker
  if (n > 0) {
    const idx = Math.min(n - 1, Math.max(0, Math.floor(progress * n)));
    const bx = px(plan.beadX[idx] * 1e3);
    const by = py(plan.beadY[idx] * 1e3);
    const glow = ctx.createRadialGradient(bx, by, 0, bx, by, 9);
    glow.addColorStop(0, 'rgba(255,255,255,0.95)');
    glow.addColorStop(0.3, 'rgba(255,214,138,0.7)');
    glow.addColorStop(1, 'rgba(255,182,72,0)');
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(bx, by, 9, 0, Math.PI * 2);
    ctx.fill();
  }

  // scale bar
  const barMm = step;
  const barPx = barMm * scale;
  const barY = height - 7;
  ctx.strokeStyle = 'rgba(255,255,255,0.4)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(width - pad - barPx, barY);
  ctx.lineTo(width - pad, barY);
  ctx.stroke();
  ctx.fillStyle = TEXT;
  ctx.font = MONO;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'bottom';
  ctx.fillText(`${barMm} mm`, width - pad - barPx / 2, barY - 2);
}

export interface FieldMap {
  width: number;
  height: number;
  values: Float32Array;
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
  unit?: string;
}

function fieldColor(t: number): [number, number, number] {
  // dark plasma: deep blue -> cyan -> amber -> warm white
  const stops: Array<[number, [number, number, number]]> = [
    [0, [4, 8, 12]],
    [0.28, [16, 54, 74]],
    [0.55, [55, 170, 190]],
    [0.78, [255, 166, 60]],
    [1, [255, 238, 210]]
  ];
  for (let i = 1; i < stops.length; i++) {
    if (t <= stops[i][0]) {
      const [a, ca] = stops[i - 1];
      const [b, cb] = stops[i];
      const u = (t - a) / (b - a);
      return [ca[0] + (cb[0] - ca[0]) * u, ca[1] + (cb[1] - ca[1]) * u, ca[2] + (cb[2] - ca[2]) * u];
    }
  }
  return stops[stops.length - 1][1];
}

/** Pressure/potential slice, drawn as a heat map with axes. */
export function drawFieldMap(
  canvas: HTMLCanvasElement,
  map: FieldMap | null,
  marker?: { x: number; y: number } | null
): void {
  const surfaceData = surface(canvas);
  if (!surfaceData) return;
  const { ctx, width, height } = surfaceData;
  const padLeft = 46;
  const padBottom = 20;
  const padTop = 8;
  const padRight = 10;
  const plotW = width - padLeft - padRight;
  const plotH = height - padTop - padBottom;
  if (plotW < 8 || plotH < 8) return;

  ctx.fillStyle = '#04070a';
  ctx.fillRect(padLeft, padTop, plotW, plotH);

  if (!map) {
    ctx.fillStyle = DIM;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('等待声场截面…', padLeft + plotW / 2, padTop + plotH / 2);
    return;
  }

  const off = document.createElement('canvas');
  off.width = map.width;
  off.height = map.height;
  const octx = off.getContext('2d')!;
  const image = octx.createImageData(map.width, map.height);
  for (let y = 0; y < map.height; y++) {
    for (let x = 0; x < map.width; x++) {
      const value = map.values[(map.height - 1 - y) * map.width + x];
      const [r, g, b] = fieldColor(Math.max(0, Math.min(1, value)));
      const at = (y * map.width + x) * 4;
      image.data[at] = r;
      image.data[at + 1] = g;
      image.data[at + 2] = b;
      image.data[at + 3] = 255;
    }
  }
  octx.putImageData(image, 0, 0);
  ctx.imageSmoothingEnabled = true;
  ctx.drawImage(off, padLeft, padTop, plotW, plotH);

  ctx.strokeStyle = 'rgba(255,255,255,0.14)';
  ctx.lineWidth = 1;
  ctx.strokeRect(padLeft + 0.5, padTop + 0.5, plotW - 1, plotH - 1);

  ctx.fillStyle = TEXT;
  ctx.font = MONO;
  ctx.textAlign = 'right';
  ctx.textBaseline = 'middle';
  ctx.fillText(`${Math.round(map.yMin)} mm`, padLeft - 5, padTop + plotH);
  ctx.fillText(`${Math.round(map.yMax)} mm`, padLeft - 5, padTop + 2);
  ctx.textAlign = 'left';
  ctx.textBaseline = 'bottom';
  ctx.fillText('y', 12, padTop + 8);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.fillText(`${Math.round(map.xMin)} mm`, padLeft, padTop + plotH + 4);
  ctx.fillText(`${Math.round(map.xMax)} mm`, padLeft + plotW, padTop + plotH + 4);

  if (marker) {
    const mx = padLeft + ((marker.x - map.xMin) / (map.xMax - map.xMin)) * plotW;
    const my = padTop + (1 - (marker.y - map.yMin) / (map.yMax - map.yMin)) * plotH;
    ctx.strokeStyle = 'rgba(255,255,255,0.8)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(mx - 5, my);
    ctx.lineTo(mx + 5, my);
    ctx.moveTo(mx, my - 5);
    ctx.lineTo(mx, my + 5);
    ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,0.92)';
    ctx.beginPath();
    ctx.arc(mx, my, 1.8, 0, Math.PI * 2);
    ctx.fill();
  }
}

/** Rolling trap speed trace for the gravity gun. */
export function drawSpeedTrace(
  canvas: HTMLCanvasElement,
  history: Array<{ t: number; v: number }>,
  limit: number
): void {
  const surfaceData = surface(canvas);
  if (!surfaceData) return;
  const { ctx, width, height } = surfaceData;
  const pad = 10;
  const plotW = width - pad * 2;
  const plotH = height - pad * 2;
  ctx.fillStyle = 'rgba(255,255,255,0.016)';
  ctx.fillRect(pad, pad, plotW, plotH);
  ctx.strokeStyle = GRID;
  ctx.beginPath();
  for (let i = 0; i <= 3; i++) {
    const y = pad + (plotH * i) / 3;
    ctx.moveTo(pad, y);
    ctx.lineTo(pad + plotW, y);
  }
  ctx.stroke();
  if (history.length < 2) {
    ctx.fillStyle = DIM;
    ctx.font = MONO;
    ctx.textAlign = 'center';
    ctx.fillText('移动声瓶后显示速度', width / 2, height / 2);
    return;
  }
  const t0 = history[0].t;
  const span = Math.max(history[history.length - 1].t - t0, 1);
  const maxV = Math.max(limit * 1.1, ...history.map((entry) => entry.v), 1);
  ctx.beginPath();
  ctx.strokeStyle = MAGENTA;
  ctx.lineWidth = 1.4;
  for (let i = 0; i < history.length; i++) {
    const x = pad + ((history[i].t - t0) / span) * plotW;
    const y = pad + plotH - (history[i].v / maxV) * plotH;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.stroke();
  ctx.fillStyle = TEXT;
  ctx.font = MONO;
  ctx.textAlign = 'right';
  ctx.fillText(`${maxV.toFixed(0)}`, width - pad, pad + 8);
}
