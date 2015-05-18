'use strict';

define('sf.b2c.mall.order.paysuccess', [
    'can',
    'jquery',
    'qrcode',
    'sf.b2c.mall.business.config',
    'sf.helpers',
    'sf.b2c.mall.api.order.getOrder',
    'sf.b2c.mall.api.minicart.getTotalCount' // 获得mini cart的数量接口
  ],
  function(can, $, qrcode, SFConfig, helpers, SFGetOrder, SFGetTotalCount) {

    return can.Control.extend({

      /**
       * @description mustache helpers
       * @type {Object}
       */
      helpers: {
        'sf-payment': function (payType) {
          var map = {
            'alipay': '支付宝',
            'tenpay_forex': '财付通',
            'tenpay_forex_wxsm': '微信支付',
            'lianlianpay': '联联支付'
          }

          return map[payType];
        },

        'sf-coupon-type': function (couponType, definition, options) {
          if (couponType == definition) {
            return options.fn(options.contexts || this);
          } else {
            return options.inverse(options.contexts || this);
          }
        },

        'sf-coupon-type-name': function (couponType) {
          var map = {
            'CASH': '现金券',
            'GIFTBAG': '礼包',
            'SHAREBAG': '红包'
          }

          return map[couponType];
        }
      },

      /**
       * 初始化
       * @param  {DOM} element 容器element
       * @param  {Object} options 传递的参数
       */
      init: function(element, options) {
        this.render();
      },

      /**
       * @description 请求获取订单详情
       * @param  {long} orderId 订单号
       * @return {can.promise}
       */
      request: function (orderId) {
        var getOrder = new SFGetOrder({
          "orderId": orderId
        });

        var getTotalCount  = new SFGetTotalCount();

        return can.when(getOrder.sendRequest(), getTotalCount.sendRequest());
      },

      /**
       * @description 绘制页面
       * @param  {json} data 从服务端获取的数据
       * @return
       */
      paint: function (orderinfo, cartnum) {
        // 从params获取不同部分的数据
        var data = _.extend(orderinfo, {cartnum: cartnum.value});

        var html = can.view('templates/order/sf.b2c.mall.order.paysuccess.mustache', data, this.helpers);
        this.element.html(html);

        this.renderLuckyMoney();
      },

      /**
       * @description 页面渲染
       * @param  {json} data 渲染页面的ViewModel
       * @return
       */
      render: function(data) {
        var that = this;

        var params = can.deparam(window.location.search.substr(1));

        this
          .request(params.orderid)
          .done(_.bind(this.paint, this));

        return true;
      },

      /**
       * @description 渲染红包的二维码
       * @return
       */
      renderLuckyMoney: function() {
        $('.shareQrCode').each(function (index, $el) {
          var code = $el.attr('data-code');
          var qrParam = {
            width: 140,
            height: 140,
            text: "http://m.sfht.com/luckymoneyshare.html?id=" + code
          };

          $el.qrcode(qrParam);
        });
      }
    });
  })
