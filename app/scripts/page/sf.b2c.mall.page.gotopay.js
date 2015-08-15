'use strict';

define(
  'sf.b2c.mall.page.gotopay', [
    'can',
    'jquery',
    'store',
    'sf.helpers',
    'underscore',
    'sf.b2c.mall.framework.comm',
    'sf.b2c.mall.component.header',
    'sf.b2c.mall.component.footer',
    'sf.b2c.mall.order.step',
    'sf.b2c.mall.order.fn',
    'sf.b2c.mall.widget.message',
    'sf.b2c.mall.api.order.getOrderConfirmInfo'
  ],

  function(can, $, store, helpers, _, SFFrameworkComm, Header, Footer, OrderSetp, SFOrderFn, SFMessage, GetOrderConfirmInfo) {
    SFFrameworkComm.register(1);

    var PAY_ASAP = '请您尽快完成付款，以便订单尽快处理！';
    var SUBMIT_SUCCESS = '您已成功提交订单，请您尽快完成付款！';

    var order = can.Control.extend({

      helpers: {
        'sf-paytype-list': function(optionalPayTypeList, payType, options) {
          if (_.contains(optionalPayTypeList(), payType)) {
            return options.fn(options.contexts || this);
          } else {
            return options.inverse(options.contexts || this);
          }
        },

        'sf-totalprice': function(selectPayType, price, discount) {
          var discountInfo = JSON.parse(discount().value);
          if (typeof discountInfo != 'undefined' &&
            !can.isEmptyObject(discountInfo) &&
            typeof discountInfo[selectPayType()] != 'undefined'
          ) {
            if (price() - discountInfo[selectPayType()] <= 0) {
              return 0.01;
            } else {
              return (price() - discountInfo[selectPayType()]) / 100
            }
          } else {
            return price() / 100
          }
        },

        'sf-show001tip': function(selectPayType, price, discount, options) {
          var discountInfo = JSON.parse(discount().value);
          if (typeof discountInfo != 'undefined' &&
            !can.isEmptyObject(discountInfo) &&
            typeof discountInfo[selectPayType()] != 'undefined'
          ) {
            if (price() - discountInfo[selectPayType()] <= 0) {
              return options.fn(options.contexts || this);
            } else {
              return options.inverse(options.contexts || this);
            }
          } else {
            return options.inverse(options.contexts || this);
          }
        },

        'sf-getPayTypeName': function(selectPayType) {
          var map = {
            'alipay': '支付宝',
            'alipay_intl': '支付宝',
            'lianlianpay': '快捷支付',
            'tenpay_forex_wxsm': '微信支付',
            'tenpay_forex': '财付通'
          }

          return map[selectPayType()];
        },
        'showEndPayTime': function(orderGoodsItemList, options) {
          var array = orderGoodsItemList();
          if (array[0].goodsType == 'SECKILL') {
            return '15分钟'
          } else {
            return '2小时'
          }
        },
        'sf-show-desc': function(discount, payType, options) {
          var discountInfo = JSON.parse(discount().value);
          if (typeof discountInfo[payType] !== 'undefined') {
            return options.fn(options.contexts || this);
          } else {
            return options.inverse(options.contexts || this);
          }
        },
        'sf-show-save': function(selectPayType, discount, options) {
          var discountInfo = JSON.parse(discount().value);
          if (typeof discountInfo[selectPayType()] !== 'undefined') {
            return options.fn(options.contexts || this);
          } else {
            return options.inverse(options.contexts || this);
          }
        },
        'sf-totalsave': function(selectPayType, discount, options) {
          var discountInfo = JSON.parse(discount().value);
          return discountInfo[selectPayType()] / 100;
        }
      },

      init: function(element, options) {
        this.render();
      },

      getAlertWord: function(otherlink) {
        return otherlink ? PAY_ASAP : SUBMIT_SUCCESS;
      },

      request: function(orderid) {
        var getOrder = new GetOrderConfirmInfo({
          "orderId": orderid
        });

        return getOrder.sendRequest();
      },

      paint: function(data) {
        data.optionalPayTypeList = eval(data.optionalPayTypeList);

        this.options.data.attr(data);
        var discountInfo = _.keys(JSON.parse(data.discount.value));
        var array = _.intersection(discountInfo, data.optionalPayTypeList);
        if (array.length > 0) {
          this.options.data.attr('selectPayType', array[0]);
        } else {
          this.options.data.attr('selectPayType', data.optionalPayTypeList[0]);
        }
        //this.options.data.attr('end', data.optionalPayTypeList[0]);

        var html = can.view('templates/order/sf.b2c.mall.order.gotopay.mustache', this.options.data, this.helpers);
        this.element.find('.sf-gotopay-container').html(html);
        var selectPayType = this.options.data.attr('selectPayType');
        if (selectPayType) {
          $("[data-paytype=" + selectPayType + "]").addClass('active');
        } else {
          this.element.find('.gotopay li').first().addClass('active');
        }

        this.customizedWeixin();
      },

      // 活动期间对微信进行定制
      customizedWeixin: function(data) {
        if (new Date().getTime() < new Date(2015, 6, 27, 0, 0, 0).getTime() || new Date().getTime() > new Date(2015, 7, 3, 0, 0, 0).getTime()) {
          return false;
        }

        if ($("[data-paytype=tenpay_forex_wxsm]").length == 0) {
          return false;
        }

        $("[data-paytype=tenpay_forex_wxsm]").prependTo($('.payTypeListArea'));

        this.element.find('.gotopay li').removeClass('active');
        this.element.find('.gotopay li').first().addClass('active');
        this.options.data.attr('selectPayType', "tenpay_forex_wxsm");

        $("[data-paytype=tenpay_forex_wxsm]").find("h3").html("7.27-8.2首次下单减<span style='color:#dc3334'>2</span>元");
      },
      setCountDown: function(item, distance, endDate) {
        var leftTime = endDate - new Date().getTime() + distance;
        var leftsecond = parseInt(leftTime / 1000);
        var day1 = Math.floor(leftsecond / (60 * 60 * 24));
        var hour = Math.floor((leftsecond - day1 * 24 * 60 * 60) / 3600);
        var minute = Math.floor((leftsecond - day1 * 24 * 60 * 60 - hour * 3600) / 60);
        var second = Math.floor(leftsecond - day1 * 24 * 60 * 60 - hour * 3600 - minute * 60);
        item.attr('time', "<strong>" + day1 + "</strong>" + "天" + "<strong>" + hour + "</strong>" + "小时" + "<strong>" + minute + "</strong>" + "分" + "<strong>" + second + "</strong>" + "秒");
        item.attr('timeIcon', "icon4");
      },
      render: function() {

        // －－－－－－－－－－－－－－－－－－－－－－－－－－－－－
        // @todo 这里的header和footer还需要渲染吗?
        //
        var header = new Header('.sf-b2c-mall-header', {
          channel: '首页',
          isForceLogin: true
        });

        var footer = new Footer('.sf-b2c-mall-footer');
        // －－－－－－－－－－－－－－－－－－－－－－－－－－－－－

        var params = can.deparam(window.location.search.substr(1));

        this.options.data = new can.Map({
          tips: {
            tipInfo: this.getAlertWord(params.otherlink)
          },
          orderid: params.orderid,
          recid: params.recid,
          alltotalamount: params.amount
        });

        this
          .request(this.options.data.orderid)
          .done(_.bind(this.paint, this));

        return;
      },

      // getPayWay: function(paytype) {
      //   if (store.get("alipaylogin") && store.get("alipaylogin") === "true") {
      //     var map = {
      //       alipay_intl: ['alipay_intl'],
      //       alipay: ['alipay']
      //     }

      //     return map[paytype];
      //   } else {
      //     var map = {
      //       alipay_intl: ['lianlianpay', 'alipay_intl'],
      //       alipay: ['lianlianpay', 'alipay', 'tenpay_forex_wxsm', 'tenpay_forex']
      //     }

      //     return map[paytype];
      //   }
      // },

      '.payTypeListArea li click': function($el, event) {
        this.element.find('li').removeClass('active');
        $el.addClass('active');

        var payType = $el.attr('data-paytype');
        this.options.data.attr('selectPayType', payType);
      },

      //alipay,sfp,tenpay_forex,tenpay_forex_wxsm,alipay_intl
      getPayType: function() {
        return this.element.find('.gotopay li.active').attr('data-paytype');
      },

      // payerrorTemplate: function() {
      //   return '<div class="order">' +
      //     '<div class="order-r3">' +
      //     '<span class="icon icon32"></span>' +
      //     '<h2>订单支付失败</h2>' +
      //     '<a href="javascript:void(0)" class="btn btn-send" id="viewOrderDetail">查看订单</a>' +
      //     '<a href="javascript:void(0)" class="btn btn-send" id="gotopayBtn">去支付</a>' +
      //     '</div>'
      // },

      // payErrorMap: {
      //   '3000001': '支付金额非法',
      //   '3000002': '支付状态不允许支付',
      //   '3000007': '用户订单不正确'
      // },

      // '#viewOrderDetail click': function() {
      //   window.open("/orderdetail.html?orderid=" + this.options.orderid + "&recid=" + this.options.recid, "_blank");
      //   return false;
      // },

      '#order-detail click': function($el) {
        $el.toggleClass('active');
        $('.order-success-detail').toggle();
      },

      /**
       * @description 点击去支付按钮动作
       * @return
       */
      '#gotopayBtn click': function() {
        var that = this;

        var callback = {
          error: function(errorText) {

            var message = new SFMessage(null, {
              'tip': errorText || '订单支付失败！',
              'type': 'error'
            });

            // var template = can.view.mustache(that.payerrorTemplate());
            // $('#gotopayDIV').html(template());
          }
        }

        SFOrderFn.payV2({
          orderid: this.options.data.orderid,
          payType: this.getPayType()
        }, callback);
      }
    });

    new order('#order');
  });