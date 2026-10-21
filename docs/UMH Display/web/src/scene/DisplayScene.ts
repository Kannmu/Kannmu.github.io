/**
 * The down-firing display in three.js: table, 84-transducer array above it,
 * the LED painting, trap/device paths and a moving bead brush.
 */
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { Line2 } from 'three/addons/lines/Line2.js';
import { LineGeometry } from 'three/addons/lines/LineGeometry.js';
import { LineMaterial } from 'three/addons/lines/LineMaterial.js';
import { ELEMENT_XY_MM } from '../geometry/elements.ts';
import type { Plan } from '../motion/planner.ts';
import { disposeObject, glowSpriteTexture, rampColor, tableTexture } from './glow.ts';
import type { FieldMap } from '../ui/charts.ts';

export type DisplayView = 'scene' | 'plan' | 'field';

const TABLE_RADIUS = 64;
const ARRAY_HEIGHT = 95;
const PAINT_HEIGHT = 2.6;

interface CameraPose {
  position: THREE.Vector3;
  target: THREE.Vector3;
}

const POSES: Record<DisplayView, CameraPose> = {
  scene: { position: new THREE.Vector3(66, 56, 86), target: new THREE.Vector3(0, 3, 0) },
  plan: { position: new THREE.Vector3(0, 84, 0.01), target: new THREE.Vector3(0, 0, 0) },
  field: { position: new THREE.Vector3(0, 132, 0.01), target: new THREE.Vector3(0, 0, 0) }
};

export class DisplayScene {
  private readonly renderer: THREE.WebGLRenderer;
  private readonly scene = new THREE.Scene();
  private readonly camera: THREE.PerspectiveCamera;
  private readonly controls: OrbitControls;
  private readonly table = new THREE.Group();
  private readonly arrayGroup = new THREE.Group();
  private readonly painting = new THREE.Group();
  private readonly beams = new THREE.Group();
  private readonly atmosphere: THREE.Points;
  private readonly bead: THREE.Sprite;
  private readonly beadLight: THREE.PointLight;
  private readonly fieldPlane: THREE.Mesh;
  private fieldTexture: THREE.CanvasTexture | null = null;
  private figureLine: Line2 | null = null;
  private trapLine: THREE.Line | null = null;
  private devicePoints: THREE.Points | null = null;
  private simLine: THREE.Line | null = null;
  private targetLine: THREE.Line | null = null;
  private tail: THREE.Points;
  private tailPositions: Float32Array;
  private tailColors: Float32Array;
  private plan: Plan | null = null;
  private view: DisplayView = 'scene';
  private cameraTween: { from: CameraPose; to: CameraPose; t: number } | null = null;
  private readonly onResize: () => void;
  private frameHandle = 0;
  private visible = true;
  private lastTime = 0;
  private fps = 0;
  private fpsAccum = 0;
  private fpsFrames = 0;
  onStats: ((fps: number) => void) | null = null;

  constructor(
    private readonly canvas: HTMLCanvasElement,
    private readonly stage: HTMLElement
  ) {
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.12;

    this.camera = new THREE.PerspectiveCamera(42, 1, 1, 2400);
    this.camera.position.copy(POSES.scene.position);

    this.controls = new OrbitControls(this.camera, canvas);
    this.controls.target.copy(POSES.scene.target);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.07;
    this.controls.minDistance = 45;
    this.controls.maxDistance = 460;
    this.controls.maxPolarAngle = Math.PI * 0.495;
    this.controls.enablePan = true;
    this.controls.update();

    this.scene.add(new THREE.HemisphereLight(0xbcd8ff, 0x1a1208, 1.0));
    const key = new THREE.DirectionalLight(0xfff1dc, 1.7);
    key.position.set(80, 150, 90);
    this.scene.add(key);
    const cool = new THREE.PointLight(0x3ea8c8, 220, 220, 2);
    cool.position.set(-50, 40, -40);
    this.scene.add(cool);
    this.beadLight = new THREE.PointLight(0xffb648, 0, 90, 2);
    this.beadLight.position.set(0, 12, 0);
    this.scene.add(this.beadLight);

    this.buildTable();
    this.buildArray();
    this.scene.add(this.table, this.arrayGroup, this.painting, this.beams);

    const tailCount = 64;
    this.tailPositions = new Float32Array(tailCount * 3);
    this.tailColors = new Float32Array(tailCount * 3);
    const tailGeometry = new THREE.BufferGeometry();
    tailGeometry.setAttribute('position', new THREE.BufferAttribute(this.tailPositions, 3));
    tailGeometry.setAttribute('color', new THREE.BufferAttribute(this.tailColors, 3));
    this.tail = new THREE.Points(
      tailGeometry,
      new THREE.PointsMaterial({
        size: 5.2,
        map: glowSpriteTexture(),
        vertexColors: true,
        transparent: true,
        opacity: 0.95,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        sizeAttenuation: true
      })
    );
    this.tail.frustumCulled = false;
    this.tail.visible = false;
    this.scene.add(this.tail);

    this.bead = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: glowSpriteTexture(),
        color: 0xffd28a,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      })
    );
    this.bead.scale.setScalar(9);
    this.bead.visible = false;
    this.scene.add(this.bead);

    this.fieldPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(126, 126),
      new THREE.MeshBasicMaterial({
        transparent: true,
        opacity: 0.82,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        side: THREE.DoubleSide
      })
    );
    this.fieldPlane.rotation.x = -Math.PI / 2;
    this.fieldPlane.position.y = 0.32;
    this.fieldPlane.visible = false;
    this.scene.add(this.fieldPlane);

    const atmosphereGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(260 * 3);
    for (let i = 0; i < 260; i++) {
      const radius = 20 + Math.random() * 95;
      const angle = Math.random() * Math.PI * 2;
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = 8 + Math.random() * 110;
      positions[i * 3 + 2] = Math.sin(angle) * radius;
    }
    atmosphereGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    this.atmosphere = new THREE.Points(
      atmosphereGeometry,
      new THREE.PointsMaterial({
        color: 0xffc46b,
        size: 0.5,
        transparent: true,
        opacity: 0.34,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      })
    );
    this.scene.add(this.atmosphere);

    this.onResize = () => this.resize();
    window.addEventListener('resize', this.onResize);
    const observer = new ResizeObserver(() => this.resize());
    observer.observe(stage);
    this.resize();
    this.lastTime = performance.now();
    this.animate = this.animate.bind(this);
    this.frameHandle = requestAnimationFrame(this.animate);
  }

  private buildTable(): void {
    const disc = new THREE.Mesh(
      new THREE.CircleGeometry(TABLE_RADIUS, 128),
      new THREE.MeshStandardMaterial({ map: tableTexture(), roughness: 0.82, metalness: 0.18 })
    );
    disc.rotation.x = -Math.PI / 2;
    this.table.add(disc);

    const rim = new THREE.Mesh(
      new THREE.RingGeometry(TABLE_RADIUS - 0.7, TABLE_RADIUS + 0.2, 160),
      new THREE.MeshBasicMaterial({ color: 0xffb648, transparent: true, opacity: 0.18, side: THREE.DoubleSide })
    );
    rim.rotation.x = -Math.PI / 2;
    rim.position.y = 0.15;
    this.table.add(rim);

    const ringMaterial = new THREE.LineBasicMaterial({ color: 0x2c3d4b, transparent: true, opacity: 0.36 });
    for (let radius = 10; radius < TABLE_RADIUS; radius += 10) {
      const points: THREE.Vector3[] = [];
      for (let i = 0; i <= 128; i++) {
        const a = (i / 128) * Math.PI * 2;
        points.push(new THREE.Vector3(Math.cos(a) * radius, 0.18, Math.sin(a) * radius));
      }
      this.table.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(points), ringMaterial));
    }
    const radial: THREE.Vector3[] = [];
    for (let i = 0; i < 24; i++) {
      const a = (i / 24) * Math.PI * 2;
      radial.push(new THREE.Vector3(0, 0.18, 0), new THREE.Vector3(Math.cos(a) * TABLE_RADIUS, 0.18, Math.sin(a) * TABLE_RADIUS));
    }
    this.table.add(new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(radial), ringMaterial));

    const crossMaterial = new THREE.LineBasicMaterial({ color: 0xffb648, transparent: true, opacity: 0.18 });
    this.table.add(
      new THREE.LineSegments(
        new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(-TABLE_RADIUS, 0.2, 0),
          new THREE.Vector3(TABLE_RADIUS, 0.2, 0),
          new THREE.Vector3(0, 0.2, -TABLE_RADIUS),
          new THREE.Vector3(0, 0.2, TABLE_RADIUS)
        ]),
        crossMaterial
      )
    );
  }

  private buildArray(): void {
    this.arrayGroup.position.y = ARRAY_HEIGHT;
    const plate = new THREE.Mesh(
      new THREE.CylinderGeometry(52, 52, 3.2, 96),
      new THREE.MeshStandardMaterial({
        color: 0x101b25,
        metalness: 0.72,
        roughness: 0.34,
        transparent: true,
        opacity: 0.86,
        emissive: 0x07131c,
        emissiveIntensity: 1
      })
    );
    plate.position.y = 4;
    this.arrayGroup.add(plate);

    const rim = new THREE.Mesh(
      new THREE.TorusGeometry(52, 0.55, 8, 160),
      new THREE.MeshBasicMaterial({ color: 0xffb648, transparent: true, opacity: 0.7 })
    );
    rim.rotation.x = Math.PI / 2;
    rim.position.y = 2.4;
    this.arrayGroup.add(rim);

    const inner = new THREE.Mesh(
      new THREE.TorusGeometry(34, 0.22, 6, 128),
      new THREE.MeshBasicMaterial({ color: 0x65d8e7, transparent: true, opacity: 0.35 })
    );
    inner.rotation.x = Math.PI / 2;
    inner.position.y = 2.3;
    this.arrayGroup.add(inner);

    const geometry = new THREE.CylinderGeometry(2.1, 2.1, 3.4, 14);
    const material = new THREE.MeshStandardMaterial({ color: 0x334452, metalness: 0.85, roughness: 0.3 });
    const mesh = new THREE.InstancedMesh(geometry, material, ELEMENT_XY_MM.length);
    const matrix = new THREE.Matrix4();
    ELEMENT_XY_MM.forEach(([x, y], i) => {
      matrix.makeTranslation(x, 0.6, y);
      mesh.setMatrixAt(i, matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
    this.arrayGroup.add(mesh);

    const emitterPositions = new Float32Array(ELEMENT_XY_MM.length * 3);
    ELEMENT_XY_MM.forEach(([x, y], i) => {
      emitterPositions[i * 3] = x;
      emitterPositions[i * 3 + 1] = 0;
      emitterPositions[i * 3 + 2] = y;
    });
    const emitterGeometry = new THREE.BufferGeometry();
    emitterGeometry.setAttribute('position', new THREE.BufferAttribute(emitterPositions, 3));
    this.arrayGroup.add(
      new THREE.Points(
        emitterGeometry,
        new THREE.PointsMaterial({
          color: 0x65d8e7,
          size: 3.1,
          map: glowSpriteTexture(),
          transparent: true,
          opacity: 0.8,
          blending: THREE.AdditiveBlending,
          depthWrite: false
        })
      )
    );

    // four WS2812s around the rim
    const ledColors = [0xff3020, 0x20ff60, 0x2050ff, 0xffe0c0];
    ledColors.forEach((color, i) => {
      const led = new THREE.Mesh(
        new THREE.SphereGeometry(1.5, 16, 12),
        new THREE.MeshBasicMaterial({ color })
      );
      const angle = (i / 4) * Math.PI * 2 + Math.PI / 4;
      led.position.set(Math.cos(angle) * 47, 2.3, Math.sin(angle) * 47);
      this.arrayGroup.add(led);
      this.arrayGroup.add(new THREE.PointLight(color, 6, 22, 2).translateX(led.position.x).translateZ(led.position.z));
    });

    // very faint beam cone and element-to-centre lines
    const beamMaterial = new THREE.LineBasicMaterial({
      color: 0xffc46b,
      transparent: true,
      opacity: 0.02,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const beamPoints: THREE.Vector3[] = [];
    for (const [x, y] of ELEMENT_XY_MM) {
      beamPoints.push(new THREE.Vector3(x, 0, y), new THREE.Vector3(x * 0.25, -PAINT_HEIGHT - 40, y * 0.25));
    }
    this.beams.add(new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(beamPoints), beamMaterial));
    this.beams.position.y = ARRAY_HEIGHT - 2;
  }

  setPlan(plan: Plan | null): void {
    this.plan = plan;
    this.clearPlanObjects();
    if (!plan) {
      this.bead.visible = false;
      this.tail.visible = false;
      return;
    }
    const n = plan.beadX.length;
    const positions = new Float32Array((n + 1) * 3);
    const colors = new Float32Array((n + 1) * 3);
    for (let i = 0; i < n; i++) {
      positions[i * 3] = plan.beadX[i] * 1e3;
      positions[i * 3 + 1] = PAINT_HEIGHT;
      positions[i * 3 + 2] = plan.beadY[i] * 1e3;
      const lit = plan.ledR[i] + plan.ledG[i] + plan.ledB[i] > 6;
      colors[i * 3] = (lit ? plan.ledR[i] / 255 : 0.35) ** 1.1;
      colors[i * 3 + 1] = (lit ? plan.ledG[i] / 255 : 0.38) ** 1.1;
      colors[i * 3 + 2] = (lit ? plan.ledB[i] / 255 : 0.42) ** 1.1;
    }
    positions[n * 3] = positions[0];
    positions[n * 3 + 1] = PAINT_HEIGHT;
    positions[n * 3 + 2] = positions[2];
    colors[n * 3] = colors[0];
    colors[n * 3 + 1] = colors[1];
    colors[n * 3 + 2] = colors[2];

    const geometry = new LineGeometry();
    geometry.setPositions(positions);
    geometry.setColors(colors);
    const material = new LineMaterial({
      vertexColors: true,
      linewidth: 2.9,
      transparent: true,
      opacity: 0.72,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    material.resolution.set(this.canvas.clientWidth || 1, this.canvas.clientHeight || 1);
    this.figureLine = new Line2(geometry, material);
    this.figureLine.frustumCulled = false;
    this.painting.add(this.figureLine);

    // trap path (dashed)
    const trapPositions: THREE.Vector3[] = [];
    for (let i = 0; i < plan.trapX.length; i += 2) {
      trapPositions.push(new THREE.Vector3(plan.trapX[i] * 1e3, PAINT_HEIGHT - 1.2, plan.trapY[i] * 1e3));
    }
    trapPositions.push(trapPositions[0]?.clone() ?? new THREE.Vector3());
    const trapGeometry = new THREE.BufferGeometry().setFromPoints(trapPositions);
    this.trapLine = new THREE.Line(
      trapGeometry,
      new THREE.LineDashedMaterial({
        color: 0xa9b7c3,
        dashSize: 1.7,
        gapSize: 1.4,
        transparent: true,
        opacity: 0.34,
        depthWrite: false
      })
    );
    this.trapLine.computeLineDistances();
    this.painting.add(this.trapLine);

    // device points
    const pointPositions = new Float32Array(plan.points.length * 3);
    plan.points.forEach((point, i) => {
      pointPositions[i * 3] = point.xUm / 1000;
      pointPositions[i * 3 + 1] = PAINT_HEIGHT + 0.4;
      pointPositions[i * 3 + 2] = point.yUm / 1000;
    });
    const pointGeometry = new THREE.BufferGeometry();
    pointGeometry.setAttribute('position', new THREE.BufferAttribute(pointPositions, 3));
    this.devicePoints = new THREE.Points(
      pointGeometry,
      new THREE.PointsMaterial({
        color: 0xffb648,
        size: 1.5,
        transparent: true,
        opacity: 0.55,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      })
    );
    this.painting.add(this.devicePoints);

    // simulated bead
    if (plan.simBeadX && plan.simBeadY) {
      const simPoints: THREE.Vector3[] = [];
      for (let i = 0; i < plan.simBeadX.length; i += 3) {
        simPoints.push(new THREE.Vector3(plan.simBeadX[i] * 1e3, PAINT_HEIGHT + 0.9, plan.simBeadY[i] * 1e3));
      }
      this.simLine = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints(simPoints),
        new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.42, depthWrite: false })
      );
      this.painting.add(this.simLine);
    }

    // faint target outline
    const targetPoints: THREE.Vector3[] = [];
    for (let i = 0; i < plan.targetX.length; i++) {
      targetPoints.push(new THREE.Vector3(plan.targetX[i] * 1e3, PAINT_HEIGHT + 1.4, plan.targetY[i] * 1e3));
    }
    if (targetPoints.length > 1) {
      targetPoints.push(targetPoints[0].clone());
      this.targetLine = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints(targetPoints),
        new THREE.LineBasicMaterial({ color: 0x65d8e7, transparent: true, opacity: 0.16, depthWrite: false })
      );
      this.painting.add(this.targetLine);
    }

    this.setProgress(0, false);
  }

  private clearPlanObjects(): void {
    for (const object of [this.figureLine, this.trapLine, this.devicePoints, this.simLine, this.targetLine]) {
      if (!object) continue;
      object.parent?.remove(object);
      disposeObject(object);
    }
    this.figureLine = null;
    this.trapLine = null;
    this.devicePoints = null;
    this.simLine = null;
    this.targetLine = null;
  }

  /** phase in [0,1), playing controls whether the brush tail shows. */
  setProgress(phase: number, playing: boolean): void {
    if (!this.plan) return;
    const n = this.plan.beadX.length;
    if (n === 0) return;
    const head = Math.max(0, Math.min(n - 1, Math.floor(phase * n)));
    const x = this.plan.beadX[head] * 1e3;
    const z = this.plan.beadY[head] * 1e3;
    this.bead.position.set(x, PAINT_HEIGHT + 0.6, z);
    this.bead.visible = playing || phase > 0;
    this.beadLight.position.set(x, PAINT_HEIGHT + 4, z);
    this.beadLight.intensity = playing ? 26 : 8;
    this.beadLight.color.setRGB(1, 0.72, 0.3);

    const count = this.tailPositions.length / 3;
    if (!playing) {
      this.tail.visible = false;
      return;
    }
    this.tail.visible = true;
    for (let k = 0; k < count; k++) {
      const idx = (head - k * 2 + n * 2) % n;
      this.tailPositions[k * 3] = this.plan.beadX[idx] * 1e3;
      this.tailPositions[k * 3 + 1] = PAINT_HEIGHT + 0.7;
      this.tailPositions[k * 3 + 2] = this.plan.beadY[idx] * 1e3;
      const fade = (1 - k / count) ** 1.7;
      const r = this.plan.ledR[idx] / 255;
      const g = this.plan.ledG[idx] / 255;
      const b = this.plan.ledB[idx] / 255;
      this.tailColors[k * 3] = (r * 0.8 + 0.2) * fade;
      this.tailColors[k * 3 + 1] = (g * 0.8 + 0.2) * fade;
      this.tailColors[k * 3 + 2] = (b * 0.8 + 0.2) * fade;
    }
    const geometry = this.tail.geometry as THREE.BufferGeometry;
    (geometry.getAttribute('position') as THREE.BufferAttribute).needsUpdate = true;
    (geometry.getAttribute('color') as THREE.BufferAttribute).needsUpdate = true;
  }

  setField(map: FieldMap | null): void {
    if (this.fieldTexture) {
      this.fieldTexture.dispose();
      this.fieldTexture = null;
    }
    if (!map) {
      this.fieldPlane.visible = false;
      return;
    }
    const canvas = document.createElement('canvas');
    canvas.width = map.width;
    canvas.height = map.height;
    const ctx = canvas.getContext('2d')!;
    const image = ctx.createImageData(map.width, map.height);
    for (let y = 0; y < map.height; y++) {
      for (let x = 0; x < map.width; x++) {
        const value = map.values[(map.height - 1 - y) * map.width + x];
        const [r, g, b] = rampColor(value);
        const at = (y * map.width + x) * 4;
        image.data[at] = r;
        image.data[at + 1] = g;
        image.data[at + 2] = b;
        image.data[at + 3] = 255;
      }
    }
    ctx.putImageData(image, 0, 0);
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    const material = this.fieldPlane.material as THREE.MeshBasicMaterial;
    material.map = texture;
    material.needsUpdate = true;
    this.fieldTexture = texture;
    this.fieldPlane.visible = this.view === 'field';
  }

  setView(view: DisplayView): void {
    this.view = view;
    this.arrayGroup.visible = view === 'scene';
    this.beams.visible = view === 'scene';
    this.fieldPlane.visible = view === 'field' && !!this.fieldTexture;
    if (this.figureLine) (this.figureLine.material as LineMaterial).opacity = view === 'field' ? 0.44 : 0.62;
    this.startCameraTween(POSES[view]);
    if (view !== 'scene') {
      this.controls.enableRotate = false;
    } else {
      this.controls.enableRotate = true;
    }
  }

  private startCameraTween(to: CameraPose): void {
    this.cameraTween = {
      from: { position: this.camera.position.clone(), target: this.controls.target.clone() },
      to: { position: to.position.clone(), target: to.target.clone() },
      t: 0
    };
  }

  resetView(): void {
    this.setView(this.view === 'field' || this.view === 'plan' ? 'scene' : this.view);
    this.startCameraTween(POSES[this.view]);
  }

  setVisible(visible: boolean): void {
    if (this.visible === visible) return;
    this.visible = visible;
    cancelAnimationFrame(this.frameHandle);
    if (visible) {
      this.lastTime = performance.now();
      this.frameHandle = requestAnimationFrame(this.animate);
    }
  }

  resize(): void {
    const width = this.stage.clientWidth;
    const height = this.stage.clientHeight;
    if (width === 0 || height === 0) return;
    this.renderer.setSize(width, height, false);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    if (this.figureLine) (this.figureLine.material as LineMaterial).resolution.set(width, height);
  }

  private animate(now: number): void {
    const dt = Math.min(0.05, (now - this.lastTime) / 1000);
    this.lastTime = now;
    this.fpsAccum += dt;
    this.fpsFrames++;
    if (this.fpsAccum >= 0.5) {
      this.fps = this.fpsFrames / this.fpsAccum;
      this.fpsAccum = 0;
      this.fpsFrames = 0;
      this.onStats?.(this.fps);
    }
    if (this.cameraTween) {
      this.cameraTween.t = Math.min(1, this.cameraTween.t + dt * 1.9);
      const u = this.cameraTween.t;
      const ease = 1 - (1 - u) ** 3;
      this.camera.position.lerpVectors(this.cameraTween.from.position, this.cameraTween.to.position, ease);
      this.controls.target.lerpVectors(this.cameraTween.from.target, this.cameraTween.to.target, ease);
      if (u >= 1) this.cameraTween = null;
    }
    if (this.view === 'scene') this.atmosphere.rotation.y += dt * 0.014;
    this.controls.update();
    if (this.visible) {
      this.renderer.render(this.scene, this.camera);
      this.frameHandle = requestAnimationFrame(this.animate);
    }
  }

  dispose(): void {
    cancelAnimationFrame(this.frameHandle);
    window.removeEventListener('resize', this.onResize);
    this.controls.dispose();
    this.renderer.dispose();
    disposeObject(this.scene);
  }
}


