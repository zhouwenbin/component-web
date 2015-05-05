'use strict';

define(
  'sf.b2c.mall.page.naturalshow', [
    'can',
    'jquery',
    'fullPage',
    'sf.b2c.mall.framework.comm',
    'sf.util',
    'sf.b2c.mall.business.config'
  ],
  function(can, $, SFFullPage, SFFrameworkComm, SFFn, SFBusiness) {

    SFFrameworkComm.register(1);
    SFFn.monitor();
    var naturalShow = can.Control.extend({

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
        $('.nataral-show').fullpage({
          menu: true,
          navigation: false
        });
      }

    });

    new naturalShow('body');
  })