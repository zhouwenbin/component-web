'use strict';

define(
  'sf.b2c.mall.page.orderdetail',
  [
    'can',
    'jquery',
    'sf.b2c.mall.framework.comm',
    'sf.b2c.mall.component.header',
    'sf.b2c.mall.component.footer',
    'sf.b2c.mall.order.orderdetailcontent',
    'sf.b2c.mall.business.config'
  ],

  function(can, $, SFFrameworkComm, Header, Footer, SFOrderDetailContent) {
    SFFrameworkComm.register(1);

    var order = can.Control.extend({

      init: function(element, options) {
        this.render();
      },

      render: function() {
        var header = new Header('.sf-b2c-mall-header', {channel: '首页', isForceLogin: true});
        new Footer('.sf-b2c-mall-footer');
        new SFOrderDetailContent('.sf-b2c-mall-orderdetail');
      },

      supplement: function() {

      }
    });

    new order('#order');
  });