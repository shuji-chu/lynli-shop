<template>
  <div class="container home">
    <!-- 🎨 柔美透亮背景 -->
    <div class="soft-bg">
      <div class="glow glow-pink"></div>
      <div class="glow glow-blue"></div>
      <div class="glow glow-peach"></div>
    </div>

    <!-- 🔍 搜索框 -->
    <div class="search-wrap">
      <div class="search-box">
        <svg viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
        <input v-model="keyword" type="text" placeholder="搜索商品 / 分类..." @keyup.enter="handleSearch" @focus="showHistory = true" />
        <span v-if="keyword" class="clear-btn" @click="keyword = ''">×</span>
      </div>
      <!-- 搜索历史 -->
      <div class="history-wrap" v-if="historyList.length > 0 && showHistory && !keyword">
        <div class="history-header"><span>搜索历史</span><span class="clear-history" @click="clearHistory">清空</span></div>
        <div class="history-tags">
          <span v-for="(item, index) in historyList" :key="index" class="tag" @click="clickHistory(item)">{{ item }}</span>
        </div>
      </div>
    </div>

    <!-- 🎯 顶部分类图标导航 (横向滑动) -->
    <div class="category-nav">
      <div class="cat-item" v-for="cat in categories" :key="cat.name" @click="selectCategory(cat.name)">
        <div class="cat-icon" :style="{ background: cat.color }">
          <!-- 纯代码 SVG 占位图标，你可以换成自己设计的图 -->
          <svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><path d="M12 8v8M8 12h8"/></svg>
        </div>
        <span>{{ cat.name }}</span>
      </div>
    </div>

    <!-- 🖼️ 高级 Banner 轮播图 -->
    <div class="banner">
      <div class="banner-content">
        <h2>探索边界 · 释放真我</h2>
        <p>高端私密好物 满 299 顺丰包邮</p>
        <button class="banner-btn">立即选购</button>
      </div>
      <!-- 背景装饰光晕 -->
      <div class="banner-deco"></div>
    </div>

    <!-- 🛍️ 商品瀑布流网格 -->
    <div class="grid" v-if="filteredList.length">
      <ProductCard v-for="p in filteredList" :key="p.id" :product="p" />
    </div>
    <div v-else-if="loading" class="loading-text">加载中...</div>
    <div v-else class="empty">
      {{ keyword || activeCategory ? '没有找到相关商品' : '暂无商品' }}
    </div>

    <!-- 加载更多 -->
    <div class="load-more-wrap" v-if="hasMore && !loading && !keyword && !activeCategory">
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
const activeCategory = ref('') // 当前选中的分类

// 自定义分类数据
const categories = [
  { name: '全部', color: '#3b82f6' },
  { name: '情趣玩具', color: '#ec4899' },
  { name: '情趣内衣', color: '#8b5cf6' },
  { name: '情趣用品', color: '#f59e0b' },
  { name: '情侣共震', color: '#10b981' }
]

// 搜索历史
const showHistory = ref(false)
const historyList = ref(JSON.parse(localStorage.getItem('lynli_search_history') || '[]'))

function handleSearch() {
  if (!keyword.value.trim()) return
  const kw = keyword.value.trim()
  historyList.value = [kw, ...historyList.value.filter(i => i !== kw)].slice(0, 10)
  localStorage.setItem('lynli_search_history', JSON.stringify(historyList.value))
  showHistory.value = false
}
function clickHistory(item) { keyword.value = item; handleSearch() }
function clearHistory() { historyList.value = []; localStorage.removeItem('lynli_search_history') }

// 点击分类过滤
function selectCategory(catName) {
  if (catName === '全部') {
    activeCategory.value = ''
  } else {
    activeCategory.value = activeCategory.value === catName ? '' : catName
  }
}

// 综合过滤：分类 + 关键词
const filteredList = computed(() => {
  let list = products.value
  if (activeCategory.value) {
    list = list.filter(p => p.category === activeCategory.value)
  }
  if (keyword.value.trim()) {
    const kw = keyword.value.toLowerCase().trim()
    list = list.filter(p => 
      (p.title && p.title.toLowerCase().includes(kw)) || 
      (p.name && p.name.toLowerCase().includes(kw)) ||
      (p.category && p.category.toLowerCase().includes(kw))
    )
  }
  return list
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
  } catch (e) { console.warn(e) } 
  finally { loading.value = false }
}
function loadMore() { if (!hasMore.value) return; page.value++; loadData() }
onMounted(loadData)
</script>

<style scoped>
.home { padding-top: 56px; padding-bottom: 20px; min-height: 100vh; background: #f8fafc; position: relative; overflow: hidden; }

/* 背景光晕 */
.soft-bg { position: absolute; inset: 0; z-index: 0; pointer-events: none; overflow: hidden; }
.glow { position: absolute; border-radius: 50%; filter: blur(80px); opacity: 0.5; }
.glow-pink { width: 350px; height: 400px; background: #fbcfe8; top: -80px; right: -100px; border-radius: 40% 60% 70% 30% / 40% 50% 60% 50%; animation: floatGlow 8s infinite alternate ease-in-out; }
.glow-blue { width: 300px; height: 350px; background: #bfdbfe; bottom: 200px; left: -100px; border-radius: 60% 40% 30% 70% / 50% 60% 40% 50%; animation: floatGlow 10s infinite alternate-reverse ease-in-out; }
.glow-peach { width: 250px; height: 250px; background: #fed7aa; top: 40%; right: -50px; border-radius: 50%; opacity: 0.3; animation: floatGlow 12s infinite alternate ease-in-out; }
@keyframes floatGlow { 0% { transform: translate(0, 0) scale(1); } 100% { transform: translate(-20px, 30px) scale(1.1); } }

/* 搜索框 */
.search-wrap { padding: 12px 16px; position: relative; z-index: 10; }
.search-box { display: flex; align-items: center; background: rgba(255, 255, 255, 0.9); backdrop-filter: blur(10px); border-radius: 20px; padding: 10px 16px; border: 1px solid rgba(255,255,255,0.8); box-shadow: 0 4px 12px rgba(0,0,0,0.03); }
.search-box svg { width: 18px; height: 18px; margin-right: 10px; }
.search-box input { flex: 1; border: none; outline: none; font-size: 15px; color: #1e293b; background: transparent; }
.clear-btn { font-size: 20px; color: #94a3b8; cursor: pointer; padding: 0 5px; }

/* 搜索历史 */
.history-wrap { background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(10px); border-radius: 12px; padding: 15px; margin-top: 10px; border: 1px solid #e2e8f0; position: absolute; left: 16px; right: 16px; z-index: 20; box-shadow: 0 10px 25px rgba(0,0,0,0.1); }
.history-header { display: flex; justify-content: space-between; font-size: 13px; color: #64748b; margin-bottom: 10px; }
.history-tags { display: flex; flex-wrap: wrap; gap: 10px; }
.tag { background: #f1f5f9; color: #475569; font-size: 13px; padding: 5px 12px; border-radius: 15px; cursor: pointer; }

/* 分类图标导航 */
.category-nav { display: flex; overflow-x: auto; padding: 0 16px 16px; gap: 16px; position: relative; z-index: 2; scrollbar-width: none; }
.category-nav::-webkit-scrollbar { display: none; }
.cat-item { display: flex; flex-direction: column; align-items: center; gap: 6px; cursor: pointer; flex-shrink: 0; }
.cat-icon { width: 52px; height: 52px; border-radius: 18px; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 10px rgba(0,0,0,0.1); transition: transform 0.2s; }
.cat-item:active .cat-icon { transform: scale(0.9); }
.cat-icon svg { width: 24px; height: 24px; }
.cat-item span { font-size: 12px; color: #475569; font-weight: 500; }

/* 高级 Banner */
.banner { margin: 0 16px 20px; background: linear-gradient(135deg, #1e3a8a, #3b82f6); border-radius: 16px; padding: 24px; position: relative; overflow: hidden; z-index: 2; box-shadow: 0 10px 20px rgba(59,130,246,0.2); }
.banner-content { position: relative; z-index: 2; }
.banner h2 { font-size: 20px; color: #fff; margin: 0 0 6px; font-weight: 800; }
.banner p { font-size: 13px; color: #bfdbfe; margin: 0 0 16px; }
.banner-btn { background: #fff; color: #1e3a8a; border: none; padding: 6px 16px; border-radius: 20px; font-size: 13px; font-weight: bold; cursor: pointer; }
.banner-deco { position: absolute; right: -20px; top: -20px; width: 150px; height: 150px; background: rgba(255,255,255,0.1); border-radius: 50%; filter: blur(20px); }

/* 商品网格 */
.grid { column-count: 2; column-gap: 12px; padding: 0 16px; position: relative; z-index: 2; }
.grid > * { break-inside: avoid; margin-bottom: 12px; }
.loading-text, .empty { text-align: center; padding: 40px 0; color: #94a3b8; font-size: 14px; }
.load-more-wrap { text-align: center; padding: 20px 0 40px; position: relative; z-index: 2; }
.load-more-btn { background: #eff6ff; color: #3b82f6; border: 1px solid #bfdbfe; padding: 10px 30px; border-radius: 20px; cursor: pointer; font-size: 14px; font-weight: bold; }

@media (min-width: 768px) {
  .grid { column-count: auto; display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 18px; }
  .grid > * { margin-bottom: 0; }
  .banner h2 { font-size: 28px; }
}
</style>
