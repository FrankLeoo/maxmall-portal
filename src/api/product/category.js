import request from '@/utils/request'
const settings = require('@/settings.js')

export function fetchTreeList(data) {
  return request({
    baseURL: settings.productPath,
    url: 'portal/category/treeList',
    method: 'post',
    data
  })
}

export function deleteCategory(id) {
  return request({
    baseURL: settings.productPath,
    url: '/portal/category/delete/' + id,
    method: 'get'
  })
}

export function modifyCategory(data) {
  return request({
    baseURL: settings.productPath,
    url: '/portal/category/modify',
    method: 'post',
    data: data
  })
}

export function getDetail(id) {
  return request({
    baseURL: settings.productPath,
    url: '/portal/category/detail/' + id,
    method: 'get'
  })
}
