/**
 * request.js 请求管理工具
 * by 2020.3.16
 */
import axios from 'axios'
import JSONBig from 'json-bigint' // 引入大数字
import store from '@/store' // 引入store实例对象
import router from '@/router' // 引入router对象

// // axios.create() 相当于new了一个新的axios实例
// const instance = axios.create({
//   // 构造参数 传入一下配置，和defaults一样
//   baseURL: 'http://ttapi.research.itcast.cn/app/v1_0', // 基础请求地址
//   // 后台响应回来，但没到axios的响应拦截器执行时
//   transformResponse: [function (data) {
//     // data 响应回来的字符串  处理大数字
//     return data ? JSONBig.parse(data) : {}
//   }]

// })
// 创建一个axios实例
const instance = axios.create({
  baseURL: 'http://ttapi.research.itcast.cn/app/v1_0', // 请求的基地址
  transformResponse: [function (data) {
    // 后端响应回来的字符串
    return data ? JSONBig.parse(data) : {}
  }]
})

// token 的注入 实在请求之前 ，请求拦截器地方
instance.interceptors.request.use(function (config) {
  // 成功 要给 header 注入token信息
//   当store.state.user.token 有值就执行后面赋值
  if (store.state.user.token) {
    config.headers.Authorization = `Bearer ${store.state.user.token}` // 将token 统一注入到headers中
  }
  return config
}, function (error) {
  return Promise.reject(error) // 返回错误 错误的话直接写到axios中的catch中
})
// 用响应拦截器处理 返回的数据， 将多嵌套数据 解构
instance.interceptors.response.use(function (response) {
  // axios给包装了一层数据 大部分返回数据都有data
  // 如果两层能解开就是两层 ， 如果解不开就只有一层
  try {
    //   成功直接返回
    return response.data.data
  } catch (error) {
    // 失败 没有response.data 不存在
    return response.data
  }
}, async function (error) {
  // 只要是401 错误 就是 token失效错误
  /**
     * error
     *      config 是出现错误的请求信息
     *      request 请求对象
     *      response 响应信息
     */
  if (error.response && error.response.status === 401) {
    const path = {
      path: '/login',
      query: {
        // 需要传递的query参数
        redirectUrl: router.currentRoute.fullPath // 表示登录页需要跳转的地址
      }
    }
    // 如果token失效了就会报401 错误
    if (store.state.user.refresh_token) {
      // 如果有refresh_token 就换取用户token
      // 要用没有拦截器的axios 来发 刷新token的请求 ，放置死循环
      try {
        const result = await axios({
          method: 'put',
          url: 'http://ttapi.research.itcast.cn/app/v1_0/authorizations', // 完整的url地址
          headers: {
            Authorization: `Bearer ${store.state.user.refresh_token}` // 在请求头中注入refresh_token
          }
        })
        // await 后面是promise执行后的逻辑
        // 更新vuex中的数据
        store.commit('updateUser', {
          // 根据载荷 对应数据
          user: {
            token: result.date.data.token, // 最新的token
            refresh_token: store.state.user.refresh_token
          }
        })
        // 需要把之前的错误请求再次发出去
        return instance(error.config) // 相当于执行之前401错误的请求
        // 返回的目的继续执行请求执行链下得代码
      } catch (error) {
        // 失败意味着， 重新获取失败
        // 只能重新登录， 之前要删除掉token， 此时token失效refresh_token 也失效
        store.commit('delUser')
        // 重新跳到登录页面
        router.push(path)
      }
    } else {
      // 如果没有refresh_token 直接跳到登录页
    //   router.push('/login')
      // 实现一种 token失效 重新登录再次回到本次页面
      // 方法： 把我失效前所在的页面地址传给登录页面
      //  获得token 后 ， 就判断有没有需要登录的地址，如果没有就跳转主页
      //  router.currentRoute // 表示路由信息对象， 里面包含路由地址 和参数  router.currentRoute.fullpath 当前路由的带参数的地址
      store.commit('delUser')
      router.push(path)
    }
  }

  return Promise.reject(error) // 错误返回到catch中
})

export default instance
