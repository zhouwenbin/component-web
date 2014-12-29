'use strict';

define('sf.b2c.mall.order.orderlistcontent', [
  'can',
  'sf.b2c.mall.api.order.getOrderList',
  'sf.b2c.mall.adapter.pagination',
  'sf.b2c.mall.widget.pagination',
  'sf.b2c.mall.api.order.getOrder',
  'sf.helpers',
  'sf.b2c.mall.api.order.cancelOrder',
  'sf.b2c.mall.api.order.requestPayV2'
],
function(can, SFGetOrderList, PaginationAdapter, Pagination, SFGetOrder, helpers, SFCancelOrder, SFRequestPayV2) {

  return can.Control.extend({

    /**
     * 初始化
     * @param  {DOM} element 容器element
     * @param  {Object} options 传递的参数
     */
    init: function(element, options) {
      this.render();
    },

    /**
     * [render 渲染]
     * @param  {[type]} data 数据
     */
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

          that.options.orderlist = data.orders;

          _.each(that.options.orderlist, function(order) {

            order.goodsName = order.orderGoodsItemList[0].goodsName;
            order.imageUrl = order.orderGoodsItemList[0].imageUrl;
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

    /**
     * [description 查看物流触发鼠标悬停事件]
     * @param  {[type]} element 触发事件的元素
     * @param  {[type]} event 事件
     */
    '.table-1-logistics mouseover': function(element, event) {

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

    /**
     * [description 鼠标移过后要隐藏该区域]
     * @param  {[type]} element 元素
     * @param  {[type]} event 事件
     */
    '.table-1-logistics mouseout': function(element, event) {
      element.find('.tooltip').hide();
      return false;
    },

    /**
     * [getTraceListTemplate 获得查看物流模板]
     * @return {[string]} 模板字符串
     */
    getTraceListTemplate: function() {
      return '<h4>物流跟踪</h4>' +
        '<ul>' +
        '{{#each traceList}}' +
        '<li><span class="time">{{gmtHappened}}</span>{{status}} 具体描述待产品给出</li>' +
        '{{/each}}' +
        '</ul>' +
        '<span class="icon icon16-3"><span class="icon icon16-4"></span></span>'
    },

    /**
     * [getOptionHTML 获得操作Html拼接]
     * @param  {[type]} operationsArr 操作数组
     * @return {[type]} 拼接html
     */
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

    /**
     * [routeMap 查看物流状态标示 哪些状态可以查看物流]
     */
    routeMap: {
      'SUBMITED': false,
      'AUTO_CANCEL': false,
      'USER_CANCEL': false,
      'AUDITING': false,
      'OPERATION_CANCEL': false,
      'BUYING': false,
      'BUYING_EXCEPTION': false,
      'WAIT_SHIPPING': false,
      'SHIPPING': false,
      'LOGISTICS_EXCEPTION': false,
      'SHIPPED': true,
      'COMPLETED': true
    },

    /**
     * [optionMap 状态下允许执行的操作]
     */
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

    /**
     * [optionHTML 操作对应的html]
     */
    optionHTML: {
      "NEEDPAY": '<a href="#" class="btn btn-send gotoPay">立即支付</a>',
      "INFO": '<a href="#" class="btn btn-add viewOrder">查看订单</a>',
      "CANCEL": '<a href="#" class="btn btn-add cancelOrder">取消订单</a>'
    },

    '.gotoPay click': function(element,event) {

      var that = this;
      var orderId = element.parent('div#operationarea')[0].dataset.orderid;

      var requestPayV2 = new SFRequestPayV2({
        "orderId": orderId,
        'payType': 'alipay'
      });
      requestPayV2
        .sendRequest()
        .done(function(data) {
          if (sf.util.access(data) && data.content[0]) {
            var payinfo = data.content[0];

            window.location.href = payinfo.url + '?' + payinfo.postBody;

            //轮训订单状态，看是否支付成功
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
          console.error(error);
        });
    },

    request: function(orderId) {
      var that = this;
      setTimeout(function() {

        var getOrder = new SFGetOrder({
          "orderId": orderId
        });
        getOrder
          .sendRequest()
          .done(function(data) {
            var order = data.content[0].basicInfo;
            if (order.orderStatus == 'AUDITING') {
              window.location.href = '/orderlist.html';
            } else {
              that.request.call(that, orderId);
            }
          })
          .fail(function(error) {
            that.request.call(that, orderId);
          })
      }, 1000);
    },

    ".viewOrder click": function(element, event) {
      var orderid = element.parent('div#operationarea')[0].dataset.orderid;
      window.open("/orderdetail.html?orderid=" + orderid,"_blank");
    },

    ".cancelOrder click": function(element, event) {
      var that = this;
      var orderid = element.parent('div#operationarea')[0].dataset.orderid;
      var cancelOrder = new SFCancelOrder({"orderId": orderid});

      cancelOrder
          .sendRequest()
          .done(function(data) {
            that.render();
          })
          .fail(function(error) {
            console.error(error);
          })
    },

    /**
     * [statsMap 状态对应界面词汇]
     * @type {Object}
     */
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