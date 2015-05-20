define(
  'sf.b2c.mall.page.search',
  [
    'can',
    'jquery',
    'sf.b2c.mall.component.recommendProducts',
    'sf.b2c.mall.framework.comm',
    'sf.util',
    'sf.b2c.mall.business.config'
  ],
  function(can, $, SFRecommendProducts, SFFrameworkComm, SFFn, SFBusiness) {

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

        new SFRecommendProducts('.recommend');
      }

    });

    new searchPage('#page-404');
  })
