import request from '@/utils/request'
const settings = require('@/settings.js')

export function fetchList(data) {
  return request({
    baseURL: settings.merchantPath,
    url: '/portal/distributor/searchByPage',
    method: 'post',
    data
  })
}
export function getDetail(param) {
  return request({
    baseURL: settings.merchantPath,
    url: '/portal/distributor/detail/'+param,
    method: 'get'
  })
}

export function deleteDistributor() {
  return request({
    baseURL: settings.merchantPath,
    url: '/portal/distributor/delete/' + id,
    method: 'get'
  })
}

export function listAll(data) {
  return request({
    baseURL: settings.merchantPath,
    url: '/portal/distributor/listAll',
    method: 'post',
    data
  })
}

//查询操作记录列表
export function fetchHistroyList(data) {
  return request({
    baseURL: settings.merchantPath,
    url: '/portal/distributor/history/searchByPage',
    method: 'post',
    data
  })
}

