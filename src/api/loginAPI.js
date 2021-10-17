/**
 * 登录模块 API
 * */

// 登录
import request from '@/utils/request.js'

export const postLoginInfoAPI = ({ username, password }) => {
  return request.post('login', {
    username,
    password
  })
}
