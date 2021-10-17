/**
 * 通用配置的 axios 实例
 */
import axios from 'axios'

// 配置信息
const request = axios.create({
  // 根路径
  baseURL: 'http://127.0.0.1:8888/api/private/v1/',
  // 请求超时
  timeout: 10000
})

// 请求拦截器
request.interceptors.request.use(
  config => {
    // 为请求头对象，添加 token 验证的 Authorization 字段
    config.headers.Authorization = window.sessionStorage.getItem('token')
    return config
  },
  err => {
    console.log(new Error(err))
  }
)

export default request
