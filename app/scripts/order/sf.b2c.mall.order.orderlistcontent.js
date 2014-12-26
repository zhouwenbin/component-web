'use strict';

define('sf.b2c.mall.order.orderlistcontent', [
  'can',
  'sf.b2c.mall.api.order.getOrderList',
  'sf.b2c.mall.adapter.pagination',
  'sf.b2c.mall.widget.pagination',
  'sf.b2c.mall.api.order.getOrder',
  'sf.helpers'
], function(can, SFGetOrderList, PaginationAdapter, Pagination, SFGetOrder, helpers) {
  return can.Control.extend({

    /**
     * 初始化
     * @param  {DOM} element 容器element
     * @param  {Object} options 传递的参数
     */
    init: function(element, options) {
      this.render();
    },

    render: function(data) {
      var that = this;

      var params = {
        "query": JSON.stringify({
          "status": null,
          "receiverName": that.options.searchValue,
          "orderId": that.options.searchValue,
          "pageNum": 1,
          "pageSize": 100
        })
      }

      var getOrderList = new SFGetOrderList(params);
      getOrderList
        .sendRequest()
        .done(function(data) {
          debugger;
          that.options.orderlist = data.orders;

          _.each(that.options.orderlist, function(order) {
            order.orderStatus = 'BUYING';

            order.goodsName = order.orderGoodsItemList[0].goodsName;
            order.spec = order.orderGoodsItemList[0].spec;
            order.optionHMTL = that.getOptionHTML(that.optionMap[order.orderStatus]);
            order.showRouter = that.routeMap[order.orderStatus];
            order.orderStatus = that.statsMap[order.orderStatus];
          })

          var html = can.view('templates/order/sf.b2c.mall.order.orderlist.mustache', that.options);
          that.element.html(html);

          //分页 保留 已经调通 误删 后面设计会给样式
          // that.options.page = new PaginationAdapter();
          // that.options.page.format(data.page);
          // new Pagination('.sf-b2c-mall-order-orderlist-pagination', that.options);

        })
        .fail(function(error) {
          console.error(error);
        })
    },

    '.table-1-logistics mouseover': function(element, event) {
      debugger;
      var that = this;
      element.find('.tooltip').show();

      var getOrder = new SFGetOrder({
        "orderId": $(element)[0].dataset.orderid
      });
      getOrder
        .sendRequest()
        .done(function(data) {
          that.options.traceList = data.orderActionTraceItemList;
          var template = can.view.mustache(that.getTraceListTemplate())
          element.find('#traceList').html(template(that.options));
        })
        .fail(function(error) {
          console.error(error);
        })

      return false;
    },

    '.table-1-logistics mouseout': function(element, event) {
      element.find('.tooltip').hide();

      return false;
    },

    getTraceListTemplate: function() {
      return '<h4>物流跟踪</h4>' +
        '<ul>' +
        '{{#each traceList}}' +
        '<li><span class="time">{{gmtHappened}}</span>从海外仓发出</li>' +
        '{{/each}}' +
        '</ul>' +
        '<span class="icon icon16-3"><span class="icon icon16-4"></span></span>'
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
    }

  });
})