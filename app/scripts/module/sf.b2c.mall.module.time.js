define(
  'sf.b2c.mall.module.time', [
    'can',
    'jquery',
    'sf.b2c.mall.api.b2cmall.getProductHotDataList',
    'sf.b2c.mall.widget.slide',
    'imglazyload',
    'sf.b2c.mall.business.config',
    'sf.b2c.mall.framework.comm'
  ],
  function(can, $, SFGetProductHotDataList, SFSlide, SFImglazyload, SFConfig, SFFrameworkComm) {

    SFFrameworkComm.register(1);

    var time = can.Control.extend({

      init: function(element, options) {
        $(".img-lazyload").imglazyload();
        this.render(element);
      },

      render: function(element) {

        var that = this;

        // 调用后台接口 仅为获得服务器时间
        var itemIds = [];
        itemIds.push(1);

        var getProductHotDataList = new SFGetProductHotDataList({
          itemIds: JSON.stringify(itemIds)
        });

        getProductHotDataList
          .sendRequest()
          .done(function(data) {

            // 获得服务器时间
            var currentServerTime = getProductHotDataList.getServerTime();

            // 渲染倒计时
            that.rendTimeDistanceInfo(currentServerTime, element);
          })
          .fail(function(errorCode) {
            console.error(errorCode);
          })
      },

      /**
       * [rendTimeDistanceInfo 二次渲染倒计时信息]
       * @param  {[type]} currentServerTime 服务器时间
       * @param  {[type]} element mo
       * @return {[type]}
       */
      rendTimeDistanceInfo: function(currentServerTime, element) {

        var that = this;

        var timeNodeList = element.find('.cms-src-timeinfo');

        var currentClientTime = new Date().getTime();
        var distance = currentServerTime - currentClientTime;

        that.interval = setInterval(function() {
          _.each(timeNodeList, function(timeNode) {

            var endTime = $(timeNode).attr('data-cms-endtime');

            var time = that.setCountDown(element.find(".cms-fill-timeinfo")[0], distance, endTime);
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

        // 3天内显示倒计时，3天外显示即将开始 其他显示活动结束
        if (leftTime > 0 && leftTime < 259200000) {
          var leftsecond = parseInt(leftTime / 1000);
          var day1 = Math.floor(leftsecond / (60 * 60 * 24));
          var hour = Math.floor((leftsecond - day1 * 24 * 60 * 60) / 3600);
          var minute = Math.floor((leftsecond - day1 * 24 * 60 * 60 - hour * 3600) / 60);
          var second = Math.floor(leftsecond - day1 * 24 * 60 * 60 - hour * 3600 - minute * 60);
          timeNode.innerHTML = '<span class="icon icon56"></span>仅剩:<span class="text-error">' + day1 + "天" + hour + "小时" + minute + "分" + second + "秒</span>";
        } else if (leftTime > 259200000) {
          timeNode.innerHTML = '<span class="icon icon56"></span>活动即将开始';
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