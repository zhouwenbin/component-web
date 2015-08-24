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

  function(can, $, SFFrameworkComm, Header, SFDetailcomment, SFFn) {
    SFFrameworkComm.register(1);

    var home = can.Control.extend({

      init: function(element, options) {
        this.component = {};

        this.render();
      },

      render: function() {

        if (!this.detailcomment) {
          this.detailcomment = new SFDetailcomment(null, {"itemId": 120});
        }

        this.detailcomment.show('.sf-b2c-mall-detailcomment');
      }
    });

    new home('.sf-b2c-mall-detailcomment');
  });