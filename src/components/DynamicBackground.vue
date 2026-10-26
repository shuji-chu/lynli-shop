<template>
  <div class="dyn-bg" aria-hidden="true">
    <canvas ref="canvasRef" class="dyn-canvas"></canvas>
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
let particles = []
let w = 0
let h = 0
let dpr = 1
let running = true
let lastResize = 0

// 暗红 + 金色调粒子
const COLORS = ['rgba(212,175,107,', 'rgba(255,90,110,', 'rgba(120,30,55,']

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
  initParticles()
}

function initParticles() {
  // 数量随屏幕面积自适应，并设上限保证流畅
  const count = Math.min(90, Math.max(28, Math.floor((w * h) / 16000)))
  particles = []
  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      r: Math.random() * 1.8 + 0.6,
      c: COLORS[Math.floor(Math.random() * COLORS.length)],
      a: Math.random() * 0.5 + 0.18
    })
  }
}

function draw() {
  if (!running) return
  ctx.clearRect(0, 0, w, h)

  for (const p of particles) {
    p.x += p.vx
    p.y += p.vy
    if (p.x < 0 || p.x > w) p.vx *= -1
    if (p.y < 0 || p.y > h) p.vy *= -1
    ctx.beginPath()
    ctx.fillStyle = p.c + p.a + ')'
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
    ctx.fill()
  }

  // 近邻连线（限制距离与开销）
  const maxD2 = 14000
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const a = particles[i]
      const b = particles[j]
      const dx = a.x - b.x
      const dy = a.y - b.y
      const d2 = dx * dx + dy * dy
      if (d2 < maxD2) {
        const o = (1 - d2 / maxD2) * 0.1
        ctx.strokeStyle = 'rgba(212,175,107,' + o + ')'
        ctx.lineWidth = 0.6
        ctx.beginPath()
        ctx.moveTo(a.x, a.y)
        ctx.lineTo(b.x, b.y)
        ctx.stroke()
      }
    }
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
    // 尊重无障碍：仅静态绘制一帧
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
      1200px 800px at 72% -12%,
      rgba(70, 20, 40, 0.55),
      transparent 60%
    ),
    radial-gradient(900px 700px at 8% 112%, rgba(40, 30, 15, 0.5), transparent 60%),
    linear-gradient(160deg, #07070b 0%, #0c0c14 50%, #08080d 100%);
}
.dyn-canvas {
  position: absolute;
  inset: 0;
}
.glow {
  position: absolute;
  border-radius: 50%;
  filter: blur(70px);
  opacity: 0.5;
  mix-blend-mode: screen;
}
.glow-1 {
  width: 460px;
  height: 460px;
  top: -80px;
  right: -60px;
  background: radial-gradient(circle, rgba(255, 90, 110, 0.5), transparent 70%);
  animation: breathe 9s ease-in-out infinite;
}
.glow-2 {
  width: 520px;
  height: 520px;
  bottom: -120px;
  left: -80px;
  background: radial-gradient(circle, rgba(212, 175, 107, 0.35), transparent 70%);
  animation: breathe 12s ease-in-out infinite reverse;
}
.glow-3 {
  width: 360px;
  height: 360px;
  top: 38%;
  left: 56%;
  background: radial-gradient(circle, rgba(120, 30, 55, 0.45), transparent 70%);
  animation: breathe 14s ease-in-out infinite;
}
@keyframes breathe {
  0%,
  100% {
    transform: scale(1);
    opacity: 0.32;
  }
  50% {
    transform: scale(1.18);
    opacity: 0.58;
  }
}
</style>
