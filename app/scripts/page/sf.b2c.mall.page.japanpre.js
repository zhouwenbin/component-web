define(
  'sf.b2c.mall.page.japanpre',
  [
    'can',
    'jquery',
    'sf.b2c.mall.framework.comm',
    'sf.util',
    'sf.b2c.mall.business.config',
    'sf.b2c.mall.national.japanpre',
    'sf.b2c.mall.module.header',
    'sf.b2c.mall.module.footer'
  ],
  function(can, $, SFFrameworkComm, SFFn, SFBusiness,
           SFJapanpre) {

    SFFrameworkComm.register(1);
    SFFn.monitor();

    var japanPage = can.Control.extend({

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
        var that = this;
        new SFJapanpre(".header-search");
      }

    });

    new japanPage('#sf-b2c-mall-search');
  })
