<<<<<<< HEAD
'use strict';
define(
    'sf.b2c.mall.module.newpage', [
        'can',
        'jquery'
    ],
    function(can, $) {
        //功能：选中与当前页面的url相匹配的的li
        var pageSwitch = can.Control.extend({
            init: function(element) {
                var currentUrl = window.location.pathname;
                $(".cms-fill-nav li").each(function(limodule){
                    var urlValue = $(this).find("a").attr("href");
                    if(($(this).find("a").attr("href")).indexOf(currentUrl) > 0){
                        $(this).remove("active").addClass("active");
                    }
                });
            }
        })
        new pageSwitch();
=======
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
>>>>>>> master
    })