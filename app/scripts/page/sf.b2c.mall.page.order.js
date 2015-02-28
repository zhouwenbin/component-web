'use strict';

define(
  'sf.b2c.mall.page.order',
  [
    'can',
    'jquery',
    'sf.b2c.mall.framework.comm',
    'sf.b2c.mall.component.header',
    'sf.b2c.mall.component.footer',
    'sf.b2c.mall.order.step',
    'sf.b2c.mall.order.selectreceiveperson',
    'sf.b2c.mall.order.selectreceiveaddr',
    'sf.b2c.mall.order.iteminfo',
    'sf.b2c.mall.order.vendor.info',
    'sf.b2c.mall.business.config'
  ],

  function(can, $, SFFrameworkComm, Header, Footer, OrderSetp, SelectReceivePerson, SelectReceiveAddr, ItemInfo, SFVendorInfo) {
    SFFrameworkComm.register(1);

    var order = can.Control.extend({

      init: function(element, options) {
        this.component = {};
        this.render();
      },

      render: function() {
        new Header('.sf-b2c-mall-header', {
          isForceLogin: true
        });
        new Footer('.sf-b2c-mall-footer');

        //step
        new OrderSetp('.sf-b2c-mall-order-step', {
          "firststep": "active"
        });

        this.component.selectReceivePerson = new SelectReceivePerson('.sf-b2c-mall-order-selectReceivePerson');

        this.component.selectReceiveAddr = new SelectReceiveAddr('.sf-b2c-mall-order-selectReceiveAddress');

        this.component.sfvendorinfo = new SFVendorInfo('.sf-b2c-mall-order-vendor-info');

        new ItemInfo('.sf-b2c-mall-order-itemInfo', {
          vendorinfo: this.component.sfvendorinfo,
          selectReceivePerson: this.component.selectReceivePerson,
          selectReceiveAddr: this.component.selectReceiveAddr
        });
      },

      supplement: function() {

      }
    });

    new order('#order');
  });