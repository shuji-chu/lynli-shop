<template>
  <div class="address-page">
    <!-- 🚨 标准的返回 Header -->
    <div class="header">
      <button class="back-btn" @click="$router.back()">←</button>
      <h2>{{ isSelectMode ? '选择收货地址' : '收货地址' }}</h2>
      <div style="width: 24px;"></div>
    </div>

    <!-- 1. 空状态 -->
    <div v-if="addresses.length === 0" class="empty-state">
      <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="60" cy="60" r="50" fill="#f0f7ff"/>
        <path d="M60 30 C40 30 30 45 30 60 C30 80 60 100 60 100 C60 100 90 80 90 60 C90 45 80 30 60 30 Z" stroke="#bfdbfe" stroke-width="4"/>
        <circle cx="60" cy="60" r="10" fill="#3b82f6"/>
      </svg>
      <p>您还没有添加收货地址</p>
      <button class="big-add-btn" @click="openAdd">+ 新增收货地址</button>
    </div>

    <!-- 2. 地址列表 -->
    <div v-else class="list">
      <div class="item" v-for="addr in addresses" :key="addr.id" @click="handleSelect(addr)">
        <div class="addr-top">
          <span class="region">{{ addr.province }} {{ addr.city }} {{ addr.district }}</span>
        </div>
        <h3 class="detail">{{ addr.detail }}</h3>
        <div class="info">
          <span class="name">{{ addr.name }}</span>
          <span class="phone">{{ addr.phone }}</span>
          <span class="tag" v-if="addr.is_default == 1">默认</span>
        </div>
        <div class="edit-icon" v-if="!isSelectMode" @click.stop="openEdit(addr)">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#94a3b8" stroke-width="1.5"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
        </div>
      </div>
      <div class="end">到底啦</div>
    </div>

    <div class="bottom-btn-wrap" v-if="addresses.length > 0">
      <button class="big-add-btn" @click="openAdd">+ 新增收货地址</button>
    </div>

    <!-- 弹窗 -->
    <div class="modal-mask" v-if="showModal" @click.self="showModal = false">
      <div class="modal-content">
        <h3>{{ isEdit ? '编辑地址' : '新增地址' }}</h3>
        <input v-model="form.name" placeholder="收货人姓名" class="input" />
        <input v-model="form.phone" type="tel" placeholder="手机号码" class="input" />
        <input v-model="form.province" placeholder="省 / 直辖市" class="input" />
        <input v-model="form.city" placeholder="市 / 区" class="input" />
        <input v-model="form.detail" placeholder="详细地址（如街道、门牌号）" class="input" />
        <div class="default-checkbox" @click="form.is_default = form.is_default ? 0 : 1">
          <div class="check" :class="{ active: form.is_default }"></div> <span>设为默认地址</span>
        </div>
        <div class="modal-btns">
          <button v-if="isEdit" @click.stop="deleteAddr(form.id)" class="del-btn">删除</button>
          <button @click.stop="saveAddr" class="save-btn">保存</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import request from '@/api/request'
import { Toast } from '@/utils/toast'

const router = useRouter()
const route = useRoute()
const addresses = ref([])
const showModal = ref(false)
const isEdit = ref(false)
const isSelectMode = ref(route.query.mode === 'select')

const form = ref({ name: '', phone: '', province: '', city: '', district: '', detail: '', is_default: 0 })

const loadData = async () => {
  try {
    const res = await request.get('/api/v1/shop/addresses')
    addresses.value = res.data || res || []
  } catch (e) {
    Toast.error('加载地址失败')
  }
}

onMounted(loadData)

const handleSelect = (addr) => {
  if (isSelectMode.value) {
    localStorage.setItem('selected_address', JSON.stringify(addr))
    router.back()
  }
}

const openAdd = () => {
  isEdit.value = false
  form.value = { name: '', phone: '', province: '', city: '', district: '', detail: '', is_default: 0 }
  showModal.value = true
}

const openEdit = (addr) => {
  isEdit.value = true
  form.value = { ...addr }
  showModal.value = true
}

const saveAddr = async () => {
  if (!form.value.name || !form.value.phone || !form.value.detail) return Toast.error('请填写完整')
  try {
    await request.post('/api/v1/shop/addresses', form.value)
    Toast.success('保存成功')
    showModal.value = false
    loadData()
  } catch (e) {
    Toast.error('保存失败')
  }
}

const deleteAddr = async (id) => {
  try {
    await request.post('/api/v1/shop/addresses/delete', { id })
    Toast.success('已删除')
    showModal.value = false
    loadData()
  } catch (e) {
    Toast.error('删除失败')
  }
}
</script>

<style scoped>
.address-page { min-height: 100vh; background: #f5f7fa; padding-bottom: 20px; }

/* 🚨 顶部返回栏样式 */
.header { 
  height: 56px; background: #fff; display: flex; align-items: center; justify-content: space-between; 
  padding: 0 16px; position: sticky; top: 0; z-index: 100; border-bottom: 1px solid #f1f5f9;
}
.back-btn { background: none; border: none; font-size: 24px; color: #1e293b; cursor: pointer; }
.header h2 { font-size: 17px; margin: 0; color: #1e293b; font-weight: bold; }

/* 空状态 */
.empty-state { display: flex; flex-direction: column; align-items: center; justify-content: center; padding-top: 100px; }
.empty-state svg { width: 120px; height: 120px; margin-bottom: 20px; }
.empty-state p { font-size: 15px; color: #64748b; margin-bottom: 24px; }

.big-add-btn { background: #3b82f6; color: #fff; border: none; padding: 14px 40px; border-radius: 24px; font-size: 16px; font-weight: bold; box-shadow: 0 4px 15px rgba(59,130,246,0.3); cursor: pointer; }

/* 列表 */
.list { padding: 16px; }
.item { background: #fff; padding: 16px; position: relative; border-radius: 12px; margin-bottom: 12px; cursor: pointer; box-shadow: 0 2px 10px rgba(0,0,0,0.02); }
.addr-top { font-size: 12px; color: #94a3b8; margin-bottom: 6px; }
.detail { font-size: 16px; color: #1e293b; margin: 0 0 8px; font-weight: bold; padding-right: 30px; }
.info { display: flex; align-items: center; gap: 10px; font-size: 14px; color: #334155; }
.tag { font-size: 10px; padding: 2px 6px; border-radius: 4px; background: #eff6ff; color: #3b82f6; font-weight: bold; }
.edit-icon { position: absolute; right: 16px; bottom: 16px; padding: 8px; cursor: pointer; }
.end { text-align: center; font-size: 13px; color: #94a3b8; padding: 20px 0; }

.bottom-btn-wrap { position: fixed; bottom: 30px; left: 0; right: 0; display: flex; justify-content: center; z-index: 10; }

/* 弹窗 */
.modal-mask { position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: flex-end; z-index: 9999; }
.modal-content { width: 100%; background: #fff; border-radius: 20px 20px 0 0; padding: 20px; padding-bottom: calc(20px + env(safe-area-inset-bottom) + 20px); animation: slideUp 0.3s; }
.modal-content h3 { margin: 0 0 16px; text-align: center; font-size: 16px; }
.input { width: 100%; border: 1px solid #eee; border-radius: 8px; padding: 12px; margin-bottom: 12px; font-size: 14px; box-sizing: border-box; background: #f8fafc; }
.default-checkbox { display: flex; align-items: center; gap: 8px; font-size: 14px; margin: 10px 0 20px; cursor: pointer; color: #334155; }
.check { width: 18px; height: 18px; border-radius: 50%; border: 1px solid #ccc; }
.check.active { background: #3b82f6; border-color: #3b82f6; }
.modal-btns { display: flex; gap: 10px; }
.save-btn { flex: 1; background: #3b82f6; color: #fff; border: none; padding: 14px; border-radius: 20px; font-size: 16px; font-weight: bold; }
.del-btn { background: #fee2e2; color: #ef4444; border: none; padding: 0 20px; border-radius: 20px; font-size: 16px; font-weight: bold; }
@keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
</style>
