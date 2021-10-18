/**
 * 用户管理模块 API
 * */

import request from '@/utils/request.js';

// 获取用户列表
export const getUsersListAPI = ({ query, pagenum, pagesize }) => {
  return request.get('users', {
    params: {
      query,
      pagenum,
      pagesize
    }
  });
};

// 修改用户状态
export const reviseUsersStaterAPI = ({ id, mg_state: mgState }) => {
  return request.put(`users/${id}/state/${mgState}`);
};

// 添加用户
export const addUserInfoAPI = ({ username, password, email, mobile }) => {
  return request.post('users', {
    username,
    password,
    email,
    mobile
  });
};

// 根据 id 查询用户信息
export const getSingleUserInfoAPI = id => {
  return request.get(`users/${id}`);
};

// 修改用户信息
export const reviseUserInfoAPI = ({ id, email, mobile }) => {
  return request.put(`users/${id}`, {
    email,
    mobile
  });
};

// 根据 id 删除用户信息
export const removeSingleUserAPI = id => {
  return request.delete(`users/${id}`);
};
