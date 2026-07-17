import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_')
  const gptImageBaseUrl = env.VITE_GPT_IMAGE_BASE_URL || 'https://xkj.jisuanyun.vip'
  return {
    base: env.VITE_BASE_PATH || '/',
    plugins: [
      vue(),
      tailwindcss(),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      proxy: {
        '/gpt-image-api': {
          target: gptImageBaseUrl,
          changeOrigin: true,
          secure: true,
          rewrite: (requestPath) => requestPath.replace(/^\/gpt-image-api/, '')
        }
      }
    }
  }
})
