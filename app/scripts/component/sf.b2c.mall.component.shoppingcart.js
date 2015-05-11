'use strict';

define(
  'sf.b2c.mall.component.shoppingcart', [
    'can',
    'jquery',
    'sf.b2c.mall.framework.comm',
    'sf.util',
    'sf.b2c.mall.business.config'
  ],
  function(can, $, SFFrameworkComm, SFFn, SFBusiness) {

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
      render: function() {
        var that = this;
      }

    });

  })