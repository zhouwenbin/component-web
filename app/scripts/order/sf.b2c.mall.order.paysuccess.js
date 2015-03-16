'use strict';

define('sf.b2c.mall.order.paysuccess', [
    'can',
    'jquery',
    'sf.b2c.mall.business.config',
    'sf.helpers',
    'sf.b2c.mall.api.order.getOrder'
  ],
  function(can, $, SFConfig, helpers, SFGetOrder) {

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

        var params = can.deparam(window.location.search.substr(1));

        var getOrder = new SFGetOrder({
          "orderId": params.orderid
        });

        that.options.isCostCoupon = false;
        that.options.isPresentCoupon = false;
        that.options.links = SFConfig.setting.link;

        can.when(getOrder.sendRequest())
          .done(function(data, idcard) {
            //处理卡券信息
            if (data.orderItem.orderCouponItemList && data.orderItem.orderCouponItemList.length > 0) {
              for(var i = 0, tmpOrderCouponItem; tmpOrderCouponItem = data.orderItem.orderCouponItemList[i]; i++) {
                switch (tmpOrderCouponItem.orderAction)
                {
                  case "COST": {
                    that.options.isCostCoupon = true;
                    that.options.costCoupon = tmpOrderCouponItem;
                    break;
                  }
                  case "PRESENT": {
                    that.options.isPresentCoupon = true;
                    that.options.presentCoupon = tmpOrderCouponItem;
                    break;
                  }
                }
              }
            }

            var html = can.view('templates/order/sf.b2c.mall.order.paysuccess.mustache', that.options);
            that.element.html(html);
          })
          .fail(function(error) {
            var html = can.view('templates/order/sf.b2c.mall.order.paysuccess.mustache', that.options);
            that.element.html(html);
            console.error(error);
          })
      }
    });
  })
