'use strict';

sf.util.namespace('b2c.mall.model.product');

sf.b2c.mall.model.product = can.Model.extend({

  getSiderHotList: function (data) {
    return can.ajax('json/sf.b2c.mall.sider.hot.json');
  },

  /**
   * @description 查询产品列表
   * @param  {Map} data 查询参数
   * @return {can.Deferred}      can.ajax对象
   */
  getProductList: function(data) {
    return can.ajax({
      url: sf.config.current.url,
      type: 'post',
      data: sf.util.sign({
        level: 'NONE',
        data: {
          _aid: 1,
          _mt: 'products.search',
          q: data.q
        }
      })
    });
  },

  getProductAttrs: function(params) {
    return can.ajax({
      url: sf.config.current.url,
      type: 'post',
      data: sf.util.sign({
        level: 'NONE',
        data: {
          _mt: 'products.getProductAttrByCatagoryId',
          cid: params.cid
        }
      })
    });
  },

  findHotList: function (data) {
    return can.ajax('json/sf.b2c.mall.hot.list.json');
  },

  findProductOne: function (data) {
    return can.ajax('json/sf.b2c.mall.product.detail.json');
  },

  /**
   * @description 根据商品skuId获取sku详情信息
   * @param  {Map} data 请求参数
   * @return {can.Deferred}
   */
  getSKUInfo: function(data) {
    return can.ajax({
      url: sf.config.current.url,
      type: 'post',
      data: sf.util.sign({
        level: 'NONE',
        data: {
          _aid: 1,
          _mt: 'product.getSKUInfo',
          sku: data.sku
        }
      })
    });
  },

  /**
   * @description 根据商品skuId获取spu详情信息
   * @param  {Map} data 请求参数
   * @return {can.Deferred}
   */
  getSPUInfo: function(data) {
    return can.ajax({
      url: sf.config.current.url,
      type: 'post',
      data: sf.util.sign({
        level: 'NONE',
        data: {
          _aid: 1,
          _mt: 'product.getSPUInfo',
          spu: data.spu
        }
      })
    });
  },

  getSKUBaseList: function(params) {
    return can.ajax({
      url: sf.config.current.url,
      type: 'post',
      data: sf.util.sign({
        level: 'NONE',
        data: {
          _aid: 1,
          _mt: 'product.getSKUBaseList',
          skulist: params.skus.join(',')
        }
      })
    });
  }

},{});