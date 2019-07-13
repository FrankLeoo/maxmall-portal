import request from '@/utils/request'
const settings = require('@/settings.js')

export function fetchList(data) {
  return request({
    baseURL: settings.productPath,
    url: '/portal/brand/searchByPage',
    method: 'post',
    data
  })
}
export function modifyBrand(data) {
  return request({
    baseURL: settings.productPath,
    url: '/portal/brand/modify',
    method: 'post',
    data: data
  })
}

export function deleteBrand(id) {
  return request({
    baseURL: settings.productPath,
    url: '/portal/brand/delete/' + id,
    method: 'get'
  })
}

export function getDetail(id) {
  return request({
    baseURL: settings.productPath,
    url: '/portal/brand/detail/' + id,
    method: 'get'
  })
}

export function listAll(id, data) {
  return request({
    baseURL: settings.productPath,
    url: 'portal/brand/listAll',
    method: 'post',
    data
  })
}

