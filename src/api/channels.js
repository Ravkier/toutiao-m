import store from '@/store'
/**
 * 负责处理频道数据
 */

import request from '@/utils/request'
const CACHE_CHANNEL_V = 'm-heima-v' // 登录的
const CACHE_CHANNEL_T = 'm-heima-t' // 游客的

/**
  * 获取我的频道数据 没有参数 ，匿名用户也可以获取数据
  *  改成本地化方法
  */
export function getMyChannels () {
  return new Promise(function (resolve, reject) {
    // 支持本地化缓存 要区分当前是登录用户还是游客用户
    // 用户和游客区别 判断有没有token
    const key = store.state.user.token ? CACHE_CHANNEL_V : CACHE_CHANNEL_T
    // 去缓存中读数据
    const str = localStorage.getItem(key) // 通过key获取缓存中的用户的频道数据
    if (str) {
      resolve({ channels: JSON.parse(str) })
    } else {
      request({ url: '/user/channels' }).then(result => {
        // 获取请求的结果
        localStorage.setItem(key, JSON.stringify(result.channels))// 放入本地缓存
        resolve(result) // 表示直接成功执行 ，获取频道数据
      }) // 得到数据列表 把数据放到缓存中
    }
  })
  // return request({
  //   url: '/user/channels'
  // })
}

/**
 * 获取全部频道数据
 */
export function getAllChannels () {
  return request({
    url: '/channels'
  })
}
/**
 * 删除频道
 * @params id 删除的id
 */
export function delChannel (id) {
  return new Promise(function (resolve, reject) {
    // 删除频道时 都有数据
    const key = store.state.user.token ? CACHE_CHANNEL_V : CACHE_CHANNEL_T
    const channels = JSON.parse(localStorage.getItem(key)) // 直接把字符串转化成对象
    const index = channels.findIndex(item => item.id === id)
    if (index > -1) {
      channels.splice(index, 1)
      localStorage.setItem(key, JSON.stringify(channels)) // 重新写入缓存
      resolve({ message: '删除成功' }) // 执行成功
    } else {
      reject(new Error('没有找到对应的频道'))
    }
  })
}
/**
 * 添加频道的方法
 * @params channel 是{id：1，name：'css'}
 */
export function addChannel (channel) {
  return new Promise(function (resolve, reject) {
    const key = store.state.user.token ? CACHE_CHANNEL_V : CACHE_CHANNEL_T
    const channels = JSON.parse(localStorage.getItem(key)) // 转化数组
    channels.push(channel) // 将添加的频道数据添加到队尾
    localStorage.setItem(key, JSON.stringify(channels)) // 重新写入缓存
    resolve() // 执行成功
  })
}
