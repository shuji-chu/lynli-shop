<template>
  <div class="container home">
    <!-- 🎨 丰满柔美的透明背景光影 -->
    <div class="bg-glow bg-1"></div>
    <div class="bg-glow bg-2"></div>
    <div class="bg-glow bg-3"></div>

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

    <!-- 错误提示区 -->
    <div v-if="errorMsg" style="background: #fee2e2; color: #ef4444; padding: 15px; border-radius: 10px; margin-bottom: 15px; font-weight: bold;">
      错误原因：{{ errorMsg }}
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
const errorMsg = ref('')
const keyword = ref('')

// 🔥 搜索历史逻辑
const showHistory = ref(false)
const historyList = ref(JSON.parse(localStorage.getItem('lynli_search_history') || '[]'))

function handleSearch() {
  if (!keyword.value.trim()) return
  const kw = keyword.value.trim()
  // 去重并限制最多10条
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

// 前端本地搜索过滤
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
  errorMsg.value = ''
  
  try {
    const res = await getProducts({ page: page.value, size: 20 })
    const list = Array.isArray(res) ? res : (res?.data || [])
    
    if (list.length < 20) hasMore.value = false
    if (page.value === 1) products.value = list
    else products.value.push(...list)
  } catch (e) {
    errorMsg.value = '接口报错，请稍后再试'
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
/* 基础容器 */
.home { padding-top: 70px; padding-bottom: 20px; min-height: 100vh; background: #f8fafc; position: relative; overflow: hidden; }
.hero { text-align: center; padding: 20px 0; position: relative; z-index: 2; }
.hero h1 { font-size: 26px; font-weight: 800; color: #1e3a8a; margin: 0; }
.hero p { margin-top: 8px; font-size: 13px; color: #64748b; }

/* 🎨 丰满柔美的背景光斑 */
.bg-glow { position: absolute; border-radius: 50%; filter: blur(60px); opacity: 0.4; z-index: 1; pointer-events: none; }
.bg-1 { width: 300px; height: 400px; background: linear-gradient(135deg, #fbcfe8, #f472b6); top: -50px; right: -50px; border-radius: 40% 60% 70% 30% / 40% 50% 60% 50%; animation: float 8s infinite alternate; }
.bg-2 { width: 250px; height: 350px; background: linear-gradient(135deg, #bfdbfe, #3b82f6); top: 300px; left: -80px; border-radius: 60% 40% 30% 70% / 50% 60% 40% 50%; animation: float 10s infinite alternate-reverse; }
.bg-3 { width: 200px; height: 300px; background: linear-gradient(135deg, #e9d5ff, #a855f7); top: 600px; right: -50px; border-radius: 50% 50% 40% 60% / 60% 40% 50% 50%; animation: float 12s infinite alternate; }
@keyframes float { 0% { transform: translate(0, 0) scale(1); } 100% { transform: translate(-20px, 20px) scale(1.1); } }

/* 搜索框 */
.search-wrap { padding: 0 16px 20px; position: relative; z-index: 10; }
.search-box { display: flex; align-items: center; background: rgba(255, 255, 255, 0.85); backdrop-filter: blur(10px); border-radius: 20px; padding: 10px 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); border: 1px solid #e2e8f0; }
.search-box svg { width: 18px; height: 18px; margin-right: 10px; }
.search-box input { flex: 1; border: none; outline: none; font-size: 15px; color: #1e293b; background: transparent; }
.search-box input::placeholder { color: #94a3b8; }
.clear-btn { font-size: 20px; color: #94a3b8; cursor: pointer; padding: 0 5px; }

/* 搜索历史 */
.history-wrap { background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(10px); border-radius: 12px; padding: 15px; margin-top: 10px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); border: 1px solid #f1f5f9; }
.history-header { display: flex; justify-content: space-between; font-size: 13px; color: #64748b; margin-bottom: 10px; }
.clear-history { cursor: pointer; color: #94a3b8; }
.history-tags { display: flex; flex-wrap: wrap; gap: 10px; }
.tag { background: #f1f5f9; color: #475569; font-size: 13px; padding: 5px 12px; border-radius: 15px; cursor: pointer; transition: background 0.2s; }
.tag:hover { background: #e2e8f0; }

/* 商品列表 */
.grid { column-count: 2; column-gap: 12px; padding: 0 16px; position: relative; z-index: 2; }
.grid > * { break-inside: avoid; margin-bottom: 12px; }
.loading-text { text-align: center; padding: 40px; color: #94a3b8; font-size: 14px; }
.empty { text-align: center; padding: 80px 0; color: #94a3b8; }
.load-more-wrap { text-align: center; padding: 20px 0 40px; position: relative; z-index: 2; }
.load-more-btn { background: #eff6ff; color: #3b82f6; border: 1px solid #bfdbfe; padding: 10px 30px; border-radius: 20px; cursor: pointer; font-size: 14px; font-weight: bold; }

@media (min-width: 768px) {
  .grid { column-count: auto; display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 18px; }
  .grid > * { margin-bottom: 0; }
  .hero h1 { font-size: 34px; }
}
</style>
