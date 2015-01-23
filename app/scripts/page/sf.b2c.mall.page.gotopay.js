'use strict';

define(
  [
    'can',
    'jquery',
    'sf.b2c.mall.framework.comm',
    'sf.b2c.mall.component.header',
    'sf.b2c.mall.component.footer',
    'sf.b2c.mall.order.step',
    'sf.b2c.mall.api.order.getOrder',
    'sf.b2c.mall.api.order.requestPayV2',
    'sf.b2c.mall.order.fn',
    'sf.b2c.mall.widget.message'
  ],

  function(can, $, SFFrameworkComm, Header, Footer, OrderSetp, SFGetOrder, SFRequestPayV2, SFOrderFn, SFMessage) {
    SFFrameworkComm.register(1);

    var order = can.Control.extend({

      init: function(element, options) {
        this.step = null;

        this.render();
      },

      render: function() {
        new Header('.sf-b2c-mall-header', {
          isForceLogin: true
        });
        new Footer('.sf-b2c-mall-footer');



        var that = this;
        this.options.tips = new can.Map({})
        var params = can.deparam(window.location.search.substr(1));

        if(params.otherlink){
          this.options.tips.attr('tipInfo','请您尽快完成付款，以便订单尽快处理！');
        }else{
          //step
          this.step = new OrderSetp('.sf-b2c-mall-order-step', {
            "secondstep": "active"
          });
          this.options.tips.attr('tipInfo','您已成功提交订单，请您尽快完成付款！');
        }

        that.options.orderid = params.orderid;
        that.options.recid = params.recid;
        that.options.alltotalamount = params.amount;

        var getOrder = new SFGetOrder({
          "orderId": params.orderid
        });

        getOrder.sendRequest()
            .done(function(data){
              that.options.orderId = data.orderId;
              that.options.orderMoney = data.orderItem.totalPrice/100;
              that.options.orderPayWay = '在线支付';

              that.options.receiveName = data.orderItem.orderAddressItem.receiveName;
              that.options.country = data.orderItem.orderAddressItem.country;
              that.options.province = data.orderItem.orderAddressItem.province;
              that.options.city = data.orderItem.orderAddressItem.city;
              that.options.region = data.orderItem.orderAddressItem.region;
              that.options.detailAddress = data.orderItem.orderAddressItem.detailAddress;
              that.options.mobile = data.orderItem.orderAddressItem.mobile;
              that.options.certNo = data.orderItem.orderAddressItem.certNo;
              that.options.currentPayWay =that.showPayMap['alipay'];

              var html = can.view('templates/order/sf.b2c.mall.order.gotopay.mustache',that.options);
              $('#gotopayDIV').html(html);
            }).fail(function(){

            });

      },

      showPayMap:{
        'alipay':'<div class="order-r1c1 fl"><span name="radio-pay" payType="alipay" class="icon radio active"></span><img src="../img/pay1.jpg" alt="支付宝"></div>' +
            '<div class="order-r1c1 fl visuallyhidden"><span name="radio-pay" payType="tenpay_forex_wxsm" class="icon radio"></span><img src="../img/pay2.jpg" alt="微信支付"></div>' +
            '<div class="order-r1c1 fl visuallyhidden"><span name="radio-pay" payType="tenpay_forex" class="icon radio"></span><img src="../img/pay3.jpg" alt="财付通"></div>'
      },
      '.order-r1c1 click':function(element,event){
        $(element).children('span').addClass('active');
        $(element).siblings().children('span').removeClass('active');
      },

      //alipay,sfp,tenpay_forex,tenpay_forex_wxsm,alipay_intl
      getPayType:function(){
        var result = "";
        _.each($('span[name="radio-pay"]'),function(ele){
          if($(ele).hasClass('active')){
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

      '#gotopayBtn click': function() {

        var that = this;

        var callback = {
          error: function(errorText) {

            var message = new SFMessage(null, {
              'tip': '订单支付失败！',
              'type': 'error'
            });

            that.step.setActive("thirdstep");
            var template = can.view.mustache(that.payerrorTemplate());
            $('#gotopayDIV').html(template());
          }
        }

        SFOrderFn.payV2({
          orderid: that.options.orderid,
          payType: that.getPayType()
        }, callback);
      }
    });

    new order('#order');
  });