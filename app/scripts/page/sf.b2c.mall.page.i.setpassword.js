'use strict';

define(
  'sf.b2c.mall.page.i.setpassword',

  [
    'jquery',
    'can',
    'sf.b2c.mall.framework.comm',
    'sf.b2c.mall.component.setpassword',
    'sf.b2c.mall.business.config'
  ],

  function ($, can, SFFrameworkComm, SFSetpassword) {
    SFFrameworkComm.register(1);

    var setpassword = can.Control.extend({


      init:function(){
        this.render();
        this.supplement();
      },

      render:function(){
        new SFSetpassword('body');
      },
      supplement:function(){
        //----------关闭注册弹窗-------------//
        $(".register .btn-close").on("click",function(){
          $(this).parents(".register").hide(300);
          $(".mask").hide();
          return false;
        });

        
      }

    });

    new setpassword('body');
  });