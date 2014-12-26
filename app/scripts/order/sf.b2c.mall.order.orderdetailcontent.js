'use strict';

define('sf.b2c.mall.order.orderdetailcontent', [
  'can',
  'sf.b2c.mall.api.order.getOrder'
], function(can, SFGetOrder) {
  return can.Control.extend({

    /**
     * 初始化
     * @param  {DOM} element 容器element
     * @param  {Object} options 传递的参数
     */
    init: function(element, options) {
      debugger;
      this.render();
    },

    render: function(data) {
      var that = this;

      var getOrder = new SFGetOrder({
        "orderId": 100
      });
      getOrder
        .sendRequest()
        .done(function(data) {
          debugger;
          that.options.orderId = data.orderId;
          that.options.status = that.statsMap[data.orderItem.orderStatus];
          that.options.nextStep = that.optionHTML[that.nextStepMap[data.orderItem.orderStatus]]
          that.options.nextStepTips = that.nextStepTipsMap[data.orderItem.orderStatus];
          that.options.traceList = data.orderActionTraceItemList;
          that.options.receiveInfo = data.orderItem.orderAddressItem;
          that.options.productList = data.orderItem.orderGoodsItemList;

          _.each(that.options.productList, function(item) {
            debugger;
            item.totalPrice = item.price * item.quantity;
          })

          that.options.allTotalPrice = that.options.productList[0].totalPrice;
          that.options.shouldPayPrice = that.options.allTotalPrice;

          var html = can.view('templates/order/sf.b2c.mall.order.orderdetail.mustache', that.options);
          that.element.html(html);
        })
        .fail(function(error) {
          console.error(error);
        })
    },

    getOptionHTML: function(operationsArr) {
      debugger;
      var that = this;
      var result = [];
      _.each(operationsArr, function(option) {
        if (that.optionHTML[option]) {
          result.push(that.optionHTML[option]);
        }
      })

      return result.join("");
    },

    routeMap: {
      'SUBMITED': false,
      'AUTO_CANCEL': false,
      'USER_CANCEL': false,
      'AUDITING': false,
      'OPERATION_CANCEL': false,
      'BUYING': true,
      'BUYING_EXCEPTION': false,
      'WAIT_SHIPPING': true,
      'SHIPPING': true,
      'LOGISTICS_EXCEPTION': false,
      'SHIPPED': true,
      'COMPLETED': true
    },

    optionMap: {
      'SUBMITED': ['NEEDPAY', 'INFO', 'CANCEL'],
      'AUTO_CANCEL': ['INFO'],
      'USER_CANCEL': ['INFO'],
      'AUDITING': ['INFO', 'CANCEL'],
      'OPERATION_CANCEL': ['INFO', 'CANCEL'],
      'BUYING': ['INFO'],
      'BUYING_EXCEPTION': ['INFO'],
      'WAIT_SHIPPING': ['INFO'],
      'SHIPPING': ['INFO', 'ROUTE'],
      'LOGISTICS_EXCEPTION': ['INFO', 'ROUTE'],
      'SHIPPED': ['INFO', 'ROUTE'],
      'COMPLETED': ['INFO', 'ROUTE']
    },

    optionHTML: {
      "NEEDPAY": '<a href="#" class="btn btn-send">立即支付</a>',
      "INFO": '<a href="#" class="btn btn-add">查看订单</a>',
      "CANCEL": '<a href="#" class="btn btn-add">取消订单</a>'
    },

    statsMap: {
      'SUBMITED': '已提交',
      'AUTO_CANCEL': '自动取消',
      'USER_CANCEL': '用户取消',
      'AUDITING': '待审核',
      'OPERATION_CANCEL': '运营取消',
      'BUYING': '采购中',
      'BUYING_EXCEPTION': '采购异常',
      'WAIT_SHIPPING': '待发货',
      'SHIPPING': '发货中',
      'LOGISTICS_EXCEPTION': '物流异常',
      'SHIPPED': '已发货',
      'COMPLETED': '已完成'
    },

    nextStepMap: {
      'SUBMITED': 'NEEDPAY'
    },

    nextStepTipsMap: {
      'SUBMITED': '尊敬的客户，我们还未收到该订单的款项，请您尽快付款（在线支付帮助）。<br />' +
        '该订单会为您保留24小时（从下单时间算起），24小时后系统将自动取消未付款的订单。</p>'
    }

  });
})