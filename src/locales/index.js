import { createI18n } from 'vue-i18n'
import zh from './zh'
import en from './en'
import zhTW from './zh-TW'

// 获取本地缓存的语言，默认中文
const savedLang = localStorage.getItem('app_lang') || 'zh'

const i18n = createI18n({
  legacy: false,
  locale: savedLang,
  fallbackLocale: 'zh',
  messages: {
    'zh': zh,
    'en': en,
    'zh-TW': zhTW
  }
})

export default i18n
