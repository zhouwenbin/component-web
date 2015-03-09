'use strict';

define('sf.b2c.mall.order.paysuccess', [
    'can',
    'jquery',
    'sf.b2c.mall.framework.comm',
    'sf.util',
    'sf.b2c.mall.api.coupon.getUserCouponList'
  ],
  function(can,$,SFComm, SFFn, SFGetUserCouponList) {

    return can.Control.extend({

      /**
       * 初始化
       * @param  {DOM} element 容器element
       * @param  {Object} options 传递的参数
       */
      init: function(element, options) {
        this.render();
      },

      render: function(data) {
        var that = this;
        var html = can.view('templates/order/sf.b2c.mall.order.paysuccess.mustache', that.options);
        this.element.html(html);
      }
    });
  })
