<template>
  <div class="chat-widget">
    <div class="chat-btn" @click="toggleChat">
      <svg v-if="!isOpen" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
      <svg v-else viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
    </div>

    <transition name="chat-pop">
      <div class="chat-window" v-if="isOpen">
        <div class="chat-header">
          <div class="ai-info">
            <span class="status-dot"></span>
            <span class="ai-name">LYNLI 专属客服</span>
          </div>
        </div>
        
        <div class="chat-messages" ref="msgContainer">
          <div class="msg-row ai">
            <div class="avatar">AI</div>
            <div class="bubble">您好，我是您的专属 AI 客服，请问有什么可以帮您？</div>
          </div>
          <div v-for="(msg, i) in messages" :key="i" class="msg-row" :class="msg.role">
            <div class="avatar" v-if="msg.role === 'ai'">AI</div>
            <div class="bubble">{{ msg.content }}</div>
            <div class="avatar" v-if="msg.role === 'user'">我</div>
          </div>
          <div v-if="loading" class="msg-row ai">
            <div class="avatar">AI</div>
            <div class="bubble typing">正在输入...</div>
          </div>
        </div>

        <div class="chat-input-area">
          <input v-model="inputText" @keyup.enter="sendMsg" placeholder="请输入您的问题..." />
          <button @click="sendMsg" :disabled="loading">发送</button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue'

const isOpen = ref(false)
const inputText = ref('')
const messages = ref([])
const loading = ref(false)
const msgContainer = ref(null)

function toggleChat() {
  isOpen.value = !isOpen.value
  if (isOpen.value) scrollToBottom()
}

async function sendMsg() {
  if (!inputText.value.trim() || loading.value) return
  const text = inputText.value
  messages.value.push({ role: 'user', content: text })
  inputText.value = ''
  loading.value = true
  scrollToBottom()

  try {
    // 直接对接你服务器的 AI 接口
    const res = await fetch('https://api.lynli.me/api/ai_agent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        message: text,
        platform: 'lynli_c_end' 
      })
    })
    
    const data = await res.json()
    const reply = data.data?.reply || data.reply || data.content || 'AI 正在思考中...'
    
    messages.value.push({ role: 'ai', content: reply })
  } catch (e) {
    messages.value.push({ role: 'ai', content: '网络连接中断，请稍后再试。' })
  } finally {
    loading.value = false
    scrollToBottom()
  }
}

function scrollToBottom() {
  nextTick(() => {
    if (msgContainer.value) {
      msgContainer.value.scrollTop = msgContainer.value.scrollHeight
    }
  })
}
</script>

<style scoped>
.chat-widget { position: fixed; bottom: 90px; right: 20px; z-index: 999; }
.chat-btn { width: 50px; height: 50px; border-radius: 50%; background: #3b82f6; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 15px rgba(59, 130, 246, 0.4); cursor: pointer; transition: transform 0.2s; }
.chat-btn:active { transform: scale(0.9); }
.chat-btn svg { width: 24px; height: 24px; }
.chat-window { position: absolute; bottom: 60px; right: 0; width: 300px; height: 420px; background: #fff; border-radius: 16px; box-shadow: 0 10px 30px rgba(0,0,0,0.15); display: flex; flex-direction: column; overflow: hidden; border: 1px solid #f1f5f9; }
.chat-header { background: #3b82f6; padding: 12px 16px; display: flex; align-items: center; }
.ai-info { display: flex; align-items: center; gap: 6px; }
.status-dot { width: 8px; height: 8px; background: #4ade80; border-radius: 50%; }
.ai-name { color: #fff; font-size: 14px; font-weight: 500; }
.chat-messages { flex: 1; padding: 16px; overflow-y: auto; background: #f8fafc; display: flex; flex-direction: column; gap: 12px; }
.msg-row { display: flex; align-items: flex-start; gap: 8px; }
.msg-row.user { flex-direction: row-reverse; }
.avatar { width: 28px; height: 28px; border-radius: 50%; background: #cbd5e1; color: #fff; font-size: 12px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.msg-row.ai .avatar { background: #3b82f6; }
.bubble { max-width: 75%; padding: 10px 12px; border-radius: 12px; font-size: 13px; line-height: 1.4; word-break: break-all; }
.msg-row.ai .bubble { background: #fff; color: #334155; border-top-left-radius: 2px; box-shadow: 0 2px 5px rgba(0,0,0,0.02); }
.msg-row.user .bubble { background: #3b82f6; color: #fff; border-top-right-radius: 2px; }
.bubble.typing { color: #94a3b8; font-style: italic; }
.chat-input-area { padding: 12px; background: #fff; border-top: 1px solid #f1f5f9; display: flex; gap: 8px; }
.chat-input-area input { flex: 1; border: 1px solid #e2e8f0; background: #f8fafc; border-radius: 20px; padding: 8px 14px; font-size: 13px; outline: none; }
.chat-input-area button { background: #3b82f6; color: #fff; border: none; padding: 0 16px; border-radius: 20px; font-size: 13px; font-weight: bold; cursor: pointer; }
.chat-pop-enter-active, .chat-pop-leave-active { transition: all 0.3s ease; }
.chat-pop-enter-from, .chat-pop-leave-to { opacity: 0; transform: translateY(20px) scale(0.95); }
</style>
