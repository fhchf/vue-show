/**
 * 权限管理模块 API
 * */

// 左侧菜单权限
import request from '@/utils/request.js'

export const getMenusListAPI = () => {
  return request.get('menus')
}
