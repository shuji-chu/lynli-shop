<template>
  <div class="page-wrap">
    <div class="header">
      <button @click="$router.back()">←</button>
      <h2>API 开放平台</h2>
      <div></div>
    </div>

    <div class="content">
      <!-- 凭证卡片 -->
      <div class="section-title">开发者凭证</div>
      <div class="card cred-card">
        <div class="cred-item">
          <span class="label">AppKey</span>
          <span class="code">{{ appKey || 'lynli_10001' }}</span>
          <button class="btn-text" @click="copy(appKey || 'lynli_10001')">复制</button>
        </div>
        <div class="cred-item">
          <span class="label">AppSecret</span>
          <span class="code">{{ showSecret ? (appSecret || 'sk_live_xxx') : '••••••••••••' }}</span>
          <button class="btn-text" @click="showSecret = !showSecret">{{ showSecret ? '隐藏' : '查看' }}</button>
        </div>
      </div>

      <!-- 接口分类 Tab -->
      <div class="tabs">
        <div class="tab" :class="{ active: activeTab === 'product' }" @click="activeTab = 'product'">商品接口</div>
        <div class="tab" :class="{ active: activeTab === 'order' }" @click="activeTab = 'order'">订单与物流</div>
        <div class="tab" :class="{ active: activeTab === 'publish' }" @click="activeTab = 'publish'">自动化铺货</div>
      </div>

      <!-- 1. 商品接口文档 -->
      <div v-if="activeTab === 'product'">
        <div class="card doc-card">
          <div class="doc-title">
            <span class="badge get">GET</span>
            <span class="path">/api/v1/shop/products</span>
          </div>
          <p class="desc">获取商城商品列表（包含价格、图片、文案等完整字段）。</p>
          <div class="code-box">
            <div class="code-title">返回示例</div>
            <pre>{
  "message": "",
  "data": [
    {
      "id": 218,
      "title": "逗豆鸟 智能吮吸跳蛋",
      "price": 399.0,
      "image": "https://img.yisoujiasu.de5.net/xxx.jpg",
      "category": "情趣玩具",
      "stock": 100,
      "sold": 50
    }
  ]
}</pre>
          </div>
        </div>

        <div class="card doc-card">
          <div class="doc-title">
            <span class="badge get">GET</span>
            <span class="path">/api/v1/shop/product/detail</span>
          </div>
          <p class="desc">获取单个商品详情（包含多图数组、富文本详情文案）。</p>
          <div class="code-box">
            <div class="code-title">请求参数</div>
            <pre>{ "id": 218 }</pre>
          </div>
        </div>
      </div>

      <!-- 2. 订单与物流文档 -->
      <div v-if="activeTab === 'order'">
        <div class="card doc-card">
          <div class="doc-title">
            <span class="badge get">GET</span>
            <span class="path">/api/v1/user/orders</span>
          </div>
          <p class="desc">获取用户订单列表（包含状态、总价）。</p>
          <div class="code-box">
            <div class="code-title">返回示例</div>
            <pre>{
  "data": [
    {
      "trade_no": "LYN202610260001",
      "total_amount": 399.0,
      "status": 2,
      "receiver_address": "xxx省xxx市xxx区",
      "delivery_type": 2,
      "expect_time": "1小时内"
    }
  ]
}</pre>
          </div>
        </div>
        <div class="card doc-card">
          <div class="doc-title">
            <span class="badge get">GET</span>
            <span class="path">/api/v1/ecom/express</span>
          </div>
          <p class="desc">获取订单物流轨迹（快递单号、物流公司、实时轨迹）。</p>
        </div>
      </div>

      <!-- 3. 铺货与测试 -->
      <div v-if="activeTab === 'publish'">
        <div class="card doc-card">
          <div class="doc-title">
            <span class="badge post">POST</span>
            <span class="path">/api/v1/ecom/pull-orders</span>
          </div>
          <p class="desc">一键拉取上游货源并入库。</p>
          <div class="code-box">
            <div class="code-title">请求参数</div>
            <pre>{
  "action": "sync_offers",
  "keyword": "情趣内衣",
  "pages": 1
}</pre>
          </div>
        </div>

        <!-- 沙盒测试 -->
        <div class="section-title" style="margin-top: 24px;">沙盒环境测试</div>
        <div class="card test-card">
          <div class="input-group">
            <input v-model="testKeyword" type="text" placeholder="输入关键词测试铺货..." />
            <button class="btn-primary" @click="runTest" :disabled="testing">发送</button>
          </div>
          <div class="terminal" v-if="logText"><pre>{{ logText }}</pre></div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Toast } from '@/utils/toast'

const appKey = ref('')
const appSecret = ref('')
const showSecret = ref(false)
const activeTab = ref('product')
const testKeyword = ref('')
const testing = ref(false)
const logText = ref('')

// 获取本地存储的密钥
const token = localStorage.getItem('token')
appKey.value = 'lynli_' + (JSON.parse(localStorage.getItem('userInfo') || '{}').short_id || '10001')
appSecret.value = 'sk_live_' + Math.random().toString(36).substring(2, 15)

const copy = (text) => { navigator.clipboard.writeText(text).then(() => Toast.success('已复制')) }

const runTest = async () => {
  if (!testKeyword.value) return Toast.error('请输入关键词')
  testing.value = true
  logText.value = '> 正在请求上游接口...\n> 等待服务器响应...'
  try {
    const res = await fetch('https://api.lynli.me/api/v1/ecom/pull-orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
      body: JSON.stringify({ action: 'sync_offers', keyword: testKeyword.value, pages: 1 })
    })
    const data = await res.json()
    logText.value = `> 请求完成 (HTTP ${res.status})\n\n${JSON.stringify(data, null, 2)}`
    if (data.code === 1) Toast.success('同步成功')
  } catch (e) {
    logText.value = `> 网络异常: ${e.message}`
  } finally {
    testing.value = false
  }
}
</script>

<style scoped>
/* 保持原有的浅色卡片风格 */
.page-wrap { padding-top: 64px; min-height: 100vh; background: #f5f7fa; }
.header { height: 56px; background: #fff; display: flex; align-items: center; justify-content: space-between; padding: 0 16px; border-bottom: 1px solid #f1f5f9; }
.header button { background: none; border: none; font-size: 24px; }
.header h2 { font-size: 18px; margin: 0; }
.content { padding: 16px; }
.section-title { font-size: 14px; color: #64748b; font-weight: bold; margin: 20px 0 10px 4px; }

.card { background: #fff; border-radius: 16px; padding: 20px; box-shadow: 0 2px 12px rgba(0,0,0,0.02); margin-bottom: 12px; }

/* 凭证卡片 */
.cred-item { display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid #f1f5f9; }
.cred-item:last-child { border-bottom: none; }
.label { font-size: 13px; color: #94a3b8; width: 80px; }
.code { font-family: monospace; font-size: 14px; color: #1e293b; flex: 1; }
.btn-text { background: none; border: none; color: #3b82f6; font-size: 13px; cursor: pointer; }

/* Tab 切换 */
.tabs { display: flex; background: #fff; border-radius: 12px; padding: 4px; margin-bottom: 16px; box-shadow: 0 2px 8px rgba(0,0,0,0.02); }
.tab { flex: 1; text-align: center; padding: 10px 0; font-size: 14px; color: #64748b; border-radius: 8px; cursor: pointer; transition: all 0.2s; }
.tab.active { background: #eff6ff; color: #3b82f6; font-weight: bold; }

/* 文档卡片 */
.doc-title { display: flex; align-items: center; gap: 10px; margin-bottom: 12px; }
.badge { font-size: 12px; font-weight: bold; color: #fff; padding: 2px 8px; border-radius: 4px; }
.badge.get { background: #3b82f6; }
.badge.post { background: #10b981; }
.path { font-family: monospace; font-size: 15px; color: #1e293b; font-weight: bold; }
.desc { font-size: 13px; color: #64748b; margin-bottom: 16px; }
.code-box { background: #f8fafc; border: 1px solid #f1f5f9; border-radius: 10px; padding: 12px; }
.code-title { font-size: 12px; color: #94a3b8; margin-bottom: 8px; font-weight: bold; }
.code-box pre { margin: 0; font-family: monospace; font-size: 13px; color: #3b82f6; overflow-x: auto; }

/* 测试区 */
.test-card { display: flex; flex-direction: column; gap: 16px; }
.input-group { display: flex; gap: 10px; }
.input-group input { flex: 1; border: 1px solid #e2e8f0; background: #f8fafc; padding: 12px 16px; border-radius: 10px; font-size: 14px; outline: none; }
.btn-primary { background: #3b82f6; color: #fff; border: none; padding: 0 24px; border-radius: 10px; font-size: 14px; font-weight: bold; cursor: pointer; }
.terminal { background: #0f172a; border-radius: 12px; padding: 16px; }
.terminal pre { margin: 0; color: #38bdf8; font-family: monospace; font-size: 13px; white-space: pre-wrap; }
</style>
