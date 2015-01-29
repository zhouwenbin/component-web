'use strict';
define(
  'sf.b2c.mall.page.preheat.register',
  [
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
      this.render();

    },

    render:function(){
      this.component.getBirthInfo.sendRequest()
        .done(function(data){
            $('.total-user-num').text(data.curNum);
        })
        .fail(function(){

        })
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
        var getBirthInfo = new SFGetBirthInfo();
        getBirthInfo.sendRequest()
          .done(function(data){
              var time = getBirthInfo.getServerTime();
              for (
                // 目标时间
                  var t = new Date(data.onlineTime),

                  // 当前时间
                      b = new Date(time),

                      i = b.getFullYear()       + "/" + (t.getMonth() + 1) + "/" + t.getDate()  + " " + t.getHours()  + ":" + t.getMinutes() + ":" + t.getSeconds(),
                      e = b.getFullYear() + 1   + "/" + (b.getMonth() + 1) + "/" + b.getDate()  + " " + b.getHours()  + ":" + b.getMinutes() + ":" + b.getSeconds(),
                      h = b.getFullYear() + 1E4 + "/" + (b.getMonth() + 1) + "/" + b.getDate()  + " " + b.getHours()  + ":" + b.getMinutes() + ":" + b.getSeconds(),
                      b = -b.getTimezoneOffset() / 60,

                      j = [{
                        timeText: i,
                        timeZone: b,
                        style: "flip",
                        color: "white",
                        // hoursOnly: true,
                        width: 0,
                        textGroupSpace: 15,
                        textSpace: 0,
                        reflection: !1,
                        reflectionOpacity: 10,
                        reflectionBlur: 0,
                        // dayTextNumber: 0,
                        displayDay: !0,
                        displayHour: !0,
                        displayMinute: !0,
                        displaySecond: !1,
                        displayLabel: !0,
                        onFinish: function() {}
                      }, {
                        timeText: e,
                        timeZone: b,
                        style: "slide",
                        color: "black",
                        // hoursOnly: true,
                        width: 0,
                        textGroupSpace: 15,
                        textSpace: 0,
                        reflection: !1,
                        reflectionOpacity: 10,
                        reflectionBlur: 0,
                        // dayTextNumber: 0,
                        displayDay: !0,
                        displayHour: !0,
                        displayMinute: !0,
                        displaySecond: !1,
                        displayLabel: !0,
                        onFinish: function() {}
                      }], i = jQuery("#countcontent"), e = jQuery("#countcontent>.page"), h = 0; h < j.length - 1; h++) {
                var b = j[h],
                    k = e.clone();
                k.children(".countdown").jCountdown(b);
                i.append(k)
              }
          })
          .fail(function(){

          })


      });

    },

    '.sf-in-order click':function(ele,event){
      event && event.preventDefault();
      this.component.register = new SFRegister('.sf-b2c-mall-register');
    }

  });

  new register('#content');

});