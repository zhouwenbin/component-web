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
    'sf.b2c.mall.order.selectreceiveaddr',
    'sf.b2c.mall.order.vendor.info'
  ],

  function(can, $, SFFrameworkComm, Header, Footer, OrderSetp, SelectReceiveAddr, SFVendorInfo) {
    SFFrameworkComm.register(1);

    var order = can.Control.extend({

      init: function(element, options) {
        this.component = {};
        this.render();
      },

      render: function() {
        new Header('.sf-b2c-mall-header', {channel: '首页', isForceLogin: true});
        new Footer('.sf-b2c-mall-footer');

        //step
        new OrderSetp('.sf-b2c-mall-order-step', {
          "firststep": "active"
        });

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
