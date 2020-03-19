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
