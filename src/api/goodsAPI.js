/**
 * 商品管理模块 API
 * */

import request from '@/utils/request.js';

/**
 * 商品分类
 */
// 获取商品分类数据
export const getCateListAPI = ({ type, pagenum, pagesize }) => {
  return request.get('categories', {
    params: {
      type,
      pagenum,
      pagesize
    }
  });
};

// 根据 id 查找分类数据
export const getGoodsCateByIdAPI = id => {
  return request.get(`categories/${id}`);
};

// 添加分类
export const postGoodsCateAPI = ({ cat_pid, cat_name, cat_level }) => {
  return request.post('categories', {
    cat_pid,
    cat_name,
    cat_level
  });
};

// 修改分类
export const putGoodsCateAPI = ({ cat_id, cat_name }) => {
  return request.put(`categories/${cat_id}`, {
    cat_name
  });
};

// 删除分类
export const deleteGoodsCateAPI = id => {
  return request.delete(`categories/${id}`);
};

/**
 * 分类参数
 */
// 获取参数列表
export const getCateAttrListAPI = ({ id, sel }) => {
  return request.get(`categories/${id}/attributes`, {
    params: {
      sel
    }
  });
};

// 添加动态参数或静态属性
export const postCateAttrAPI = ({ id, attr_name, attr_sel, attr_vals }) => {
  return request.post(`categories/${id}/attributes`, {
    attr_name,
    attr_sel,
    attr_vals
  });
};

// 根据 ID 查询动态参数或静态属性
export const getCateAttrByIdAPI = ({ id, attrId, attr_sel, attr_vals }) => {
  return request.get(`categories/${id}/attributes/${attrId}`, {
    params: {
      attr_sel,
      attr_vals
    }
  });
};

// 修改动态参数或静态属性
export const putCateAttrAPI = ({ id, attrId, attr_name, attr_sel, attr_vals }) => {
  return request.put(`categories/${id}/attributes/${attrId}`, {
    attr_sel,
    attr_name,
    attr_vals
  });
};

// 删除动态参数或静态属性
export const deleteCateAttrAPI = (id, attrId) => {
  return request.delete(`categories/${id}/attributes/${attrId}`);
};

/**
 * 商品列表
 */
// 获取商品列表
export const getGoodsListAPI = ({ query, pagenum, pagesize }) => {
  return request.get('goods', {
    params: {
      query,
      pagenum,
      pagesize
    }
  });
};

// 添加商品
export const postGoodsAPI = dataObj => {
  return request.post('goods', dataObj);
};

// 根据 id 查询商品
export const getGoodsByIdAPI = id => {
  return request.get(`goods/${id}`);
};

// 修改商品
export const putGoodsAPI = dataobj => {
  return request.put(`goods/${dataobj.goods_id}`, {
    goods_cat: dataobj.goods_cat,
    goods_name: dataobj.goods_name,
    goods_price: dataobj.goods_price,
    goods_number: dataobj.goods_number,
    goods_weight: dataobj.goods_weight,
    goods_introduce: dataobj.goods_introduce,
    pics: dataobj.pics,
    attrs: dataobj.attrs
  });
};

// 删除商品
export const deleteGoodsAPI = id => {
  return request.delete(`goods/${id}`);
};
