import * as THREE from 'three';
import type { EngineConfig } from './xr-engine';
import { ArexUIRenderer } from './arex-ui';

export class HUDOverlay {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private config: EngineConfig;
  private arexRenderer: ArexUIRenderer;
  private hudGroup!: THREE.Group;
  private hudMesh!: THREE.Mesh;
  private hudTexture!: THREE.CanvasTexture;
  private hudMaterial!: THREE.MeshBasicMaterial;
  private bilibiliIframe: HTMLIFrameElement | null = null;
  private bilibiliContainer: HTMLDivElement | null = null;

  constructor(scene: THREE.Scene, camera: THREE.PerspectiveCamera, config: EngineConfig) {
    this.scene = scene;
    this.camera = camera;
    this.config = config;
    this.arexRenderer = new ArexUIRenderer();
  }

  async init() {
    this.arexRenderer.init();
    const canvas = this.arexRenderer.getCanvas();

    this.hudTexture = new THREE.CanvasTexture(canvas);
    this.hudTexture.minFilter = THREE.LinearFilter;
    this.hudTexture.magFilter = THREE.LinearFilter;
    this.hudTexture.format = THREE.RGBAFormat;
    this.hudTexture.generateMipmaps = false;

    this.hudMaterial = new THREE.MeshBasicMaterial({
      map: this.hudTexture,
      transparent: true,
      opacity: this.config.hudOpacity,
      side: THREE.DoubleSide,
      depthTest: false,
      depthWrite: false,
    });

    const dims = this.calculateHUDDimensions();
    const geometry = new THREE.PlaneGeometry(dims.width, dims.height);

    this.hudMesh = new THREE.Mesh(geometry, this.hudMaterial);
    this.hudMesh.renderOrder = 999;

    this.hudGroup = new THREE.Group();
    this.hudGroup.add(this.hudMesh);
    this.hudGroup.position.set(0, 0, -this.config.hudDistance);

    this.scene.add(this.hudGroup);
  }

  private calculateHUDDimensions(): { width: number; height: number } {
    const aspect = 640 / 480;
    const fovDiagRad = (this.config.hudFovDiagonal * Math.PI) / 180;
    const diag = 2 * this.config.hudDistance * Math.tan(fovDiagRad / 2);
    const h = diag / Math.sqrt(1 + aspect * aspect);
    const w = h * aspect;
    return { width: w * this.config.hudScale, height: h * this.config.hudScale };
  }

  update() {
    this.arexRenderer.update();
    this.hudTexture.needsUpdate = true;

    this.hudGroup.position.set(
      this.config.hudOffsetX,
      this.config.hudOffsetY,
      -this.config.hudDistance + this.config.hudOffsetZ
    );

    const cam = this.camera;
    this.hudGroup.quaternion.copy(cam.quaternion);
  }

  updateConfig(config: EngineConfig) {
    this.config = config;
    this.hudMaterial.opacity = config.hudOpacity;

    const dims = this.calculateHUDDimensions();
    this.hudMesh.geometry.dispose();
    this.hudMesh.geometry = new THREE.PlaneGeometry(dims.width, dims.height);

    this.hudGroup.position.set(
      config.hudOffsetX,
      config.hudOffsetY,
      -config.hudDistance + config.hudOffsetZ
    );

    this.arexRenderer.updateConfig(config);
  }

  async loadBilibiliInOverlay(bvid: string, cid?: string) {
    if (this.bilibiliContainer) {
      document.body.removeChild(this.bilibiliContainer);
    }

    this.bilibiliContainer = document.createElement('div');
    this.bilibiliContainer.style.cssText = `
      position:fixed; top:0; left:0; width:100vw; height:100vh;
      z-index:-1; pointer-events:none; opacity:0;
    `;

    this.bilibiliIframe = document.createElement('iframe');
    let src = `//player.bilibili.com/player.html?isOutside=true&bvid=${bvid}`;
    if (cid) src += `&cid=${cid}`;
    src += '&p=1&autoplay=1';
    this.bilibiliIframe.src = src;
    this.bilibiliIframe.style.cssText = 'width:100%;height:100%;border:none;';
    this.bilibiliIframe.allowFullscreen = true;
    this.bilibiliIframe.setAttribute('allow', 'autoplay; fullscreen');

    this.bilibiliContainer.appendChild(this.bilibiliIframe);
    document.body.appendChild(this.bilibiliContainer);
  }

  getArexRenderer(): ArexUIRenderer {
    return this.arexRenderer;
  }
}
