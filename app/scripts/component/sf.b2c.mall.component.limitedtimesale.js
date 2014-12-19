'use strict';

define('sf.b2c.mall.component.limitedtimesale', [
    'can',
    'sf.b2c.mall.api.b2cmall.getTimeLimitedSaleInfoList',
    'sf.b2c.mall.adapter.limitedtimesale',
    'sf.b2c.mall.api.b2cmall.getProductHotDataList'
  ],
  function(can, SFGetTimeLimitedSaleInfoList, SFLimitedTimeSaleAdapter, SFGetProductHotDataList) {
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
        var that = this;

        //服务端渲染的时候要绑定这两个事件
        $('#current')[0].onclick = function() {
          that.renderLimitedTimeSale('CURRENT');
        };
        $('#future')[0].onclick = function() {
          that.renderLimitedTimeSale('NEXT');
        };
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

          //先提前渲染模板，后面触发数据变化
          that.options.limitedtimesaleInfoList = [];
          that.options = SFLimitedTimeSaleAdapter.format(that.options);
          var html = can.view('templates/component/sf.b2c.mall.component.limitedtimesale.mustache', that.options, that.helpers);
          $('.sf-b2c-mall-limitedtimesale4Client').html(html);

          //获得节点
          var ulNode = $('ul.product-list');
          var timeNodeList = $('ul.product-list #timeAndNation4ProductClient');
          var priceNodeList = $('ul.product-list #price4ProductClient');

          //获得数据列表，传递给ajax请求，方便一次性获得价格信息
          var skuIdList = ulNode.skuList;
          var topicIdList = ulNode.topicIdList;

          var paramData = {
            "itemIds": ulNode[0].dataset.itemids
          };
          var getProductHotDataList = new SFGetProductHotDataList(paramData);
          //获得价格信息
          getProductHotDataList
            .sendRequest()
            .fail(function(error) {
              console.error(error);
            })
            .done(function(data) {
              var endTimeValue = data.value[0].endTime;

              //二次渲染价格信息
              //这里只渲染产品的价格，专题的价格服务器端渲染
              var template = can.view.mustache(that.priceTemplate());
              _.each(priceNodeList, function(priceNode) {
                if (priceNode.dataset.contenttype == 'PRODUCT') {
                  _.each(data.value, function(priceItem) {
                    if (priceItem.itemId == priceNode.dataset.itemid) {
                      priceItem.discount = priceItem.sellingPrice * 10 / priceItem.originPrice;
                      $(priceNode).html(template(priceItem));
                    }
                  })
                }
              })

              //取服务器端的当前时间和当前时间取差值后传递给定时期
              var currentServerTime = getProductHotDataList.getServerTime();
              var currentClientTime = new Date().getTime();
              var distance = currentServerTime - currentClientTime;

              that.interval = setInterval(function() {
                _.each(timeNodeList, function(timeNode) {
                  if (timeNode.dataset.contenttype == 'PRODUCT') {
                    _.each(data.value, function(priceItem) {
                      if (priceItem.itemId == timeNode.dataset.itemid) {
                        that.setCountDown(timeNode, distance, priceItem.endTime);
                      }
                    })
                  } else {
                    that.setCountDown(timeNode, distance, timeNode.dataset.displayendtime);
                  }
                })
              }, '1000');
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

              that.setTimeInterval();
            })
        }
      },

      priceTemplate: function() {
        return '<div class="product-r3c1 fl">' +
          '<strong>￥{{sellingPrice}}</strong>' +
          '<del>￥{{originPrice}}</del>' +
          '</div>' +
          '<div class="product-r3c2 fr">' +
          '<strong>{{discount}}</strong>折' +
          '</div>'
      },

      /**
       * [setTimeInterval 设置定时器]
       */
      setTimeInterval: function(currentServerTime) {
        var that = this;

        var currentClientTime = new Date().getTime();
        var distance = currentServerTime - currentClientTime;

        //消费后再创建，因为这个方法被多个地方调用
        if (that.interval) {
          clearInterval(that.interval);
        }

        //要进行销毁
        that.interval = setInterval(function() {
          _.each(that.options.limitedtimesaleInfoList, function(item) {
            that.setCountDown(item, distance, item.endTime);
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
        //进行显示和隐藏全局控制
        $('.sf-b2c-mall-limitedtimesale')[0].style.display = 'none';
        $('.sf-b2c-mall-limitedtimesale4Client')[0].style.display = 'inline';

        var that = this;

        var paramData = {
          "filter": filter,
          "size": 6
        };

        var getTimeLimitedSaleInfoList = new SFGetTimeLimitedSaleInfoList(paramData);

        getTimeLimitedSaleInfoList
          .sendRequest()
          .fail(function(error) {
            console.error(error);
          })
          .done(function(data) {
            that.options.attr("limitedtimesaleInfoList", data.value);

            var paramData = {
              "itemIds": JSON.stringify(that.getItems(data.value))
            };

            var getProductHotDataList = new SFGetProductHotDataList(paramData);
            //获得价格信息
            getProductHotDataList
              .sendRequest()
              .done(function(priceData) {
                var serverTime = getProductHotDataList.getServerTime();
                SFLimitedTimeSaleAdapter.formatPrice(that.options.limitedtimesaleInfoList, priceData.value);
                that.setTimeInterval(serverTime);
              })
              .fail(function(error) {
                console.error(error);
              })
          })
      },

      getItems: function(data) {
        var result = [];
        _.each(data, function(item) {
          if (item.homepageProductInfo && item.homepageProductInfo.itemId) {
            result.push(item.homepageProductInfo.itemId);
          }
        })
        return result;
      },

      /**
       * [showCountDown 参考倒计时]
       * @param  {[type]} currentTime
       * @param  {[type]} destTime
       * @return {[type]}
       */
      setCountDown: function(timeNode, distance, endDate) {
        var leftTime = endDate - new Date().getTime() + distance;
        var leftsecond = parseInt(leftTime / 1000);
        var day1 = Math.floor(leftsecond / (60 * 60 * 24));
        var hour = Math.floor((leftsecond - day1 * 24 * 60 * 60) / 3600);
        var minute = Math.floor((leftsecond - day1 * 24 * 60 * 60 - hour * 3600) / 60);
        var second = Math.floor(leftsecond - day1 * 24 * 60 * 60 - hour * 3600 - minute * 60);
        if (timeNode.attr) {
          timeNode.attr("time", day1 + "天" + hour + "小时" + minute + "分" + second + "秒");
        } else {
          timeNode.innerHTML = day1 + "天" + hour + "小时" + minute + "分" + second + "秒";
        }
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