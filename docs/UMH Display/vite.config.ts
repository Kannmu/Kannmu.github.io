import { defineConfig } from 'vite';

// Mirrors the GenPlant tool page on kannmu.top:
//   * the Vite root is a subfolder, so the repo root can hold tooling and docs
//   * relative base, because Jekyll serves the page from /UMH Display/dist/
//   * the compiled page lands in ../dist with Vite's hashed assets/ folder,
//     which is exactly what https://kannmu.top/UMH Display/dist/ serves.
export default defineConfig({
  root: 'web',
  base: './',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    chunkSizeWarningLimit: 1500,
    target: 'es2022',
    cssCodeSplit: true,
    assetsDir: 'assets',
    sourcemap: false
  },
  server: {
    host: true,
    port: 5180
  },
  preview: {
    port: 4180
  },
  worker: {
    format: 'es'
  }
});
