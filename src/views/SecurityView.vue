<template>
  <div class="security-page">
    <div class="header">
      <button class="back-btn" @click="$router.back()">
        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 18l-6-6 6-6"/></svg>
      </button>
      <h2>个人信息与安全</h2>
      <div style="width: 24px;"></div>
    </div>

    <div class="scroll-content">
      <!-- 1. 基础信息 -->
      <div class="section-title">基础信息</div>
      <div class="section">
        <div class="list-item" @click="showToast('头像修改功能开发中')">
          <span class="label">头像</span>
          <div class="value">
            <img :src="myAvatar" class="avatar" />
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#94a3b8" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg>
          </div>
        </div>
        
        <div class="list-item" @click="showToast('昵称修改功能开发中')">
          <span class="label">昵称</span>
          <div class="value">
            <span>{{ myNickname }}</span>
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#94a3b8" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg>
          </div>
        </div>

        <div class="list-item">
          <span class="label">专属 ID</span>
          <div class="value">
            <span class="id-text">{{ myShortId }}</span>
            <button class="copy-btn" @click="copyId">复制</button>
          </div>
        </div>

        <div class="list-item">
          <span class="label">登录邮箱</span>
          <div class="value">
            <span class="text-gray">{{ myEmail }}</span>
          </div>
        </div>
      </div>

      <!-- 2. 登录设备管理 -->
      <div class="section-title">登录设备管理</div>
      <div class="section">
        <div v-if="loadingDevices" class="loading-text">正在获取设备信息...</div>
        <div v-else-if="devices.length === 0" class="loading-text">暂无登录记录</div>
        <div v-else class="device-list">
          <div v-for="(dev, index) in devices" :key="dev.id || index" class="device-item">
            <div class="dev-icon">
              <svg v-if="isMobile(dev.ua)" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>
              <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
            </div>
            <div class="dev-info">
              <div class="dev-title">
                {{ parseDevice(dev.ua) }}
                <span class="current-tag" v-if="dev.is_current">当前设备</span>
              </div>
              <div class="dev-meta">IP: {{ dev.ip }} · {{ formatTime(dev.last_used_at) }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 3. 安全设置 -->
      <div class="section-title">安全设置</div>
      <div class="section">
        <div class="list-item" @click="showToast('修改密码接口正在开发中...')">
          <span class="label">修改登录密码</span>
          <div class="value">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#94a3b8" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg>
          </div>
        </div>
      </div>

      <!-- 4. 退出登录 -->
      <div class="logout-box">
        <button class="logout-btn" @click="handleLogout">退出当前账号</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Toast } from '@/utils/toast'

const router = useRouter()
const devices = ref([])
const loadingDevices = ref(true)

const userInfo = computed(() => {
  const data = localStorage.getItem('userInfo')
  if (!data) return {}
  try { return JSON.parse(data) } catch (e) { return {} }
})

const myAvatar = computed(() => userInfo.value.avatar || 'https://api.dicebear.com/7.x/initials/svg?seed=lynli&backgroundColor=3b82f6&textColor=ffffff')
const myNickname = computed(() => userInfo.value.nickname || '未设置')
const myEmail = computed(() => userInfo.value.email || '未绑定')
const myShortId = computed(() => userInfo.value.short_id || '10001')

const showToast = (msg) => {
  if (Toast && Toast.info) Toast.info(msg)
  else alert(msg)
}

const copyId = () => {
  navigator.clipboard.writeText(String(myShortId.value)).then(() => {
    Toast.success('ID 已复制')
  }).catch(() => {
    Toast.error('复制失败，请手动选择')
  })
}

function isMobile(ua) {
  if (!ua) return true
  return /Mobile|Android|iPhone/i.test(ua)
}

function parseDevice(ua) {
  if (!ua) return '未知设备'
  if (isMobile(ua)) {
    if (/iPhone/i.test(ua)) return 'iPhone 手机'
    if (/Android/i.test(ua)) return 'Android 手机'
    return '移动设备'
  } else {
    if (/Windows/i.test(ua)) return 'Windows 电脑'
    if (/Mac OS/i.test(ua)) return 'Mac 电脑'
    return '桌面设备'
  }
}

function formatTime(ts) {
  if (!ts) return ''
  const d = new Date(Number(ts) * 1000)
  const now = new Date()
  if (d.toDateString() === now.toDateString()) {
    return `今天 ${d.getHours().toString().padStart(2,'0')}:${d.getMinutes().toString().padStart(2,'0')}`
  }
  return `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`
}

async function loadDevices() {
  try {
    const token = localStorage.getItem('token')
    if (!token) return
    const res = await fetch('https://api.lynli.me/api/v1/passport/auth/devices', {
      method: 'GET',
      headers: { 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json' }
    })
    const data = await res.json()
    if (res.ok && Array.isArray(data.data)) {
      devices.value = data.data
    }
  } catch (e) {
    console.warn('获取设备失败', e)
  } finally {
    loadingDevices.value = false
  }
}

onMounted(() => {
  loadDevices()
})

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
.security-page { min-height: 100vh; background: #f5f7fa;  }
.header { position: fixed; top: 0; left: 0; right: 0; height: 60px; background: #fff; display: flex; align-items: center; justify-content: space-between; padding: 0 16px; z-index: 100; border-bottom: 1px solid #eee; }
.header h2 { font-size: 18px; margin: 0; color: #1e293b; }
.back-btn { background: none; border: none; cursor: pointer; color: #1e293b; padding: 0; display: flex; align-items: center; }

.scroll-content { padding-bottom: 40px; }
.section-title { font-size: 13px; color: #94a3b8; margin: 20px 16px 8px; }
.section { background: #fff; margin: 0 16px 16px; border-radius: 12px; overflow: hidden; }

.list-item { display: flex; justify-content: space-between; align-items: center; padding: 16px; border-bottom: 1px solid #f1f5f9; cursor: pointer; }
.list-item:last-child { border-bottom: none; }
.label { font-size: 15px; color: #334155; }
.value { display: flex; align-items: center; gap: 8px; font-size: 15px; color: #1e293b; }
.text-gray { color: #94a3b8; }
.avatar { width: 40px; height: 40px; border-radius: 50%; object-fit: cover; }

/* 专属 ID 高亮展示 */
.id-text { font-family: monospace; font-size: 16px; font-weight: bold; color: #1d4ed8; }
.copy-btn { background: #eff6ff; color: #3b82f6; border: none; padding: 4px 10px; border-radius: 6px; font-size: 12px; font-weight: bold; cursor: pointer; }
.copy-btn:active { background: #bfdbfe; }

/* 设备列表样式 */
.loading-text { padding: 20px; text-align: center; color: #94a3b8; font-size: 14px; }
.device-list { padding: 0 16px; }
.device-item { display: flex; gap: 12px; padding: 16px 0; border-bottom: 1px solid #f1f5f9; }
.device-item:last-child { border-bottom: none; }
.dev-icon { display: flex; align-items: center; justify-content: center; width: 36px; height: 36px; background: #eff6ff; color: #3b82f6; border-radius: 50%; flex-shrink: 0; }
.dev-icon svg { width: 20px; height: 20px; }
.dev-info { display: flex; flex-direction: column; justify-content: center; gap: 4px; }
.dev-title { font-size: 15px; color: #1e293b; font-weight: 500; display: flex; align-items: center; gap: 8px; }
.current-tag { font-size: 11px; background: #10b981; color: #fff; padding: 2px 6px; border-radius: 4px; }
.dev-meta { font-size: 12px; color: #94a3b8; }

.logout-box { margin: 24px 16px; }
.logout-btn { width: 100%; padding: 16px; border-radius: 12px; border: none; background: #fff; color: #ef4444; font-size: 16px; font-weight: bold; cursor: pointer; box-shadow: 0 2px 8px rgba(0,0,0,0.02); }
.logout-btn:active { background: #fee2e2; }
</style>
