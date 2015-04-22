/**
 * Created by 魏志强 on 2014/12/26.
 */
define(
  'sf.b2c.mall.page.404',
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
    var findNoPage = can.Control.extend({

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

    new findNoPage('#page-404');
  })
