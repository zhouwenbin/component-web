'use strict';

define(
'sf.b2c.mall.module.timecount', [
  'can',
  'jquery',
  'sf.b2c.mall.business.config',
  'sf.b2c.mall.framework.comm'
],
function(can, $, SFConfig, SFFrameworkComm) {

  SFFrameworkComm.register(1);

  
  //倒计时模块主要的两个属性：1,data-cms-module为timeclient表示倒计时模块； 2，name='data-cms-hour'，该属性为倒计时的时间位置；
  var deadTime = can.Control.extend({
      init: function(element, options) {
            this.refeshTime(element);
      },

      //刷新倒计时组件的元素
      refeshTime: function(element) {
         this.timeCount($(element).attr("time-a"));
      },

      //deadTimeLine的时间格式为20150609211912，意思是2015年6月9日21点19分12秒
      timeCount: function(deadTimeLine) {
        var yearValue = deadTimeLine.substring(0, 4);
        var monthValue = deadTimeLine.substring(4, 6);
        var dayValue = deadTimeLine.substring(6, 8);
        var hourValue = deadTimeLine.substring(8, 10);
        var MinValue = deadTimeLine.substring(10, 12);
        var SecValue = deadTimeLine.substring(12, 14);
        var endDate = new Date(yearValue, monthValue - 1, dayValue, hourValue, MinValue, SecValue); //年月日时分秒，月要减去1
        var now = new Date();
        var oft = Math.round((endDate - now) / 1000);
        var ofd = parseInt(oft / 3600 / 24);
        var ofh = parseInt((oft % (3600 * 24)) / 3600);
        var ofm = parseInt((oft % 3600) / 60);
        var ofs = oft % 60;

          //目标时间小于当前时间
          if(oft < 0  ){
              $("[name='data-cms-hour']").text("00");
              $("[name='data-cms-minute']").text("00");
              $("[name='data-cms-second']").text("00");
              return ;
          }

          //对于倒计时只按照小时分钟秒计算的,把残余的天数折算为小时数
          if(!($("[name='data-cms-day']") && $("[name='data-cms-day']").length > 0) ){
              ofh = Math.floor(oft/ 3600);
              ofm = parseInt((oft % 3600) / 60);
              ofs = oft % 60;
          }

          //对于小时，分钟和秒的数字小于2位的补全两位
          if(ofh < 10){
              ofh = "0" + ofh;
          }
          if(ofm < 10){
              ofm = "0" + ofm;
          }
          if(ofs < 10){
              ofs = "0" + ofs;
          }
          $("[name='data-cms-day']").text(ofd);
          $("[name='data-cms-hour']").text(ofh);
          $("[name='data-cms-minute']").text(ofm);
          $("[name='data-cms-second']").text(ofs);
      }
  });

    //进行实例化
    var timeCountModules = $("[data-cms-module='timeclient']");
    var clickEvent;
    _.each(timeCountModules,function(timeCountModule){
        $(timeCountModule) .click(function(){
            clickEvent = setInterval(function(){
                new  deadTime($("[data-cms-module='timeclient'][class='active']"));
            }, 1000);
        } );
    });

    //初始化当前的标签
    setInterval(function(){
        new  deadTime($("[data-cms-module='timeclient'][class='active']"));
    },1000)
})