'use strict';

define(
  [
    'can',
    'jquery',
    'sf.b2c.mall.framework.comm',
    'sf.b2c.mall.component.header',
    'sf.b2c.mall.component.footer',
    'sf.b2c.mall.product.breadscrumb',
    'sf.b2c.mall.product.detailcontent'
  ],

  function(can, $, SFFrameworkComm, Header, Footer, Breadscrumb, DetailContent) {
    SFFrameworkComm.register(1);

    var home = can.Control.extend({

      init: function(element, options) {
        this.component = {};

        this.render();
        this.supplement();
      },

      render: function() {

        var header = new Header('.sf-b2c-mall-header');
        new Footer('.sf-b2c-mall-footer');

        //详情页
        //看服务器端是否渲染了
        var serverRendered = _.str.include($('.sf-b2c-mall-detail-content')[0].className, 'serverRendered')

        //classlist IE不兼容
        // var serverRendered = _.find($('.sf-b2c-mall-detail-content')[0].className, function(item) {
        //   return item == 'serverRendered'
        // })

        //客户端渲染了 服务端就不要渲染了
        if (!serverRendered){
          //面包屑
          new Breadscrumb('.sf-b2c-mall-product-breadcrumb');
        }

        new DetailContent('.sf-b2c-mall-detail-content', {'serverRendered': serverRendered, 'header': header});

      },

      supplement: function() {
        // $('body').append('<iframe id="proxy" src="http://www.sfht.com/proxy.html" style="display:none;"></iframe>')
      }
    });

    window.name = 'sfht.com';
    new home('#content');
  });