'use strict';

define(
  'sf.b2c.mall.page.order', [
    'can',
    'jquery',
    'sf.b2c.mall.framework.comm',
    'sf.b2c.mall.order.selectreceiveaddr',
    'sf.b2c.mall.order.vendor.info'

  ],

  function(can, $, SFFrameworkComm, SelectReceiveAddr, SFVendorInfo) {
    SFFrameworkComm.register(1);

    var order = can.Control.extend({

      init: function(element, options) {
        this.component = {};
        this.render();
      },

      render: function() {

        this.component.sfvendorinfo = new SFVendorInfo('.sf-b2c-mall-order-vendor-info');
        new SelectReceiveAddr('.sf-b2c-mall-order-selectReceiveAddress', {
          vendorinfo: this.component.sfvendorinfo
        });

      },

      supplement: function() {

      }
    });

    new order('#order');
  });