'use strict';

define(
  'sf.b2c.mall.page.i.register',
  [
    'jquery',
    'can',
    'sf.b2c.mall.component.i.register',
    'sf.b2c.mall.framework.comm'
  ],
  function ($, can, SFRegister, SFFrameworkComm) {
    SFFrameworkComm.register(1)

    var Register = can.Control.extend({


      init:function(){
        this.component = {};
        this.render();
        this.supplement();
      },

      render:function(){
        var login = new SFRegister('body');
      },
      supplement:function(){

        //----------注册页小章鱼特效-------------//
        $('input').focus(function(){
          $(".icon34").animate({
            "top":-28
          },700);
        })
        $('input').blur(function(){
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

    new Register('body');
  });

