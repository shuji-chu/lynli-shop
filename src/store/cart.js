import { ref, computed } from 'vue'

// 从本地存储读取初始购物车数据
const storedCart = localStorage.getItem('cart_items')
export const cartItems = ref(storedCart ? JSON.parse(storedCart) : [])

// 确保历史数据里有 selected 属性，默认选中
cartItems.value.forEach(item => {
  if (item.selected === undefined) item.selected = true
})

const saveCart = () => {
  localStorage.setItem('cart_items', JSON.stringify(cartItems.value))
}

// 购物车总数量
export const totalCount = computed(() => {
  return cartItems.value.reduce((sum, item) => sum + item.quantity, 0)
})

// 添加商品
export const addToCart = (product, quantity = 1) => {
  const existingItem = cartItems.value.find(item => item.id === product.id)
  if (existingItem) {
    existingItem.quantity += quantity
  } else {
    cartItems.value.push({
      id: product.id,
      name: product.name || product.title,
      price: product.price,
      image: product.image || product.cover,
      quantity: quantity,
      selected: true // 默认选中
    })
  }
  saveCart()
}

// 移除商品
export const removeFromCart = (productId) => {
  cartItems.value = cartItems.value.filter(item => item.id !== productId)
  saveCart()
}

// 清空购物车
export const clearCart = () => {
  cartItems.value = []
  saveCart()
}

// 计算选中的商品列表
export const selectedItems = computed(() => {
  return cartItems.value.filter(item => item.selected)
})

// 计算选中的商品总数量
export const selectedCount = computed(() => {
  return selectedItems.value.reduce((sum, item) => sum + item.quantity, 0)
})

// 计算选中的商品总金额
export const selectedTotal = computed(() => {
  return selectedItems.value.reduce((sum, item) => sum + (item.price * item.quantity), 0)
})

// 全选/取消全选
export const setSelectAll = (val) => {
  cartItems.value.forEach(item => {
    item.selected = val
  })
  saveCart()
}

// 改变单个商品的选中状态
export const updateSelected = (productId, val) => {
  const item = cartItems.value.find(item => item.id === productId)
  if (item) {
    item.selected = val
    saveCart()
  }
}
