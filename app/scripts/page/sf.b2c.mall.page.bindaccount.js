'use strict';

define(
  'sf.sf.b2c.mall.page.bindaccount',

  [
    'jquery',
    'can',
    'sf.b2c.mall.framework.comm',
    'sf.b2c.mall.component.bindaccount',
    'sf.b2c.mall.business.config'
  ],

  function ($, can, SFFrameworkComm, SFBindAccount) {
    SFFrameworkComm.register(1);

    var bindaccount = can.Control.extend({


      init:function(){
        this.render();
        this.supplement();
      },

      render:function(){
        new SFBindAccount('body');
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

    new bindaccount('body');
  });