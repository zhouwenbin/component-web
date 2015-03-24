define(
  'sf.b2c.mall.module.time', [
    'can',
    'jquery',
    'sf.b2c.mall.api.b2cmall.getProductHotDataList',
    'sf.b2c.mall.widget.slide',
    'sf.b2c.mall.business.config',
    'sf.b2c.mall.framework.comm'
  ],
  function(can, $, SFGetProductHotDataList, SFSlide, SFConfig, SFFrameworkComm) {

    SFFrameworkComm.register(1);

    var time = can.Control.extend({

      init: function(element, options) {
        this.render(element);
      },

      render: function(element) {

        var that = this;

        var itemIds = [];
        itemIds.push(1);

        var getProductHotDataList = new SFGetProductHotDataList({
          itemIds: JSON.stringify(itemIds)
        });

        getProductHotDataList
          .sendRequest()
          .done(function(data) {

            var currentServerTime = getProductHotDataList.getServerTime();

            that.rendTimeDistanceInfo(currentServerTime, element);

          })
          .fail(function(errorCode) {
            console.error(errorCode);
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

        var timeNodeList = $('.cms-src-timeinfo');

        var currentClientTime = new Date().getTime();
        var distance = currentServerTime - currentClientTime;

        that.interval = setInterval(function() {
          _.each(timeNodeList, function(timeNode) {

            var endTime = $(timeNode).attr('data-cms-endtime');

            var time = that.setCountDown($(".cms-fill-timeinfo")[0], distance, endTime);
          })
        }, '1000');
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
          timeNode.innerHTML = '<span class="icon icon56"></span>仅剩:' + day1 + "天" + hour + "小时" + minute + "分" + second + "秒";
        } else {
          timeNode.innerHTML = '<span class="icon icon56"></span>活动已结束';
        }

        return leftTime;
      }

    })

    // 查到所有需要渲染价格的模块
    var timeModules = $('.cms-module-filltime');

    // 分别进行实例化
    _.each(timeModules, function(timeModule) {
      new time($(timeModule));
    });
  })