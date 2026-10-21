/** Shared three.js helpers: glow sprites, radial textures, colour ramps. */
import * as THREE from 'three';

let glowTexture: THREE.Texture | null = null;

export function glowSpriteTexture(): THREE.Texture {
  if (glowTexture) return glowTexture;
  const size = 128;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  gradient.addColorStop(0, 'rgba(255,255,255,1)');
  gradient.addColorStop(0.18, 'rgba(255,235,190,0.95)');
  gradient.addColorStop(0.45, 'rgba(255,182,72,0.35)');
  gradient.addColorStop(0.75, 'rgba(255,140,40,0.08)');
  gradient.addColorStop(1, 'rgba(255,120,20,0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  glowTexture = texture;
  return texture;
}

let tableTex: THREE.Texture | null = null;

export function tableTexture(): THREE.Texture {
  if (tableTex) return tableTex;
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  const gradient = ctx.createRadialGradient(size / 2, size / 2, size * 0.05, size / 2, size / 2, size * 0.5);
  gradient.addColorStop(0, '#111a23');
  gradient.addColorStop(0.55, '#0b1118');
  gradient.addColorStop(0.9, '#070b10');
  gradient.addColorStop(1, '#05080b');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  tableTex = texture;
  return texture;
}

const RAMP: Array<[number, [number, number, number]]> = [
  [0, [3, 6, 10]],
  [0.22, [10, 38, 54]],
  [0.48, [40, 140, 160]],
  [0.7, [255, 166, 60]],
  [0.88, [255, 214, 140]],
  [1, [255, 248, 230]]
];

export function rampColor(t: number): [number, number, number] {
  const value = Math.max(0, Math.min(1, t));
  for (let i = 1; i < RAMP.length; i++) {
    if (value <= RAMP[i][0]) {
      const [a, ca] = RAMP[i - 1];
      const [b, cb] = RAMP[i];
      const u = (value - a) / (b - a);
      return [ca[0] + (cb[0] - ca[0]) * u, ca[1] + (cb[1] - ca[1]) * u, ca[2] + (cb[2] - ca[2]) * u];
    }
  }
  return RAMP[RAMP.length - 1][1];
}

export function disposeObject(root: THREE.Object3D): void {
  root.traverse((object) => {
    const mesh = object as THREE.Mesh;
    if (mesh.geometry) mesh.geometry.dispose();
    const material = mesh.material;
    if (Array.isArray(material)) material.forEach((entry) => entry.dispose());
    else if (material) {
      for (const value of Object.values(material as unknown as Record<string, unknown>)) {
        if (value instanceof THREE.Texture) (value as THREE.Texture).dispose();
      }
      material.dispose();
    }
  });
}

