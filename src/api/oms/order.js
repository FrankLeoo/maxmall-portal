import request from '@/utils/request'
const settings = require('@/settings.js')

export function fetchList(data) {
  return request({
    baseURL: settings.orderPath,
    url: '/portal/order/searchByPage',
    method: 'post',
    data
  })
}

export function getDetail(param) {
  return request({
    baseURL: settings.orderPath,
    url: '/portal/order/detail/'+param,
    method: 'get'
  })
}
