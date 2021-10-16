/**
 * 登录模块 API
 * post 请求
 *
 * 请求参数：
 * username -- 用户名
 * password -- 密码
 * */
import request from '@/utils/request.js'

export const postLoginInfoAPI = ({ username, password }) => {
  return request.post('login', {
    username,
    password
  })
}
