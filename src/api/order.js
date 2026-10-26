import request from './request'

// 创建订单：POST /api/v1/shop/order
// payload 约定：{ items: [{ id, qty }], address, remark }
// 返回：{ trade_no, amount, ... }
export function createOrder(payload) {
  return request.post('/api/v1/shop/order', payload)
}

// 发起支付：POST /api/v1/user/order/pay
// payload 约定：{ trade_no, method: 'alipay' | 'usdt' }
// 返回（示例）：
//   支付宝 -> { method:'alipay', qr_url?(图片), pay_url?(待生成二维码的字符串), expire_at }
//   USDT  -> { method:'usdt', address, amount, network, expire_at }
export function payOrder(payload) {
  return request.post('/api/v1/user/order/pay', payload)
}

// 轮询查单：GET /api/v1/user/order/query?trade_no=xxx
// 返回：{ trade_no, status, paid }（status: 'pending' | 'paid' | 'closed' 等）
export function queryOrder(tradeNo) {
  return request.get('/api/v1/user/order/query', { params: { trade_no: tradeNo } })
}

// 我的订单列表：GET /api/v1/user/orders
export function getMyOrders(params = {}) {
  return request.get('/api/v1/user/orders', { params })
}
