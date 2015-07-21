'use strict';

define(
  'sf.b2c.mall.module.spike', [
    'can',
    'jquery',
    'moment',
    'underscore',
    'underscore.string',
    'sf.b2c.mall.api.b2cmall.getProductHotDataList',
    'sf.b2c.mall.business.config',
    'sf.b2c.mall.framework.comm'
  ],
  function(can, $, moment, _, _str, SFGetProductHotDataList, SFConfig, SFFrameworkComm) {

    SFFrameworkComm.register(1);

    // 选中的天和时间
    var activeDay = "20150101000000";//default activieDay
    var activeTime = "";

    var deadTime = can.Control.extend({

      init: function(element, options) {
        var currentTime = new Date();
        var format = 'YYYYMMDDHHmmss';

        var formatTime = moment(currentTime).format(format);
        var day = formatTime.substring(0, 8) + '000000';

        // 根据当前时间匹配活动的天和时间
        this.activeDay(day);

        // 绑定事件
        this.bindEvent();
      },

      bindEvent: function() {
        this.bindDayClick();
        this.bindTimeClick();
      },

      // 绑定日期事件
      bindDayClick: function() {
        var that = this;
        $(".cms-src-dayline").click(function(targetElement) {

          while (targetElement.target.tagName != "LI") {
            targetElement.target = targetElement.target.parentElement;
          }

          // 1激活选中天
          //  1、隐藏其他天
          $('.cms-src-dayline').removeClass("active");
          //  2、显示该天
          $(targetElement.target).addClass("active");

          // 2显示产品
          //  1、隐藏其他天的产品
          // $(".daylinetarget*").hide();
          $("[class*='daylinetarget']").hide();

          //  2、显示该天的产品
          activeDay = $(targetElement.target).attr('data-daylinestart');
          var dayProducts = $(".daylinetarget" + activeDay);
          dayProducts.show();

          // 获得当前时间
          var currentTime = new Date();
          var format = 'YYYYMMDDHHmmss';
          var formatTime = moment(currentTime).format(format);

          var hours = dayProducts.find(".cms-src-hourline");
          _.each(hours, function(item) {
            if ($(item).attr('data-hourlinestart') <= formatTime && formatTime < $(item).attr('data-hourlineend')) {
              $(item).addClass('active');
              activeTime = $(item).attr('data-hourlinestart');
              $('.hourlinetarget' + activeDay + activeTime).show();

              that.setTimecount($('.hourlinetarget' + activeDay + activeTime));
              that.setPrice($('.hourlinetarget' + activeDay + activeTime));
            } else {
              $(item).removeClass('active');
            }
          })

        });
      },

      // 绑定时间事件
      bindTimeClick: function() {
        var that = this;
        $(".cms-src-hourline").click(function(targetElement) {
          if (targetElement.target.tagName != "LI") {
            targetElement.target = targetElement.target.parentElement;
          }

          $(".cms-src-hourline").removeClass("active");
          $(targetElement.target).addClass("active");

          // $(".hourlinetarget*").hide();
          $("div[class*='hourlinetarget']").hide();

          var time = $(targetElement.target).attr('data-hourlinestart');
          var timeProducts = $(".hourlinetarget" + activeDay + time);
          timeProducts.show();
          that.setPrice($('.hourlinetarget' + activeDay + time));
        });
      },

      /**
       * [activeDay 当前日期要处于选中状态]
       * @param  {[type]} day [description]
       * @return {[type]}     [description]
       */
      activeDay: function(day) {
        var that = this;
        var hasActived = false;
        var dayList = $(".cms-src-dayline");
        if(dayList!=null&&dayList.length>0){
          _.each(dayList, function(item) {
            if ($(item).attr('data-daylinestart') <= day && day < $(item).attr('data-daylineend')) {
              $(item).addClass('active');
              hasActived = true;
              activeDay = $(item).attr('data-daylinestart');
              $(".daylinetarget" + activeDay).show();
              that.activeTime($(".daylinetarget" + activeDay));
            }
          })
        }else{
          $(".daylinetarget" + activeDay).show();
          that.activeTime($(".daylinetarget" + activeDay));
        }
      },

      /**
       * [activeDay 当前时间要处于选中状态]
       * @param  {[type]} dayProducts [description]
       * @return {[type]}     [description]
       */
      activeTime: function(dayProducts) {
        var that = this;
        var hours = dayProducts.find(".cms-src-hourline");

        // 获得当前时间
        var currentTime = new Date();
        var format = 'YYYYMMDDHHmmss';
        var formatTime = moment(currentTime).format(format);

        _.each(hours, function(item) {
          if ($(item).attr('data-hourlinestart') <= formatTime && formatTime < $(item).attr('data-hourlineend')) {
            $(item).addClass('active');
            activeTime = $(item).attr('data-hourlinestart');
            $('.hourlinetarget' + activeDay + activeTime).show();

            that.setTimecount($('.hourlinetarget' + activeDay + activeTime));
            that.setPrice($('.hourlinetarget' + activeDay + activeTime));
          } else {
            $(item).removeClass('active');
          }
        })
      },

      setTimecount: function(hourLineTarget) {
        // 当前不支持倒计时，先屏蔽
        return false;

        var that = this;

        var products = hourLineTarget.find("li");

        _.each(products, function(item) {
          setInterval(function() {
            that.timeCount(item, $(item).attr('data-spiketime'));
          }, 1000)
        });
      },

      setPrice: function(hourLineTarget) {
        var that = this;

        var products = hourLineTarget.find("li");

        var itemids = [];
        _.each(products, function(item) {
          itemids.push($(item).attr('data-itemid'));
        });

        can.when(this.requestItemHotDataList(itemids))
          .done(function(data) {

            // 如渲染价格
            that.renderPrice(data, hourLineTarget);

          })
          .fail(function(errorCode) {
            console.error(errorCode);
          })

      },

      /**
       * [renderPrice 渲染价格]
       * @param  {[type]} data [description]
       * @return {[type]}      [description]
       */
      renderPrice: function(data, element) {
        var that = this;

        _.each(data.value, function(value, key, list) {

          // 填充价格
          var $el = element.find('[data-itemid=' + value.itemId + ']');

          // 如果有重复的itemid，则进行容错
          if ($el.length && $el.length > 1) {
            _.each($el, function(item) {
              that.fillPrice($(item), value);
            })
          } else {
            that.fillPrice($el, value);
          }

        });
      },

      /**
       * [fillPrice 增加蒙层]
       * @param  {[type]} element [description]
       * @param  {[type]} value   [description]
       */
      fillPrice: function(element, value) {
        //秒杀未开始
        var beginTime = element.attr('data-spiketime');
        var endTime = element.attr('data-spiketimeend');
        if (new Date().getTime() < new Date(_str.trim(beginTime) - 0).getTime()) {
          element.find(".cms-fill-spikeinfo").html('<div class="mask"></div><span>未开始</span>');
          return false;
        }
        if (new Date().getTime() > new Date(_str.trim(endTime) - 0).getTime()) {
          element.find(".cms-fill-spikeinfo").html('<div class="mask"></div><span>秒杀已结束</span>');
          return false;
        }
        // 做售空处理
        if (value.soldOut) {
          element.find(".cms-fill-spikeinfo").html('<div class="mask"></div><span>已抢光</span>');
          return false;
        } else {
          element.find(".cms-fill-spikeinfo").html('');
          return false;
        }
      },

      requestItemHotDataList: function(itemIds) {
        var request = new SFGetProductHotDataList({
          itemIds: JSON.stringify(itemIds)
        });
        return request.sendRequest();
      },

      //deadTimeLine的时间格式为20150609211912，意思是2015年6月9日21点19分12秒
      timeCount: function(item, deadTimeLine) {
        var format = 'YYYYMMDDHHmmss';
        deadTimeLine = moment(new Date(_str.trim(deadTimeLine) - 0)).format(format)

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
        if (oft < 0) {
          $(item).find(".cms-fill-spikeinfo").text("已经结束");
          return;
        }

        //对于倒计时只按照小时分钟秒计算的,把残余的天数折算为小时数
        if (!($("[name='data-cms-day']") && $("[name='data-cms-day']").length > 0)) {
          ofh = Math.floor(oft / 3600);
          ofm = parseInt((oft % 3600) / 60);
          ofs = oft % 60;
        }

        //对于小时，分钟和秒的数字小于2位的补全两位
        if (ofh < 10) {
          ofh = "0" + ofh;
        }
        if (ofm < 10) {
          ofm = "0" + ofm;
        }
        if (ofs < 10) {
          ofs = "0" + ofs;
        }

        $(item).find(".cms-fill-spikeinfo").text(ofd + "天" + ofh + "时" + ofm + "分" + ofs + "秒");
      }
    });

    deadTime();
  })