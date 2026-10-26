import request from './request'

// 创建订单：POST /api/v1/shop/order
// payload 约定：{ items: [{ id, qty }], address, contact, method, amount }
//   amount 为前端按底价上浮 35%（价格中枢 markupTotal）后的应付总额，
//   用于前向兼容后端取值口径（后端当前以 shop_products.price 落单）。
// 返回：{ trade_no, amount, ... }
export function createOrder(payload) {
  return request.post('/api/v1/shop/order', payload)
}

// 发起支付：POST /api/v1/user/order/pay
// payload 约定：{ trade_no, method: 'alipay' | 'usdt' | 'wechat' }
// 后端支付分发按 method 路由（见 guanli/api_pay.py 的 handle），
// 其中 wechat 即为「微信支付 v3」的预留接口位：当后台配置微信 v3
// 通道（payment_configs 增加 wechat 项）后，前端无需改动即可启用。
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
