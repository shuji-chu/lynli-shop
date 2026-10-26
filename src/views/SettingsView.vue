<template>
  <div class="container settings-page">
    <!-- 顶部导航栏 -->
    <div class="header">
      <button class="back-btn" @click="$router.back()">
        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 18l-6-6 6-6"/></svg>
      </button>
      <h2>设置</h2>
      <div style="width: 24px;"></div>
    </div>

    <div class="scroll-content">
      <!-- 1. 账号与安全模块 -->
      <div class="section-title">账号与安全</div>
      <div class="section">
        <div class="item" @click="$router.push('/profile')">
          <span>个人信息</span>
          <span class="val">查看 &gt;</span>
        </div>
        <div class="item" @click="$router.push('/security')">
          <span>账号与安全</span>
          <span class="val">密码/绑定 &gt;</span>
        </div>
        <div class="item" @click="showToast('支付设置正在接入...')">
          <span>支付设置</span>
          <span class="val">支付宝/微信 &gt;</span>
        </div>
      </div>

      <!-- 2. 生态与拓展模块 -->
      <div class="section-title">生态与拓展</div>
      <div class="section">
        <div class="item" @click="$router.push('/merchant')">
          <span>商家入驻</span>
          <span class="val">成为供应商 &gt;</span>
        </div>
        <div class="item" @click="$router.push('/developer')">
          <span>API 开放平台</span>
          <span class="val">自动化/开发者 &gt;</span>
        </div>
      </div>

      <!-- 3. 通用设置模块 -->
      <div class="section-title">通用</div>
      <div class="section">
        <div class="item" @click="showToast('语言切换功能开发中...')">
          <span>地区与语言</span>
          <span class="val">简体中文 &gt;</span>
        </div>
        <div class="item" @click="$router.push('/help')">
          <span>帮助与反馈</span>
          <span class="val">联系客服 &gt;</span>
        </div>
        <div class="item" @click="showToast('LYNLI 泠礼 v1.0.0')">
          <span>关于 LYNLI</span>
          <span class="val">v1.0.0</span>
        </div>
      </div>

      <!-- 4. 退出登录 -->
      <div class="logout-box">
        <button class="logout-btn" @click="handleLogout">退出登录</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { Toast } from '@/utils/toast'

const router = useRouter()

const showToast = (msg) => {
  if (Toast && Toast.info) Toast.info(msg)
  else alert(msg)
}

const handleLogout = () => {
  if (confirm('确定要退出当前账号吗？')) {
    localStorage.removeItem('token')
    localStorage.removeItem('userInfo')
    if (Toast && Toast.success) Toast.success('已退出登录')
    router.push('/auth')
  }
}
</script>

<style scoped>
.settings-page { min-height: 100vh; background: #f5f7fa; padding-top: 60px; }
.header { position: fixed; top: 0; left: 0; right: 0; height: 60px; background: #fff; display: flex; align-items: center; justify-content: space-between; padding: 0 16px; z-index: 100; border-bottom: 1px solid #eee; }
.header h2 { font-size: 18px; margin: 0; color: #1e293b; }
.back-btn { background: none; border: none; cursor: pointer; color: #1e293b; padding: 0; display: flex; align-items: center; }

.scroll-content { padding-bottom: 40px; }

.section-title { font-size: 13px; color: #94a3b8; margin: 20px 16px 8px; }
.section { background: #fff; margin: 0 16px; border-radius: 12px; overflow: hidden; }

.item { display: flex; justify-content: space-between; align-items: center; padding: 16px; border-bottom: 1px solid #f1f5f9; cursor: pointer; font-size: 15px; color: #334155; }
.item:last-child { border-bottom: none; }
.item:active { background: #f8fafc; }
.val { color: #94a3b8; font-size: 14px; display: flex; align-items: center; gap: 4px; }

.logout-box { margin: 30px 16px; }
.logout-btn { width: 100%; padding: 16px; border-radius: 12px; border: none; background: #fff; color: #ef4444; font-size: 16px; font-weight: bold; cursor: pointer; box-shadow: 0 2px 8px rgba(0,0,0,0.02); }
.logout-btn:active { background: #fee2e2; }
</style>
