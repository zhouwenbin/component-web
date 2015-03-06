/**
 * Created by 张可 on 2015/3/5.
 */
define(
  'sf.b2c.mall.page.coupon',
  [
    'can',
    'jquery',
    'sf.b2c.mall.component.header',
    'sf.b2c.mall.component.footer',
    'sf.b2c.mall.center.coupon',
    'sf.b2c.mall.framework.comm',
    'sf.b2c.mall.business.config'
  ],
  function(can, $, Header, Footer, Coupon, SFFrameworkComm) {
    SFFrameworkComm.register(1);

    var coupon = can.Control.extend({

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
        new Header('.sf-b2c-mall-header', {isForceLogin: true});
        new Footer('.sf-b2c-mall-footer');
        new Coupon('.sf-b2c-mall-center-coupon');
      }
    });

    new coupon('.coupon');
  })
