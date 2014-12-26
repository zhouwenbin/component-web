'use strict';

require(
  [
    'can',
    'jquery',
    'sf.b2c.mall.component.header',
    'sf.b2c.mall.component.footer',
    'sf.b2c.mall.order.orderdetailcontent'
  ],

  function(can, $, Header, Footer, SFOrderDetailContent) {

    var order = can.Control.extend({

      init: function(element, options) {
        this.render();
      },

      render: function() {
        new Header('.sf-b2c-mall-header');
        new Footer('.sf-b2c-mall-footer');
        new SFOrderDetailContent('.sf-b2c-mall-orderdetail');
      },

      supplement: function() {

      }
    });

    new order('#order');
  });