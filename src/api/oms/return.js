import request from '@/utils/request'
const settings = require('@/settings.js')

export function fetchList(data) {
  return request({
    baseURL: settings.orderPath,
    url: '/portal/returnApply/searchByPage',
    method: 'post',
    data
  })
}

export function getDetail(param) {
  return request({
    baseURL: settings.orderPath,
    url: '/portal/returnApply/detail/'+param,
    method: 'get'
  })
}

export function applyOrder(data) {
  return request({
    baseURL: settings.orderPath,
    url: '/portal/returnApply/apply',
    method: 'post',
    data
  })
}

export function receiveConfirm(data) {
  return request({
    baseURL: settings.orderPath,
    url: '/portal/returnApply/receiveConfirm',
    method: 'post',
    data
  })
}
