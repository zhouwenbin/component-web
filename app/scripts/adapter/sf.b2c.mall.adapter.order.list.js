'use strict';

// @description 申请命名空间
sf.util.namespace('b2c.mall.adapter.order.list');

/**
 * @class sf.b2c.mall.adapter.order.list
 * @author Michael.Lee (leewind19841209@gmail.com)
 * @description OrderList
 */
sf.b2c.mall.adapter.order.list = can.Map.extend({

  init: function (data) {
    this.format(data);
  },

  replace: function (data) {
    this.attr(null);
    this.attr(data);
  },

  format: function (data) {
    _.each(data.orders, function(value, key, list){
      data.orders[key].payPrice = value.totalPrice - value.refundPrice;
    });

    this.replace({
      orders: data.orders,
      page: data.page
    });

  }

});