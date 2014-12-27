'use strict';

define('sf.b2c.mall.order.orderdetailcontent', [
  'can',
  'sf.b2c.mall.api.order.getOrder',
  'sf.helpers'
], function(can, SFGetOrder, helpers) {
  return can.Control.extend({

    /**
     * [defaults 定义默认值]
     */
    defaults: {
      'steps': ['SUBMITED', 'AUDITING', 'SHIPPING', 'COMPLETED']
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
     * [render 执行渲染]
     * @param  {[type]} data 数据
     */
    render: function(data) {
      var that = this;

      var params = can.deparam(window.location.search.substr(1));

      var getOrder = new SFGetOrder({
        "orderId": params.orderid
      });
      getOrder
        .sendRequest()
        .done(function(data) {
          that.options.orderId = data.orderId;
          that.options.status = that.statsMap[data.orderItem.orderStatus];
          that.options.nextStep = that.optionHTML[that.nextStepMap[data.orderItem.orderStatus]]
          that.options.nextStepTips = that.nextStepTipsMap[data.orderItem.orderStatus];
          that.options.traceList = data.orderActionTraceItemList;

          // that.options.traceList[0].status = 'SUBMITED';
          // that.options.traceList[1].status = 'AUDITING';

          var map = {
            'SUBMITED': function(trace){
              that.options.submitedTime = trace.gmtHappened;
              that.options.submitedActive = "active";
            },

            'AUDITING': function(trace){
              that.options.auditingTime = trace.gmtHappened;
              that.options.auditingActive = "active";
            },

            'SHIPPING': function(trace){
              that.options.shippingTime = trace.gmtHappened;
              that.options.shippingActive = "active";
            },

            'COMPLETED': function(trace){
              that.options.completedTime = trace.gmtHappened;
              that.options.completedActive = "active";
            }
          }
          _.each(that.options.traceList, function(trace){
            trace.operator = that.operatorMap[trace.operator];
            trace.description = that.statusDescription[trace.status];

            if (typeof map[trace.status] != 'undefined'){
              map[trace.status].call(that,trace);
            }
          })

          that.options.receiveInfo = data.orderItem.orderAddressItem;

          that.options.productList = data.orderItem.orderGoodsItemList;

          _.each(that.options.productList, function(item) {
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

    statusDescription: {
      'SUBMITED': '您提交了订单，请等待系统确认',
      'AUTO_CANCEL': '系统自动取消',
      'USER_CANCEL': '用户取消',
      'AUDITING': '您的订单已经付款成功，请等待审核',
      'OPERATION_CANCEL': '运营取消',
      'BUYING': '您的宝贝已经审核通过，正在采购',
      'BUYING_EXCEPTION': '采购异常',
      'WAIT_SHIPPING': '您的宝贝已经采购到，请等待发货',
      'SHIPPING': '您的宝贝已经发货，请保持手机畅通',
      'LOGISTICS_EXCEPTION': '物流异常',
      'SHIPPED': '发货成功',
      'COMPLETED': '已完成'
    },

    getOptionHTML: function(operationsArr) {
      var that = this;
      var result = [];
      _.each(operationsArr, function(option) {
        if (that.optionHTML[option]) {
          result.push(that.optionHTML[option]);
        }
      })

      return result.join("");
    },

    operatorMap: {
      "USER": "用户"
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

    stepMap: {
      'SUBMITED': '<li class="active"><div><h3>提交订单</h3><p></p>2014/12/23 11:34:23<p></p></div><span></span><div class="line"></div></li>',
      'AUDITING': '<li><div><h3>付款成功</h3></div><span></span><div class="line"></div></li>',
      'BUYING': '<li><div><h3>采购中</h3></div><span></span><div class="line"></div></li>',
      'SHIPPING': '<li><div><h3>商品出库</h3></div><span></span><div class="line"></div></li>',
      'COMPLETED': '<li><div><h3>订单完成</h3></div><span></span><div class="line"></div></li>'
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