import * as THREE from 'three';
import type { EngineConfig } from './xr-engine';

export class PanoramaVideo {
  private scene: THREE.Scene;
  private config: EngineConfig;
  private video: HTMLVideoElement;
  private videoTexture!: THREE.VideoTexture;
  private sphere!: THREE.Mesh;
  private material!: THREE.MeshBasicMaterial;

  constructor(scene: THREE.Scene, config: EngineConfig) {
    this.scene = scene;
    this.config = config;
    this.video = document.createElement('video');
    this.video.crossOrigin = 'anonymous';
    this.video.loop = true;
    this.video.muted = true;
    this.video.playsInline = true;
    this.video.setAttribute('playsinline', '');
    this.video.setAttribute('webkit-playsinline', '');
  }

  async init() {
    this.videoTexture = new THREE.VideoTexture(this.video);
    this.videoTexture.minFilter = THREE.LinearFilter;
    this.videoTexture.magFilter = THREE.LinearFilter;
    this.videoTexture.format = THREE.RGBAFormat;
    this.videoTexture.colorSpace = THREE.SRGBColorSpace;

    const geometry = new THREE.SphereGeometry(
      this.config.sphereRadius,
      this.config.sphereSegments,
      this.config.sphereSegments / 2
    );
    geometry.scale(-1, 1, 1);

    this.material = new THREE.MeshBasicMaterial({
      map: this.videoTexture,
      side: THREE.FrontSide,
      transparent: false,
    });

    this.sphere = new THREE.Mesh(geometry, this.material);
    this.sphere.rotation.y = this.config.videoRotationY * Math.PI / 180;
    this.scene.add(this.sphere);
  }

  async loadVideo(url: string) {
    this.video.pause();
    this.video.src = url;
    this.video.load();
    try {
      await this.video.play();
    } catch {
      console.warn('自动播放被阻止，需要用户交互');
    }
  }

  update() {
    if (this.videoTexture && this.video.readyState >= this.video.HAVE_CURRENT_DATA) {
      this.videoTexture.needsUpdate = true;
    }
  }

  updateConfig(config: EngineConfig) {
    this.config = config;
    this.video.volume = config.videoVolume;
    this.video.playbackRate = config.videoPlaybackRate;
    this.sphere.rotation.y = config.videoRotationY * Math.PI / 180;

    if (this.sphere.geometry) {
      this.sphere.geometry.dispose();
      const newGeo = new THREE.SphereGeometry(
        config.sphereRadius,
        config.sphereSegments,
        config.sphereSegments / 2
      );
      newGeo.scale(-1, 1, 1);
      this.sphere.geometry = newGeo;
    }
  }

  getVideoElement(): HTMLVideoElement {
    return this.video;
  }
}
