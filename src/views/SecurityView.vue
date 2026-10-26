<template>
  <div class="container security-page">
    <div class="header">
      <button class="back-btn" @click="$router.back()">
        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 18l-6-6 6-6"/></svg>
      </button>
      <h2>账号与安全</h2>
      <div style="width: 24px;"></div> <!-- 占位保持居中 -->
    </div>

    <div class="section">
      <!-- 头像 -->
      <div class="list-item">
        <span class="label">头像</span>
        <div class="value avatar-val">
          <img :src="myAvatar" class="avatar" />
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#94a3b8" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg>
        </div>
      </div>

      <!-- 昵称 -->
      <div class="list-item">
        <span class="label">昵称</span>
        <div class="value">
          <span>{{ myNickname }}</span>
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#94a3b8" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg>
        </div>
      </div>

      <!-- 登录邮箱（不可改） -->
      <div class="list-item">
        <span class="label">登录邮箱</span>
        <div class="value">
          <span class="text-gray">{{ myEmail }}</span>
        </div>
      </div>
    </div>

    <div class="section">
      <!-- 修改密码 -->
      <div class="list-item" @click="showToast('修改密码接口正在开发中...')">
        <span class="label">修改登录密码</span>
        <div class="value">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#94a3b8" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg>
        </div>
      </div>
    </div>

    <!-- 退出登录按钮放这里最标准 -->
    <div class="logout-box">
      <button class="logout-btn" @click="handleLogout">退出当前账号</button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { Toast } from '@/utils/toast'

const router = useRouter()

const userInfo = computed(() => {
  const data = localStorage.getItem('userInfo')
  if (!data) return {}
  try { return JSON.parse(data) } catch (e) { return {} }
})

const myAvatar = computed(() => userInfo.value.avatar || 'https://api.dicebear.com/7.x/initials/svg?seed=lynli&backgroundColor=3b82f6&textColor=ffffff')
const myShortId = computed(() => userInfo.value.short_id || "10001")
const myNickname = computed(() => userInfo.value.nickname || '未设置')
const myEmail = computed(() => userInfo.value.email || '未绑定')

const showToast = (msg) => {
  if (Toast && Toast.info) Toast.info(msg)
  else alert(msg)
}

function handleLogout() {
  if(confirm('确定要退出登录吗？')) {
    localStorage.removeItem('token')
    localStorage.removeItem('userInfo')
    if (Toast && Toast.success) Toast.success('已退出登录')
    router.push('/auth')
  }
}
</script>

<style scoped>
.security-page { min-height: 100vh; background: #f5f7fa; padding-top: 60px; }
.header { position: fixed; top: 0; left: 0; right: 0; height: 60px; background: #fff; display: flex; align-items: center; justify-content: space-between; padding: 0 16px; z-index: 100; border-bottom: 1px solid #eee; }
.header h2 { font-size: 18px; margin: 0; color: #1e293b; }
.back-btn { background: none; border: none; cursor: pointer; color: #1e293b; padding: 0; display: flex; align-items: center; }

.section { background: #fff; margin: 16px; border-radius: 12px; overflow: hidden; }
.list-item { display: flex; justify-content: space-between; align-items: center; padding: 16px; border-bottom: 1px solid #f1f5f9; cursor: pointer; }
.list-item:last-child { border-bottom: none; }
.label { font-size: 15px; color: #334155; }
.value { display: flex; align-items: center; gap: 8px; font-size: 15px; color: #1e293b; }
.text-gray { color: #94a3b8; }
.avatar-val { display: flex; align-items: center; gap: 8px; }
.avatar { width: 40px; height: 40px; border-radius: 50%; object-fit: cover; }

.logout-box { margin: 24px 16px; }
.logout-btn { width: 100%; padding: 16px; border-radius: 12px; border: none; background: #fff; color: #ef4444; font-size: 16px; font-weight: bold; cursor: pointer; box-shadow: 0 2px 8px rgba(0,0,0,0.02); }
.logout-btn:active { background: #fee2e2; }
</style>
