// ============================================================
// 价格中枢（全局唯一可信源）—— 加价 35% 红线
// ------------------------------------------------------------
// 数据库 shop_products.price 存的是「底价 / 原价」。
// 前端展示给买家的价格必须 = 底价 × MARKUP_RATE。
//
// 列表价 / 详情价 / 购物车总价 / 结算应付 / 提交给后端的订单金额
// 全部经本文件计算，确保「金额一致性红线」全局只有这一个出口，
// 任何页面都不允许就地写 `price * 1.35`，必须调用本模块。
//
// 注：订单金额与支付二维码金额由后端最终决定。后端当前按
// shop_products.price 落单（见仓库 guanli/api_shop.py），因此
// 「二维码金额 = 上浮 35%」需在后端取值口径对齐后才会完全一致；
// 前端已在此统一上浮，后端一旦按前端 amount 或按上浮价取值，
// 全链路金额即自动一致。
// ============================================================

export const MARKUP_RATE = 1.35

// 底价（元，来自后端 price 字段）→ 买家展示价（保留两位小数）
export function markupPrice(base) {
  const n = Number(base)
  if (!Number.isFinite(n)) return 0
  return Math.round(n * MARKUP_RATE * 100) / 100
}

// 单品多件小计：底价 × 数量 → 上浮后小计
export function markupSubtotal(base, qty = 1) {
  const b = Number(base) || 0
  const q = Number(qty) || 0
  return markupPrice(b * q)
}

// 多行购物车/结算：传入「底价列表」，返回上浮后的选中总价
// items: [{ price: 底价, qty }]
export function markupTotal(items) {
  if (!Array.isArray(items)) return 0
  const sum = items.reduce(
    (s, i) => s + (Number(i.price) || 0) * (Number(i.qty) || 1),
    0
  )
  return markupPrice(sum)
}
