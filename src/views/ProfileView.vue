<template>
  <div class="page-wrap">
    <div class="header">
      <button @click="$router.back()">←</button>
      <button class="back-btn" @click="$router.back()" style="background:none;border:none;font-size:24px;color:#1e293b;cursor:pointer;">←</button><h2>个人信息</h2>
      <div></div>
    </div>
    
    <div class="content">
      <div class="avatar-box">
        <img :src="myAvatar" class="avatar" />
        <span>点击更换头像</span>
      </div>

      <!-- 🚨 专属身份标识：5位数 ID -->
      <div class="form-item highlight">
        <label>专属 ID</label>
        <div class="id-action">
          <span class="id-text">{{ myShortId }}</span>
          <button class="copy-btn" @click="copyId">复制</button>
        </div>
      </div>
      <p class="id-tip">此 ID 为您的唯一标识，用于调用 API 及管理后台查询。</p>

      <div class="form-item">
        <label>昵称</label>
        <input v-model="nickname" type="text" placeholder="请输入昵称" />
      </div>
      
      <div class="form-item">
        <label>登录邮箱</label>
        <input :value="myEmail" disabled type="text" class="disabled" />
      </div>

      <button class="save-btn" @click="save">保存修改</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Toast } from '@/utils/toast'

// 安全读取本地用户信息
let myInfo = {}
try {
  myInfo = JSON.parse(localStorage.getItem('userInfo') || '{}')
} catch (e) {}

const nickname = ref(myInfo.nickname || '')
const myEmail = computed(() => myInfo.email || '未绑定')
const myAvatar = computed(() => myInfo.avatar || 'https://api.dicebear.com/7.x/initials/svg?seed=lynli&backgroundColor=3b82f6&textColor=ffffff')

// 获取 5 位数 ID（如果后端返回了，就用后端的；没有就兜底）
const myShortId = computed(() => {
  return myInfo.short_id || '10001'
})

const copyId = () => {
  // 调用剪贴板 API
  navigator.clipboard.writeText(String(myShortId.value)).then(() => {
    Toast.success('ID 已复制到剪贴板')
  }).catch(() => {
    Toast.error('复制失败，请手动选择复制')
  })
}

const save = () => {
  myInfo.nickname = nickname.value
  localStorage.setItem('userInfo', JSON.stringify(myInfo))
  Toast.success('保存成功')
}
</script>

<style scoped>
.page-wrap { padding-top: 64px; min-height: 100vh; background: #f5f7fa; }
.header { height: 56px; background: #fff; display: flex; align-items: center; justify-content: space-between; padding: 0 16px; }
.header button { background: none; border: none; font-size: 24px; color: #333; }
.header h2 { font-size: 18px; margin: 0; color: #1e293b; }

.content { padding: 16px; }

.avatar-box { display: flex; flex-direction: column; align-items: center; margin-bottom: 24px; gap: 8px; font-size: 13px; color: #3b82f6; }
.avatar { width: 80px; height: 80px; border-radius: 50%; border: 2px solid #fff; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }

.form-item { background: #fff; padding: 16px; border-radius: 12px; display: flex; align-items: center; margin-bottom: 12px; }
.form-item label { width: 80px; color: #64748b; font-size: 15px; }
.form-item input { flex: 1; border: none; outline: none; font-size: 15px; text-align: right; color: #1e293b; background: transparent; }
.form-item input.disabled { color: #94a3b8; }

/* 高亮展示 5 位数 ID */
.highlight { border: 1px solid #bfdbfe; background: #eff6ff; }
.id-action { flex: 1; display: flex; align-items: center; justify-content: flex-end; gap: 12px; }
.id-text { font-family: monospace; font-size: 18px; font-weight: bold; color: #1d4ed8; letter-spacing: 1px; }
.copy-btn { background: #3b82f6; color: #fff; border: none; padding: 4px 10px; border-radius: 6px; font-size: 12px; cursor: pointer; }
.copy-btn:active { background: #1e3a8a; }
.id-tip { font-size: 12px; color: #94a3b8; margin: -4px 4px 16px; line-height: 1.4; }

.save-btn { width: 100%; background: #3b82f6; color: #fff; border: none; padding: 14px; border-radius: 24px; font-size: 16px; font-weight: bold; margin-top: 24px; }
</style>
