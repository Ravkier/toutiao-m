import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)
// 按需加载 一级路由和二级路由
const Layout = () => import('@/views/layout')
const Home = () => import('@/views/home')
const question = () => import('@/views/question')
const video = () => import('@/views/video')
const user = () => import('@/views/user')
// 其他一级路由
const profile = () => import('@/views/user/profile')
const chat = () => import('@/views/user/chat')
const login = () => import('@/views/login')
const search = () => import('@/views/search')
const result = () => import('@/views/search/result')
const article = () => import('@/views/article')

const routes = [{
  path: '/',
  name: 'Home',
  component: Layout,
  children: [{
    path: '/',
    component: Home, // 二级路由主页
    meta: {
      isAlive: true
    }
  }, {
    path: '/question',
    component: question // 二级路由问答
  }, {
    path: '/video',
    component: video // 二级路由 视频
  }, {
    path: '/user',
    component: user // 二级路由个人
  }]
}, {
  path: '/user/profile',
  component: profile // 一级路由编辑资料
}, {
  path: '/user/chat',
  component: chat // 一级路由小智同学
}, {
  path: '/login',
  component: login // 一级路由登录
}, {
  path: '/search',
  component: search // 一级路由搜素
}, {
  path: '/search/result',
  component: result // 一级路由搜索结果
}, {
  path: '/article',
  component: article // 一级路由 文章编辑
}
]

const router = new VueRouter({
  routes
})

export default router
