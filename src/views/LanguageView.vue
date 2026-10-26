<template>
  <div class="page-wrap">
    <div class="header"><button @click="$router.back()">←</button><h2>{{ $t('settings.lang') }}</h2><div></div></div>
    <div class="content">
      <div class="list">
        <div class="item" :class="{ active: locale === 'zh' }" @click="changeLang('zh')">
          <span>简体中文 (Simplified Chinese)</span>
          <span class="check" v-if="locale === 'zh'">✓</span>
        </div>
        <div class="item" :class="{ active: locale === 'zh-TW' }" @click="changeLang('zh-TW')">
          <span>繁體中文 (Traditional Chinese)</span>
          <span class="check" v-if="locale === 'zh-TW'">✓</span>
        </div>
        <div class="item" :class="{ active: locale === 'en' }" @click="changeLang('en')">
          <span>English (US)</span>
          <span class="check" v-if="locale === 'en'">✓</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { Toast } from '@/utils/toast'

const { locale } = useI18n()

const changeLang = (lang) => {
  locale.value = lang
  localStorage.setItem('app_lang', lang)
  Toast.success('Language switched successfully')
}
</script>

<style scoped>
.page-wrap { min-height: 100vh; background: #f5f7fa; }
.header { height: 56px; background: #fff; display: flex; align-items: center; justify-content: space-between; padding: 0 16px; }
.header button { background: none; border: none; font-size: 24px; }
.header h2 { font-size: 18px; margin: 0; }
.content { padding: 16px; }
.list { background: #fff; border-radius: 12px; padding: 0 16px; }
.item { display: flex; justify-content: space-between; padding: 16px 0; border-bottom: 1px solid #f1f5f9; font-size: 15px; color: #1e293b; cursor: pointer; }
.item:last-child { border-bottom: none; }
.item.active { color: #3b82f6; font-weight: bold; }
.check { color: #3b82f6; }
</style>
