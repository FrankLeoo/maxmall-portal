import request from '@/utils/request'
const settings = require('@/settings.js')

export function getDetail(data) {
  return request({
    baseURL: settings.merchantPath,
    url: '/portal/merchant/current/detail',
    method: 'post',
    data
  })
}

export function getConfigInfo(data) {
  return request({
    baseURL: settings.merchantPath,
    url: '/portal/merchant/current/config',
    method: 'post',
    data
  })
}

export function modifyConfig(data) {
  return request({
    baseURL: settings.merchantPath,
    url: '/portal/merchant/modify/config',
    method: 'post',
    data
  })
}

export function modifyTimeConfig(data) {
  return request({
    baseURL: settings.merchantPath,
    url: '/portal/merchant/modify/timeconfig',
    method: 'post',
    data
  })
}


