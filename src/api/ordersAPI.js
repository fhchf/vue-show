/**
 * 订单管理模块 API
 * */

import request from '@/utils/request.js';

// 获取订单数据列表
export const getOrdersListAPI = ({ query, pagenum, pagesize }) => {
  return request.get('orders', {
    params: {
      query,
      pagenum,
      pagesize
    }
  });
};

// 查看物流信息
export const getProgressInfoAPI = id => {
  return request.get(`/kuaidi/${id}`);
};
