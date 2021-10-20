/**
 * 权限管理模块 API
 * */

import request from '@/utils/request.js';

// 获取左侧菜单
export const getMenusListAPI = () => {
  return request.get('menus');
};

// 获取权限列表
export const getRightsListAPI = type => {
  return request.get(`rights/${type}`);
};

// 获取角色列表
export const getRolesListAPI = () => {
  return request.get('roles');
};

// 添加角色
export const addRolesInfoAPI = ({ roleName, roleDesc }) => {
  return request.post('roles', {
    roleName,
    roleDesc
  });
};

// 根据 id 查询角色信息
export const getRolesInfoAPI = id => {
  return request.get(`roles/${id}`);
};

// 根据 id 修改角色信息
export const editRolesInfoAPI = ({ roleId: id, roleName, roleDesc }) => {
  return request.put(`roles/${id}`, {
    roleName,
    roleDesc
  });
};

// 根据 id 删除角色
export const removeSingleRolesAPI = id => {
  return request.delete(`roles/${id}`);
};

// 根据 id  删除角色指定权限
export const removeRightsByIdAPI = (roleId, rightId) => {
  return request.delete(`roles/${roleId}/rights/${rightId}`);
};

// 修改角色权限（角色授权）
export const allotRoleRightsAPI = (roleId, rids) => {
  return request.post(`roles/${roleId}/rights`, {
    rids
  });
};
