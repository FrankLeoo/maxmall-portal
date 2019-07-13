import request from '@/utils/request'
const settings = require('@/settings.js')

export function fetchList(data) {
  return request({
    baseURL: settings.marketingPath,
    url:'/portal/coupon/searchByPage',
    method:'post',
    data
  })
}

export function getAllList(data) {
  return request({
    baseURL: settings.marketingPath,
    url:'/portal/coupon/listAll',
    method:'post',
    data
  })
}

export function getDetail(param) {
  return request({
    baseURL: settings.marketingPath,
    url:'/portal/coupon/detail/'+param,
    method:'get'
  })
}

export function modifyCoupon(data) {
  return request({
    baseURL: settings.marketingPath,
    url:'/portal/coupon/modify',
    method:'post',
    data
  })
}

export function deleteCoupon(param) {
  return request({
    baseURL: settings.marketingPath,
    url:'/portal/coupon/delete/'+param,
    method:'post'
  })
}

