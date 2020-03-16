/**
 *  设置导航守卫
 */
import router from '@/router' // 引入路由
import store from '@/store' // 引入store对象

// 前置守卫
// 每当路由发生变化就会执行
router.beforeEach(function (to, from, next) {
  // 判断你得请求地址 和token
  // 如果以user 为起始
  if (to.path.startsWith('/user') && !store.state.user) {
    // 需要拦截 让他去登录
    next({
      path: '/login', // 要跳转的地址
      query: {
        // 需要传递的query参数
        redirectUrl: to.fullpath // 表示登录页需要跳转的地址
      }
    })
  } else {
    // 一种地址不是/user启示 一种是/user启示没有token 直接放行
    next()
  }
})
