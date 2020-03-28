/**
 *  专门处理用户相关的请求
 *
 */

import request from '@/utils/request' // 引入请求模块

/**
  * 登录方法
  */
export function login (data) {
  return request({
    // 配置选项
    url: '/authorizations', // 请求地址
    method: 'post',
    data
  })
}
/**
 * 关注用户
 */
export function followUser (data) {
  return request({
    url: '/user/followings',
    method: 'post',
    data
  })
}

/**
  * 取消关注
  */
export function unfollowUser (autId) {
  return request({
    url: `/user/followings/${autId}`,
    method: 'DELETE'
  })
}
/**
 * 获取用户的个人信息
 */
export function getUserInfo () {
  return request({
    url: '/user'
  })
}
/**
 * 获取用户的资料
 */
export function getUserProfile () {
  return request({
    url: '/user/profile'
  })
}
/**
 * 修改用户头像
 */
export function updataPhoto (data) {
  return request({
    url: '/user/photo',
    method: 'patch',
    data
  })
}
/**
 * 保存用户信息
 */
export function saveUserInfo (data) {
  return request({
    url: '/user/profile',
    method: 'patch',
    data: { ...data, photo: null }
  })
}
