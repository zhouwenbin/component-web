'use strict';

define(
  'sf.b2c.mall.page.accountmanage', [
    'can',
    'jquery',
    'sf.b2c.mall.center.change.userinfo',
    'sf.b2c.mall.framework.comm',
    'sf.b2c.mall.business.config'
  ],
  function(can, $, ChangeUserInfo, SFFrameworkComm,SFBusiness) {
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

        new ChangeUserInfo('.sf-b2c-mall-account-manage');
      }


    });

    new accountmanage('.sf-b2c-mall-account-manage');
  })