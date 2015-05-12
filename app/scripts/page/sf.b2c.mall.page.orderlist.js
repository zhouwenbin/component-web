'use strict';

define(
  'sf.b2c.mall.page.orderlist',
  [
    'can',
    'jquery',
    'sf.b2c.mall.framework.comm',
    'sf.b2c.mall.component.header',
    'sf.b2c.mall.component.footer',
    'sf.b2c.mall.order.orderlistcontent',
    'sf.b2c.mall.business.config'
  ],

  function(can, $, SFFrameworkComm, Header, Footer, SFOrderListContent,SFBusiness) {

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
        new Header('.sf-b2c-mall-header', {isForceLogin: true});
        new Footer('.sf-b2c-mall-footer');

        // 搜索区域
        // var template = can.view.mustache(this.searchTemplate());
        // $('.sf-b2c-mall-order-orderlist-searcharea').html(template());

        // 列表区域
        this.orderListComponent = new SFOrderListContent('.sf-b2c-mall-order-orderlist', {
          "searchValue": null
        });
      },

      /**
       * [searchTemplate 搜索区域模板]
       * @return {[string 模板字符串]}
       */
      // searchTemplate: function() {
      //   return '<div class="myorder-search"><input placeholder="输入订单号搜索" id="searchValue"/><button id="search">搜索</button></div>'       
      // },

      "{document} keydown": function(element, event) {
        var e = event || window.event,
          currKey = e.keyCode || e.which || e.charCode;
        if (currKey === 13) {
          return this.search()
        }
      },

      search: function() {
        //进行销毁
        if (this.orderListComponent) {
          this.orderListComponent.destroy();
        }

        var searchValue = _.str.trim($("#searchValue")[0].value);

        if (_.str.isBlank(searchValue)) {
          searchValue = null;
        }

        if (null != searchValue && searchValue.length > 20) {
          alert("搜索关键词太长，请小于20个字符！");
          return false;
        }

        this.orderListComponent = new SFOrderListContent('.sf-b2c-mall-order-orderlist', {
          "searchValue": searchValue
        });
      },

      /**
       * [description 点击搜索后执行动作]
       * @param  {[type]} element 元素
       * @param  {[type]} event 事件
       */
      '#search click': function(element, event) {
        return this.search();
      }
    });

    new orderList('.sf-b2c-mall-order-orderlist');
  });