'use strict';

var launcher = sf.util.namespace('b2c.mall.launcher');

// 初始化route
can.route.ready();

launcher.findpassword = function () {

  // 初始化header
  new sf.b2c.mall.header('.sf-b2c-mall-header');

  // 初始化footer
  new sf.b2c.mall.footer('.sf-b2c-mall-footer');

  new sf.b2c.mall.widget.nav.board('.sf-b2c-mall-nav', {
    data: {
      title: '找回密码'
    }
  });

  // 通过获取tag加载不同的模板
  var tag = can.route.attr('tag');

  new sf.b2c.mall.findpassword('.sf-b2c-find-password-board', {tag: tag || 1});
};

launcher.findpassword();