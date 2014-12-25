'use strict';

require(
  [
    'can',
    'jquery',
    'sf.b2c.mall.component.header',
    'sf.b2c.mall.component.footer',
    'sf.b2c.mall.order.step',
    'sf.b2c.mall.api.order.requestPayV2'
  ],

  function(can, $, Header, Footer, OrderSetp, SFRequestPayV2) {

    var order = can.Control.extend({

      init: function(element, options) {
        var params = can.deparam(window.location.search.substr(1));
        this.options.orderid = params.orderid;
        this.options.alltotalamount = params.amount;

        this.render();
      },

      render: function() {
        new Header('.sf-b2c-mall-header');
        new Footer('.sf-b2c-mall-footer');

        //step
        new OrderSetp('.sf-b2c-mall-order-step', {
          "secondstep": "active"
        });

        var template = can.view.mustache(this.gotopayTemplate());
        $('#gotopay').html(template());
      },

      gotopayTemplate: function() {
        return '<div class="order">' +
          '<div class="order-r3">' +
          '<h2>订单提交成功</h2>' +
          '<a href="#" class="btn btn-send" id="gotopayBtn">去支付</a>' +
          '</div>' +
          '</div>'
      },

      payerrorTemplate: function() {
        return '<div class="order">' +
          '<div class="order-r3">' +
          '<span class="icon icon32"></span>' +
          '<h2>订单支付失败</h2>' +
          '<a href="#" class="btn btn-send">查看订单</a>' +
          '<a href="#" class="btn btn-send">去支付</a>' +
          '</div>'
      },

      payErrorMap: {
        '3000001': '支付金额非法',
        '3000002': '支付状态不允许支付',
        '3000007': '用户订单不正确'
      },

      '#gotopayBtn click': function() {
        debugger;
        var that = this;

        var requestPayV2 = new SFRequestPayV2();
        requestPayV2
          .sendRequest()
          .done(function(data) {
            if (sf.util.access(data) && data.content[0]) {
              var payinfo = data.content[0];

              window.location.href = payinfo.url + '?' + payinfo.postBody;

              that.request.call(that, orderInfo.orderId);
            } else {
              var errorCode = data.stat.stateList[0].code;
              var errorText = that.payErrorMap[errorCode.toString()] || '支付失败';
              console.error(errorText);
              var template = can.view.mustache(this.gotopayTemplate());
              $('#gotopay').html(template());
            }
          })
          .fail(function(error) {

          });
      },

      request: function(orderId) {
        var that = this;
        setTimeout(function() {
          can.when(sf.b2c.mall.model.order.getOrder({
              orderId: orderId
            }))
            .done(function(data) {
              var order = data.content[0].basicInfo;
              if (order.orderStatus == 'AUDITING') {
                window.location.href = '/center.html';
              } else {
                that.request.call(that, orderId);
              }
            })
            .fail(function() {
              that.request.call(that, orderId);
            });
        }, 1000);
      },

      supplement: function() {

      }
    });

    new order('#order');
  });