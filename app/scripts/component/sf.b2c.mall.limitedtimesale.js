'use strict';

define('sf.b2c.mall.limitedtimesale', ['can'], function(can) {
  return can.Control.extend({

    /**
     * [init description]
     * @param  {[type]} element
     * @param  {[type]} options
     * @return {[type]}
     */
    init: function(element, options) {
      var html = can.view('templates/component/sf.b2c.mall.limitedTimeSale.mustache')({});
      this.element.html(html);
      //this.supplement();
    },

    supplement: function(){
      var interval = 1000;
      window.setInterval(function(){this.showCountDown(2015,4,20,'divdown1');}, interval);
    },

    "#current click": function(){

    },

    "#future click": function(){

    },

    /**
     * [showCountDown 参考倒计时]
     * @param  {[type]} currentTime
     * @param  {[type]} destTime
     * @return {[type]}
     */
    showCountDown: function (currentTime,destTime) {
      var now = new Date();
      var endDate = new Date(year, month-1, day);
      var leftTime=endDate.getTime()-now.getTime();
      var leftsecond = parseInt(leftTime/1000);
      var day1=Math.floor(leftsecond/(60*60*24));
      var hour=Math.floor((leftsecond-day1*24*60*60)/3600);
      var minute=Math.floor((leftsecond-day1*24*60*60-hour*3600)/60);
      var second=Math.floor(leftsecond-day1*24*60*60-hour*3600-minute*60);
      var cc = document.getElementById(divname);
      return day1+"天"+hour+"小时"+minute+"分"+second+"秒";
    }

  });
})