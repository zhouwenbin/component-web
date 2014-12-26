'use strict';

define(
  'sf.b2c.mall.page.login',

  [
    'jquery',
    'can',
    'sf.b2c.mall.framework.comm',
    'sf.b2c.mall.component.login'
  ],

  function ($, can, SFFrameworkComm, SFLogin) {
    SFFrameworkComm.register(1)

    var login = can.Control.extend({


      init:function(){
        this.component = {};
        this.render();
        this.supplement();
      },

      render:function(){
        new SFLogin('body');
      },
      supplement:function(){
        //----------关闭注册弹窗-------------//
        $(".register .btn-close").on("click",function(){
          $(this).parents(".register").hide(300);
          $(".mask").hide();
          return false;
        });

        //----------注册页小章鱼特效-------------//
        $('.input-password').focus(function(){
          $(".icon34").animate({
            "top":-28
          },700);
        })
        $('.input-password').blur(function(){
          $(".icon34").animate({
            "top":-78
          },300)
              .animate({
                "top":-74
              },50)
              .animate({
                "top":-76
              },50);
        })
      }

    });

    new login('body');
  });