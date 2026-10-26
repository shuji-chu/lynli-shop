// 金额格式化：统一保留两位小数，默认人民币符号
export function formatPrice(value, symbol = '¥') {
  const n = Number(value)
  if (Number.isNaN(n)) return `${symbol}0.00`
  return `${symbol}${n.toFixed(2)}`
}

// 大额数字千分位
export function formatNumber(value) {
  const n = Number(value)
  if (Number.isNaN(n)) return '0'
  return n.toLocaleString('zh-CN')
}

// 时间戳格式化（秒或毫秒自适应）
export function formatTime(input) {
  if (!input) return ''
  let ts = Number(input)
  if (Number.isNaN(ts)) return ''
  if (ts.toString().length <= 10) ts = ts * 1000
  const d = new Date(ts)
  if (Number.isNaN(d.getTime())) return ''
  const p = (x) => String(x).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`
}

// 脱敏邮箱：a****@domain.com
export function maskEmail(email) {
  if (!email || !email.includes('@')) return email
  const [name, domain] = email.split('@')
  const head = name.slice(0, 1)
  return `${head}****@${domain}`
}
