/* =============================================================================
   STATIONS — the authoritative spatial script for the whole site.
   Coordinates: metres, Y up, travel along −Z. Camera keyframes, content-plane
   metrics and per-station architectural accents all live here.

   OWNER: lead. Read-only for every other agent.
   ========================================================================== */
import * as THREE from 'three';

/**
 * Each station:
 *   key      – stable id, must match data-sp-station in markup
 *   floor    – "F01" style label shown in the HUD
 *   zh / en  – rail labels
 *   pos/look – camera keyframe
 *   fov      – vertical field of view
 *   accent   – which piece of architecture scenes.js builds around it
 *   exposure – per-station grading weight (1 = neutral)
 *   fogNear/fogFar – depth cue range for this station
 */
export const STATIONS = [
  {
    key: 'entry',
    floor: 'F01',
    zh: '入口',
    en: 'Entry',
    pos: [0.0, 1.62, 6],
    look: [0.0, 1.52, -4],
    fov: 34,
    accent: 'portal',
    exposure: 1.04,
    fogNear: 14,
    fogFar: 62,
  },
  {
    key: 'profile',
    floor: 'F02',
    zh: '简介',
    en: 'Profile',
    /* the camera stands left of the aisle and turns back toward it: the hall
       reads diagonally while the content plane stays square to the eye. */
    pos: [-2.4, 1.58, -16],
    look: [-0.9, 1.50, -26],
    fov: 33,
    accent: 'colonnade',
    exposure: 1.0,
    fogNear: 16,
    fogFar: 58,
  },
  {
    key: 'research',
    floor: 'F03',
    zh: '研究',
    en: 'Research',
    pos: [2.6, 1.70, -38],
    look: [0.8, 1.66, -48],
    fov: 35,
    accent: 'towers',
    exposure: 1.0,
    fogNear: 15,
    fogFar: 60,
  },
  {
    key: 'papers',
    floor: 'F04',
    zh: '论文',
    en: 'Publications',
    pos: [-2.8, 1.48, -60],
    look: [-1.0, 1.56, -70],
    fov: 33,
    accent: 'shelves',
    exposure: 0.98,
    fogNear: 14,
    fogFar: 58,
  },
  {
    key: 'notes',
    floor: 'F05',
    zh: '笔记',
    en: 'Notes',
    pos: [2.2, 1.40, -82],
    look: [0.6, 1.48, -92],
    fov: 34,
    accent: 'blades',
    exposure: 1.0,
    fogNear: 14,
    fogFar: 56,
  },
  {
    key: 'tools',
    floor: 'F06',
    zh: '工具',
    en: 'Tools',
    pos: [-1.8, 1.72, -104],
    look: [-0.6, 1.62, -114],
    fov: 35,
    accent: 'ring',
    exposure: 1.02,
    fogNear: 14,
    fogFar: 58,
  },
  {
    key: 'contact',
    floor: 'F07',
    zh: '联系',
    en: 'Contact',
    pos: [0.9, 1.55, -126],
    look: [-1.2, 1.82, -138],
    fov: 38,
    accent: 'void',
    exposure: 1.06,
    fogNear: 18,
    fogFar: 74,
  },
];

/** Distance from the camera to the station's flat content plane. */
export const CONTENT_DISTANCE = 8;

/* ---------------------------------------------------------------------------
   Curved one-shot flight.
   Each station owns the curve of the segment LEAVING it. At mid-transition the
   camera is pushed along `arc` (metres) and the look target along `lookArc`,
   then banked by `bank` radians — so the dolly reads as a single continuous
   swooping take rather than a per-section slide.
   Used by app.js as:  pos += arc * sin(pi * k);  look += lookArc * sin(pi * k)
   ------------------------------------------------------------------------ */
const FLIGHT = {
  entry: { arc: [1.9, 0.34, -0.55], lookArc: [-0.75, 0.16, 0.0], bank: 0.026 },
  profile: { arc: [-2.2, 0.22, 0.45], lookArc: [0.62, 0.06, 0.0], bank: -0.024 },
  research: { arc: [2.35, -0.26, -0.35], lookArc: [-0.80, -0.12, 0.0], bank: 0.028 },
  papers: { arc: [-2.05, 0.30, 0.40], lookArc: [0.68, 0.10, 0.0], bank: -0.022 },
  notes: { arc: [1.85, 0.36, -0.50], lookArc: [-0.70, 0.18, 0.0], bank: 0.024 },
  tools: { arc: [-1.95, -0.20, 0.30], lookArc: [0.72, -0.08, 0.0], bank: -0.020 },
  contact: { arc: [0.0, 0.0, 0.0], lookArc: [0.0, 0.0, 0.0], bank: 0.0 },
};
for (const st of STATIONS) Object.assign(st, FLIGHT[st.key] || {});

/* Global grade trim.
   The composite now writes a proper sRGB signal, which lifted every mid-tone.
   The room must stay near-black with light living on edges and reflections, so
   the per-station exposure is trimmed once, here, instead of in five files. */
const EXPOSURE_TRIM = 0.95;
for (const st of STATIONS) st.exposure = +(st.exposure * EXPOSURE_TRIM).toFixed(3);

/** Corridor cross-section shared by the whole building. */
export const SHELL = {
  floorY: 0,
  ceilingY: 7.2,
  halfWidth: 13,
  startZ: 18,
  endZ: -158,
};

const _fwd = new THREE.Vector3();
const _right = new THREE.Vector3();
const _down = new THREE.Vector3();
const _upHint = new THREE.Vector3(0, 1, 0);

/**
 * Derives the orthonormal frame of a station: where its content plane sits and
 * which way its axes point. `unitsPerPixelAt(viewportHeight)` converts CSS px to
 * world units so that, at rest, one CSS pixel covers one screen pixel.
 */
export function stationFrame(st, distance = CONTENT_DISTANCE) {
  const pos = new THREE.Vector3().fromArray(st.pos);
  const look = new THREE.Vector3().fromArray(st.look);

  // forward = away from the camera, deeper into the space
  _fwd.copy(look).sub(pos).normalize();
  // screen-right and screen-down, so panel local +y matches CSS +y
  _right.crossVectors(_fwd, _upHint).normalize();
  _down.crossVectors(_fwd, _right).normalize();

  const origin = pos.clone().addScaledVector(_fwd, distance);
  const basis = new THREE.Matrix4().makeBasis(_right, _down, _fwd);

  return {
    pos: pos.clone(),
    look: look.clone(),
    forward: _fwd.clone(),
    right: _right.clone(),
    down: _down.clone(),
    up: _down.clone().negate(),
    basis,
    origin,
    distance,
    fov: st.fov,
  };
}

/** World units per CSS pixel at the content plane for a given viewport height. */
export function unitsPerPixel(fov, viewportHeight, distance = CONTENT_DISTANCE) {
  const visibleHeight = 2 * distance * Math.tan((fov * Math.PI) / 180 / 2);
  return visibleHeight / Math.max(1, viewportHeight);
}

export function stationIndex(key) {
  return STATIONS.findIndex((s) => s.key === key);
}

export default STATIONS;
