'use strict';

require(
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

    var order = can.Control.extend({

      init: function(element, options) {
        this.render();
      },

      render: function() {
        new Header('.sf-b2c-mall-header');
        new Footer('.sf-b2c-mall-footer');
        new SFOrderListContent('.sf-b2c-mall-order-orderlist');
      },

      supplement: function() {

      }
    });

    new order('#order');
  });