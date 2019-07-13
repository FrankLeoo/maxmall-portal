import request from '@/utils/request'
const settings = require('@/settings.js')

export function fetchList(data) {
  return request({
    baseURL: settings.marketingPath,
    url:'/portal/member/searchByPage',
    method:'post',
    data
  })
}

export function getDetail(param) {
  return request({
    baseURL: settings.marketingPath,
    url:'/portal/member/detail/'+param,
    method:'get'
  })
}

export function deleteMember(param) {
  return request({
    baseURL: settings.marketingPath,
    url:'/portal/member/delete/'+param,
    method:'post'
  })
}

export function fetchIntegrationList(data) {
  return request({
    baseURL: settings.marketingPath,
    url:'/portal/member/integration/searchByPage',
    method:'post',
    data
  })
}

export function fetchGrowthList(data) {
  return request({
    baseURL: settings.marketingPath,
    url:'/portal/member/growth/searchByPage',
    method:'post',
    data
  })
}
