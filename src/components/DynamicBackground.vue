<template>
  <div class="dyn-bg" aria-hidden="true">
    <!-- 蓝白流体水波纹（Canvas 绘制） -->
    <canvas ref="canvasRef" class="dyn-canvas"></canvas>

    <!-- 纯代码绘制的女性人体曲线剪影：随波纹呼吸、缓缓起伏 -->
    <svg class="silhouette" viewBox="0 0 320 560" preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id="silGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#bcd6ff" stop-opacity="0.55" />
          <stop offset="0.55" stop-color="#eaf2ff" stop-opacity="0.30" />
          <stop offset="1" stop-color="#ffffff" stop-opacity="0.10" />
        </linearGradient>
        <linearGradient id="silEdge" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#ffffff" stop-opacity="0.7" />
          <stop offset="1" stop-color="#9fc1ff" stop-opacity="0.35" />
        </linearGradient>
      </defs>

      <!-- 头部 -->
      <circle cx="172" cy="86" r="38" fill="url(#silGrad)" />
      <!-- 颈—肩—胸—腰—臀—腿 的优雅侧影轮廓 -->
      <path
        class="sil-body"
        fill="url(#silGrad)"
        stroke="url(#silEdge)"
        stroke-width="1.4"
        d="M172 122
           C 150 134, 148 154, 158 176
           C 170 202, 150 214, 150 246
           C 150 278, 166 286, 160 328
           C 150 372, 138 416, 150 486
           C 157 528, 180 532, 192 514
           C 182 482, 200 430, 210 368
           C 220 304, 214 232, 202 182
           C 196 152, 202 136, 196 128
           C 190 120, 180 118, 172 122 Z"
      />
      <!-- 第二层更淡的镜像曲线，增加层次与迷离感 -->
      <path
        class="sil-body sil-mirror"
        fill="url(#silGrad)"
        d="M150 246
           C 150 278, 166 286, 160 328
           C 150 372, 138 416, 150 486
           C 138 452, 132 400, 142 348
           C 152 300, 156 268, 150 246 Z"
      />
    </svg>

    <!-- 呼吸光晕 -->
    <div class="glow glow-1"></div>
    <div class="glow glow-2"></div>
    <div class="glow glow-3"></div>
  </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue'

const canvasRef = ref(null)
let ctx = null
let raf = 0
let w = 0
let h = 0
let dpr = 1
let running = true
let lastResize = 0
let t = 0

// 蓝白水波纹：若干条相位错开的横向正弦波带，缓慢流动
const WAVES = [
  { amp: 26, len: 0.006, speed: 0.6, y: 0.30, color: 'rgba(110,160,255,0.10)' },
  { amp: 34, len: 0.005, speed: 0.42, y: 0.52, color: 'rgba(150,190,255,0.09)' },
  { amp: 22, len: 0.007, speed: 0.85, y: 0.72, color: 'rgba(255,255,255,0.14)' },
  { amp: 40, len: 0.004, speed: 0.3, y: 0.88, color: 'rgba(90,140,255,0.07)' }
]

function resize() {
  const canvas = canvasRef.value
  if (!canvas) return
  dpr = Math.min(window.devicePixelRatio || 1, 2)
  w = window.innerWidth
  h = window.innerHeight
  canvas.width = Math.floor(w * dpr)
  canvas.height = Math.floor(h * dpr)
  canvas.style.width = w + 'px'
  canvas.style.height = h + 'px'
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
}

function draw() {
  if (!running) return
  ctx.clearRect(0, 0, w, h)
  t += 1
  for (const wave of WAVES) {
    const baseY = h * wave.y
    ctx.beginPath()
    for (let x = 0; x <= w; x += 8) {
      const y = baseY + Math.sin(x * wave.len + t * 0.02 * wave.speed * 10) * wave.amp
      if (x === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    }
    ctx.lineTo(w, h)
    ctx.lineTo(0, h)
    ctx.closePath()
    ctx.fillStyle = wave.color
    ctx.fill()
  }
  raf = requestAnimationFrame(draw)
}

function onVisibility() {
  if (document.hidden) {
    running = false
    cancelAnimationFrame(raf)
  } else if (!running) {
    running = true
    raf = requestAnimationFrame(draw)
  }
}

function onResize() {
  const now = Date.now()
  if (now - lastResize < 200) return
  lastResize = now
  resize()
}

onMounted(() => {
  const canvas = canvasRef.value
  if (!canvas) return
  ctx = canvas.getContext('2d')

  const reduce =
    window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  resize()
  if (reduce) {
    draw()
    cancelAnimationFrame(raf)
    running = false
    return
  }

  raf = requestAnimationFrame(draw)
  window.addEventListener('resize', onResize)
  document.addEventListener('visibilitychange', onVisibility)
})

onBeforeUnmount(() => {
  cancelAnimationFrame(raf)
  window.removeEventListener('resize', onResize)
  document.removeEventListener('visibilitychange', onVisibility)
})
</script>

<style scoped>
.dyn-bg {
  position: fixed;
  inset: 0;
  z-index: 0;
  overflow: hidden;
  pointer-events: none;
  background: radial-gradient(
      1200px 820px at 78% -10%,
      rgba(150, 190, 255, 0.45),
      transparent 60%
    ),
    radial-gradient(900px 760px at 6% 112%, rgba(200, 222, 255, 0.5), transparent 60%),
    linear-gradient(160deg, #e7f0ff 0%, #f8fbff 48%, #e2edff 100%);
}
.dyn-canvas {
  position: absolute;
  inset: 0;
}
.silhouette {
  position: absolute;
  right: 4%;
  bottom: -2%;
  height: 78vh;
  max-height: 720px;
  width: auto;
  opacity: 0.9;
  filter: blur(1.5px) drop-shadow(0 20px 60px rgba(120, 160, 255, 0.25));
  transform-origin: 50% 100%;
  animation: breathe-sil 11s ease-in-out infinite;
}
.sil-mirror {
  opacity: 0.5;
  animation: breathe-sil 13s ease-in-out infinite reverse;
}
@keyframes breathe-sil {
  0%,
  100% {
    transform: translateY(0) scale(1) skewX(0deg);
    opacity: 0.78;
  }
  50% {
    transform: translateY(-14px) scale(1.025) skewX(-1.2deg);
    opacity: 0.95;
  }
}
.glow {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  mix-blend-mode: screen;
}
.glow-1 {
  width: 480px;
  height: 480px;
  top: -90px;
  right: -70px;
  background: radial-gradient(circle, rgba(120, 170, 255, 0.55), transparent 70%);
  animation: breathe 9s ease-in-out infinite;
}
.glow-2 {
  width: 540px;
  height: 540px;
  bottom: -130px;
  left: -90px;
  background: radial-gradient(circle, rgba(190, 215, 255, 0.5), transparent 70%);
  animation: breathe 12s ease-in-out infinite reverse;
}
.glow-3 {
  width: 380px;
  height: 380px;
  top: 40%;
  left: 52%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.55), transparent 70%);
  animation: breathe 15s ease-in-out infinite;
}
@keyframes breathe {
  0%,
  100% {
    transform: scale(1);
    opacity: 0.45;
  }
  50% {
    transform: scale(1.18);
    opacity: 0.72;
  }
}
@media (max-width: 640px) {
  .silhouette {
    height: 56vh;
    right: -6%;
    opacity: 0.72;
  }
}
</style>
