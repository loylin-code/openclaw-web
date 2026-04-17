import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  base: './',  // 支持相对路径访问，可部署到任意子目录
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    port: 5173,
    proxy: {
      '/ws': {
        target: 'ws://localhost:18789',
        ws: true
      }
    }
  },
  optimizeDeps: {
    force: true,
    exclude: ['openclaw-webchat']
  }
})
