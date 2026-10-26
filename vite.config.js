import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'
import { copyFileSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'

// 生产环境：C 端站点部署在 https://www.lynli.me
// 所有业务数据通过 https://api.lynli.me 拉取（后端已配置 CORS 白名单）
export default defineConfig({
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
  },
  // SPA 深链接兼容：静态托管（GitHub Pages 等）刷新 / 直接访问子路由时，
  // 通过 404.html 回退到应用外壳，由前端路由接管，避免 404。
  plugins: [
    vue(),
    {
      name: 'spa-404-fallback',
      apply: 'build',
      closeBundle() {
        const idx = resolve(process.cwd(), 'dist/index.html')
        const out = resolve(process.cwd(), 'dist/404.html')
        if (existsSync(idx)) copyFileSync(idx, out)
      }
    }
  ]
})
