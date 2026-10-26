<template>
  <div class="banner-carousel">
    <div class="banner-track" :style="{ transform: `translateX(-${currentIndex * 100}%)` }">
      <div class="banner-slide" v-for="(banner, index) in banners" :key="index" :style="{ background: banner.bg }">
        <div class="banner-content">
          <h2>{{ banner.title }}</h2>
          <p>{{ banner.desc }}</p>
          <button class="banner-btn">{{ banner.btnText }}</button>
        </div>
      </div>
    </div>
    <div class="dots">
      <span v-for="(banner, index) in banners" :key="index" :class="{ active: currentIndex === index }" @click="currentIndex = index"></span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  banners: { type: Array, default: () => [] }
})

const currentIndex = ref(0)
let timer = null

onMounted(() => {
  if (props.banners.length > 1) {
    timer = setInterval(() => {
      currentIndex.value = (currentIndex.value + 1) % props.banners.length
    }, 4000)
  }
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>

<style scoped>
.banner-carousel { margin: 0 16px 20px; border-radius: 20px; overflow: hidden; position: relative; z-index: 2; box-shadow: 0 12px 30px rgba(30, 58, 138, 0.15); }
.banner-track { display: flex; transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1); height: 160px; }
.banner-slide { min-width: 100%; padding: 24px; box-sizing: border-box; display: flex; align-items: center; position: relative; overflow: hidden; }
.banner-content h2 { font-size: 20px; color: #fff; margin: 0 0 6px; font-weight: 800; }
.banner-content p { font-size: 13px; color: rgba(255,255,255,0.8); margin: 0 0 16px; }
.banner-btn { background: #fff; color: #1e3a8a; border: none; padding: 6px 16px; border-radius: 20px; font-size: 13px; font-weight: bold; cursor: pointer; align-self: flex-start; }
.dots { position: absolute; bottom: 12px; left: 0; right: 0; display: flex; justify-content: center; gap: 6px; }
.dots span { width: 6px; height: 6px; border-radius: 50%; background: rgba(255,255,255,0.4); transition: all 0.3s; }
.dots span.active { width: 16px; border-radius: 3px; background: #fff; }
</style>
