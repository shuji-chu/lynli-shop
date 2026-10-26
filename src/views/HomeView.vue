<template>
  <div class="container home" @click="searchBarRef?.closeHistory()">
    
    <div class="soft-bg">
      <div class="glow glow-pink"></div>
      <div class="glow glow-blue"></div>
      <div class="glow glow-peach"></div>
    </div>

    <!-- 顶部公告栏 -->
    <div class="notice-bar" v-if="noticeText">
      <div class="notice-icon">📢</div>
      <div class="notice-content">
        <div class="marquee"><span>{{ noticeText }}</span><span>{{ noticeText }}</span></div>
      </div>
    </div>

    <!-- 🚨 拼装组件 1：搜索框 -->
    <SearchBar 
      ref="searchBarRef" 
      v-model:keyword="keyword" 
      @search="handleSearch" 
    />

    <!-- 🚨 拼装组件 2：轮播图 -->
    <BannerSwiper :banners="bannerList" />

    <!-- 🚨 拼装组件 3：分类导航 -->
    <CategoryNav 
      :categories="categories" 
      @select="selectCategory" 
    />

    <!-- 商品瀑布流 & 穿插广告 -->
    <div class="grid" v-if="filteredList.length">
      <template v-for="(p, index) in filteredList" :key="p.id">
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
    <div v-else class="empty">{{ keyword || activeCategory ? '没有找到相关商品' : '暂无商品' }}</div>

    <div class="load-more-wrap" v-if="hasMore && !loading && !keyword && !activeCategory">
      <button class="load-more-btn" @click.stop="loadMore">加载更多好物</button>
    </div>
  </div>
</template>

<script setup>
defineOptions({ name: 'HomeView' });
import { ref, computed, onMounted } from 'vue'
import { getProducts } from '@/api/product'
import request from '@/api/request'
import ProductCard from '@/components/ProductCard.vue'
import SearchBar from '@/components/SearchBar.vue'
import BannerSwiper from '@/components/BannerSwiper.vue'
import CategoryNav from '@/components/CategoryNav.vue'

const searchBarRef = ref(null)
const products = ref([])
const loading = ref(false)
const page = ref(1)
const hasMore = ref(true)
const keyword = ref('')
const activeCategory = ref('')

const noticeText = ref('平台上线庆典：全场商品满 299 顺丰包邮，新人注册即送 50 元无门槛券！')

const bannerList = ref([])

const categories = ref([
  { name: '全部', color: '#3b82f6' },
  { name: '情趣玩具', color: '#ec4899' },
  { name: '情趣内衣', color: '#8b5cf6' },
  { name: '情趣用品', color: '#f59e0b' },
  { name: '情侣共震', color: '#10b981' }
])

function handleSearch(val) {
  keyword.value = val
}

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

onMounted(loadData)
</script>

<style scoped>
/* 核心样式仅保留背景层和网格，其他全拆分到子组件了 */
.home { padding-top: 56px; padding-bottom: 80px; min-height: 100vh; background: #f8fafc; position: relative; overflow-x: hidden; }
.soft-bg { position: fixed; inset: 0; z-index: 0; pointer-events: none; overflow: hidden; }
.glow { position: absolute; border-radius: 50%; filter: blur(80px); opacity: 0.5; }
.glow-pink { width: 350px; height: 400px; background: #fbcfe8; top: -80px; right: -100px; animation: floatGlow 8s infinite alternate ease-in-out; }
.glow-blue { width: 300px; height: 350px; background: #bfdbfe; bottom: 200px; left: -100px; animation: floatGlow 10s infinite alternate-reverse ease-in-out; }
.glow-peach { width: 250px; height: 250px; background: #fed7aa; top: 40%; right: -50px; opacity: 0.3; animation: floatGlow 12s infinite alternate ease-in-out; }
@keyframes floatGlow { 0% { transform: translate(0, 0) scale(1); } 100% { transform: translate(-20px, 30px) scale(1.1); } }

/* 公告与网格 */
.notice-bar { display: flex; align-items: center; margin: 12px 16px 0; padding: 8px 12px; background: rgba(255, 251, 235, 0.9); border-radius: 8px; position: relative; z-index: 10; }
.notice-icon { font-size: 14px; margin-right: 8px; }
.notice-content { flex: 1; overflow: hidden; position: relative; height: 20px; }
.marquee { display: flex; white-space: nowrap; animation: scroll 15s linear infinite; }
.marquee span { font-size: 13px; color: #d97706; padding-right: 50px; }
@keyframes scroll { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }

.grid { column-count: 2; column-gap: 12px; padding: 0 16px; position: relative; z-index: 2; }
.grid > * { break-inside: avoid; margin-bottom: 12px; }
.loading-text, .empty { text-align: center; padding: 40px 0; color: #94a3b8; font-size: 14px; }
.load-more-wrap { text-align: center; padding: 20px 0 40px; position: relative; z-index: 2; }
.load-more-btn { background: #fff; color: #3b82f6; border: 1px solid #bfdbfe; padding: 10px 30px; border-radius: 20px; cursor: pointer; font-size: 14px; font-weight: bold; box-shadow: 0 2px 8px rgba(0,0,0,0.02); }

/* 广告卡片 */
.ad-card { background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.03); position: relative; border: 1px solid #f1f5f9; }
.ad-tag { position: absolute; top: 8px; left: 8px; background: rgba(0,0,0,0.4); color: #fff; font-size: 10px; padding: 2px 6px; border-radius: 4px; z-index: 2; }
.ad-card img { width: 100%; aspect-ratio: 1/1; object-fit: cover; display: block; }
.ad-info { padding: 12px; }
.ad-info h4 { margin: 0 0 4px; font-size: 13px; color: #1e293b; font-weight: 600; }
.ad-info p { margin: 0; font-size: 12px; color: #f59e0b; }
</style>
