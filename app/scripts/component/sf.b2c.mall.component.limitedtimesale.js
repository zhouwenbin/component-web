'use strict';

define('sf.b2c.mall.component.limitedtimesale', [
    'can',
    'sf.b2c.mall.api.b2cmall.getTimeLimitedSaleInfoList',
    'sf.b2c.mall.adapter.limitedtimesale'
  ],
  function(can, SFGetTimeLimitedSaleInfoList, SFLimitedTimeSaleAdapter) {
    return can.Control.extend({

      helpers: {
        'sf-is-product': function(contentType, options) {

          if (contentType() == "PRODUCT") {
            return options.fn(options.contexts || this);
          } else {
            return options.inverse(options.contexts || this);
          }
        }
      },

      /**
       * [init description]
       * @param  {[type]} element
       * @param  {[type]} options
       * @return {[type]}
       */
      init: function(element, options) {
        this.render();
      },

      /**
       * [render 渲染逻辑]
       * 1、serverRendered=true服务端做了渲染，则前端只渲染价格和倒计时信息
       * 2、serverRendered=false服务端没有渲染，则前端渲染所有信息
       * @return {[type]}
       */
      render: function() {
        var that = this;

        if (this.options.serverRendered) {

          $('.sf-b2c-mall-limitedtimesale').style.display = 'inline';
          $('.sf-b2c-mall-limitedtimesale4Client').style.display = 'none';

          var skuList = null;

          that.supplement(skuList);
        } else {
          can.ajax({
              url: 'json/sf-b2c.mall.index.timelimitedsale.json'
            })
            .done(function(data) {
              that.options.limitedtimesaleInfoList = data;
              that.options = SFLimitedTimeSaleAdapter.format(that.options);
              that.supplement(that.getSkuList(data));
            })
        }
      },

      /**
       * [supplement 补充渲染价格信息（如果服务端没有渲染，则渲染所有信息）]
       * @param  {[type]} skuIdList
       * @return {[type]}
       */
      supplement: function(skuIdList) {
        var map = {
          true: function(html) {
            $('.sf-b2c-mall-limitedtimesale').html(html);
          },
          false: function(html) {
            $('.sf-b2c-mall-limitedtimesale4Client').html(html);
          }
        };

        var that = this;
        can.ajax({
            url: 'json/sf-b2c.mall.index.timelimitedsalePrice.json'
          })
          .done(function(data) {
            SFLimitedTimeSaleAdapter.formatPrice(that.options.limitedtimesaleInfoList, data, that.showCountDown);

            var html = can.view('templates/component/sf.b2c.mall.component.limitedtimesale.mustache', that.options, that.helpers);
            map[that.options.serverRendered].call(that, html);

            that.setTimeInterval();

          })
      },

      setTimeInterval: function() {
        var that = this;
        _.each(this.options.limitedtimesaleInfoList, function(item) {
          if (item.contentType == 'PRODUCT') {
            setInterval(function() {
              that.setCountDown(item, item.endTime);
            }, '1000');
          }
        })
      },

      /**
       * [getSkuList 获得列表，中间以逗号隔开]
       * @param  {[type]} data
       * @return {[type]}
       */
      getSkuList: function(data) {
        var result = "";
        _.each(data, function(item) {
          if (item.contentType == 'PRODUCT') {
            result += item.homePageProductInfo.skuId + ',';
          }
        })

        return result.substring(0, result.length - 1);
      },

      /**
       * [description TODO 等接口下来后要和下面的点击方法合并重构]
       * @return {[type]}
       */
      "#current click": function() {
        var that = this;

        can.ajax({
            url: 'json/sf-b2c.mall.index.timelimitedsaleCurrent.json'
          })
          .done(function(data) {
            that.options.attr('limitedtimesaleInfoList', data);
            that.supplement(that.getSkuList(data));
          })
          .then(function() {
            can.ajax({
                url: 'json/sf-b2c.mall.index.timelimitedsalePrice.json'
              })
              .done(function(data) {
                SFLimitedTimeSaleAdapter.formatPrice(that.options.limitedtimesaleInfoList, data);
              })
          })
      },

      "#future click": function() {
        var that = this;
        can.ajax({
            url: 'json/sf-b2c.mall.index.timelimitedsaleFuture.json'
          })
          .done(function(data) {
            that.options.attr('limitedtimesaleInfoList', data);
            that.supplement(that.getSkuList(data));
          })
          .then(function() {
            can.ajax({
                url: 'json/sf-b2c.mall.index.timelimitedsalePrice.json'
              })
              .done(function(data) {
                SFLimitedTimeSaleAdapter.formatPrice(that.options.limitedtimesaleInfoList, data);
              })
          })
      },

      /**
       * [showCountDown 参考倒计时]
       * @param  {[type]} currentTime
       * @param  {[type]} destTime
       * @return {[type]}
       */
      setCountDown: function(item, endDate) {
        var now = new Date();
        var leftTime = endDate - now.getTime();
        var leftsecond = parseInt(leftTime / 1000);
        var day1 = Math.floor(leftsecond / (60 * 60 * 24));
        var hour = Math.floor((leftsecond - day1 * 24 * 60 * 60) / 3600);
        var minute = Math.floor((leftsecond - day1 * 24 * 60 * 60 - hour * 3600) / 60);
        var second = Math.floor(leftsecond - day1 * 24 * 60 * 60 - hour * 3600 - minute * 60);
        item.attr('time', day1 + "天" + hour + "小时" + minute + "分" + second + "秒");
      }

    });
  })