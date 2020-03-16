/**
 * request.js 请求管理工具
 * by 2020.3.16
 */
import axios from 'axios'
import JSONBig from 'json-bigint' // 引入大数字
import store from '@/store' // 引入store实例对象

// axios.create() 相当于new了一个新的axios实例
const instance = axios.create({
  // 构造参数 传入一下配置，和defaults一样
  baseURL: 'http://ttapi.research.itcast.cn/app/v1_0', // 基础请求地址
  // 后台响应回来，但没到axios的响应拦截器执行时
  transformResponse: [function (data) {
    // data 响应回来的字符串  处理大数字
    return data ? JSONBig.parse(data) : {}
  }]

})
// token 的注入 实在请求之前 ，请求拦截器地方
instance.interceptors.request.use(function (config) {
  // 成功 要给 header 注入token信息
//   当store.state.user.token 有值就执行后面赋值
  store.state.user.token && (config.header.Authorization = `Bearer ${store.state.user.token}`)
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
}, function (error) {
  return Promise.reject(error) // 错误返回到catch中
})

export default instance
