/**
 * 配置文件
 * 通用配置的 axios 实例
 */
import axios from 'axios'

const request = axios.create({
  baseURL: 'http://127.0.0.1:8888/api/private/v1/'
})

export default request
