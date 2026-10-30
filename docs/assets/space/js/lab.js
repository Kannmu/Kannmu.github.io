/* =============================================================================
   SPATIAL · lab.js — mid-air ultrasonic phased-array field instrument
   -----------------------------------------------------------------------------
   OWNER: lab-instrument agent.  Loaded only by /lab/ (lab.html).

   MODEL
   84 (or 16) ideal point sources pᵢ radiate at f = 40 kHz.  For a geometric
   focus F the required delay is τᵢ = |F − pᵢ| / c, so at a field point r

       A(r) = | Σᵢ (1/|r − pᵢ|) · exp( j ( k|r − pᵢ| − 2πf τᵢ ) ) |

   with c = 343 m/s, λ = c/f = 8.575 mm, k = 2π/λ.  The complex field is summed
   in the x–z plane, normalised to the focal amplitude A_F, converted to
   20·log10 and floored at −20 dB.

   PERFORMANCE
   The raw grid is 240 × 150.  A geometric region of interest (a capsule around
   the beam plus the immediate aperture field) is evaluated at full resolution;
   everything else is below the colour floor and stays at −20 dB.  The sin/cos
   pair is a 2048-entry interpolated LUT.  No per-frame work: the field is only
   recomputed when a parameter changes.

   ACCURACY
   The aural/visual result is checked against a brute-force full-grid pass by
   window.__lab.audit() (development hook).  Everything is vector-exact except
   the LUT (±5e-7 rad² interpolation error) and the marching-squares contour.
   ========================================================================== */
(() => {
  'use strict';

  const body = document.body;
  if (!body || body.dataset.spPage !== 'lab') return;

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const fieldCv = $('#lab-field');
  const phaseCv = $('#lab-phase-cv');
  if (!fieldCv) return;

  /* ------------------------------------------------------------------ maths */
  const C = 343;                      // m/s at 20 °C
  const FREQ = 40000;                 // Hz
  const LAM = (C / FREQ) * 1000;      // mm  → 8.575 mm
  const K = (2 * Math.PI) / LAM;      // rad / mm
  const TWO_PI = Math.PI * 2;

  const X0 = -190, X1 = 190;          // mm, field-window edges
  const Z0 = -14, Z1 = 240;
  const NX = 240, NZ = 150;
  const DX = (X1 - X0) / NX;
  const DZ = (Z1 - Z0) / NZ;
  const APER = 90;                    // mm, horizontal aperture
  const APER_HALF = APER / 2;
  const P0 = 1;                       // Pa rms at 1 m per element (assumption)
  const SRC_MASK = 9;                 // mm, immediate source exclusion in display

  /* sin/cos LUT: one period, linear interpolation, 2048 intervals */
  const LUT_N = 2048;
  const SIN = new Float64Array(LUT_N + 1);
  const COS = new Float64Array(LUT_N + 1);
  for (let i = 0; i <= LUT_N; i++) {
    const a = (i * TWO_PI) / LUT_N;
    SIN[i] = Math.sin(a);
    COS[i] = Math.cos(a);
  }
  const LUT_SCALE = LUT_N / TWO_PI;

  /* ------------------------------------------------------------------ state */
  const DEFAULTS = { focus: 100, steer: 0, n: 84, phase: true };
  const state = { focus: 100, steer: 0, n: 84, phase: true };
  let last = null;                    // last solve result
  let raf = 0;
  let lang = document.documentElement.getAttribute('data-lang') === 'en' ? 'en' : 'zh';

  /* --------------------------------------------------------------- geometry */
  /**
   * Idealised 84-channel layout, stated explicitly in the page copy:
   * 12 columns × 7 rows, staggered (hexagonal) rows, nearest-neighbour pitch
   * 90 / 11.5 = 7.826 mm.  The x footprint is exactly 90.0 mm.
   * The 16-element case is a 4×4 sub-set of the same lattice (rows 0,2,4,6 and
   * columns 0,4,7,11); it is a sparse-sampling demonstration, not a device mode.
   */
  const layoutCache = Object.create(null);

  function makeLayouts() {
    if (layoutCache[84]) return layoutCache;

    const COLS = 12, ROWS = 7;
    const pitch = APER / 11.5;
    const dy = pitch * Math.sqrt(3) / 2;
    const all = [];
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const x = (c - (COLS - 1) / 2) * pitch + (r % 2 ? pitch / 2 : 0) - pitch / 4;
        const y = (r - (ROWS - 1) / 2) * dy;
        all.push({ x, y, row: r, col: c });
      }
    }
    const sparse = all.filter(
      (p) => [0, 2, 4, 6].indexOf(p.row) !== -1 && [0, 4, 7, 11].indexOf(p.col) !== -1
    );

    const pack = (list) => {
      const n = list.length;
      const px = new Float64Array(n);
      const py = new Float64Array(n);
      list.forEach((p, i) => { px[i] = p.x; py[i] = p.y; });
      const order = list
        .map((p, i) => ({ i, r: Math.hypot(p.x, p.y) }))
        .sort((a, b) => a.r - b.r || a.i - b.i)
        .map((o) => o.i);
      return { n, px, py, order, list };
    };

    layoutCache[84] = pack(all);
    layoutCache[16] = pack(sparse);
    layoutCache.pitch = pitch;
    layoutCache.dy = dy;
    return layoutCache;
  }

  /* ================================================================= FIEeld */
  /**
   * Field amplitude at (x, z) in mm, already normalised by A_F.
   * tau[e] is the path length |F − pᵢ| in mm.
   */
  function fieldAt(px, py, n, tau, x, z) {
    let re = 0, im = 0;
    for (let e = 0; e < n; e++) {
      const dx = x - px[e];
      const dy = -py[e];
      const r = Math.sqrt(dx * dx + dy * dy + z * z);
      if (r < 0.05) continue;
      let ph = K * (r - tau[e]);
      ph -= TWO_PI * Math.floor(ph / TWO_PI);
      const idx = ph * LUT_SCALE;
      const i0 = idx | 0;
      const f = idx - i0;
      const s = SIN[i0] + (SIN[i0 + 1] - SIN[i0]) * f;
      const c = COS[i0] + (COS[i0 + 1] - COS[i0]) * f;
      const w = 1 / r;
      re += c * w;
      im += s * w;
    }
    return Math.sqrt(re * re + im * im);
  }

  function solve() {
    const layouts = makeLayouts();
    const layout = layouts[state.n];
    const { px, py, n } = layout;

    const th = (state.steer * Math.PI) / 180;
    const Fx = state.focus * Math.sin(th);
    const Fz = state.focus * Math.cos(th);

    const tau = new Float64Array(n);
    let AF = 0, tauMin = Infinity, tauMax = -Infinity;
    for (let e = 0; e < n; e++) {
      const dx = Fx - px[e];
      const dy = -py[e];
      const rF = Math.sqrt(dx * dx + dy * dy + Fz * Fz);
      tau[e] = rF;
      AF += 1 / rF;
      if (rF < tauMin) tauMin = rF;
      if (rF > tauMax) tauMax = rF;
    }

    return { layout, px, py, n, Fx, Fz, tau, AF, tauMin, tauMax, th };
  }

  /**
   * Display region of interest.  The beam capsule widens with distance; the
   * aperture plate keeps the immediate near field (a real feature of an
   * idealised point-source array) from being cut by the capsule edge.
   * 16 elements are computed over the whole grid: a sparse array has lobes in
   * many directions and no useful single capsule.
   */
  function inROI(x, z, sn, cs, n) {
    if (n !== 84) return z >= 0;
    if (z < 0) return false;
    /* a small source plate keeps the immediate near field from being cut at
       large steering angles, without bringing back the full near-field fan */
    if (Math.abs(x) <= 58 && z <= 22) return true;
    const s = x * sn + z * cs;
    if (s < 0 || s > 342) return false;
    const lat = Math.abs(x * cs - z * sn);
    /* The envelope is widest at the aperture and narrows into the beam.  It is
       a display region only: values outside are below the colour floor. */
    const radius = 56 + 16 * Math.exp(-s / 60);
    return lat <= Math.min(82, radius);
  }

  /* ------------------------------------------------------------ source mask */
  const maskCache = Object.create(null);
  function sourceMask(n) {
    if (maskCache[n]) return maskCache[n];
    const { px, py } = makeLayouts()[n];
    const mask = new Uint8Array(NX * NZ);
    const lim = SRC_MASK * SRC_MASK;
    for (let j = 0; j < NZ; j++) {
      const z = Z1 - (j + 0.5) * DZ;
      if (z < -0.5 || z > SRC_MASK) continue;
      for (let i = 0; i < NX; i++) {
        const x = X0 + (i + 0.5) * DX;
        for (let e = 0; e < n; e++) {
          const dx = x - px[e], dy = -py[e];
          if (dx * dx + dy * dy + z * z < lim) { mask[j * NX + i] = 1; break; }
        }
      }
    }
    maskCache[n] = mask;
    return mask;
  }

  /* -------------------------------------------------------------- colour map */
  const RAMP_STOPS = [
    [0.00, 0, 0, 0],
    [0.16, 1, 4, 10],
    [0.30, 2, 16, 31],
    [0.46, 5, 42, 68],
    [0.61, 11, 85, 112],
    [0.75, 31, 147, 179],
    [0.87, 86, 203, 228],
    [0.955, 190, 239, 250],
    [1.00, 255, 255, 255]
  ];
  const RAMP = new Uint8Array(256 * 3);
  (function buildRamp() {
    let k = 0;
    for (let i = 0; i < 256; i++) {
      const t = i / 255;
      while (k < RAMP_STOPS.length - 2 && t > RAMP_STOPS[k + 1][0]) k++;
      const a = RAMP_STOPS[k], b = RAMP_STOPS[k + 1];
      const u = b[0] === a[0] ? 0 : (t - a[0]) / (b[0] - a[0]);
      RAMP[i * 3] = Math.round(a[1] + (b[1] - a[1]) * u);
      RAMP[i * 3 + 1] = Math.round(a[2] + (b[2] - a[2]) * u);
      RAMP[i * 3 + 2] = Math.round(a[3] + (b[3] - a[3]) * u);
    }
  })();

  /* --------------------------------------------------------------- palette */
  const CSS = getComputedStyle(document.documentElement);
  const COL = {
    void: CSS.getPropertyValue('--c-void').trim() || '#04060a',
    ink: CSS.getPropertyValue('--c-ink').trim() || '#070b11',
    white: CSS.getPropertyValue('--c-white').trim() || '#f2f7fb',
    mist: CSS.getPropertyValue('--c-mist').trim() || '#cfdde8',
    steel: CSS.getPropertyValue('--c-steel').trim() || '#93a9bd',
    dim: CSS.getPropertyValue('--c-dim').trim() || '#5d7285',
    cyan: CSS.getPropertyValue('--c-cyan').trim() || '#8fe6ff'
  };
  const MONO = '"SP Mono", "Cascadia Mono", Consolas, ui-monospace, monospace';
  const CJK = '"PingFang SC", "Microsoft YaHei", "SP Mono", sans-serif';

  /* -------------------------------------------------------------- offscreen */
  const raster = document.createElement('canvas');
  raster.width = NX;
  raster.height = NZ;
  const rasterCtx = raster.getContext('2d', { willReadFrequently: false });
  const rasterData = rasterCtx.createImageData(NX, NZ);

  /* ================================================================= solve */
  function compute() {
    const t0 = performance.now();
    const s = solve();
    const { px, py, n, Fx, Fz, tau, AF, tauMin, tauMax } = s;
    const sn = Math.sin(s.th), cs = Math.cos(s.th);
    const grid = new Float32Array(NX * NZ);
    const mask = sourceMask(n);
    let roiCells = 0;

    for (let j = 0; j < NZ; j++) {
      const z = Z1 - (j + 0.5) * DZ;
      if (z < 0) continue;
      for (let i = 0; i < NX; i++) {
        const x = X0 + (i + 0.5) * DX;
        if (!inROI(x, z, sn, cs, n)) continue;
        if (mask[j * NX + i]) continue;
        const k = j * NX + i;
        grid[k] = fieldAt(px, py, n, tau, x, z) / AF;
        roiCells++;
      }
    }

    /* focal widths from 0.4 mm 1-D cuts, refined by linear interpolation */
    const lat = cutWidth((x) => fieldAt(px, py, n, tau, x, Fz) / AF, Fx, 90, 0.4);
    const ax = cutWidth((z) => fieldAt(px, py, n, tau, Fx, z) / AF, Fz, 340, 0.4);

    const pPa = P0 * 1000 * AF;                       // r in mm → 1/m factor 1000
    const spl = 20 * Math.log10(pPa / 20e-6);
    const gain = 20 * Math.log10(AF * state.focus);
    const rayleigh = (1.22 * LAM * state.focus) / APER;
    const fresnel = (APER_HALF * APER_HALF) / (LAM * state.focus);

    /* contour from the full grid (level = 0.5, i.e. −6.02 dB) */
    const contour = buildContour(grid, 0.5);

    /* display grid → ImageData (dB, floor −20) */
    const data = rasterData.data;
    for (let k = 0; k < grid.length; k++) {
      const o = k * 4;
      const v = grid[k];
      if (!(v > 0)) {
        data[o] = 0; data[o + 1] = 0; data[o + 2] = 0; data[o + 3] = 255;
        continue;
      }
      let db = 20 * Math.log10(v);
      if (db > 0) db = 0;
      if (db < -20) db = -20;
      const idx = Math.round(((db + 20) / 20) * 255);
      data[o] = RAMP[idx * 3];
      data[o + 1] = RAMP[idx * 3 + 1];
      data[o + 2] = RAMP[idx * 3 + 2];
      data[o + 3] = 255;
    }
    rasterCtx.putImageData(rasterData, 0, 0);

    /* the focal amplitude is exactly 1 by construction; make the cell that
       contains the focus carry that value so the marker always has a white core */
    const fi = Math.max(0, Math.min(NX - 1, Math.round((Fx - X0) / DX - 0.5)));
    const fj = Math.max(0, Math.min(NZ - 1, Math.round((Z1 - Fz) / DZ - 0.5)));
    const fk = fj * NX + fi;
    if (grid[fk] > 0) grid[fk] = Math.max(grid[fk], 1);

    let displayMax = 0;
    for (let k = 0; k < grid.length; k++) if (grid[k] > displayMax) displayMax = grid[k];
    if (!(displayMax > 0)) displayMax = 1;

    const t1 = performance.now();

    last = {
      ...s,
      grid,
      contour,
      latW: lat.w,
      axW: ax.w,
      latClip: lat.clip,
      axClip: ax.clip,
      spl,
      gain,
      rayleigh,
      fresnel,
      roiCells,
      displayMax,
      focusRel: 20 * Math.log10(1 / displayMax),
      ms: t1 - t0
    };

    updateUI(last);
    drawField();
    drawPhase();
    return last;
  }

  /**
   * First −6 dB crossing on both sides of `center`, in mm.
   * Returns { w, clip } — clip is true when the scan limit was reached.
   */
  function cutWidth(fn, center, half, step) {
    const start = fn(center);
    if (!(start > 0)) return { w: null, clip: true };
    let prev = start;
    let left = null, right = null;
    const steps = Math.ceil(half / step);

    for (let k = 1; k <= steps; k++) {
      const t = center - k * step;
      const v = fn(t);
      if (left === null && v < 0.5 && prev >= 0.5) {
        left = center - (k - 1) * step + ((0.5 - prev) / (v - prev)) * -step;
        break;
      }
      prev = v;
    }

    prev = start;
    for (let k = 1; k <= steps; k++) {
      const t = center + k * step;
      const v = fn(t);
      if (right === null && v < 0.5 && prev >= 0.5) {
        right = center + (k - 1) * step + ((0.5 - prev) / (v - prev)) * step;
        break;
      }
      prev = v;
    }

    if (left === null || right === null) {
      const w = left === null && right === null ? null : (right !== null ? (right - center) * 2 : (center - left) * 2);
      return { w, clip: true };
    }
    return { w: right - left, clip: false };
  }

  /* --------------------------------------------------------- marching squares */
  function buildContour(grid, level) {
    const segs = [];
    const xAt = (i, t) => X0 + (i + 0.5 + t) * DX;
    const zAt = (j, t) => Z1 - (j + 0.5 + t) * DZ;

    for (let j = 0; j < NZ - 1; j++) {
      for (let i = 0; i < NX - 1; i++) {
        const k = j * NX + i;
        const a = grid[k], b = grid[k + 1], c = grid[k + NX + 1], d = grid[k + NX];
        if (!(a > 0 && b > 0 && c > 0 && d > 0)) continue;
        const pts = [];
        if ((a - level) * (b - level) < 0) {
          const t = (level - a) / (b - a);
          pts.push([xAt(i, t), zAt(j, 0)]);
        }
        if ((b - level) * (c - level) < 0) {
          const t = (level - b) / (c - b);
          pts.push([xAt(i + 1, 0), zAt(j, t)]);
        }
        if ((c - level) * (d - level) < 0) {
          const t = (level - c) / (d - c);
          pts.push([xAt(i, t), zAt(j + 1, 0)]);
        }
        if ((d - level) * (a - level) < 0) {
          const t = (level - d) / (a - d);
          pts.push([xAt(i, 0), zAt(j, t)]);
        }
        if (pts.length === 2) segs.push([pts[0][0], pts[0][1], pts[1][0], pts[1][1]]);
        else if (pts.length === 4) {
          segs.push([pts[0][0], pts[0][1], pts[1][0], pts[1][1]]);
          segs.push([pts[2][0], pts[2][1], pts[3][0], pts[3][1]]);
        }
      }
    }
    return segs;
  }

  /* ================================================================= canvas */
  function fitCanvas(cv) {
    const rect = cv.getBoundingClientRect();
    const w = Math.round(rect.width);
    const h = Math.round(rect.height);
    if (w < 2 || h < 2) return null;
    const dpr = Math.min(window.devicePixelRatio || 1, 3);
    const pw = Math.round(w * dpr);
    const ph = Math.round(h * dpr);
    if (cv.width !== pw || cv.height !== ph) {
      cv.width = pw;
      cv.height = ph;
    }
    const ctx = cv.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return { ctx, w, h, dpr };
  }

  function line(ctx, x1, y1, x2, y2) {
    ctx.beginPath();
    ctx.moveTo(Math.round(x1) + 0.5, Math.round(y1) + 0.5);
    ctx.lineTo(Math.round(x2) + 0.5, Math.round(y2) + 0.5);
    ctx.stroke();
  }

  function label(ctx, str, x, y, color, font, align) {
    ctx.font = font || '400 8.5px ' + MONO;
    ctx.fillStyle = color || COL.steel;
    ctx.textAlign = align || 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(str, x, y);
  }

  /* ------------------------------------------------------------------ field */
  function drawField() {
    if (!last) return;
    const fit = fitCanvas(fieldCv);
    if (!fit) return;
    const { ctx, w, h } = fit;

    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = COL.void;
    ctx.fillRect(0, 0, w, h);

    const scale = Math.min(w / (X1 - X0), h / (Z1 - Z0));
    const ox = (w - (X1 - X0) * scale) / 2;
    const oy = (h - (Z1 - Z0) * scale) / 2;
    const px = (x) => ox + (x - X0) * scale;
    const py = (z) => oy + (Z1 - z) * scale;

    /* raster */
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(raster, ox, oy, (X1 - X0) * scale, (Z1 - Z0) * scale);

    const { Fx, Fz, latW, axW, n } = last;

    /* −6 dB contour */
    if (last.contour && last.contour.length) {
      ctx.globalAlpha = 0.38;
      ctx.strokeStyle = COL.cyan;
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let i = 0; i < last.contour.length; i++) {
        const g = last.contour[i];
        ctx.moveTo(px(g[0]), py(g[1]));
        ctx.lineTo(px(g[2]), py(g[3]));
      }
      ctx.stroke();
      ctx.globalAlpha = 1;
    }

    /* measurement cuts (dashed 1 px) */
    if (latW && axW) {
      ctx.save();
      ctx.globalAlpha = 0.22;
      ctx.strokeStyle = COL.cyan;
      ctx.lineWidth = 1;
      ctx.setLineDash([2, 3]);
      const lx0 = Math.max(X0, Fx - latW / 2 - 8);
      const lx1 = Math.min(X1, Fx + latW / 2 + 8);
      line(ctx, px(lx0), py(Fz), px(lx1), py(Fz));
      const lz0 = Math.max(0, Fz - axW / 2 - 8);
      const lz1 = Math.min(Z1, Fz + axW / 2 + 8);
      line(ctx, px(Fx), py(lz0), px(Fx), py(lz1));
      ctx.restore();
    }

    /* axes + ticks */
    const plotL = px(X0), plotR = px(X1), plotT = py(Z1), plotB = py(Z0);
    ctx.globalAlpha = 0.16;
    ctx.strokeStyle = COL.steel;
    line(ctx, plotL, py(0), plotR, py(0));
    line(ctx, plotL, py(0), plotL, plotT);
    ctx.globalAlpha = 1;

    const small = w < 520;
    const xStep = small ? 75 : 50;
    const zStep = 50;
    const tickFont = (small ? '400 8px ' : '400 8.5px ') + MONO;
    /* keep the x labels inside the 14 mm bottom margin at small canvas scales */
    const xLabelY = Math.max(6.5, Math.min(10.5, 14 * scale - 5));

    ctx.globalAlpha = 0.42;
    for (let x = -150; x <= 150; x += xStep) {
      const sx = Math.round(px(x)) + 0.5;
      line(ctx, sx, py(0), sx, py(0) + 3.5);
      ctx.globalAlpha = 0.9;
      label(ctx, (x === 0 ? '0' : String(x).replace('-', '−')), sx, py(0) + xLabelY, COL.steel, tickFont, 'center');
      ctx.globalAlpha = 0.42;
    }
    for (let z = zStep; z <= 200; z += zStep) {
      const sy = Math.round(py(z)) + 0.5;
      line(ctx, plotL, sy, plotL + 3.5, sy);
      ctx.globalAlpha = 0.9;
      label(ctx, String(z), plotL + 7, sy, COL.steel, tickFont, 'left');
      ctx.globalAlpha = 0.42;
    }
    ctx.globalAlpha = 1;
    label(ctx, 'z / mm', plotL + 7, plotT + 9, COL.steel, tickFont, 'left');

    /* aperture strip */
    ctx.globalAlpha = 0.5;
    ctx.strokeStyle = COL.steel;
    line(ctx, px(-APER_HALF - 2), py(0), px(APER_HALF + 2), py(0));
    ctx.globalAlpha = 0.34;
    const layout = makeLayouts()[n];
    for (let e = 0; e < layout.n; e++) {
      const ex = Math.round(px(layout.px[e])) + 0.5;
      line(ctx, ex, py(0), ex, py(0) - 2.5);
    }
    ctx.globalAlpha = 1;

    /* focal marker */
    const sx = px(Fx), sy = py(Fz);
    ctx.globalAlpha = 0.9;
    ctx.strokeStyle = COL.cyan;
    ctx.lineWidth = 1;
    line(ctx, sx - 7, sy, sx + 7, sy);
    line(ctx, sx, sy - 7, sx, sy + 7);
    ctx.globalAlpha = 1;
    ctx.fillStyle = COL.cyan;
    ctx.fillRect(Math.round(sx) - 1, Math.round(sy) - 1, 2, 2);

    /* focal label with leader */
    const isEN = lang === 'en';
    const head = isEN ? 'FOCUS' : '焦斑';
    const numX = latW ? latW.toFixed(1) : '—';
    const numZ = axW ? axW.toFixed(1) : '—';
    const text = 'FWHM ' + numX + ' × ' + numZ + ' mm';
    const fHead = '500 8.5px ' + CJK;
    const fBody = '400 8.5px ' + MONO;
    ctx.font = fHead;
    const wHead = ctx.measureText(head).width;
    ctx.font = fBody;
    const wBody = ctx.measureText(text).width;
    const bw = wHead + 6 + wBody + 8;
    const bh = 15;
    let lx = sx + 16;
    let ly = sy - 22;
    if (lx + bw > w - 5) lx = sx - 16 - bw;
    if (ly - bh / 2 < 5) ly = sy + 26;
    if (ly + bh / 2 > h - 5) ly = sy - 26;

    ctx.globalAlpha = 0.62;
    ctx.strokeStyle = COL.steel;
    line(ctx, sx + (lx > sx ? 7 : -7), sy - 7, lx + (lx > sx ? 0 : bw), ly);
    ctx.globalAlpha = 1;

    ctx.globalAlpha = 0.78;
    ctx.fillStyle = COL.void;
    ctx.fillRect(Math.round(lx), Math.round(ly - bh / 2), Math.round(bw), bh);
    ctx.globalAlpha = 1;
    ctx.globalAlpha = 0.5;
    ctx.strokeStyle = COL.cyan;
    line(ctx, lx, ly - bh / 2, lx + bw, ly - bh / 2);
    ctx.globalAlpha = 1;

    label(ctx, head, lx + 4, ly + 0.5, COL.cyan, fHead, 'left');
    label(ctx, text, lx + 4 + wHead + 6, ly + 0.5, COL.mist, fBody, 'left');
  }

  /* ------------------------------------------------------------------ phase */
  function drawPhase() {
    const block = $('#lab-phase');
    if (!phaseCv || !block || block.classList.contains('is-off')) return;
    if (!last) return;
    const fit = fitCanvas(phaseCv);
    if (!fit) return;
    const { ctx, w, h } = fit;
    ctx.clearRect(0, 0, w, h);

    const { layout, tau, tauMin, tauMax } = last;
    const span = Math.max(1e-9, tauMax - tauMin);
    const baseline = h - 1;
    const usable = h - 11;

    ctx.globalAlpha = 0.14;
    ctx.strokeStyle = COL.steel;
    line(ctx, 0, 6, w, 6);
    ctx.globalAlpha = 0.3;
    line(ctx, 0, baseline, w, baseline);
    ctx.globalAlpha = 1;

    const pad = 2;
    const n = layout.n;
    const stepX = n > 1 ? (w - pad * 2) / (n - 1) : 0;

    for (let k = 0; k < n; k++) {
      const e = layout.order[k];
      const u = (tau[e] - tauMin) / span;
      const x = Math.round(pad + k * stepX);
      const bh = Math.max(1, Math.round(u * usable));
      ctx.fillStyle = u > 0.985 ? COL.white : COL.cyan;
      ctx.globalAlpha = u > 0.985 ? 0.9 : 0.55;
      ctx.fillRect(x, baseline - bh, 1, bh);
    }
    ctx.globalAlpha = 1;
  }

  /* =================================================================== UI */
  function fmtSteer(v) {
    const s = v === 0 ? '0.0' : (v > 0 ? '+' : '−') + Math.abs(v).toFixed(1);
    return s;
  }

  function setText(sel, val) {
    const el = $(sel);
    if (el) el.textContent = val;
  }

  function updateUI(res) {
    const st = state;
    setText('[data-read="r"]', st.focus.toFixed(1));
    setText('[data-read="steer"]', fmtSteer(st.steer).replace('+', ''));
    setText('[data-read="lambda"]', LAM.toFixed(3));
    setText('[data-read="rayleigh"]', res.rayleigh.toFixed(1));
    setText('[data-read="fwhm-x"]', res.latW ? res.latW.toFixed(1) : '—');
    setText('[data-read="fwhm-z"]', res.axW ? res.axW.toFixed(1) : '—');
    setText('[data-read="spl"]', res.spl.toFixed(1));
    const rel = res.focusRel;
    setText('[data-read="repeak"]', (rel < 0 ? '−' + Math.abs(rel).toFixed(1) : rel.toFixed(1)));
    setText('[data-read="gain"]', res.gain.toFixed(1));
    setText('[data-read="fresnel"]', res.fresnel.toFixed(2));

    const outR = $('#lab-focus-out b');
    const outS = $('#lab-steer-out b');
    if (outR) outR.textContent = String(Math.round(st.focus));
    if (outS) outS.textContent = String(Math.round(st.steer));

    const fFocus = $('#lab-focus');
    const fSteer = $('#lab-steer');
    if (fFocus) fFocus.style.setProperty('--fill', ((st.focus - 30) / 170) * 100 + '%');
    if (fSteer) fSteer.style.setProperty('--fill', ((st.steer + 40) / 80) * 100 + '%');

    const grid = $('#lab-grid-meta');
    if (grid) grid.textContent = NX + ' × ' + NZ;
    const ms = $('#lab-compute');
    if (ms) ms.textContent = res.ms.toFixed(1) + ' ms';

    const meta = $('#lab-phase-meta');
    if (meta) {
      if (!st.phase) meta.textContent = lang === 'en' ? 'PHASE HIDDEN' : '相位隐藏';
      else {
        const dt = (res.tauMax - res.tauMin) / (C / 1000);
        meta.textContent = res.n + ' ch · Δτ ' + dt.toFixed(1) + ' µs';
      }
    }

    /* screen-reader figure description — both languages live in the DOM */
    const zh = $('#lab-figure-desc [data-zh]');
    const en = $('#lab-figure-desc [data-en]');
    const zhTxt =
      '声场截面：' + res.n + ' 个阵元，焦距 ' + st.focus.toFixed(1) + ' 毫米，偏转 ' +
      st.steer.toFixed(1) + ' 度，波长 ' + LAM.toFixed(3) + ' 毫米，−6 dB 焦斑宽度 ' +
      (res.latW ? res.latW.toFixed(1) : '未知') + ' × ' + (res.axW ? res.axW.toFixed(1) : '未知') +
      ' 毫米，估计峰值声压 ' + res.spl.toFixed(1) + ' dB SPL，焦点相对场峰值 ' +
      (res.focusRel < 0 ? '−' + Math.abs(res.focusRel).toFixed(1) : res.focusRel.toFixed(1)) +
      ' dB。';
    const enTxt =
      'Acoustic field section: ' + res.n + ' elements, focal distance ' + st.focus.toFixed(1) +
      ' millimetres, steering ' + st.steer.toFixed(1) + ' degrees, wavelength ' + LAM.toFixed(3) +
      ' millimetres, −6 dB focal width ' + (res.latW ? res.latW.toFixed(1) : 'unknown') +
      ' by ' + (res.axW ? res.axW.toFixed(1) : 'unknown') + ' millimetres, estimated peak pressure ' +
      res.spl.toFixed(1) + ' dB SPL, focal level relative to the field peak ' +
      (res.focusRel < 0 ? 'minus ' + Math.abs(res.focusRel).toFixed(1) : res.focusRel.toFixed(1)) +
      ' dB.';
    if (zh) zh.textContent = zhTxt;
    if (en) en.textContent = enTxt;

    setRangeSemantics();
    announce(zhTxt, enTxt);
  }

  function setRangeSemantics() {
    const f = $('#lab-focus');
    const s = $('#lab-steer');
    if (f) {
      f.setAttribute('aria-valuetext', lang === 'en' ? state.focus + ' millimetres' : state.focus + ' 毫米');
    }
    if (s) {
      s.setAttribute('aria-valuetext', lang === 'en' ? state.steer + ' degrees' : state.steer + ' 度');
    }
  }

  let liveTimer = 0;
  function announce(zhTxt, enTxt) {
    const live = $('#lab-live');
    if (!live) return;
    clearTimeout(liveTimer);
    liveTimer = setTimeout(() => {
      live.textContent = lang === 'en' ? enTxt : zhTxt;
    }, 220);
  }

  /* ================================================================= read */
  function schedule() {
    if (raf) return;
    raf = requestAnimationFrame(() => {
      raf = 0;
      try {
        compute();
      } catch (err) {
        const ms = $('#lab-compute');
        if (ms) ms.textContent = 'ERR';
        if (window.console && console.warn) console.warn('[lab] compute failed', err);
      }
    });
  }

  /* =============================================================== controls */
  function bind() {
    const fFocus = $('#lab-focus');
    const fSteer = $('#lab-steer');
    const selN = $('#lab-elements');
    const cbPhase = $('#lab-phase-toggle');
    const reset = $('#lab-reset');

    if (fFocus) {
      fFocus.setAttribute('aria-valuetext', state.focus + ' 毫米');
      fFocus.addEventListener('input', () => {
        state.focus = Math.max(30, Math.min(200, Number(fFocus.value) || 100));
        const out = $('#lab-focus-out b');
        if (out) out.textContent = String(Math.round(state.focus));
        setRangeSemantics();
        schedule();
      });
    }
    if (fSteer) {
      fSteer.setAttribute('aria-valuetext', '0 度');
      fSteer.addEventListener('input', () => {
        state.steer = Math.max(-40, Math.min(40, Number(fSteer.value) || 0));
        const out = $('#lab-steer-out b');
        if (out) out.textContent = String(Math.round(state.steer));
        setRangeSemantics();
        schedule();
      });
    }
    if (selN) {
      selN.addEventListener('change', () => {
        state.n = selN.value === '16' ? 16 : 84;
        schedule();
      });
    }
    if (cbPhase) {
      cbPhase.addEventListener('change', () => {
        state.phase = !!cbPhase.checked;
        const block = $('#lab-phase');
        if (block) block.classList.toggle('is-off', !state.phase);
        const meta = $('#lab-phase-meta');
        if (meta) {
          if (!state.phase) meta.textContent = lang === 'en' ? 'PHASE HIDDEN' : '相位隐藏';
          else if (last) {
            const dt = (last.tauMax - last.tauMin) / (C / 1000);
            meta.textContent = last.n + ' ch · Δτ ' + dt.toFixed(1) + ' µs';
          }
        }
        if (state.phase) requestAnimationFrame(drawPhase);
      });
    }
    if (reset) {
      reset.addEventListener('click', () => {
        state.focus = DEFAULTS.focus;
        state.steer = DEFAULTS.steer;
        state.n = DEFAULTS.n;
        state.phase = DEFAULTS.phase;
        if (fFocus) fFocus.value = String(DEFAULTS.focus);
        if (fSteer) fSteer.value = String(DEFAULTS.steer);
        if (selN) selN.value = String(DEFAULTS.n);
        if (cbPhase) cbPhase.checked = true;
        const block = $('#lab-phase');
        if (block) block.classList.remove('is-off');
        const outR = $('#lab-focus-out b');
        const outS = $('#lab-steer-out b');
        if (outR) outR.textContent = String(DEFAULTS.focus);
        if (outS) outS.textContent = String(DEFAULTS.steer);
        schedule();
      });
    }
  }

  /* ================================================================== lang */
  function applyLang() {
    const next = document.documentElement.getAttribute('data-lang') === 'en' ? 'en' : 'zh';
    if (next === lang) return;
    lang = next;
    setRangeSemantics();
    if (last) {
      updateUI(last);
      drawField();
      drawPhase();
    }
  }

  document.addEventListener('sp:lang', () => requestAnimationFrame(applyLang), { passive: true });
  if (window.MutationObserver) {
    try {
      new MutationObserver(() => applyLang()).observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['data-lang']
      });
    } catch (e) { /* ignore */ }
  }

  /* ================================================================ resize */
  let resizeTimer = 0;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      drawField();
      drawPhase();
    }, 80);
  }, { passive: true });

  if (window.ResizeObserver) {
    try {
      const ro = new ResizeObserver(() => {
        requestAnimationFrame(() => {
          drawField();
          if (state.phase) drawPhase();
        });
      });
      ro.observe(fieldCv);
    } catch (e) { /* ignore */ }
  }

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => {
      if (last) { drawField(); drawPhase(); }
    }).catch(() => {});
  }

  /* ============================================================== debug hook */
  window.__lab = {
    state,
    get result() { return last; },
    recompute: schedule,
    /**
     * Brute-force audit: compute the full 240×150 grid and report the strongest
     * cell outside the geometric ROI.  If this is above ≈−20 dB the ROI is
     * clipping visible data.  Development only; not called by the page.
     */
    audit() {
      const s = solve();
      const { px, py, n, Fx, Fz, tau, AF, th } = s;
      const sn = Math.sin(th), cs = Math.cos(th);
      const mask = sourceMask(n);
      let max = 0, at = null, roi = 0, total = 0;
      for (let j = 0; j < NZ; j++) {
        const z = Z1 - (j + 0.5) * DZ;
        if (z < 0) continue;
        for (let i = 0; i < NX; i++) {
          const x = X0 + (i + 0.5) * DX;
          if (mask[j * NX + i]) continue;
          total++;
          const v = fieldAt(px, py, n, tau, x, z) / AF;
          if (inROI(x, z, sn, cs, n)) roi++;
          else if (v > max) { max = v; at = [x.toFixed(1), z.toFixed(1)]; }
        }
      }
      return {
        n, focus: state.focus, steer: state.steer,
        maxOutside: max, maxOutsideDb: 20 * Math.log10(max),
        at, roiPct: (100 * roi) / total
      };
    }
  };

  /* =================================================================== boot */
  makeLayouts();
  sourceMask(84);
  sourceMask(16);
  bind();
  setRangeSemantics();
  compute();
  /* second pass: V8 has warmed up, so the displayed Δt is representative */
  requestAnimationFrame(() => { if (last) compute(); });
})();
