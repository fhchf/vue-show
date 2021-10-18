/**
 * 权限管理模块 API
 * */

import request from '@/utils/request.js';

// 获取左侧菜单权限
export const getMenusListAPI = () => {
  return request.get('menus');
};
