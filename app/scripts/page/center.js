'use strict';

sf.util.namespace('b2c.mall.launcher.center');

can.route.ready();

sf.b2c.mall.launcher.center = can.Control.extend({

  init: function () {
    this.component = this.options.component || {};

    this.render();
  },

  render: function () {
    // 初始化header
    new sf.b2c.mall.header('.sf-b2c-mall-header');

    // 初始化footer
    new sf.b2c.mall.footer('.sf-b2c-mall-footer');

    // 初始化nav
    new sf.b2c.mall.component.nav.search('.sf-b2c-mall-nav');

    var breadscrumb = {
      main: '首页',
      mainLink: '/',
      sub: '账户管理'
    };
    new sf.b2c.mall.breadscrumb('.sf-b2c-mall-breadscrumb', {data: breadscrumb});

    this.component.nav =  new sf.b2c.mall.center.nav('.sf-b2c-mall-center-nav');

    new sf.b2c.mall.center.content('.sf-b2c-mall-center-content', this.component);
  }
});

new sf.b2c.mall.launcher.center();