import request from '@/utils/request'

// 获取社区内容列表
export function getCommunityList(params) {
  return request({
    url: '/community/list',
    method: 'post',
    data: params
  })
}

// 获取热门推荐内容
export function getHotRecommendations(params) {
  return request({
    url: '/community/hot',
    method: 'get',
    params
  })
}
