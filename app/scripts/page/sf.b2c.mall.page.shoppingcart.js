'use strict';

define(
  'sf.b2c.mall.page.shoppingcart',
  [
    'can',
    'jquery',
    'sf.b2c.mall.framework.comm',
    'sf.util',
    'sf.b2c.mall.business.config',
    'sf.b2c.mall.component.shoppingcart'
  ],
  function(can, $, SFFrameworkComm, SFFn, SFBusiness,SFShoppingCart) {

    SFFrameworkComm.register(1);
    SFFn.monitor();
    var shoppingCart = can.Control.extend({

      /**
       * [init 初始化]
       */
      init: function() {
        this.render();
      },

      /**
       * [render 渲染]
       */
      render: function() {
      	var that = this;

        new SFShoppingCart('.shopingcartpage');
  		}

    });

    new shoppingCart('.shopingcartpage');
  })
