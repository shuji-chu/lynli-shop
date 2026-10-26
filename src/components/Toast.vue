<template>
  <div class="toast-layer">
    <transition-group name="toast">
      <div v-for="t in list" :key="t.id" class="toast" :class="t.type">
        <span class="dot"></span>
        <span class="msg">{{ t.msg }}</span>
      </div>
    </transition-group>
  </div>
</template>

<script setup>
import { reactive, onMounted } from 'vue'
import { registerToast } from '@/utils/toast'

let uid = 0
const list = reactive([])

function show(message, type = 'info', duration = 2200) {
  const id = ++uid
  list.push({ id, msg: String(message), type })
  setTimeout(() => {
    const idx = list.findIndex((x) => x.id === id)
    if (idx > -1) list.splice(idx, 1)
  }, duration)
}

onMounted(() => registerToast({ show }))
defineExpose({ show })
</script>

<style scoped>
.toast-layer {
  position: fixed;
  top: 18px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 9999;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  pointer-events: none;
  width: max-content;
  max-width: 86vw;
}
.toast {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  padding: 11px 18px;
  border-radius: 14px;
  font-size: 14px;
  color: var(--text-1);
  background: rgba(10, 10, 15, 0.92);
  border: 1px solid rgba(255, 255, 255, 0.12);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}
.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--gold);
  flex: 0 0 auto;
}
.toast.success .dot {
  background: var(--ok);
}
.toast.error .dot {
  background: var(--danger);
}
.toast.error {
  border-color: rgba(255, 90, 110, 0.4);
}
.toast.success {
  border-color: rgba(74, 214, 160, 0.4);
}
.toast-enter-active,
.toast-leave-active {
  transition: all 0.32s cubic-bezier(0.16, 1, 0.3, 1);
}
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(-12px) scale(0.96);
}
</style>
