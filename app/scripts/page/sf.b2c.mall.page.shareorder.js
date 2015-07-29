'use strict';

define(
  'sf.b2c.mall.page.shareorder', [
    'can',
    'jquery',
    'sf.b2c.mall.framework.comm',
    'sf.b2c.mall.component.header',
    'sf.b2c.mall.component.footer',
    'sf.b2c.mall.component.centerleftside',
    'sf.b2c.mall.center.shareordercontent',
    'sf.b2c.mall.business.config'
  ],

  function(can, $, SFFrameworkComm, Header, Footer, Centerleftside, SFShareordercontent, SFBusiness) {

    SFFrameworkComm.register(1);

    var shareorder = can.Control.extend({

      /**
       * [init 初始化]
       * @param  {[type]} element 元素
       * @param  {[type]} options 选项
       */
      init: function(element, options) {
        this.render();
      },

      /**
       * [render 执行渲染]
       */
      render: function() {
        var header = new Header('.sf-b2c-mall-header', {
          channel: '首页',
          isForceLogin: true
        });
        new Footer('.sf-b2c-mall-footer');
        new Centerleftside('.sf-b2c-mall-center-leftside');

        new SFShareorder('.sf-b2c-mall-shareorder');
      }
    });

    new shareorder();
  });