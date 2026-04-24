import * as THREE from 'three';
import { PanoramaVideo } from './panorama-video';
import { HUDOverlay } from './hud-overlay';

export interface EngineConfig {
  hudFovDiagonal: number;
  hudDistance: number;
  hudOpacity: number;
  hudOffsetX: number;
  hudOffsetY: number;
  hudOffsetZ: number;
  hudScale: number;
  hudCurvature: number;
  sphereRadius: number;
  sphereSegments: number;
  videoVolume: number;
  videoPlaybackRate: number;
  videoRotationY: number;
  backgroundColor: string;
  showGrid: boolean;
  showFPS: boolean;
  stereoMode: string;
}

export const defaultConfig: EngineConfig = {
  hudFovDiagonal: 30,
  hudDistance: 2.0,
  hudOpacity: 1.0,
  hudOffsetX: 0,
  hudOffsetY: 0,
  hudOffsetZ: 0,
  hudScale: 1.0,
  hudCurvature: 0,
  sphereRadius: 500,
  sphereSegments: 64,
  videoVolume: 0.5,
  videoPlaybackRate: 1.0,
  videoRotationY: 0,
  backgroundColor: '#050505',
  showGrid: false,
  showFPS: true,
  stereoMode: 'mono',
};

export class XREngine {
  canvas: HTMLCanvasElement;
  renderer!: THREE.WebGLRenderer;
  scene!: THREE.Scene;
  camera!: THREE.PerspectiveCamera;
  xrSession: XRSession | null = null;
  gl!: WebGLRenderingContext;
  referenceSpace: XRReferenceSpace | null = null;
  panorama!: PanoramaVideo;
  hud!: HUDOverlay;
  config: EngineConfig = { ...defaultConfig };
  isXRActive = false;
  private animFrameId = 0;
  private fpsFrames = 0;
  private fpsTime = 0;
  private currentFps = 0;
  private fpsDisplay: HTMLDivElement | null = null;
  private gridHelper: THREE.GridHelper | null = null;
  onXRStateChanged?: (active: boolean) => void;
  onFPSUpdate?: (fps: number) => void;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
  }

  async init() {
    this.gl = this.canvas.getContext('webgl2', {
      xrCompatible: true,
      alpha: true,
      antialias: true,
    }) as WebGLRenderingContext;

    if (!this.gl) {
      this.gl = this.canvas.getContext('webgl', {
        xrCompatible: true,
        alpha: true,
        antialias: true,
      }) as WebGLRenderingContext;
    }

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      context: this.gl,
      alpha: true,
      antialias: true,
    });
    this.renderer.autoClear = false;
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.0;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
    this.camera.matrixAutoUpdate = false;
    this.camera.position.set(0, 0, 0);

    this.panorama = new PanoramaVideo(this.scene, this.config);
    await this.panorama.init();

    this.hud = new HUDOverlay(this.scene, this.camera, this.config);
    await this.hud.init();

    if (this.config.showGrid) this.addGrid();

    window.addEventListener('resize', () => this.onResize());
    this.onResize();
  }

  private onResize() {
    if (this.isXRActive) return;
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  async enterXR() {
    if (!navigator.xr) {
      alert('WebXR 不可用。请确保使用支持 WebXR 的浏览器。');
      return;
    }

    const supported = await navigator.xr.isSessionSupported('immersive-vr');
    if (!supported) {
      alert('当前设备不支持沉浸式 VR 会话。');
      return;
    }

    try {
      this.xrSession = await navigator.xr.requestSession('immersive-vr', {
        requiredFeatures: [],
        optionalFeatures: ['local-floor', 'bounded-floor'],
      });

      this.gl.makeXRCompatible?.();

      this.xrSession.updateRenderState({
        baseLayer: new XRWebGLLayer(this.xrSession, this.gl, {
          alpha: true,
          antialias: true,
        }),
      });

      this.referenceSpace = await this.xrSession.requestReferenceSpace('local');
      this.isXRActive = true;
      this.onXRStateChanged?.(true);

      this.xrSession.addEventListener('end', () => {
        this.isXRActive = false;
        this.xrSession = null;
        this.onXRStateChanged?.(false);
        this.onResize();
        this.startRenderLoop();
      });

      this.startXRRenderLoop();
    } catch (e) {
      console.error('进入 XR 失败:', e);
      alert('进入 XR 失败: ' + (e as Error).message);
    }
  }

  startRenderLoop() {
    const loop = () => {
      this.animFrameId = requestAnimationFrame(loop);
      this.updateFPS();
      this.renderer.clear();
      this.panorama.update();
      this.hud.update();
      this.renderer.render(this.scene, this.camera);
    };
    loop();
  }

  private startXRRenderLoop() {
    const onFrame = (time: number, frame: XRFrame) => {
      if (!this.xrSession) return;
      this.xrSession.requestAnimationFrame(onFrame);

      const pose = frame.getViewerPose(this.referenceSpace!);
      if (!pose) return;

      const gl = this.gl;
      gl.bindFramebuffer(gl.FRAMEBUFFER, this.xrSession.renderState.baseLayer!.framebuffer);

      this.renderer.clear();
      this.panorama.update();
      this.hud.update();

      for (const view of pose.views) {
        const viewport = this.xrSession!.renderState.baseLayer!.getViewport(view);
        if (!viewport) continue;

        this.renderer.setViewport(viewport.x, viewport.y, viewport.width, viewport.height);

        this.camera.matrix.fromArray(view.transform.matrix);
        this.camera.projectionMatrix.fromArray(view.projectionMatrix);
        this.camera.updateMatrixWorld(true);

        this.renderer.render(this.scene, this.camera);
      }
    };

    this.xrSession.requestAnimationFrame(onFrame);
  }

  private updateFPS() {
    this.fpsFrames++;
    const now = performance.now();
    if (now - this.fpsTime >= 1000) {
      this.currentFps = this.fpsFrames;
      this.fpsFrames = 0;
      this.fpsTime = now;
      this.onFPSUpdate?.(this.currentFps);
    }
  }

  addGrid() {
    if (this.gridHelper) this.scene.remove(this.gridHelper);
    this.gridHelper = new THREE.GridHelper(10, 20, 0x003300, 0x001a00);
    this.gridHelper.position.y = -1.5;
    this.scene.add(this.gridHelper);
  }

  removeGrid() {
    if (this.gridHelper) {
      this.scene.remove(this.gridHelper);
      this.gridHelper = null;
    }
  }

  updateConfig(key: keyof EngineConfig, value: any) {
    (this.config as any)[key] = value;
    if (key === 'showGrid') {
      value ? this.addGrid() : this.removeGrid();
    }
    this.panorama.updateConfig(this.config);
    this.hud.updateConfig(this.config);
  }

  async loadVideoFromFile(file: File) {
    const url = URL.createObjectURL(file);
    await this.panorama.loadVideo(url);
  }

  async loadVideoFromURL(url: string) {
    await this.panorama.loadVideo(url);
  }

  async loadBilibiliEmbed(bvid: string, cid?: string) {
    await this.hud.loadBilibiliInOverlay(bvid, cid);
  }
}
