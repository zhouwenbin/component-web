/**
 * @description  为前端生成的页面添加header模块
 */

define(
  'sf.b2c.mall.module.footer', [
    'can',
    'jquery',
    'sf.b2c.mall.framework.comm',
    'sf.b2c.mall.component.footer',
    'sf.b2c.mall.business.config'
  ],
  function(can, $, SFFrameworkComm, SFFooter, SFBiz) {

    SFFrameworkComm.register(1);

    var Footer = can.Control.extend({

      init: function(element, options) {
        var component = new SFFooter('.sf-b2c-mall-footer');
        this.render();
      },

      render: function(element) {
        //----------回到顶部-------------//
        $(window).scroll(function(){
          if($(window).scrollTop() > window.innerheight){
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

    var footer = new Footer();
  });