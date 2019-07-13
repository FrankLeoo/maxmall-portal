import request from '@/utils/request'
const settings = require('@/settings.js')

export function fetchList(data) {
  return request({
    baseURL: settings.marketingPath,
    url:'/portal/promotion/searchByPage',
    method:'post',
    data
  })
}

export function getDetail(param) {
  return request({
    baseURL: settings.marketingPath,
    url:'/portal/promotion/detail/'+param,
    method:'get'
  })
}

export function modifyPromotion(data) {
  return request({
    baseURL: settings.marketingPath,
    url:'/portal/promotion/modify',
    method:'post',
    data
  })
}

export function deletePromotion(param) {
  return request({
    baseURL: settings.marketingPath,
    url:'/portal/promotion/delete/'+param,
    method:'post'
  })
}
