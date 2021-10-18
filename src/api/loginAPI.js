/**
 * 登录模块 API
 * */

import request from '@/utils/request.js';

// 登录
export const postLoginInfoAPI = ({ username, password }) => {
  return request.post('login', {
    username,
    password
  });
};
