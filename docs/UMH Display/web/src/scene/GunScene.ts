/**
 * The upward bottle-beam page: array at the bottom, a dark core inside a
 * glowing pressure wall, a trail, and an optional pressure slice.
 */
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { ELEMENT_XY_MM } from '../geometry/elements.ts';
import type { FieldMap } from '../ui/charts.ts';
import { disposeObject, glowSpriteTexture, rampColor } from './glow.ts';

export type GunView = 'scene' | 'slice';

interface CameraPose {
  position: THREE.Vector3;
  target: THREE.Vector3;
}

const POSES: Record<GunView, CameraPose> = {
  scene: { position: new THREE.Vector3(132, 108, 158), target: new THREE.Vector3(0, 52, 0) },
  slice: { position: new THREE.Vector3(0, 70, 225), target: new THREE.Vector3(0, 66, 0) }
};

export class GunScene {
  private readonly renderer: THREE.WebGLRenderer;
  private readonly scene = new THREE.Scene();
  private readonly camera: THREE.PerspectiveCamera;
  private readonly controls: OrbitControls;
  private readonly bottle = new THREE.Group();
  private readonly core: THREE.Mesh;
  private readonly wall: THREE.Mesh;
  private readonly rings: THREE.Mesh[] = [];
  private readonly beam: THREE.Mesh;
  private readonly bead: THREE.Sprite;
  private readonly beadMesh: THREE.Mesh;
  private readonly crosshair = new THREE.Group();
  private readonly slicePlane: THREE.Mesh;
  private sliceTexture: THREE.CanvasTexture | null = null;
  private readonly trailLine: THREE.Line;
  private readonly halo: THREE.Sprite;
  private readonly captureRings: THREE.Mesh[] = [];
  private readonly axis: THREE.Line;
  private readonly axisPositions = new Float32Array(6);
  private readonly trailPositions: Float32Array;
  private trailCount = 0;
  private view: GunView = 'scene';
  private active = false;
  private preview = false;
  private readonly ringBaseOpacity: number[] = [];
  private cameraTween: { from: CameraPose; to: CameraPose; t: number } | null = null;
  private readonly onResize: () => void;
  private frameHandle = 0;
  private visible = true;
  private lastTime = 0;
  private elapsed = 0;
  private fpsAccum = 0;
  private fpsFrames = 0;
  onStats: ((fps: number) => void) | null = null;

  constructor(
    canvas: HTMLCanvasElement,
    private readonly stage: HTMLElement
  ) {
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.2;

    this.camera = new THREE.PerspectiveCamera(44, 1, 1, 2400);
    this.camera.position.copy(POSES.scene.position);
    this.controls = new OrbitControls(this.camera, canvas);
    this.controls.target.copy(POSES.scene.target);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.08;
    this.controls.minDistance = 60;
    this.controls.maxDistance = 520;
    this.controls.maxPolarAngle = Math.PI * 0.52;
    this.controls.update();

    this.scene.add(new THREE.HemisphereLight(0xa9d8ff, 0x0a0d12, 1.1));
    const key = new THREE.DirectionalLight(0xffffff, 1.3);
    key.position.set(100, 160, 80);
    this.scene.add(key);
    const under = new THREE.PointLight(0x65d8e7, 90, 160, 2);
    under.position.set(0, 6, 0);
    this.scene.add(under);

    this.buildFloor();
    this.buildArray();

    // beam volume
    this.beam = new THREE.Mesh(
      new THREE.CylinderGeometry(7, 48, 100, 64, 1, true),
      new THREE.MeshBasicMaterial({
        color: 0x65d8e7,
        transparent: true,
        opacity: 0.026,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        side: THREE.DoubleSide
      })
    );
    this.beam.position.y = 50;
    this.scene.add(this.beam);

    // dark core (almost invisible by design) + pressure wall
    this.core = new THREE.Mesh(
      new THREE.SphereGeometry(1, 32, 24),
      new THREE.MeshBasicMaterial({ color: 0x010306 })
    );
    this.bottle.add(this.core);

    this.wall = new THREE.Mesh(
      new THREE.SphereGeometry(1, 56, 32),
      new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
        uniforms: {
          uColor: { value: new THREE.Color(0x65d8e7) },
          uAmber: { value: new THREE.Color(0xffb648) },
          uDim: { value: 1 }
        },
        vertexShader: `
          varying vec3 vNormal;
          varying vec3 vView;
          void main() {
            vNormal = normalize(normalMatrix * normal);
            vec4 mv = modelViewMatrix * vec4(position, 1.0);
            vView = normalize(-mv.xyz);
            gl_Position = projectionMatrix * mv;
          }`,
        fragmentShader: `
          varying vec3 vNormal;
          varying vec3 vView;
          uniform vec3 uColor;
          uniform vec3 uAmber;
          uniform float uDim;
          void main() {
            float fres = pow(1.0 - abs(dot(normalize(vNormal), normalize(vView))), 2.2);
            vec3 color = mix(uColor, uAmber, fres * 0.55);
            gl_FragColor = vec4(color, (0.035 + fres * 0.5) * uDim);
          }`
      })
    );
    this.bottle.add(this.wall);

    for (let i = 0; i < 3; i++) {
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(1, 0.035, 8, 96),
        new THREE.MeshBasicMaterial({
          color: i === 1 ? 0xffb648 : 0x65d8e7,
          transparent: true,
          opacity: 0.45 - i * 0.08,
          blending: THREE.AdditiveBlending,
          depthWrite: false
        })
      );
      ring.rotation.x = Math.PI / 2 + i * 0.32;
      ring.rotation.y = i * 0.6;
      this.bottle.add(ring);
      this.rings.push(ring);
      this.ringBaseOpacity.push((ring.material as THREE.MeshBasicMaterial).opacity);
    }

    this.halo = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: glowSpriteTexture(),
        color: 0x65d8e7,
        transparent: true,
        opacity: 0.32,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      })
    );
    this.halo.scale.setScalar(18);
    this.bottle.add(this.halo);

    for (const [radius, color, opacity] of [
      [1, 0x65d8e7, 0.42],
      [1.55, 0xffb648, 0.2]
    ] as Array<[number, number, number]>) {
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(1, 0.012, 6, 96),
        new THREE.MeshBasicMaterial({
          color,
          transparent: true,
          opacity,
          blending: THREE.AdditiveBlending,
          depthWrite: false
        })
      );
      ring.rotation.x = Math.PI / 2;
      ring.scale.setScalar(radius * 8);
      this.bottle.add(ring);
      this.captureRings.push(ring);
    }

    this.beadMesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.85, 28, 20),
      new THREE.MeshStandardMaterial({ color: 0xffd7a0, emissive: 0xff9a2a, emissiveIntensity: 3.2, roughness: 0.4 })
    );
    this.bottle.add(this.beadMesh);
    this.bead = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: glowSpriteTexture(),
        color: 0xffc46b,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      })
    );
    this.bead.scale.setScalar(7);
    this.bottle.add(this.bead);

    // crosshair at the aim
    const crossMaterial = new THREE.LineBasicMaterial({
      color: 0xffb648,
      transparent: true,
      opacity: 0.55,
      depthWrite: false
    });
    const arm = 5;
    this.crosshair.add(
      new THREE.LineSegments(
        new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(-arm, 0, 0),
          new THREE.Vector3(arm, 0, 0),
          new THREE.Vector3(0, -arm, 0),
          new THREE.Vector3(0, arm, 0),
          new THREE.Vector3(0, 0, -arm),
          new THREE.Vector3(0, 0, arm)
        ]),
        crossMaterial
      )
    );
    this.crosshair.visible = false;
    this.scene.add(this.crosshair);

    // trail
    this.trailPositions = new Float32Array(900 * 3);
    const trailGeometry = new THREE.BufferGeometry();
    trailGeometry.setAttribute('position', new THREE.BufferAttribute(this.trailPositions, 3));
    this.trailLine = new THREE.Line(
      trailGeometry,
      new THREE.LineBasicMaterial({
        color: 0xffb648,
        transparent: true,
        opacity: 0.5,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      })
    );
    this.trailLine.frustumCulled = false;
    this.scene.add(this.trailLine);

    const axisGeometry = new THREE.BufferGeometry();
    axisGeometry.setAttribute('position', new THREE.BufferAttribute(this.axisPositions, 3));
    this.axis = new THREE.Line(
      axisGeometry,
      new THREE.LineBasicMaterial({
        color: 0x65d8e7,
        transparent: true,
        opacity: 0.16,
        depthWrite: false
      })
    );
    this.axis.frustumCulled = false;
    this.scene.add(this.axis);

    // pressure slice
    this.slicePlane = new THREE.Mesh(
      new THREE.PlaneGeometry(118, 138),
      new THREE.MeshBasicMaterial({
        transparent: true,
        opacity: 0.92,
        side: THREE.DoubleSide,
        depthWrite: false
      })
    );
    this.slicePlane.position.set(0, 69, 0);
    this.slicePlane.visible = false;
    this.scene.add(this.slicePlane);

    this.bottle.visible = false;
    this.scene.add(this.bottle);

    const bounds = new THREE.Box3(new THREE.Vector3(-45, 40, -45), new THREE.Vector3(45, 120, 45));
    const box = new THREE.LineSegments(
      new THREE.EdgesGeometry(new THREE.BoxGeometry(90, 80, 90)),
      new THREE.LineDashedMaterial({ color: 0x7f8e9c, transparent: true, opacity: 0.22, dashSize: 2, gapSize: 2 })
    );
    box.computeLineDistances();
    box.position.copy(bounds.getCenter(new THREE.Vector3()));
    this.scene.add(box);

    const atmosphereGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(320 * 3);
    for (let i = 0; i < 320; i++) {
      const radius = 25 + Math.random() * 120;
      const angle = Math.random() * Math.PI * 2;
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = Math.random() * 140;
      positions[i * 3 + 2] = Math.sin(angle) * radius;
    }
    atmosphereGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    this.scene.add(
      new THREE.Points(
        atmosphereGeometry,
        new THREE.PointsMaterial({
          color: 0x65d8e7,
          size: 0.55,
          transparent: true,
          opacity: 0.4,
          blending: THREE.AdditiveBlending,
          depthWrite: false
        })
      )
    );

    this.onResize = () => this.resize();
    window.addEventListener('resize', this.onResize);
    new ResizeObserver(() => this.resize()).observe(stage);
    this.resize();
    this.lastTime = performance.now();
    this.animate = this.animate.bind(this);
    this.frameHandle = requestAnimationFrame(this.animate);
  }

  private buildFloor(): void {
    const gridMaterial = new THREE.LineBasicMaterial({ color: 0x223240, transparent: true, opacity: 0.34 });
    for (let radius = 12; radius <= 120; radius += 12) {
      const points: THREE.Vector3[] = [];
      for (let i = 0; i <= 128; i++) {
        const a = (i / 128) * Math.PI * 2;
        points.push(new THREE.Vector3(Math.cos(a) * radius, -2.2, Math.sin(a) * radius));
      }
      this.scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(points), gridMaterial));
    }
    const radial: THREE.Vector3[] = [];
    for (let i = 0; i < 36; i++) {
      const a = (i / 36) * Math.PI * 2;
      radial.push(new THREE.Vector3(0, -2.2, 0), new THREE.Vector3(Math.cos(a) * 120, -2.2, Math.sin(a) * 120));
    }
    this.scene.add(new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(radial), gridMaterial));
  }

  private buildArray(): void {
    const plate = new THREE.Mesh(
      new THREE.CylinderGeometry(52, 52, 3, 96),
      new THREE.MeshStandardMaterial({
        color: 0x101b25,
        metalness: 0.75,
        roughness: 0.32,
        emissive: 0x06141c,
        emissiveIntensity: 1
      })
    );
    plate.position.y = -1.6;
    this.scene.add(plate);

    const rim = new THREE.Mesh(
      new THREE.TorusGeometry(52, 0.5, 8, 160),
      new THREE.MeshBasicMaterial({ color: 0x65d8e7, transparent: true, opacity: 0.55 })
    );
    rim.rotation.x = Math.PI / 2;
    this.scene.add(rim);

    const geometry = new THREE.CylinderGeometry(2.1, 2.1, 3.2, 14);
    const material = new THREE.MeshStandardMaterial({ color: 0x334452, metalness: 0.85, roughness: 0.3 });
    const mesh = new THREE.InstancedMesh(geometry, material, ELEMENT_XY_MM.length);
    const matrix = new THREE.Matrix4();
    ELEMENT_XY_MM.forEach(([x, y], i) => {
      matrix.makeTranslation(x, 0.6, y);
      mesh.setMatrixAt(i, matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
    this.scene.add(mesh);
  }

  setTarget(position: readonly [number, number, number], splitMm: number, coreMm: number): void {
    const radius = Math.max(0.8, coreMm);
    this.bottle.position.set(position[0], position[2], position[1]);
    this.bottle.visible = true;
    this.core.scale.setScalar(radius);
    this.wall.scale.set(radius * 2.6, radius * 3.4, radius * 2.6);
    this.beadMesh.scale.setScalar(1);
    this.bead.scale.setScalar(Math.max(6, radius * 5.2));
    this.halo.scale.setScalar(Math.max(16, radius * 9));
    this.captureRings[0]?.scale.setScalar(Math.max(10, radius * 4.5));
    this.captureRings[1]?.scale.setScalar(Math.max(15, radius * 7));
    this.rings.forEach((ring, index) => {
      ring.scale.setScalar(radius * (2.1 + index * 0.55));
    });
    const height = Math.max(8, position[2]);
    this.beam.scale.set(1 + splitMm / 140, height / 100, 1 + splitMm / 140);
    this.beam.position.y = height / 2;
    this.crosshair.position.copy(this.bottle.position);
    this.crosshair.visible = this.view === 'scene';
    this.axisPositions[0] = 0;
    this.axisPositions[1] = 0;
    this.axisPositions[2] = 0;
    this.axisPositions[3] = position[0];
    this.axisPositions[4] = position[2];
    this.axisPositions[5] = position[1];
    (this.axis.geometry.getAttribute('position') as THREE.BufferAttribute).needsUpdate = true;

    const geometry = this.trailLine.geometry as THREE.BufferGeometry;
    const attr = geometry.getAttribute('position') as THREE.BufferAttribute;
    if (this.trailCount >= 900) {
      this.trailPositions.copyWithin(0, 3);
      this.trailCount = 899;
    }
    this.trailPositions[this.trailCount * 3] = position[0];
    this.trailPositions[this.trailCount * 3 + 1] = position[2];
    this.trailPositions[this.trailCount * 3 + 2] = position[1];
    this.trailCount++;
    attr.needsUpdate = true;
    geometry.setDrawRange(0, this.trailCount);
  }

  /** Dim, non-emitting preview of where the bottle would sit. */
  showPreview(position: readonly [number, number, number], splitMm: number, coreMm: number): void {
    this.setTarget(position, splitMm, coreMm);
    this.preview = true;
    this.active = false;
    this.bottle.visible = true;
    this.beam.visible = this.view === 'scene';
    this.crosshair.visible = this.view === 'scene';
    this.beadMesh.visible = false;
    this.bead.visible = false;
    this.trailLine.visible = false;
    (this.wall.material as THREE.ShaderMaterial).uniforms.uDim.value = 0.32;
    (this.beam.material as THREE.MeshBasicMaterial).opacity = 0.012;
    this.halo.material.opacity = 0.24;
    this.axis.visible = true;
    this.rings.forEach((ring, index) => {
      (ring.material as THREE.MeshBasicMaterial).opacity = this.ringBaseOpacity[index] * 0.5;
    });
    this.clearTrail();
  }

  clearTrail(): void {
    this.trailCount = 0;
    (this.trailLine.geometry as THREE.BufferGeometry).setDrawRange(0, 0);
  }

  setActive(active: boolean): void {
    this.active = active;
    this.preview = false;
    this.bottle.visible = active && this.view === 'scene';
    this.beam.visible = active && this.view === 'scene';
    this.crosshair.visible = active && this.view === 'scene';
    this.trailLine.visible = active;
    this.beadMesh.visible = active;
    this.bead.visible = active;
    (this.wall.material as THREE.ShaderMaterial).uniforms.uDim.value = 1;
    (this.beam.material as THREE.MeshBasicMaterial).opacity = 0.026;
    this.halo.material.opacity = 0.42;
    this.axis.visible = active;
    this.rings.forEach((ring, index) => {
      (ring.material as THREE.MeshBasicMaterial).opacity = this.ringBaseOpacity[index];
    });
  }

  setSlice(map: FieldMap | null): void {
    if (this.sliceTexture) {
      this.sliceTexture.dispose();
      this.sliceTexture = null;
    }
    if (!map) {
      this.slicePlane.visible = false;
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
    const material = this.slicePlane.material as THREE.MeshBasicMaterial;
    material.map = texture;
    material.needsUpdate = true;
    this.sliceTexture = texture;
    this.slicePlane.scale.set(
      (map.xMax - map.xMin) / 118,
      (map.yMax - map.yMin) / 138,
      1
    );
    this.slicePlane.position.set((map.xMin + map.xMax) / 2, (map.yMin + map.yMax) / 2, 0);
    this.slicePlane.visible = this.view === 'slice';
  }

  setView(view: GunView): void {
    this.view = view;
    this.slicePlane.visible = view === 'slice' && !!this.sliceTexture;
    const showBottle = view === 'scene' && (this.active || this.preview);
    this.beam.visible = showBottle;
    this.bottle.visible = showBottle;
    this.crosshair.visible = showBottle;
    this.controls.enableRotate = view === 'scene';
    this.startCameraTween(POSES[view]);
  }

  private startCameraTween(to: CameraPose): void {
    this.cameraTween = {
      from: { position: this.camera.position.clone(), target: this.controls.target.clone() },
      to: { position: to.position.clone(), target: to.target.clone() },
      t: 0
    };
  }

  resetView(): void {
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
  }

  private animate(now: number): void {
    const dt = Math.min(0.05, (now - this.lastTime) / 1000);
    this.lastTime = now;
    this.elapsed += dt;
    this.fpsAccum += dt;
    this.fpsFrames++;
    if (this.fpsAccum >= 0.5) {
      this.onStats?.(this.fpsFrames / this.fpsAccum);
      this.fpsAccum = 0;
      this.fpsFrames = 0;
    }
    if (this.cameraTween) {
      this.cameraTween.t = Math.min(1, this.cameraTween.t + dt * 1.9);
      const u = this.cameraTween.t;
      const ease = 1 - (1 - u) ** 3;
      this.camera.position.lerpVectors(this.cameraTween.from.position, this.cameraTween.to.position, ease);
      this.controls.target.lerpVectors(this.cameraTween.from.target, this.cameraTween.to.target, ease);
      if (u >= 1) this.cameraTween = null;
    }
    this.rings.forEach((ring, index) => {
      ring.rotation.z += dt * (0.3 + index * 0.18);
      ring.rotation.y += dt * 0.12;
    });
    this.captureRings.forEach((ring, index) => {
      ring.rotation.z -= dt * (0.18 + index * 0.1);
    });
    const pulse = 1 + Math.sin(this.elapsed * 2.4) * 0.06;
    this.bead.scale.setScalar(this.bead.scale.x * 0.98 + this.bead.scale.x * 0.02 * pulse);
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



