'use strict';

define(
  'sf.b2c.mall.page.detailcomment',
  [
    'can',
    'jquery',
    'sf.b2c.mall.framework.comm',
    'sf.b2c.mall.product.breadscrumb',
    'sf.b2c.mall.product.detailcomment',
    'sf.util',
    'sf.b2c.mall.business.config'
  ],

  function(can, $, SFFrameworkComm, Header, DetailComment, SFFn) {
    SFFrameworkComm.register(1);

    var home = can.Control.extend({

      init: function(element, options) {
        this.component = {};

        this.render();
      },

      render: function() {

        new DetailComment('.sf-b2c-mall-detailcomment', {'itemId': 1});
      }
    });

    new home('.sf-b2c-mall-detailcomment');
  });