import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

// 生产环境：C 端站点部署在 https://www.lynli.me
// 所有业务数据通过 https://api.lynli.me 拉取（后端已配置 CORS 白名单）
export default defineConfig({
  plugins: [vue()],
  base: '/',
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    host: true,
    port: 5173,
    // 本地联调：把 .env 里的 VITE_API_BASE 设为空字符串 ''，
    // 请求会以相对路径 /api 发出，再由这里转发到真实后端（仅本地开发用）。
    proxy: {
      '/api': {
        target: 'https://api.lynli.me',
        changeOrigin: true,
        secure: true
      }
    }
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    chunkSizeWarningLimit: 1500
  }
})
