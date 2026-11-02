/* =============================================================================
   SPATIAL · app.js — the runtime
   -----------------------------------------------------------------------------
   Owns: quality gate + graceful degradation, DOM → 3D station assembly, the
   scroll→camera timeline (damped through CameraRig), the DOM projector, HUD
   wiring, keyboard/rail navigation, language re-projection, minimap and boot.

   v3 additions (direction-v3.md §5.3):
   · blade wipe + camera kick on every rail / keyboard / deep-link jump
   · station choreography: sp:station event, .is-live, first-entry panel reveal
   · magnetic cursor with contextual label, station counters ([data-count])
   · HUD v3 wiring (rail / readout / status / plan) — markup in space-hud.html

   Hard rules enforced here:
   · the camera is only ever moved through CameraRig.setPose + rig.update(dt)
   · every frame is ordered: dt → camera → matrix refresh → mirror → post →
     DOM projection → HUD → cursor/input
   · any failure path ends in `.sp-flat` (readable document), never a blank page
   · no per-frame allocations on the hot path
   · panels are never faded by JS CSS transitions: the projector owns opacity

   Debug/QA hook: window.__sp = { go(1-based), go0(0-based), state(), mode, fps }
   ========================================================================== */
import * as THREE from 'three';
import {
  STATIONS, SHELL, stationFrame, unitsPerPixel,
} from './stations.js';
import {
  makeRenderer, makeMirrorFloor, makePostChain, makeGlassMaterial, makeLineLace,
  CameraRig, DomProjector, SpaceInput, makeCursor,
  detectQuality, hasWebGL, clamp, lerp, smoothstep, damp,
} from './engine.js';

const doc = document;
const html = doc.documentElement;
const DEG = Math.PI / 180;

/** panel anchor presets — which point of the box lands on data-sp-pos */
const ANCHORS = {
  lt: [0, 0], ct: [0.5, 0], rt: [1, 0],
  lc: [0, 0.5], cc: [0.5, 0.5], rc: [1, 0.5],
  lb: [0, 1], cb: [0.5, 1], rb: [1, 1],
};

const AUTO_PITCH = 22;     // metres between auto-generated stations (E10)
const AUTO_FOV = 33;
const JUMP_MS = 900;
const REVEAL_MS = 700;
const MIN_SPATIAL_WIDTH = 900;

/* v3 jump FX — one blade pass + a short damped camera kick. The wipe uniform
   sweeps the blade across the frame exactly once (0 → 1); it is parked back at
   0 when the blade has left the frame, which is visually a 0→1→0 envelope. */
const WIPE_MS = 520;
const FADE_MS = 160;       // reduced-motion replacement for the wipe
const STAGGER_MS = 40;     // first-entry panel stagger
const COUNTER_MS = 900;

const fx = {
  wipeStart: -1,
  fadeStart: -1,
  fadeReveal: false,   // reduced motion: fade in from black over 160 ms
  reduced: false,
};

function beginJumpFx() {
  const now = performance.now();
  if (fx.reduced) {
    fx.fadeStart = now;
    fx.fadeReveal = true;
    fx.wipeStart = -1;
  } else {
    fx.wipeStart = now;
    fx.fadeStart = -1;
    fx.fadeReveal = false;
  }
  /* CameraRig owns the damped jump kick (engine v3 impulse API). */
  if (app.onJumpImpulse) app.onJumpImpulse();
}

/* The page composition is authored on a 1520x950 canvas: above the 900 px flat
   threshold every station is scaled uniformly so it keeps its proportions. */
const compScaleFor = () => {
  const w = window.innerWidth;
  const h = window.innerHeight;
  /* 70 px of breathing room each side: keeps the projected composition clear of
     the left rail and the right readout at every desktop width. */
  return Math.min(1, (w - 140) / 1520, h / 950);
};

/* --- MASTER SWITCH: physical panel bodies (slabs / plinths / edges) --------
   OFF by default: the body map currently reads wrong on screen (fill too
   large around the text, plinths crossing the composition). The alignment
   still has to be proven with __sp.bodyCheck() before this goes back on.
   QA can preview it on any page with ?bodies=1 without touching markup.   */
const BODIES = false;
const BODIES_QA = /[?&]bodies=1\b/.test(location.search);
const BODIES_ON = BODIES || BODIES_QA;

/* physical panel bodies — px pad around the DOM box, slab depth in metres */
const SLAB = {
  pad: 26,         // px of glass around the text block
  thick: 0.07,      // m
  bodyZ: 0.06,      // m: body front face sits behind the text plane
  plinthZ: 0.22,    // m: plinth sits further back -> parallax reveal
  gap: 0.02,        // m: hairline between plinth and its mirror image
  maxPlinth: 3.2,   // m
};

const app = {
  mode: 'flat',       // 'spatial' | 'ambient' | 'flat'
  fps: 0,
  n: 0,
  tops: [],
  index: 0,
  active: -1,         // arrived station (rest), 0-based
  t: 0,
  progress: 0,
  wipe: 0,
  go: () => {},
  jumpUntil: 0,       // rest detection is suppressed while a jump tween runs
  snapRig: false,     // reduced motion: land a jump without a camera glide
  onJumpImpulse: null,
  dispose: null,
  raf: 0,
  started: false,
};

/* ------------------------------------------------------------------ utils -- */
const num = (v, d = 0) => (Number.isFinite(+v) ? +v : d);

function triple(str, def) {
  const p = String(str == null ? '' : str).split(',');
  return [num(p[0], def[0]), num(p[1], def[1]), num(p[2], def[2])];
}

const pad2 = (n) => String(n).padStart(2, '0');

const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => (
  { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
));

const easeInOutQuart = (t) => (t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2);
const easeInOutCubic = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

/* ------------------------------------------------------------- counters -- */
/**
 * [data-count] numerals animate 0 → value once, on the station's first entry.
 * The server-rendered value is the fallback: reduced motion / no JS / flat
 * mode keep it untouched (direction-v3 §0.6). Formatting follows the authored
 * attribute so "04" keeps its zero pad and "1,280" keeps its grouping.
 */
function formatCounter(v, decimals, grouped, pad) {
  let s = decimals ? v.toFixed(decimals) : String(Math.round(v));
  if (grouped) s = s.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  if (pad) s = s.padStart(pad, '0');
  return s;
}

function animateCounters(root, reduced) {
  const els = root.querySelectorAll('[data-count]');
  for (let i = 0; i < els.length; i++) {
    const el = els[i];
    if (el._spCounted) continue;
    el._spCounted = true;
    const raw = String(el.getAttribute('data-count') || el.textContent || '').trim();
    const target = parseFloat(raw.replace(/,/g, ''));
    if (!Number.isFinite(target)) continue;
    if (reduced) continue;                 // keep the authored number
    const dot = raw.indexOf('.');
    const decimals = dot >= 0 ? Math.min(3, raw.length - dot - 1) : 0;
    const grouped = raw.indexOf(',') >= 0;
    const pad = /^0\d/.test(raw) ? raw.length : 0;
    const t0 = performance.now() + i * 70;
    el.textContent = formatCounter(0, decimals, grouped, pad);
    const step = (now) => {
      const k = clamp((now - t0) / COUNTER_MS, 0, 1);
      if (k >= 1) {
        el.textContent = formatCounter(target, decimals, grouped, pad);
        return;
      }
      el.textContent = formatCounter(target * easeOutCubic(k), decimals, grouped, pad);
      requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }
}

function nextFrames(n) {
  return new Promise((resolve) => {
    const step = () => (--n <= 0 ? resolve() : requestAnimationFrame(step));
    requestAnimationFrame(step);
  });
}

/* ------------------------------------------------------------- slab body --- */
/**
 * 1 px structural edge for a glass body. Intensity is per-role (hero 0.55,
 * floor-contact 0.85) and capped so it never clips to white; additive and
 * distance-faded by hand so the next station's monoliths dissolve instead of
 * turning into wireframe clutter.
 */
function makeEdgeMaterial(intensity) {
  return new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: {
      uCam: { value: new THREE.Vector3() },
      uColor: { value: new THREE.Color(0.62, 0.84, 1.0).multiplyScalar(intensity) },
    },
    vertexShader: /* glsl */ `
      varying vec3 vW;
      void main(){
        vec4 wp = modelMatrix * vec4(position, 1.0);
        vW = wp.xyz;
        gl_Position = projectionMatrix * viewMatrix * wp;
      }
    `,
    fragmentShader: /* glsl */ `
      uniform vec3 uCam;
      uniform vec3 uColor;
      varying vec3 vW;
      void main(){
        float f = 1.0 - smoothstep(16.0, 34.0, length(vW - uCam));
        if (f <= 0.004) discard;
        gl_FragColor = vec4(uColor, f);
      }
    `,
  });
}

/** the four bottom edges of a box — the contact line that grounds a monolith */
function bottomEdges(geo) {
  const p = geo.parameters;
  const hw = p.width / 2;
  const hh = (p.height || 0.1) / 2;
  const hd = (p.depth || 0.1) / 2;
  const c = [[-hw, -hh, hd], [hw, -hh, hd], [hw, -hh, -hd], [-hw, -hh, -hd]];
  const pos = [];
  for (let i = 0; i < 4; i++) {
    const a = c[i];
    const b = c[(i + 1) % 4];
    pos.push(a[0], a[1], a[2], b[0], b[1], b[2]);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  return g;
}

/**
 * Physical body material for `data-sp-slab` blocks.
 * `glass` = clear pane: vertical gradient fill (0.05 bottom → 0.20 top) plus a
 *           faint inner top sheen — a SURFACE, never an outline.
 * `ink`   = smoked black glass (rgb .015 @ 0.55) with a 1 px lighter top edge,
 *           for dense reading panels where contrast matters. No outline.
 */
function makeSlabMaterial(kind) {
  const glass = kind !== 'ink';
  return new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide,
    blending: THREE.NormalBlending,
    uniforms: {
      uCam: { value: new THREE.Vector3() },
      uTint: { value: new THREE.Color(glass ? 0.55 : 0.015, glass ? 0.72 : 0.015, glass ? 0.88 : 0.015) },
      uKind: { value: glass ? 0 : 1 },
    },
    vertexShader: /* glsl */ `
      varying vec3 vN;
      varying vec3 vW;
      varying vec2 vUv;
      void main(){
        vUv = uv;
        vec4 wp = modelMatrix * vec4(position, 1.0);
        vW = wp.xyz;
        vN = normalize(mat3(modelMatrix) * normal);
        gl_Position = projectionMatrix * viewMatrix * wp;
      }
    `,
    fragmentShader: /* glsl */ `
      precision highp float;
      uniform vec3 uCam;
      uniform vec3 uTint;
      uniform float uKind;
      varying vec3 vN;
      varying vec3 vW;
      varying vec2 vUv;
      void main(){
        float grad = clamp(vUv.y, 0.0, 1.0);            // 0 = bottom, 1 = top
        float fogF = 1.0 - smoothstep(26.0, 62.0, length(vW - uCam));
        if (uKind < 0.5) {
          // glass: vertical gradient fill + faint inner top-edge sheen
          float sheen = smoothstep(0.93, 1.0, grad);
          vec3 col = uTint + vec3(0.55, 0.75, 0.95) * sheen * 0.35;
          float a = mix(0.05, 0.20, grad) + sheen * 0.04;
          gl_FragColor = vec4(col, a * fogF);
        } else {
          // smoked black glass: 1 px lighter top edge, no outline
          float top = smoothstep(0.985, 1.0, grad);
          vec3 col = vec3(0.015) + vec3(0.30, 0.45, 0.60) * top * 0.9;
          gl_FragColor = vec4(col, mix(0.55, 0.62, top) * fogF);
        }
      }
    `,
  });
}

/* ------------------------------------------------------------------- boot -- */
function bootNode() { return doc.getElementById('sp-boot'); }

function setBootProgress(v) {
  const b = bootNode();
  if (b) b.style.setProperty('--p', String(clamp(v, 0, 1)));
}

/**
 * Boot overlay dismissal is time-bounded: two frames plus at most 500 ms of
 * font loading, and never before ~450 ms so the mark has a beat to register.
 * Waiting on `document.fonts.ready` indefinitely was holding the first real
 * frame back by more than a second on cold caches.
 */
async function finishBoot() {
  const b = bootNode();
  const t0 = performance.now();
  setBootProgress(0.85);
  await nextFrames(2);
  try {
    const fonts = doc.fonts && doc.fonts.ready ? doc.fonts.ready : Promise.resolve();
    await Promise.race([fonts, new Promise((r) => setTimeout(r, 180))]);
  } catch (e) { /* fonts.ready can reject in exotic cases */ }
  /* one short beat so the mark registers, then get out of the way */
  const elapsed = performance.now() - t0;
  if (elapsed < 120) await new Promise((r) => setTimeout(r, 120 - elapsed));
  setBootProgress(1);
  if (b) b.setAttribute('data-done', 'true');
}

/* ------------------------------------------------------------- degradation -- */
function cleanInline() {
  doc.querySelectorAll('.sp-layer').forEach((l) => {
    l.style.position = ''; l.style.inset = ''; l.style.zIndex = '';
  });
  doc.querySelectorAll('.sp-panel').forEach((p) => {
    p.style.position = ''; p.style.left = ''; p.style.top = '';
    p.style.transform = ''; p.style.opacity = ''; p.style.visibility = '';
  });
}

function flat(reason) {
  const first = !app.started && app.mode === 'flat';
  app.mode = 'flat';
  if (app.raf) { cancelAnimationFrame(app.raf); app.raf = 0; }
  try { if (app.dispose) app.dispose(); } catch (e) { /* nothing to release */ }
  app.dispose = null;
  html.classList.remove('sp-ambient');
  html.classList.add('sp-flat');
  cleanInline();
  const b = bootNode();
  if (b) b.setAttribute('data-done', 'true');
  setBootProgress(1);
  if (reason && !first) console.warn('[space] degraded to flat document ::', reason);
}

/* --------------------------------------------------------------- stations -- */
function autoDef(key, i, el) {
  const z = 6 - i * AUTO_PITCH;
  return {
    key,
    floor: (el && el.dataset.spFloor) || pad2(i + 1),
    zh: (el && el.dataset.spZh) || '',
    en: (el && el.dataset.spEn) || '',
    pos: [0, 1.55, z],
    look: [0, 1.55, z - 10],
    fov: AUTO_FOV,
    exposure: 1,
    accent: null,
    fogNear: 14,
    fogFar: 60,
    auto: true,
  };
}

/**
 * Sections are the source of truth for order. Known keys adopt the authored
 * keyframe from stations.js; unknown keys get the deterministic auto frame
 * described by runtime-spec E10 (so any page can author stations freely).
 */
function resolveStations(sections, isHome) {
  const seen = new Set();
  return sections.map((el, i) => {
    const raw = (el.dataset.spStation || '').trim();
    const key = raw || `station-${i}`;
    let meta = STATIONS.find((s) => s.key === key) || null;
    if (!meta) {
      meta = autoDef(key, i, el);
      if (isHome) console.warn(`[space] unknown station key "${key}" on the home page — auto frame used`);
      else console.info(`[space] station "${key}" uses an auto frame`);
    } else {
      meta = {
        ...meta,
        floor: el.dataset.spFloor || meta.floor,
        zh: el.dataset.spZh || meta.zh,
        en: el.dataset.spEn || meta.en,
      };
    }
    /* unique ids so #sp-<key> deep links work even if the author forgot them */
    if (!el.id) el.id = `sp-${key}`;
    if (!el.hasAttribute('aria-label')) {
      el.setAttribute('aria-label', meta.en || meta.zh || meta.floor || key);
    }
    if (seen.has(key)) console.warn(`[space] duplicate station key "${key}" — the camera timeline will overlap`);
    seen.add(key);
    return { key, def: meta, el, index: i };
  });
}

/** Every panel needs a viewport-anchored layer: the projector emits viewport
 *  CSS px, so the layer itself must not scroll with the document. */
function layersFor(el) {
  const panels = Array.from(el.querySelectorAll('.sp-panel'));
  if (!panels.length) return { panels: [], layers: [] };
  let own = null;
  const getOwn = () => {
    if (own) return own;
    own = el.querySelector('.sp-layer');
    if (!own) {
      own = doc.createElement('div');
      own.className = 'sp-layer';
      el.appendChild(own);
    }
    return own;
  };
  const layers = new Set();
  for (const p of panels) {
    let layer = p.closest('.sp-layer');
    if (!layer || !el.contains(layer)) layer = getOwn();
    /* the projector emits viewport-space px, so the panel's containing block
       must be the layer itself (nothing positioned in between). */
    if (p.parentElement !== layer) layer.appendChild(p);
    layers.add(layer);
  }
  return { panels, layers: Array.from(layers) };
}

/* -------------------------------------------------------------- timeline -- */
/**
 * Station i owns the camera from tops[i] until the last viewport of its own
 * section (hold), then blends to i+1 over that final viewport. For the home
 * page (one 100svh section per station) hold == 0 and this is exactly the
 * smoothstep timeline from runtime-spec E3; for a tall article section the
 * camera parks beside it instead of drifting through the text.
 */
function poseAt(sy) {
  const tops = app.tops;
  const n = app.n;
  if (n <= 1) return { i: 0, t: 0 };
  let i = 0;
  while (i < n - 2 && sy >= tops[i + 1]) i++;
  const span = Math.max(1, tops[i + 1] - tops[i]);
  const tail = Math.min(span, Math.max(1, window.innerHeight));
  const holdEnd = Math.max(tops[i], tops[i + 1] - tail);
  const t = clamp((sy - holdEnd) / Math.max(1, tops[i + 1] - holdEnd), 0, 1);
  return { i, t };
}

function measure(sections) {
  app.tops = sections.map((el) => Math.round(el.getBoundingClientRect().top + window.scrollY));
  app.n = sections.length;
}

/* --------------------------------------------------------- jump (rAF tween) -- */
let jumpToken = 0;

function scrollToStation(i, smooth) {
  if (!app.n) return;
  const idx = clamp(Math.round(i), 0, app.n - 1);
  const top = app.tops[idx];
  if (top == null) return;
  if (!smooth) {
    jumpToken++; app.jumpUntil = 0; app.snapRig = true;
    window.scrollTo(0, top);
    return;
  }
  /* reduced motion: land instantly, no detent / dolly — 160 ms canvas fade */
  if (fx.reduced) {
    jumpToken++; app.jumpUntil = 0; app.snapRig = true;
    beginJumpFx();
    window.scrollTo(0, top);
    return;
  }

  const start = window.scrollY;
  const delta = top - start;
  if (Math.abs(delta) < 1) return;
  const token = ++jumpToken;
  const t0 = performance.now();
  app.jumpUntil = t0 + JUMP_MS;
  beginJumpFx();
  const step = (now) => {
    if (token !== jumpToken) return;
    const k = clamp((now - t0) / JUMP_MS, 0, 1);
    window.scrollTo(0, start + delta * easeInOutQuart(k));
    if (k < 1) requestAnimationFrame(step);
    else app.jumpUntil = 0;
  };
  requestAnimationFrame(step);
}

/* --------------------------------------------------------------- cursor -- */
/**
 * app.js extension around engine.js makeCursor():
 *   · magnetic pull toward a / button / [data-sp-magnet] (CSS `translate`
 *     composes with the engine's inline transform, so both stay smooth)
 *   · .is-hot ring state + contextual child label from data-sp-cursor
 *   · hidden entirely on coarse (touch) pointers
 */
function enhanceCursor(cursor) {
  const el = doc.querySelector('.sp-cursor');
  const coarse = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
  if (coarse || !el) {
    if (coarse) html.classList.add('sp-coarse');
    return { update: (dt) => cursor.update(dt) };
  }

  const label = doc.createElement('span');
  label.className = 'sp-cursor__label';
  label.setAttribute('aria-hidden', 'true');
  el.appendChild(label);

  let tx = window.innerWidth / 2;
  let ty = window.innerHeight / 2;
  let px = tx;
  let py = ty;
  let mx = 0;
  let my = 0;
  let hot = null;

  const magnet = (t) => (
    t && t.closest ? t.closest('a, button, [data-sp-magnet]') : null
  );

  const setHot = (t) => {
    if (t === hot) return;
    hot = t;
    el.classList.toggle('is-hot', !!t);
    if (!t) {
      el.classList.remove('has-label');
      label.textContent = '';
      return;
    }
    let txt = t.getAttribute('data-sp-cursor');
    if (!txt && t.hasAttribute('data-sp-jump')) {
      const n = parseInt(t.getAttribute('data-sp-jump'), 10);
      if (Number.isFinite(n)) txt = `JUMP ${pad2(n + 1)}`;
    }
    if (!txt) txt = 'OPEN';
    label.textContent = txt;
    el.classList.add('has-label');
  };

  window.addEventListener('pointermove', (e) => {
    tx = e.clientX;
    ty = e.clientY;
  }, { passive: true });
  doc.addEventListener('pointerover', (e) => setHot(magnet(e.target)), { passive: true });
  window.addEventListener('blur', () => setHot(null));
  doc.addEventListener('mouseleave', () => setHot(null));

  return {
    update(dt) {
      cursor.update(dt);
      px = damp(px, tx, 17, dt);
      py = damp(py, ty, 17, dt);

      let ox = 0;
      let oy = 0;
      if (hot && hot.isConnected && !hot.closest('[hidden]')) {
        const r = hot.getBoundingClientRect();
        if (r.width > 0 && r.height > 0 && r.bottom > 0 && r.top < window.innerHeight) {
          const cx = r.left + r.width * 0.5;
          const cy = r.top + r.height * 0.5;
          ox = clamp((cx - px) * 0.34, -20, 20);
          oy = clamp((cy - py) * 0.34, -16, 16);
        }
      }
      mx = damp(mx, ox, 14, dt);
      my = damp(my, oy, 14, dt);
      el.style.setProperty('--sp-mag-x', `${mx.toFixed(2)}px`);
      el.style.setProperty('--sp-mag-y', `${my.toFixed(2)}px`);
      el.classList.toggle('is-flip', tx > window.innerWidth - 190);
    },
  };
}

/* =========================================================== SPATIAL MODE == */
async function initSpatial(q, sections) {
  const canvas = doc.getElementById('sp-gl');
  if (!canvas) throw new Error('missing #sp-gl');

  const renderer = makeRenderer(canvas, q);
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x05080c, 0.016);

  const camera = new THREE.PerspectiveCamera(33, window.innerWidth / window.innerHeight, 0.08, 420);
  const rig = new CameraRig(camera);
  rig.reduced = !!q.reduced;
  fx.reduced = !!q.reduced;
  app.snapRig = !!q.reduced;   // boot straight onto station 01, no dolly
  app.onJumpImpulse = () => { if (!q.reduced) rig.impulse(0.8); };

  const mirror = makeMirrorFloor(renderer, scene, camera, {
    width: 160,
    depth: 400,
    y: 0,
    resScale: q.mirrorScale || 0.4,
    gridStep: 1.5,
  });
  scene.add(mirror.mesh);

  const post = makePostChain(renderer, q);
  post.setSize(window.innerWidth, window.innerHeight, renderer.getPixelRatio());

  const projector = new DomProjector(camera);

  /* --- from here on the document is a 3D space ---------------------------- */
  html.classList.remove('sp-flat');
  html.classList.remove('sp-ambient');

  const built = resolveStations(sections, isHomePage());
  const entries = [];
  const panelEls = [];
  const panelRecs = [];

  built.forEach((b, i) => {
    const fr = stationFrame(b.def);
    const root = new THREE.Object3D();
    root.name = `station:${b.key}`;
    root.position.copy(fr.origin);
    root.quaternion.setFromRotationMatrix(fr.basis);
    root.scale.setScalar(unitsPerPixel(b.def.fov, window.innerHeight) * compScaleFor());
    scene.add(root);

    b.frame = fr;
    b.root = root;
    b.pos = fr.pos.clone();
    b.look = fr.look.clone();
    b.fov = b.def.fov;
    b.exposure = num(b.def.exposure, 1);

    const { panels, layers } = layersFor(b.el);
    layers.forEach((l) => {
      l.style.position = 'fixed';
      l.style.inset = '0';
      l.style.zIndex = '3';
    });

    let fallbackOrder = 0;
    panels.forEach((el) => {
      const [x, y, z] = triple(el.dataset.spPos, [0, 0, 0]);
      const [rx, ry, rz] = triple(el.dataset.spRot, [0, 0, 0]);
      const a = ANCHORS[(el.dataset.spAnchor || 'lt').toLowerCase()] || ANCHORS.lt;

      const anchor = new THREE.Object3D();
      anchor.name = `panel:${b.key}:${el.dataset.spSlot || 'x'}`;
      anchor.position.set(x, y, -z);           // +z in markup = toward the camera
      anchor.rotation.set(rx * DEG, ry * DEG, rz * DEG);
      root.add(anchor);

      el.style.position = 'absolute';
      el.style.left = '0';
      el.style.top = '0';

      const rawOrder = el.dataset.spOrder;
      const order = rawOrder != null && rawOrder !== '' ? num(rawOrder, 0) : fallbackOrder++;
      const entry = projector.add(el, anchor, { anchorX: a[0], anchorY: a[1], order });
      entry.maxOpacity = 0;                    // revealed by the stagger below
      /* stagger is clamped: last panel starts <=140 ms after the first and the
         whole ramp is <=300 ms, so a dense page never fades in for a second */
      entry.revealAt = 0.04 + Math.min(order * 0.035, 0.14);
      if (el.dataset.spPin === '1') entry.fadeFar = 46;
      entries.push(entry);
      panelEls.push(el);
      panelRecs.push({ el, anchor, ax: a[0], ay: a[1], station: b, root, baseX: x, baseY: y });
    });
  });

  /* reduced motion: panels are present from the first frame (no opacity ramp) */
  if (q.reduced) {
    for (let e = 0; e < entries.length; e++) entries[e].maxOpacity = 1;
  }

  /* --- physical panel bodies (OPT-IN: data-sp-slab="glass"|"ink") --------- */
  const bodyGroup = new THREE.Group();
  bodyGroup.name = 'panel-bodies';
  scene.add(bodyGroup);
  const slabMats = {
    glass: makeSlabMaterial('glass'),
    ink: makeSlabMaterial('ink'),
  };
  const edgeMatHero = makeEdgeMaterial(0.55);     // structural edges
  const edgeMatContact = makeEdgeMaterial(0.85);  // floor-contact line only
  let bodyGeos = [];

  const disposeBodies = () => {
    for (const g of bodyGeos) { try { g.dispose(); } catch (e) {} }
    bodyGeos = [];
    while (bodyGroup.children.length) bodyGroup.remove(bodyGroup.children[0]);
  };

  /* text plane parallax: bodies bake at rest, so clear any pointer offset */
  const resetAnchorOffsets = () => {
    for (let i = 0; i < panelRecs.length; i++) {
      const r = panelRecs[i];
      r.anchor.position.x = r.baseX;
      r.anchor.position.y = r.baseY;
    }
  };

  let bodyTimer = 0;
  const buildBodies = () => {
    disposeBodies();
    if (!BODIES_ON) return;   // master switch off -> pure floating text
    
    /* bodies are baked at rest: clear the pointer offset so it is not baked in */
    resetAnchorOffsets();
    for (const rec of panelRecs) {
      const domGlass = rec.el.querySelector(':scope > .sp-glass');
      const wpx = rec.el.offsetWidth || 0;
      const hpx = rec.el.offsetHeight || 0;
      /* OPT-IN ONLY: no attribute → pure floating text (no fill, no edge). */
      const declared = (rec.el.dataset.spSlab || '').toLowerCase();
      const kind = declared === 'ink' ? 'ink' : declared === 'glass' ? 'glass' : '';
      if (!kind) {
        if (domGlass) domGlass.style.display = '';   // no body → keep the DOM glass
        continue;
      }
      /* the 3D body IS the glass now: a second DOM card would read as a UI frame */
      if (domGlass) domGlass.style.display = 'none';
      if (wpx < 8 || hpx < 8) continue;

      const u = rec.root.scale.x;
      rec.root.updateMatrixWorld(true);
      const pos = new THREE.Vector3();
      const quat = new THREE.Quaternion();
      const scl = new THREE.Vector3();
      rec.anchor.matrixWorld.decompose(pos, quat, scl);
      const fwd = new THREE.Vector3(0, 0, 1).applyQuaternion(quat);  // deeper, away from the eye

      const cx = (0.5 - rec.ax) * wpx;
      const cy = (0.5 - rec.ay) * hpx;
      const bw = (wpx + 2 * SLAB.pad) * u;
      const bh = (hpx + 2 * SLAB.pad) * u;
      const hero = kind === 'glass';

      /* body front face 6 cm behind the text plane */
      const center = rec.anchor.localToWorld(new THREE.Vector3(cx, cy, 0))
        .addScaledVector(fwd, SLAB.bodyZ + SLAB.thick / 2);

      const geo = new THREE.BoxGeometry(bw, bh, SLAB.thick);
      bodyGeos.push(geo);
      const body = new THREE.Mesh(geo, slabMats[kind]);
      body.position.copy(center);
      body.quaternion.copy(quat);
      body.userData.panel = rec.el;
      body.renderOrder = 2;
      body.matrixAutoUpdate = false;
      body.updateMatrix();
      bodyGroup.add(body);

      /* edge hierarchy: glass gets structural edges, ink gets none */
      if (hero) {
        const eg = new THREE.EdgesGeometry(geo);
        bodyGeos.push(eg);
        const line = new THREE.LineSegments(eg, edgeMatHero);
        line.position.copy(center);
        line.quaternion.copy(quat);
        line.renderOrder = 3;
        line.matrixAutoUpdate = false;
        line.updateMatrix();
        bodyGroup.add(line);
      }

      /* plinth: explicit only, pushed 22 cm behind the panel for parallax */
      if (rec.el.dataset.spPlinth !== '1') continue;
      const bottom = rec.anchor.localToWorld(
        new THREE.Vector3(cx, (1 - rec.ay) * hpx + SLAB.pad, 0)
      ).addScaledVector(fwd, SLAB.plinthZ + SLAB.thick / 2);
      const h = Math.min(SLAB.maxPlinth, Math.max(0, bottom.y - SLAB.gap));
      if (h <= 0.06) continue;

      const pg = new THREE.BoxGeometry(bw, h, SLAB.thick);
      bodyGeos.push(pg);
      const plinth = new THREE.Mesh(pg, slabMats[kind]);
      plinth.position.copy(bottom);
      plinth.position.y -= h / 2;
      plinth.quaternion.copy(quat);
      plinth.userData.panel = rec.el;
      plinth.renderOrder = 2;
      plinth.matrixAutoUpdate = false;
      plinth.updateMatrix();
      bodyGroup.add(plinth);

      if (hero) {
        const pe = new THREE.EdgesGeometry(pg);
        bodyGeos.push(pe);
        const pl = new THREE.LineSegments(pe, edgeMatHero);
        pl.position.copy(plinth.position);
        pl.quaternion.copy(quat);
        pl.renderOrder = 3;
        pl.matrixAutoUpdate = false;
        pl.updateMatrix();
        bodyGroup.add(pl);

        /* the contact line where the blade meets the floor */
        const cb = bottomEdges(pg);
        bodyGeos.push(cb);
        const cl = new THREE.LineSegments(cb, edgeMatContact);
        cl.position.copy(plinth.position);
        cl.quaternion.copy(quat);
        cl.renderOrder = 3;
        cl.matrixAutoUpdate = false;
        cl.updateMatrix();
        bodyGroup.add(cl);
      }
    }
  };

  /** bodies are static; only layout changes force a rebuild */
  const scheduleBodies = (delay) => {
    clearTimeout(bodyTimer);
    bodyTimer = setTimeout(() => requestAnimationFrame(buildBodies), delay == null ? 80 : delay);
  };

  buildBodies();

  /**
   * QA: prove the body map. Projects each body box's 8 corners to screen and
   * compares with the live panel rect. A correct body is panel ± SLAB.pad.
   * Needs ?bodies=1 (or BODIES = true) to return anything.
   */
  app.bodyCheck = () => {
    const out = [];
    const v = new THREE.Vector3();
    const box = new THREE.Box3();
    for (const obj of bodyGroup.children) {
      const el = obj.userData.panel;
      if (!el) continue;
      box.setFromObject(obj);
      let x0 = Infinity; let y0 = Infinity; let x1 = -Infinity; let y1 = -Infinity;
      for (let i = 0; i < 8; i++) {
        v.set(i & 1 ? box.max.x : box.min.x, i & 2 ? box.max.y : box.min.y, i & 4 ? box.max.z : box.min.z);
        v.project(camera);
        const sx = (v.x * 0.5 + 0.5) * window.innerWidth;
        const sy = (-v.y * 0.5 + 0.5) * window.innerHeight;
        if (sx < x0) x0 = sx; if (sx > x1) x1 = sx;
        if (sy < y0) y0 = sy; if (sy > y1) y1 = sy;
      }
      const pr = el.getBoundingClientRect();
      out.push({
        slot: el.dataset.spSlot || '',
        kind: el.dataset.spSlab || '',
        panel: [Math.round(pr.x), Math.round(pr.y), Math.round(pr.width), Math.round(pr.height)],
        body: [Math.round(x0), Math.round(y0), Math.round(x1 - x0), Math.round(y1 - y0)],
      });
    }
    return out;
  };

  /* --- HUD: floor rail, totals, input ------------------------------------ */
  buildRail(built);
  const input = new SpaceInput({ stationCount: built.length, onJump: (i) => { if (i != null) scrollToStation(i, true); } });
  const cursor = makeCursor();
  const cursorFx = enhanceCursor(cursor);
  const mapCanvas = doc.getElementById('sp-map');

  app.n = built.length;
  measure(sections);
  app.go = (i) => scrollToStation(i, true);
  app.dispose = () => {
    try { renderer.dispose(); } catch (e) {}
  };

  /* deep links: ?sp=N (1-based) and #sp-<key> */
  applyDeepLink(built);

  /* --- soft magnetic detent -------------------------------------------------
     Native scrolling is untouched (no preventDefault, no scroll-snap). After a
     short quiet period a critically-damped spring pulls the page onto the exact
     rest position of the nearest station — unless the visitor deliberately
     parked halfway between two.
  */
  /* omega tuned to land the 450–650 ms glide target: critically damped shape
     (zeta = 0.92, never overshoots) but stiff enough to settle in ~0.6 s. */
  const DETENT_K = 220;
  const DETENT_C = 2 * Math.sqrt(220) * 0.92;  // slightly overdamped = "soft"
  let lastInputAt = performance.now();
  let detent = null;

  const noteInput = () => {
    lastInputAt = performance.now();
    detent = null;      // any input cancels a running detent
    jumpToken++;        // ... and an in-flight rail/key tween
    app.jumpUntil = 0;  // let rest detection see a deliberate stop again
  };
  ['wheel', 'touchstart', 'touchmove', 'pointerdown'].forEach((ev) => {
    window.addEventListener(ev, noteInput, { passive: true });
  });
  window.addEventListener('keydown', (e) => {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    if (/^(Arrow|Page|Home|End|j|k|[1-9])$/.test(e.key)) noteInput();
  }, { passive: true });

  app.detentState = () => ({
    active: !!detent,
    target: detent ? Math.round(detent.target) : null,
    quietFor: Math.round(performance.now() - lastInputAt),
  });

  /* --- keyboard: capture phase so SpaceInput's own key map never fights us -- */
  window.addEventListener('keydown', (e) => {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    const tag = (e.target && e.target.tagName) || '';
    if (/INPUT|TEXTAREA|SELECT/.test(tag) || (e.target && e.target.isContentEditable)) return;
    const { i, t } = poseAt(window.scrollY);
    const last = built.length - 1;
    let to = -1;
    switch (e.key) {
      case 'ArrowDown': case 'j': case 'PageDown': to = Math.min(last, i + 1); break;
      case 'ArrowUp': case 'k': case 'PageUp': to = t > 0.2 ? i : Math.max(0, i - 1); break;
      case 'Home': to = 0; break;
      case 'End': to = last; break;
      default: {
        const n = parseInt(e.key, 10);
        if (n >= 1 && n <= built.length) to = n - 1;
      }
    }
    if (to < 0) return;
    e.preventDefault();
    e.stopImmediatePropagation();
    scrollToStation(to, true);
  }, true);

  /* rail buttons + any [data-sp-jump] element */
  doc.addEventListener('click', (e) => {
    const btn = e.target && e.target.closest ? e.target.closest('[data-sp-jump]') : null;
    if (!btn) return;
    const i = parseInt(btn.getAttribute('data-sp-jump'), 10);
    if (Number.isFinite(i)) { e.preventDefault(); scrollToStation(i, true); }
  });

  /* in-page deep links (#sp-<key>) get the same blade wipe as a rail jump */
  const hashToStation = () => {
    const hash = location.hash;
    if (!hash || hash.indexOf('#sp-') !== 0) return;
    const idx = built.findIndex((b) => b.key === hash.slice(4));
    if (idx >= 0) scrollToStation(idx, true);
  };
  window.addEventListener('hashchange', hashToStation);

  /* language: panel metrics change, so re-project + re-mill the bodies */
  doc.addEventListener('sp:lang', () => {
    requestAnimationFrame(() => {
      projector.update(window.innerWidth, window.innerHeight);
      scheduleBodies(180);
    });
  });

  /* --- scenes.js (owned by the scene agent, optional) -------------------- */
  let scenes = null;
  try {
    const mod = await import('./scenes.js');
    if (mod && typeof mod.buildScenes === 'function') {
      scenes = mod.buildScenes({
        THREE, scene, renderer, camera, quality: q, ambient: false, mirror,
        stations: built.map((b) => ({ key: b.key, def: b.def, frame: b.frame, root: b.root, el: b.el })),
      });
    }
  } catch (err) {
    console.info('[space] scenes.js unavailable — running without architecture');
  }

  /* --- station choreography (direction-v3 §5.3) --------------------------
     A station becomes "active" only at rest: after a rail/key jump tween has
     landed, after the detent settles, or at load. Flying through intermediate
     floors must never fire sp:station or re-run the reveal. */
  const REST_EPS = 3;                       // CSS px around a station top
  const enteredStations = new Set();
  const revealTimers = [];
  let activeIdx = -1;
  let focusedKey = null;

  const emit = (name, detail) => {
    try {
      doc.dispatchEvent(new CustomEvent(name, { detail, bubbles: true, cancelable: false }));
    } catch (e) { /* CustomEvent unsupported: no consumer can exist either */ }
  };

  const sceneFocus = (key) => {
    if (scenes && typeof scenes.focus === 'function') {
      try { scenes.focus(key); } catch (e) { /* scene focus is optional */ }
    }
  };

  const setFocusKey = (key) => {
    key = key || null;
    if (key === focusedKey) return;
    focusedKey = key;
    sceneFocus(key);
    if (key) emit('sp:focus', { key });
  };

  /** first entry: clip/translate reveal (CSS) + counters, then the event */
  const enterStation = (idx) => {
    if (idx < 0 || idx >= built.length) return;
    activeIdx = idx;
    app.active = idx;
    const station = built[idx];
    for (let s = 0; s < built.length; s++) {
      built[s].el.classList.toggle('is-live', s === idx);
    }
    focusedKey = null;
    sceneFocus(null);
    if (!enteredStations.has(idx)) {
      enteredStations.add(idx);
      const panels = station.el.querySelectorAll('.sp-panel');
      for (let p = 0; p < panels.length; p++) {
        const el = panels[p];
        if (q.reduced) { el.classList.add('is-in'); continue; }
        /* the class only: CSS animates clip-path/translate on the panel.
           The projector keeps writing inline opacity every frame. */
        revealTimers.push(setTimeout(() => el.classList.add('is-in'), p * STAGGER_MS));
      }
      animateCounters(station.el, !!q.reduced);
    }
    emit('sp:station', { i: idx, key: station.key });
  };

  /* row hover / focus / expand → scenes.focus + sp:focus (direction-v3 §5.3) */
  const focusTarget = (e) => (
    e.target && e.target.closest ? e.target.closest('[data-sp-focus]') : null
  );
  doc.addEventListener('pointerover', (e) => {
    const t = focusTarget(e);
    if (t) setFocusKey(t.getAttribute('data-sp-focus'));
  }, { passive: true });
  doc.addEventListener('pointerout', (e) => {
    const t = focusTarget(e);
    if (!t) return;
    const to = e.relatedTarget;
    if (to && t.contains(to)) return;
    setFocusKey(null);
  }, { passive: true });
  doc.addEventListener('focusin', (e) => {
    const t = focusTarget(e);
    if (t) setFocusKey(t.getAttribute('data-sp-focus'));
  });
  doc.addEventListener('focusout', (e) => {
    const t = focusTarget(e);
    if (t) setFocusKey(null);
  });
  doc.addEventListener('click', (e) => {
    const t = focusTarget(e);
    if (t) setFocusKey(t.getAttribute('data-sp-focus'));
  });

  /* --- resize ----------------------------------------------------------- */
  let resizeTimer = 0;
  const onResize = () => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const pr = renderer.getPixelRatio();
    renderer.setSize(w, h, false);
    post.setSize(w, h, pr);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    const csNow = compScaleFor();
    built.forEach((b) => b.root.scale.setScalar(unitsPerPixel(b.def.fov, h) * csNow));
    measure(sections);
    if (scenes && typeof scenes.resize === 'function') {
      try { scenes.resize(w, h, pr); } catch (e) {}
    }
    projector.update(w, h);
    scheduleBodies(120);
  };
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(onResize, 120);
  });

  /* --- frame loop ------------------------------------------------------- */
  let last = performance.now();
  let time = 0;
  let lastScroll = window.scrollY;
  let vel = 0;
  let hudTick = 0;
  let mapTick = 0;
  let disposed = false;

  const dts = new Float32Array(30);
  let dtHead = 0;
  let dtCount = 0;
  let fpsAcc = 0;

  const _pos = new THREE.Vector3();
  const _look = new THREE.Vector3();
  const _camPos = new THREE.Vector3();

  const tick = (now) => {
    if (disposed) return;
    app.raf = requestAnimationFrame(tick);
    const raw = (now - last) / 1000;
    last = now;
    const dt = Math.min(0.05, Math.max(0.0001, raw));
    time += dt;

    /* jump FX timers are wall-clock: a hidden tab resumes settled, never mid-wipe */
    let wipe = 0;
    let fade = 0;
    if (fx.wipeStart >= 0) {
      const age = now - fx.wipeStart;
      if (age >= WIPE_MS) fx.wipeStart = -1;
      else wipe = easeInOutCubic(age / WIPE_MS);
    }
    if (fx.fadeStart >= 0) {
      const age = now - fx.fadeStart;
      if (age >= FADE_MS) { fx.fadeStart = -1; fade = 0; }
      else if (fx.fadeReveal) fade = 1 - easeOutCubic(clamp(age / FADE_MS, 0, 1));
      else fade = Math.sin(Math.PI * clamp(age / FADE_MS, 0, 1));
    }
    app.wipe = wipe;

    const w = window.innerWidth;
    const h = window.innerHeight;

    /* detent first: it can move scrollY this frame, and the pose must see it */
    if (!q.reduced) {
      const maxScroll = Math.max(0, doc.documentElement.scrollHeight - h);
      if (detent) {
        const step = Math.min(0.033, dt);
        const acc = -DETENT_K * (detent.x - detent.target) - DETENT_C * detent.v;
        detent.v += acc * step;
        detent.x = clamp(detent.x + detent.v * step, 0, maxScroll);
        window.scrollTo(0, detent.x);
        const timeout = performance.now() - detent.t0 > 850;
        if (timeout || (Math.abs(detent.x - detent.target) < 0.4 && Math.abs(detent.v) < 3)) {
          window.scrollTo(0, detent.target);
          detent = null;
        }
      } else if (performance.now() - lastInputAt > 240 && Math.abs(vel) < 0.35) {
        const hh = Math.max(1, window.innerHeight);
        const nearest = clamp(Math.round(window.scrollY / hh), 0, built.length - 1);
        const rest = app.tops[nearest] != null ? app.tops[nearest] : nearest * hh;
        const target = clamp(rest, 0, maxScroll);
        const d = Math.abs(window.scrollY - target) / hh;
        const sel = doc.getSelection ? String(doc.getSelection() || '') : '';
        if (d > 0.035 && d < 0.40 && !sel) {
          detent = { x: window.scrollY, v: 0, target, t0: performance.now() };
        }
      }
    }

    const sy = window.scrollY;

    /* station rest detection — only when the scroll is genuinely parked */
    if (!detent && now >= (app.jumpUntil || 0)) {
      let rest = -1;
      let best = REST_EPS;
      for (let s = 0; s < built.length; s++) {
        const top = app.tops[s];
        if (top == null) continue;
        const d = Math.abs(sy - top);
        if (d < best) { best = d; rest = s; }
      }
      if (rest >= 0 && rest !== activeIdx) enterStation(rest);
    }

    /* 1 · scroll → timeline → damped camera ------------------------------- */
    const { i, t } = poseAt(sy);
    const n = built.length;
    const A = built[i];
    const B = built[Math.min(i + 1, n - 1)];
    const k = smoothstep(0, 1, t);

    const instV = (sy - lastScroll) / (dt * Math.max(1, h));
    lastScroll = sy;
    vel = damp(vel, clamp(instV, -1, 1), 5.5, dt);
    const speedKick = q.reduced ? 0 : clamp(Math.abs(vel) * 1.6, 0, 3.2);

    _pos.set(lerp(A.pos.x, B.pos.x, k), lerp(A.pos.y, B.pos.y, k), lerp(A.pos.z, B.pos.z, k));
    _look.set(lerp(A.look.x, B.look.x, k), lerp(A.look.y, B.look.y, k), lerp(A.look.z, B.look.z, k));

    /* one-shot curved flight: the segment LEAVING station A owns the arc.
       sin(pi·k) is 0 at both stations, so the rest poses stay exact. */
    const arcK = Math.sin(Math.PI * k);
    let bank = 0;
    if (arcK > 0 && A.def) {
      const arc = A.def.arc;
      const lookArc = A.def.lookArc;
      if (arc) {
        _pos.x += arc[0] * arcK;
        _pos.y += arc[1] * arcK;
        _pos.z += arc[2] * arcK;
      }
      if (lookArc) {
        _look.x += lookArc[0] * arcK;
        _look.y += lookArc[1] * arcK;
        _look.z += lookArc[2] * arcK;
      }
      bank = num(A.def.bank, 0) * arcK;
    }

    const fovTarget = lerp(A.fov, B.fov, k) + speedKick;
    rig.setPose({ pos: _pos, look: _look, fov: fovTarget, roll: bank });
    /* pointer parallax is a garnish, not a pan: keep it inside the safe area.
       reduced motion: no parallax at all. */
    rig.pointer.x = q.reduced ? 0 : input.pointer.x * 0.3;
    rig.pointer.y = q.reduced ? 0 : input.pointer.y * 0.3;
    /* reduced motion: instant jumps land the camera in the same frame */
    if (q.reduced && app.snapRig) {
      rig.cur.pos.copy(_pos);
      rig.cur.look.copy(_look);
      rig.cur.fov = fovTarget;
      camera.fov = fovTarget;
      camera.updateProjectionMatrix();
      app.snapRig = false;
    }
    /* piloted, not lerped: stiffer damping mid-swoop, calm at the stations */
    rig.update(dt, { lambda: 7 + 2 * arcK });

    /* pointer depth offset: text parallaxes inside its own body.
       prefers-reduced-motion kills it (accessibility, not decoration). */
    const pdx = q.reduced ? 0 : input.pointer.x * 8;
    const pdy = q.reduced ? 0 : input.pointer.y * 6;
    for (let r = 0; r < panelRecs.length; r++) {
      const rec = panelRecs[r];
      rec.anchor.position.x = rec.baseX + pdx;
      rec.anchor.position.y = rec.baseY + pdy;
    }

    /* 2 · matrix refresh before anything consumes the camera --------------- */
    camera.updateMatrixWorld(true);
    camera.matrixWorldInverse.copy(camera.matrixWorld).invert();

    /* 3 · planar reflection (half res) ------------------------------------ */
    mirror.uniforms.uTime.value = time;
    mirror.uniforms.uCam.value.copy(camera.position);
    slabMats.glass.uniforms.uCam.value.copy(camera.position);
    slabMats.ink.uniforms.uCam.value.copy(camera.position);
    edgeMatHero.uniforms.uCam.value.copy(camera.position);
    edgeMatContact.uniforms.uCam.value.copy(camera.position);
    try { mirror.update(scene, camera); } catch (e) {
      if (!mirrorWarned) {
        mirrorWarned = true;
        console.warn('[space] mirror reflection pass threw ::', e && e.message, e && e.stack);
      }
    }

    /* 4 · post chain ------------------------------------------------------ */
    const exposure = lerp(A.exposure, B.exposure, k);
    const revealK = q.reduced ? 1 : easeOutCubic(clamp(time / (REVEAL_MS / 1000), 0, 1));
    post.render(scene, camera, {
      time,
      velocity: vel,
      exposure,
      reveal: revealK,
      fade,
      wipe,
      field: 0.55,
      station: i + t,
    });

    /* 5 · DOM projection (after the camera moved) ------------------------- */
    if (!q.reduced) {
      for (let e = 0; e < entries.length; e++) {
        const entry = entries[e];
        if (time >= entry.revealAt) {
          const rp = clamp((time - entry.revealAt) / 0.16, 0, 1);
          entry.maxOpacity = rp * rp * (3 - 2 * rp);
        }
      }
    }
    projector.update(w, h);

    /* A panel in the ACTIVE station is never faded out by absolute distance:
       a big +z panel can cross the eye plane mid-arc (camZ > -0.2 => o = 0) and
       blink to visibility:hidden, which also drops it out of the Tab order.
       Only skip panels that are genuinely behind the camera. */
    const prog = i + t;
    for (let k = 0; k < panelRecs.length; k++) {
      const rec = panelRecs[k];
      if (!rec.station || Math.abs(prog - rec.station.index) > 0.5) continue;
      const el = rec.el;
      const full = entries[k] ? entries[k].maxOpacity : 1;
      if (!el._spHidden) { el.style.opacity = String(full); continue; }
      _camPos.setFromMatrixPosition(rec.anchor.matrixWorld).applyMatrix4(camera.matrixWorldInverse);
      if (_camPos.z < -0.6) {
        el.style.visibility = '';
        el.style.opacity = String(full);
        el._spHidden = false;
      }
    }

    if (!html.classList.contains('sp-no-lock')) {
      const dpr = window.devicePixelRatio || 1;
      for (let e = 0; e < panelEls.length; e++) {
        const el = panelEls[e];
        if (el._spHidden) continue;
        pixelLock(el, dpr);
      }
    }

    /* 6 · HUD ------------------------------------------------------------- */
    const progress = n > 1 ? clamp((i + t) / (n - 1), 0, 1) : 0;
    /* poseAt() clamps i to n-2 on the final segment; the public index is the
       station actually on screen, so 07 reports 6 at t=1 (QA contract). */
    app.index = clamp(Math.round(i + t), 0, n - 1);
    app.t = t;
    app.progress = progress;
    if ((hudTick++ % 3) === 0) {
      updateHud(i, t, progress, camera);
      if ((mapTick++ % 2) === 0) drawMap(mapCanvas, built, Math.round(i + t), camera.position);
    }

    /* 7 · fps (30 frame average) + input ---------------------------------- */
    dts[dtHead] = raw;
    dtHead = (dtHead + 1) % dts.length;
    if (dtCount < dts.length) dtCount++;
    fpsAcc += raw;
    if (fpsAcc >= 0.5) {
      let sum = 0;
      for (let d = 0; d < dtCount; d++) sum += dts[d];
      app.fps = Math.round(dtCount / Math.max(0.0001, sum));
      const fpsEl = doc.getElementById('sp-fps');
      if (fpsEl) fpsEl.textContent = String(app.fps);
      fpsAcc = 0;
    }

    cursorFx.update(dt);
    input.update(dt);

    if (scenes && typeof scenes.update === 'function') {
      try {
        scenes.update(time, dt, camera, {
          velocity: vel, station: i + t, t: time, reduced: !!q.reduced,
        });
      } catch (e) { scenes = null; }
    }
  };

  let mirrorWarned = false;

  const onVisibility = () => {
    if (doc.hidden) {
      if (app.raf) { cancelAnimationFrame(app.raf); app.raf = 0; }
    } else if (!app.raf && !disposed) {
      last = performance.now();
      app.raf = requestAnimationFrame(tick);
    }
  };
  doc.addEventListener('visibilitychange', onVisibility);

  app.dispose = () => {
    disposed = true;
    if (app.raf) { cancelAnimationFrame(app.raf); app.raf = 0; }
    doc.removeEventListener('visibilitychange', onVisibility);
    for (let r = 0; r < revealTimers.length; r++) clearTimeout(revealTimers[r]);
    revealTimers.length = 0;
    clearTimeout(bodyTimer);
    disposeBodies();
    app.onJumpImpulse = null;
    try { if (scenes && typeof scenes.dispose === 'function') scenes.dispose(); } catch (e) {}
    try { renderer.dispose(); } catch (e) {}
  };

  /**
   * QA hook: snap the rig to the exact station pose (no drift, no parallax) and
   * report the effective CSS-px-per-panel-px of every panel. At rest the
   * content plane must come out at exactly 1.000 — that IS the crispness proof.
   */
  app.calibrate = (idx) => {
    const i = clamp(Math.round(idx == null ? app.index : idx), 0, built.length - 1);
    const A = built[i];
    rig.reduced = true;
    rig.pointer.x = 0; rig.pointer.y = 0;
    rig.pointerSmooth.x = 0; rig.pointerSmooth.y = 0;
    rig.pose.pos.copy(A.pos); rig.pose.look.copy(A.look); rig.pose.fov = A.fov;
    rig.cur.pos.copy(A.pos); rig.cur.look.copy(A.look); rig.cur.fov = A.fov;
    camera.fov = A.fov;
    camera.updateProjectionMatrix();
    rig.update(1 / 60);
    camera.updateMatrixWorld(true);
    camera.matrixWorldInverse.copy(camera.matrixWorld).invert();
    projector.update(window.innerWidth, window.innerHeight);
    for (let p = 0; p < panelEls.length; p++) pixelLock(panelEls[p], window.devicePixelRatio || 1);
    const cs = compScaleFor();
    return panelEls.map((el) => {
      const v = el.style.transform.slice(9, -1).split(',').map(Number);
      const w0 = v[15] || 1;
      return {
        station: el.closest('[data-sp-station]').dataset.spStation,
        slot: el.dataset.spSlot || '',
        box: [el.offsetWidth, el.offsetHeight],
        scale: [+(v[0] / w0).toFixed(5), +(v[5] / w0).toFixed(5)],
        at: [+(v[12] / w0).toFixed(2), +(v[13] / w0).toFixed(2)],
        ok: Math.abs(v[0] / w0 - cs) < 0.02 * cs && Math.abs(v[5] / w0 - cs) < 0.02 * cs,
        compScale: +cs.toFixed(4),
      };
    });
  };

  app.mode = 'spatial';
  app.started = true;
  html.classList.add('sp-ready');
  app.rebuildBodies = () => { buildBodies(); };

  setBootProgress(0.55);
  last = performance.now();
  app.raf = requestAnimationFrame(tick);
  await finishBoot();
  /* webfonts settle after the first paint: re-mill the bodies with final boxes */
  scheduleBodies(0);
}

/* ========================================================== DOCUMENT MODE == */
/**
 * Long-form reading pages (posts, 404, offline) opt in with
 * `<body data-sp-mode="ambient">`. The page stays a normal scrollable document
 * (`.sp-flat`), #sp-gl becomes a fixed backdrop, and the camera dollies along
 * the first three station poses driven by document scroll progress — no DOM
 * projection, no rail, no per-station maths. Grade is deliberately darker so
 * prose stays the brightest thing on screen.
 */
async function initDocument(q) {
  const canvas = doc.getElementById('sp-gl');
  if (!canvas) throw new Error('missing #sp-gl');

  const quality = { ...q, antialias: q.tier >= 3, maxDpr: 1.25 };
  const renderer = makeRenderer(canvas, quality);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.25));
  renderer.setSize(window.innerWidth, window.innerHeight, false);

  html.classList.add('sp-flat', 'sp-ambient');

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x05080c, 0.017);
  const camera = new THREE.PerspectiveCamera(36, window.innerWidth / window.innerHeight, 0.08, 400);
  const rig = new CameraRig(camera);
  rig.reduced = !!q.reduced;

  /* Document mode: no planar reflection. The reading lane scrim sits at
     0.84–0.97 over the canvas, so a half-res mirror would be a wasted full
     scene pass per frame; the backdrop only needs depth silhouettes. */
  const post = makePostChain(renderer, q);
  post.setSize(window.innerWidth, window.innerHeight, renderer.getPixelRatio());

  /* architecture from scenes.js (optional) */
  const sections = Array.from(doc.querySelectorAll('[data-sp-station]'));
  const built = resolveStations(sections, isHomePage()).map((b) => ({
    key: b.key,
    def: b.def,
    frame: stationFrame(b.def),
    root: new THREE.Object3D(),
    el: b.el,
  }));

  let scenes = null;
  try {
    const mod = await import('./scenes.js');
    if (mod && typeof mod.buildScenes === 'function') {
      scenes = mod.buildScenes({
        THREE, scene, renderer, camera, quality: q, ambient: true, stations: built,
      });
    }
  } catch (err) {
    console.info('[space] scenes.js unavailable — document backdrop only');
  }

  /* camera path: the first three authored poses (falls back to one long drift) */
  const src = STATIONS.length >= 2 ? STATIONS.slice(0, Math.min(3, STATIONS.length)) : STATIONS;
  const path = src.map((s) => ({
    pos: new THREE.Vector3().fromArray(s.pos),
    look: new THREE.Vector3().fromArray(s.look),
  }));
  if (path.length === 1) {
    path.push({ pos: path[0].pos.clone().setZ(path[0].pos.z - 46), look: path[0].look.clone().setZ(path[0].look.z - 46) });
  }

  let last = performance.now();
  let time = 0;
  let disposed = false;
  let vel = 0;
  let lastScroll = window.scrollY;
  const _p = new THREE.Vector3();
  const _l = new THREE.Vector3();

  const progressOf = () => {
    const max = Math.max(1, doc.documentElement.scrollHeight - window.innerHeight);
    return clamp(window.scrollY / max, 0, 1);
  };

  const onResize = () => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    renderer.setSize(w, h, false);
    post.setSize(w, h, renderer.getPixelRatio());
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    if (scenes && typeof scenes.resize === 'function') {
      try { scenes.resize(w, h, renderer.getPixelRatio()); } catch (e) {}
    }
  };
  window.addEventListener('resize', onResize);

  const tick = (now) => {
    if (disposed) return;
    app.raf = requestAnimationFrame(tick);
    const raw = (now - last) / 1000;
    /* 45fps ceiling: this is a reading surface, not a demo reel */
    if (raw < 1 / 48) return;
    last = now;
    const dt = Math.min(0.06, Math.max(0.001, raw));
    time += dt;

    const sy = window.scrollY;
    const t = progressOf();
    vel = damp(vel, clamp((sy - lastScroll) / (dt * Math.max(1, window.innerHeight)), -1, 1), 4, dt);
    lastScroll = sy;

    const u = t * (path.length - 1);
    const i = Math.min(Math.floor(u), path.length - 2);
    const f = u - i;
    _p.lerpVectors(path[i].pos, path[i + 1].pos, f);
    _l.lerpVectors(path[i].look, path[i + 1].look, f);
    rig.setPose({ pos: _p, look: _l, fov: 36, roll: 0 });
    rig.pointer.x = 0;
    rig.pointer.y = 0;
    rig.update(dt, { lambda: 4.5 });

    camera.updateMatrixWorld(true);
    camera.matrixWorldInverse.copy(camera.matrixWorld).invert();

    post.render(scene, camera, {
      time,
      velocity: vel * 0.5,
      exposure: 0.72,
      reveal: 1,
      fade: 0,
      threshold: 1.05,
    });

    app.progress = t;
    app.t = t;
    app.index = Math.round(t * Math.max(0, built.length - 1));
    app.fps = Math.round(1 / Math.max(0.0001, dt));

    if (scenes && typeof scenes.update === 'function') {
      try { scenes.update(time, dt, camera); } catch (e) { scenes = null; }
    }
  };

  app.mode = 'document';
  app.n = built.length;
  app.tops = sections.map((el) => Math.round(el.getBoundingClientRect().top + window.scrollY));
  app.started = true;
  app.go = (i) => {
    const idx = Math.round(i);
    if (sections[idx]) {
      window.scrollTo(0, Math.round(sections[idx].getBoundingClientRect().top + window.scrollY));
      return;
    }
    const max = Math.max(1, doc.documentElement.scrollHeight - window.innerHeight);
    window.scrollTo(0, Math.round(clamp(idx / Math.max(1, app.n - 1), 0, 1) * max));
  };
  app.dispose = () => {
    disposed = true;
    if (app.raf) { cancelAnimationFrame(app.raf); app.raf = 0; }
    window.removeEventListener('resize', onResize);
    try { if (scenes && typeof scenes.dispose === 'function') scenes.dispose(); } catch (e) {}
    try { renderer.dispose(); } catch (e) {}
  };

  html.classList.add('sp-ready');
  setBootProgress(0.7);
  last = performance.now();
  app.raf = requestAnimationFrame(tick);
  await finishBoot();
}

/* =========================================================== AMBIENT MODE == */
/**
 * Degraded but alive: the document stays a readable flat page (`.sp-flat`)
 * while a cheap, drifting fragment of the building renders behind it.
 */
async function initAmbient(q, sections) {
  const canvas = doc.getElementById('sp-gl');
  if (!canvas) throw new Error('missing #sp-gl');

  const quality = { ...q, antialias: false, maxDpr: 1 };
  const renderer = makeRenderer(canvas, quality);
  renderer.setPixelRatio(1);
  renderer.setSize(window.innerWidth, window.innerHeight, false);

  html.classList.add('sp-ambient');   // shows #sp-gl through the flat layout

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x05080c, 0.019);
  const camera = new THREE.PerspectiveCamera(38, window.innerWidth / window.innerHeight, 0.1, 320);
  camera.position.set(0, 1.7, 8);

  /* floor slab (basic material: the ambient path has no post / no lights) */
  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(160, 360),
    new THREE.MeshBasicMaterial({ color: 0x070c12 })
  );
  floor.rotation.x = -Math.PI / 2;
  floor.position.set(0, 0, -120);
  scene.add(floor);

  /* hard-line corridor */
  const segs = [];
  const z0 = SHELL.startZ;
  const z1 = Math.max(-140, SHELL.endZ);
  for (let x = -12; x <= 12; x += 3) {
    segs.push([[x, 0.015, z0], [x, 0.015, z1], x === 0 ? 0.16 : 0.34]);
    segs.push([[x, SHELL.ceilingY, z0], [x, SHELL.ceilingY, z1], 0.6]);
  }
  for (let z = z0; z >= z1; z -= 6) {
    segs.push([[-SHELL.halfWidth, 0.02, z], [-SHELL.halfWidth, SHELL.ceilingY, z], 0.3]);
    segs.push([[SHELL.halfWidth, 0.02, z], [SHELL.halfWidth, SHELL.ceilingY, z], 0.3]);
  }
  scene.add(makeLineLace(segs, 0x8fbfe0, 0.34));

  /* a few glass blades for depth */
  const glass = makeGlassMaterial({
    tint: new THREE.Color(0x8fb6cf), alpha: 0.12,
    mullionU: 4, mullionV: 10, seed: 1.7, sheen: 0.8,
  });
  for (let i = 0; i < 4; i++) {
    const pane = new THREE.Mesh(new THREE.PlaneGeometry(9, 6.6), glass);
    const side = i % 2 ? -1 : 1;
    pane.position.set(side * 7.5, 3.4, -6 - i * 30);
    pane.rotation.y = side * 1.15;
    scene.add(pane);
  }

  const stationA = STATIONS[0];
  const stationC = STATIONS[3] || STATIONS[STATIONS.length - 1];

  let last = performance.now();
  let time = 0;
  let disposed = false;
  let tickFrames = 0;
  const pose = { pos: new THREE.Vector3(), look: new THREE.Vector3() };
  const rig = new CameraRig(camera);
  rig.reduced = !!q.reduced;

  const onResize = () => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    app.tops = sections.map((el) => Math.round(el.getBoundingClientRect().top + window.scrollY));
  };
  window.addEventListener('resize', onResize);

  /* Battery: the ambient backdrop is decoration behind a readable document.
     DPR is pinned to 1 above; on phones/tablets the frame budget is 24 fps. */
  const ambientFps = (q.mobile || window.innerWidth < MIN_SPATIAL_WIDTH) ? 24 : 30;
  const minFrame = 1 / ambientFps;

  const tick = (now) => {
    if (disposed) return;
    const raw = (now - last) / 1000;
    if (raw < minFrame) { app.raf = requestAnimationFrame(tick); return; }
    last = now;
    const dt = Math.min(0.06, Math.max(0.001, raw));
    if (!q.reduced) time += dt;

    const travel = 0.5 - 0.5 * Math.cos(time * 0.055);     // 0..1, eased ends
    pose.pos.set(lerp(stationA.pos[0], stationC.pos[0], travel), 1.68, lerp(6, stationC.pos[2] + 8, travel));
    pose.look.set(0, 1.5, lerp(-6, stationC.look[2], travel));
    rig.setPose({ pos: pose.pos, look: pose.look, fov: 38, roll: 0 });
    rig.update(dt);

    camera.updateMatrixWorld(true);
    glass.uniforms.uTime.value = time;
    glass.uniforms.uCam.value.copy(camera.position);
    renderer.render(scene, camera);

    if (++tickFrames % 3 === 0) {
      const fpsEl = doc.getElementById('sp-fps');
      if (fpsEl) fpsEl.textContent = '--';
      /* keep __sp.state() meaningful on the flat document (QA + deep links) */
      let idx = 0;
      let best = Infinity;
      const sy = window.scrollY;
      for (let s = 0; s < app.n; s++) {
        const d = Math.abs(sy - (app.tops[s] || 0));
        if (d < best) { best = d; idx = s; }
      }
      app.index = idx;
      app.active = idx;
      app.progress = app.n > 1 ? clamp(idx / (app.n - 1), 0, 1) : 0;
    }
    app.raf = requestAnimationFrame(tick);
  };

  const onVisibility = () => {
    if (doc.hidden) {
      if (app.raf) { cancelAnimationFrame(app.raf); app.raf = 0; }
    } else if (!app.raf && !disposed) {
      last = performance.now();
      app.raf = requestAnimationFrame(tick);
    }
  };
  doc.addEventListener('visibilitychange', onVisibility);

  app.mode = 'ambient';
  app.started = true;
  app.n = sections.length;
  app.tops = sections.map((el) => Math.round(el.getBoundingClientRect().top + window.scrollY));
  html.classList.add('sp-ready');

  /* Flat documents keep the sticky top bar: a jump lands the section top
     directly below it instead of underneath it. */
  const stickyTop = () => {
    const tb = doc.querySelector('.sp-topbar');
    return tb ? Math.round(tb.getBoundingClientRect().height) : 0;
  };
  const scrollTopFor = (el) => Math.max(
    0,
    Math.round(el.getBoundingClientRect().top + window.scrollY - stickyTop())
  );

  /* ?sp=N still resolves on the flat fallback: scroll to the Nth section */
  const spN = parseInt(new URLSearchParams(location.search).get('sp'), 10);
  if (Number.isFinite(spN) && sections.length) {
    const target = sections[clamp(spN - 1, 0, sections.length - 1)];
    requestAnimationFrame(() => window.scrollTo(0, scrollTopFor(target)));
  }
  app.go = (i) => {
    const el = sections[clamp(Math.round(i), 0, sections.length - 1)];
    if (el) window.scrollTo(0, scrollTopFor(el));
  };
  app.dispose = () => {
    disposed = true;
    if (app.raf) { cancelAnimationFrame(app.raf); app.raf = 0; }
    window.removeEventListener('resize', onResize);
    doc.removeEventListener('visibilitychange', onVisibility);
    try { renderer.dispose(); } catch (e) {}
  };

  setBootProgress(0.6);
  app.raf = requestAnimationFrame(tick);
  await finishBoot();
}

/* ================================================================== HUD === */
let hudCache = { level: '', name: '', pct: '', xyz: '', fov: '' };

function buildRail(built) {
  const rail = doc.getElementById('sp-rail');
  const total = doc.getElementById('sp-total');
  if (total) total.textContent = `/${pad2(built.length)}`;
  if (!rail) return;
  rail.innerHTML = '';
  built.forEach((b, i) => {
    const floor = (b.def.floor || pad2(i + 1)).replace(/^F/i, '');
    const zh = b.def.zh || b.def.en || `第 ${i + 1} 段`;
    const en = b.def.en || b.def.zh || `Section ${i + 1}`;
    const btn = doc.createElement('button');
    btn.type = 'button';
    btn.className = 'sp-rail__btn';
    btn.setAttribute('data-sp-jump', String(i));
    btn.setAttribute('data-sp-cursor', `JUMP ${pad2(i + 1)}`);
    btn.setAttribute('data-zh-name', zh);
    btn.setAttribute('data-en-name', en);
    btn.setAttribute('aria-label', `${b.def.floor || pad2(i + 1)} · ${en} / ${zh}`);
    /* v3: numerals only — the rail must stay inside the 66 px HUD gutter.
       The active station name is rendered by the bottom-right readout. */
    btn.innerHTML = `<b>${esc(floor)}</b>`;
    rail.appendChild(btn);
  });
}

function updateHud(i, t, progress, camera) {
  const level = doc.getElementById('sp-level');
  const name = doc.getElementById('sp-name');
  const pct = doc.getElementById('sp-pct');
  const xyz = doc.getElementById('sp-xyz');
  const fov = doc.getElementById('sp-fov');
  const hint = doc.getElementById('sp-hint');

  const idx = clamp(Math.round(i + t), 0, Math.max(0, app.n - 1));
  const rail = doc.getElementById('sp-rail');
  if (rail && rail.children[idx]) {
    for (let r = 0; r < rail.children.length; r++) {
      const el = rail.children[r];
      const on = r === idx;
      if (el.getAttribute('aria-current') !== String(on)) el.setAttribute('aria-current', String(on));
    }
    const btn = rail.children[idx];
    const lbl = btn.querySelector('b');
    const want = lbl ? lbl.textContent : '';
    if (hudCache.level !== want) {
      hudCache.level = want;
      if (level) level.textContent = want;
    }
    const lang = html.getAttribute('data-lang') === 'en' ? 'en' : 'zh';
    const wantName = (lang === 'en'
      ? btn.getAttribute('data-en-name')
      : btn.getAttribute('data-zh-name')) || '';
    if (hudCache.name !== wantName) {
      hudCache.name = wantName;
      if (name) name.textContent = wantName;
    }
  }

  html.style.setProperty('--sp-scroll', progress.toFixed(4));

  const pctTxt = `${String(Math.round(progress * 100)).padStart(3, '0')}%`;
  if (hudCache.pct !== pctTxt) {
    hudCache.pct = pctTxt;
    if (pct) pct.textContent = pctTxt;
  }

  const xyzTxt = `${camera.position.x.toFixed(1)} / ${camera.position.y.toFixed(1)} / ${camera.position.z.toFixed(1)}`;
  if (hudCache.xyz !== xyzTxt) {
    hudCache.xyz = xyzTxt;
    if (xyz) xyz.textContent = xyzTxt;
  }

  const fovTxt = String(Math.round(camera.fov));
  if (hudCache.fov !== fovTxt) {
    hudCache.fov = fovTxt;
    if (fov) fov.textContent = fovTxt;
  }

  if (hint) {
    const off = i + t > 0.14 ? '1' : '0';
    if (hint.getAttribute('data-off') !== off) hint.setAttribute('data-off', off);
  }
}

/* --------------------------------------------------------------- minimap -- */
let mapState = { ctx: null, w: 0, h: 0 };

function drawMap(canvas, built, active, camPos) {
  if (!canvas) return;
  const cw = Math.max(1, canvas.clientWidth);
  const ch = Math.max(1, canvas.clientHeight);
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  if (canvas.width !== Math.round(cw * dpr) || canvas.height !== Math.round(ch * dpr)) {
    canvas.width = Math.round(cw * dpr);
    canvas.height = Math.round(ch * dpr);
    mapState = { ctx: canvas.getContext('2d'), w: cw, h: ch };
    if (mapState.ctx) mapState.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  const c = mapState.ctx;
  if (!c) return;
  const w = cw;
  const h = ch;
  c.clearRect(0, 0, w, h);

  const pad = 12;
  const zA = SHELL.startZ;
  const zB = SHELL.endZ;
  const innerW = Math.max(2, w - pad * 2);
  const xOf = (z) => pad + ((zA - z) / (zA - zB)) * innerW;
  const cy = h * 0.5;
  const halfH = Math.min(h * 0.16, 16);

  /* v3: one gradient, only on the live station */
  const grad = c.createLinearGradient(pad, 0, w - pad, 0);
  grad.addColorStop(0, '#7C5CFF');
  grad.addColorStop(0.38, '#24D6EA');
  grad.addColorStop(0.74, '#C6FF4A');
  grad.addColorStop(1, '#FF5C7A');

  c.lineWidth = 1;
  c.strokeStyle = 'rgba(255,255,255,.16)';
  c.beginPath();
  c.rect(xOf(zA) + 0.5, cy - halfH + 0.5, innerW, halfH * 2);
  c.stroke();

  for (let i = 0; i < built.length; i++) {
    const z = num(built[i].def.pos[2], 0);
    const x = Math.round(xOf(z)) + 0.5;
    const on = i === active;
    c.strokeStyle = on ? grad : 'rgba(255,255,255,.16)';
    c.beginPath();
    c.moveTo(x, cy - halfH);
    c.lineTo(x, cy + halfH);
    c.stroke();
    c.fillStyle = on ? '#F7F7F4' : 'rgba(140,147,163,.75)';
    c.fillRect(Math.round(x - 0.5) - 1, Math.round(cy) - 1, 3, 3);
  }

  /* camera: plan position + a 10 px heading tick */
  const cx = xOf(camPos.z);
  const off = clamp(camPos.x / SHELL.halfWidth, -1, 1) * halfH * 0.62;
  c.strokeStyle = '#F7F7F4';
  c.beginPath();
  c.moveTo(cx - 5, cy + off);
  c.lineTo(cx + 5, cy + off);
  c.stroke();
  c.fillStyle = '#F7F7F4';
  c.fillRect(Math.round(cx) - 1, Math.round(cy + off) - 1, 2, 2);
}

/* ------------------------------------------------------------- pixel lock -- */
/**
 * At rest the content plane maps 1 CSS px → 1 screen px (see stationFrame /
 * unitsPerPixel). Rounding the residual sub-pixel translation to the device
 * grid, and collapsing numerically-dead projective terms, keeps WebGL text
 * bit-crisp instead of bilinearly resampled. Rotated / strongly perspective
 * panels are left untouched.
 */
function pixelLock(el, dpr) {
  const tr = el.style.transform;
  if (!tr || tr.charCodeAt(6) !== 0x33) return;   // not "matrix3d("
  const v = tr.slice(9, tr.length - 1).split(',');
  if (v.length !== 16) return;

  const w0 = +v[15];
  if (!Number.isFinite(w0) || Math.abs(w0) < 1e-6) return;
  const inv = 1 / w0;

  const a = +v[0] * inv;
  const b = +v[1] * inv;
  const c = +v[4] * inv;
  const d = +v[5] * inv;
  const p1 = +v[3] * inv;
  const p2 = +v[7] * inv;
  const tx = +v[12] * inv;
  const ty = +v[13] * inv;

  /* positional error (px) introduced by dropping the projective terms —
     0.5 px is below the perceptible threshold at the panel's extreme corner */
  const halfW = Math.max(1, el.offsetWidth) / 2;
  const halfH = Math.max(1, el.offsetHeight) / 2;
  const errPx = (Math.abs(p1) * halfW + Math.abs(p2) * halfH) * Math.max(halfW, halfH);
  if (errPx > 0.5) return;

  const rtx = Math.round(tx * dpr) / dpr;
  const rty = Math.round(ty * dpr) / dpr;
  el.style.transform = `matrix3d(${a},${b},0,0,${c},${d},0,0,0,0,1,0,${rtx},${rty},0,1)`;
}

/* ---------------------------------------------------------- deep link/init -- */
function isHomePage() {
  const p = (doc.body && doc.body.dataset.spPage) || '';
  return p === 'home' || location.pathname === '/' || location.pathname === '/index.html';
}

function applyDeepLink(built) {
  const params = new URLSearchParams(location.search);
  const raw = params.get('sp');
  if (raw != null && raw !== '') {
    const n = parseInt(raw, 10);
    if (Number.isFinite(n)) {
      const idx = clamp(n - 1, 0, built.length - 1);
      scrollToStation(idx, false);
      return;
    }
  }
  const hash = location.hash;
  if (hash && hash.indexOf('#sp-') === 0) {
    const key = hash.slice(4);
    const idx = built.findIndex((b) => b.key === key);
    if (idx >= 0) scrollToStation(idx, false);
  }
}

/* ================================================================ bootstrap == */
async function main() {
  const sections = Array.from(doc.querySelectorAll('[data-sp-station]'));

  /* debug/QA hook — always present, every mode */
  window.__sp = {
    get mode() { return app.mode; },
    get fps() { return app.fps; },
    get stations() { return app.n; },
    go(n) { app.go(num(n, 1) - 1); },          // 1-based, matches the HUD floors
    go0(n) { app.go(num(n, 0)); },             // 0-based
    calibrate(i) { return app.calibrate ? app.calibrate(i) : null; },
    rebuildBodies() { if (app.rebuildBodies) app.rebuildBodies(); },
    bodyCheck() { return app.bodyCheck ? app.bodyCheck() : []; },
    detent() { return app.detentState ? app.detentState() : null; },
    state() {
      return {
        mode: app.mode,
        fps: app.fps,
        stations: app.n,
        index: app.index,
        active: app.active,
        t: +app.t.toFixed(3),
        progress: +app.progress.toFixed(3),
        wipe: +app.wipe.toFixed(3),
        scrollY: window.scrollY,
        tops: app.tops.slice(),
      };
    },
  };

  const q = detectQuality();
  if (!hasWebGL()) { flat('WebGL unavailable'); return; }

  /* long-form pages opt into the reading backdrop explicitly */
  const documentMode = ((doc.body && doc.body.dataset.spMode) || '') === 'ambient';
  if (documentMode) {
    try {
      await initDocument(q);
    } catch (err) {
      console.warn('[space] document backdrop failed', err);
      flat(err && err.message ? err.message : 'document failed');
    }
    return;
  }

  if (!sections.length) {
    /* nothing to project (no stations): readable flat document, no error */
    const b = bootNode();
    if (b) b.setAttribute('data-done', 'true');
    setBootProgress(1);
    app.mode = 'flat';
    return;
  }

  app.n = sections.length;

  /* Reduced motion is NOT a degraded renderer: the station composition stays,
     the engine drops idle drift / kicks, jumps land instantly and the wipe is
     replaced by a 160 ms fade (initSpatial handles each of those). Only a
     narrow viewport or a low tier falls back to the flat/ambient document. */
  const spatial = window.innerWidth >= MIN_SPATIAL_WIDTH && q.tier >= 2;
  if (!spatial) {
    /* readable document first — ambient only paints behind it */
    html.classList.add('sp-flat');
    try {
      await initAmbient(q, sections);
    } catch (err) {
      flat(err && err.message ? err.message : 'ambient failed');
    }
    return;
  }

  try {
    await initSpatial(q, sections);
  } catch (err) {
    console.error('[space] spatial init failed', err);
    flat(err && err.message ? err.message : 'spatial failed');
  }
}

main().catch((err) => {
  console.error('[space] fatal', err);
  flat('fatal');
});
