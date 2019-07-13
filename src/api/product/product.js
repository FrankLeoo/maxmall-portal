import request from '@/utils/request'
const settings = require('@/settings.js')

export function fetchList(data) {
  return request({
    baseURL: settings.productPath,
    url: '/portal/product/searchByPage',
    method: 'post',
    data
  })
}

export function deleteProduct(param) {
  return request({
    baseURL: settings.productPath,
    url: '/portal/product/delete/'+param,
    method: 'get'
  })
}

export function updateLabel(data) {
  return request({
    baseURL: settings.productPath,
    url: '/portal/product/modify/label',
    method: 'post',
    data
  })
}

export function createProduct(data) {
  return request({
    url: '/product/create',
    method: 'post',
    data: data
  })
}

export function updateProduct(id, data) {
  return request({
    url: '/product/update/' + id,
    method: 'post',
    data: data
  })
}

export function getProduct(id) {
  return request({
    url: '/product/updateInfo/' + id,
    method: 'get'
  })
}

export function fetchAllList(data) {
  return request({
    baseURL: settings.productPath,
    url: '/portal/product/listAll',
    method: 'post',
    data
  })
}

