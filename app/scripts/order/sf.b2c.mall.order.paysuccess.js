'use strict';

define('sf.b2c.mall.order.paysuccess', [
    'can',
    'jquery',
    'qrcode',
    'sf.b2c.mall.business.config',
    'sf.helpers',
    'sf.b2c.mall.api.order.getOrderV2',
    'sf.b2c.mall.framework.comm',
    'sf.b2c.mall.api.minicart.getTotalCount' // 获得mini cart的数量接口
  ],
  function(can, $, qrcode, SFConfig, helpers, SFGetOrder, SFFramework, SFGetTotalCount) {

    return can.Control.extend({

      /**
       * @description mustache helpers
       * @type {Object}
       */
      helpers: {
        /**
         * @description 显示支付方式
         * @param  {string} payType 支付方式字段
         * @return {string}         支付方式
         */
        'sf-payment': function(payType) {
          var map = {
            'alipay': '支付宝',
            'tenpay_forex': '财付通',
            'tenpay_forex_wxsm': '微信支付',
            'lianlianpay': '快捷支付'
          }

          return map[payType];
        },

        /**
         * @description 判断是不是对应的卡券方式
         * @param  {string} couponType 卡券类型字段
         * @param  {string} definition 卡券类型定义
         * @param  {object} options
         * @return {object}
         */
        'sf-coupon-type': function(couponType, orderAction, definition, options) {
          if (couponType == definition && orderAction == 'PRESENT') {
            return options.fn(options.contexts || this);
          } else {
            return options.inverse(options.contexts || this);
          }
        },

        /**
         * @description 获取卡券类型的名称
         * @param  {string} couponType 卡券类型字段
         * @return {string}            卡券类型名称
         */
        'sf-coupon-type-name': function(couponType) {
          var map = {
            'CASH': '现金券',
            'GIFTBAG': '礼包',
            'SHAREBAG': '红包'
          }

          return map[couponType];
        },

        /**
         * @description 判断group是不是空队列
         * @param  {array}  group   队列
         * @param  {object} options
         * @return {object}
         */
        'sf-is-not-empty': function(group, options) {
          var array = _.findWhere(group, {
            orderAction: 'PRESENT'
          });
          if (_.isEmpty(array)) {
            return options.inverse(options.contexts || this);
          } else {
            return options.fn(options.contexts || this);
          }
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
      request: function(orderId) {
        var getOrder = new SFGetOrder({
          "orderId": orderId
        });

        var getTotalCount = new SFGetTotalCount();
        if (SFFramework.prototype.checkUserLogin.call(this)) {
          return can.when(getOrder.sendRequest(), getTotalCount.sendRequest());
        }

      },

      /**
       * @description 绘制页面
       * @param  {json} data 从服务端获取的数据
       * @return
       */
      paint: function(orderinfo, cartnum) {
        // 从params获取不同部分的数据
        var data = _.extend(orderinfo, {
          cartnum: cartnum.value
        });

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
        $('.shareQrCode').each(function(index, element) {
          var code = $(element).attr('data-code');
          var qrParam = {
            width: 140,
            height: 140,
            text: "http://m.sfht.com/luckymoneyshare.html?id=" + code
          };

          $(element).qrcode(qrParam);
        });
      }
    });
  })