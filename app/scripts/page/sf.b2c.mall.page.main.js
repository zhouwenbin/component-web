'use strict';

define(
  'sf.b2c.mall.page.main',
  [
    'can',
    'jquery',
    'underscore',
    'sf.b2c.mall.framework.comm',
    'sf.b2c.mall.component.header',
    'sf.b2c.mall.component.footer',
    'sf.b2c.mall.component.freshfood',
    'sf.b2c.mall.component.limitedtimesale',
    'sf.b2c.mall.component.rapidseabuy',
    'sf.b2c.mall.api.b2cmall.getBanner',
    'sf.b2c.mall.widget.slide',
    'imglazyload',
    'sf.b2c.mall.business.config'
  ],

  function(can, $, _, SFFrameworkComm, Header, Footer, FreshFood, LimitedTimeSale, RapidSeaBuy, SFApiGetBanner, SFSlide, SFImglazyload, SFConfig) {
    SFFrameworkComm.register(1);

    var home = can.Control.extend({

      init: function(element, options) {
        this.component = {};

        this.render();
        this.supplement();

        $(".img-lazyload").imglazyload();
      },

      onLogin: function () {
        // @todo 登录之后的回调
      },

      renderMap: {
        'slide': function () {
          var $el = this.element.find('.sf-b2c-mall-main-slider.serverRendered');

          var that = this;
          if ($el.length === 0) {
            var request = new SFApiGetBanner();
            can.when(request.sendRequest())
              .done(function (data) {
                var arr = [];
                _.each(data.value, function(value, key, list){
                  arr.push({
                    imgUrl: value.imgUrl,
                    url: value.link
                  });
                });
                that.component.slide = new SFSlide('.sf-b2c-mall-main-slider', {imgs: arr});
              })
              .fail(function () {

              })
          }else{
            that.component.slide = new SFSlide('.sf-b2c-mall-main-slider');
          }
        }
      },

      render: function() {

        new Header('.sf-b2c-mall-header', {
          onLogin: _.bind(this.onLogin, this)
        });
        new Footer('.sf-b2c-mall-footer');

        this.renderMap.slide.call(this);

        //看服务器端是否渲染了
        // var serverRendered = _.find($('.sf-b2c-mall-limitedtimesale')[0].classList, function(item) {
        //   return item == 'serverRendered'
        // })
        var serverRendered = this.element.find('.sf-b2c-mall-limitedtimesale.serverRendered').length > 0 ? true : false

        //作为参数传递进去
        new FreshFood('.sf-b2c-mall-freshfoodlist');

        new LimitedTimeSale('.sf-b2c-mall-limitedtimesale', {'serverRendered': serverRendered});

        new RapidSeaBuy('.sf-b2c-mall-rapidseabuy');
      },

      supplement: function() {
        //----------回到顶部-------------//
        $(window).scroll(function(){
          if($(window).scrollTop() > 600){
            $(".btn-top").fadeIn(500);
          }else{
            $(".btn-top").fadeOut(500);
          }
        })

        $(".btn-top").click(function(){
          $("body,html").animate({scrollTop:0},1000);
          return false;
        });

//        var limitedTimeSaleTop = $('#LimitedTimeSale').offset().top;
//
//        $('#limitedTimeSaleLink').click(function(){
//          $("body,html").animate({scrollTop:limitedTimeSaleTop},1000);
//          return false;
//        })
      }
    });

    new home('#content');
  });