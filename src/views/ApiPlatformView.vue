<template>
  <div class="page-wrap">
    <div class="header">
      <button @click="$router.back()">←</button>
      <h2>API 开放平台</h2>
      <div></div>
    </div>

    <div class="content">
      <!-- 1. 身份凭证卡片 -->
      <div class="cred-card">
        <div class="cred-title">开发者凭证 (用于调用全站接口)</div>
        <div class="cred-row">
          <span class="label">AppKey (专属ID)</span>
          <span class="val code">{{ appKey }}</span>
          <button class="copy-btn" @click="copy(appKey)">复制</button>
        </div>
        <div class="cred-row">
          <span class="label">AppSecret (密钥)</span>
          <span class="val code">{{ appSecret }}</span>
          <button class="copy-btn" @click="copy(appSecret)">复制</button>
        </div>
        <div class="cred-footer">
          <span>请妥善保管密钥，切勿泄露</span>
          <button class="reset-btn" @click="resetKey">重置密钥</button>
        </div>
      </div>

      <!-- 2. 一键测试工具 -->
      <div class="section-title">自动化铺货测试</div>
      <div class="test-card">
        <input v-model="testUrl" type="text" placeholder="输入 1688/淘宝 商品链接或关键词..." />
        <button class="test-btn" @click="runTest" :disabled="testing">
          {{ testing ? '正在抓取并洗图上架...' : '一键触发铺货' }}
        </button>
        <p class="log-tip" v-if="logText">{{ logText }}</p>
      </div>

      <!-- 3. 极简接口文档 -->
      <div class="section-title">核心接口文档</div>
      <div class="doc-card">
        <div class="doc-item">
          <div class="method post">POST</div>
          <div class="path">/api/v1/shop/auto-publish</div>
          <div class="desc">传入链接/关键词，自动洗图加价并上架到商城。</div>
        </div>
        <div class="doc-item">
          <div class="method get">GET</div>
          <div class="path">/api/v1/shop/products</div>
          <div class="desc">获取商城当前所有在售商品数据及实时库存。</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Toast } from '@/utils/toast'

const appKey = ref('')
const appSecret = ref('')
const testUrl = ref('')
const testing = ref(false)
const logText = ref('')

onMounted(() => {
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}')
  const shortId = userInfo.short_id || '10001'
  
  // 本地生成或从后端拉取（目前先在前端模拟出真密钥的质感）
  appKey.value = `lynli_${shortId}`
  appSecret.value = localStorage.getItem('api_secret') || `sk_live_${Math.random().toString(36).substring(2, 15)}`
  localStorage.setItem('api_secret', appSecret.value)
})

const copy = (text) => {
  navigator.clipboard.writeText(text).then(() => Toast.success('已复制'))
}

const resetKey = () => {
  if (confirm('重置后旧密钥将失效，确定吗？')) {
    appSecret.value = `sk_live_${Math.random().toString(36).substring(2, 15)}`
    localStorage.setItem('api_secret', appSecret.value)
    Toast.success('密钥已重置')
  }
}

const runTest = () => {
  if (!testUrl.value) return Toast.error('请输入链接或关键词')
  testing.value = true
  logText.value = '>>> 正在请求抓取接口...\n>>> 正在下载图片并通过 OSS 洗白...\n>>> 正在计算 1.5 倍利润率...'
  
  // 模拟请求延时
  setTimeout(() => {
    logText.value = '✅ 成功！商品已自动上架到首页。'
    testing.value = false
    Toast.success('测试铺货成功')
  }, 2500)
}
</script>

<style scoped>
.page-wrap { min-height: 100vh; background: #f8fafc; }
.header { height: 56px; background: #fff; display: flex; align-items: center; justify-content: space-between; padding: 0 16px; }
.header button { background: none; border: none; font-size: 24px; }
.header h2 { font-size: 18px; margin: 0; }
.content { padding: 16px; }

/* 凭证卡片 */
.cred-card { background: #1e293b; border-radius: 16px; padding: 20px; color: #fff; box-shadow: 0 10px 20px rgba(30,41,59,0.2); }
.cred-title { font-size: 14px; color: #94a3b8; margin-bottom: 16px; }
.cred-row { display: flex; align-items: center; justify-content: space-between; background: #0f172a; padding: 12px; border-radius: 8px; margin-bottom: 10px; }
.label { font-size: 12px; color: #64748b; width: 90px; }
.val.code { flex: 1; font-family: monospace; font-size: 13px; color: #38bdf8; overflow: hidden; text-overflow: ellipsis; }
.copy-btn { background: #3b82f6; color: #fff; border: none; padding: 4px 10px; border-radius: 6px; font-size: 12px; cursor: pointer; }
.cred-footer { display: flex; justify-content: space-between; align-items: center; margin-top: 10px; font-size: 12px; color: #64748b; }
.reset-btn { background: transparent; color: #ef4444; border: 1px solid #ef4444; padding: 4px 10px; border-radius: 6px; font-size: 12px; cursor: pointer; }

/* 测试区 */
.section-title { font-size: 13px; color: #94a3b8; margin: 24px 0 8px; }
.test-card { background: #fff; border-radius: 12px; padding: 16px; box-shadow: 0 2px 10px rgba(0,0,0,0.02); }
.test-card input { width: 100%; border: 1px solid #e2e8f0; padding: 12px; border-radius: 8px; font-size: 14px; outline: none; margin-bottom: 12px; box-sizing: border-box; background: #f8fafc; }
.test-btn { width: 100%; background: #3b82f6; color: #fff; border: none; padding: 12px; border-radius: 8px; font-size: 15px; font-weight: bold; cursor: pointer; }
.test-btn:disabled { background: #94a3b8; }
.log-tip { font-size: 12px; color: #10b981; background: #ecfdf5; padding: 12px; border-radius: 8px; margin-top: 12px; white-space: pre-wrap; font-family: monospace; line-height: 1.6; }

/* 文档区 */
.doc-card { background: #fff; border-radius: 12px; padding: 16px; box-shadow: 0 2px 10px rgba(0,0,0,0.02); }
.doc-item { border-bottom: 1px dashed #f1f5f9; padding-bottom: 12px; margin-bottom: 12px; }
.doc-item:last-child { border-bottom: none; padding-bottom: 0; margin-bottom: 0; }
.method { display: inline-block; font-size: 11px; font-weight: bold; color: #fff; padding: 2px 6px; border-radius: 4px; margin-bottom: 6px; }
.method.post { background: #10b981; }
.method.get { background: #3b82f6; }
.path { font-family: monospace; font-size: 14px; color: #1e293b; font-weight: bold; margin-bottom: 4px; }
.desc { font-size: 12px; color: #64748b; }
</style>
