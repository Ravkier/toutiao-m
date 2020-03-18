import Vue from 'vue'
import App from './App.vue'
import router from './router'
import '@/permisstion' // 权限拦截
import store from './store'
import 'amfe-flexible' // 引入自动适配插件
import Vant from 'vant' // 引入vant组件库
import 'vant/lib/index.less' // 引入vant 样式
import '@/styles/index.less'

Vue.use(Vant) // 注册vant 所有位置可用
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
