/* =============================================================================
   SPATIAL ENGINE  ·  cold-glass curtain-wall world
   Three.js r186 + custom planar reflection, glass shading, post chain,
   spline camera rig and a DOM⇄3D projection layer.

   Everything here is presentation-only: content lives in the HTML.
   ========================================================================== */
import * as THREE from 'three';

/* ---------------------------------------------------------------- utils -- */
export const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
export const lerp = (a, b, t) => a + (b - a) * t;
export const smoothstep = (e0, e1, x) => {
  const t = clamp((x - e0) / (e1 - e0), 0, 1);
  return t * t * (3 - 2 * t);
};
export const damp = (current, target, lambda, dt) =>
  target + (current - target) * Math.exp(-lambda * dt);

/* ---------------------------------------------------------- GLSL shared -- */
/* A cold, procedural "curtain-wall city" environment used by glass relflections.
   No textures: everything is analytic so it stays crisp at every angle.      */
export const GLSL_ENV = /* glsl */ `
vec3 spEnv(vec3 d){
  d = normalize(d);
  float up = clamp(d.y * 0.5 + 0.5, 0.0, 1.0);

  // deep cold sky
  vec3 sky = mix(vec3(0.012, 0.021, 0.032), vec3(0.055, 0.098, 0.135), pow(up, 1.35));
  sky += vec3(0.16, 0.26, 0.34) * pow(max(d.y, 0.0), 5.0) * 0.55;

  // azimuth: vertical mullion rhythm of a mirrored facade
  float ang = atan(d.z, d.x);
  float mull = sin(ang * 128.0) * 0.5 + 0.5;
  mull = pow(mull, 22.0);

  // storey bands, denser toward the horizon
  float bandY = d.y * 26.0 + sin(ang * 3.0) * 0.6;
  float band = smoothstep(0.72, 0.99, abs(sin(bandY * 3.14159)));

  float facade = (mull * 0.75 + band * 0.5) * smoothstep(0.02, 0.55, up);
  vec3 cold = vec3(0.42, 0.66, 0.82);

  // a couple of bright specular streaks, like sun on a tower edge
  float streak = pow(abs(sin(ang * 1.5 + 0.9)), 40.0) * smoothstep(0.25, 0.9, d.y);
  float streak2 = pow(abs(sin(ang * 2.3 - 1.7)), 90.0) * smoothstep(-0.1, 0.7, d.y);

  vec3 col = sky + cold * facade * 0.30 + vec3(0.55, 0.80, 1.0) * streak * 0.7
           + vec3(0.35, 0.62, 0.85) * streak2 * 0.5;

  // ground haze
  col = mix(col, vec3(0.008, 0.014, 0.021), smoothstep(0.0, -0.55, d.y) * 0.9);
  return col;
}
`;

/* ------------------------------------------------------------- renderer -- */
export function makeRenderer(canvas, quality) {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: quality.antialias,
    alpha: false,
    powerPreference: 'high-performance',
    stencil: false,
    depth: true,
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, quality.maxDpr));
  renderer.setSize(window.innerWidth, window.innerHeight, false);
  renderer.setClearColor(0x05060a, 1);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.NoToneMapping; // tonemapped in the composite pass
  renderer.autoClear = true;
  return renderer;
}

/* ------------------------------------------------------- mirror floor ---- */
/* Planar reflection about y = planeHeight, oblique-clipped, half-res.
   Returns a mesh whose shader samples the reflection with a ripple + grid.  */
export function makeMirrorFloor(renderer, scene, camera, opts = {}) {
  const {
    width = 160,
    depth = 320,
    y = 0,
    resScale = 0.5,
    gridStep = 1.5,
    tint = new THREE.Color(0x0a0c11),
  } = opts;

  const rtSize = () => {
    const w = Math.max(2, Math.floor(window.innerWidth * renderer.getPixelRatio() * resScale));
    const h = Math.max(2, Math.floor(window.innerHeight * renderer.getPixelRatio() * resScale));
    return [w, h];
  };
  const [rw, rh] = rtSize();
  const target = new THREE.WebGLRenderTarget(rw, rh, {
    type: THREE.HalfFloatType,
    minFilter: THREE.LinearFilter,
    magFilter: THREE.LinearFilter,
    depthBuffer: true,
    samples: 0,
  });
  target.texture.colorSpace = THREE.LinearSRGBColorSpace;

  const virtualCamera = new THREE.PerspectiveCamera();
  const textureMatrix = new THREE.Matrix4();
  const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -y);
  const normal = new THREE.Vector3(0, 1, 0);
  const mirrorPos = new THREE.Vector3(0, y, 0);

  const uniforms = {
    uReflect: { value: target.texture },
    uTexMatrix: { value: textureMatrix },
    uTime: { value: 0 },
    uTint: { value: tint },
    uGrid: { value: gridStep },
    uCam: { value: new THREE.Vector3() },
    uFade: { value: new THREE.Vector2(26, 96) },
    uIntensity: { value: 1.0 },
  };

  const mat = new THREE.ShaderMaterial({
    uniforms,
    transparent: false,
    depthWrite: true,
    side: THREE.FrontSide,
    vertexShader: /* glsl */ `
      uniform mat4 uTexMatrix;
      varying vec4 vUvR;
      varying vec3 vWorld;
      void main(){
        vec4 wp = modelMatrix * vec4(position, 1.0);
        vWorld = wp.xyz;
        vUvR = uTexMatrix * wp;
        gl_Position = projectionMatrix * viewMatrix * wp;
      }
    `,
    fragmentShader: /* glsl */ `
      precision highp float;
      uniform sampler2D uReflect;
      uniform float uTime;
      uniform vec3 uTint;
      uniform float uGrid;
      uniform vec3 uCam;
      uniform vec2 uFade;
      uniform float uIntensity;
      varying vec4 vUvR;
      varying vec3 vWorld;

      float gridLine(float coord, float step_, float w){
        float f = abs(fract(coord / step_ - 0.5) - 0.5) * step_;
        float aa = fwidth(coord) * w;
        return 1.0 - smoothstep(0.0, aa, f);
      }

      void main(){
        vec3 V = normalize(vWorld - uCam);
        float dist = length(vWorld - uCam);

        // ---- polished reflection with a slow ripple ----
        vec2 ripple = vec2(
          sin(vWorld.x * 0.55 + uTime * 0.35) + sin(vWorld.z * 0.31 - uTime * 0.22),
          cos(vWorld.z * 0.47 - uTime * 0.29) + cos(vWorld.x * 0.37 + uTime * 0.19)
        ) * 0.00055;

        vec2 uv = vUvR.xy / vUvR.w + ripple;
        // glancing-angle split on the *floor* only, kept tiny so 1px room lines
        // behind the camera never fringe into rainbow edges
        float graze = pow(1.0 - max(V.y, 0.0), 4.0);
        float split = 0.0003 + graze * 0.0011;
        vec3 refl;
        refl.r = texture2D(uReflect, uv + vec2(split, 0.0)).r;
        refl.g = texture2D(uReflect, uv).g;
        refl.b = texture2D(uReflect, uv - vec2(split, 0.0)).b;

        // ---- base: polished black stone, only faintly lifted with distance ----
        vec3 base = mix(uTint, uTint * 1.45, smoothstep(0.0, 46.0, dist));

        // ---- hard-line plan grid (extremely faint: a plan drawing, not a net) ----
        float gx = gridLine(vWorld.x, uGrid, 1.0);
        float gz = gridLine(vWorld.z, uGrid, 1.0);
        float major = max(gridLine(vWorld.x, uGrid * 6.0, 1.4), gridLine(vWorld.z, uGrid * 6.0, 1.4));
        float grid = max(gx, gz) * 0.016 + major * 0.045;

        // grazing sheen
        float sheen = graze * 0.12;

        float fade = 1.0 - smoothstep(uFade.x, uFade.y, dist);
        vec3 col = base + refl * (0.20 + graze * 0.30) * uIntensity;
        col += vec3(0.55, 0.82, 1.0) * grid * (0.35 + graze * 0.5);
        col += vec3(0.30, 0.55, 0.75) * sheen * 0.5;

        // horizon blend so the floor dissolves into fog
        col = mix(vec3(0.010, 0.017, 0.024), col, fade);
        gl_FragColor = vec4(col, 1.0);
      }
    `,
  });

  const geo = new THREE.PlaneGeometry(width, depth, 1, 1);
  geo.rotateX(-Math.PI / 2);
  const mesh = new THREE.Mesh(geo, mat);
  mesh.position.set(0, y, 0);
  mesh.renderOrder = -1;
  mesh.matrixAutoUpdate = false;
  mesh.updateMatrix();
  mesh.frustumCulled = false;

  function update(sceneToRender, mainCamera, skipList) {
    // mirror camera about the floor plane
    const camPos = mainCamera.getWorldPosition(new THREE.Vector3());
    const rot = new THREE.Matrix4().extractRotation(mainCamera.matrixWorld);

    const view = new THREE.Vector3().subVectors(camPos, mirrorPos);
    view.reflect(normal).negate().add(mirrorPos);

    const lookAt = new THREE.Vector3(0, 0, -1).applyMatrix4(rot).add(camPos);
    const lookTarget = new THREE.Vector3().subVectors(lookAt, mirrorPos);
    lookTarget.reflect(normal).negate().add(mirrorPos);

    virtualCamera.position.copy(view);
    virtualCamera.up.set(0, 1, 0).applyMatrix4(rot).reflect(normal);
    virtualCamera.lookAt(lookTarget);
    virtualCamera.far = mainCamera.far;
    virtualCamera.near = mainCamera.near;
    virtualCamera.updateMatrixWorld();
    virtualCamera.projectionMatrix.copy(mainCamera.projectionMatrix);

    textureMatrix.set(
      0.5, 0.0, 0.0, 0.5,
      0.0, 0.5, 0.0, 0.5,
      0.0, 0.0, 0.5, 0.5,
      0.0, 0.0, 0.0, 1.0
    );
    textureMatrix.multiply(virtualCamera.projectionMatrix);
    textureMatrix.multiply(virtualCamera.matrixWorldInverse);

    // oblique near plane so nothing under the floor leaks in
    const clipPlane = new THREE.Plane().copy(plane);
    clipPlane.applyMatrix4(virtualCamera.matrixWorldInverse);
    const cp = new THREE.Vector4(clipPlane.normal.x, clipPlane.normal.y, clipPlane.normal.z, clipPlane.constant);
    const pm = virtualCamera.projectionMatrix;
    const q = new THREE.Vector4(
      (Math.sign(cp.x) + pm.elements[8]) / pm.elements[0],
      (Math.sign(cp.y) + pm.elements[9]) / pm.elements[5],
      -1.0,
      (1.0 + pm.elements[10]) / pm.elements[14]
    );
    cp.multiplyScalar(2.0 / cp.dot(q));
    pm.elements[2] = cp.x;
    pm.elements[6] = cp.y;
    pm.elements[10] = cp.z + 1.0;
    pm.elements[14] = cp.w;

    // hide the floor (and anything flagged) while rendering the reflection
    const hidden = [];
    const hide = (o) => { if (o && o.visible) { hidden.push(o); o.visible = false; } };
    hide(mesh);
    if (skipList) skipList.forEach(hide);

    const prevTarget = renderer.getRenderTarget();
    renderer.setRenderTarget(target);
    renderer.clear();
    renderer.render(sceneToRender, virtualCamera);
    renderer.setRenderTarget(prevTarget);

    hidden.forEach((o) => { o.visible = true; });
  }

  function resize() {
    const [w, h] = rtSize();
    target.setSize(w, h);
  }

  return { mesh, uniforms, update, resize, target };
}

/* -------------------------------------------------------------- glass ---- */
export function makeGlassMaterial(opts = {}) {
  const {
    tint = new THREE.Color(0x8fb6cf),
    alpha = 0.16,
    mullionU = 6,
    mullionV = 14,
    seed = 0,
    sheen = 1.0,
  } = opts;
  return new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending,
    uniforms: {
      uTint: { value: tint },
      uAlpha: { value: alpha },
      uMU: { value: mullionU },
      uMV: { value: mullionV },
      uSeed: { value: seed },
      uSheen: { value: sheen },
      uTime: { value: 0 },
      uCam: { value: new THREE.Vector3() },
    },
    vertexShader: /* glsl */ `
      varying vec2 vUv;
      varying vec3 vWorld;
      varying vec3 vNormalW;
      void main(){
        vUv = uv;
        vec4 wp = modelMatrix * vec4(position, 1.0);
        vWorld = wp.xyz;
        vNormalW = normalize(mat3(modelMatrix) * normal);
        gl_Position = projectionMatrix * viewMatrix * wp;
      }
    `,
    fragmentShader: /* glsl */ `
      precision highp float;
      ${GLSL_ENV}
      uniform vec3 uTint;
      uniform float uAlpha, uMU, uMV, uSeed, uSheen, uTime;
      uniform vec3 uCam;
      varying vec2 vUv;
      varying vec3 vWorld;
      varying vec3 vNormalW;

      float lineMask(float x, float n, float w){
        float f = abs(fract(x * n) - 0.5);
        float aa = fwidth(x * n) * w;
        return smoothstep(0.5 - aa, 0.5, f);
      }

      void main(){
        vec3 V = normalize(vWorld - uCam);
        float fres = pow(1.0 - abs(dot(V, normalize(vNormalW))), 3.0);

        vec3 R = reflect(V, normalize(vNormalW));
        vec3 env = spEnv(R);

        // interior glazing: faint vertical light behind the glass
        float inner = smoothstep(0.0, 1.0, sin(vUv.y * 3.14159)) * 0.25;
        inner *= 0.5 + 0.5 * sin(vUv.x * 12.0 + uSeed * 6.0 + uTime * 0.1);

        float mU = lineMask(vUv.x + uSeed, uMU, 1.2);
        float mV = lineMask(vUv.y, uMV, 1.2);
        float frame = max(mU, mV);

        vec3 col = uTint * (0.06 + inner * 0.5);
        col += env * (0.20 + fres * 0.95) * uSheen;
        col += vec3(0.62, 0.86, 1.0) * frame * (0.16 + fres * 0.55);

        // edge glow where the pane meets the light
        float edge = smoothstep(0.0, 0.02, vUv.x) * smoothstep(0.0, 0.02, 1.0 - vUv.x);
        col += vec3(0.45, 0.75, 1.0) * (1.0 - edge) * 0.10;

        float a = uAlpha * (0.35 + fres * 1.25 + frame * 0.6);
        gl_FragColor = vec4(col * (1.0 + fres), a);
      }
    `,
  });
}

/* ------------------------------------------------------- post pipeline --- */
/* v3 "spectro-vector" composite.
   Passes: scene → quarter-res spectral field → bright → 2×(H,V) blur → composite.
   New state knobs (all optional):
     wipe   0..1   blade sweep used when jumping between floors
     field  0..1   strength of the animated gradient field in the dark
     poster 0..1   graphic posterisation of the image (vector look)
     edge   0..1   sobel hairline extraction (drawn geometry only)
     flash  0..1   spectral flash on jump impact
     station 0..6  shifts the field phase per floor
   The DOM is never affected: text stays native and crisp above the canvas.  */
export function makePostChain(renderer, quality) {
  const quadGeo = new THREE.PlaneGeometry(2, 2);
  const quadCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const quadScene = new THREE.Scene();
  const quad = new THREE.Mesh(quadGeo, null);
  quad.frustumCulled = false;
  quadScene.add(quad);

  const makeRT = (w, h, extra = {}) => {
    const rt = new THREE.WebGLRenderTarget(Math.max(2, w), Math.max(2, h), {
      type: THREE.HalfFloatType,
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      depthBuffer: false,
      ...extra,
    });
    rt.texture.colorSpace = THREE.LinearSRGBColorSpace;
    return rt;
  };

  let W = 1, H = 1, PR = 1;
  const sceneRT = makeRT(2, 2, { depthBuffer: true });
  const fieldRT = makeRT(2, 2);
  const b1 = makeRT(2, 2);
  const b2 = makeRT(2, 2);
  const b3 = makeRT(2, 2);
  const b4 = makeRT(2, 2);

  const VS = /* glsl */ `varying vec2 vUv; void main(){ vUv = position.xy * 0.5 + 0.5; gl_Position = vec4(position.xy, 0.0, 1.0); }`;

  /* ---- shared GLSL: spectral ramp + hash ------------------------------- */
  const SPECTRAL = /* glsl */ `
    uniform vec3 uA, uB, uC, uD;
    vec3 ramp(float x){
      x = clamp(x, 0.0, 1.0);
      vec3 c = mix(uA, uB, smoothstep(0.0, 0.42, x));
      c = mix(c, uC, smoothstep(0.38, 0.78, x));
      c = mix(c, uD, smoothstep(0.80, 1.0, x));
      return c;
    }
    float hash21(vec2 p){
      p = fract(p * vec2(123.34, 456.21));
      p += dot(p, p + 45.32);
      return fract(p.x * p.y);
    }
  `;

  /* ---- pass 1: the field (quarter res, cheap) -------------------------- */
  const fieldMat = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uStation: { value: 0 },
      uAspect: { value: 1 },
      uA: { value: new THREE.Color(0x7c5cff) },
      uB: { value: new THREE.Color(0x24d6ea) },
      uC: { value: new THREE.Color(0xc6ff4a) },
      uD: { value: new THREE.Color(0xff5c7a) },
    },
    vertexShader: VS,
    fragmentShader: /* glsl */ `
      precision highp float;
      ${SPECTRAL}
      uniform float uTime, uStation, uAspect;
      varying vec2 vUv;

      float vnoise(vec2 p){
        vec2 i = floor(p), f = fract(p);
        f = f * f * (3.0 - 2.0 * f);
        float a = hash21(i);
        float b = hash21(i + vec2(1.0, 0.0));
        float c = hash21(i + vec2(0.0, 1.0));
        float d = hash21(i + vec2(1.0, 1.0));
        return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
      }
      float fbm(vec2 p){
        float v = 0.0, a = 0.58;
        for (int i = 0; i < 3; i++) {
          v += a * vnoise(p);
          p = p * 2.03 + vec2(11.3, 7.7);
          a *= 0.5;
        }
        return v;
      }

      void main(){
        vec2 uv = vUv;
        float t = uTime * 0.028;
        vec2 p = uv * vec2(uAspect * 1.05, 1.0);

        /* domain-warped strata: a slow tectonic drift, never a loop you can see */
        vec2 w = vec2(
          fbm(p * 1.15 + vec2(t * 1.35, -t * 0.85)),
          fbm(p * 1.15 + vec2(-t * 0.62, t * 1.10) + 17.0)
        );
        float v = fbm(p * 4.6 + w * 1.7 + vec2(0.0, t * 0.65));
        v = fract(v * 2.9 + uv.y * 0.55 + uStation * 0.105 + t * 0.05);

        /* hard banding: 9 flat steps, with a hairline that catches the light */
        float steps = 9.0;
        float q = floor(v * steps) / steps;
        float frac = fract(v * steps);
        vec3 col = ramp(fract(q + uStation * 0.035));
        col += ramp(fract(q + 0.14)) * smoothstep(0.86, 1.0, frac) * 0.55;
        /* keep the field chromatic but never muddy: pull it toward its own
           luminance so the void stays graphite, not swamp */
        float gl = dot(col, vec3(0.2126, 0.7152, 0.0722));
        col = mix(vec3(gl), col, 0.42);
        col *= 0.86 + 0.14 * smoothstep(0.0, 0.55, uv.y);
        gl_FragColor = vec4(col, 1.0);
      }
    `,
  });

  /* ---- pass 2: bright extraction + blur (kept from v2, retuned) -------- */
  const brightMat = new THREE.ShaderMaterial({
    uniforms: { uTex: { value: null }, uThreshold: { value: 0.72 }, uKnee: { value: 0.22 } },
    vertexShader: VS,
    fragmentShader: /* glsl */ `
      uniform sampler2D uTex; uniform float uThreshold, uKnee; varying vec2 vUv;
      void main(){
        vec3 c = texture2D(uTex, vUv).rgb;
        float l = max(c.r, max(c.g, c.b));
        float soft = clamp(l - uThreshold + uKnee, 0.0, 2.0 * uKnee);
        soft = soft * soft / (4.0 * uKnee + 1e-4);
        float w = max(soft, l - uThreshold) / max(l, 1e-4);
        gl_FragColor = vec4(c * w, 1.0);
      }
    `,
  });

  const blurMat = new THREE.ShaderMaterial({
    uniforms: { uTex: { value: null }, uDir: { value: new THREE.Vector2(1, 0) }, uRes: { value: new THREE.Vector2(1, 1) } },
    vertexShader: VS,
    fragmentShader: /* glsl */ `
      uniform sampler2D uTex; uniform vec2 uDir, uRes; varying vec2 vUv;
      void main(){
        vec2 d = uDir / uRes;
        vec3 s = texture2D(uTex, vUv).rgb * 0.2270270270;
        s += texture2D(uTex, vUv + d * 1.3846153846).rgb * 0.3162162162;
        s += texture2D(uTex, vUv - d * 1.3846153846).rgb * 0.3162162162;
        s += texture2D(uTex, vUv + d * 3.2307692308).rgb * 0.0702702703;
        s += texture2D(uTex, vUv - d * 3.2307692308).rgb * 0.0702702703;
        gl_FragColor = vec4(s, 1.0);
      }
    `,
  });

  /* ---- pass 3: composite ---------------------------------------------- */
  const compositeMat = new THREE.ShaderMaterial({
    uniforms: {
      uScene: { value: null },
      uBloom1: { value: null },
      uBloom2: { value: null },
      uFieldTex: { value: null },
      uRes: { value: new THREE.Vector2(1, 1) },
      uAspect: { value: 1 },
      uTime: { value: 0 },
      uVel: { value: 0 },
      uExposure: { value: 1.0 },
      uAberr: { value: 0.0009 },
      uGrain: { value: 0.006 },
      uVignette: { value: 0.46 },
      uReveal: { value: 1.0 },
      uFade: { value: 0.0 },
      uWipe: { value: 0.0 },
      uField: { value: 0.55 },
      uPoster: { value: 0.16 },
      uEdge: { value: 0.0 },
      uFlash: { value: 0.0 },
      uStation: { value: 0 },
      uMask: { value: [
        new THREE.Vector4(), new THREE.Vector4(), new THREE.Vector4(), new THREE.Vector4(),
        new THREE.Vector4(), new THREE.Vector4(), new THREE.Vector4(), new THREE.Vector4(),
        new THREE.Vector4(), new THREE.Vector4(), new THREE.Vector4(), new THREE.Vector4(),
      ] },
      uMaskCount: { value: 0 },
      uMaskStr: { value: 0.80 },
      uA: { value: new THREE.Color(0x7c5cff) },
      uB: { value: new THREE.Color(0x24d6ea) },
      uC: { value: new THREE.Color(0xc6ff4a) },
      uD: { value: new THREE.Color(0xff5c7a) },
    },
    vertexShader: VS,
    fragmentShader: /* glsl */ `
      precision highp float;
      ${SPECTRAL}
      uniform sampler2D uScene, uBloom1, uBloom2, uFieldTex;
      uniform vec2 uRes;
      uniform float uAspect, uTime, uVel, uExposure, uAberr, uGrain, uVignette;
      uniform float uReveal, uFade, uWipe, uField, uPoster, uEdge, uFlash, uStation;
      uniform float uMaskStr;
      uniform int uMaskCount;
      uniform vec4 uMask[12];
      varying vec2 vUv;

      vec3 aces(vec3 x){
        const float a = 2.51, b = 0.03, c = 2.43, d = 0.59, e = 0.14;
        return clamp((x * (a * x + b)) / (x * (c * x + d) + e), 0.0, 1.0);
      }
      float luma(vec3 c){ return dot(c, vec3(0.2126, 0.7152, 0.0722)); }
      float bayer2(vec2 a){ a = floor(a); return fract(a.x * 0.5 + a.y * a.y * 0.75); }
      float bayer4(vec2 a){ return bayer2(0.5 * a) * 0.25 + bayer2(a); }

      void main(){
        vec2 uv = vUv;
        vec2 c = uv - 0.5;
        float r2 = dot(c, c);

        /* ---- 0 · blade wipe geometry (before sampling so it smears) ----- */
        float sweepY = 2.0, blade = 0.0, env = 0.0;
        if (uWipe > 0.0001) {
          float w = clamp(uWipe, 0.0, 1.0);
          env = sin(3.14159265 * w);
          sweepY = mix(1.16, -0.16, smoothstep(0.0, 1.0, w));
          blade = smoothstep(0.085, 0.0, abs(uv.y - sweepY));
          float row = floor(uv.y * 46.0);
          float rnd = hash21(vec2(row, 3.7)) - 0.5;
          uv.x += rnd * 0.055 * blade * (1.0 - w * 0.6);
          /* a hard 1px cut line at the leading edge */
        }

        /* very slight lens curve, keeps the frame feeling optical */
        vec2 luv = 0.5 + (uv - 0.5) * (1.0 + r2 * 0.028);

        /* ---- 1 · scene with chromatic fringe ---------------------------- */
        float ab = (uAberr + abs(uVel) * 0.0016) * (0.16 + r2 * 1.0);
        vec2 dir = normalize(c + 1e-6);
        vec3 col;
        col.r = texture2D(uScene, luv + dir * ab).r;
        col.g = texture2D(uScene, luv).g;
        col.b = texture2D(uScene, luv - dir * ab).b;

        vec3 bloom = texture2D(uBloom1, luv).rgb * 0.95 + texture2D(uBloom2, luv).rgb * 0.75;

        /* motion smear of the bloom gives the dolly weight */
        if (abs(uVel) > 0.02) {
          vec2 sd = dir * abs(uVel) * 0.022;
          vec3 smear = vec3(0.0);
          for (int i = 1; i < 4; i++) {
            float f = float(i) / 3.0;
            smear += texture2D(uBloom1, luv - sd * f).rgb;
          }
          bloom += smear * 0.06 * abs(uVel);
        }
        col += bloom * 0.48;

        /* ---- 2 · exposure + film response ------------------------------- */
        col *= uExposure;
        col = aces(col);

        /* ---- 3 · posterisation (graphic, hard steps) -------------------- */
        if (uPoster > 0.001) {
          float l = max(col.r, max(col.g, col.b));
          if (l > 0.0009) {
            float N = mix(26.0, 7.0, uPoster);
            float dith = (bayer4(gl_FragCoord.xy) - 0.5) * (1.4 / N);
            float q = clamp(floor(l * N + dith + 0.5) / N, 0.0, 1.0);
            col *= q / l;
          }
        }

        /* ---- 4 · neutral grade, cold shadows --------------------------- */
        col = mix(col, col * vec3(0.93, 1.0, 1.07), 0.55);
        col += vec3(0.0004, 0.0008, 0.0015);

        /* ---- 5 · spectral field, only where the world is empty --------- */
        if (uField > 0.001) {
          vec3 fld = texture2D(uFieldTex, clamp(uv, 0.002, 0.998)).rgb;
          float dark = smoothstep(0.26, 0.005, luma(col));
          /* the middle of the frame belongs to the content: light lives at the
             edges and in depth, never behind a paragraph of text */
          float rad = smoothstep(0.26, 1.02, length(c * vec2(uAspect, 1.0)));
          col += fld * dark * uField * (0.10 + 0.90 * rad) * 0.042;
          /* the field lifts the deepest black a hair so bands never crush */
          col += fld * 0.0022 * uField;
        }

        /* ---- 6 · vector hairlines (sobel on luminance) ----------------- */
        if (uEdge > 0.001) {
          vec2 tx = 1.0 / uRes;
          float l0 = luma(texture2D(uScene, luv).rgb);
          float lx1 = luma(texture2D(uScene, luv + vec2(tx.x, 0.0)).rgb);
          float lx0 = luma(texture2D(uScene, luv - vec2(tx.x, 0.0)).rgb);
          float ly1 = luma(texture2D(uScene, luv + vec2(0.0, tx.y)).rgb);
          float ly0 = luma(texture2D(uScene, luv - vec2(0.0, tx.y)).rgb);
          float g = length(vec2(lx1 - lx0, ly1 - ly0));
          float e = smoothstep(0.055, 0.30, g);
          col += vec3(0.72, 0.80, 0.92) * e * uEdge * (1.0 - smoothstep(0.35, 0.9, l0));
        }

        /* ---- 6b · content occlusion -----------------------------------
           The DOM tells us where the words are (screen-space rects, updated
           from the runtime's own projection). The architecture is dimmed
           inside those rects with a soft 18 px shoulder, so the 3D can be
           bold everywhere else without ever fighting a paragraph. */
        if (uMaskStr > 0.001) {
          float occl = 0.0;
          for (int i = 0; i < 12; i++) {
            if (i >= uMaskCount) break;
            vec4 m = uMask[i];
            float dx = max(m.x - vUv.x, vUv.x - (m.x + m.z));
            float dy = max(m.y - vUv.y, vUv.y - (m.y + m.w));
            float d = max(dx, dy);
            occl = max(occl, 1.0 - smoothstep(-0.0015, 0.020, d));
          }
          col *= 1.0 - occl * uMaskStr;
        }

        /* ---- 7 · vignette ---------------------------------------------- */
        col *= 1.0 - uVignette * smoothstep(0.18, 0.92, r2 * 1.7);

        /* ---- 8 · grain (a photographic floor, not noise) --------------- */
        float g = hash21(gl_FragCoord.xy + fract(uTime) * 97.13) - 0.5;
        col += g * uGrain * (0.5 + r2 * 1.4);

        /* ---- 9 · blade glow + spectral flash --------------------------- */
        if (uWipe > 0.0001) {
          vec3 bc = ramp(fract(uv.x * 0.75 + uStation * 0.09 + uTime * 0.06));
          float hair = smoothstep(0.006, 0.0, abs(uv.y - sweepY));
          col += bc * blade * 0.36 * env;
          col += vec3(0.85, 0.94, 1.0) * hair * 0.55 * env;
        }
        if (uFlash > 0.0001) {
          col += ramp(fract(uv.x * 0.4 + uTime * 0.1)) * uFlash * 0.20;
        }

        /* ---- 10 · boot reveal: light rises through the frame ----------- */
        if (uReveal < 0.999) {
          float r = clamp(uReveal, 0.0, 1.0);
          col *= mix(0.48, 1.0, r);
          float sy = mix(1.20, -0.20, r);
          float band = smoothstep(0.11, 0.0, abs((1.0 - uv.y) - sy));
          col += ramp(uv.x * 0.6) * band * 0.16 * (1.0 - r);
        }

        /* ---- 11 · page fade + sRGB transfer ---------------------------- */
        col *= 1.0 - uFade;
        col = max(col, 0.0);
        vec3 lo = col * 12.92;
        vec3 hi = 1.055 * pow(col, vec3(1.0 / 2.4)) - 0.055;
        col = mix(lo, hi, step(vec3(0.0031308), col));

        gl_FragColor = vec4(col, 1.0);
      }
    `,
  });

  function setSize(w, h, pr) {
    W = w; H = h; PR = pr;
    const iw = Math.floor(w * pr), ih = Math.floor(h * pr);
    sceneRT.setSize(iw, ih);
    fieldRT.setSize(Math.max(2, Math.floor(iw / 3)), Math.max(2, Math.floor(ih / 3)));
    const q1 = Math.max(2, Math.floor(iw / 4)), q2 = Math.max(2, Math.floor(ih / 4));
    const e1 = Math.max(2, Math.floor(iw / 8)), e2 = Math.max(2, Math.floor(ih / 8));
    b1.setSize(q1, q2); b2.setSize(q1, q2);
    b3.setSize(e1, e2); b4.setSize(e1, e2);
    compositeMat.uniforms.uRes.value.set(iw, ih);
    compositeMat.uniforms.uAspect.value = iw / Math.max(1, ih);
    compositeMat.uniforms.uBloom1.value = b2.texture;
    compositeMat.uniforms.uBloom2.value = b4.texture;
    compositeMat.uniforms.uScene.value = sceneRT.texture;
    compositeMat.uniforms.uFieldTex.value = fieldRT.texture;
    fieldMat.uniforms.uAspect.value = iw / Math.max(1, ih);
  }

  function pass(material, target) {
    quad.material = material;
    renderer.setRenderTarget(target);
    renderer.render(quadScene, quadCam);
  }

  /* ---- content mask: the DOM is the authority on where words live ------- */
  let maskEls = null;
  let maskTick = 0;
  const maskRects = [];

  function refreshContentMask(w, h) {
    if (!maskEls || maskEls.length === 0) {
      maskEls = Array.from(document.querySelectorAll('[data-sp-station] .sp-panel'));
    }
    let n = 0;
    const list = compositeMat.uniforms.uMask.value;
    for (let i = 0; i < maskEls.length && n < 12; i++) {
      const el = maskEls[i];
      if (el.style.visibility === 'hidden') continue;
      const op = el.style.opacity === '' ? 1 : parseFloat(el.style.opacity);
      if (!(op > 0.15)) continue;
      const r = el.getBoundingClientRect();
      if (r.width < 10 || r.height < 10) continue;
      if (r.right < 0 || r.bottom < 0 || r.left > w || r.top > h) continue;
      const pad = 24;
      list[n].set(
        (r.left - pad) / w,
        (r.top - pad) / h,
        (r.width + pad * 2) / w,
        (r.height + pad * 2) / h
      );
      n++;
    }
    compositeMat.uniforms.uMaskCount.value = n;
    return n;
  }

  function render(scene, camera, state = {}) {
    /* QA/debug override: set __postChain.debug = { edge: .4, wipe: .5, … } from
       the console or a probe; it is merged over the runtime state every frame. */
    if (api && api.debug) state = Object.assign({}, state, api.debug);
    renderer.setRenderTarget(sceneRT);
    renderer.clear();
    renderer.render(scene, camera);

    /* screen-space occlusion rects: refreshed every 4th frame (layout reads are
       not free, panels only move when the camera moves) */
    if (++maskTick % 4 === 1) {
      try { refreshContentMask(window.innerWidth, window.innerHeight); } catch (e) { /* headless */ }
    }
    compositeMat.uniforms.uMaskStr.value = state.mask ?? 0.80;

    /* field: one cheap quarter-res pass, phase-locked to the floor */
    fieldMat.uniforms.uTime.value = state.time ?? 0;
    fieldMat.uniforms.uStation.value = state.station ?? 0;
    if (state.accent) {
      fieldMat.uniforms.uA.value.copy(state.accent.a || state.accent);
    }
    pass(fieldMat, fieldRT);

    brightMat.uniforms.uTex.value = sceneRT.texture;
    brightMat.uniforms.uThreshold.value = state.threshold ?? 0.72;
    pass(brightMat, b1);

    blurMat.uniforms.uTex.value = b1.texture;
    blurMat.uniforms.uRes.value.set(b1.width, b1.height);
    blurMat.uniforms.uDir.value.set(1, 0);
    pass(blurMat, b2);
    blurMat.uniforms.uTex.value = b2.texture;
    blurMat.uniforms.uDir.value.set(0, 1);
    pass(blurMat, b1);

    blurMat.uniforms.uTex.value = b1.texture;
    blurMat.uniforms.uRes.value.set(b3.width, b3.height);
    blurMat.uniforms.uDir.value.set(2.2, 0);
    pass(blurMat, b3);
    blurMat.uniforms.uTex.value = b3.texture;
    blurMat.uniforms.uDir.value.set(0, 2.2);
    pass(blurMat, b4);

    const u = compositeMat.uniforms;
    u.uTime.value = state.time ?? 0;
    u.uVel.value = state.velocity ?? 0;
    u.uExposure.value = state.exposure ?? 1.0;
    u.uReveal.value = state.reveal ?? 1;
    u.uFade.value = state.fade ?? 0;
    u.uWipe.value = state.wipe ?? 0;
    u.uFlash.value = state.flash ?? 0;
    u.uStation.value = state.station ?? 0;
    u.uField.value = state.field ?? 0.55;
    u.uPoster.value = state.poster ?? (quality.tier >= 2 ? 0.22 : 0.0);
    u.uEdge.value = state.edge ?? 0.0;
    pass(compositeMat, null);
  }

  const api = {
    sceneRT, fieldRT, setSize, render,
    resize(w, h, pr) { setSize(w, h, pr); },
    /** accent override: pass a hex or {a,b,c,d} hexes */
    setAccent(a, b, c, d) {
      const set = (u, v) => { if (v != null) u.value.set(v); };
      if (a && typeof a === 'object') {
        set(compositeMat.uniforms.uA, a.a); set(compositeMat.uniforms.uB, a.b);
        set(compositeMat.uniforms.uC, a.c); set(compositeMat.uniforms.uD, a.d);
        set(fieldMat.uniforms.uA, a.a); set(fieldMat.uniforms.uB, a.b);
        set(fieldMat.uniforms.uC, a.c); set(fieldMat.uniforms.uD, a.d);
        return;
      }
      set(compositeMat.uniforms.uA, a); set(compositeMat.uniforms.uB, b);
      set(compositeMat.uniforms.uC, c); set(compositeMat.uniforms.uD, d);
      set(fieldMat.uniforms.uA, a); set(fieldMat.uniforms.uB, b);
      set(fieldMat.uniforms.uC, c); set(fieldMat.uniforms.uD, d);
    },
    uniforms: compositeMat.uniforms,
    fieldUniforms: fieldMat.uniforms,
  };
  /* QA/debug handle: lets probes inspect + override the composite live */
  try { window.__postChain = api; } catch (e) { /* non-browser */ }
  return api;
}

/* ------------------------------------------------------------ env lace --- */
/* Thin architectural lines: instanced 1px LineSegments, additive, distance
   fade through vertex colors. This is the "hard line" fabric of the space.  */
export function makeLineLace(segments, color = 0x93b8d4, opacity = 0.5) {
  const positions = [];
  const colors = [];
  const c = new THREE.Color(color);
  segments.forEach(([a, b, w = 1]) => {
    positions.push(a[0], a[1], a[2], b[0], b[1], b[2]);
    colors.push(c.r * w, c.g * w, c.b * w, c.r * w, c.g * w, c.b * w);
  });
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  const mat = new THREE.LineBasicMaterial({
    vertexColors: true,
    transparent: true,
    opacity,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    fog: true,
  });
  const lines = new THREE.LineSegments(geo, mat);
  lines.frustumCulled = false;
  return lines;
}

/* ---------------------------------------------------------- camera rig --- */
export class CameraRig {
  constructor(camera) {
    this.camera = camera;
    this.pose = { pos: new THREE.Vector3(0, 1.6, 0), look: new THREE.Vector3(0, 1.6, -10), fov: 34, roll: 0 };
    this.cur = { pos: new THREE.Vector3(0, 1.6, 0), look: new THREE.Vector3(0, 1.6, -10), fov: 34, roll: 0 };
    this.pointer = { x: 0, y: 0 };
    this.pointerSmooth = { x: 0, y: 0 };
    this.time = 0;
    this.shake = 0;
    /* impulse used by the runtime for floor jumps: decays exponentially */
    this.kick = 0;
    this._wantPos = new THREE.Vector3();
    this._wantLook = new THREE.Vector3();
    this._off = new THREE.Vector3();
    this._m = new THREE.Matrix4();
    this._up = new THREE.Vector3(0, 1, 0);
    this.reduced = false;
  }

  /** camera nudge on a jump — 0..1 typical, stacks up to 2.4 */
  impulse(v = 1) {
    this.kick = Math.min(2.4, this.kick + v);
  }

  setPose(pose) {
    this.pose.pos.copy(pose.pos);
    this.pose.look.copy(pose.look);
    this.pose.fov = pose.fov ?? 34;
    this.pose.roll = pose.roll ?? 0;
  }

  update(dt, opts = {}) {
    this.time += dt;
    const lambda = opts.lambda ?? 7.5;
    const p = this.pointerSmooth;
    p.x = damp(p.x, this.pointer.x, 3.2, dt);
    p.y = damp(p.y, this.pointer.y, 3.2, dt);
    this.kick = damp(this.kick, 0, 3.2, dt);
    const kick = this.reduced ? 0 : this.kick;

    // idle drift — the camera is never perfectly still
    const idle = this.reduced ? 0 : 1;
    const dx = Math.sin(this.time * 0.17) * 0.075 * idle;
    const dy = Math.cos(this.time * 0.141) * 0.042 * idle;
    const dz = Math.sin(this.time * 0.107 + 1.1) * 0.09 * idle;

    // pointer parallax: shift the eye a little, the look target a lot
    const ex = p.x * 0.24;
    const ey = -p.y * 0.15;

    const wantPos = this._wantPos.copy(this.pose.pos)
      .add(this._off.set(ex + dx, ey + dy, dz));
    const wantLook = this._wantLook.copy(this.pose.look)
      .add(this._off.set(p.x * 0.92 + kick * 0.35, -p.y * 0.58 + dy * 0.4, 0));

    this.cur.pos.x = damp(this.cur.pos.x, wantPos.x, lambda, dt);
    this.cur.pos.y = damp(this.cur.pos.y, wantPos.y, lambda, dt);
    this.cur.pos.z = damp(this.cur.pos.z, wantPos.z, lambda, dt);
    this.cur.look.x = damp(this.cur.look.x, wantLook.x, lambda * 0.85, dt);
    this.cur.look.y = damp(this.cur.look.y, wantLook.y, lambda * 0.85, dt);
    this.cur.look.z = damp(this.cur.look.z, wantLook.z, lambda * 0.85, dt);

    this.camera.position.copy(this.cur.pos);
    this.camera.up.copy(this._up);
    this.camera.lookAt(this.cur.look);

    // subtle roll from the horizontal pointer position + a kick wobble
    const roll = this.pose.roll + p.x * 0.012 + kick * 0.016 * Math.sin(this.time * 11.0)
      + (this.reduced ? 0 : Math.sin(this.time * 0.19) * 0.002);
    this.camera.rotateZ(roll);

    const fov = damp(this.camera.fov, this.pose.fov + kick * 3.0, 5.5, dt);
    if (Math.abs(fov - this.camera.fov) > 0.0005) {
      this.camera.fov = fov;
      this.camera.updateProjectionMatrix();
    }
  }
}

/* -------------------------------------------------------- DOM projector -- */
/* Projects a set of anchor Object3Ds to CSS matrix3d, so real text stays
   pixel-crisp while living inside the 3D volume.                              */
export class DomProjector {
  constructor(camera) {
    this.camera = camera;
    this.entries = [];
    this._m = new THREE.Matrix4();
    this._nm = new THREE.Matrix4();
    this._v = new THREE.Vector3();
    this.fadeNear = 9;
    this.fadeFar = 30;
  }

  add(el, anchor, opts = {}) {
    const entry = {
      el,
      anchor,
      anchorX: opts.anchorX ?? 0,
      anchorY: opts.anchorY ?? 0,
      order: opts.order ?? 0,
      visible: true,
      opacity: 1,
      maxOpacity: opts.maxOpacity ?? 1,
      fadeNear: opts.fadeNear ?? this.fadeNear,
      fadeFar: opts.fadeFar ?? this.fadeFar,
    };
    this.entries.push(entry);
    el.style.transformOrigin = '0 0';
    return entry;
  }

  resize() { /* sizes are read from layout each frame */ }

  update(width, height, pxPerUnit) {
    // everything is expressed relative to the *screen* size in CSS px
    const m = this._m;
    for (let i = 0; i < this.entries.length; i++) {
      const e = this.entries[i];
      const el = e.el;
      const a = e.anchor;

      // world anchor -> clip
      a.updateMatrixWorld();
      const P = this.camera.projectionMatrix;
      const V = this.camera.matrixWorldInverse;

      // compose: clip = P * V * W * S * T(-0.5,0.5)
      // W maps the anchor plane (unit quad in local space) to the world.
      m.multiplyMatrices(P, V);
      m.multiply(a.matrixWorld);

      // local px -> anchor-local px: element (0,0) sits at the anchor point.
      // The basis uses +y = screen-down, matching CSS.
      const w = el.offsetWidth || 1;
      const h = el.offsetHeight || 1;
      const k = new THREE.Matrix4().set(
        1, 0, 0, -e.anchorX * w,
        0, 1, 0, -e.anchorY * h,
        0, 0, 1, 0,
        0, 0, 0, 1
      );
      m.multiply(k);

      // clip -> css px
      const S = new THREE.Matrix4().set(
        width / 2, 0, 0, width / 2,
        0, -height / 2, 0, height / 2,
        0, 0, 0.5, 0.5,
        0, 0, 0, 1
      );
      m.premultiply(S);

      el.style.transform = `matrix3d(${m.elements.map((n) => (Math.abs(n) < 1e-7 ? 0 : n)).join(',')})`;

      // distance driven opacity + skip when behind the eye
      this._v.setFromMatrixPosition(a.matrixWorld);
      const camZ = this._v.clone().applyMatrix4(V).z;
      let o = 1;
      if (camZ > -0.2) o = 0;
      else {
        const dist = -camZ;
        o = smoothstep(e.fadeFar, e.fadeNear, dist);
        if (o < 0.02) o = 0;
      }
      el.style.opacity = (o * e.maxOpacity).toFixed(3);
      const hidden = o < 0.02;
      if (hidden !== el._spHidden) {
        el.style.visibility = hidden ? 'hidden' : '';
        el._spHidden = hidden;
      }
    }
  }
}

/* ------------------------------------------------------------- input ----- */
export class SpaceInput {
  constructor(opts = {}) {
    this.pointer = { x: 0, y: 0 };
    this.target = { x: 0, y: 0 };
    this.hot = false;
    this.onJump = opts.onJump || (() => {});
    this.stationCount = opts.stationCount || 1;

    this._pointerMove = (e) => {
      const px = (e.clientX / window.innerWidth) * 2 - 1;
      const py = (e.clientY / window.innerHeight) * 2 - 1;
      this.target.x = clamp(px, -1, 1);
      this.target.y = clamp(py, -1, 1);
      document.body.classList.add('sp-has-pointer');
    };
    window.addEventListener('pointermove', this._pointerMove, { passive: true });

    this._key = (e) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const tag = (e.target && e.target.tagName) || '';
      if (/INPUT|TEXTAREA|SELECT/.test(tag)) return;
      const idx = this._stationFromScroll();
      switch (e.key) {
        case 'ArrowDown': case 'j': case 'PageDown':
          this.onJump(Math.min(this.stationCount - 1, Math.round(idx) + 1)); e.preventDefault(); break;
        case 'ArrowUp': case 'k': case 'PageUp':
          this.onJump(Math.max(0, Math.round(idx) - 1)); e.preventDefault(); break;
        case 'Home': this.onJump(0); e.preventDefault(); break;
        case 'End': this.onJump(this.stationCount - 1); e.preventDefault(); break;
        case 'Escape': this.onJump(null); break;
        default: {
          const n = parseInt(e.key, 10);
          if (n >= 1 && n <= this.stationCount) { this.onJump(n - 1); e.preventDefault(); }
        }
      }
    };
    window.addEventListener('keydown', this._key);

    // hover state for the custom cursor
    document.addEventListener('pointerover', (e) => {
      const hot = e.target.closest && e.target.closest('a, button, .sp-item, .sp-note, .sp-tool, .sp-tower');
      this.hot = !!hot;
      document.body.classList.toggle('sp-cursor-hot', this.hot);
    }, { passive: true });
  }

  _stationFromScroll() {
    const vh = window.innerHeight;
    return window.scrollY / vh;
  }

  update(dt) {
    this.pointer.x = damp(this.pointer.x, this.target.x, 6, dt);
    this.pointer.y = damp(this.pointer.y, this.target.y, 6, dt);
  }
}

/* --------------------------------------------------------- custom cursor -- */
export function makeCursor() {
  const el = document.createElement('div');
  el.className = 'sp-cursor';
  el.setAttribute('aria-hidden', 'true');
  document.body.appendChild(el);
  let x = window.innerWidth / 2, y = window.innerHeight / 2;
  let tx = x, ty = y;
  window.addEventListener('pointermove', (e) => { tx = e.clientX; ty = e.clientY; }, { passive: true });
  return {
    update(dt) {
      x = damp(x, tx, 18, dt);
      y = damp(y, ty, 18, dt);
      el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    },
  };
}

/* ------------------------------------------------------------ quality ---- */
export function detectQuality() {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const cores = navigator.hardwareConcurrency || 4;
  const mem = navigator.deviceMemory || 8;
  const mobile = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
  const dpr = window.devicePixelRatio || 1;

  const tier = mobile ? (cores >= 6 ? 2 : 1) : cores >= 8 ? 3 : cores >= 4 ? 2 : 1;
  return {
    tier,
    mobile,
    reduced,
    antialias: tier >= 2,
    maxDpr: tier >= 3 ? 1.85 : tier === 2 ? 1.4 : 1.05,
    shadow: false,
    mirrorScale: tier >= 3 ? 0.5 : tier === 2 ? 0.4 : 0.3,
    pixelRatio: Math.min(dpr, tier >= 3 ? 1.85 : 1.4),
  };
}

export function hasWebGL() {
  try {
    const c = document.createElement('canvas');
    return !!(window.WebGL2RenderingContext && c.getContext('webgl2'));
  } catch (e) {
    return false;
  }
}

export { THREE };
