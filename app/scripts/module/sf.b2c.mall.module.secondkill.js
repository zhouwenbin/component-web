'use strict';

define(
  'sf.b2c.mall.module.secondkill', [
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

    var activeDay = "";
    var activeTime = "";

    var deadTime = can.Control.extend({

      init: function(element, options) {
        var currentTime = new Date();
        var format = 'YYYYMMDDHHmmss';

        var formatTime = moment(currentTime).format(format);
        var day = formatTime.substring(0, 8) + '000000';

        this.activeDay(day);

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
          // 1激活选中天
          //  1、隐藏其他天
          $('.cms-src-dayline').removeClass("active");
          //  2、显示该天
          $(targetElement.target).addClass("active");

          // 2显示产品
          //  1、隐藏其他天的产品
          // $(".daylinetarget*").hide();
          $("div[class*='daylinetarget']").hide();

          //  2、显示该天的产品
          activeDay = $(targetElement.target).attr('data-daylinestart');
          var dayProducts = $(".daylinetarget" + activeDay);
          dayProducts.show();

          var hours = dayProducts.find(".cms-src-hourline");
          _.each(hours, function(item) {
            if ($(item).attr('data-hourlinestart') <= activeDay && activeDay < $(item).attr('data-hourlineend')) {
              $(item).addClass('active');
              activeTime = $(item).attr('data-hourlinestart');
              $('.hourlinetarget' + activeDay + activeTime).show();

              that.setTimecount($('.hourlinetarget' + activeDay + activeTime));
              that.setPrice($('.hourlinetarget' + activeDay + activeTime));
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
        _.each(dayList, function(item) {
          if ($(item).attr('data-daylinestart') <= day && day < $(item).attr('data-daylineend')) {
            $(item).addClass('active');
            hasActived = true;
            activeDay = $(item).attr('data-daylinestart');

            that.activeTime($(".daylinetarget" + activeDay))
          }
        })
      },

      activeTime: function(dayProducts) {
        var that = this;
        var hours = dayProducts.find(".cms-src-hourline");
        _.each(hours, function(item) {
          if ($(item).attr('data-hourlinestart') <= activeDay && activeDay < $(item).attr('data-hourlineend')) {
            $(item).addClass('active');
            activeTime = $(item).attr('data-hourlinestart');
            $('.hourlinetarget' + activeDay + activeTime).show();

            that.setTimecount($('.hourlinetarget' + activeDay + activeTime));
            that.setPrice($('.hourlinetarget' + activeDay + activeTime));
          }
        })
      },

      setTimecount: function(hourLineTarget) {
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
       * [fillPrice 填充价格]
       * @param  {[type]} element [description]
       * @param  {[type]} value   [description]
       * @return {[type]}         [description]
       */
      fillPrice: function(element, value) {
        var beginTime = element.attr('data-spiketime');
        if (new Date().getTime() < new Date(_str.trim(beginTime) - 0).getTime()){
          element.find(".cms-fill-spikeinfo").html('<div class="mask"></div><span>未开始</span>');
          return false;
        }

        // 做售空处理
        if (value.soldOut) {
          element.find(".cms-fill-spikeinfo").html('<div class="mask"></div><span>已售完</span>');
          return false;
        }

        var spikeprice = element.attr('data-spikeprice');
        if (spikeprice < value.sellingPrice) {
          element.find(".cms-fill-spikeinfo").html('<div class="mask"></div><span>秒杀已结束<br>优惠价继续</span>');
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