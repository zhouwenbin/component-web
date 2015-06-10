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
    //倒计时模块主要的两个属性：1,class为timer； 2，time-line属性，该属性的值为设置日期；
    var deadTime = can.Control.extend({

      init: function(element, options) {
          this.refeshTime(element);
      },

        //刷新倒计时组件的元素
        refeshTime: function(element){
            var textValue = this.timeCount(element.attr("time-line"));
            element.text(textValue);
        },

       //deadTimeLine的时间格式为20150609211912，意思是2015年6月9日21点19分12秒
        timeCount: function (deadTimeLine){
          var yearValue = deadTimeLine.substring(0,4);
          var monthValue = deadTimeLine.substring(4,6)
          var dayValue = deadTimeLine.substring(6,8)
          var hourValue = deadTimeLine.substring(8,10)
          var MinValue = deadTimeLine.substring(10,12)
          var SecValue = deadTimeLine.substring(12,14)
          var endDate=new Date(yearValue,monthValue-1,dayValue,hourValue,MinValue,SecValue);//年月日时分秒，月要减去1
          var now=new Date();
          var oft=Math.round((endDate-now)/1000);
          var ofd=parseInt(oft/3600/24);
          var ofh=parseInt((oft%(3600*24))/3600);
          var ofm=parseInt((oft%3600)/60);
          var ofs=oft%60;
          var timeInterval = '还有 ';
          if(ofd > 0){
              timeInterval += ofd+' 天 ';
          }

          if(ofs<0){
              timeInterval = "开抢";
              return timeInterval;
          }

          timeInterval = timeInterval +ofh+ ' 小时 ' +ofm+ ' 分钟 ' +ofs+ ' 秒';
          return timeInterval;
      }
    })

    // 查到所有需要倒计时的模块
    var timeModules = $('.timer');

    // 查找所有的倒计时组件并分别进行实例化
    setInterval(function(){
        _.each(timeModules, function(timeModule) {
            new deadTime($(timeModule));
        });
    },1000);
  })