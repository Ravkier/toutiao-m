/**
 * 专门处理用户信息的储存和删除
 * by 2020.3.15
 */

const USER_TOKEN = 'toutiaoMobile'

// 设置用户信息
export function setUser (user) {
  window.localStorage.setItem(USER_TOKEN, JSON.stringify(user))
}

// 获取用户信息
export function getUser () {
  return JSON.parse(window.localStorage.getItem(USER_TOKEN) || '{}') // 加入没有数据用 {} 代替
}

// 删除用户数据
export function delUser () {
  window.localStorage.removeItem(USER_TOKEN)
}
