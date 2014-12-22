'use strict';

sf.util.namespace('b2c.mall.launcher.common');

sf.b2c.mall.launcher.common = can.Control.extend({

  init: function () {
    new sf.b2c.mall.header('.sf-b2c-mall-header');
    new sf.b2c.mall.footer('.sf-b2c-mall-footer');
  }
})

new sf.b2c.mall.launcher.common('#content')