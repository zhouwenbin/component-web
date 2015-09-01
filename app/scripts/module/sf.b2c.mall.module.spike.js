'use strict';

define(
  'sf.b2c.mall.module.spike', [
    'can',
    'jquery',
    'moment',
    'underscore',
    'underscore.string',
    'sf.b2c.mall.api.b2cmall.getProductHotDataList',
    'sf.b2c.mall.framework.comm'
  ],
  function(can, $, moment, _, _str, SFGetProductHotDataList, SFFrameworkComm) {
    SFFrameworkComm.register(1);
    // 活动第一天（确保活动未开始活动也能够展示）
    var deadTime = can.Control.extend({
      init: function(element, options) {
        // 根据当前时间匹配活动的天和时间
        this.activeDay(this.getCurrentDay());
        // 绑定事件
        this.bindEvent();
      },
      /**
       * 获取当前时间
       * @return {[type]} [description]
       */
      getCurrentDay: function() {
        return moment(new Date()).format('YYYYMMDD000000');
      },
      /**
       * 获取当前时间
       * @return {[type]} [description]
       */
      getCurrentTime: function() {
        return moment(new Date()).format('YYYYMMDDHHmmss')
      },
      /**
       * activeDay 激活日期
       */
      activeDay: function(day) {
        var that = this;
        that.activeDayline(day);
        that.activeDaylineTarget(day);
      },
      /**
       * 计算日期轴选中
       * @param  {[type]} day [description]
       * @return {[type]}     [description]
       */
      activeDayline: function(day) {
        var that = this;
        var dayList = $(".cms-src-dayline");
        //处理日期轴
        if (dayList != null && dayList.length > 0) {
          _.each(dayList, function(item) {
            try {
              if ($(item).attr('data-daylinestart') <= day && day < $(item).attr('data-daylineend')) {
                $(item).addClass('active');
              } else {
                $(item).removeClass('active');
              }
            } catch (e) {
              console.info(e);
            }
          });
        }
      },
      /**
       * 激活日期目标
       */
      activeDaylineTarget: function(day) {
        var that = this;
        $("[class*='daylinetarget']").hide();
        var daylinetargets = $("[class*='daylinetarget']");
        if (daylinetargets != null && daylinetargets.length > 0) {
          _.each(daylinetargets, function(item) {
            try {
              if ($(item).attr('data-daylinestart') <= day && day < $(item).attr('data-daylineend')) {
                var activeDay = $(item).attr('data-daylinestart');
                $(".daylinetarget" + activeDay).show();
                that.activeTime(activeDay, that.getCurrentTime());
              }
            } catch (e) {
              console.info(e);
            }
          });
        }
      },
      /**
       * 激活时间轴及时间目标
       */
      activeTime: function(activeDay, time) {
        var that = this;
        $("[class*='hourlinetarget']").hide();
        var hours = $(".daylinetarget" + activeDay).find(".cms-src-hourline");
        _.each(hours, function(item) {
          try {
            if ($(item).attr('data-hourlinestart') <= time && time < $(item).attr('data-hourlineend')) {
              $(item).addClass('active');
              var activeTime = $(item).attr('data-hourlinestart');
              $('.hourlinetarget' + activeDay + activeTime).show();
              that.setPrice($('.hourlinetarget' + activeDay + activeTime));
            } else {
              $(item).removeClass('active');
            }
          } catch (e) {
            console.info(e);
          }
        });
      },
      /**
       * 用户事件绑定
       * @return {[type]} [description]
       */
      bindEvent: function() {
        this.bindDayClick();
        this.bindTimeClick();
      },
      /**
       * 绑定日期事件
       */
      bindDayClick: function() {
        var that = this;
        $(".cms-src-dayline").click(function(targetElement) {
          var srcElement = targetElement.target;
          while (srcElement.tagName != "LI") {
            srcElement = srcElement.parentElement;
          }
          that.activeDay($(srcElement).attr('data-daylinestart'));
        });
      },
      // 绑定时间事件
      bindTimeClick: function() {
        var that = this;
        $(".cms-src-hourline").click(function(targetElement) {
          var srcElement = targetElement.target;
          while (srcElement.tagName != "LI") {
            srcElement = targetElement.target.parentElement;
          }
          that.activeTime($(srcElement).attr("data-parentday"), $(srcElement).attr('data-hourlinestart'));
        });
      },
      /**
       * 设置价格
       */
      setPrice: function(hourLineTarget) {
        var that = this;
        var itemids = [];
        _.each(hourLineTarget.find(".cms-src-spikeinfo"), function(item) {
          try {
            itemids.push($(item).attr('data-itemid'));
          } catch (e) {
            console.info(e);
          }
        });
        can.when(this.requestItemHotDataList(itemids))
          .done(function(data) {
            that.renderPrice(data, hourLineTarget);
          })
          .fail(function(errorCode) {
            console.info(errorCode);
          });
      },
      /**
       * 渲染价格
       */
      renderPrice: function(data, element) {
        var that = this;
        _.each(data.value, function(value, key, list) {
          var $el = $("[data-itemid='" + value.itemId + "']")
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
       * 增加蒙层
       */
      fillPrice: function(element, value) {
        try {
          var beginTime = element.attr('data-spiketime');
          var endTime = element.attr('data-spiketimeend');
          if (new Date().getTime() < new Date(_str.trim(beginTime) - 0).getTime()) {
            element.find(".cms-fill-spikeinfo").html('<div class="mask"></div><span>未开始</span>');
            return false;
          }
          if (value.soldOut) {
            element.find(".cms-fill-spikeinfo").html('<div class="mask"></div><span>已抢光</span>'); //原价购
            return false;
          }
          if (new Date().getTime() > new Date(_str.trim(endTime) - 0).getTime()) {
            element.find(".cms-fill-spikeinfo").html('<div class="mask"></div><span>秒杀已结束</span>'); //原价购
            return false;
          }
          element.find(".cms-fill-spikeinfo").html('');
          return false;
        } catch (e) {
          console.info(e);
        }
      },
      /**
       * 获取价格
       */
      requestItemHotDataList: function(itemIds) {
        var request = new SFGetProductHotDataList({
          itemIds: JSON.stringify(itemIds)
        });
        return request.sendRequest();
      }
    });
    new deadTime();
  })