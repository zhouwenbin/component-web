'use strict';

define(
  'sf.b2c.mall.component.shoppingcart', [
    'can',
    'jquery',
    'sf.b2c.mall.framework.comm',
    'sf.util',
    'sf.b2c.mall.business.config',
    'sf.b2c.mall.api.shopcart.getCart',
    'sf.b2c.mall.api.shopcart.cleanInvalidItemsInCart',
    'sf.b2c.mall.api.shopcart.refreshCart',
    'sf.b2c.mall.api.shopcart.removeItemsInCart',
    'sf.b2c.mall.api.shopcart.updateItemNumInCart'
  ],
  function(can, $, SFFrameworkComm, SFFn, SFBusiness, SFGetCart, SFCleanInvalidItemsInCart, SFRefreshCart, SFRemoveItemsInCart, SFUpdateItemNumInCart) {

    SFFrameworkComm.register(1);
    SFFn.monitor();
    return can.Control.extend({

      /**
       * [init 初始化]
       */
      init: function() {
        this.render();
      },

      /**
       * [render 渲染]
       */
      render: function(element, options) {
        var that = this;
        var getCart = new SFGetCart();
        getCart.sendRequest()
          .done(function(data) {
            var html = can.view('templates/component/sf.b2c.mall.component.shoppingcart.mustache', that.options);
            this.element.append(html);

          }).fail(function() {

          })
      },

      /**
       * 重新渲染购物车页面
       */
      refreshCartList: function() {

      },
      /**
       * 清除购物车内无效商品
       */
      '#cleanInvalidItemsInCart click': function(element, event) {
        event && event.preventDefault();
      },

      /**
       * 全选
       */
      selectAll: function() {

      },

      /**
       * 单选
       */
      'radio[] click': function(element, options) {

      },
      /**
       * 删除单个商品或选中商品
       */
      deleteCartOrder: function() {

      },

      /**
       * 增加商品数量
       */
      '#btn-add click': function(element, event) {
        event && event.preventDefault();

      },

      /**
       * 减少商品数量
       */
      '#btn-add click': function(element, event) {
        event && event.preventDefault();
        
      },
      /**
       * 去结算
       */
      '#gotopay click': function(element, event) {
        event && event.preventDefault();

      }

    });

  })