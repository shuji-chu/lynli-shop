<template>
  <div class="page-wrap">
    <div class="header"><button @click="$router.back()">←</button><h2>{{ title }}</h2><div></div></div>
    <div class="content">
      <div class="form-card">
        <input v-model="form.name" placeholder="您的称呼 / 公司名称" />
        <input v-model="form.contact" placeholder="联系电话 / 邮箱" />
        <textarea v-model="form.desc" placeholder="请简单描述您的诉求..."></textarea>
        <button class="submit-btn" @click="submit">提交申请</button>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { Toast } from '@/utils/toast'
const route = useRoute()
const title = computed(() => route.query.type === 'merchant' ? '商家入驻' : 'API 开放平台申请')
const form = ref({ name: '', contact: '', desc: '' })
const submit = () => {
  if (!form.value.name || !form.value.contact) return Toast.error('请填写必填项')
  Toast.success('申请已提交，我们将尽快联系您')
  form.value = { name: '', contact: '', desc: '' }
}
</script>
<style scoped>
.page-wrap { min-height: 100vh; background: #f5f7fa; }
.header { height: 56px; background: #fff; display: flex; align-items: center; justify-content: space-between; padding: 0 16px; }
.header button { background: none; border: none; font-size: 24px; }
.header h2 { font-size: 18px; margin: 0; }
.content { padding: 16px; }
.form-card { background: #fff; border-radius: 16px; padding: 20px; display: flex; flex-direction: column; gap: 16px; }
input, textarea { width: 100%; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; font-size: 14px; outline: none; box-sizing: border-box; }
textarea { height: 100px; resize: none; }
.submit-btn { background: #3b82f6; color: #fff; border: none; padding: 14px; border-radius: 24px; font-size: 16px; font-weight: bold; margin-top: 10px; }
</style>
