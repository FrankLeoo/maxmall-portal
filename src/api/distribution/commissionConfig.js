import request from '@/utils/request'
const settings = require('@/settings.js')

export function fetchList(data) {
  return request({
    baseURL: settings.merchantPath,
    url: '/portal/distributor/config/commission/searchByPage',
    method: 'post',
    data
  })
}
export function modifyCommission(data) {
  return request({
    baseURL: settings.merchantPath,
    url: '/portal/distributor/config/commission/modify',
    method: 'post',
    data: data
  })
}

export function deleteCommission(id) {
  return request({
    baseURL: settings.merchantPath,
    url: '/portal/distributor/config/commission/delete/' + id,
    method: 'get'
  })
}

export function getDetail(id) {
  return request({
    baseURL: settings.merchantPath,
    url: '/portal/distributor/config/commission/detail/' + id,
    method: 'get'
  })
}

