'use strict';

var center = sf.util.namespace('b2c.mall.center');

can.route.ready();

center.booking = can.Control.extend({

  helpers: {
    'sf-status-check': function (channel, status, options) {
      if (_.isFunction(status)) {
        status = status();
      }

      var map = {
        'undefined': 'CUSTOM',
        'NULL': 'CUSTOM',
        'SUBMITED': 'PAY',
        'AUTO_CANCEL': 'CUSTOM',
        'USER_CANCEL': 'CUSTOM',
        'AUDITING': 'CUSTOM',
        'OPERATION_CANCEL': 'CUSTOM',
        'BUYING': 'CUSTOM',
        'BUYING_EXCEPTION': 'CUSTOM',
        'LOGISTICS_EXCEPTION': 'RECEIVED',
        'WAIT_SHIPPING':'CUSTOM',
        'SHIPPING': 'RECEIVED',
        'SHIPPED': 'RECEIVED',
        'COMPLETED': 'COMMIT'
      };

      var signal = map[status];

      if (signal === channel) {
        return options.fn(options.scope || this);
      }else{
        return options.inverse(options.scope|| this);
      }

    },

    'sf-should-show-refund': function(status, options){
      if (_.isFunction(status)) {
        status = status();
      }

      var map = {
        'SUBMITED': true,
        'AUTO_CANCEL': true,
        'USER_CANCEL': true
      };

      var shouldNotShowRefund = map[status];

      if (shouldNotShowRefund) {
        return options.inverse(options.scope|| this);
      }else{
        return options.fn(options.scope || this);
      }
    }
  },

  /**
   * @param  {DOM} element 容器element
   * @param  {Object} options 传递的参数
   */
  init: function (element, options) {

    this.render({});

    this.supplement();
  },

  render: function (data) {
    // @todo 'sf.b2c.mall.center.booking.mustache' 需要提炼列表布局

    var html = can.view('templates/center/sf.b2c.mall.center.booking.mustache', data);
    this.element.html(html);
  },

  supplement: function () {
    var params = can.route.attr();
    if (!params.page) {
      params.page = 1;
    }

    var that = this;
    can.when(sf.b2c.mall.model.order.getOrderList(params))
      .done(function (data) {
        if (sf.util.access(data, true)) {
          that.options.orderListAdapter = new sf.b2c.mall.adapter.order.list(data.content[0]);
          var html = can.view('templates/center/sf.b2c.mall.center.booking.item.mustache', that.options.orderListAdapter, that.helpers);
          that.element.find('.sf-order__order-list').html(html);

          that.options.page = new sf.b2c.mall.adapter.pagination();
          that.options.page.format(that.options.orderListAdapter.page);
          new sf.b2c.mall.widget.pagination('.sf-b2c-mall-pagination', that.options);
        }
      })
      .fail(function (data) {

      });
  },

  '.lead a click': function (element, event) {
    event && event.preventDefault();
    var type = element.data('channel');
    can.route.attr('status', type);
  },

  '.center-buy-cancel click': function (element, event) {
    event && event.preventDefault();

    var order = element.data('order');
    var orderId = order.orderId;
    if (orderId) {
      can.when(sf.b2c.mall.model.order.cancelOrder({orderId: orderId}))
        .done(function (data) {
          if (sf.util.access(data, true) && data.content[0].value) {
            window.location.reload();
          }
        })
        .fail(function (data) {

        })
    }
  },

  payErrorMap: {
    '3000001':   '支付金额非法',
    '3000002':   '支付状态不允许支付',
    '3000007':   '用户订单不正确'
  },

  '.center-buy click': function (element, event) {
    event && event.preventDefault();
    var order = element.data('order');

    var that = this;
    can.when(sf.b2c.mall.model.order.requestPayV2({orderId: order.orderId, sum: order.payPrice, payType: 'alipay'}))
      .done(function (data) {
        if (sf.util.access(data) && data.content[0]) {
          var payinfo = data.content[0];

          element.find('.pay-form').attr('action', payinfo.url + '?' + payinfo.postBody);
          element.find('.pay-form').submit();

          // $('<form method="post" target="_blank" action="'+ payinfo.url + '?' + payinfo.postBody +'" ></form>').submit();
        }else{
          var errorCode = data.stat.stateList[0].code;
          var errorText = that.payErrorMap[errorCode.toString()] || '支付失败';
          alert(errorText);
          window.location.reload();
        }
      })
      .fail(function (error) {

      });
  },

  '{can.route} change': function () {
    this.supplement();
  }
});