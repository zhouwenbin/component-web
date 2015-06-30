'use strict';

define(
  'sf.b2c.mall.page.invitation', [
    'can',
    'jquery',
    'sf.b2c.mall.framework.comm',
    'sf.b2c.mall.component.header',
    'sf.b2c.mall.component.footer',
    'sf.b2c.mall.component.centerleftside',
    'sf.b2c.mall.center.invitationcontent',
    'sf.b2c.mall.business.config',
    'template_center_invitationshare'
  ],

  function(can, $, SFFrameworkComm, Header, Footer, Centerleftside, SFInvitationcontent, SFBusiness, template_center_invitationshare) {

    SFFrameworkComm.register(1);

    var orderList = can.Control.extend({

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

        var renderFn = can.mustache(template_center_invitationshare);
        this.options.html = renderFn(this.data);
        this.element.html(this.options.html);
      }
    });

    new orderList('.sf-b2c-mall-invitationshare');
  });