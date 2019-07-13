import request from '@/utils/request'
const settings = require('@/settings.js')

export function fetchList(data) {
  return request({
    baseURL: settings.orderPath,
    url: '/portal/returnReason/searchByPage',
    method: 'post',
    data
  })
}

export function updateStatus(data) {
  return request({
    baseURL: settings.orderPath,
    url: '/portal/returnReason/update/status',
    method: 'post',
    data
  })
}

export function getDetail(param) {
  return request({
    baseURL: settings.orderPath,
    url: '/portal/returnReason/detail/'+param,
    method: 'get'
  })
}

export function createReason(data) {
  return request({
    baseURL: settings.orderPath,
    url: '/portal/returnReason/create',
    method: 'post',
    data
  })
}

export function updateReason(id,data) {
  return request({
    baseURL: settings.orderPath,
    url: '/portal/returnReason/update/'+id,
    method: 'post',
    data
  })
}

export function deleteReason(param) {
  return request({
    baseURL: settings.orderPath,
    url: '/portal/returnReason/delete/'+param,
    method: 'get'
  })
}


