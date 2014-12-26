'use strict';

define('sf.b2c.mall.order.orderlistcontent', [
  'can',
  'sf.b2c.mall.api.order.getOrderList',
  'sf.b2c.mall.adapter.pagination',
  'sf.b2c.mall.widget.pagination',
  'sf.helpers'
], function(can, SFGetOrderList, PaginationAdapter, Pagination, helpers) {
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

      var params = {
        "query": JSON.stringify({
          "status": null,
          "receiverName": null,
          "orderId": null
        })
      }

      var getOrderList = new SFGetOrderList(params);
      getOrderList
        .sendRequest()
        .done(function(data){debugger;
          that.options.orderlist = data.orders;

          _.each(that.options.orderlist, function(order){
            order.orderStatus = 'BUYING';

            order.goodsName = order.orderGoodsItemList[0].goodsName;
            order.spec = order.orderGoodsItemList[0].spec;
            order.optionHMTL = that.getOptionHTML(that.optionMap[order.orderStatus]);
            order.showRouter = that.routeMap[order.orderStatus];
            order.orderStatus = that.statsMap[order.orderStatus];
          })

          var html = can.view('templates/order/sf.b2c.mall.order.orderlist.mustache', that.options);
          that.element.html(html);

          that.options.page = new PaginationAdapter();
          that.options.page.format(data.page);
          new Pagination('.sf-b2c-mall-pagination', that.options);

        })
        .fail(function(error){
          console.error(error);
        })
    },

    getOptionHTML: function(operationsArr){debugger;
      var that = this;
      var result = [];
      _.each(operationsArr, function(option){
        if (that.optionHTML[option]){
          result.push(that.optionHTML[option]);
        }
      })

      return result.join("");
    },

    routeMap: {
      'SUBMITED':false,
      'AUTO_CANCEL':false,
      'USER_CANCEL':false,
      'AUDITING':false,
      'OPERATION_CANCEL':false,
      'BUYING':true,
      'BUYING_EXCEPTION':false,
      'WAIT_SHIPPING':true,
      'SHIPPING':true,
      'LOGISTICS_EXCEPTION':false,
      'SHIPPED':true,
      'COMPLETED':true
    },

    optionMap: {
      'SUBMITED':['NEEDPAY','INFO','CANCEL'],
      'AUTO_CANCEL':['INFO'],
      'USER_CANCEL':['INFO'],
      'AUDITING':['INFO','CANCEL'],
      'OPERATION_CANCEL':['INFO','CANCEL'],
      'BUYING':['INFO'],
      'BUYING_EXCEPTION':['INFO'],
      'WAIT_SHIPPING':['INFO'],
      'SHIPPING':['INFO','ROUTE'],
      'LOGISTICS_EXCEPTION':['INFO','ROUTE'],
      'SHIPPED':['INFO','ROUTE'],
      'COMPLETED':['INFO','ROUTE']
    },

    optionHTML: {
      "NEEDPAY": '<a href="#" class="btn btn-send">立即支付</a>',
      "INFO": '<a href="#" class="btn btn-add">查看订单</a>',
      "CANCEL": '<a href="#" class="btn btn-add">取消订单</a>'
    },

    statsMap: {
      'SUBMITED':'已提交',
      'AUTO_CANCEL':'自动取消',
      'USER_CANCEL':'用户取消',
      'AUDITING':'待审核',
      'OPERATION_CANCEL':'运营取消',
      'BUYING':'采购中',
      'BUYING_EXCEPTION':'采购异常',
      'WAIT_SHIPPING':'待发货',
      'SHIPPING':'发货中',
      'LOGISTICS_EXCEPTION':'物流异常',
      'SHIPPED':'已发货',
      'COMPLETED':'已完成'
    }

  });
})