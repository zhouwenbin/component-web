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
          that.supplement();
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
        var that = this;

        if (that.options.serverRendered) {

          //进行显示和隐藏全局控制
          $('.sf-b2c-mall-limitedtimesale')[0].style.display = 'inline';
          $('.sf-b2c-mall-limitedtimesale4Client')[0].style.display = 'none';

          //获得节点
          var ulNode = $('ul.product-list');
          var timeNodeList = $('ul.product-list #timeAndNation4ProductClient');
          var priceNodeList = $('ul.product-list #price4ProductClient');

          //获得数据列表，传递给ajax请求，方便一次性获得价格信息
          var skuIdList = ulNode.skuList;
          var topicIdList = ulNode.topicIdList;

          //获得价格信息
          can.ajax({
              url: 'json/sf-b2c.mall.index.timelimitedsalePrice.json'
            })
            .done(function(data) {

              //二次渲染价格信息
              var template = can.view.mustache(that.priceTemplate());
              _.each(priceNodeList, function(priceNode) {
                _.each(data, function(priceItem) {
                  if (priceItem.skuId == priceNode.attributes['skuid'].value) {
                    priceItem.contentType = "PRODUCT";
                    $(priceNode).html(template(priceItem));
                  }
                })
              })

              //二次渲染定时器信息
              //TODO 优化成一个定时器，并进行销毁
              var template = can.view.mustache(that.timeAndNationTemplate())
              _.each(timeNodeList, function(timeNode) {
                _.each(data, function(priceItem) {
                  if (priceItem.skuId == timeNode.attributes['skuid'].value) {

                    //进行数据转换
                    var priceItemMap = SFLimitedTimeSaleAdapter.format4SecondParse(priceItem);
                    $(timeNode).html(template(priceItemMap));

                    //设置定时器
                    that.interval = setInterval(function() {
                      that.setCountDown(priceItemMap);
                    }, '1000');
                  }
                })
              })
            })
        } else {
          //进行显示和隐藏全局控制
          $('.sf-b2c-mall-limitedtimesale')[0].style.display = 'none';
          $('.sf-b2c-mall-limitedtimesale4Client')[0].style.display = 'inline';

          can.ajax({
              url: 'json/sf-b2c.mall.index.timelimitedsalePrice.json'
            })
            .done(function(data) {
              SFLimitedTimeSaleAdapter.formatPrice(that.options.limitedtimesaleInfoList, data, that.showCountDown);

              var html = can.view('templates/component/sf.b2c.mall.component.limitedtimesale.mustache', that.options, that.helpers);
              $('.sf-b2c-mall-limitedtimesale4Client').html(html);

              that.setTimeInterval();
            })
        }
      },

      timeAndNationTemplate: function() {
        return '{{#sf-is-product contentType}}' +
          '<div class="product-r2c1 fl"><span class="icon icon4"></span>{{time}}</div>' +
          '<div class="product-r2c2 fr"><span class="icon icon5">' +
          '<img src={{homePageProductInfo.showNationalUrl}} alt="nationImg"></span></div>' +
          '{{/sf-is-product}}' +

          '{{^sf-is-product contentType}}' +
          '<div class="product-r2c1 fl"><span class="icon"></span></div>' +
          '<div class="product-r2c2 fr"><span class="icon icon5"></span></div>' +
          '{{/sf-is-product}}';
      },

      priceTemplate: function() {
        return '{{#sf-is-product contentType}}' +
          '<div class="product-r3c1 fl">' +
          '<strong>￥{{sellingPrice}}</strong>' +
          '<del>￥{{originPrice}}</del>' +
          '</div>' +
          '<div class="product-r3c2 fr">' +
          '<strong>{{discount}}</strong>折' +
          '</div>' +
          '{{/sf-is-product}}' +

          '{{^sf-is-product contentType}}' +
          '<div class="product-r3c1 fl">' +
          '<strong>￥{{homepageTopicInfo.price}}</strong>元起' +
          '</div>' +
          '<div class="product-r3c2 fr">' +
          '<strong>{{homepageTopicInfo.discount}}</strong>折起' +
          '</div>' +
          '{{/sf-is-product}}'
      },

      /**
       * [setTimeInterval 设置定时器]
       */
      setTimeInterval: function() {
        var that = this;

        //消费后再创建，因为这个方法被多个地方调用
        if (that.interval) {
          clearInterval(that.interval);
        }

        //要进行销毁
        that.interval = setInterval(function() {
          _.each(that.options.limitedtimesaleInfoList, function(item) {
            if (item.contentType == 'PRODUCT') {
              that.setCountDown(item);
            }
          })
        }, '1000');
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
       * [description 点击事件]
       * @return {[type]}
       */
      "#current click": function() {
        this.renderLimitedTimeSale('CURRENT');
      },

      "#future click": function() {
        this.renderLimitedTimeSale('NEXT');
      },

      renderLimitedTimeSale: function(filter) {
        var map = {
          'CURRENT': 'json/sf-b2c.mall.index.timelimitedsaleCurrent.json',
          'NEXT': 'json/sf-b2c.mall.index.timelimitedsaleFuture.json'
        }

        var that = this;
        can.ajax({
            url: map[filter]
          })
          .done(function(data) {
            //TODO 要放到done下一起触发绑定
            that.options.attr('limitedtimesaleInfoList', data);
            can.ajax({
                url: 'json/sf-b2c.mall.index.timelimitedsalePrice.json'
              })
              .done(function(data) {
                SFLimitedTimeSaleAdapter.formatPrice(that.options.limitedtimesaleInfoList, data);
                that.setTimeInterval();
              })
          })
      },

      /**
       * [showCountDown 参考倒计时]
       * @param  {[type]} currentTime
       * @param  {[type]} destTime
       * @return {[type]}
       */
      setCountDown: function(item) {
        var now = new Date();
        var endDate = item.endTime;
        var leftTime = endDate - now.getTime();
        var leftsecond = parseInt(leftTime / 1000);
        var day1 = Math.floor(leftsecond / (60 * 60 * 24));
        var hour = Math.floor((leftsecond - day1 * 24 * 60 * 60) / 3600);
        var minute = Math.floor((leftsecond - day1 * 24 * 60 * 60 - hour * 3600) / 60);
        var second = Math.floor(leftsecond - day1 * 24 * 60 * 60 - hour * 3600 - minute * 60);
        item.attr('time', day1 + "天" + hour + "小时" + minute + "分" + second + "秒");
      },

      /**
       * [destory 销毁动作]
       * @return {[type]}
       */
      destory: function() {
        clearInterval(this.interval);
      }

    });
  })