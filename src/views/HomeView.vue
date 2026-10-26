<template>
  <div class="container home" @click="showHistory = false">
    
    <div class="soft-bg">
      <div class="glow glow-pink"></div>
      <div class="glow glow-blue"></div>
      <div class="glow glow-peach"></div>
    </div>

    <!-- 📢 顶部公告栏 (修复文字消失问题) -->
    <div class="notice-bar" v-if="noticeText">
      <div class="notice-icon">📢</div>
      <div class="notice-content">
        <div class="marquee">
          <span>{{ noticeText }}</span>
          <span>{{ noticeText }}</span>
        </div>
      </div>
    </div>

    <!-- 🔍 搜索栏 -->
    <div class="search-wrap" @click.stop>
      <div class="search-box">
        <svg viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
        <input v-model="keyword" type="text" placeholder="搜索商品 / 分类..." @keyup.enter="handleSearch" @focus="showHistory = true" />
        <span v-if="keyword" class="clear-btn" @click="keyword = ''">×</span>
      </div>
      
      <div class="history-wrap" v-if="historyList.length > 0 && showHistory && !keyword">
        <div class="history-header">
          <span>搜索历史</span>
          <span class="clear-history" @click="clearHistory">清空</span>
        </div>
        <div class="history-tags">
          <span v-for="(item, index) in historyList" :key="index" class="tag" @click="clickHistory(item)">{{ item }}</span>
        </div>
      </div>
    </div>

    <!-- 🖼️ 广告轮播图 -->
    <div class="banner-carousel">
      <div class="banner-track" :style="{ transform: `translateX(-${currentBanner * 100}%)` }">
        <div class="banner-slide" v-for="(banner, index) in bannerList" :key="index" :style="{ background: banner.bg }">
          <div class="banner-content">
            <h2>{{ banner.title }}</h2>
            <p>{{ banner.desc }}</p>
            <button class="banner-btn">{{ banner.btnText }}</button>
          </div>
        </div>
      </div>
      <div class="dots">
        <span v-for="(banner, index) in bannerList" :key="index" :class="{ active: currentBanner === index }" @click="currentBanner = index"></span>
      </div>
    </div>

    <!-- 分类导航 (固定写死，保证排版美观) -->
    <div class="category-nav">
      <div class="cat-item" v-for="cat in categories" :key="cat.name" @click="selectCategory(cat.name)">
        <div class="cat-icon" :style="{ background: cat.color }">
          <svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><path d="M12 8v8M8 12h8"/></svg>
        </div>
        <span>{{ cat.name }}</span>
      </div>
    </div>

    <!-- 🛍️ 商品瀑布流 & 穿插广告 -->
    <div class="grid" v-if="filteredList.length">
      <template v-for="(p, index) in filteredList" :key="p.id">
        
        <!-- 信息流广告 -->
        <div v-if="index > 0 && index % 4 === 0" class="ad-card">
          <div class="ad-tag">广告</div>
          <img src="https://img.yisoujiasu.de5.net/images/spider/202610/b055c8aebde14fd9b157961e7ff1f8f9.jpg?x-oss-process=image/resize,w_500/quality,q_80" alt="广告" />
          <div class="ad-info">
            <h4>内部特供 · 专属福利</h4>
            <p>点击领取大额优惠券</p>
          </div>
        </div>

        <ProductCard :product="p" />
        
      </template>
    </div>
    
    <div v-else-if="loading" class="loading-text">加载中...</div>
    <div v-else class="empty">
      {{ keyword || activeCategory ? '没有找到相关商品' : '暂无商品' }}
    </div>

    <div class="load-more-wrap" v-if="hasMore && !loading && !keyword && !activeCategory">
      <button class="load-more-btn" @click.stop="loadMore">加载更多好物</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import ProductCard from '@/components/ProductCard.vue'
import { getProducts } from '@/api/product'

const products = ref([])
const loading = ref(false)
const page = ref(1)
const hasMore = ref(true)
const keyword = ref('')
const activeCategory = ref('')
const showHistory = ref(false)

const noticeText = ref('平台上线庆典：全场商品满 299 顺丰包邮，新人注册即送 50 元无门槛券！')

const bannerList = ref([
  { title: '探索边界 · 释放真我', desc: '高端私密好物，隐私发货', btnText: '立即选购', bg: 'linear-gradient(135deg, #1e3a8a, #3b82f6)' },
  { title: '新人专享 · 首单立减', desc: '注册即送 50 元无门槛优惠券', btnText: '马上领取', bg: 'linear-gradient(135deg, #be123c, #f43f5e)' }
])
const currentBanner = ref(0)
let bannerTimer = null

// 分类固定写死，保证页面骨架美丽
const categories = ref([
  { name: '全部', color: '#3b82f6' },
  { name: '情趣玩具', color: '#ec4899' },
  { name: '情趣内衣', color: '#8b5cf6' },
  { name: '情趣用品', color: '#f59e0b' },
  { name: '情侣共震', color: '#10b981' }
])

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

function selectCategory(catName) {
  activeCategory.value = catName === '全部' ? '' : (activeCategory.value === catName ? '' : catName)
}

const filteredList = computed(() => {
  let list = products.value
  if (activeCategory.value) list = list.filter(p => p.category === activeCategory.value)
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

onMounted(() => {
  loadData()
  bannerTimer = setInterval(() => {
    currentBanner.value = (currentBanner.value + 1) % bannerList.value.length
  }, 4000)
})

onUnmounted(() => {
  if (bannerTimer) clearInterval(bannerTimer)
})
</script>

<style scoped>
/* 核心容器 */
.home { padding-top: 56px; padding-bottom: 80px; min-height: 100vh; background: #f8fafc; position: relative; overflow-x: hidden; }

/* 背景光晕 */
.soft-bg { position: fixed; inset: 0; z-index: 0; pointer-events: none; overflow: hidden; }
.glow { position: absolute; border-radius: 50%; filter: blur(80px); opacity: 0.5; }
.glow-pink { width: 350px; height: 400px; background: #fbcfe8; top: -80px; right: -100px; animation: floatGlow 8s infinite alternate ease-in-out; }
.glow-blue { width: 300px; height: 350px; background: #bfdbfe; bottom: 200px; left: -100px; animation: floatGlow 10s infinite alternate-reverse ease-in-out; }
.glow-peach { width: 250px; height: 250px; background: #fed7aa; top: 40%; right: -50px; opacity: 0.3; animation: floatGlow 12s infinite alternate ease-in-out; }
@keyframes floatGlow { 0% { transform: translate(0, 0) scale(1); } 100% { transform: translate(-20px, 30px) scale(1.1); } }

/* 📢 顶部公告栏 (大厂同款) */
.notice-bar { display: flex; align-items: center; margin: 12px 16px 0; padding: 8px 12px; background: rgba(255, 251, 235, 0.9); border-radius: 8px; position: relative; z-index: 10; }
.notice-icon { font-size: 14px; margin-right: 8px; }
.notice-content { flex: 1; overflow: hidden; position: relative; height: 20px; }
.marquee { display: flex; white-space: nowrap; animation: scroll 15s linear infinite; }
.marquee span { font-size: 13px; color: #d97706; padding-right: 50px; }
@keyframes scroll { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }

/* 🔍 搜索框 */
.search-wrap { padding: 12px 16px; position: relative; z-index: 100; }
.search-box { display: flex; align-items: center; background: #fff; border-radius: 20px; padding: 10px 16px; box-shadow: 0 2px 10px rgba(0,0,0,0.03); border: 1px solid #f1f5f9; }
.search-box svg { width: 18px; height: 18px; margin-right: 10px; }
.search-box input { flex: 1; border: none; outline: none; font-size: 15px; color: #1e293b; background: transparent; }
.clear-btn { font-size: 20px; color: #94a3b8; cursor: pointer; padding: 0 5px; }

/* 历史记录 */
.history-wrap { background: #fff; border-radius: 12px; padding: 15px; margin-top: 8px; border: 1px solid #f1f5f9; position: absolute; left: 16px; right: 16px; z-index: 20; box-shadow: 0 10px 25px rgba(0,0,0,0.08); }
.history-header { display: flex; justify-content: space-between; font-size: 13px; color: #64748b; margin-bottom: 12px; }
.history-tags { display: flex; flex-wrap: wrap; gap: 10px; }
.tag { background: #f8fafc; color: #475569; font-size: 13px; padding: 6px 14px; border-radius: 15px; cursor: pointer; border: 1px solid #f1f5f9; }

/* 🖼️ 轮播图 */
.banner-carousel { margin: 0 16px 16px; border-radius: 16px; overflow: hidden; position: relative; z-index: 2; }
.banner-track { display: flex; transition: transform 0.4s ease-in-out; height: 130px; }
.banner-slide { min-width: 100%; padding: 24px; box-sizing: border-box; display: flex; flex-direction: column; justify-content: center; }
.banner-content h2 { font-size: 18px; color: #fff; margin: 0 0 4px; font-weight: 800; }
.banner-content p { font-size: 12px; color: rgba(255,255,255,0.85); margin: 0 0 12px; }
.banner-btn { background: #fff; color: #1e293b; border: none; padding: 6px 16px; border-radius: 20px; font-size: 12px; font-weight: bold; cursor: pointer; align-self: flex-start; }
.dots { position: absolute; bottom: 10px; left: 0; right: 0; display: flex; justify-content: center; gap: 6px; }
.dots span { width: 6px; height: 6px; border-radius: 50%; background: rgba(255,255,255,0.4); transition: all 0.3s; }
.dots span.active { width: 14px; border-radius: 3px; background: #fff; }

/* 🎯 分类导航 (固定间距，不散架) */
.category-nav { display: flex; overflow-x: auto; padding: 0 16px 16px; gap: 16px; position: relative; z-index: 2; scrollbar-width: none; }
.category-nav::-webkit-scrollbar { display: none; }
.cat-item { display: flex; flex-direction: column; align-items: center; gap: 8px; cursor: pointer; flex-shrink: 0; }
.cat-icon { width: 50px; height: 50px; border-radius: 16px; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 10px rgba(0,0,0,0.05); }
.cat-icon svg { width: 22px; height: 22px; }
.cat-item span { font-size: 12px; color: #475569; font-weight: 500; }

/* 🛍️ 瀑布流商品网格 (统一间距) */
.grid { column-count: 2; column-gap: 12px; padding: 0 16px; position: relative; z-index: 2; }
.grid > * { break-inside: avoid; margin-bottom: 12px; }
.loading-text, .empty { text-align: center; padding: 40px 0; color: #94a3b8; font-size: 14px; }
.load-more-wrap { text-align: center; padding: 20px 0 40px; position: relative; z-index: 2; }
.load-more-btn { background: #fff; color: #3b82f6; border: 1px solid #bfdbfe; padding: 10px 30px; border-radius: 20px; cursor: pointer; font-size: 14px; font-weight: bold; box-shadow: 0 2px 8px rgba(0,0,0,0.02); }

/* 📢 信息流广告卡片 (与商品卡片对齐) */
.ad-card { background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.03); position: relative; border: 1px solid #f1f5f9; }
.ad-tag { position: absolute; top: 8px; left: 8px; background: rgba(0,0,0,0.4); color: #fff; font-size: 10px; padding: 2px 6px; border-radius: 4px; z-index: 2; }
.ad-card img { width: 100%; aspect-ratio: 1/1; object-fit: cover; display: block; }
.ad-info { padding: 12px; }
.ad-info h4 { margin: 0 0 4px; font-size: 13px; color: #1e293b; font-weight: 600; }
.ad-info p { margin: 0; font-size: 12px; color: #f59e0b; }
</style>
