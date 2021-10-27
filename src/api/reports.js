/**
 * 数据统计模块 API
 * */

import request from '@/utils/request.js';

// 基于时间统计的用户来源
export const userSourceStatisticsAPI = () => {
  return request.get('reports/type/1');
};
