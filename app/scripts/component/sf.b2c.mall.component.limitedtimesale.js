'use strict';

define('sf.b2c.mall.component.limitedtimesale', [
    'can',
    'sf.b2c.mall.api.b2cmall.getTimeLimitedSaleInfoList',
    'sf.b2c.mall.adapter.limitedtimesale',
    'sf.b2c.mall.api.b2cmall.getProductHotDataList',
    'moment-zh-cn',
    'moment',
    'fastclick',
    'sf.util'
  ],
  function(can, SFGetTimeLimitedSaleInfoList, SFLimitedTimeSaleAdapter, SFGetProductHotDataList, momentLocale, moment, fastclick, SFFn) {

    if (SFFn.isMobile.any()) {
      fastclick.attach(document.body);
    }
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
        this.data = new SFLimitedTimeSaleAdapter({});
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

          //服务端渲染的时候要绑定这两个事件
          // $('#current')[0].onclick = function() {
          //   that.renderLimitedTimeSale('CURRENT');
          // };
          // $('#future')[0].onclick = function() {
          //   that.renderLimitedTimeSale('NEXT');
          // };

          that.supplement();
        } else {
          can.ajax({
              url: 'json/sf-b2c.mall.index.timelimitedsale.json'
            })
            .done(function(data) {
              that.data.attr('limitedtimesaleInfoList', data);
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
          // $('.sf-b2c-mall-limitedtimesale').css('display', 'inline');
          // $('.sf-b2c-mall-limitedtimesale4Client').css('display', 'none');
          // $('.sf-b2c-mall-limitedtimesale')[0].style.display = 'inline';
          // $('.sf-b2c-mall-limitedtimesale4Client')[0].style.display = 'none';

          //先提前渲染模板，后面触发数据变化
          that.data.format({limitedtimesaleInfoList: []});
          var html = can.view('templates/component/sf.b2c.mall.component.limitedtimesale.mustache', that.data, that.helpers);
          // $('.sf-b2c-mall-limitedtimesale4Client').html(html);
          that.element.find('.mb').append(html);

          var paramData = {
            itemIds: $('ul.product-list').eq(0).attr('data-itemids')
          };
          var getProductHotDataList = new SFGetProductHotDataList(paramData);
          //获得价格信息
          getProductHotDataList
            .sendRequest()
            .fail(function(error) {
              console.error(error);
            })
            .done(function(data) {
              //转化为map对象 方便后面直接取用，防止两层嵌套
              var priceMap = {};
              _.each(data.value, function(priceItem) {
                priceItem.discount = (priceItem.sellingPrice * 10 / priceItem.originPrice).toFixed(1);
                priceItem.originPrice = priceItem.originPrice / 100;
                priceItem.sellingPrice = priceItem.sellingPrice / 100;
                priceMap[priceItem.itemId] = priceItem;
              })

              //二次渲染价格信息
              that.renderPriceInfo(priceMap);

              //二次渲染倒计时信息
              //取服务器端的当前时间和当前时间取差值后传递给定时器
              var currentServerTime = getProductHotDataList.getServerTime();
              that.rendTimeDistanceInfo(currentServerTime, priceMap);

            })
        } else {
          //进行显示和隐藏全局控制
          // $('.sf-b2c-mall-limitedtimesale')[0].style.display = 'none';
          // $('.sf-b2c-mall-limitedtimesale4Client')[0].style.display = 'inline';

          can.ajax({
              url: 'json/sf-b2c.mall.index.timelimitedsalePrice.json'
            })
            .done(function(data) {
              that.data.formatPrice(that.data.attr('limitedtimesaleInfoList'), data, that.showCountDown);

              that.setTimeInterval();
            })
        }
      },

      /**
       * [renderPriceInfo 二次渲染价格信息]
       * @param  {[type]} priceMap 价格数据
       * @return {[type]}
       */
      renderPriceInfo: function(priceMap) {
        var priceNodeList = this.element.find('ul.product-list #price4ProductClient');

        // console.log('-------------renderPriceInfo-------------')
        //这里只渲染产品的价格，专题的价格服务器端渲染
        var template = can.view.mustache(this.priceTemplate());
        _.each(priceNodeList, function(priceNode) {
          if ($(priceNode).attr('data-contenttype')== 'PRODUCT') {
            var info = priceMap[$(priceNode).attr('data-itemid')];
            $(priceNode).html(template(info));
            if (info && info.soldOut) {
              $(priceNode).parent().find('.product-r1').append('<span class="icon icon24">售完</span>')
            };
          }
        })
      },

      /**
       * [rendTimeDistanceInfo 二次渲染倒计时信息]
       * @param  {[type]} currentServerTime 服务器时间
       * @param  {[type]} priceMap 价格数据中包含活动结束时间
       * @return {[type]}
       */
      rendTimeDistanceInfo: function(currentServerTime, priceMap) {
        var that = this;

        var timeNodeList = $('ul.product-list #timeAndNation4ProductClient');

        var currentClientTime = new Date().getTime();
        var distance = currentServerTime - currentClientTime;

        that.interval = setInterval(function() {
          _.each(timeNodeList, function(timeNode) {

            var endTimeMap = {
              'PRODUCT':$(timeNode).attr('data-itemid')? (priceMap[$(timeNode).attr('data-itemid')] && priceMap[$(timeNode).attr('data-itemid')].endTime) : '',
              'TOPIC': $(timeNode).attr('data-displayendtime')
            }
            var time = that.setCountDown(timeNode, distance, endTimeMap[$(timeNode).attr('data-contenttype')]);
            // if (time <= 0) {
            //   var $el = $(timeNode).closest('li').find('.product-r1');
            //   if($el.length > 0){
            //     if ($el.find('.mask').length == 0) {
            //       $el.append('<div class="mask"></div><span class="icon icon37">超时</span>');
            //     }
            //   }
            // }
          })
        }, '1000');
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
      setTimeInterval: function(currentServerTime, filter) {
        var that = this;

        var currentClientTime = new Date().getTime();
        var distance = currentServerTime - currentClientTime;

        if (filter == 'NEXT') {
          _.each(that.data.limitedtimesaleInfoList, function(item) {
            that.setBeginingTime(item, distance, item.displayStartTime);
          })
        }else{
          //消费后再创建，因为这个方法被多个地方调用
          if (that.interval) {
            // @author Michael.Lee
            // 暂时干掉[FRONT-58]
            clearInterval(that.interval);
          }

          //要进行销毁
          that.interval = setInterval(function() {
            _.each(that.data.limitedtimesaleInfoList, function(item) {
              if(item.soldOut){
                that.setSoldout(item)
              }else{
                that.setCountDown(item, distance, item.endTime);
              }
            })
          }, 1000);
        }
      },

      setSoldout: function (node) {
        if (node) {
          node.attr("抢购结束");
        } else {
          node.innerHTML = '<span class="icon icon4"></span>抢购结束';
        }
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
      "#current a click": function(element, event) {
        event && event.preventDefault();
        this.element.find('#future').removeClass('active');
        this.element.find('#current').addClass('active');
        var tag = this.element.find('.mb .product-list').get(0);
        if($(tag).find('li').length > 0){
          this.switchTab('CURRENT');
        }else{
          this.renderLimitedTimeSale('CURRENT');
        }
      },

      "#future a click": function(element, event) {
        event && event.preventDefault();
        this.element.find('#current').removeClass('active');
        this.element.find('#future').addClass('active');

        var tag = this.element.find('.mb .product-list').get(1);
        if($(tag).find('li').length > 0){
          this.switchTab('NEXT');
        }else{
          this.renderLimitedTimeSale('NEXT');
        }
      },

      /**
       * [renderLimitedTimeSale 点击事件后的一次性渲染]
       * @param  {[type]} filter 过滤条件
       * @return {[type]}
       */
      renderLimitedTimeSale: function(filter) {
        //进行显示和隐藏全局控制
        // $('.sf-b2c-mall-limitedtimesale')[0].style.display = 'none';
        // $('.sf-b2c-mall-limitedtimesale4Client')[0].style.display = 'inline';

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
            that.data.attr("limitedtimesaleInfoList", data.value);

            var paramData = {
              "itemIds": JSON.stringify(that.getItems(data.value))
            };

            var getProductHotDataList = new SFGetProductHotDataList(paramData);
            //获得价格信息
            getProductHotDataList
              .sendRequest()
              .done(function(priceData) {
                var serverTime = getProductHotDataList.getServerTime();
                that.data.formatPrice(that.data.attr('limitedtimesaleInfoList'), priceData.value);
                that.setTimeInterval(serverTime, filter);
                that.switchTab.call(that, filter);
              })
              .fail(function(error) {
                console.error(error);
              })
          })
      },

      switchTab: function(filter){
        var index = 0;
        if (filter == 'CURRENT') {
          index = 0;
        }else if(filter == 'NEXT'){
          index = 1;
        }

        var height = $(".product-list").eq(index).height();
        this.element.find(".mb").animate({
          left:-100 * index + "%"
        },500,function(){
          $(this).height(height);
        });

        // this.element.find(".mb").animate({
        //   left:-100 * index + "%",
        //   display:'none'
        // },500, function () {
        //   $('#'+filter).hide();
        // });
      },

      /**
       * [getItems 获得items数组]
       * @param  {[type]} data 总数据集
       * @return {[type]}
       */
      getItems: function(data) {
        var result = [];
        _.each(data, function(item) {
          if (item.homepageProductInfo && item.homepageProductInfo.itemId) {
            result.push(item.homepageProductInfo.itemId);
          }
        })
        return result;
      },

      setBeginingTime: function (timeNode, distance, startDate) {
        // endDate = 1429933141007;
        var leftTime = startDate - new Date().getTime() - distance;

        if (leftTime > 0) {
          // 12月26日（明天）12:00 开始
          var time = moment(startDate).format('MM月DD日')+'（'+ moment(startDate).fromNow() +'）'+moment(startDate).format('HH:mm:ss')+ ' 开始';

          if (timeNode.attr) {
            timeNode.attr('time', time);
          }else{
            timeNode.innerHTML = time;
          }
        }
      },

      /**
       * [showCountDown 参考倒计时]
       * @param  {[type]} currentTime
       * @param  {[type]} destTime
       * @return {[type]}
       */
      setCountDown: function(timeNode, distance, endDate) {

        var leftTime = endDate - new Date().getTime() - distance;

        if (leftTime > 0) {
          var leftsecond = parseInt(leftTime / 1000);
          var day1 = Math.floor(leftsecond / (60 * 60 * 24));
          var hour = Math.floor((leftsecond - day1 * 24 * 60 * 60) / 3600);
          var minute = Math.floor((leftsecond - day1 * 24 * 60 * 60 - hour * 3600) / 60);
          var second = Math.floor(leftsecond - day1 * 24 * 60 * 60 - hour * 3600 - minute * 60);
          if (timeNode.attr) {
            timeNode.attr("time", day1 + "天" + hour + "小时" + minute + "分" + second + "秒");
          } else {
            timeNode.innerHTML = '<span class="icon icon4"></span>剩余:'+day1 + "天" + hour + "小时" + minute + "分" + second + "秒";
          }
        }else{
          if (timeNode.attr) {
            timeNode.attr("抢购结束");
          } else {
            timeNode.innerHTML = '<span class="icon icon4"></span>抢购结束';
          }
        }

        return leftTime;
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
