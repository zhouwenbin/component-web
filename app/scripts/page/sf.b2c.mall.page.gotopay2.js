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
        var params = can.deparam(window.location.search.substr(1));
        this.options.orderid = params.orderid;
        this.options.recid = params.recid;
        this.options.alltotalamount = params.amount;
        this.options.paytype = params.paytype;
        this.step = null;
        this.render();
      },

      render: function() {
        new Header('.sf-b2c-mall-header', {
          isForceLogin: true
        });
        new Footer('.sf-b2c-mall-footer');

        //step
        this.step = new OrderSetp('.sf-b2c-mall-order-step', {
          "secondstep": "active"
        });

        var template = can.view.mustache(this.gotopayTemplate());
        $('#gotopayDIV').html(template());
      },

      gotopayTemplate: function() {
        return '<div class="order">' +
          '<div class="order-r3">' +
          '<h2>订单提交成功，请您尽快完成付款！</h2>' +
          '<p>请您在提交订单后2小时内完成支付，否则订单会自动取消。</p>' +
          '<a href="javascript:void(0)" class="btn btn-send" id="gotopayBtn">去支付</a>' +
          '</div>' +
          '</div>'
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

        var that = this;
        SFOrderFn.payV2({
          orderid: that.options.orderid,
          payType: that.options.paytype
        }, callback);
      }
    });

    new order('#order');
  });