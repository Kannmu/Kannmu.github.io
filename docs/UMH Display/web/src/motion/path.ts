/**
 * Closed planar path -> dense arc-length samples with curvature and attributes.
 * Port of ``umh_display/motion/path.py``: polygon corners become circular
 * fillets (or full stops), edges are sampled uniformly in arc length.
 */
import { cyclicDelta } from '../core/math.ts';
import { subset, type Planar } from '../shapes/base.ts';

const U_TURN_DEG = 165.0;
const EDGE_SHARE = 0.9;

export interface DensePath {
  x: Float64Array;
  y: Float64Array;
  /** Distance from sample i to i+1 (m). */
  ds: Float64Array;
  /** Curvature (1/m). */
  curvature: Float64Array;
  /** Bead must be at rest here. */
  stop: Uint8Array;
  /** Unwrapped colour coordinate (take mod 1). */
  hue: Float64Array;
  /** Segment i -> i+1 is lit. */
  visible: Uint8Array;
  length: number;
}

const EPS = 1e-9;

export function buildDense(
  planar: Planar,
  cornerRadiusMm: number,
  stepMm: number,
  cornerMode: 'round' | 'stop' = 'round'
): DensePath {
  const n = planar.xMm.length;
  if (n < 2) throw new Error('a path needs at least two points');
  const x = Float64Array.from(planar.xMm, (v) => v * 1e-3);
  const y = Float64Array.from(planar.yMm, (v) => v * 1e-3);
  const rc = cornerRadiusMm * 1e-3;
  const step = stepMm * 1e-3;

  const edgeX = new Float64Array(n);
  const edgeY = new Float64Array(n);
  const elen = new Float64Array(n);
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n;
    edgeX[i] = x[j] - x[i];
    edgeY[i] = y[j] - y[i];
    elen[i] = Math.hypot(edgeX[i], edgeY[i]);
  }
  let degenerate = false;
  for (let i = 0; i < n; i++) if (elen[i] < EPS) degenerate = true;
  if (degenerate) {
    return buildDense(subset(planar, Array.from(elen, (e) => e >= EPS)), cornerRadiusMm, stepMm, cornerMode);
  }

  const udirX = new Float64Array(n);
  const udirY = new Float64Array(n);
  for (let i = 0; i < n; i++) {
    udirX[i] = edgeX[i] / elen[i];
    udirY[i] = edgeY[i] / elen[i];
  }
  const vis = planar.visible;

  const want = new Float64Array(n);
  const stopV = new Uint8Array(n);
  const turnSign = new Float64Array(n);
  const turnAng = new Float64Array(n);
  for (let i = 0; i < n; i++) {
    if (!planar.corners[i]) continue;
    const prev = (i - 1 + n) % n;
    const uInX = udirX[prev];
    const uInY = udirY[prev];
    const uOutX = udirX[i];
    const uOutY = udirY[i];
    const ang = Math.acos(Math.max(-1, Math.min(1, uInX * uOutX + uInY * uOutY)));
    if (ang < 1e-3) continue;
    const blank = !vis[prev] && !vis[i];
    const radiusMm = planar.radiusMm[i];
    const rI = Number.isFinite(radiusMm) ? radiusMm * 1e-3 : rc;
    if ((ang * 180) / Math.PI > U_TURN_DEG || rI <= 0 || (cornerMode === 'stop' && !blank)) {
      stopV[i] = 1;
      continue;
    }
    want[i] = rI * Math.tan(ang / 2);
    turnSign[i] = uInX * uOutY - uInY * uOutX > 0 ? 1 : -1;
    turnAng[i] = ang;
  }

  const need = new Float64Array(n);
  const scale = new Float64Array(n);
  for (let i = 0; i < n; i++) {
    need[i] = want[i] + want[(i + 1) % n];
    if (need[i] > EDGE_SHARE * elen[i]) scale[i] = (EDGE_SHARE * elen[i]) / Math.max(need[i], 1e-15);
    else scale[i] = 1;
  }
  const tlen = new Float64Array(n);
  const radius = new Float64Array(n);
  for (let i = 0; i < n; i++) {
    tlen[i] = Math.min(want[i] * scale[i], want[i] * scale[(i - 1 + n) % n]);
    radius[i] = turnAng[i] > 0 ? tlen[i] / Math.tan(Math.max(turnAng[i], 1e-9) / 2) : 0;
  }

  const kv = new Float64Array(n);
  for (let i = 0; i < n; i++) {
    const prev = (i - 1 + n) % n;
    const cosT = Math.max(-1, Math.min(1, udirX[prev] * udirX[i] + udirY[prev] * udirY[i]));
    kv[i] = Math.acos(cosT) / (0.5 * (elen[prev] + elen[i]));
  }
  for (let i = 0; i < n; i++) if (planar.corners[i]) kv[i] = 0;

  const px: number[] = [];
  const py: number[] = [];
  const phue: number[] = [];
  const plit: number[] = [];
  const pstop: number[] = [];
  const pcurv: number[] = [];

  const emit = (xx: number, yy: number, hue: number, lit: boolean, curv: number, stop: boolean): void => {
    px.push(xx);
    py.push(yy);
    phue.push(hue);
    plit.push(lit ? 1 : 0);
    pstop.push(stop ? 1 : 0);
    pcurv.push(curv);
  };

  let hRun = planar.hue[0];
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n;
    const dh = cyclicDelta(planar.hue[i], planar.hue[j]);
    const a0 = tlen[i] / elen[i];
    const a1 = 1 - tlen[j] / elen[i];
    const seg = (a1 - a0) * elen[i];
    const k = Math.max(1, Math.ceil(seg / step));
    for (let m = 0; m < k; m++) {
      const tau = a0 + ((a1 - a0) * m) / k;
      emit(
        x[i] + edgeX[i] * tau,
        y[i] + edgeY[i] * tau,
        hRun + dh * tau,
        vis[i] !== 0,
        kv[i] + (kv[j] - kv[i]) * tau,
        m === 0 && stopV[i] !== 0
      );
    }
    hRun += dh;

    if (radius[j] > 0) {
      const uInX = udirX[i];
      const uInY = udirY[i];
      const normalX = -uInY * turnSign[j];
      const normalY = uInX * turnSign[j];
      const aPx = x[j] - uInX * tlen[j];
      const aPy = y[j] - uInY * tlen[j];
      const centerX = aPx + normalX * radius[j];
      const centerY = aPy + normalY * radius[j];
      const start = Math.atan2(aPy - centerY, aPx - centerX);
      const k = Math.max(2, Math.ceil((radius[j] * turnAng[j]) / step));
      for (let m = 0; m < k; m++) {
        const phi = start + (turnSign[j] * turnAng[j] * m) / k;
        emit(
          centerX + radius[j] * Math.cos(phi),
          centerY + radius[j] * Math.sin(phi),
          hRun,
          m < k / 2 ? vis[i] !== 0 : vis[j] !== 0,
          1 / radius[j],
          false
        );
      }
    }
  }

  const count = px.length;
  const outX = new Float64Array(count);
  const outY = new Float64Array(count);
  const outDs = new Float64Array(count);
  const outHue = new Float64Array(count);
  const outCurv = new Float64Array(count);
  const outLit = new Uint8Array(count);
  const outStop = new Uint8Array(count);
  for (let i = 0; i < count; i++) {
    outX[i] = px[i];
    outY[i] = py[i];
    outHue[i] = phue[i];
    outCurv[i] = pcurv[i];
    outLit[i] = plit[i];
    outStop[i] = pstop[i];
  }
  let length = 0;
  for (let i = 0; i < count; i++) {
    const j = (i + 1) % count;
    const d = Math.hypot(outX[j] - outX[i], outY[j] - outY[i]);
    outDs[i] = d;
    length += d;
  }
  return { x: outX, y: outY, ds: outDs, curvature: outCurv, stop: outStop, hue: outHue, visible: outLit, length };
}
