import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'

// Same convention as CalcFlow / PhoLo / GenPlant:
//   - `base` comes from VITE_BASE_PATH (see .env.development / .env.production)
//   - production output is always written to ./dist inside this directory
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_')
  return {
    base: env.VITE_BASE_PATH || './',
    plugins: [vue()],
    build: {
      outDir: 'dist',
      emptyOutDir: true,
      chunkSizeWarningLimit: 1500
    },
    server: {
      host: true,
      port: 5175
    },
    preview: {
      port: 4175
    }
  }
})
