define(
  'sf.b2c.mall.page.search',
  [
    'can',
    'jquery',
    'sf.b2c.mall.framework.comm',
    'sf.util',
    'sf.b2c.mall.business.config',
    'sf.b2c.mall.component.recommendProducts',
    'sf.b2c.mall.component.search',
    'sf.b2c.mall.module.footer'
  ],
  function(can, $, SFFrameworkComm, SFFn, SFBusiness,
           SFRecommendProducts, SFSearch, SFFooter) {

    SFFrameworkComm.register(1);
    SFFn.monitor();
    var searchPage = can.Control.extend({

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
        new SFSearch('#sf-b2c-mall-search');
      }

    });

    new searchPage('#sf-b2c-mall-search');
  })
