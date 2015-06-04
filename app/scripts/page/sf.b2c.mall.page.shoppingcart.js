'use strict';

define(
  'sf.b2c.mall.page.shoppingcart', [
    'can',
    'jquery',
    'sf.b2c.mall.framework.comm',
    'sf.util',
    'sf.b2c.mall.business.config',
    'sf.b2c.mall.component.shoppingcart',
    'sf.b2c.mall.component.header',
    'sf.b2c.mall.component.footer'
  ],
  function(can, $, SFFrameworkComm, SFFn, SFBusiness, SFShoppingCart, Header, Footer) {

    SFFrameworkComm.register(1);
    SFFn.monitor();
    var shoppingCart = can.Control.extend({

      /**
       * [init 初始化]
       */
      init: function() {
        this.render();
        this.supplement();
      },

      /**
       * [render 渲染]
       */
      render: function() {
        var header = new Header('.sf-b2c-mall-header', {
          isForceLogin: true
        });
        var footer = new Footer('.sf-b2c-mall-footer');
        new SFShoppingCart('.shopingcartpage');
      },
      supplement: function() {
        $(window).scroll(function() {
          var car_height = $('.cart').height();
          var window_height = $(window).height();
          if ($(window).scrollTop() > 190 + car_height - window_height) {
            $('.cart-footer').removeClass('cart-footer-fixed');
          } else {
            $('.cart-footer').addClass('cart-footer-fixed');
          }
        });
      }

    });

    new shoppingCart('.shopingcartpage');
  })