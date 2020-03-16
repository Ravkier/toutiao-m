/**
 * store 下的index.js 处理vuex的模块
 */

import Vue from 'vue'
import Vuex from 'vuex'
import * as auth from '@/utils/auth.js'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 专门放置需要共享的状态
    // 调用getUser函数把token的状态放在user 中 作为共享状态
    user: auth.getUser() // user作为我们缓存的token 就要先获取token
  },
  mutations: {
    // 修改token
    updateUser (state, payload) {
      state.user = payload.user // 定义载荷中的user给state中
      // 更新vuex的时候 ， 也要把新的数据放入本地缓存
      auth.setUser(payload.user)
    },
    // 删除token
    delUser (state) {
      state.user = {} // 将token中的数据清空
      // 本地也需要更新
      auth.setUser() // 删除本地缓存中的token
    }
  },
  actions: {
  },
  modules: {
  }
})
