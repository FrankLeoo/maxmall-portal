import request from '@/utils/request'
const settings = require('@/settings.js')

export function login(data) {
  return request({
    baseURL: settings.merchantPath,
    headers:{
      'Content-type': 'application/x-www-form-urlencoded;charset=utf-8'
    },
    url: '/auth/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    baseURL: settings.merchantPath,
    url: '/portal/user/info',
    method: 'post'
  })
}

export function logout() {
  return request({
    baseURL: settings.merchantPath,
    url: '/portal/user/logout',
    method: 'post'
  })
}

/**
 * 刷新获取用户二维码
 */
export function refreshImage() {
  return request({
    baseURL: settings.merchantPath,
    url: '/auth/code/image',
    method: 'post'
  })
}
