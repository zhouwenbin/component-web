'use strict';

define(
  'sf.b2c.mall.page.detail',
  [
    'can',
    'jquery',
    'sf.b2c.mall.framework.comm',
    'sf.b2c.mall.component.header',
    'sf.b2c.mall.component.header.searchbox',
    'sf.b2c.mall.component.footer',
    'sf.b2c.mall.product.breadscrumb',
    'sf.b2c.mall.product.detailcontent',
    'sf.util',
    'sf.b2c.mall.business.config'
  ],

  function(can, $, SFFrameworkComm, Header, SFHeaderSearchBox, Footer, Breadscrumb, DetailContent, SFFn) {
    SFFrameworkComm.register(1);
    SFFn.monitor();

    var home = can.Control.extend({

      init: function(element, options) {
        this.component = {};

        this.render();
        this.supplement();
      },

      render: function() {
        new SFHeaderSearchBox(".header-search");
        var header = new Header('.sf-b2c-mall-header', {channel: '首页'});
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
        //----------回到顶部-------------//
        $(window).scroll(function(){
          if($(window).scrollTop() > 600){
            $(".btn-top").fadeIn(500);
          }else{
            $(".btn-top").fadeOut(500);
          }
        })

        $(".btn-top").click(function(){
          $("body,html").animate({scrollTop:0},1000);
          return false;
        });
      }
    });

    new home('#content');
  });