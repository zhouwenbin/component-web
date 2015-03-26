'use strict';

define('sf.b2c.mall.order.paysuccess', [
    'can',
    'jquery',
    'qrcode',
    'sf.b2c.mall.business.config',
    'sf.helpers',
    'sf.b2c.mall.api.order.getOrder'
  ],
  function(can, $, qrcode, SFConfig, helpers, SFGetOrder) {

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
          })
          .fail(function(error) {
            console.error(error);
          })
          .always(function(){
            var html = can.view('templates/order/sf.b2c.mall.order.paysuccess.mustache', that.options);
            that.element.html(html);

            that.renderLunkyMoney("123123123");
          })
      },

      renderLunkyMoney: function(lunkyMoneyCode) {
        var params = {
          appid: "wx90f1dcb866f3df60",
          redirect_uri: "http://m.sfht.com",
          response_type: "code",
          scope: "snsapi_base",
          state: lunkyMoneyCode
        };

        var qrParam = {
          width: 200,
          height: 200,
          text: "https://open.weixin.qq.com/connect/oauth2/authorize?" + $.param(params) + "#wechat_redirect"
        };

        $('#shareQrCode').qrcode(qrParam);
      }
    });
  })
