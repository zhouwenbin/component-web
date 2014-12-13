'use strict';

sf.util.namespace('b2c.mall.model.order');

sf.b2c.mall.model.order = can.Model.extend({

  /**
   * @description 订单完成之后请求支付链接
   * @param  {Map} params 请求的参数
   * @return {can.Deferred}
   */
  requestPay: function (params) {
    return can.ajax({
      url: sf.config.current.url,
      type: 'post',
      data: sf.util.sign({
        level: 'USERLOGIN',
        data: {
          _aid: 1,
          _mt: 'order.requestPay',
          orderId: params.orderId,
          amount: params.sum
        }
      })
    });
  },

  requestPayV2: function (params) {
    return can.ajax({
      url: sf.config.current.url,
      type: 'post',
      data: sf.util.sign({
        level: 'USERLOGIN',
        data: {
          _aid: 1,
          _mt: 'order.requestPayV2',
          orderId: params.orderId,
          amount: params.sum,
          payType: params.payType //@todo 需要加payType问matt
        }
      })
    })
  },

  submitOrder: function(data) {
    var params = {
      _aid: 1,
      _mt: 'order.submitOrder',
      addressId: data.addr,
      userMsg: data.msg,
      items: data.items
    };

    _.each(params, function(value, key, list){
      if (_.isNull(value) || _.isUndefined(value)) {
        delete params[key];
      }
    });

    return can.ajax({
      url: sf.config.current.url,
      type: 'post',
      data: sf.util.sign({
        level: 'USERLOGIN',
        data:params
      }, true)
    });
  },

  submitOrderV2: function(data) {
    var params = {
      _aid: 1,
      _mt: 'order.submitOrderV2',
      addressId: data.addr,
      userMsg: data.msg,
      items: data.items
    };

    _.each(params, function(value, key, list){
      if (_.isNull(value) || _.isUndefined(value)) {
        delete params[key];
      }
    });

    return can.ajax({
      url: sf.config.current.url,
      type: 'post',
      data: sf.util.sign({
        level: 'USERLOGIN',
        data:params
      }, true)
    });
  },

  confirmSubOrder: function (params) {
    return can.ajax({
      url: sf.config.current.url,
      type: 'post',
      data: sf.util.sign({
        level: 'USERLOGIN',
        data: {
          _mt: 'order.confirmReceive',
          _aid: 1,
          subOrderId: params.subOrderId
        }
      })
    });
  },

  /**
   * @description 获取当前用户在购物车内所有商品
   * @return {can.Deferred}
   */
  carGetSkuAll: function(data) {
    return can.ajax({
      url: sf.config.current.url,
      type: 'post',
      data: sf.util.sign({
        level: 'USERLOGIN',
        data: {
          _aid: 1,
          _mt: 'shopcart.getSkuAll'
        }
      })
    });
  },

  /**
   * @description 添加商品到购物车
   * @param  {Map} data 提交参数
   * @param {boolean} isForce 是否强制登陆
   * @return {can.Deferred}
   */
  carAddProduct: function(data, isForce) {
    return can.ajax({
      url: sf.config.current.url,
      type: 'post',
      data: sf.util.sign({
        level: 'USERLOGIN',
        data: {
          _aid: 1,
          _mt: 'shopcart.add',
          sku: data.sku,
          num: data.amount
        }
      }, isForce)
    });
  },

  /**
   * @description 从购物车中删除产品
   * @param  {Map} data 提交参数
   * @return {can.Deferred}
   */
  carRemoveProduct: function(data) {
    return can.ajax({
      url: sf.config.current.url,
      type: 'post',
      data: sf.util.sign({
        level: 'USERLOGIN',
        data: {
          _aid: 1,
          _mt: 'shopcart.remove',
          sku: data.sku
        }
      })
    });
  },

  /**
   * @description 清空用户购物车
   * @param  {Map} data 提交参数
   * @return {can.Deferred}
   */
  carClear: function(data) {
    return can.ajax({
      url: sf.config.current.url,
      type: 'post',
      data: sf.util.sign({
        level: 'USERLOGIN',
        data: {
          _aid: 1,
          _mt: 'shopcart.clearShopCart'
        }
      })
    });
  },

  getOrderList: function(params) {
    return can.ajax({
      url: sf.config.current.url,
      type: 'post',
      data: sf.util.sign({
        level: 'USERLOGIN',
        data: {
          _mt: 'order.getOrderList',
          query: JSON.stringify({
            status: params.status,
            pageNum: params.page,
            pageSize: 10
          })
        }
      })
    });
  },

  getOrder: function(params) {
    return can.ajax({
      url: sf.config.current.url,
      type: 'post',
      data: sf.util.sign({
        level: 'USERLOGIN',
        data: {
          _mt: 'order.getOrder',
          orderId: params.orderId
        }
      })
    });
  },

  cancelOrder: function (params) {
    return can.ajax({
      url: sf.config.current.url,
      type: 'post',
      data: sf.util.sign({
        level: 'USERLOGIN',
        data: {
          _mt: 'order.cancelOrder',
          orderId: params.orderId
        }
      })
    })
  },

  getUserRouter: function (params) {
    return can.ajax({
      url: sf.config.current.url,
      type: 'post',
      data: sf.util.sign({
        level: 'USERLOGIN',
        data: {
          _mt: 'logistics.getUserRoutes',
          orderId: params.subOrderId
        }
      })
    })
  },

  carBulkDeleteShopCart: function (params) {
    return can.ajax({
      url: sf.config.current.url,
      type: 'post',
      data: sf.util.sign({
        level: 'USERLOGIN',
        data: {
          _mt: 'shopcart.bulkDeleteShopCart',
          skulist: params.skulist.join(',')
        }
      })
    })
  }
},{});