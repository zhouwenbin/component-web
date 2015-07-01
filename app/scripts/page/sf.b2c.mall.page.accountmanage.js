'use strict';

define(
  'sf.b2c.mall.page.accountmanage', [
    'can',
    'jquery',
    'sf.b2c.mall.center.change.userinfo',
    'sf.b2c.mall.framework.comm',
    'sf.b2c.mall.business.config',
    'sf.b2c.mall.component.centerleftside',
    'sf.b2c.mall.component.header',
    'sf.b2c.mall.component.footer'
  ],
  function(can, $, ChangeUserInfo, SFFrameworkComm,SFBusiness, Centerleftside, Header, Footer) {
    SFFrameworkComm.register(1);

    var accountmanage = can.Control.extend({

      /**
       * [init 初始化]
       */
      init: function() {
        this.render();
      },

      /**
       * [render 渲染]
       */
      render: function() {
        var header = new Header('.sf-b2c-mall-header', {
          channel: '首页',
          isForceLogin: true
        });
        new Footer('.sf-b2c-mall-footer');
        new Centerleftside('.sf-b2c-mall-center-leftside');
        new ChangeUserInfo('.sf-b2c-mall-account-manage');
      }


    });

    new accountmanage('.sf-b2c-mall-account-manage');
  })