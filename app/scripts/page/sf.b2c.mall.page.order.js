'use strict';

require(
  [
    'can',
    'jquery',
    'sf.b2c.mall.component.header',
    'sf.b2c.mall.component.footer',
    'sf.b2c.mall.order.step',
    'sf.b2c.mall.order.selectreceiveperson',
    'sf.b2c.mall.order.selectreceiveaddr',
    'sf.b2c.mall.order.iteminfo'
  ],

  function(can, $, Header, Footer, OrderSetp, SelectReceivePerson, SelectReceiveAddr, ItemInfo) {

    var order = can.Control.extend({

      init: function(element, options) {
        this.render();
      },

      render: function() {
        new Header('.sf-b2c-mall-header');
        new Footer('.sf-b2c-mall-footer');

        //step
        new OrderSetp('.sf-b2c-mall-order-step');

        new SelectReceivePerson('.sf-b2c-mall-order-selectReceivePerson');

        new SelectReceiveAddr('.sf-b2c-mall-order-selectReceiveAddress');

        new ItemInfo('.sf-b2c-mall-order-itemInfo');
      },

      supplement: function() {

      }
    });

    new order('#order');
  });