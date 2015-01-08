'use strict';

define(
  [
    'can',
    'jquery',
    'sf.b2c.mall.framework.comm',
    'sf.b2c.mall.component.header',
    'sf.b2c.mall.component.footer',
    'sf.b2c.mall.order.step',
    'sf.b2c.mall.order.selectreceiveperson',
    'sf.b2c.mall.order.selectreceiveaddr',
    'sf.b2c.mall.order.iteminfo'
  ],

  function(can, $, SFFrameworkComm, Header, Footer, OrderSetp, SelectReceivePerson, SelectReceiveAddr, ItemInfo) {
    SFFrameworkComm.register(1);

    var order = can.Control.extend({

      init: function(element, options) {
        this.render();
      },

      render: function() {
        new Header('.sf-b2c-mall-header', {isForceLogin: true});
        new Footer('.sf-b2c-mall-footer');

        //step
        new OrderSetp('.sf-b2c-mall-order-step', {"firststep":"active"});

        new SelectReceivePerson('.sf-b2c-mall-order-selectReceivePerson');

        new SelectReceiveAddr('.sf-b2c-mall-order-selectReceiveAddress');

        new ItemInfo('.sf-b2c-mall-order-itemInfo');
      },

      supplement: function() {

      }
    });

    new order('#order');
  });