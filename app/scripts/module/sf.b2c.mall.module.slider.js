/**
 * Created by 魏志强 on 2014/12/26.
 */
define(
  'sf.b2c.mall.module.slider', [
    'can',
    'jquery',
     'underscore',
    'sf.b2c.mall.widget.slide'
  ],
  function(can, $, _, SFSlide) {

    var main = can.Control.extend({

      init: function(element) {
        this.render(element);


      },
      // renderMap: {
      //   'slide': function () {
      //     var $el = this.element.find('.sf-b2c-mall-main-slider.serverRendered');

      //     var that = this;
      //     if ($el.length === 0) {
      //       var request = new SFApiGetBanner();
      //       can.when(request.sendRequest())
      //         .done(function (data) {
      //           var arr = [];
      //           _.each(data.value, function(value, key, list){
      //             arr.push({
      //               imgUrl: value.imgUrl,
      //               url: value.link
      //             });
      //           });
      //           that.component.slide = new SFSlide('.sf-b2c-mall-main-slider', {imgs: arr});
      //         })
      //         .fail(function () {

      //         })
      //     }else{
      //       that.component.slide = new SFSlide('.sf-b2c-mall-main-slider');
      //     }
      //   }
      // },

      render: function(element) {
        new SFSlide(element);
      }
    })


      //一个界面支持多个轮播组件
      var sliderModules = $(".cms-module-slider");
      _.each(sliderModules, function(sliderModule) {
          new main($(sliderModule));
      });
  })