import request from '@/utils/request'
const settings = require('@/settings.js')

export function fileUpload(fileObj) {
  let param = new FormData();
  param.append('files',fileObj.file)
  return request({
    baseURL: settings.productPath,
    url: '/common/upload/upload',
    headers: {'Content-Type':'multipart/form-data'},
    method: 'post',
    data: param
  })
}
