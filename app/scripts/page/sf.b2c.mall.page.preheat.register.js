'use strict';
define([
  'can',
  'jquery',
  'sf.b2c.mall.framework.comm',
  'sf.b2c.mall.center.register',
  'vendor.jquery.jcountdown',
  'sf.b2c.mall.api.user.getBirthInfo'
],function(can,$, SFFrameworkComm, SFRegister, jcountdown,SFGetBirthInfo){
  SFFrameworkComm.register(1);

  var register = can.Control.extend({

    init:function(){
      this.component = {};
      this.component.getBirthInfo = new SFGetBirthInfo();
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

      $(function() {
        for (var b = new Date, i = b.getFullYear() + "/" + (b.getMonth() + 1) + "/" + (b.getDate() + 1) + " " + b.getHours() + ":" + b.getMinutes() + ":" + b.getSeconds(), e = b.getFullYear() + 1 + "/" + (b.getMonth() + 1) + "/" + b.getDate() + " " + b.getHours() + ":" + b.getMinutes() + ":" + b.getSeconds(), h = b.getFullYear() + 1E4 + "/" + (b.getMonth() + 1) + "/" + b.getDate() + " " + b.getHours() + ":" + b.getMinutes() + ":" + b.getSeconds(), b = -b.getTimezoneOffset() / 60, j = [{timeText: i,timeZone: b,style: "flip",color: "white",width: 0,textGroupSpace: 15,textSpace: 0,reflection: !1,reflectionOpacity: 10,reflectionBlur: 0,dayTextNumber: 3,displayDay: !1,displayHour: !0,displayMinute: !0,displaySecond: !0,displayLabel: !0,onFinish: function() {
          }}, {timeText: e,timeZone: b,style: "slide",color: "black",width: 0,textGroupSpace: 15,textSpace: 0,reflection: !1,reflectionOpacity: 10,reflectionBlur: 0,dayTextNumber: 3,displayDay: !0,displayHour: !0,displayMinute: !0,displaySecond: !0,displayLabel: !0,onFinish: function() {
          }}], i = $("#countcontent"), e = $("#countcontent>.page"), h = 0; h < j.length - 1; h++) {
          var b = j[h], k = e.clone();
          k.children(".countdown").jCountdown(b);
          i.append(k)
        }
      });

    },

    '.sf-in-order click':function(ele,event){
      event && event.preventDefault();
      this.component.register = new SFRegister('.sf-b2c-mall-register');
    }

  });

  window.name = 'sfht.com';
  new register('#content');

});