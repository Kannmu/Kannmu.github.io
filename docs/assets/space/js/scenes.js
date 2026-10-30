/* =============================================================================
   SPATIAL SCENES · v3 “SPECTRAL VECTOR”
   -----------------------------------------------------------------------------
   A black dimensionless hall, drawn rather than lit.

     · matte-black extruded masses, near-black mirror floor, 1px white arrises
     · one spectral seam at eye level (violet → cyan → lime) that runs the
       corridor and flows with time — the only chromatic light in the world
     · long structural ribs every 5.5 m, chamfered at 45° like a drawing
     · giant floor numerals from hand-built line-segment glyphs (no font)
     · 10 monoliths as depth landmarks, plus one signature object per station
     · sparse dust motes; slow, damped, continuous motion

   HARD RULE: nothing bright between the eye and a content panel.  Every
   signature sits behind the station's content plane (≥ 3.2 m) and every
   signature material fades out before the camera can reach it, so the flight
   never clips through a drawing.

   API (fixed):
     buildScenes({ THREE, scene, renderer, camera, quality, ambient, mirror,
                   stations })
       -> { update(time, dt, camera, state), resize(w, h, pr), focus(key),
            dispose(), groups, mirror }

   update() allocates nothing.  All GLSL is texture-free.  Draw calls: ~35 in
   the main pass (mirror pass doubles them) — well inside the 220/90 budget.

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
  seamY: 1.55,        // the spectral seam sits at eye level
  seamGlowH: 0.9,     // height of the soft seam wash
};

const FLOOR_Y = 0.012;
const RING_KEYS = ['gaze', 'bci', 'haptics', 'method'];

/* palette — sRGB hexes, converted to linear by THREE.Color */
const PAL = {
  line: 0xe8e4dc,     // warm white; the post chain grades it back to neutral
  seamA: 0x7c5cff,
  seamB: 0x24d6ea,
  seamC: 0xc6ff4a,
  mass: 0x06070b,
  rim: 0x141924,
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
const dampA = (cur, target, lambda, dt) => target + (cur - target) * Math.exp(-lambda * dt);

/* --------------------------------------------------------------- line sink */
/* Collects 1px segments with a per-vertex alpha weight (aA) and a per-vertex
   gradient coordinate (aG).  Built once; never touched again.               */
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
LineSink.prototype.count = function () { return this.pos.length / 6; };
LineSink.prototype.geometry = function () {
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(this.pos, 3));
  geo.setAttribute('aA', new THREE.Float32BufferAttribute(this.alpha, 1));
  geo.setAttribute('aG', new THREE.Float32BufferAttribute(this.grad, 1));
  return geo;
};

/* --------------------------------------------------------------- mass sink */
/* Accumulates every matte-black face of the whole world into one mesh.       */
function MassSink() {
  this.pos = [];
  this.nrm = [];
  this.tint = [];
  this._a = new THREE.Vector3();
  this._b = new THREE.Vector3();
  this._c = new THREE.Vector3();
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

/* box faces indexed by corner id:
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

/* scratch for slab building (build-time only) */
const _corner = [];

/**
 * Adds a rotated box: 6 near-black faces into `mass`, 12 hairline arrises into
 * `lines`.  `rot` is [x,y,z] in radians.  `topCap` optionally paints the top
 * face's four edges with the gradient weight `g`.
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
  const sx = [hw, -hw], sy = [hh, -hh], sz = [hd, -hd];
  /* corner order must match BOX_FACES: build explicitly */
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
    /* top edges (index 2, 6, 10, 11) read as the lit cap of the extrusion */
    const isTop = e === 2 || e === 6 || e === 10 || e === 11;
    lines.seg(a[0], a[1], a[2], b[0], b[1], b[2], edge * (isTop ? 1 : 0.62), g);
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
      if (uMode < 1.5) g = vW.z * 0.030 + uTime * uFlow + uPhase;
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
    depthTest: true,
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
  uniform float uOpacity, uPower, uMode, uPhase, uFlow, uTime, uNear, uFar, uBoost;
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
      if (uMode < 1.5) g = vW.z * 0.030 + uTime * uFlow + uPhase;
      else if (uMode < 2.5) g = vW.x * 0.020 + uTime * uFlow + uPhase;
      else g = vW.y * 0.10 + uTime * uFlow + uPhase;
      col = spRamp(g) * 0.92;
    }
    gl_FragColor = vec4(col, band * uOpacity * uBoost * fade);
  }
`;

function makeGlowMaterial(o) {
  const opts = o || {};
  return new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    depthTest: true,
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
      uBoost: { value: 1 },
    },
    vertexShader: GLOW_VS,
    fragmentShader: GLOW_FS,
  });
}

/* matte mass: near-black with a faint fresnel lift so extrusions read */
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
  uniform vec3 uBase, uRim;
  varying vec3 vW;
  varying vec3 vN;
  varying float vT;
  void main(){
    vec3 V = normalize(cameraPosition - vW);
    float f = pow(1.0 - abs(dot(V, normalize(vN))), 2.4);
    float vert = 0.62 + 0.38 * smoothstep(0.0, 6.5, vW.y);
    vec3 col = uBase * vT * vert + uRim * f * 0.55;
    gl_FragColor = vec4(col, 1.0);
  }
`;
function makeMassMaterial() {
  return new THREE.ShaderMaterial({
    uniforms: {
      uBase: { value: new THREE.Color(PAL.mass) },
      uRim: { value: new THREE.Color(PAL.rim) },
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
    /* a barely-there vertical fall-off so the top of the frame is the blackest */
    col *= 0.86 + 0.14 * smoothstep(14.0, 0.0, vW.y);
    gl_FragColor = vec4(col, 1.0);
  }
`;
function makeBackdropMaterial() {
  return new THREE.ShaderMaterial({
    uniforms: {
      uDeep: { value: new THREE.Vector3(0.00055, 0.0007, 0.0011) },
      uHorizon: { value: new THREE.Vector3(0.0062, 0.0080, 0.0118) },
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

/* ------------------------------------------------------------ glyph vectors */
/* Single-stroke geometric numerals.  Coordinates are 0..1, y up.  Every digit
   is an outline drawing, no font file, no curves.                            */
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

/** Emits a digit through `map(u,v) -> [x,y,z]`. */
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
    update() {},
    resize() {},
    focus() {},
    dispose() {},
    groups,
    mirror,
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
  } catch (e) {
    warn('stations', e);
  }

  /* -------------------------------------------------------------- mirror */
  try {
    if (mirror && mirror.uniforms) {
      const u = mirror.uniforms;
      if (u.uTint) u.uTint.value.setHex(0x0b0d12);
      if (u.uGrid) u.uGrid.value = HALL.rib;
      if (u.uIntensity) u.uIntensity.value = 0.55;
      if (u.uFade) u.uFade.value.set(30, 110);
    }
    neutralizeMirror(mirror);
  } catch (e) {
    warn('mirror', e);
  }

  /* ================================================================= root */
  const root = new THREE.Group();
  root.name = 'sp-scenes-v3';
  scene.add(root);
  groups.push(root);

  const timeMats = [];      // materials with a uTime uniform
  const registerMats = (mats) => {
    for (let i = 0; i < mats.length; i++) if (mats[i] && mats[i].uniforms && mats[i].uniforms.uTime) timeMats.push(mats[i]);
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
  const ribMat = trackMat(makeLineMaterial({ opacity: 0.30, near: 15, far: 62, mode: 0 }));
  const wallMat = trackMat(makeLineMaterial({ opacity: 0.20, near: 15, far: 90, mode: 0 }));
  const seamMat = trackMat(makeLineMaterial({
    opacity: 0.92, near: 150, far: 400, mode: 1, flow: 0.014, phase: 0.12,
  }));
  const hingeMat = trackMat(makeLineMaterial({ opacity: 0.55, near: 10, far: 70, mode: 0 }));
  const datumMat = trackMat(makeLineMaterial({ opacity: 0.34, near: 9, far: 46, in: 4.0, mode: 0 }));
  const numeralMat = trackMat(makeLineMaterial({ opacity: 0.46, near: 8, far: 44, in: 3.0, mode: 0 }));
  const paperCapMat = trackMat(makeLineMaterial({ opacity: 0.75, near: 10, far: 50, in: 4.0, mode: 2, phase: 0.02, flow: 0.0 }));
  const noteMat = trackMat(makeLineMaterial({ opacity: 0.46, near: 10, far: 48, in: 4.0, mode: 0 }));
  const profileMat = trackMat(makeLineMaterial({ opacity: 0.50, near: 9, far: 48, in: 4.0, mode: 0 }));
  const entry01Mat = trackMat(makeLineMaterial({ opacity: 0.20, near: 10, far: 70, in: 4.0, mode: 0 }));
  const contactMat = trackMat(makeLineMaterial({ opacity: 0.46, near: 12, far: 80, in: 5.0, mode: 0 }));
  const horizonMat = trackMat(makeLineMaterial({ opacity: 0.85, near: 200, far: 420, mode: 1, phase: 0.0, flow: 0.006 }));
  registerMats([ribMat, wallMat, seamMat, hingeMat, datumMat, numeralMat, paperCapMat,
    noteMat, profileMat, entry01Mat, contactMat, horizonMat]);

  const massMat = trackMat(makeMassMaterial());
  const mass = new MassSink();
  const arris = new LineSink();

  /* soft spectral wash on the walls, one merged geometry for both sides */
  const seamGlowMat = trackMat(makeGlowMaterial({
    opacity: 0.15, power: 2.4, mode: 1, flow: 0.014, phase: 0.12, near: 20, far: 190,
  }));
  registerMats([seamGlowMat]);
  try {
    const glowGeo = trackGeo(makeSeamGlowGeometry());
    const glow = new THREE.Mesh(glowGeo, seamGlowMat);
    glow.name = 'spectral-seam-glow';
    glow.frustumCulled = false;
    glow.renderOrder = 2;
    root.add(glow);
  } catch (e) { warn('seam-glow', e); }

  /* --------------------------------------------------------------- the hall */
  try {
    buildHall(root, wallMat, ribMat, seamMat);
  } catch (e) { warn('hall', e); }

  /* ---------------------------------------------------------- floor + dust */
  let dustMat = null;
  let floorGroup = null;
  try {
    if (!mirror) {
      /* ambient / no-mirror fallback: a dark, matte, neutral floor */
      const g = trackGeo(new THREE.PlaneGeometry(64, 260));
      g.rotateX(-Math.PI / 2);
      const m = trackMat(new THREE.MeshBasicMaterial({ color: 0x06070c }));
      const floor = new THREE.Mesh(g, m);
      floor.position.set(0, 0, (HALL.zA + HALL.zB) * 0.5);
      floor.renderOrder = -1;
      floor.name = 'floor-fallback';
      root.add(floor);
      floorGroup = floor;
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

  /* ------------------------------------------------------------ monoliths */
  try {
    buildMonoliths(mass, arris, root);
  } catch (e) { warn('monoliths', e); }

  /* --------------------------------------------------------- floor numerals */
  try {
    const numerals = new LineSink();
    for (let i = 0; i < list.length; i++) {
      const st = list[i];
      const fr = st.frame;
      if (!fr || !fr.origin) continue;
      const num = String(i + 1).padStart(2, '0');
      const depth = 5.0;
      const cx = fr.origin.x + fr.forward.x * 5.4;
      const cz = fr.origin.z + fr.forward.z * 5.4;
      emitFloorNumeral(numerals, num, fr, cx, cz, 7.2, depth, 0.9);
      /* baseline rule under the numeral: a drawing plate, not decoration */
      const y = FLOOR_Y + 0.002;
      const nearZ = cz - fr.forward.z * (depth * 0.5);
      numerals.seg(cx - 3.7, y, nearZ, cx + 3.7, y, nearZ, 0.32, 0);
    }
    if (numerals.count()) {
      const obj = new THREE.LineSegments(numerals.geometry(), numeralMat);
      obj.name = 'floor-numerals';
      obj.frustumCulled = false;
      track(obj);
      root.add(obj);
    }
  } catch (e) { warn('numerals', e); }

  /* ------------------------------------------------------- station datum */
  try {
    const datum = new LineSink();
    for (let i = 0; i < list.length; i++) {
      const fr = list[i].frame;
      if (!fr || !fr.origin) continue;
      const z = fr.origin.z + fr.forward.z * 3.7;
      const x0 = fr.origin.x + 4.68;
      const x1 = fr.origin.x - 4.68;
      addDatumPost(datum, x0, z, 0.9);
      addDatumPost(datum, x1, z, 0.9);
    }
    if (datum.count()) {
      const obj = new THREE.LineSegments(datum.geometry(), datumMat);
      obj.name = 'station-datum';
      obj.frustumCulled = false;
      track(obj);
      root.add(obj);
    }
  } catch (e) { warn('datum', e); }

  /* ------------------------------------------------------------ signatures */
  const rings = [];
  for (let i = 0; i < list.length; i++) {
    const st = list[i];
    try {
      if (st.key === 'entry') buildEntry(st, mass, arris, scene, root, entry01Mat);
      else if (st.key === 'profile') buildProfile(st, arris, scene, root, profileMat);
      else if (st.key === 'research') buildResearch(st, scene, root, rings);
      else if (st.key === 'papers') buildPapers(st, mass, arris, scene, root, paperCapMat);
      else if (st.key === 'notes') buildNotes(st, mass, arris, scene, root, noteMat);
      else if (st.key === 'tools') buildTools(st, mass, arris, scene, root);
      else if (st.key === 'contact') buildContact(st, mass, arris, scene, root, contactMat, horizonMat);
    } catch (e) { warn('signature:' + st.key, e); }
  }
  registerMats(rings.map((r) => r.mat));

  /* the two monolith surfaces (all masses / all arrises) */
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

  /* ------------------------------------------------------------- flags */
  let reduced = !!(quality && quality.reduced);
  try {
    if (typeof window !== 'undefined' && window.matchMedia) {
      reduced = reduced || window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
  } catch (e) { /* noop */ }

  let timeS = 0;
  let prevZ = null;
  let seamBase = seamMat.uniforms.uOpacity.value;
  let glBase = seamGlowMat.uniforms.uOpacity.value;
  let focusIdx = -1;
  let paperTarget = 1;
  let paperBoost = 1;
  const ringCur = [1, 1, 1, 1];

  try {
    for (let i = 0; i < rings.length; i++) {
      ringCur[i] = rings[i].mat.uniforms.uBoost.value;
    }
  } catch (e) { /* noop */ }

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

      /* camera velocity (fallback when app.js does not pass state) */
      const cz = cam && cam.position ? cam.position.z : 0;
      let vel = 0;
      if (prevZ !== null) vel = (cz - prevZ) / Math.max(dt, 0.001);
      prevZ = cz;
      if (state && typeof state.velocity === 'number') vel = state.velocity;
      const speed = Math.min(1, Math.abs(vel) * 0.0045);

      /* time uniforms */
      for (let i = 0; i < timeMats.length; i++) timeMats[i].uniforms.uTime.value = timeS;
      if (dustMat) {
        dustMat.uniforms.uTime.value = timeS;
        dustMat.uniforms.uDpr.value = dustMat.userData && dustMat.userData.dpr ? dustMat.userData.dpr : 1;
      }

      /* the seam answers speed — a live measurement, not decoration */
      seamMat.uniforms.uOpacity.value = seamBase * (1 + 0.35 * speed);
      seamGlowMat.uniforms.uOpacity.value = glBase * (1 + 0.25 * speed);

      /* ring focus damping + counter-rotation */
      for (let i = 0; i < rings.length; i++) {
        const r = rings[i];
        const want = focusIdx < 0 ? 1 : (i === focusIdx ? 2.15 : 0.42);
        ringCur[i] = dampA(ringCur[i], want, 4.5, dt);
        r.mat.uniforms.uBoost.value = ringCur[i];
        if (!reduced) {
          r.group.rotation.y = r.baseY + timeS * r.spinY;
          r.group.rotation.z = r.baseZ + Math.sin(timeS * 0.09 + i * 1.7) * 0.055;
          r.group.rotation.x = r.baseX + Math.sin(timeS * 0.07 + i * 0.9) * 0.035;
        } else {
          r.group.rotation.set(r.baseX, r.baseY, r.baseZ);
        }
      }

      /* paper caps settle dim unless focused */
      paperBoost = dampA(paperBoost, paperTarget, 3.0, dt);
      paperCapMat.uniforms.uBoost.value = paperBoost;

      /* the far horizon wash is strongest at the contact end */
      const horizonK = clamp((-cz - 96) / 34, 0, 1);
      horizonMat.uniforms.uBoost.value = 0.35 + 0.65 * horizonK;
    } catch (e) {
      warn('update', e);
    }
  }

  /* ---------------------------------------------------------------- resize */
  function resize(w, h, pr) {
    try {
      if (dustMat) dustMat.userData.dpr = pr || 1;
      if (dustMat && dustMat.uniforms.uDpr) dustMat.uniforms.uDpr.value = pr || 1;
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
      const idx = Object.prototype.hasOwnProperty.call(FOCUS_ALIAS, k) ? FOCUS_ALIAS[k] : -1;
      focusIdx = idx;
      /* paper focus: a numeric / pN key lifts the citation caps */
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

  function buildHall(group, wallMaterial, ribMaterial, seamMaterial) {
    const ribs = new LineSink();
    const walls = new LineSink();
    const seam = new LineSink();

    /* structural ribs: chamfered 45° portals, 5.5 m apart */
    for (let z = HALL.zA; z >= HALL.zB; z -= HALL.rib) {
      for (let s = -1; s <= 1; s += 2) {
        const x = HALL.half * s;
        const xi = (HALL.half - 1.15) * s;
        /* three-zone alpha: bright at the floor and the ceiling, near-silent
           where a content panel can sit */
        ribs.seg(x, 0.02, z, x, 0.95, z, 1.0);
        ribs.seg(x, 0.95, z, x, HALL.ceil - 1.15, z, 0.16);
        ribs.seg(x, HALL.ceil - 1.15, z, x, HALL.ceil, z, 1.0);
        ribs.seg(x, HALL.ceil, z, xi, HALL.ceil, z, 0.55);
        /* 45° chamfer drawn back into the wall line */
        ribs.seg(x, HALL.ceil - 1.15, z, xi, HALL.ceil - 1.15, z, 0.35);
        ribs.seg(x, HALL.ceil - 0.42, z, x + (0.42 * s), HALL.ceil, z, 0.40);
      }
      /* a faint floor line across the hall — the plan grid of the hall */
      ribs.seg(-HALL.half, 0.015, z, HALL.half, 0.015, z, 0.12);
    }

    /* wall datum lines: base, architrave, top */
    for (let s = -1; s <= 1; s += 2) {
      const x = HALL.half * s;
      walls.seg(x, 0.018, HALL.zA, x, 0.018, HALL.zB, 0.62);
      walls.seg(x, 4.95, HALL.zA, x, 4.95, HALL.zB, 0.30);
      walls.seg(x, HALL.ceil - 0.004, HALL.zA, x, HALL.ceil - 0.004, HALL.zB, 0.26);
    }

    /* the spectral seam: one line per wall, at eye level, end to end */
    for (let s = -1; s <= 1; s += 2) {
      const x = HALL.half * s;
      seam.seg(x, HALL.seamY, HALL.zA, x, HALL.seamY, HALL.zB, 1.0);
    }

    const ribObj = new THREE.LineSegments(ribs.geometry(), ribMaterial);
    ribObj.name = 'hall-ribs';
    ribObj.frustumCulled = false;
    group.add(track(ribObj));

    const wallObj = new THREE.LineSegments(walls.geometry(), wallMaterial);
    wallObj.name = 'hall-walls';
    wallObj.frustumCulled = false;
    group.add(track(wallObj));

    const seamObj = new THREE.LineSegments(seam.geometry(), seamMaterial);
    seamObj.name = 'spectral-seam';
    seamObj.frustumCulled = false;
    seamObj.renderOrder = 3;
    group.add(track(seamObj));
  }

  function addDatumPost(sink, x, z, weight) {
    const top = 4.30;
    sink.seg(x, 0.02, z, x, top, z, weight, 0);
    /* 45° cut leaning outward — never a closed frame */
    const dir = x < 0 ? -1 : 1;
    sink.seg(x, top, z, x + dir * 0.5, top + 0.5, z, weight * 0.7, 0);
    /* foot tick */
    sink.seg(x - dir * 0.35, 0.025, z, x + dir * 0.35, 0.025, z, weight * 0.6, 0);
  }

  function makeSeamGlowGeometry() {
    const pos = [];
    const uv = [];
    const h = HALL.seamGlowH * 0.5;
    for (let s = -1; s <= 1; s += 2) {
      const x = s * (HALL.half - 0.035);
      const z0 = HALL.zA, z1 = HALL.zB;
      const y0 = HALL.seamY - h, y1 = HALL.seamY + h;
      /* one quad per wall; double-sided so the reflection pass sees it */
      pos.push(x, y0, z0, x, y0, z1, x, y1, z1, x, y1, z0);
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
    const n = low ? 120 : 220;
    const pos = new Float32Array(n * 3);
    const seed = new Float32Array(n);
    let s = 0x9e3779b9;
    const rnd = () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
    for (let i = 0; i < n; i++) {
      pos[i * 3] = (rnd() * 2 - 1) * 7.4;
      pos[i * 3 + 1] = 0.25 + rnd() * 6.4;
      pos[i * 3 + 2] = HALL.zA + 2 - rnd() * (HALL.zA - HALL.zB + 6);
      seed[i] = rnd();
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    geo.setAttribute('aSeed', new THREE.Float32BufferAttribute(seed, 1));
    return { geo, mat };
  }

  function buildMonoliths(massSink, lineSink, group) {
    /* ten depth landmarks: tall matte slabs at the edges of the hall, always
       outside the content aperture.  A few carry a vertical spectral slit. */
    const mono = [
      { x: -6.30, z: -8.0, w: 1.35, h: 7.4, d: 3.2, slit: true },
      { x: 6.55, z: -15.0, w: 1.55, h: 9.2, d: 2.6, slit: false },
      { x: -7.10, z: -26.0, w: 1.85, h: 5.4, d: 4.0, slit: false },
      { x: 6.05, z: -34.5, w: 0.95, h: 7.8, d: 3.0, slit: true },
      { x: -6.70, z: -45.0, w: 1.45, h: 6.2, d: 2.2, slit: false },
      { x: 7.20, z: -56.0, w: 1.05, h: 9.6, d: 3.6, slit: false },
      { x: -7.00, z: -66.0, w: 1.65, h: 4.8, d: 2.8, slit: true },
      { x: 6.35, z: -79.0, w: 1.25, h: 7.6, d: 3.2, slit: false },
      { x: -6.10, z: -92.0, w: 1.10, h: 6.0, d: 2.4, slit: false },
      { x: 5.85, z: -106.0, w: 1.55, h: 6.9, d: 3.8, slit: false },
      { x: -6.90, z: -119.0, w: 1.30, h: 8.2, d: 2.8, slit: false },
      { x: 6.90, z: -133.0, w: 1.90, h: 5.6, d: 3.4, slit: false },
    ];
    const slitGeo = [];
    for (let i = 0; i < mono.length; i++) {
      const m = mono[i];
      addSlab(massSink, lineSink, {
        x: m.x, y: m.h * 0.5, z: m.z, w: m.w, h: m.h, d: m.d,
        rot: [0, (i % 3 - 1) * 0.018, 0], edge: 0.95, tint: i % 2 ? 1.06 : 0.92,
      });
      if (m.slit) {
        /* a vertical light slit on the inner face, near the front arris */
        const dir = m.x > 0 ? -1 : 1;
        const sx = m.x + dir * (m.w * 0.5 - 0.16);
        const sz = m.z + m.d * 0.5 + 0.012;
        const sw = 0.045;
        const y0 = 0.12, y1 = m.h * 0.9;
        slitGeo.push(sx - sw, y0, sz, sx + sw, y0, sz, sx + sw, y1, sz,
          sx - sw, y1, sz);
      }
    }
    if (slitGeo.length) {
      const pos = new Float32Array(slitGeo);
      const uv = new Float32Array(slitGeo.length / 3 * 2);
      for (let i = 0; i < slitGeo.length / 12; i++) {
        uv[i * 8 + 0] = 0; uv[i * 8 + 1] = 0;
        uv[i * 8 + 2] = 1; uv[i * 8 + 3] = 0;
        uv[i * 8 + 4] = 1; uv[i * 8 + 5] = 1;
        uv[i * 8 + 6] = 0; uv[i * 8 + 7] = 1;
      }
      const idx = [];
      for (let i = 0; i < pos.length / 12; i++) {
        const b = i * 4;
        idx.push(b, b + 1, b + 2, b, b + 2, b + 3);
      }
      const geo = trackGeo(new THREE.BufferGeometry());
      geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
      geo.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
      geo.setIndex(idx);
      geo.computeBoundingSphere();
      const mat = trackMat(makeGlowMaterial({
        opacity: 0.34, power: 1.4, mode: 3, flow: 0.02, near: 0, far: 140,
      }));
      registerMats([mat]);
      const mesh = new THREE.Mesh(geo, mat);
      mesh.name = 'monolith-slits';
      mesh.frustumCulled = false;
      group.add(mesh);
    }
  }

  /* ------------------------------------------------------------- signatures */

  function buildEntry(st, massSink, lineSink, sceneRef, group, numMat) {
    const fr = st.frame;
    const O = fr.origin;
    const z = O.z + fr.forward.z * 4.3;         // 12.3 m from the eye
    const px = 5.5;
    const pierW = 1.65, pierD = 2.1, pierH = 8.4;

    for (let s = -1; s <= 1; s += 2) {
      addSlab(massSink, lineSink, {
        x: O.x + s * px, y: pierH * 0.5, z, w: pierW, h: pierH, d: pierD,
        rot: [0, 0, 0], edge: 1.0, tint: 1.0,
      });
    }
    /* lintel: sits in the top margin, above every panel */
    addSlab(massSink, lineSink, {
      x: O.x, y: 4.34, z, w: px * 2 + pierW, h: 0.38, d: pierD,
      rot: [0, 0, 0], edge: 0.85, tint: 0.9,
    });

    /* spectral jambs: the seam spills down the inner faces of the portal */
    const jambGeo = [];
    for (let s = -1; s <= 1; s += 2) {
      const jx = O.x + s * (px - pierW * 0.5 - 0.03);
      const jz = z + pierD * 0.5 + 0.014;
      const w = 0.022, y0 = 0.05, y1 = 7.2;
      jambGeo.push(jx - w, y0, jz, jx + w, y0, jz, jx + w, y1, jz, jx - w, y1, jz);
    }
    const jamb = makeQuadBatch(jambGeo, trackGeo, trackMat, {
      opacity: 0.55, power: 1.2, mode: 3, flow: 0.016, near: 0, far: 120,
    });
    if (jamb) group.add(jamb);

    /* outlined 01 — standing between the piers, deeper than the content */
    const num = new LineSink();
    const nz = O.z + fr.forward.z * 8.6;
    const nx = O.x + fr.forward.x * 8.6;
    const H = 4.3, W = 2.0, gap = 0.42;
    for (let i = 0; i < 2; i++) {
      const ch = i === 0 ? '0' : '1';
      const cx = nx + (i === 0 ? -(W * 0.5 + gap * 0.5) : (W * 0.5 + gap * 0.5));
      const map = (u, v) => [cx + (u - 0.5) * W, 0.32 + v * H, nz];
      emitGlyph(num, ch, map, 0.85, 0);
    }
    /* base rule at the foot of the numerals */
    num.seg(nx - W - gap * 0.5 - 0.3, 0.32, nz, nx + W + gap * 0.5 + 0.3, 0.32, nz, 0.4, 0);
    const obj = new THREE.LineSegments(num.geometry(), numMat);
    obj.name = 'entry-numeral-01';
    obj.frustumCulled = false;
    group.add(track(obj));
  }

  function buildProfile(st, lineSink, sceneRef, group, mat) {
    const fr = st.frame;
    const O = fr.origin;
    const z = O.z + fr.forward.z * 5.7;
    const x = O.x + fr.forward.x * 5.7;
    const sink = new LineSink();
    /* seven nested wireframe cubes, each rotated a little further */
    const y0 = 0.85;
    const step = 0.72;
    for (let i = 0; i < 7; i++) {
      const s = 0.42 + i * 0.155;
      const cy = y0 + i * step;
      addWireCube(sink, x, cy, z, s, i * 0.17, i * 0.11 + 0.3, i * 0.07, 0.55 + (i === 6 ? 0.35 : 0));
    }
    /* spine + base plate */
    sink.seg(x, 0.03, z, x, 6.4, z, 0.7, 0);
    const base = 0.86;
    sink.seg(x - base, 0.02, z, x + base, 0.02, z, 0.5, 0);
    sink.seg(x, 0.02, z - base, x, 0.02, z + base, 0.5, 0);
    const obj = new THREE.LineSegments(sink.geometry(), mat);
    obj.name = 'profile-data-pillar';
    obj.frustumCulled = false;
    group.add(track(obj));
  }

  function addWireCube(sink, cx, cy, cz, s, ry, rx, rz, weight) {
    const c = Math.cos, sn = Math.sin;
    const qy = ry, qx = rx, qz = rz;
    const pts = [];
    for (let i = 0; i < 8; i++) {
      let x = (i & 1 ? 1 : -1) * s;
      let y = (i & 2 ? 1 : -1) * s;
      let z = (i & 4 ? 1 : -1) * s;
      /* rz */
      let t = x * c(qz) - y * sn(qz); y = x * sn(qz) + y * c(qz); x = t;
      /* rx */
      t = y * c(qx) - z * sn(qx); z = y * sn(qx) + z * c(qx); y = t;
      /* ry */
      t = z * c(qy) + x * sn(qy); x = -z * sn(qy) + x * c(qy); z = t;
      pts.push([cx + x, cy + y, cz + z]);
    }
    for (let e = 0; e < 12; e++) {
      const a = pts[BOX_EDGES[e][0]], b = pts[BOX_EDGES[e][1]];
      sink.seg(a[0], a[1], a[2], b[0], b[1], b[2], weight, 0);
    }
  }

  function buildResearch(st, sceneRef, group, out) {
    const fr = st.frame;
    const O = fr.origin;
    const cz = O.z + fr.forward.z * 5.6;
    const cx = O.x + fr.forward.x * 5.6;
    const cy = 2.55;
    const specs = [
      { r: 2.05, rot: [-1.16, 0.18, 0.0], spinY: 0.030, spinZ: 0.05 },
      { r: 2.62, rot: [0.40, 0.62, 0.20], spinY: -0.024, spinZ: -0.04 },
      { r: 3.18, rot: [1.42, -0.36, 0.92], spinY: 0.020, spinZ: 0.06 },
      { r: 3.74, rot: [0.86, 0.02, 1.32], spinY: -0.016, spinZ: -0.05 },
    ];
    const g = new THREE.Group();
    g.name = 'research-orbit-rings';
    g.position.set(cx, cy, cz);
    group.add(g);

    for (let i = 0; i < specs.length; i++) {
      const sp = specs[i];
      const ring = buildRingGeometry(sp.r, 108, i * 0.145);
      const mat = trackMat(makeLineMaterial({
        opacity: 0.62, near: 9, far: 48, in: 4.2, mode: 2, phase: i * 0.22, flow: 0.006,
      }));
      const obj = new THREE.LineSegments(ring, mat);
      obj.frustumCulled = false;
      obj.name = 'orbit-' + RING_KEYS[i];
      obj.rotation.set(sp.rot[0], sp.rot[1], sp.rot[2]);
      g.add(obj);
      out.push({
        group: obj, mat,
        baseX: sp.rot[0], baseY: sp.rot[1], baseZ: sp.rot[2],
        spinY: sp.spinY,
      });
    }
    /* a central tick so the instrument has a sight */
    const mark = new LineSink();
    mark.seg(-0.55, 0, 0, 0.55, 0, 0, 0.7, 0);
    mark.seg(0, -0.55, 0, 0, 0.55, 0, 0.7, 0);
    mark.seg(0, 0, -0.55, 0, 0, 0.55, 0.45, 0);
    const mkGeo = trackGeo(mark.geometry());
    const mkMat = trackMat(makeLineMaterial({
      color: PAL.line, opacity: 0.55, near: 8, far: 42, in: 4.2, mode: 0,
    }));
    const mk = new THREE.LineSegments(mkGeo, mkMat);
    mk.frustumCulled = false;
    mk.position.copy(g.position);
    group.add(mk);
  }

  function buildRingGeometry(r, n, gPhase) {
    const sink = new LineSink();
    let px = r, py = 0;
    for (let i = 1; i <= n; i++) {
      const a = (i / n) * Math.PI * 2;
      const nx = Math.cos(a) * r;
      const ny = Math.sin(a) * r;
      sink.seg(px, py, 0, nx, ny, 0, 1.0, gPhase + i / n);
      px = nx; py = ny;
    }
    /* 12 radial ticks — the ring reads as an instrument, not a hoop */
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * Math.PI * 2;
      const l = i % 3 === 0 ? 0.30 : 0.13;
      sink.seg(Math.cos(a) * r, Math.sin(a) * r, 0,
        Math.cos(a) * (r + l), Math.sin(a) * (r + l), 0,
        i % 3 === 0 ? 0.9 : 0.5, gPhase + i / 12);
    }
    return sink.geometry();
  }

  function buildPapers(st, massSink, lineSink, sceneRef, group, capMat) {
    const fr = st.frame;
    const O = fr.origin;
    const z = O.z + fr.forward.z * 5.0;
    const cx = O.x + fr.forward.x * 5.0;

    const cites = readCitations(st.el);
    const vals = cites.length >= 3 ? cites.slice(0, 8) : [1, 2, 2, 3, 4, 5, 6, 6];
    vals.sort((a, b) => a - b);
    const maxV = Math.max(1, vals[vals.length - 1]);
    const n = vals.length;
    const gap = 0.92;
    const zBase = z;
    const caps = new LineSink();

    for (let i = 0; i < n; i++) {
      const frac = Math.sqrt(vals[i] / maxV);
      const h = 0.9 + frac * 4.6;
      const x = cx + (i - (n - 1) * 0.5) * gap;
      addSlab(massSink, lineSink, {
        x, y: h * 0.5, z: zBase, w: 0.56, h, d: 0.62,
        rot: [0, 0.02 * (i % 2 ? 1 : -1), 0], edge: 0.72, tint: 1.0,
      });
      /* spectral cap: the measured value, drawn in light */
      caps.seg(x - 0.28, h + 0.004, zBase + 0.31, x + 0.28, h + 0.004, zBase + 0.31, 1.0, 0.06 + (i / Math.max(1, n - 1)) * 0.5);
      /* tiny baseline tick */
      caps.seg(x, 0.02, zBase + 0.31, x, 0.15, zBase + 0.31, 0.35, 0.0);
    }
    const capObj = new THREE.LineSegments(caps.geometry(), capMat);
    capObj.name = 'papers-citation-spine';
    capObj.frustumCulled = false;
    group.add(track(capObj));
  }

  function readCitations(el) {
    const out = [];
    if (!el || !el.querySelectorAll) return out;
    try {
      const rows = el.querySelectorAll('[data-cite]');
      if (rows && rows.length) {
        for (let i = 0; i < rows.length && out.length < 8; i++) {
          const v = parseInt(rows[i].getAttribute('data-cite'), 10);
          if (isFinite(v) && v >= 0) out.push(v);
        }
        if (out.length) return out;
      }
    } catch (e) { /* noop */ }
    try {
      const lis = el.querySelectorAll('li');
      for (let i = 0; i < lis.length && out.length < 8; i++) {
        const t = lis[i].textContent || '';
        const m = t.match(/(\d+)\s*(?:次引用|citations?)/i);
        if (m) out.push(Math.max(0, parseInt(m[1], 10)));
      }
    } catch (e) { /* noop */ }
    return out;
  }

  function buildNotes(st, massSink, lineSink, sceneRef, group, mat) {
    const fr = st.frame;
    const O = fr.origin;
    const cz = O.z + fr.forward.z * 5.3;
    const cx = O.x + 0.55;
    const cy = 2.85;

    const pages = 9;
    for (let i = 0; i < pages; i++) {
      const a = -0.52 + (i / (pages - 1)) * 1.04;
      const off = (i - (pages - 1) / 2) * 0.055;
      addSlab(massSink, lineSink, {
        x: cx + off, y: cy + Math.sin(i * 0.9) * 0.035, z: cz + (i - (pages - 1) / 2) * 0.045,
        w: 2.15, h: 2.85, d: 0.035,
        rot: [0.06 + i * 0.012, a, a * 0.10], edge: 0.62, tint: i % 3 === 0 ? 1.12 : 0.96,
      });
    }
    /* the pin that holds the fan */
    const pin = new LineSink();
    const pinY = cy + 1.05;
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2;
      pin.seg(cx + Math.cos(a) * 0.09, pinY, cz + Math.sin(a) * 0.09,
        cx + Math.cos(a + 0.7) * 0.09, pinY, cz + Math.sin(a + 0.7) * 0.09, 0.8, 0);
    }
    const pinObj = new THREE.LineSegments(pin.geometry(), mat);
    pinObj.frustumCulled = false;
    group.add(track(pinObj));
  }

  function buildTools(st, massSink, lineSink) {
    const fr = st.frame;
    const O = fr.origin;
    /* four columns aligned with the tools grid, two rows in depth */
    const cols = [-2.10, -0.70, 0.70, 2.10];   // grid column centres at 8 m
    const rows = [
      { depth: 5.4, scale: 1.0, heights: [4.6, 5.6, 3.9, 6.4] },
      { depth: 10.4, scale: 1.32, heights: [3.6, 4.9, 5.9, 4.3] },
    ];
    for (let r = 0; r < rows.length; r++) {
      const row = rows[r];
      const z = O.z + fr.forward.z * row.depth;
      for (let i = 0; i < cols.length; i++) {
        /* screen-space alignment with the grid at 8 m (forced perspective) */
        const x = O.x + cols[i] * (row.depth / 8) * 0.92;
        const h = row.heights[i] * (r === 0 ? 1 : 0.86);
        const w = 0.62 * row.scale;
        addSlab(massSink, lineSink, {
          x, y: h * 0.5, z, w, h, d: 0.7 * row.scale,
          rot: [0, 0, 0], edge: 0.8, tint: r === 0 ? 1.05 : 0.88,
        });
        /* a single dim tick at the shoulder */
        if (r === 0) {
          lineSink.seg(x - w * 0.5, h - 0.12, z + 0.36, x + w * 0.5, h - 0.12, z + 0.36, 0.5, 0.0);
        }
      }
    }
  }

  function buildContact(st, massSink, lineSink, sceneRef, group, mat, horizon) {
    const fr = st.frame;
    const O = fr.origin;
    const z = O.z + fr.forward.z * 6.4;
    const px = 6.9;
    const h = 5.4;

    /* one open horizon frame: two posts and a beam, dissolving at the floor */
    for (let s = -1; s <= 1; s += 2) {
      addSlab(massSink, lineSink, {
        x: O.x + s * px, y: h * 0.5, z, w: 0.5, h, d: 1.1,
        rot: [0, 0, 0], edge: 0.7, tint: 0.9,
      });
    }
    addSlab(massSink, lineSink, {
      x: O.x, y: h + 0.25, z, w: px * 2 + 0.5, h: 0.5, d: 1.1,
      rot: [0, 0, 0], edge: 0.6, tint: 0.84,
    });

    /* the inner arris of the frame: fades out towards the floor */
    const inner = new LineSink();
    const topY = h;
    for (let s = -1; s <= 1; s += 2) {
      const ix = O.x + s * (px - 0.25);
      const iz = z + 0.552;
      const n = 12;
      for (let i = 0; i < n; i++) {
        const y0 = (i / n) * topY;
        const y1 = ((i + 1) / n) * topY;
        const a0 = 0.16 + 0.74 * Math.pow(y0 / topY, 1.4);
        inner.seg(ix, y0, iz, ix, y1, iz, a0, 0);
      }
      inner.seg(ix, topY, iz, O.x, topY, iz, 0.05, 0);
    }
    const innerObj = new THREE.LineSegments(inner.geometry(), mat);
    innerObj.name = 'contact-frame-arris';
    innerObj.frustumCulled = false;
    group.add(track(innerObj));

    /* the horizon: a long, low band of spectral light at the far end */
    const hzZ = HALL.zB - 3.4;
    const hzGeo = trackGeo(new THREE.PlaneGeometry(220, 1.5, 1, 1));
    const hzMesh = new THREE.Mesh(hzGeo, trackMat(makeGlowMaterial({
      opacity: 0.34, power: 1.8, mode: 2, flow: 0.004, near: 0, far: 500,
    })));
    hzMesh.position.set(0, HALL.seamY, hzZ);
    hzMesh.name = 'contact-horizon';
    hzMesh.frustumCulled = false;
    group.add(hzMesh);

    const hzLine = new LineSink();
    hzLine.seg(-110, HALL.seamY, hzZ + 0.06, 110, HALL.seamY, hzZ + 0.06, 0.85, 0);
    const hzObj = new THREE.LineSegments(hzLine.geometry(), horizon);
    hzObj.name = 'contact-horizon-line';
    hzObj.frustumCulled = false;
    group.add(track(hzObj));
  }

  /* quad batch helper (for spectral slits / jambs) */
  function makeQuadBatch(quadPos, geoFn, matFn, opts) {
    if (!quadPos.length) return null;
    const pos = new Float32Array(quadPos);
    const uv = new Float32Array((quadPos.length / 12) * 8);
    for (let i = 0; i < quadPos.length / 12; i++) {
      uv[i * 8 + 0] = 0; uv[i * 8 + 1] = 0;
      uv[i * 8 + 2] = 1; uv[i * 8 + 3] = 0;
      uv[i * 8 + 4] = 1; uv[i * 8 + 5] = 1;
      uv[i * 8 + 6] = 0; uv[i * 8 + 7] = 1;
    }
    const geo = geoFn(new THREE.BufferGeometry());
    geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    geo.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
    const idx = [];
    for (let i = 0; i < pos.length / 12; i++) {
      const b = i * 4;
      idx.push(b, b + 1, b + 2, b, b + 2, b + 3);
    }
    geo.setIndex(idx);
    geo.computeBoundingSphere();
    const mat = matFn(makeGlowMaterial(opts));
    registerMats([mat]);
    const mesh = new THREE.Mesh(geo, mat);
    mesh.frustumCulled = false;
    mesh.name = 'spectral-quad-batch';
    return mesh;
  }

  /* the public API is wired only once the world has been built */
  api.update = update;
  api.resize = resize;
  api.focus = focus;
  api.dispose = dispose;
  api.groups = groups;
  api.mirror = mirror;
  return api;
}

/* ---------------------------------------------------------- mirror tuning */
/* The v3 palette is neutral; the legacy mirror shader carries a cold-blue
   sheen and a blue plan grid.  Re-balance the two colour constants in place
   (guarded: if engine.js has already moved on, this is a no-op).            */
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
