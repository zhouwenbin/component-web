'use strict';

define(
  'sf.b2c.mall.page.gotopay', [
    'can',
    'jquery',
    'store',
    'sf.helpers',
    'sf.b2c.mall.framework.comm',
    'sf.b2c.mall.component.header',
    'sf.b2c.mall.component.footer',
    'sf.b2c.mall.order.step',
    'sf.b2c.mall.order.fn',
    'sf.b2c.mall.widget.message',
    'sf.b2c.mall.api.order.getOrderConfirmInfo'
  ],

  function(can, $, store, helpers, SFFrameworkComm, Header, Footer, OrderSetp, SFOrderFn, SFMessage, GetOrderConfirmInfo) {
    SFFrameworkComm.register(1);

    var PAY_ASAP = '请您尽快完成付款，以便订单尽快处理！';
    var SUBMIT_SUCCESS = '您已成功提交订单，请您尽快完成付款！';

    var order = can.Control.extend({

      init: function(element, options) {
        this.render();
      },

      getAlertWord: function (otherlink) {
        return otherlink ? PAY_ASAP : SUBMIT_SUCCESS;
      },

      request: function (orderid) {
        var getOrder = new GetOrderConfirmInfo({
          "orderId": orderid
        });

        return getOrder.sendRequest();
      },

      paint: function (data) {
        console.log(data);

        data.optionalPayTypeList = eval(data.optionalPayTypeList);

        this.options.data.attr(data);

        var html = can.view('templates/order/sf.b2c.mall.order.gotopay.mustache', this.options.data);

        this.element.find('.sf-gotopay-container').html(html);
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






        var that = this;
        this.options.tips = new can.Map({})


        if (params.otherlink) {
          this.options.tips.attr('tipInfo', '请您尽快完成付款，以便订单尽快处理！');
        } else {
          this.step = new OrderSetp('.sf-b2c-mall-order-step', {
            "secondstep": "active"
          });
          this.options.tips.attr('tipInfo', '您已成功提交订单，请您尽快完成付款！');
        }

        that.options.orderid = params.orderid;
        that.options.recid = params.recid;
        that.options.alltotalamount = params.amount;

        var getOrder = new GetOrderConfirmInfo({
          "orderId": params.orderid
        });

        getOrder.sendRequest()
          .done(function(data) {
            that.options.orderMoney = data.orderItem.totalPrice - data.orderItem.discount;
            if (data.discount) {
              that.options.discount = JSON.parse(data.discount.value);
              if (!can.isEmptyObject(that.options.discount) && typeof that.options.discount.lianlianpay != 'undefined') {
                that.options.tips.attr('totalMoney',(that.options.orderMoney-that.options.discount.lianlianpay)/100)
              }else{
                that.options.tips.attr('totalMoney',that.options.orderMoney/100);
              }
            }else{
              that.options.tips.attr('totalMoney',that.options.orderMoney/100);
            }
            that.options.orderId = data.orderId;
            that.options.orderPayWay = '在线支付';

            that.options.receiveName = data.orderItem.orderAddressItem.receiveName;
            that.options.country = data.orderItem.orderAddressItem.country;
            that.options.province = data.orderItem.orderAddressItem.province;
            that.options.city = data.orderItem.orderAddressItem.city;
            that.options.region = data.orderItem.orderAddressItem.region;
            that.options.detailAddress = data.orderItem.orderAddressItem.detailAddress;
            that.options.mobile = data.orderItem.orderAddressItem.mobile;
            that.options.certNo = data.orderItem.orderAddressItem.certNo;
            that.options.currentPayWay = that.getPayWay(JSON.parse(data.optionalPayTypeList)[0]);
            var html = can.view('templates/order/sf.b2c.mall.order.gotopay.mustache', that.options);
            $('#gotopayDIV').html(html);
          }).fail(function() {

          });
      },

      getPayWay: function(paytype){
        if (store.get("alipaylogin") && store.get("alipaylogin") === "true") {
          return this.showOnlyAliPayMap[paytype];
        } else {
          return this.showPayMap[paytype];
        }
      },

      showPayMap: {
        'alipay_intl': '<div class="order-r1c1 fl "><span name="radio-pay" payType="lianlianpay" class="icon radio active"></span><img src="http://img.sfht.com/sfht/1.1.32/img/pay4.jpg" alt="连连支付"><h3>首次使用快捷支付，立减5元</h3></div>' +
          '<div class="order-r1c1 fl"><span name="radio-pay" payType="alipay_intl" class="icon radio"></span><img src="http://img.sfht.com/sfht/img/pay1.jpg" alt="支付宝"><h3>中国最大的第三方支付平台</h3></div>',
        'alipay': '<div class="order-r1c1 fl "><span name="radio-pay" payType="lianlianpay" class="icon radio active"></span><img src="http://img.sfht.com/sfht/1.1.32/img/pay4.jpg" alt="连连支付"><h3>首次使用快捷支付，立减5元</h3></div>' +
          '<div class="order-r1c1 fl"><span name="radio-pay" payType="alipay" class="icon radio "></span><img src="http://img.sfht.com/sfht/img/pay1.jpg" alt="支付宝"><h3>中国最大的第三方支付平台</h3></div>' +
          '<div class="order-r1c1 fl"><span name="radio-pay" payType="tenpay_forex_wxsm" class="icon radio"></span><img src="http://img.sfht.com/sfht/img/pay2.jpg" alt="微信支付"><h3>微信扫一扫就能付款，更快捷</h3></div>' +
          '<div class="order-r1c1 fl"><span name="radio-pay" payType="tenpay_forex" class="icon radio"></span><img src="http://img.sfht.com/sfht/img/pay3.jpg" alt="财付通"><h3>超过3亿用户的选择，汇率更优！</h3></div>'
      },

      showOnlyAliPayMap: {
        'alipay_intl': '<div class="order-r1c1 fl"><span name="radio-pay" payType="alipay_intl" class="icon radio"></span><img src="http://img.sfht.com/sfht/img/pay1.jpg" alt="支付宝"><h3>中国最大的第三方支付平台</h3></div>',
        'alipay': '<div class="order-r1c1 fl"><span name="radio-pay" payType="alipay" class="icon radio "></span><img src="http://img.sfht.com/sfht/img/pay1.jpg" alt="支付宝"><h3>中国最大的第三方支付平台</h3></div>'
      },

      '.order-r1c1 click': function(element, event) {
        $(element).children('span').addClass('active');
        $(element).siblings().children('span').removeClass('active');
        if(typeof this.options.discount != 'undefined' && !can.isEmptyObject(this.options.discount) && typeof this.options.discount[this.getPayType()] != 'undefined'){
          this.options.tips.attr('totalMoney',(this.options.orderMoney - this.options.discount[this.getPayType()])/100);
        }else{
          this.options.tips.attr('totalMoney',this.options.orderMoney/100);
        }
      },

      //alipay,sfp,tenpay_forex,tenpay_forex_wxsm,alipay_intl
      getPayType: function() {
        var result = "";
        _.each($('span[name="radio-pay"]'), function(ele) {
          if ($(ele).hasClass('active')) {
            result = $(ele).attr('payType');
          }
        });
        return result;
      },

      payerrorTemplate: function() {
        return '<div class="order">' +
          '<div class="order-r3">' +
          '<span class="icon icon32"></span>' +
          '<h2>订单支付失败</h2>' +
          '<a href="javascript:void(0)" class="btn btn-send" id="viewOrderDetail">查看订单</a>' +
          '<a href="javascript:void(0)" class="btn btn-send" id="gotopayBtn">去支付</a>' +
          '</div>'
      },

      payErrorMap: {
        '3000001': '支付金额非法',
        '3000002': '支付状态不允许支付',
        '3000007': '用户订单不正确'
      },

      '#viewOrderDetail click': function() {
        window.open("/orderdetail.html?orderid=" + this.options.orderid + "&recid=" + this.options.recid, "_blank");
        return false;
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
              'tip': '订单支付失败！',
              'type': 'error'
            });

            var template = can.view.mustache(that.payerrorTemplate());
            $('#gotopayDIV').html(template());
          }
        }

        SFOrderFn.payV2({
          orderid: this.options.orderid,
          payType: this.getPayType()
        }, callback);
      }
    });

    new order('#order');
  });