<template>
  <div class="container home">
    <!-- 🚀 太空背景层 -->
    <div class="space-bg">
      <!-- 膨胀的星云光晕（体现视觉丰满） -->
      <div class="nebula nebula-pink"></div>
      <div class="nebula nebula-blue"></div>
      
      <!-- 漂浮的胖宇航员（SVG纯代码绘制） -->
      <div class="astronaut-wrap">
        <svg class="astronaut" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="visor" cx="40%" cy="30%" r="60%">
              <stop offset="0%" stop-color="#7dd3fc" stop-opacity="0.8"/>
              <stop offset="100%" stop-color="#1e3a8a" stop-opacity="0.9"/>
            </radialGradient>
            <linearGradient id="suit" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#f8fafc"/>
              <stop offset="100%" stop-color="#cbd5e1"/>
            </linearGradient>
          </defs>
          <!-- 胖胖的身体 -->
          <rect x="50" y="90" width="100" height="90" rx="40" fill="url(#suit)" />
          <circle cx="100" cy="90" r="50" fill="url(#suit)" />
          <!-- 头盔面罩 -->
          <circle cx="100" cy="80" r="40" fill="#e2e8f0" />
          <circle cx="100" cy="80" r="34" fill="url(#visor)" />
          <!-- 面罩高光 -->
          <ellipse cx="85" cy="65" rx="15" ry="8" fill="rgba(255,255,255,0.4)" transform="rotate(-30 85 65)" />
          <!-- 小背包 -->
          <rect x="35" y="110" width="20" height="50" rx="10" fill="#94a3b8" />
          <!-- 小短手和小短腿 -->
          <circle cx="45" cy="140" r="15" fill="url(#suit)" />
          <circle cx="155" cy="140" r="15" fill="url(#suit)" />
          <rect x="65" y="170" width="20" height="25" rx="10" fill="url(#suit)" />
          <rect x="115" y="170" width="20" height="25" rx="10" fill="url(#suit)" />
          <!-- 氧气管 -->
          <path d="M 50 110 Q 20 130 45 140" stroke="#64748b" stroke-width="4" fill="none" stroke-linecap="round"/>
        </svg>
      </div>

      <!-- 闪烁的星星 -->
      <div class="stars"></div>
    </div>

    <section class="hero">
      <h1 class="gold-text">探索边界 · 私人愉悦</h1>
      <p>高端情趣用品甄选 · 私密发货 · 全球好物直达</p>
    </section>

    <!-- 🔍 搜索框与历史记录 -->
    <div class="search-wrap">
      <div class="search-box">
        <svg viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
        <input 
          v-model="keyword" 
          type="text" 
          placeholder="搜索商品 / 分类..." 
          @keyup.enter="handleSearch"
          @focus="showHistory = true"
        />
        <span v-if="keyword" class="clear-btn" @click="keyword = ''">×</span>
      </div>

      <!-- 搜索历史 -->
      <div class="history-wrap" v-if="historyList.length > 0 && showHistory && !keyword">
        <div class="history-header">
          <span>搜索历史</span>
          <span class="clear-history" @click="clearHistory">清空</span>
        </div>
        <div class="history-tags">
          <span v-for="(item, index) in historyList" :key="index" class="tag" @click="clickHistory(item)">
            {{ item }}
          </span>
        </div>
      </div>
    </div>

    <!-- 商品列表 -->
    <div class="grid" v-if="filteredList.length">
      <ProductCard v-for="p in filteredList" :key="p.id" :product="p" />
    </div>
    <div v-else-if="loading" class="loading-text">加载中...</div>
    <div v-else class="empty">
      {{ keyword ? '没有找到相关商品' : '暂无商品' }}
    </div>

    <!-- 加载更多 -->
    <div class="load-more-wrap" v-if="hasMore && !loading && !keyword">
      <button class="load-more-btn" @click="loadMore">加载更多好物</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import ProductCard from '@/components/ProductCard.vue'
import { getProducts } from '@/api/product'

const products = ref([])
const loading = ref(false)
const page = ref(1)
const hasMore = ref(true)
const keyword = ref('')

const showHistory = ref(false)
const historyList = ref(JSON.parse(localStorage.getItem('lynli_search_history') || '[]'))

function handleSearch() {
  if (!keyword.value.trim()) return
  const kw = keyword.value.trim()
  historyList.value = [kw, ...historyList.value.filter(i => i !== kw)].slice(0, 10)
  localStorage.setItem('lynli_search_history', JSON.stringify(historyList.value))
  showHistory.value = false
}

function clickHistory(item) {
  keyword.value = item
  handleSearch()
}

function clearHistory() {
  historyList.value = []
  localStorage.removeItem('lynli_search_history')
}

const filteredList = computed(() => {
  if (!keyword.value.trim()) return products.value
  const kw = keyword.value.toLowerCase().trim()
  return products.value.filter(p => 
    (p.title && p.title.toLowerCase().includes(kw)) || 
    (p.name && p.name.toLowerCase().includes(kw)) ||
    (p.category && p.category.toLowerCase().includes(kw))
  )
})

async function loadData() {
  if (loading.value) return
  loading.value = true
  try {
    const res = await getProducts({ page: page.value, size: 20 })
    const list = Array.isArray(res) ? res : (res?.data || [])
    if (list.length < 20) hasMore.value = false
    if (page.value === 1) products.value = list
    else products.value.push(...list)
  } catch (e) {
    console.warn(e)
  } finally {
    loading.value = false
  }
}

function loadMore() {
  if (!hasMore.value) return
  page.value++
  loadData()
}

onMounted(loadData)
</script>

<style scoped>
/* 核心容器：深邃太空背景 */
.home { 
  padding-top: 70px; 
  padding-bottom: 20px; 
  min-height: 100vh; 
  background: #0f172a; /* 深空蓝底色 */
  position: relative; 
  overflow: hidden; 
  color: #f8fafc;
}

/* 🚀 背景特效层 */
.space-bg {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
}

/* 星云光晕（丰满感） */
.nebula {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.6;
}
.nebula-pink {
  width: 400px; height: 400px;
  background: linear-gradient(135deg, #ec4899, #8b5cf6);
  top: -100px; right: -100px;
  animation: breathe 10s infinite alternate;
}
.nebula-blue {
  width: 500px; height: 500px;
  background: linear-gradient(135deg, #3b82f6, #06b6d4);
  bottom: -100px; left: -150px;
  animation: breathe 12s infinite alternate-reverse;
}
@keyframes breathe {
  0% { transform: scale(1); opacity: 0.4; }
  100% { transform: scale(1.2); opacity: 0.7; }
}

/* 漂浮的胖宇航员 */
.astronaut-wrap {
  position: absolute;
  top: 10%;
  right: 10%;
  width: 120px;
  height: 120px;
  animation: floatAstronaut 6s infinite ease-in-out alternate;
}
.astronaut { width: 100%; height: 100%; filter: drop-shadow(0 10px 20px rgba(0,0,0,0.3)); }
@keyframes floatAstronaut {
  0% { transform: translateY(0) rotate(-5deg); }
  100% { transform: translateY(30px) rotate(10deg); }
}

/* 闪烁星空背景 */
.stars {
  position: absolute;
  inset: 0;
  background-image: 
    radial-gradient(1.5px 1.5px at 20px 30px, #fff, rgba(0,0,0,0)),
    radial-gradient(1.5px 1.5px at 100px 150px, #fff, rgba(0,0,0,0)),
    radial-gradient(1.5px 1.5px at 200px 80px, #fff, rgba(0,0,0,0)),
    radial-gradient(1.5px 1.5px at 300px 200px, #fff, rgba(0,0,0,0));
  background-size: 300px 300px;
  opacity: 0.3;
  animation: twinkle 4s infinite alternate;
}
@keyframes twinkle { 0% { opacity: 0.1; } 100% { opacity: 0.5; } }

/* 文字区 */
.hero { text-align: center; padding: 20px 0; position: relative; z-index: 2; }
.hero h1 { font-size: 26px; font-weight: 800; color: #fff; margin: 0; text-shadow: 0 2px 10px rgba(59,130,246,0.5); }
.hero p { margin-top: 8px; font-size: 13px; color: #94a3b8; }

/* 搜索框 */
.search-wrap { padding: 0 16px 20px; position: relative; z-index: 10; }
.search-box { display: flex; align-items: center; background: rgba(30, 41, 59, 0.7); backdrop-filter: blur(15px); border-radius: 20px; padding: 10px 16px; border: 1px solid rgba(255,255,255,0.1); box-shadow: 0 4px 12px rgba(0,0,0,0.2); }
.search-box svg { width: 18px; height: 18px; margin-right: 10px; }
.search-box input { flex: 1; border: none; outline: none; font-size: 15px; color: #fff; background: transparent; }
.search-box input::placeholder { color: #64748b; }
.clear-btn { font-size: 20px; color: #94a3b8; cursor: pointer; padding: 0 5px; }

/* 搜索历史 */
.history-wrap { background: rgba(30, 41, 59, 0.9); backdrop-filter: blur(15px); border-radius: 12px; padding: 15px; margin-top: 10px; border: 1px solid rgba(255,255,255,0.1); }
.history-header { display: flex; justify-content: space-between; font-size: 13px; color: #94a3b8; margin-bottom: 10px; }
.clear-history { cursor: pointer; color: #64748b; }
.history-tags { display: flex; flex-wrap: wrap; gap: 10px; }
.tag { background: rgba(255,255,255,0.1); color: #cbd5e1; font-size: 13px; padding: 5px 12px; border-radius: 15px; cursor: pointer; }

/* 商品列表 */
.grid { column-count: 2; column-gap: 12px; padding: 0 16px; position: relative; z-index: 2; }
.grid > * { break-inside: avoid; margin-bottom: 12px; }
.loading-text { text-align: center; padding: 40px; color: #94a3b8; font-size: 14px; }
.empty { text-align: center; padding: 80px 0; color: #94a3b8; }
.load-more-wrap { text-align: center; padding: 20px 0 40px; position: relative; z-index: 2; }
.load-more-btn { background: rgba(59, 130, 246, 0.2); color: #60a5fa; border: 1px solid rgba(59, 130, 246, 0.5); padding: 10px 30px; border-radius: 20px; cursor: pointer; font-size: 14px; font-weight: bold; }
</style>
