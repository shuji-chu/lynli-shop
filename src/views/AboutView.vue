<template>
  <div class="page-wrap">
    <div class="header">
      <button @click="$router.back()">←</button>
      <button class="back-btn" @click="$router.back()" style="background:none;border:none;font-size:24px;color:#1e293b;cursor:pointer;">←</button><h2>关于 LYNLI</h2>
      <div></div>
    </div>
    
    <div class="content">
      <div class="logo-box">
        <div class="logo">LYNLI</div>
        <p>版本 v1.0.0</p>
      </div>
      
      <div class="list">
        <!-- 官网支持点击复制 -->
        <div class="item" @click="copyUrl">
          <span>官网</span>
          <div class="val-row">
            <span class="text-gray">www.lynli.me</span>
            <span class="arrow">&gt;</span>
          </div>
        </div>
        
        <!-- 用户协议弹窗 -->
        <div class="item" @click="openModal('terms')">
          <span>用户协议</span>
          <div class="val-row">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#cbd5e1" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg>
          </div>
        </div>
        
        <!-- 隐私政策弹窗 -->
        <div class="item" @click="openModal('privacy')">
          <span>隐私政策</span>
          <div class="val-row">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#cbd5e1" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg>
          </div>
        </div>
      </div>
      
      <p class="copyright">© 2026 LYNLI 泠礼. All Rights Reserved.</p>
    </div>

    <!-- 引入全局的隐私协议弹窗组件 -->
    <PrivacyModal :show="showModal" :type="modalType" @close="showModal = false" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Toast } from '@/utils/toast'
import PrivacyModal from '@/components/PrivacyModal.vue' // 引入之前写好的弹窗组件

const showModal = ref(false)
const modalType = ref('privacy')

// 打开对应协议
const openModal = (type) => {
  modalType.value = type
  showModal.value = true
}

// 复制官网地址
const copyUrl = () => {
  navigator.clipboard.writeText('https://www.lynli.me').then(() => {
    Toast.success('官网地址已复制')
  })
}
</script>

<style scoped>
.page-wrap { min-height: 100vh; background: #f5f7fa; }
.header { height: 56px; background: #fff; display: flex; align-items: center; justify-content: space-between; padding: 0 16px; border-bottom: 1px solid #f1f5f9; }
.header button { background: none; border: none; font-size: 24px; color: #1e293b; }
.header h2 { font-size: 18px; margin: 0; color: #1e293b; }

.content { padding: 16px; }
.logo-box { display: flex; flex-direction: column; align-items: center; margin: 40px 0; }
.logo { font-size: 32px; font-weight: 900; color: #1e3a8a; letter-spacing: 2px; }
.logo-box p { font-size: 13px; color: #94a3b8; margin-top: 8px; }

.list { background: #fff; border-radius: 16px; padding: 0 16px; box-shadow: 0 2px 10px rgba(0,0,0,0.02); }
.item { display: flex; justify-content: space-between; align-items: center; padding: 18px 0; border-bottom: 1px solid #f1f5f9; font-size: 15px; color: #1e293b; cursor: pointer; }
.item:last-child { border-bottom: none; }
.item:active { background: #f8fafc; }

.val-row { display: flex; align-items: center; gap: 8px; }
.text-gray { color: #94a3b8; font-size: 14px; }

.copyright { text-align: center; font-size: 12px; color: #cbd5e1; margin-top: 40px; }
</style>
