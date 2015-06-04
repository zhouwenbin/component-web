/**
 * @description  为前端生成的页面添加header模块
 */

define(
  'sf.b2c.mall.module.header', [
    'can',
    'jquery',
    'sf.b2c.mall.framework.comm',
    'sf.b2c.mall.component.header',
    'sf.b2c.mall.business.config'
  ],
  function(can, $, SFFrameworkComm, SFHeader, SFBiz) {

    SFFrameworkComm.register(1);

    var Header = can.Control.extend({

      init: function(element, options) {
        var component = new SFHeader('.sf-b2c-mall-header');
        window.component = component;
      },

      render: function(element) {

      }

    });

    var header = new Header();
  });