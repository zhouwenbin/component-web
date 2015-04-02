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
        that.options.isGiftBag = false;
        that.options.isShareBag = false;
        that.options.isShareBagAndCoupon = false;
        that.options.isShowGift = false;
        that.options.links = SFConfig.setting.link;

        getOrder.sendRequest()
          .done(function(data, idcard) {
            var couponTypeMap = {
              "CASH" : function() {
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
              },
              "GIFTBAG" : function() {
                that.options.isGiftBag = true;
                that.options.giftBag = tmpOrderCouponItem;
              },
              "SHAREBAG" : function() {
                that.options.isShareBag = true;
                that.options.shareBag = tmpOrderCouponItem;
              }
            }
            var couponTypeHandle = function(tag) {
              var fn = couponTypeMap[tag];
              if (_.isFunction(fn)) {
                return fn.call(this)
              }
            }
            //处理卡券信息
            if (data.orderItem.orderCouponItemList && data.orderItem.orderCouponItemList.length > 0) {
              for(var i = 0, tmpOrderCouponItem; tmpOrderCouponItem = data.orderItem.orderCouponItemList[i]; i++) {
                couponTypeHandle(tmpOrderCouponItem.couponType);
              }
            }
          })
          .fail(function(error) {
            console.error(error);
          })
          .always(function(){
            that.options.isShareBagAndCoupon = that.options.isShareBag && (that.options.isPresentCoupon || that.options.isGiftBag);
            that.options.isShowGift = that.options.isShareBag || that.options.isPresentCoupon || that.options.isGiftBag;
            var html = can.view('templates/order/sf.b2c.mall.order.paysuccess.mustache', that.options);
            that.element.html(html);

            if (that.options.isShareBag) {
              that.renderLuckyMoney(that.options.shareBag.code);
            }
          })
      },

      renderLuckyMoney: function(lunkyMoneyCode) {
        var qrParam = {
          width: 140,
          height: 140,
          text: "http://m.sfht.com/luckymoneyshare.html?id=" + lunkyMoneyCode
        };

        $('#shareQrCode').qrcode(qrParam);
      }
    });
  })
