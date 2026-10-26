<template>
  <div class="page-wrap">
    <div class="header">
      <button @click="$router.back()">←</button>
      <h2>API 开放平台</h2>
      <div></div>
    </div>

    <div class="content">
      <!-- 开发者凭证卡片 -->
      <div class="section-title">开发者凭证</div>
      <div class="card">
        <div v-if="!appKey" class="apply-empty">
          <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="#cbd5e1" stroke-width="1.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
          <p>您还未获取开发者凭证</p>
          <button class="btn-primary" @click="applyKeys">立即申请</button>
        </div>
        <div v-else class="cred-content">
          <div class="cred-item">
            <div class="cred-label">AppKey</div>
            <div class="cred-val">
              <span class="code">{{ appKey }}</span>
              <button class="btn-text" @click="copy(appKey)">复制</button>
            </div>
          </div>
          <div class="cred-divider"></div>
          <div class="cred-item">
            <div class="cred-label">AppSecret</div>
            <div class="cred-val">
              <span class="code">{{ showSecret ? appSecret : '••••••••••••••••' }}</span>
              <button class="btn-text" @click="showSecret = !showSecret">
                {{ showSecret ? '隐藏' : '查看' }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 接口文档卡片 -->
      <div class="section-title">核心接口文档</div>
      <div class="card doc-card">
        <div class="doc-header">
          <span class="badge post">POST</span>
          <span class="path">/api/v1/shop/auto-publish</span>
        </div>
        <p class="desc">传入关键词，系统将自动匹配上游货源，洗白图片并加价上架到您的商城。</p>
        
        <div class="code-box">
          <div class="code-title">请求参数 (JSON)</div>
          <pre>{
  "keyword": "智能震动棒"
}</pre>
        </div>
        <div class="code-box">
          <div class="code-title">返回示例 (JSON)</div>
          <pre>{
  "message": "铺货成功",
  "data": { "inserted": 1 }
}</pre>
        </div>
      </div>

      <!-- 在线测试卡片 -->
      <div class="section-title">沙盒环境测试</div>
      <div class="card test-card">
        <div class="input-group">
          <input v-model="testKeyword" type="text" placeholder="输入关键词，如：情趣内衣" />
          <button class="btn-primary" @click="runTest" :disabled="testing || !appKey">
            {{ testing ? '执行中...' : '发送请求' }}
          </button>
        </div>
        <div class="terminal" v-if="logText">
          <div class="term-header">
            <span class="dot red"></span><span class="dot yellow"></span><span class="dot green"></span>
            <span class="term-title">Console</span>
          </div>
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
const showSecret = ref(false)
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
const applyKeys = () => { loadKeys(); Toast.success('申请成功') }

const runTest = async () => {
  if (!testKeyword.value) return Toast.error('请输入关键词')
  testing.value = true
  logText.value = '> 正在发送真实 API 请求...\n> 等待服务器处理...'
  
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
      logText.value = `> 请求成功 (HTTP 200)\n\n${JSON.stringify(data, null, 2)}\n\n> 已真实上架，请返回首页查看。`
      Toast.success('真实铺货成功')
    } else {
      logText.value = `> 请求失败\n\n${JSON.stringify(data, null, 2)}`
    }
  } catch (e) {
    logText.value = `> 网络异常: ${e.message}`
  } finally {
    testing.value = false
  }
}
</script>

<style scoped>
.page-wrap { min-height: 100vh; background: #f5f7fa; }
.header { height: 56px; background: #fff; display: flex; align-items: center; justify-content: space-between; padding: 0 16px; border-bottom: 1px solid #f1f5f9; }
.header button { background: none; border: none; font-size: 24px; color: #333; }
.header h2 { font-size: 18px; margin: 0; color: #1e293b; font-weight: bold; }

.content { padding: 16px; }
.section-title { font-size: 14px; color: #64748b; font-weight: bold; margin: 20px 0 10px 4px; }

.card { background: #fff; border-radius: 16px; padding: 20px; box-shadow: 0 2px 12px rgba(0,0,0,0.02); }

/* 申请空状态 */
.apply-empty { display: flex; flex-direction: column; align-items: center; gap: 12px; padding: 20px 0; }
.apply-empty p { font-size: 14px; color: #64748b; margin: 0; }
.btn-primary { background: #3b82f6; color: #fff; border: none; padding: 10px 24px; border-radius: 20px; font-size: 14px; font-weight: bold; cursor: pointer; }
.btn-primary:disabled { background: #cbd5e1; }

/* 凭证展示 */
.cred-content { display: flex; flex-direction: column; }
.cred-item { display: flex; justify-content: space-between; align-items: center; padding: 12px 0; }
.cred-label { font-size: 14px; color: #64748b; width: 80px; }
.cred-val { flex: 1; display: flex; justify-content: space-between; align-items: center; }
.code { font-family: monospace; font-size: 15px; color: #1e293b; font-weight: bold; letter-spacing: 0.5px; }
.btn-text { background: none; border: none; color: #3b82f6; font-size: 13px; cursor: pointer; padding: 4px 8px; }
.cred-divider { height: 1px; background: #f1f5f9; margin: 4px 0; }

/* 接口文档 */
.doc-card { display: flex; flex-direction: column; gap: 12px; }
.doc-header { display: flex; align-items: center; gap: 10px; }
.badge.post { background: #10b981; color: #fff; font-size: 12px; font-weight: bold; padding: 2px 8px; border-radius: 4px; }
.path { font-family: monospace; font-size: 15px; color: #1e293b; font-weight: bold; }
.desc { font-size: 13px; color: #64748b; margin: 0; line-height: 1.5; }

.code-box { background: #f8fafc; border: 1px solid #f1f5f9; border-radius: 10px; padding: 12px; }
.code-title { font-size: 12px; color: #94a3b8; margin-bottom: 8px; font-weight: bold; }
.code-box pre { margin: 0; font-family: monospace; font-size: 13px; color: #3b82f6; overflow-x: auto; }

/* 测试区 */
.test-card { display: flex; flex-direction: column; gap: 16px; }
.input-group { display: flex; gap: 10px; }
.input-group input { flex: 1; border: 1px solid #e2e8f0; background: #f8fafc; padding: 12px 16px; border-radius: 10px; font-size: 14px; outline: none; }

/* 终端模拟 */
.terminal { background: #0f172a; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
.term-header { background: #1e293b; padding: 8px 12px; display: flex; gap: 6px; align-items: center; }
.dot { width: 10px; height: 10px; border-radius: 50%; }
.dot.red { background: #ef4444; } .dot.yellow { background: #f59e0b; } .dot.green { background: #10b981; }
.term-title { font-size: 12px; color: #94a3b8; margin-left: 8px; font-family: monospace; }
.terminal pre { margin: 0; padding: 16px; color: #38bdf8; font-family: monospace; font-size: 13px; line-height: 1.6; white-space: pre-wrap; }
</style>
