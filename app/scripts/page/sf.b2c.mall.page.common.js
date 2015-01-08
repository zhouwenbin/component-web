'use strict';

define('sf.b2c.mall.page.common',
  [
    'can',
    'jquery',
    'sf.b2c.mall.framework.comm',
    'sf.b2c.mall.component.header',
    'sf.b2c.mall.component.footer'
  ],

  function(can, $, SFFrameworkComm, Header, Footer) {
    SFFrameworkComm.register(1);

    var common = can.Control.extend({

      init: function(element, options) {
        new Header('.sf-b2c-mall-header');
        new Footer('.sf-b2c-mall-footer');
      }
    });

    new common();
  });