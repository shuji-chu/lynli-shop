<template>
  <div class="address-page">
    <div class="header">
      <button @click="$router.back()" class="back-btn">←</button>
      <h2>{{ isSelectMode ? '选择收货地址' : '收货地址' }}</h2>
      <div class="add-btn" @click="openAdd">新增地址</div>
    </div>

    <div class="list" v-if="addresses.length">
      <!-- 🚨 关键修改：如果是在选择模式下，点击整行触发选择；否则点击编辑图标 -->
      <div class="item" v-for="addr in addresses" :key="addr.id" @click="handleSelect(addr)">
        <div class="addr-top">
          <span class="region">{{ addr.province }} {{ addr.city }} {{ addr.district }}</span>
        </div>
        <h3 class="detail">{{ addr.detail }}</h3>
        <div class="info">
          <span class="name">{{ addr.name }}</span>
          <span class="phone">{{ addr.phone }}</span>
          <span class="tag" v-if="addr.is_default == 1">默认</span>
          <span class="tag orange" v-if="addr.tag">{{ addr.tag }}</span>
        </div>
        <!-- 只有在非选择模式下，才显示编辑按钮 -->
        <div class="edit-icon" v-if="!isSelectMode" @click.stop="openEdit(addr)">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#94a3b8" stroke-width="1.5"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
        </div>
      </div>
      <div class="end">到底啦</div>
    </div>
    <div v-else class="empty">暂无收货地址，点击右上角新增</div>

    <!-- 新增/编辑弹窗保持不变 -->
    <div class="modal-mask" v-if="showModal" @click.self="showModal = false">
      <div class="modal-content">
        <h3>{{ isEdit ? '编辑地址' : '新增地址' }}</h3>
        <input v-model="form.name" placeholder="收货人姓名" class="input" />
        <input v-model="form.phone" placeholder="手机号码" class="input" />
        <input v-model="form.province" placeholder="省 / 直辖市" class="input" />
        <input v-model="form.city" placeholder="市 / 区" class="input" />
        <input v-model="form.detail" placeholder="详细地址（如街道、门牌号）" class="input" />
        <div class="default-checkbox" @click="form.is_default = form.is_default ? 0 : 1">
          <div class="check" :class="{ active: form.is_default }"></div> 设为默认地址
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

// 判断是否为选择模式（从结算页跳转过来）
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

// 选择地址逻辑
const handleSelect = (addr) => {
  if (isSelectMode.value) {
    localStorage.setItem('selected_address', JSON.stringify(addr))
    router.back() // 直接返回上一页（结算页）
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
.address-page { min-height: 100vh; background: #f4f4f4; padding-bottom: 20px; }
.header { display: flex; justify-content: space-between; align-items: center; height: 50px; padding: 0 16px; background: #fff; position: sticky; top: 0; z-index: 10; }
.back-btn { background: none; border: none; font-size: 24px; color: #333; }
.header h2 { font-size: 17px; margin: 0; color: #333; }
.add-btn { color: #ff5000; font-size: 14px; cursor: pointer; }

.list { padding-top: 10px; }
.item { background: #fff; padding: 16px; position: relative; margin-bottom: 10px; cursor: pointer; }
.addr-top { font-size: 12px; color: #999; margin-bottom: 6px; }
.detail { font-size: 16px; color: #333; margin: 0 0 8px; font-weight: 500; padding-right: 30px; }
.info { display: flex; align-items: center; gap: 10px; font-size: 14px; color: #333; }
.tag { font-size: 10px; padding: 2px 6px; border-radius: 4px; background: #fff0e8; color: #ff5000; }
.tag.orange { background: #fff0e8; color: #ff5000; }
.edit-icon { position: absolute; right: 16px; bottom: 16px; padding: 4px; cursor: pointer; }
.end { text-align: center; font-size: 13px; color: #999; padding: 20px 0; }

.empty { text-align: center; padding: 50px 0; color: #999; }

.modal-mask { position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: flex-end; z-index: 100; }
.modal-content { width: 100%; background: #fff; border-radius: 20px 20px 0 0; padding: 20px; animation: slideUp 0.3s; }
.modal-content h3 { margin: 0 0 16px; text-align: center; font-size: 16px; }
.input { width: 100%; border: 1px solid #eee; border-radius: 8px; padding: 12px; margin-bottom: 12px; font-size: 14px; box-sizing: border-box; }
.default-checkbox { display: flex; align-items: center; gap: 8px; font-size: 14px; margin: 10px 0 20px; cursor: pointer; }
.check { width: 18px; height: 18px; border-radius: 50%; border: 1px solid #ccc; }
.check.active { background: #ff5000; border-color: #ff5000; }
.modal-btns { display: flex; gap: 10px; }
.save-btn { flex: 1; background: #ff5000; color: #fff; border: none; padding: 12px; border-radius: 20px; font-size: 15px; font-weight: bold; }
.del-btn { background: #fee2e2; color: #ef4444; border: none; padding: 0 20px; border-radius: 20px; font-size: 15px; font-weight: bold; }
@keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
</style>
