/*
 * author:zhangke
 * description:领取卡券卡包
 */

'use strict';

define('sf.b2c.mall.module.getcoupon', [
    'can',
    'jquery',
    'sf.b2c.mall.framework.comm',
    'sf.b2c.mall.business.config',
    'sf.b2c.mall.widget.message',
    'sf.b2c.mall.api.coupon.receiveCoupon'
  ],

  function(can, $, SFFrameworkComm, SFConfig, SFMessage, SFReceiveCoupon) {

    SFFrameworkComm.register(1);

    var getCoupon =can.Control.extend({
      /**
       * @override
       * @description 初始化方法
       */
      init: function() {
        var that = this;

        $("[name='cms-fill-coupon']").click(function(targetElement) {
          if (!SFFrameworkComm.prototype.checkUserLogin.call(this)) {
            new SFMessage(null, {
              'tip': '抱歉！需要登录后才可以领取优惠券！',
              'type': 'success',
              'okFunction': function(){
                window.component.showLogin();
              }
            });
            return false;
          }

          var params = {
            bagId: $(targetElement.target).data('cms-couponbagid'),
            type: $(targetElement.target).data('cms-coupontype')
          }
          var needSms = $(targetElement.target).data('needsms');
          var smsCon = $(targetElement.target).data('smscon');
          if (needSms) {
            params.needSms = needSms;
          }
          if (smsCon) {
            params.smsCon = smsCon;
          }

          that.receiveCpCodeData(params);
        });

        return false;
      },

      errorMap: {
        "11000020": "卡券不存在",
        "11000030": "卡券已作废",
        "11000050": "卡券已领完",
        "11000100": "您已领过该券",
        "11000130": "卡包不存在",
        "11000140": "卡包已作废"
      },

      receiveCpCodeData: function(params) {
        params.receiveChannel = 'B2C';
        params.receiveWay = 'ZTLQ';
        var that = this;
        var receiveCouponData = new SFReceiveCoupon(params);
        return can.when(receiveCouponData.sendRequest())
          .done(function(userCouponInfo) {
            new SFMessage(null, {
              'tip': '领取成功！',
              'type': 'success'
            });
          })
          .fail(function(error) {
            new SFMessage(null, {
              'tip': that.errorMap[error] || '领取失败',
              'type': 'error'
            });
          });
      }
    });

    new getCoupon();
  });
