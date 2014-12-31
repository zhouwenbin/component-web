'use strict';

define(
  [
    'can',
    'jquery',
    'sf.b2c.mall.framework.comm',
    'sf.b2c.mall.component.header',
    'sf.b2c.mall.component.footer',
    'sf.b2c.mall.order.orderlistcontent'
  ],

  function(can, $, SFFrameworkComm, Header, Footer, SFOrderListContent) {

    SFFrameworkComm.register(1);

    var orderList = can.Control.extend({

      /**
       * [init 初始化]
       * @param  {[type]} element 元素
       * @param  {[type]} options 选项
       */
      init: function(element, options) {
        this.render();
      },

      /**
       * [render 执行渲染]
       */
      render: function() {
        new Header('.sf-b2c-mall-header');
        new Footer('.sf-b2c-mall-footer');

        // 搜索区域
        var template = can.view.mustache(this.searchTemplate());
        $('.sf-b2c-mall-order-orderlist-searcharea').html(template());

        // 列表区域
        this.orderListComponent = new SFOrderListContent('.sf-b2c-mall-order-orderlist',{"searchValue":null});
      },

      /**
       * [searchTemplate 搜索区域模板]
       * @return {[string 模板字符串]}
       */
      searchTemplate: function() {
        return '<div class="orderlist-h clearfix">' +
          '<div class="orderlist-hc1 fl">' +
          '<h2>温馨提示：</h2>' +
          '<p>顺丰海淘试运营期间，未付款顺丰闪电送订单超过2小时将被自动取消，提交订单请尽快完成支付。</p>' +
          '</div>' +
          '<div class="orderlist-hc2 fr">' +
          '<input type="text" class="input" placeholder="输入订单号/收货人" id="searchValue"/>' +
          '<a href="#" class="btn btn-buy" id="search">搜索</a>' +
          '</div>' +
          '</div>'
      },

      /**
       * [description 点击搜索后执行动作]
       * @param  {[type]} element 元素
       * @param  {[type]} event 事件
       */
      '#search click': function(element, event) {
        //进行销毁
        if (this.orderListComponent){
          this.orderListComponent.destroy();
        }

        var searchValue = _.str.trim($("#searchValue")[0].value);

        if (_.str.isBlank(searchValue)) {
          searchValue = null;
        }

        this.orderListComponent = new SFOrderListContent('.sf-b2c-mall-order-orderlist', {"searchValue":searchValue});
      }
    });

    new orderList('#orderList');
  });