/**
 * 专门处理用户信息的储存和删除
 * by 2020.3.15
 */

const USER_TOKEN = 'toutiao-mobile'

// 设置用户信息
export function setUser (user) {
  localStorage.setItem(USER_TOKEN, JSON.stringify(user))
}

// 获取用户信息
export function getUser () {
  return JSON.parse(localStorage.getItem(USER_TOKEN) || {}) // 加入没有数据用 {} 代替
}

// 删除用户数据
export function delUser () {
  localStorage.removeItem(USER_TOKEN)
}
