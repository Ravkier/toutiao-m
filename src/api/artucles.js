/**
 * 处理文章模块的请求数据
 */
import request from '@/utils/request'

/**
 * 获取文章数据
 */
export function getArticles (params) {
  return request({
    // 基地址不同
    url: 'http://ttapi.research.itcast.cn/app/v1_1/articles', // 地址
    params: { with_top: 1, ...params }
  })
}

/**
 * 不感兴趣的文章接口
 */
export function dislikeArticles (data) {
  return request({
    url: '/article/dislikes',
    method: 'post',
    data
  })
}
/**
 * 举报文章接口
 */
export function reportArticles (data) {
  return request({
    url: '/article/reports',
    data,
    method: 'post'
  })
}
/***
 * 获取联想搜索建议
 */
export function getSuggestion (params) {
  return request({
    url: '/suggestion',
    params // query 参数放置在params中
  })
}

/**
 * 搜索文章的方法
 */
export function searchArticle (params) {
  return request({
    url: '/search',
    params
  })
}
/**
 * 获取文章详情
 */
export function getArticleInfo (artId) {
  return request({
    url: `/articles/${artId}`
  })
}
/**
 * 获取评论或者评论回复
 */
export function getComments (params) {
  return request({
    url: '/comments',
    params
  })
}
/**
 * 评论或者回复 支持两种
 *  1文章评论
 *  2评论评论
 */
export function commentsOrReply (data) {
  return request({
    url: '/comments',
    method: 'post',
    data
  })
}
