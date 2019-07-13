import request from '@/utils/request'
const settings = require('@/settings.js')

export function fetchList(data) {
  return request({
    baseURL: settings.merchantPath,
    url: '/portal/distributor/audit/searchByPage',
    method: 'post',
    data
  })
}

export function applyAudit(data) {
  return request({
    baseURL: settings.merchantPath,
    url: '/portal/distributor/audit/applyAudit',
    method: 'post',
    data
  })
}
