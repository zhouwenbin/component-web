define(
  'sf.b2c.mall.page.app',
  [
    'can',
    'jquery',
    'sf.b2c.mall.framework.comm',
    'sf.util',
    'sf.b2c.mall.component.header',
    'sf.b2c.mall.business.config'
  ],
  function(can, $, SFFrameworkComm, SFFn, Header, SFBusiness) {
    SFFrameworkComm.register(1);
    SFFn.monitor();

    var appPage = can.Control.extend({

      /**
       * [init 初始化]
       */
      init: function() {
        var header = new Header('.sf-b2c-mall-header', {
          channel: '首页',
          isForceLogin: false
        });
        
        this.render();
      },

      /**
       * [render 渲染]
       */
      render: function() {
        var that = this;
      }

    });

    new appPage();
  })
