import { defineConfig, type ProxyOptions } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// The production site reaches bya.re through the Cloudflare Worker mounted at
// /gpt-image-api. Local dev / preview use the same paths through this proxy so
// the browser code never needs a different Base URL in development.
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
export default defineConfig({
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
  server: {
    proxy: gptImageProxy
  },
  preview: {
    proxy: gptImageProxy
  }
})
