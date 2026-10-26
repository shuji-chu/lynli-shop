<template>
  <div class="page-wrap">
    <!-- 标准返回头部 -->
    <div class="header">
      <button class="back-btn" @click="$router.back()">←</button>
      <h2>帮助与反馈</h2>
      <div style="width: 24px;"></div>
    </div>

    <div class="content">
      <!-- 搜索框 UI -->
      <div class="search-box">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#94a3b8" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
        <input type="text" placeholder="搜索您的问题..." />
      </div>

      <!-- 快捷分类 -->
      <div class="category-grid">
        <div class="cat-item" @click="scrollToFaq('account')">
          <div class="cat-icon" style="background: #eff6ff; color: #3b82f6;">👤</div>
          <span>账号问题</span>
        </div>
        <div class="cat-item" @click="scrollToFaq('pay')">
          <div class="cat-icon" style="background: #ecfdf5; color: #10b981;">💳</div>
          <span>支付与退款</span>
        </div>
        <div class="cat-item" @click="scrollToFaq('logistics')">
          <div class="cat-icon" style="background: #fffbeb; color: #f59e0b;">📦</div>
          <span>物流与售后</span>
        </div>
        <div class="cat-item" @click="scrollToFaq('privacy')">
          <div class="cat-icon" style="background: #fdf4ff; color: #d946ef;">🔒</div>
          <span>隐私政策</span>
        </div>
      </div>

      <!-- FAQ 列表 -->
      <div class="section-title">常见问题</div>
      <div class="faq-list">
        <div class="faq-item" id="faq-account" @click="toggle(1)">
          <div class="q">
            <span>怎么修改我的昵称和头像？</span>
            <svg viewBox="0 0 24 24" width="16" height="16" :class="{ 'rotate': openIdx === 1 }" fill="none" stroke="#94a3b8" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg>
          </div>
          <div class="a" v-if="openIdx === 1">请在“我的”页面，点击右上角齿轮进入设置，选择“个人信息与安全”即可进行修改。</div>
        </div>

        <div class="faq-item" id="faq-pay" @click="toggle(2)">
          <div class="q">
            <span>支持哪些支付方式？</span>
            <svg viewBox="0 0 24 24" width="16" height="16" :class="{ 'rotate': openIdx === 2 }" fill="none" stroke="#94a3b8" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg>
          </div>
          <div class="a" v-if="openIdx === 2">国内支持支付宝、微信支付；海外支持 USDT (TRC20) 以及国际信用卡。下单后在收银台选择对应方式扫码即可。</div>
        </div>

        <div class="faq-item" id="faq-logistics" @click="toggle(3)">
          <div class="q">
            <span>发货后多久能收到？</span>
            <svg viewBox="0 0 24 24" width="16" height="16" :class="{ 'rotate': openIdx === 3 }" fill="none" stroke="#94a3b8" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg>
          </div>
          <div class="a" v-if="openIdx === 3">普通快递默认顺丰/中通，2-3 天送达。如果您选择的是“同城急送”，将由专属骑手 1 小时内为您保密送达。</div>
        </div>

        <div class="faq-item" id="faq-privacy" @click="toggle(4)">
          <div class="q">
            <span>你们是隐私发货吗？</span>
            <svg viewBox="0 0 24 24" width="16" height="16" :class="{ 'rotate': openIdx === 4 }" fill="none" stroke="#94a3b8" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg>
          </div>
          <div class="a" v-if="openIdx === 4">是的，我们深知隐私对您的重要性。所有包裹均采用纯色无字保密纸箱，快递单上绝不会出现商品名称和品牌名。</div>
        </div>
      </div>

      <!-- 联系客服底栏 -->
      <div class="contact-box">
        <p>没有找到您想要的答案？</p>
        <button class="contact-btn" @click="openAiChat">联系 AI 专属客服</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const openIdx = ref(1)

const toggle = (idx) => {
  openIdx.value = openIdx.value === idx ? 0 : idx
}

// 滚动到对应分类
const scrollToFaq = (id) => {
  // 只是为了演示快捷分类点击，直接展开对应的问题
  const map = { account: 1, pay: 2, logistics: 3, privacy: 4 }
  openIdx.value = map[id] || 1
}

// 唤起 AI 客服（之前全局绑定的）
const openAiChat = () => {
  window.dispatchEvent(new Event('open-ai-chat'))
}
</script>

<style scoped>
.page-wrap { min-height: 100vh; background: #f5f7fa; }
.header { height: 56px; background: #fff; display: flex; align-items: center; justify-content: space-between; padding: 0 16px; position: sticky; top: 0; z-index: 100; border-bottom: 1px solid #f1f5f9; }
.back-btn { background: none; border: none; font-size: 24px; color: #1e293b; cursor: pointer; }
.header h2 { font-size: 17px; margin: 0; color: #1e293b; font-weight: bold; }

.content { padding: 16px; }
.search-box { background: #fff; border-radius: 20px; padding: 10px 16px; display: flex; align-items: center; gap: 8px; margin-bottom: 20px; box-shadow: 0 2px 10px rgba(0,0,0,0.02); }
.search-box input { flex: 1; border: none; outline: none; background: transparent; font-size: 14px; color: #1e293b; }

.category-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-bottom: 24px; }
.cat-item { display: flex; flex-direction: column; align-items: center; gap: 8px; font-size: 12px; color: #475569; cursor: pointer; }
.cat-icon { width: 48px; height: 48px; border-radius: 16px; display: flex; align-items: center; justify-content: center; font-size: 20px; }

.section-title { font-size: 14px; font-weight: bold; color: #64748b; margin-bottom: 12px; padding-left: 4px; }
.faq-list { background: #fff; border-radius: 16px; padding: 0 16px; box-shadow: 0 2px 10px rgba(0,0,0,0.02); margin-bottom: 24px; }
.faq-item { border-bottom: 1px solid #f1f5f9; }
.faq-item:last-child { border-bottom: none; }
.q { display: flex; justify-content: space-between; align-items: center; padding: 16px 0; font-size: 15px; color: #1e293b; font-weight: 500; cursor: pointer; }
.q svg { transition: transform 0.3s; }
.q svg.rotate { transform: rotate(180deg); }
.a { padding-bottom: 16px; font-size: 14px; color: #64748b; line-height: 1.6; }

.contact-box { text-align: center; padding: 20px 0; }
.contact-box p { font-size: 13px; color: #94a3b8; margin-bottom: 12px; }
.contact-btn { background: #eff6ff; color: #3b82f6; border: 1px solid #bfdbfe; padding: 10px 24px; border-radius: 20px; font-size: 14px; font-weight: bold; cursor: pointer; }
</style>
