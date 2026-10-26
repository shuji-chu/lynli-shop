<template>
  <div class="page-wrap">
    <div class="header"><button @click="$router.back()">←</button><h2>帮助与反馈</h2><div></div></div>
    <div class="content">
      <div class="section-title">常见问题</div>
      <div class="faq-list">
        <div class="faq-item" @click="toggle(1)">
          <div class="q">怎么联系人工客服？<span>+</span></div>
          <div class="a" v-if="openIdx === 1">点击右下角的蓝色气泡，就可以和我们的 AI 客服对话，转人工也可以哦。</div>
        </div>
        <div class="faq-item" @click="toggle(2)">
          <div class="q">隐私发货是真的吗？<span>+</span></div>
          <div class="a" v-if="openIdx === 2">我们承诺所有商品均采用纯色无字保密纸箱，快递单上绝不会出现商品名称或品牌。</div>
        </div>
        <div class="faq-item" @click="toggle(3)">
          <div class="q">怎么申请售后？<span>+</span></div>
          <div class="a" v-if="openIdx === 3">在“我的订单”中找到对应订单，点击“退款/售后”，按提示操作即可。</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue'
const openIdx = ref(0)
const toggle = (idx) => { openIdx.value = openIdx.value === idx ? 0 : idx }
</script>
<style scoped>
.page-wrap { min-height: 100vh; background: #f5f7fa; }
.header { height: 56px; background: #fff; display: flex; align-items: center; justify-content: space-between; padding: 0 16px; }
.header button { background: none; border: none; font-size: 24px; }
.header h2 { font-size: 18px; margin: 0; }
.content { padding: 16px; }
.section-title { font-size: 13px; color: #94a3b8; margin-bottom: 8px; }
.faq-list { background: #fff; border-radius: 12px; padding: 0 16px; }
.faq-item { border-bottom: 1px solid #f1f5f9; }
.faq-item:last-child { border-bottom: none; }
.q { display: flex; justify-content: space-between; padding: 16px 0; font-size: 15px; color: #1e293b; font-weight: 500; }
.a { padding-bottom: 16px; font-size: 14px; color: #64748b; line-height: 1.5; }
</style>
