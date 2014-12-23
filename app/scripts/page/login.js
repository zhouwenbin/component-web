'use strict';

sf.util.namespace('b2c.mall.launcher.login');

sf.b2c.mall.launcher.login = can.Control.extend({

  init: function() {
    // 初始化header
    new sf.b2c.mall.header('.sf-b2c-mall-header');

    // 初始化footer
    new sf.b2c.mall.footer('.sf-b2c-mall-footer');

    new sf.b2c.mall.widget.nav.board('.sf-b2c-mall-nav', {
      data: {
        title: '欢迎登录'
      }
    });

    new sf.b2c.mall.login('.sf-b2c-mall-login');

    new sf.b2c.mall.component.adv('.sf-b2c-mall-login-adv', {
      tag: 'login'
    });
  }

});

new sf.b2c.mall.launcher.login('#content');