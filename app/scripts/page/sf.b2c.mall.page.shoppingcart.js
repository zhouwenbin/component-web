'use strict';

define(
  'sf.b2c.mall.page.shoppingcart', [
    'can',
    'jquery',
    'sf.b2c.mall.framework.comm',
    'sf.util',
    'sf.b2c.mall.business.config',
    'sf.b2c.mall.component.shoppingcart'
  ],
  function(can, $, SFFrameworkComm, SFFn, SFBusiness, SFShoppingCart) {

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