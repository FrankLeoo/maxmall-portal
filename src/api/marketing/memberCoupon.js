import request from '@/utils/request'
const settings = require('@/settings.js')

export function fetchList(data) {
  return request({
    baseURL: settings.marketingPath,
    url:'/portal/member/coupon/searchByPage',
    method:'post',
    data
  })
}
