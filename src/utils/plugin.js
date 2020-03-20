/**
 * pulgin.js 专门处理小函数以及过滤器函数
 */
// dayjs 时间插件
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)

export default {
  // 导出默认对象
  install (Vue) {
    Vue.prototype.$gnotify = (params) => Vue.prototype.$notify({ duration: 800, ...params })
    Vue.prototype.$sleep = sleep // 定义一个原型属性 叫 $sleep 所有组件都有这个属性
    // 过滤器
    Vue.filter('reltTime', relTime) // 注册一个全局过滤器
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
/**
 * 此函数用来将 日期转化成相对的作用
 * @params data 被转化的日期
 */
function relTime (data) {
  return dayjs().locale('zh-cn').from(data) // from (日期或者dayjs得到的日期) dayjs() 但前时间 , dayjs().from(data) 当前时间到现在传入时间有多远
}
