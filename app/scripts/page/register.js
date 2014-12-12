'use strict';

sf.util.namespace('b2c.mall.launcher.register');

// 初始化route
can.route.ready();

sf.b2c.mall.launcher.register = can.Control.extend({

  init: function() {
    // 初始化header
    new sf.b2c.mall.header('.sf-b2c-mall-header');

    // 初始化footer
    new sf.b2c.mall.footer('.sf-b2c-mall-footer');

    new sf.b2c.mall.widget.nav.board('.sf-b2c-mall-nav', {
      data: {
        title: '用户注册'
      }
    });

    // 通过获取tag加载不同的模板
    var tag = can.route.attr('tag');
    new sf.b2c.mall.center.register.board('.sf-b2c-register');
  }
});

new sf.b2c.mall.launcher.register('#content');