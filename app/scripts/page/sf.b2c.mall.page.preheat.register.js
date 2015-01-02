'use strict';
define([
  'can',
  'jquery',
  'sf.b2c.mall.framework.comm',
  'sf.b2c.mall.center.register',
],function(can,$, SFFrameworkComm, SFRegister){
  SFFrameworkComm.register(1);

  var register = can.Control.extend({

    init:function(){
      this.component = {};
      this.component.register = new SFRegister('.sf-b2c-mall-register');
      this.supplement();
    },

    render:function(){

    },

    supplement:function(){
      //----------注册切换-------------//
      $(".register-h li").on("click",function(){
        var index=$(".register-h li").index(this);
        $(this).addClass("active").siblings().removeClass("active");
        $(".register-b").eq(index).addClass("active").siblings().removeClass("active");
        return false;
      });
      //----------关闭注册弹窗-------------//
      $(".register .btn-close").on("click",function(){
        $(this).parents(".register").hide(300);
        return false;
      });
      //----------回到顶部-------------//
      $(window).scroll(function(){
        if($(window).scrollTop() > 300){
          $(".m1").stop(true,false).animate({
            "height":495
          },700);
        }else{
          $(".m1").stop(true,false).animate({
            "height":0
          },700);
        }
      });

    },

    '.sf-in-order click':function(ele,event){
      event && event.preventDefault();
      this.component.register.paint();
    }

  });

  document.domain = 'sfht.com';
  new register('#content');

});