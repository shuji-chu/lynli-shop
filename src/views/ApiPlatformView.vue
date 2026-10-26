<template>
  <div class="page-wrap">
    <div class="header">
      <button @click="$router.back()">←</button>
      <h2>API 开放平台</h2>
      <div></div>
    </div>

    <div class="content">
      <!-- 凭证管理 -->
      <div class="cred-card">
        <div class="cred-title">开发者凭证 (AppKey & AppSecret)</div>
        <div v-if="!appKey" class="apply-box">
          <p>您还未申请 API 调用权限</p>
          <button class="apply-btn" @click="applyKeys">立即申请凭证</button>
        </div>
        <div v-else>
          <div class="cred-row">
            <span class="label">AppKey</span>
            <span class="val code">{{ appKey }}</span>
            <button class="copy-btn" @click="copy(appKey)">复制</button>
          </div>
          <div class="cred-row">
            <span class="label">AppSecret</span>
            <span class="val code">{{ appSecret }}</span>
            <button class="copy-btn" @click="copy(appSecret)">复制</button>
          </div>
        </div>
      </div>

      <!-- 接口文档 -->
      <div class="section-title">接口文档 (真实示例)</div>
      <div class="doc-card">
        <div class="doc-header">
          <span class="method post">POST</span>
          <span class="path">/api/v1/shop/auto-publish</span>
        </div>
        <p class="desc">传入关键词，系统将自动抓取上游货源并上架到您的商城。</p>
        
        <div class="code-block">
          <div class="code-title">请求示例 (JSON)</div>
          <pre>{
  "keyword": "智能震动棒"
}</pre>
        </div>
        
        <div class="code-block">
          <div class="code-title">返回示例 (JSON)</div>
          <pre>{
  "message": "铺货成功",
  "data": {
    "status": "success",
    "inserted": 1
  }
}</pre>
        </div>
      </div>

      <!-- 真实测试工具 -->
      <div class="section-title">接口在线测试</div>
      <div class="test-card">
        <input v-model="testKeyword" type="text" placeholder="输入要自动铺货的关键词..." />
        <button class="test-btn" @click="runTest" :disabled="testing">
          {{ testing ? '正在真实上架...' : '发起真实 API 请求' }}
        </button>
        <div class="log-box" v-if="logText">
          <pre>{{ logText }}</pre>
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
const testKeyword = ref('')
const testing = ref(false)
const logText = ref('')

const loadKeys = async () => {
  try {
    const res = await fetch('https://api.lynli.me/api/v1/dev/keys', {
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
    })
    const data = await res.json()
    if (data.data) {
      appKey.value = data.data.app_key
      appSecret.value = data.data.app_secret
    }
  } catch (e) {
    console.warn(e)
  }
}

onMounted(() => { loadKeys() })

const copy = (text) => { navigator.clipboard.writeText(text).then(() => Toast.success('已复制')) }

const applyKeys = () => {
  loadKeys()
  Toast.success('申请成功')
}

const runTest = async () => {
  if (!testKeyword.value) return Toast.error('请输入关键词')
  testing.value = true
  logText.value = '>>> 发送真实 API 请求...\n>>> 等待服务器落库...'
  
  try {
    const res = await fetch('https://api.lynli.me/api/v1/shop/auto-publish', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      },
      body: JSON.stringify({ keyword: testKeyword.value })
    })
    const data = await res.json()
    
    if (res.ok) {
      logText.value = `✅ 执行成功！\n返回数据: ${JSON.stringify(data, null, 2)}\n请去首页刷新查看新商品。`
      Toast.success('真实铺货成功！去首页看看')
    } else {
      logText.value = `❌ 失败: ${data.message || '未知错误'}`
    }
  } catch (e) {
    logText.value = `❌ 网络请求失败: ${e.message}`
  } finally {
    testing.value = false
  }
}
</script>

<style scoped>
.page-wrap { min-height: 100vh; background: #f8fafc; }
.header { height: 56px; background: #fff; display: flex; align-items: center; justify-content: space-between; padding: 0 16px; }
.header button { background: none; border: none; font-size: 24px; }
.header h2 { font-size: 18px; margin: 0; }
.content { padding: 16px; }

.cred-card { background: #1e293b; border-radius: 16px; padding: 20px; color: #fff; }
.cred-title { font-size: 14px; color: #94a3b8; margin-bottom: 16px; }
.apply-box { text-align: center; padding: 20px 0; }
.apply-btn { background: #3b82f6; color: #fff; border: none; padding: 8px 20px; border-radius: 8px; cursor: pointer; }
.cred-row { display: flex; align-items: center; justify-content: space-between; background: #0f172a; padding: 12px; border-radius: 8px; margin-bottom: 10px; }
.label { font-size: 12px; color: #64748b; width: 90px; }
.val.code { flex: 1; font-family: monospace; font-size: 13px; color: #38bdf8; }
.copy-btn { background: #3b82f6; color: #fff; border: none; padding: 4px 10px; border-radius: 6px; font-size: 12px; cursor: pointer; }

.section-title { font-size: 13px; color: #94a3b8; margin: 24px 0 8px; }
.doc-card { background: #fff; border-radius: 12px; padding: 16px; box-shadow: 0 2px 10px rgba(0,0,0,0.02); margin-bottom: 12px; }
.doc-header { display: flex; align-items: center; gap: 8px; margin-bottom: 10px; }
.method { font-size: 12px; font-weight: bold; color: #fff; padding: 2px 8px; border-radius: 4px; }
.method.post { background: #10b981; }
.path { font-family: monospace; font-size: 14px; font-weight: bold; color: #1e293b; }
.desc { font-size: 13px; color: #64748b; margin-bottom: 12px; }
.code-block { background: #0f172a; border-radius: 8px; padding: 12px; margin-bottom: 10px; }
.code-title { font-size: 11px; color: #94a3b8; margin-bottom: 6px; }
pre { margin: 0; color: #38bdf8; font-family: monospace; font-size: 12px; white-space: pre-wrap; }

.test-card { background: #fff; border-radius: 12px; padding: 16px; box-shadow: 0 2px 10px rgba(0,0,0,0.02); }
.test-card input { width: 100%; border: 1px solid #e2e8f0; padding: 12px; border-radius: 8px; font-size: 14px; outline: none; margin-bottom: 12px; box-sizing: border-box; }
.test-btn { width: 100%; background: #3b82f6; color: #fff; border: none; padding: 12px; border-radius: 8px; font-size: 15px; font-weight: bold; cursor: pointer; }
.log-box { margin-top: 12px; background: #0f172a; padding: 12px; border-radius: 8px; color: #10b981; font-family: monospace; font-size: 12px; overflow-x: auto; }
</style>
