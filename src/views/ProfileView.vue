<template>
  <div class="page-wrap">
    <div class="header"><button @click="$router.back()">←</button><h2>个人信息</h2><div></div></div>
    <div class="content">
      <div class="avatar-box">
        <img :src="myAvatar" class="avatar" />
        <span>点击更换头像</span>
      </div>
      <div class="form-item"><label>昵称</label><input v-model="nickname" type="text" placeholder="请输入昵称" /></div>
      <div class="form-item"><label>登录邮箱</label><input :value="myEmail" disabled type="text" class="disabled" /></div>
      <button class="save-btn" @click="save">保存修改</button>
    </div>
  </div>
</template>
<script setup>
import { ref, computed } from 'vue'
import { Toast } from '@/utils/toast'

// 安全读取，防止报错导致白屏
let myInfo = {}
try {
  myInfo = JSON.parse(localStorage.getItem('userInfo') || '{}')
} catch (e) {}

const nickname = ref(myInfo.nickname || '')
const myEmail = computed(() => myInfo.email || '未绑定')
const myAvatar = computed(() => myInfo.avatar || 'https://api.dicebear.com/7.x/initials/svg?seed=lynli&backgroundColor=3b82f6&textColor=ffffff')

const save = () => {
  myInfo.nickname = nickname.value
  localStorage.setItem('userInfo', JSON.stringify(myInfo))
  Toast.success('保存成功')
}
</script>
<style scoped>
.page-wrap { min-height: 100vh; background: #f5f7fa; }
.header { height: 56px; background: #fff; display: flex; align-items: center; justify-content: space-between; padding: 0 16px; }
.header button { background: none; border: none; font-size: 24px; }
.header h2 { font-size: 18px; margin: 0; }
.content { padding: 16px; }
.avatar-box { display: flex; flex-direction: column; align-items: center; margin-bottom: 24px; gap: 8px; font-size: 13px; color: #3b82f6; }
.avatar { width: 80px; height: 80px; border-radius: 50%; border: 2px solid #fff; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
.form-item { background: #fff; padding: 16px; border-radius: 12px; display: flex; align-items: center; margin-bottom: 12px; }
.form-item label { width: 80px; color: #64748b; }
.form-item input { flex: 1; border: none; outline: none; font-size: 15px; text-align: right; }
.form-item input.disabled { color: #94a3b8; }
.save-btn { width: 100%; background: #3b82f6; color: #fff; border: none; padding: 14px; border-radius: 24px; font-size: 16px; font-weight: bold; margin-top: 24px; }
</style>
