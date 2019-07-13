import request from '@/utils/request'
const settings = require('@/settings.js')

export function fetchList(data) {
  return request({
    baseURL: settings.merchantPath,
    url: '/portal/config/level/searchByPage',
    method: 'post',
    data
  })
}
export function modifyLevel(data) {
  return request({
    baseURL: settings.merchantPath,
    url: '/portal/config/level/modify',
    method: 'post',
    data: data
  })
}

export function deleteLevel(id) {
  return request({
    baseURL: settings.merchantPath,
    url: '/portal/config/level/delete/' + id,
    method: 'get'
  })
}

export function getDetail(id) {
  return request({
    baseURL: settings.merchantPath,
    url: '/portal/config/level/detail/' + id,
    method: 'get'
  })
}

export function listAll(id, data) {
  return request({
    baseURL: settings.merchantPath,
    url: '/portal/config/level/listAll',
    method: 'post',
    data
  })
}

