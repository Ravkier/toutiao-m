/**
 * pulgin.js 专门处理小函数以及过滤器函数
 */
export default {
  // 导出默认对象
  install (Vue) {
    Vue.prototype.$gnotify = (params) => Vue.prototype.$notify({ duration: 800, ...params })
  }
}
