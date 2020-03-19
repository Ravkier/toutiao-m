/**
 * pulgin.js 专门处理小函数以及过滤器函数
 */
export default {
  // 导出默认对象
  install (Vue) {
    Vue.prototype.$gnotify = (params) => Vue.prototype.$notify({ duration: 800, ...params })
    Vue.prototype.$sleep = sleep // 定义一个原型属性 叫 $sleep 所有组件都有这个属性
  }
}

// 休眠函数
function sleep (time = 500) {
  // 返回一个promise
  return new Promise(function (resolve, reject) {
    // 肯定是成功执行 但是有个延迟
    setTimeout(() => resolve(), time)
  })
}
