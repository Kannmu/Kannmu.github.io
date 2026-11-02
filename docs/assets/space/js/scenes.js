/* =============================================================================
   SPATIAL SCENES · v3 “SPECTRAL VECTOR”
   -----------------------------------------------------------------------------
   A black dimensionless hall, drawn rather than lit.

     · LARGE matte volumes (lighter than the void: #171b22 → #0c0e13) with 1px
       white arrises at 0.45–0.6 alpha: solids, not nets.
     · one continuous spectral seam at eye level (violet → cyan → lime) across
       the whole hall, plus ONE chromatic moment per station.
     · structural ribs every 5.5 m, 1px floor-to-ceiling.
     · a plan grid on the floor and a faint horizon wash so the room has a base.
     · giant outlined floor numerals from hand-built line glyphs (no font).
     · the mirror floor doubles the seam and every silhouette.

   COMPOSITION RULE (lead review):
     no multi-line crossing volumes in the content band.  Signatures stand to
     the RIGHT of the content (x ≈ +5.5…+7 m) or deep behind it
     (z ≤ contentZ − 9 m), never in the centre.

   API (fixed):
     buildScenes({ THREE, scene, renderer, camera, quality, ambient, mirror,
                   stations })
       -> { update(time, dt, camera, state), resize(w, h, pr), focus(key),
            dispose(), groups, mirror }

   update() allocates nothing.  All GLSL is texture-free.  ~35 draw calls in
   the main pass (the mirror pass doubles them) — well inside 220/90.

   OWNER: scene-artist.  Only this file may be written by it.
   ========================================================================== */
import * as THREE from 'three';
import { STATIONS, stationFrame } from './stations.js';

/* --------------------------------------------------------------- constants */
const HALL = {
  half: 8.4,          // wall plane |x|
  ceil: 7.2,          // ceiling datum
  rib: 5.5,           // structural rib spacing
  zA: 18,             // corridor start (behind the entry camera)
  zB: -156,           // corridor end
  seamY: 1.55,        // the contact horizon sits at eye level
  railX: 5.4,         // the spectral light rail runs on the floor, inboard
};

const FLOOR_Y = 0.012;
const RING_KEYS = ['gaze', 'bci', 'haptics', 'method'];

/* palette — sRGB hexes, converted to linear by THREE.Color */
const PAL = {
  line: 0xe8e4dc,       // warm white; the post chain grades it back to neutral
  massBottom: 0x1d222b,
  massTop: 0x0f1218,
  rim: 0x2b3038,
  seamB: 0x24d6ea,
  dust: 0xdedbd2,
};

/* spectral stops in linear space (no runtime conversion, no textures) */
const SPECTRAL_GLSL = /* glsl */ `
  vec3 spRamp(float x){
    float t = fract(x) * 3.0;
    vec3 c1 = vec3(0.2020, 0.1070, 1.0000);   /* #7C5CFF */
    vec3 c2 = vec3(0.0177, 0.6720, 0.8230);   /* #24D6EA */
    vec3 c3 = vec3(0.5650, 1.0000, 0.0690);   /* #C6FF4A */
    if (t < 1.0) return mix(c1, c2, t);
    if (t < 2.0) return mix(c2, c3, t - 1.0);
    return mix(c3, c1, t - 2.0);
  }
`;

/* --------------------------------------------------------------- small math */
const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
const smoothJ = (a, b, x) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
const dampA = (cur, target, lambda, dt) => target + (cur - target) * Math.exp(-lambda * dt);

/* --------------------------------------------------------------- line sink */
/* Collects 1px segments with a per-vertex alpha weight aA and a per-vertex
   gradient coordinate aG.  Built once; never touched again.                 */
function LineSink() {
  this.pos = [];
  this.alpha = [];
  this.grad = [];
}
LineSink.prototype.seg = function (ax, ay, az, bx, by, bz, a, g) {
  const w = a === undefined ? 1 : a;
  const gg = g === undefined ? 0 : g;
  this.pos.push(ax, ay, az, bx, by, bz);
  this.alpha.push(w, w);
  this.grad.push(gg, gg);
};
LineSink.prototype.seg2 = function (ax, ay, az, bx, by, bz, a0, a1, g) {
  const gg = g === undefined ? 0 : g;
  this.pos.push(ax, ay, az, bx, by, bz);
  this.alpha.push(a0, a1);
  this.grad.push(gg, gg);
};
LineSink.prototype.count = function () { return this.pos.length / 6; };
LineSink.prototype.geometry = function () {
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(this.pos, 3));
  geo.setAttribute('aA', new THREE.Float32BufferAttribute(this.alpha, 1));
  geo.setAttribute('aG', new THREE.Float32BufferAttribute(this.grad, 1));
  return geo;
};

/* --------------------------------------------------------------- mass sink */
/* Accumulates every matte face of the whole world into one mesh.            */
function MassSink() {
  this.pos = [];
  this.nrm = [];
  this.tint = [];
  this._a = new THREE.Vector3();
  this._b = new THREE.Vector3();
  this._n = new THREE.Vector3();
  this._q = new THREE.Quaternion();
  this._e = new THREE.Euler();
}
MassSink.prototype.quad = function (p0, p1, p2, p3, tint) {
  this._a.set(p1[0] - p0[0], p1[1] - p0[1], p1[2] - p0[2]);
  this._b.set(p2[0] - p0[0], p2[1] - p0[1], p2[2] - p0[2]);
  this._n.crossVectors(this._a, this._b).normalize();
  const n = this._n;
  const P = this.pos, N = this.nrm, T = this.tint;
  P.push(p0[0], p0[1], p0[2], p1[0], p1[1], p1[2], p2[0], p2[1], p2[2]);
  P.push(p0[0], p0[1], p0[2], p2[0], p2[1], p2[2], p3[0], p3[1], p3[2]);
  for (let i = 0; i < 6; i++) { N.push(n.x, n.y, n.z); T.push(tint); }
};
MassSink.prototype.geometry = function () {
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(this.pos, 3));
  geo.setAttribute('normal', new THREE.Float32BufferAttribute(this.nrm, 3));
  geo.setAttribute('aTint', new THREE.Float32BufferAttribute(this.tint, 1));
  geo.computeBoundingSphere();
  return geo;
};

/* box corner ids:
   0 (-1,-1,+1) 1 (+1,-1,+1) 2 (+1,+1,+1) 3 (-1,+1,+1)
   4 (+1,-1,-1) 5 (-1,-1,-1) 6 (-1,+1,-1) 7 (+1,+1,-1)                 */
const BOX_FACES = [
  [0, 1, 2, 3],   // +z
  [4, 5, 6, 7],   // -z
  [1, 4, 7, 2],   // +x
  [5, 0, 3, 6],   // -x
  [3, 2, 7, 6],   // +y
  [5, 4, 1, 0],   // -y
];
const BOX_EDGES = [
  [0, 1], [1, 2], [2, 3], [3, 0],
  [4, 5], [5, 6], [6, 7], [7, 4],
  [0, 5], [1, 4], [2, 7], [3, 6],
];

const _corner = [];

/**
 * Adds a rotated box: 6 matte faces into `mass`, 12 hairline arrises into
 * `lines`.  `rot` is [x,y,z] radians.  `edge` is the arris alpha.
 */
function addSlab(mass, lines, o) {
  const cx = o.x, cy = o.y, cz = o.z;
  const hw = o.w * 0.5, hh = o.h * 0.5, hd = o.d * 0.5;
  const rot = o.rot;
  const tint = o.tint === undefined ? 1 : o.tint;
  const edge = o.edge === undefined ? 0.8 : o.edge;
  const g = o.g === undefined ? 0 : o.g;

  let q = null;
  if (rot && (rot[0] || rot[1] || rot[2])) {
    q = mass._q.setFromEuler(mass._e.set(rot[0], rot[1], rot[2]));
  }
  const pts = _corner;
  pts.length = 0;
  const raw = [
    [-hw, -hh, hd], [hw, -hh, hd], [hw, hh, hd], [-hw, hh, hd],
    [hw, -hh, -hd], [-hw, -hh, -hd], [-hw, hh, -hd], [hw, hh, -hd],
  ];
  for (let i = 0; i < 8; i++) {
    const p = raw[i];
    let x = p[0], y = p[1], z = p[2];
    if (q) {
      const vx = q.x, vy = q.y, vz = q.z, qw = q.w;
      const ix = qw * x + vy * z - vz * y;
      const iy = qw * y + vz * x - vx * z;
      const iz = qw * z + vx * y - vy * x;
      const iw = -vx * x - vy * y - vz * z;
      x = ix * qw + iw * -vx + iy * -vz - iz * -vy;
      y = iy * qw + iw * -vy + iz * -vx - ix * -vz;
      z = iz * qw + iw * -vz + ix * -vy - iy * -vx;
    }
    pts.push([cx + x, cy + y, cz + z]);
  }
  for (let f = 0; f < 6; f++) {
    const t = BOX_FACES[f];
    mass.quad(pts[t[0]], pts[t[1]], pts[t[2]], pts[t[3]], tint);
  }
  for (let e = 0; e < 12; e++) {
    const a = pts[BOX_EDGES[e][0]], b = pts[BOX_EDGES[e][1]];
    const isTop = e === 2 || e === 6 || e === 10 || e === 11;
    lines.seg(a[0], a[1], a[2], b[0], b[1], b[2], edge * (isTop ? 1 : 0.66), g);
  }
}

/* ---------------------------------------------------------------- materials */

const LINE_VS = /* glsl */ `
  attribute float aA;
  attribute float aG;
  varying float vA;
  varying float vG;
  varying vec3 vW;
  void main(){
    vec4 wp = modelMatrix * vec4(position, 1.0);
    vW = wp.xyz;
    vA = aA;
    vG = aG;
    gl_Position = projectionMatrix * viewMatrix * wp;
  }
`;

const LINE_FS = /* glsl */ `
  precision highp float;
  uniform vec3 uColor;
  uniform float uOpacity, uNear, uFar, uIn, uMode, uPhase, uFlow, uBoost, uTime;
  varying float vA;
  varying float vG;
  varying vec3 vW;
  ${SPECTRAL_GLSL}
  void main(){
    float d = distance(vW, cameraPosition);
    float fade = 1.0 - smoothstep(uNear, uFar, d);
    fade *= smoothstep(uIn, uIn + 2.6, d);
    if (fade < 0.002) discard;
    vec3 col = uColor;
    if (uMode > 0.5) {
      float g;
      if (uMode < 1.5) g = vW.z * 0.021 + uTime * uFlow + uPhase;
      else if (uMode < 2.5) g = vG + uTime * uFlow + uPhase;
      else g = vW.y * 0.10 + uTime * uFlow + uPhase;
      col = spRamp(g);
    }
    gl_FragColor = vec4(col, vA * uOpacity * uBoost * fade);
  }
`;

function makeLineMaterial(o) {
  const opts = o || {};
  return new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    depthTest: opts.depthTest === undefined ? true : !!opts.depthTest,
    blending: THREE.AdditiveBlending,
    uniforms: {
      uColor: { value: new THREE.Color(opts.color === undefined ? PAL.line : opts.color) },
      uOpacity: { value: opts.opacity === undefined ? 0.4 : opts.opacity },
      uNear: { value: opts.near === undefined ? 12 : opts.near },
      uFar: { value: opts.far === undefined ? 60 : opts.far },
      uIn: { value: opts.in === undefined ? 0 : opts.in },
      uMode: { value: opts.mode === undefined ? 0 : opts.mode },
      uPhase: { value: opts.phase === undefined ? 0 : opts.phase },
      uFlow: { value: opts.flow === undefined ? 0.012 : opts.flow },
      uBoost: { value: 1 },
      uTime: { value: 0 },
    },
    vertexShader: LINE_VS,
    fragmentShader: LINE_FS,
  });
}

const GLOW_VS = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vW;
  void main(){
    vUv = uv;
    vec4 wp = modelMatrix * vec4(position, 1.0);
    vW = wp.xyz;
    gl_Position = projectionMatrix * viewMatrix * wp;
  }
`;

const GLOW_FS = /* glsl */ `
  precision highp float;
  uniform vec3 uColor;
  uniform float uOpacity, uPower, uMode, uPhase, uFlow, uTime, uNear, uFar, uBoost, uCutY;
  varying vec2 vUv;
  varying vec3 vW;
  ${SPECTRAL_GLSL}
  void main(){
    float band = pow(max(0.0, 1.0 - abs(vUv.y - 0.5) * 2.0), uPower);
    float d = distance(vW, cameraPosition);
    float fade = 1.0 - smoothstep(uNear, uFar, d);
    if (fade * band < 0.002) discard;
    vec3 col = uColor;
    if (uMode > 0.5) {
      float g;
      if (uMode < 1.5) g = vW.z * 0.021 + uTime * uFlow + uPhase;
      else if (uMode < 2.5) g = vW.x * 0.020 + uTime * uFlow + uPhase;
      else g = vW.y * 0.10 + uTime * uFlow + uPhase;
      col = spRamp(g) * 0.94;
    }
    float cut = uCutY > 0.001 ? (1.0 - smoothstep(uCutY, uCutY + 1.4, vW.y)) : 1.0;
    gl_FragColor = vec4(col, band * uOpacity * uBoost * fade * cut);
  }
`;

function makeGlowMaterial(o) {
  const opts = o || {};
  return new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    depthTest: opts.depthTest === undefined ? true : !!opts.depthTest,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending,
    uniforms: {
      uColor: { value: new THREE.Color(opts.color === undefined ? PAL.seamB : opts.color) },
      uOpacity: { value: opts.opacity === undefined ? 0.14 : opts.opacity },
      uPower: { value: opts.power === undefined ? 2.6 : opts.power },
      uMode: { value: opts.mode === undefined ? 0 : opts.mode },
      uPhase: { value: opts.phase === undefined ? 0 : opts.phase },
      uFlow: { value: opts.flow === undefined ? 0.012 : opts.flow },
      uTime: { value: 0 },
      uNear: { value: opts.near === undefined ? 0 : opts.near },
      uFar: { value: opts.far === undefined ? 400 : opts.far },
      uCutY: { value: opts.cutY === undefined ? 0 : opts.cutY },
      uBoost: { value: 1 },
    },
    vertexShader: GLOW_VS,
    fragmentShader: GLOW_FS,
  });
}

/* matte mass: #171b22 at the floor → #0c0e13 above, plus a grazing lift */
const MASS_VS = /* glsl */ `
  attribute float aTint;
  varying vec3 vW;
  varying vec3 vN;
  varying float vT;
  void main(){
    vec4 wp = modelMatrix * vec4(position, 1.0);
    vW = wp.xyz;
    vN = normalize(mat3(modelMatrix) * normal);
    vT = aTint;
    gl_Position = projectionMatrix * viewMatrix * wp;
  }
`;
const MASS_FS = /* glsl */ `
  precision highp float;
  uniform vec3 uBase, uTop, uRim;
  uniform float uGradH;
  varying vec3 vW;
  varying vec3 vN;
  varying float vT;
  void main(){
    vec3 V = normalize(cameraPosition - vW);
    vec3 N = normalize(vN);
    float f = pow(1.0 - abs(dot(V, N)), 2.0);
    float g = smoothstep(0.0, uGradH, vW.y);
    vec3 col = mix(uBase, uTop, g) * vT + uRim * f * 0.40;
    gl_FragColor = vec4(col, 1.0);
  }
`;
function makeMassMaterial() {
  return new THREE.ShaderMaterial({
    uniforms: {
      uBase: { value: new THREE.Color(PAL.massBottom) },
      uTop: { value: new THREE.Color(PAL.massTop) },
      uRim: { value: new THREE.Color(PAL.rim) },
      uGradH: { value: 8.0 },
    },
    vertexShader: MASS_VS,
    fragmentShader: MASS_FS,
  });
}

/* the void behind everything: one enormous vertical gradient */
const BG_FS = /* glsl */ `
  precision highp float;
  uniform vec3 uDeep, uHorizon;
  uniform float uHorizonY;
  varying vec3 vW;
  void main(){
    float hz = exp(-abs(vW.y - uHorizonY) * 0.11);
    vec3 col = mix(uDeep, uHorizon, hz);
    col *= 0.86 + 0.14 * smoothstep(14.0, 0.0, vW.y);
    gl_FragColor = vec4(col, 1.0);
  }
`;
function makeBackdropMaterial() {
  return new THREE.ShaderMaterial({
    uniforms: {
      uDeep: { value: new THREE.Vector3(0.00055, 0.0007, 0.0011) },
      uHorizon: { value: new THREE.Vector3(0.0060, 0.0078, 0.0114) },
      uHorizonY: { value: 1.55 },
    },
    vertexShader: GLOW_VS,
    fragmentShader: BG_FS,
    depthWrite: true,
  });
}

/* sparse dust — static buffer, animated in the vertex shader */
const DUST_VS = /* glsl */ `
  uniform float uTime, uDpr;
  attribute float aSeed;
  varying float vA;
  void main(){
    vec3 p = position;
    float s = aSeed;
    p.x += sin(uTime * 0.07 + s * 39.0) * 0.26;
    p.y += sin(uTime * 0.05 + s * 71.0) * 0.30;
    p.z += cos(uTime * 0.06 + s * 13.0) * 0.22;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    float d = max(-mv.z, 0.5);
    gl_PointSize = clamp(3.4 / d, 0.7, 2.4) * uDpr;
    vA = smoothstep(1.6, 4.0, d) * (1.0 - smoothstep(18.0, 40.0, d));
    vA *= 0.35 + 0.65 * (0.5 + 0.5 * sin(uTime * 0.42 + s * 91.0));
    gl_Position = projectionMatrix * mv;
  }
`;
const DUST_FS = /* glsl */ `
  precision highp float;
  uniform vec3 uColor;
  uniform float uOpacity;
  varying float vA;
  void main(){
    vec2 q = abs(gl_PointCoord - 0.5);
    float m = 1.0 - smoothstep(0.30, 0.5, max(q.x, q.y));
    gl_FragColor = vec4(uColor, vA * m * uOpacity);
  }
`;
function makeDustMaterial() {
  return new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    depthTest: true,
    blending: THREE.AdditiveBlending,
    uniforms: {
      uColor: { value: new THREE.Color(PAL.dust) },
      uTime: { value: 0 },
      uDpr: { value: 1 },
      uOpacity: { value: 0.30 },
    },
    vertexShader: DUST_VS,
    fragmentShader: DUST_FS,
  });
}

/* ------------------------------------------------------------ glyph vectors */
/* Single-stroke geometric numerals: 0..1, y up, straight segments only.     */
const GLYPHS = {
  '0': [[[0.30, 0], [0.70, 0], [0.94, 0.26], [0.94, 0.74], [0.70, 1], [0.30, 1], [0.06, 0.74], [0.06, 0.26], [0.30, 0]]],
  '1': [[[0.24, 0.74], [0.55, 1], [0.55, 0]], [[0.22, 0], [0.88, 0]]],
  '2': [[[0.06, 0.76], [0.30, 1], [0.70, 1], [0.94, 0.76], [0.94, 0.64], [0.06, 0.02]], [[0.06, 0], [0.94, 0]]],
  '3': [[[0.08, 1], [0.82, 1], [0.96, 0.84], [0.56, 0.56], [0.96, 0.40], [0.96, 0.16], [0.78, 0], [0.06, 0]]],
  '4': [[[0.72, 0], [0.72, 1], [0.05, 0.28], [0.98, 0.28]]],
  '5': [[[0.92, 1], [0.16, 1], [0.13, 0.58], [0.62, 0.62], [0.92, 0.42], [0.92, 0.16], [0.74, 0], [0.06, 0]]],
  '6': [[[0.82, 1], [0.30, 1], [0.06, 0.70], [0.06, 0.18], [0.26, 0], [0.74, 0], [0.94, 0.18], [0.94, 0.40], [0.72, 0.56], [0.06, 0.58]]],
  '7': [[[0.05, 1], [0.95, 1], [0.95, 0.87], [0.38, 0]]],
  '8': [[[0.26, 1], [0.74, 1], [0.94, 0.84], [0.94, 0.66], [0.66, 0.52], [0.10, 0.36], [0.08, 0.16], [0.26, 0], [0.74, 0], [0.92, 0.16], [0.90, 0.36], [0.34, 0.52], [0.06, 0.66], [0.06, 0.84], [0.26, 1]]],
  '9': [[[0.18, 0], [0.68, 0], [0.94, 0.30], [0.94, 0.82], [0.74, 1], [0.26, 1], [0.06, 0.82], [0.06, 0.60], [0.26, 0.44], [0.94, 0.40]]],
};

function emitGlyph(sink, ch, map, weight, g) {
  const strokes = GLYPHS[ch];
  if (!strokes) return;
  for (let s = 0; s < strokes.length; s++) {
    const pts = strokes[s];
    for (let i = 1; i < pts.length; i++) {
      const a = map(pts[i - 1][0], pts[i - 1][1]);
      const b = map(pts[i][0], pts[i][1]);
      sink.seg(a[0], a[1], a[2], b[0], b[1], b[2], weight, g || 0);
    }
  }
}

/** Emits a two-digit string lying on the floor, centred at (cx,cz). */
function emitFloorNumeral(sink, text, frame, cx, cz, width, depth, weight) {
  const n = text.length;
  const gapFrac = 0.16;
  const digitFrac = (1 - gapFrac * (n - 1)) / n;
  const fx = frame.forward.x, fz = frame.forward.z;
  const rx = frame.right.x, rz = frame.right.z;
  for (let i = 0; i < n; i++) {
    const u0 = i * (digitFrac + gapFrac);
    const map = (u, v) => {
      const uu = u0 + u * digitFrac;
      const a = (uu - 0.5) * width;
      const b = (v - 0.5) * depth;
      return [cx + rx * a + fx * b, FLOOR_Y, cz + rz * a + fz * b];
    };
    emitGlyph(sink, text.charAt(i), map, weight, 0);
  }
}

/* ============================================================== build world */

export function buildScenes(args) {
  const ctx = args || {};
  const scene = ctx.scene;
  const renderer = ctx.renderer || null;
  const camera = ctx.camera || null;
  const quality = ctx.quality || {};
  const ambient = !!ctx.ambient;
  const mirror = ctx.mirror || null;

  const owned = { geo: [], mat: [] };
  const groups = [];
  const api = {
    update() {}, resize() {}, focus() {}, dispose() {},
    groups, mirror,
  };

  if (!scene) return api;

  const warned = Object.create(null);
  const warn = (where, e) => {
    if (warned[where]) return;
    warned[where] = 1;
    try { console.info('[space] scenes v3 — ' + where, e && e.message ? e.message : e); } catch (err) { /* noop */ }
  };

  const track = (obj) => {
    if (!obj) return obj;
    if (obj.geometry) owned.geo.push(obj.geometry);
    if (obj.material) owned.mat.push(obj.material);
    return obj;
  };
  const trackMat = (m) => { owned.mat.push(m); return m; };
  const trackGeo = (g) => { owned.geo.push(g); return g; };

  /* ----------------------------------------------------------- station list */
  const list = [];
  try {
    const raw = Array.isArray(ctx.stations) && ctx.stations.length ? ctx.stations : STATIONS;
    for (let i = 0; i < raw.length; i++) {
      const it = raw[i];
      if (!it) continue;
      if (it.def) {
        list.push({
          key: it.key || it.def.key,
          def: it.def,
          frame: it.frame || stationFrame(it.def),
          el: it.el || null,
        });
      } else if (it.pos) {
        list.push({ key: it.key, def: it, frame: stationFrame(it), el: it.el || null });
      }
    }
  } catch (e) { warn('stations', e); }

  /* -------------------------------------------------------------- mirror */
  try {
    if (mirror && mirror.uniforms) {
      const u = mirror.uniforms;
      if (u.uTint) u.uTint.value.setHex(0x0b0d12);
      if (u.uGrid) u.uGrid.value = HALL.rib;
      if (u.uIntensity) u.uIntensity.value = 1.0;
      if (u.uFade) u.uFade.value.set(38, 128);
    }
    neutralizeMirror(mirror);
  } catch (e) { warn('mirror', e); }

  /* ================================================================= root */
  const root = new THREE.Group();
  root.name = 'sp-scenes-v3';
  scene.add(root);
  groups.push(root);

  const timeMats = [];
  const registerMats = (mats) => {
    for (let i = 0; i < mats.length; i++) {
      if (mats[i] && mats[i].uniforms && mats[i].uniforms.uTime) timeMats.push(mats[i]);
    }
  };

  /* --------------------------------------------------------- backdrop void */
  try {
    const bgGeo = trackGeo(new THREE.PlaneGeometry(260, 96));
    const bgMat = trackMat(makeBackdropMaterial());
    const bg = new THREE.Mesh(bgGeo, bgMat);
    bg.position.set(0, 22, HALL.zB - 8);
    bg.name = 'void-backdrop';
    bg.frustumCulled = false;
    root.add(bg);
  } catch (e) { warn('backdrop', e); }

  /* ------------------------------------------------------------- materials */
  const ribMat = trackMat(makeLineMaterial({ opacity: 0.30, near: 14, far: 60, mode: 0 }));
  const wallMat = trackMat(makeLineMaterial({ opacity: 0.22, near: 15, far: 90, mode: 0 }));
  const floorMat = trackMat(makeLineMaterial({ opacity: 0.34, near: 7, far: 54, mode: 0 }));
  const seamMat = trackMat(makeLineMaterial({
    opacity: 0.90, near: 400, far: 800, mode: 1, flow: 0.020, phase: 0.55,
  }));
  const hingeMat = trackMat(makeLineMaterial({ opacity: 0.80, near: 10, far: 75, mode: 0 }));
  const numeralMat = trackMat(makeLineMaterial({ opacity: 0.55, near: 8, far: 46, in: 3.0, mode: 0 }));
  const paperCapMat = trackMat(makeLineMaterial({ opacity: 0.95, near: 10, far: 58, in: 4.0, mode: 2, phase: 0.02, flow: 0.0 }));
  const contactMat = trackMat(makeLineMaterial({ opacity: 0.58, near: 12, far: 80, in: 5.0, mode: 0 }));
  const horizonMat = trackMat(makeLineMaterial({ opacity: 0.85, near: 220, far: 440, mode: 1, phase: 0.0, flow: 0.006 }));
  registerMats([ribMat, wallMat, floorMat, seamMat, hingeMat, numeralMat, paperCapMat,
    contactMat, horizonMat]);

  const massMat = trackMat(makeMassMaterial());
  const mass = new MassSink();
  const arris = new LineSink();

  /* the light rail: the primary spectral line lives at the floor edge, below
     the text block, and the mirror doubles it.  No line through body copy.  */
  const seamGlowMat = trackMat(makeGlowMaterial({
    opacity: 0.20, power: 1.6, mode: 1, flow: 0.020, phase: 0.55, near: 6, far: 140,
  }));
  registerMats([seamGlowMat]);
  try {
    const glowGeo = trackGeo(makeSeamGlowGeometry(0.30, 0.46));
    const glow = new THREE.Mesh(glowGeo, seamGlowMat);
    glow.name = 'spectral-rail-glow';
    glow.frustumCulled = false;
    root.add(glow);
  } catch (e) { warn('rail-glow', e); }

  /* horizon wash: a very faint gradient band 0.5–1.2 m above the floor */
  const lowWashMat = trackMat(makeGlowMaterial({
    opacity: 0.10, power: 1.5, mode: 1, flow: 0.008, phase: 0.2, near: 6, far: 110,
  }));
  registerMats([lowWashMat]);
  try {
    const lowGeo = trackGeo(makeSeamGlowGeometry(0.86, 0.72));
    const low = new THREE.Mesh(lowGeo, lowWashMat);
    low.name = 'floor-horizon-wash';
    low.frustumCulled = false;
    root.add(low);
  } catch (e) { warn('low-wash', e); }

  /* vertical spectral strips (slits, jambs) — one batch, one draw call */
  const slitGeo = [];
  const slitMat = trackMat(makeGlowMaterial({
    opacity: 0.62, power: 0.02, mode: 3, flow: 0.014, near: 0, far: 200, cutY: 2.0,
  }));
  registerMats([slitMat]);

  /* --------------------------------------------------------------- the hall */
  try {
    buildHall(root, wallMat, ribMat, seamMat, floorMat);
  } catch (e) { warn('hall', e); }

  /* ---------------------------------------------------------- floor + dust */
  let dustMat = null;
  try {
    if (!mirror) {
      const g = trackGeo(new THREE.PlaneGeometry(64, 260));
      g.rotateX(-Math.PI / 2);
      const m = trackMat(new THREE.MeshBasicMaterial({ color: 0x06070c }));
      const floorMesh = new THREE.Mesh(g, m);
      floorMesh.position.set(0, 0, (HALL.zA + HALL.zB) * 0.5);
      floorMesh.renderOrder = -1;
      floorMesh.name = 'floor-fallback';
      root.add(floorMesh);
    }
  } catch (e) { warn('floor', e); }

  try {
    dustMat = trackMat(makeDustMaterial());
    const { geo, mat } = buildDust(dustMat, ambient || quality.mobile);
    trackGeo(geo);
    const dust = new THREE.Points(geo, mat);
    dust.name = 'dust';
    dust.frustumCulled = false;
    dust.renderOrder = 4;
    let pr0 = 1;
    try { pr0 = renderer && renderer.getPixelRatio ? renderer.getPixelRatio() : 1; } catch (err) { pr0 = 1; }
    dustMat.uniforms.uDpr.value = pr0;
    dustMat.userData = { dpr: pr0 };
    root.add(dust);
  } catch (e) { warn('dust', e); }

  /* ------------------------------------------------ left-side depth masses */
  try {
    buildMonoliths(mass, arris);
  } catch (e) { warn('monoliths', e); }

  /* --------------------------------------------------------- floor numerals */
  try {
    const numerals = new LineSink();
    for (let i = 0; i < list.length; i++) {
      const fr = list[i].frame;
      if (!fr || !fr.origin) continue;
      const num = String(i + 1).padStart(2, '0');
      /* a plate numeral laid along the travel axis: 4.6 m wide, 7.5 m deep,
         centred 12.5 m behind the content plane, so foreshortening reads it */
      const width = 4.6;
      const depth = 7.5;
      const cx = fr.origin.x + fr.forward.x * 12.5;
      const cz = fr.origin.z + fr.forward.z * 12.5;
      emitFloorNumeral(numerals, num, fr, cx, cz, width, depth, 1.0);
      const y = FLOOR_Y + 0.002;
      const rz = fr.forward.z;
      const nearZ = cz - rz * (depth * 0.5) - rz * 0.7;
      const farZ = cz + rz * (depth * 0.5) - rz * 0.7;
      numerals.seg(cx - 2.9, y, nearZ, cx + 2.9, y, nearZ, 0.26, 0);
      numerals.seg(cx - 2.9, y, farZ, cx + 2.9, y, farZ, 0.18, 0);
    }
    if (numerals.count()) {
      const obj = new THREE.LineSegments(numerals.geometry(), numeralMat);
      obj.name = 'floor-numerals';
      obj.frustumCulled = false;
      root.add(track(obj));
    }
  } catch (e) { warn('numerals', e); }

  /* ------------------------------------------------------------ signatures */
  const rings = [];
  const farGlowMats = [];    // the contact horizon only lives at the contact end
  const gates = [];          // station-local line objects fade out with distance
  let profileFrames = null;
  for (let i = 0; i < list.length; i++) {
    const st = list[i];
    try {
      if (st.key === 'entry') buildEntry(st);
      else if (st.key === 'profile') profileFrames = buildProfile(st);
      else if (st.key === 'research') buildResearch(st, rings);
      else if (st.key === 'papers') buildPapers(st);
      else if (st.key === 'notes') buildNotes(st);
      else if (st.key === 'tools') buildTools(st);
      else if (st.key === 'contact') buildContact(st);
    } catch (e) { warn('signature:' + st.key, e); }
  }
  registerMats(rings.map((r) => r.mat));

  /* --------------------------------------------------- mass + arris meshes */
  try {
    const massGeo = trackGeo(mass.geometry());
    const massMesh = new THREE.Mesh(massGeo, massMat);
    massMesh.name = 'architecture-masses';
    massMesh.frustumCulled = false;
    root.add(massMesh);

    const arrisGeo = trackGeo(arris.geometry());
    const arrisObj = new THREE.LineSegments(arrisGeo, hingeMat);
    arrisObj.name = 'architecture-arrises';
    arrisObj.frustumCulled = false;
    root.add(arrisObj);
  } catch (e) { warn('masses', e); }

  /* vertical spectral strip batch */
  try {
    if (slitGeo.length) {
      const pos = new Float32Array(slitGeo);
      const uv = new Float32Array((slitGeo.length / 12) * 8);
      for (let i = 0; i < slitGeo.length / 12; i++) {
        uv[i * 8 + 0] = 0; uv[i * 8 + 1] = 0;
        uv[i * 8 + 2] = 1; uv[i * 8 + 3] = 0;
        uv[i * 8 + 4] = 1; uv[i * 8 + 5] = 1;
        uv[i * 8 + 6] = 0; uv[i * 8 + 7] = 1;
      }
      const geo = trackGeo(new THREE.BufferGeometry());
      geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
      geo.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
      const idx = [];
      for (let i = 0; i < pos.length / 12; i++) {
        const b = i * 4;
        idx.push(b, b + 1, b + 2, b, b + 2, b + 3);
      }
      geo.setIndex(idx);
      geo.computeBoundingSphere();
      const mesh = new THREE.Mesh(geo, slitMat);
      mesh.name = 'spectral-slits';
      mesh.frustumCulled = false;
      root.add(mesh);
    }
  } catch (e) { warn('slits', e); }

  /* ------------------------------------------------------------- flags */
  let reduced = !!(quality && quality.reduced);
  try {
    if (typeof window !== 'undefined' && window.matchMedia) {
      reduced = reduced || window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
  } catch (e) { /* noop */ }

  let timeS = 0;
  let prevZ = null;
  const seamBase = seamMat.uniforms.uOpacity.value;
  const glowBase = seamGlowMat.uniforms.uOpacity.value;
  let focusIdx = -1;
  let paperTarget = 1;
  let paperBoost = 1;
  const ringCur = [1, 1, 1, 1];
  for (let i = 0; i < rings.length; i++) ringCur[i] = rings[i].mat.uniforms.uBoost.value;

  /* ---------------------------------------------------------------- update */
  function update(a, b, c, d) {
    try {
      let dt = 0.016;
      let cam = camera;
      let state = null;
      if (typeof a === 'number') {
        timeS = a;
        if (typeof b === 'number') dt = b;
        if (c && c.isCamera) cam = c; else if (c && c.position) cam = c;
        if (d && typeof d === 'object') state = d;
      } else if (a && typeof a === 'object') {
        dt = typeof b === 'number' ? b : 0.016;
        cam = (a.camera && a.camera.isCamera) ? a.camera : (a.camera || camera);
        state = a;
        if (typeof a.t === 'number') timeS = a.t;
      }
      if (!(dt > 0)) dt = 0.016;
      if (dt > 0.08) dt = 0.08;
      if (state && typeof state.reduced === 'boolean') reduced = state.reduced;
      if (!isFinite(timeS)) timeS = 0;
      const t = reduced ? 0 : timeS;

      const cz = cam && cam.position ? cam.position.z : 0;
      let vel = 0;
      if (prevZ !== null) vel = (cz - prevZ) / Math.max(dt, 0.001);
      prevZ = cz;
      if (state && typeof state.velocity === 'number') vel = state.velocity;
      const speed = Math.min(1, Math.abs(vel) * 0.0045);

      for (let i = 0; i < timeMats.length; i++) timeMats[i].uniforms.uTime.value = t;
      if (dustMat) {
        dustMat.uniforms.uTime.value = t;
        dustMat.uniforms.uDpr.value = dustMat.userData && dustMat.userData.dpr ? dustMat.userData.dpr : 1;
      }

      /* the seam answers speed — a live measurement, not decoration */
      seamMat.uniforms.uOpacity.value = seamBase * (1 + 0.35 * speed);
      seamGlowMat.uniforms.uOpacity.value = glowBase * (1 + 0.25 * speed);

      /* a station's instrument only lives around its own floor */
      for (let i = 0; i < gates.length; i++) {
        const gt = gates[i];
        const d = Math.abs(cz - gt.z);
        const k = 1 - smoothJ(24, 42, d);
        for (let j = 0; j < gt.mats.length; j++) {
          gt.mats[j].uniforms.uOpacity.value = gt.base[j] * k;
        }
      }

      /* research: four rings counter-rotate; focus lifts the matching ring */
      for (let i = 0; i < rings.length; i++) {
        const r = rings[i];
        const want = focusIdx < 0 ? 1 : (i === focusIdx ? 2.3 : 0.38);
        ringCur[i] = dampA(ringCur[i], want, 4.5, dt);
        r.mat.uniforms.uBoost.value = ringCur[i];
        r.group.rotation.y = r.baseY + t * r.spinY;
        r.group.rotation.z = r.baseZ + t * r.spinZ;
        r.group.rotation.x = r.baseX + Math.sin(t * 0.07 + i * 0.9) * 0.03;
      }

      /* profile: the nested frames turn at ~1°/s */
      if (profileFrames && !reduced) {
        profileFrames.rotation.y = profileFrames.userData.baseY + t * 0.017;
      }

      /* paper caps: a focused paper lifts the spine */
      paperBoost = dampA(paperBoost, paperTarget, 3.0, dt);
      paperCapMat.uniforms.uBoost.value = paperBoost;

      /* the far horizon only exists at the contact end — never a line across
         body copy at the other six stations */
      const horizonK = clamp((-cz - 96) / 30, 0, 1);
      horizonMat.uniforms.uBoost.value = 0.02 + 0.22 * horizonK;
      for (let i = 0; i < farGlowMats.length; i++) {
        farGlowMats[i].uniforms.uOpacity.value = 0.005 + 0.05 * horizonK;
      }
    } catch (e) { warn('update', e); }
  }

  /* ---------------------------------------------------------------- resize */
  function resize(w, h, pr) {
    try {
      if (dustMat) {
        dustMat.userData.dpr = pr || 1;
        dustMat.uniforms.uDpr.value = pr || 1;
      }
    } catch (e) { warn('resize', e); }
  }

  /* ----------------------------------------------------------------- focus */
  const FOCUS_ALIAS = {
    gaze: 0, eye: 0, eyes: 0, eyetracking: 0, 'eye-tracking': 0,
    bci: 1, ssvep: 1, brain: 1, eeg: 1,
    haptics: 2, haptic: 2, ultrasound: 2, umh: 2,
    method: 3, methods: 3, experiment: 3, design: 3,
  };
  function focus(key) {
    try {
      const k = key == null ? '' : String(key).toLowerCase();
      focusIdx = Object.prototype.hasOwnProperty.call(FOCUS_ALIAS, k) ? FOCUS_ALIAS[k] : -1;
      paperTarget = /^\d+$/.test(k) || /^p\d+$/.test(k) ? 1.9 : 1;
    } catch (e) { warn('focus', e); }
  }

  /* ---------------------------------------------------------------- dispose */
  function dispose() {
    try {
      if (scene && root.parent) scene.remove(root);
      for (let i = 0; i < owned.geo.length; i++) { try { owned.geo[i].dispose(); } catch (e) { /* noop */ } }
      for (let i = 0; i < owned.mat.length; i++) { try { owned.mat[i].dispose(); } catch (e) { /* noop */ } }
      owned.geo.length = 0;
      owned.mat.length = 0;
      groups.length = 0;
    } catch (e) { /* noop */ }
  }

  /* --------------------------------------------------------------- builders */

  function buildHall(group, wallMaterial, ribMaterial, seamMaterial, floorMaterial) {
    const ribs = new LineSink();
    const walls = new LineSink();
    const floor = new LineSink();
    const seam = new LineSink();

    /* ribs every 5.5 m: 1px floor-to-ceiling, brighter at floor and ceiling */
    for (let z = HALL.zA; z >= HALL.zB; z -= HALL.rib) {
      for (let s = -1; s <= 1; s += 2) {
        const x = HALL.half * s;
        const xi = (HALL.half - 1.15) * s;
        ribs.seg(x, 0.02, z, x, HALL.ceil, z, 0.62);
        ribs.seg(x, 0.02, z, x, 0.95, z, 1.0);
        ribs.seg(x, HALL.ceil - 1.15, z, x, HALL.ceil, z, 1.0);
        ribs.seg(x, HALL.ceil, z, xi, HALL.ceil, z, 0.55);
        ribs.seg(x, HALL.ceil - 1.15, z, xi, HALL.ceil - 1.15, z, 0.30);
      }
      /* the plan grid of the hall, drawn on the floor */
      floor.seg(-HALL.half, FLOOR_Y, z, HALL.half, FLOOR_Y, z, 0.32, 0);
    }
    for (let s = -1; s <= 1; s += 2) {
      for (let i = 1; i <= 2; i++) {
        const x = s * i * 2.8;
        floor.seg(x, FLOOR_Y, HALL.zA, x, FLOOR_Y, HALL.zB, i === 2 ? 0.55 : 0.26, 0);
      }
    }

    /* wall datum lines: base, architrave, top */
    for (let s = -1; s <= 1; s += 2) {
      const x = HALL.half * s;
      walls.seg(x, 0.018, HALL.zA, x, 0.018, HALL.zB, 0.74);
      walls.seg(x, 4.95, HALL.zA, x, 4.95, HALL.zB, 0.30);
      walls.seg(x, HALL.ceil - 0.004, HALL.zA, x, HALL.ceil - 0.004, HALL.zB, 0.26);
    }

    /* the one continuous spectral line: a light rail at the floor edge.
       At eye level it would cross every paragraph, so it rides the floor and
       the mirror reflection completes the horizon. */
    for (let s = -1; s <= 1; s += 2) {
      const x = s * HALL.railX;
      seam.seg(x, 0.085, HALL.zA, x, 0.085, HALL.zB, 1.0);
    }

    const ribObj = new THREE.LineSegments(ribs.geometry(), ribMaterial);
    ribObj.name = 'hall-ribs';
    ribObj.frustumCulled = false;
    group.add(track(ribObj));

    const wallObj = new THREE.LineSegments(walls.geometry(), wallMaterial);
    wallObj.name = 'hall-walls';
    wallObj.frustumCulled = false;
    group.add(track(wallObj));

    const floorObj = new THREE.LineSegments(floor.geometry(), floorMaterial);
    floorObj.name = 'floor-grid';
    floorObj.frustumCulled = false;
    floorObj.renderOrder = 1;
    group.add(track(floorObj));

    const seamObj = new THREE.LineSegments(seam.geometry(), seamMaterial);
    seamObj.name = 'spectral-rail';
    seamObj.frustumCulled = false;
    seamObj.renderOrder = 2;
    group.add(track(seamObj));
  }

  function makeSeamGlowGeometry(y, height) {
    const pos = [];
    const uv = [];
    const h = height * 0.5;
    for (let s = -1; s <= 1; s += 2) {
      const x = s * HALL.railX;
      const y0 = y - h, y1 = y + h;
      pos.push(x, y0, HALL.zA, x, y0, HALL.zB, x, y1, HALL.zB, x, y1, HALL.zA);
      uv.push(0, 0, 1, 0, 1, 1, 0, 1);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    geo.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
    geo.setIndex([0, 1, 2, 0, 2, 3, 4, 5, 6, 4, 6, 7]);
    geo.computeBoundingSphere();
    return geo;
  }

  function buildDust(mat, low) {
    const n = low ? 110 : 200;
    const pos = new Float32Array(n * 3);
    const seed = new Float32Array(n);
    let s = 0x9e3779b9;
    const rnd = () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
    for (let i = 0; i < n; i++) {
      pos[i * 3] = (rnd() * 2 - 1) * 7.2;
      pos[i * 3 + 1] = 0.25 + rnd() * 6.4;
      pos[i * 3 + 2] = HALL.zA + 2 - rnd() * (HALL.zA - HALL.zB + 6);
      seed[i] = rnd();
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    geo.setAttribute('aSeed', new THREE.Float32BufferAttribute(seed, 1));
    return { geo, mat };
  }

  /* left-side massing: large matte volumes with bright silhouettes */
  function buildMonoliths(massSink, lineSink) {
    const mono = [
      { x: -6.9, z: -9.0, w: 2.9, h: 12.0, d: 4.4, slit: true },
      { x: -7.2, z: -27.0, w: 3.2, h: 8.6, d: 5.2, slit: false },
      { x: -6.6, z: -45.0, w: 2.4, h: 13.5, d: 3.8, slit: true },
      { x: -7.3, z: -65.0, w: 3.0, h: 10.4, d: 4.6, slit: false },
      { x: -6.8, z: -87.0, w: 2.6, h: 12.8, d: 3.6, slit: false },
      { x: -7.1, z: -109.0, w: 3.1, h: 9.2, d: 5.0, slit: true },
      { x: -6.6, z: -129.0, w: 2.5, h: 13.2, d: 3.4, slit: false },
    ];
    for (let i = 0; i < mono.length; i++) {
      const m = mono[i];
      addSlab(massSink, lineSink, {
        x: m.x, y: m.h * 0.5, z: m.z, w: m.w, h: m.h, d: m.d,
        rot: [0, (i % 3 - 1) * 0.02, 0], edge: 1.05, tint: i % 2 ? 1.10 : 0.92,
      });
      if (m.slit) {
        const dir = m.x > 0 ? -1 : 1;
        const sx = m.x + dir * (m.w * 0.5 - 0.24);
        const sz = m.z + m.d * 0.5 + 0.012;
        const sw = 0.05;
        slitGeo.push(sx - sw, 0.10, sz, sx + sw, 0.10, sz, sx + sw, m.h * 0.92, sz, sx - sw, m.h * 0.92, sz);
      }
    }
  }

  /* ------------------------------------------------------------- signatures */

  /** F01 — one 24 m monolith to the right, split by a 2.2 m vertical slit. */
  function buildEntry(st) {
    const fr = st.frame;
    const O = fr.origin;
    const z = O.z + fr.forward.z * 9.0;          // contentZ − 9 m
    const slitW = 0.9;
    const totalW = 7.4;
    const H = 24.0;
    const D = 1.5;
    const cx = O.x + 6.2;
    const slitX = O.x + 7.5;
    const pierL = (slitX - slitW * 0.5) - (cx - totalW * 0.5);
    const pierR = (cx + totalW * 0.5) - (slitX + slitW * 0.5);

    /* two piers, one mass, an off-centre slot between them */
    addSlab(mass, arris, {
      x: (cx - totalW * 0.5) + pierL * 0.5, y: H * 0.5, z, w: pierL, h: H, d: D,
      rot: [0, 0, 0], edge: 1.15, tint: 1.02,
    });
    addSlab(mass, arris, {
      x: (slitX + slitW * 0.5) + pierR * 0.5, y: H * 0.5, z, w: pierR, h: H, d: D,
      rot: [0, 0, 0], edge: 1.15, tint: 0.98,
    });
    /* a lintel closes the monolith 18 m up: never seen, always implied */
    addSlab(mass, arris, {
      x: cx, y: 21.0, z, w: totalW, h: 6.0, d: D,
      rot: [0, 0, 0], edge: 0.85, tint: 0.9,
    });

    /* a thin line of light standing in the 2.2 m aperture: the seam crosses
       it at eye level, so the slot reads as cut through the mass */
    const sz = z - D * 0.5 - 0.25;
    const lightW = 0.03;
    slitGeo.push(
      slitX - lightW, 0.0, sz, slitX + lightW, 0.0, sz,
      slitX + lightW, 17.9, sz, slitX - lightW, 17.9, sz
    );
    /* crisp jamb lines on the front face */
    arris.seg(slitX - slitW * 0.5, 0.02, z + D * 0.5 + 0.006, slitX - slitW * 0.5, H - 6.0, z + D * 0.5 + 0.006, 1.2, 0);
    arris.seg(slitX + slitW * 0.5, 0.02, z + D * 0.5 + 0.006, slitX + slitW * 0.5, H - 6.0, z + D * 0.5 + 0.006, 1.2, 0);
  }

  /** F02 — a column of three nested rectangular frames, turning at ~1°/s. */
  function buildProfile(st) {
    const fr = st.frame;
    const O = fr.origin;
    const z = O.z + fr.forward.z * 9.6;
    const cx = O.x + 6.5;
    const g = new THREE.Group();
    g.name = 'profile-frames';
    g.position.set(cx, 0, z);
    g.userData.baseY = 0.42;
    g.rotation.y = 0.42;
    root.add(g);

    const sink = new LineSink();
    const frames = [
      { w: 3.0, h: 8.2 },
      { w: 4.6, h: 11.2 },
      { w: 6.2, h: 14.0 },
    ];
    for (let i = 0; i < frames.length; i++) {
      const f = frames[i];
      const hw = f.w * 0.5;
      sink.seg(-hw, 0.02, 0, hw, 0.02, 0, 0.85, 0);
      sink.seg(-hw, 0.02, 0, -hw, f.h, 0, 0.9, 0);
      sink.seg(hw, 0.02, 0, hw, f.h, 0, 0.9, 0);
      sink.seg(-hw, f.h, 0, hw, f.h, 0, 0.7, 0);
    }
    /* low cross rails so the column reads as built, not as a net */
    sink.seg(-3.1, 2.15, 0, 3.1, 2.15, 0, 0.55, 0);
    sink.seg(-3.1, 4.30, 0, 3.1, 4.30, 0, 0.35, 0);
    const geo = trackGeo(sink.geometry());
    const mat = trackMat(makeLineMaterial({ opacity: 0.7, near: 9, far: 58, in: 4.5, mode: 0 }));
    const obj = new THREE.LineSegments(geo, mat);
    obj.frustumCulled = false;
    obj.name = 'profile-frame-lines';
    g.add(obj);

    /* one frame's edge carries the gradient */
    const edge = new LineSink();
    edge.seg(-3.1, 0.02, 0.01, -3.1, 14.0, 0.01, 1.0, 0);
    const eGeo = trackGeo(edge.geometry());
    const eMat = trackMat(makeLineMaterial({
      opacity: 0.95, near: 9, far: 58, in: 4.5, mode: 3, phase: 0.02, flow: 0.012,
    }));
    const eObj = new THREE.LineSegments(eGeo, eMat);
    eObj.frustumCulled = false;
    g.add(eObj);
    registerMats([mat, eMat]);
    gates.push({ z, mats: [mat, eMat], base: [0.7, 0.95] });
    return g;
  }

  /** F03 — four thin concentric orbit rings, vertical plane at the right.
   *  Coplanar by design: no crossing chords inside the content band.       */
  function buildResearch(st, out) {
    const fr = st.frame;
    const O = fr.origin;
    const cz = O.z + fr.forward.z * 9.6;
    const cx = O.x + 8.0;
    const cy = 3.4;
    const g = new THREE.Group();
    g.name = 'research-orbit-rings';
    g.position.set(cx, cy, cz);
    root.add(g);

    const ringMats = [];
    const specs = [
      { r: 3.5, base: 0.00, spin: 0.020, phase: 0.00 },
      { r: 5.0, base: 0.70, spin: -0.016, phase: 0.18 },
      { r: 6.5, base: 1.40, spin: 0.012, phase: 0.36 },
      { r: 8.0, base: 2.10, spin: -0.009, phase: 0.54 },
    ];
    for (let i = 0; i < specs.length; i++) {
      const sp = specs[i];
      const mat = trackMat(makeLineMaterial({
        opacity: 0.95, near: 10, far: 64, in: 4.5, mode: 2, phase: sp.phase, flow: 0.006,
      }));
      ringMats.push(mat);
      const obj = new THREE.LineSegments(buildRingGeometry(sp.r, 140, sp.phase), mat);
      obj.frustumCulled = false;
      obj.name = 'orbit-' + RING_KEYS[i];
      obj.rotation.z = sp.base;
      g.add(obj);
      out.push({
        group: obj, mat,
        baseX: 0, baseY: 0, baseZ: sp.base,
        spinY: 0, spinZ: sp.spin,
      });
    }
    /* a sight at the instrument's centre, 1px */
    const mark = new LineSink();
    mark.seg(-0.6, 0, 0, 0.6, 0, 0, 0.9, 0);
    mark.seg(0, -0.6, 0, 0, 0.6, 0, 0.9, 0);
    const mkMat = trackMat(makeLineMaterial({
      opacity: 0.7, near: 10, far: 64, in: 4.5, mode: 0,
    }));
    const mk = new THREE.LineSegments(trackGeo(mark.geometry()), mkMat);
    mk.frustumCulled = false;
    g.add(mk);
    gates.push({ z: cz, mats: ringMats, base: ringMats.map(() => 0.95) });
    gates.push({ z: cz, mats: [mkMat], base: [0.7] });
  }

  /** the left arc of a ring fades out, so the instrument never becomes a cage */
  function ringAlpha(x, r) {
    const t = clamp((x + r) / (r * 0.86), 0, 1);
    return 0.05 + 0.95 * t * t * (3 - 2 * t);
  }

  function buildRingGeometry(r, n, gPhase) {
    const sink = new LineSink();
    for (let i = 1; i <= n; i++) {
      if (i % 11 === 0) continue;
      const a0 = ((i - 1) / n) * Math.PI * 2;
      const a1 = (i / n) * Math.PI * 2;
      const x0 = Math.cos(a0) * r, y0 = Math.sin(a0) * r;
      const x1 = Math.cos(a1) * r, y1 = Math.sin(a1) * r;
      sink.seg2(x0, y0, 0, x1, y1, 0, ringAlpha(x0, r), ringAlpha(x1, r), gPhase + i / n);
    }
    /* four long index marks */
    for (let i = 0; i < 4; i++) {
      const a = (i / 4) * Math.PI * 2;
      const x0 = Math.cos(a) * r, y0 = Math.sin(a) * r;
      const x1 = Math.cos(a) * (r + 0.55), y1 = Math.sin(a) * (r + 0.55);
      sink.seg2(x0, y0, 0, x1, y1, 0, ringAlpha(x0, r), ringAlpha(x1, r), gPhase + i / 4);
    }
    return sink.geometry();
  }

  /** F04 — seven extruded bars along the floor, height = citations. */
  function buildPapers(st) {
    const fr = st.frame;
    const O = fr.origin;
    const z = O.z + fr.forward.z * 12.0;
    const cx = O.x + fr.forward.x * 12.0;
    const cites = readCitations(st.el);
    const vals = cites.length >= 3 ? cites.slice(0, 7) : [1, 1, 2, 3, 3, 4, 6];
    vals.sort((a, b) => a - b);
    const maxV = Math.max(1, vals[vals.length - 1]);
    const n = vals.length;
    const gap = 1.4;
    const caps = new LineSink();

    for (let i = 0; i < n; i++) {
      const frac = Math.sqrt(vals[i] / maxV);
      const h = 0.6 + frac * 4.6;
      const x = cx + (i - (n - 1) * 0.5) * gap;
      addSlab(mass, arris, {
        x, y: h * 0.5, z, w: 0.9, h, d: 1.0,
        rot: [0, 0, 0], edge: 0.95, tint: 1.04,
      });
      /* the top edge is the datum: white, chromatic on the tallest bar */
      caps.seg(x - 0.45, h + 0.004, z + 0.505, x + 0.45, h + 0.004, z + 0.505,
        1.0, i === n - 1 ? 0.62 : 0);
    }
    const capObj = new THREE.LineSegments(trackGeo(caps.geometry()), paperCapMat);
    capObj.name = 'papers-citation-spine';
    capObj.frustumCulled = false;
    root.add(capObj);
  }

  function readCitations(el) {
    const out = [];
    if (!el || !el.querySelectorAll) return out;
    try {
      const rows = el.querySelectorAll('[data-cite]');
      if (rows && rows.length) {
        for (let i = 0; i < rows.length && out.length < 7; i++) {
          const v = parseInt(rows[i].getAttribute('data-cite'), 10);
          if (isFinite(v) && v >= 0) out.push(v);
        }
        if (out.length) return out;
      }
    } catch (e) { /* noop */ }
    try {
      const lis = el.querySelectorAll('li');
      for (let i = 0; i < lis.length && out.length < 7; i++) {
        const t = lis[i].textContent || '';
        const m = t.match(/(\d+)\s*(?:次引用|citations?)/i);
        if (m) out.push(Math.max(0, parseInt(m[1], 10)));
      }
    } catch (e) { /* noop */ }
    return out;
  }

  /** F05 — five thin slabs leaning against each other at the right. */
  function buildNotes(st) {
    const fr = st.frame;
    const O = fr.origin;
    const cz = O.z + fr.forward.z * 9.6;
    const cx = O.x + 6.0;
    for (let i = 0; i < 5; i++) {
      addSlab(mass, arris, {
        x: cx + i * 0.02, y: 1.85, z: cz + (i - 2) * 0.42,
        w: 2.6, h: 3.6, d: 0.12,
        rot: [0.02 * i, 0.16 * (i - 2), -0.13 - i * 0.015],
        edge: 0.95, tint: i % 2 ? 1.08 : 0.94,
      });
    }
  }

  /** F06 — eight vertical monoliths, one per tool, deep behind the grid. */
  function buildTools(st) {
    const fr = st.frame;
    const O = fr.origin;
    const z = O.z + fr.forward.z * 14.0;
    for (let i = 0; i < 8; i++) {
      const x = O.x + (i - 3.5) * 2.0;
      addSlab(mass, arris, {
        x, y: 4.5, z, w: 1.05, h: 9.0, d: 1.2,
        rot: [0, 0, 0], edge: 0.75, tint: i % 2 ? 1.06 : 0.94,
      });
      arris.seg(x - 0.525, 8.94, z + 0.605, x + 0.525, 8.94, z + 0.605, 0.7, 0.04 + i * 0.075);
    }
  }

  /** F07 — one open rectangular frame standing alone in the void. */
  function buildContact(st) {
    const fr = st.frame;
    const O = fr.origin;
    const z = O.z + fr.forward.z * 10.0;
    const W = 12, H = 6, bar = 0.34;
    addSlab(mass, arris, { x: O.x, y: H, z, w: W, h: bar, d: 0.7, rot: [0, 0, 0], edge: 1.0, tint: 0.96 });
    addSlab(mass, arris, { x: O.x, y: 0.17, z, w: W, h: bar, d: 0.7, rot: [0, 0, 0], edge: 0.9, tint: 0.9 });
    for (let s = -1; s <= 1; s += 2) {
      addSlab(mass, arris, { x: O.x + s * (W * 0.5 - bar * 0.5), y: H * 0.5, z, w: bar, h: H, d: 0.7, rot: [0, 0, 0], edge: 1.0, tint: 0.98 });
    }
    /* gradient hairline top edge */
    const edge = new LineSink();
    edge.seg(O.x - W * 0.5, H + bar * 0.5 + 0.006, z + 0.356,
      O.x + W * 0.5, H + bar * 0.5 + 0.006, z + 0.356, 1.0, 0);
    const edgeObj = new THREE.LineSegments(trackGeo(edge.geometry()), trackMat(makeLineMaterial({
      opacity: 1.0, near: 12, far: 80, in: 5.5, mode: 2, phase: 0.0, flow: 0.01,
    })));
    edgeObj.frustumCulled = false;
    edgeObj.name = 'contact-frame-gradient';
    root.add(edgeObj);

    /* the horizon: a hard white datum with a low spectral wash behind it */
    const hzZ = HALL.zB - 3.4;
    const hzGeo = trackGeo(new THREE.PlaneGeometry(220, 0.55, 1, 1));
    const hzGlowMat = trackMat(makeGlowMaterial({
      opacity: 0.13, power: 1.5, mode: 2, flow: 0.004, near: 0, far: 500,
    }));
    farGlowMats.push(hzGlowMat);
    const hzMesh = new THREE.Mesh(hzGeo, hzGlowMat);
    hzMesh.position.set(0, 1.18, hzZ);
    hzMesh.name = 'contact-horizon';
    hzMesh.frustumCulled = false;
    root.add(hzMesh);

    const hzLine = new LineSink();
    hzLine.seg(-110, 1.18, hzZ + 0.06, 110, 1.18, hzZ + 0.06, 0.40, 0);
    hzLine.seg(-110, 1.30, hzZ + 0.06, 110, 1.30, hzZ + 0.06, 0.22, 0);
    hzLine.seg(-110, 1.06, hzZ + 0.06, 110, 1.06, hzZ + 0.06, 0.22, 0);
    const hzObj = new THREE.LineSegments(trackGeo(hzLine.geometry()), horizonMat);
    hzObj.name = 'contact-horizon-line';
    hzObj.frustumCulled = false;
    root.add(hzObj);

    /* the floor's leading edge, so the void has a ground line */
    const edge2 = new LineSink();
    edge2.seg(O.x - 10.5, FLOOR_Y, z + 0.35, O.x + 10.5, FLOOR_Y, z + 0.35, 0.42, 0);
    const edge2Obj = new THREE.LineSegments(trackGeo(edge2.geometry()), contactMat);
    edge2Obj.frustumCulled = false;
    root.add(edge2Obj);
  }

  /* the public API is wired only once the world has been built */
  api.update = update;
  api.resize = resize;
  api.focus = focus;
  api.dispose = dispose;
  api.groups = groups;
  api.mirror = mirror;
  api.root = root;
  /* QA hook: lets .tooling probes inspect / toggle the architecture */
  try { if (typeof window !== 'undefined') window.__spScenes = api; } catch (e) { /* noop */ }
  return api;
}

/* ---------------------------------------------------------- mirror tuning */
/* The v3 palette is neutral; the legacy mirror shader carries a cold-blue
   sheen and a blue plan grid.  Guarded: if engine.js has moved on, no-op.   */
function neutralizeMirror(mirror) {
  const mat = mirror && mirror.mesh && mirror.mesh.material;
  if (!mat || typeof mat.fragmentShader !== 'string') return;
  let f = mat.fragmentShader;
  const before = f;
  f = f.replace('vec3(0.30, 0.55, 0.75) * sheen * 0.5', 'vec3(0.60, 0.61, 0.63) * sheen * 0.10');
  f = f.replace('vec3(0.55, 0.82, 1.0) * grid', 'vec3(0.78, 0.79, 0.81) * grid');
  f = f.replace('vec3(0.010, 0.017, 0.024), col, fade', 'vec3(0.0042, 0.0050, 0.0068), col, fade');
  if (f !== before) {
    mat.fragmentShader = f;
    mat.needsUpdate = true;
  }
}

export default buildScenes;
