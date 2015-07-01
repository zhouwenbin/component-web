'use strict';

define(
  'sf.b2c.mall.page.orderlist', [
    'can',
    'jquery',
    'sf.b2c.mall.framework.comm',
    'sf.b2c.mall.component.header',
    'sf.b2c.mall.component.footer',
    'sf.b2c.mall.order.orderlistcontent',
    'sf.b2c.mall.component.centerleftside',
    'sf.b2c.mall.business.config'
  ],

  function(can, $, SFFrameworkComm, Header, Footer, SFOrderListContent, Centerleftside, SFBusiness) {

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
        var header = new Header('.sf-b2c-mall-header', {
          channel: '首页',
          isForceLogin: true
        });
        new Footer('.sf-b2c-mall-footer');
        new Centerleftside('.sf-b2c-mall-center-leftside');
        // 列表区域
        this.orderListComponent = new SFOrderListContent('.sf-b2c-mall-order-orderlist', {
          "searchValue": null
        });
      },

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


        if ($('.orderShow').hasClass('hide')) {
          var searchValue = _.str.trim($("#searchNoResultValue")[0].value);
        } else {
          var searchValue = _.str.trim($("#searchValue")[0].value);
        }

        if (_.str.isBlank(searchValue)) {
          searchValue = null;
        }

        if (null != searchValue && searchValue.length > 20) {
          alert("搜索关键词太长，请小于20个字符！");
          return false;
        }

        window.location.search = '?' + $.param({
          q: searchValue
        });

        // this.orderListComponent = new SFOrderListContent('.sf-b2c-mall-order-orderlist', {
        //   "searchValue": searchValue
        // });
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