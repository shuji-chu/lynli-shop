<template>
  <div class="page-wrap">
    <div class="header"><button @click="$router.back()">←</button><h2>地区与语言</h2><div></div></div>
    <div class="content">
      <div class="list">
        <div class="item" :class="{ active: lang === 'zh-CN' }" @click="setLang('zh-CN')">
          <span>简体中文 (中国大陆)</span><span class="check" v-if="lang === 'zh-CN'">✓</span>
        </div>
        <div class="item" :class="{ active: lang === 'zh-TW' }" @click="setLang('zh-TW')">
          <span>繁體中文 (港澳台)</span><span class="check" v-if="lang === 'zh-TW'">✓</span>
        </div>
        <div class="item" :class="{ active: lang === 'en-US' }" @click="setLang('en-US')">
          <span>English (US)</span><span class="check" v-if="lang === 'en-US'">✓</span>
        </div>
        <div class="item" :class="{ active: lang === 'th-TH' }" @click="setLang('th-TH')">
          <span>ภาษาไทย (Thailand)</span><span class="check" v-if="lang === 'th-TH'">✓</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import { Toast } from '@/utils/toast'
const lang = ref(localStorage.getItem('app_lang') || 'zh-CN')
const setLang = (val) => {
  lang.value = val
  localStorage.setItem('app_lang', val)
  Toast.success('语言已切换')
}
</script>
<style scoped>
.page-wrap { min-height: 100vh; background: #f5f7fa; }
.header { height: 56px; background: #fff; display: flex; align-items: center; justify-content: space-between; padding: 0 16px; }
.header button { background: none; border: none; font-size: 24px; }
.header h2 { font-size: 18px; margin: 0; }
.content { padding: 16px; }
.list { background: #fff; border-radius: 12px; padding: 0 16px; }
.item { display: flex; justify-content: space-between; padding: 16px 0; border-bottom: 1px solid #f1f5f9; font-size: 15px; color: #1e293b; }
.item.active { color: #3b82f6; font-weight: bold; }
.check { color: #3b82f6; }
</style>
