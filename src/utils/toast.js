// 轻量全局 Toast。
// 由 <Toast> 组件挂载时注册实例；请求拦截器与业务组件统一调用 Toast.xxx。
let instance = null

export function registerToast(vm) {
  instance = vm
}

export const Toast = {
  show(message, type = 'info', duration = 2200) {
    if (instance && typeof instance.show === 'function') {
      instance.show(message, type, duration)
    } else {
      // 兜底：组件未挂载时降级为原生提示，避免静默吞错
      console.warn('[Toast]', message)
    }
  },
  success(message, duration) {
    this.show(message, 'success', duration)
  },
  error(message, duration) {
    this.show(message, 'error', duration)
  },
  info(message, duration) {
    this.show(message, 'info', duration)
  }
}
