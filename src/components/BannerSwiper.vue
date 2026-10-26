<template>
  <div class="banner-wrapper" v-if="banners.length > 0">
    <!-- 滑动轨道 -->
    <div class="banner-track" ref="trackRef" @scroll="onScroll">
      <div 
        class="banner-slide" 
        v-for="(banner, index) in banners" 
        :key="index" 
        :style="{ background: banner.bg_color || 'linear-gradient(135deg, #1e3a8a, #3b82f6)' }"
        @click="handleClick(banner)"
      >
        <div class="banner-content">
          <h2>{{ banner.title }}</h2>
          <p>{{ banner.desc_text }}</p>
          <button class="banner-btn">{{ banner.btn_text }}</button>
        </div>
      </div>
    </div>
    <!-- 指示点 -->
    <div class="dots" v-if="banners.length > 1">
      <span 
        v-for="(banner, index) in banners" 
        :key="index" 
        :class="{ active: currentIndex === index }"
        @click.stop="scrollToSlide(index)"
      ></span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps({
  banners: { type: Array, default: () => [] }
})

const router = useRouter()
const trackRef = ref(null)
const currentIndex = ref(0)
let timer = null

// 点击跳转逻辑
const handleClick = (banner) => {
  if (!banner.link_url) return
  if (banner.link_url.startsWith('http')) {
    window.location.href = banner.link_url
  } else {
    router.push(banner.link_url)
  }
}

// 滑动监听（更新圆点）
const onScroll = () => {
  if (!trackRef.value) return
  const width = trackRef.value.offsetWidth
  currentIndex.value = Math.round(trackRef.value.scrollLeft / width)
}

// 点击圆点滑动
const scrollToSlide = (index) => {
  if (!trackRef.value) return
  trackRef.value.scrollTo({
    left: index * trackRef.value.offsetWidth,
    behavior: 'smooth'
  })
}

// 自动轮播
const startAutoPlay = () => {
  if (props.banners.length <= 1) return
  timer = setInterval(() => {
    let next = (currentIndex.value + 1) % props.banners.length
    scrollToSlide(next)
  }, 4000)
}

onMounted(() => {
  startAutoPlay()
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>

<style scoped>
.banner-wrapper { margin: 0 16px 20px; border-radius: 20px; overflow: hidden; position: relative; box-shadow: 0 12px 30px rgba(30, 58, 138, 0.15); }

/* 核心滑动区 */
.banner-track {
  display: flex;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scrollbar-width: none; /* 隐藏滚动条 */
  height: 160px;
}
.banner-track::-webkit-scrollbar { display: none; }

.banner-slide {
  flex: 0 0 100%;
  scroll-snap-align: start;
  padding: 24px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  cursor: pointer;
}

.banner-content h2 { font-size: 22px; color: #fff; margin: 0 0 8px; font-weight: 800; letter-spacing: 0.5px; }
.banner-content p { font-size: 13px; color: rgba(255,255,255,0.85); margin: 0 0 16px; }
.banner-btn { background: #fff; color: #1e3a8a; border: none; padding: 8px 20px; border-radius: 20px; font-size: 13px; font-weight: bold; pointer-events: none; /* 让点击事件冒泡给父级 */ }

/* 指示点 */
.dots { position: absolute; bottom: 12px; left: 0; right: 0; display: flex; justify-content: center; gap: 6px; z-index: 10; }
.dots span { width: 6px; height: 6px; border-radius: 50%; background: rgba(255,255,255,0.4); transition: all 0.3s; cursor: pointer; }
.dots span.active { width: 16px; border-radius: 3px; background: #fff; }
</style>
