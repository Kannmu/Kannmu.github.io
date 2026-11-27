import { defineConfig, type ProxyOptions } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// Match the production Worker route in local dev and preview.
const gptImageProxy: Record<string, ProxyOptions> = {
  '/gpt-image-api': {
    target: 'https://bya.re',
    changeOrigin: true,
    secure: true,
    rewrite: (requestPath) => requestPath.replace(/^\/gpt-image-api/, ''),
    configure: (proxy) => {
      proxy.on('proxyReq', (proxyRequest) => {
        proxyRequest.removeHeader('origin')
        proxyRequest.removeHeader('referer')
      })
    }
  }
}

// https://vite.dev/config/
export default defineConfig(({  }) => {
  return {
    base: './',
    plugins: [
      vue(),
      tailwindcss(),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: { proxy: gptImageProxy },
    preview: { proxy: gptImageProxy },
  }
})
