'use strict';

require(
  [
    'can',
    'jquery',
    'underscore',
    'sf.b2c.mall.component.header',
    'sf.b2c.mall.component.footer',
    'sf.b2c.mall.component.limitedtimesale',
    'sf.b2c.mall.component.rapidseabuy',
    'sf.b2c.mall.api.b2cmall.getBanner',
    'sf.b2c.mall.widget.slide'
  ],

  function(can, $, _, Header, Footer, LimitedTimeSale, RapidSeaBuy, SFApiGetBanner, SFSlide) {

    var home = can.Control.extend({

      init: function(element, options) {
        this.component = {};

        this.render();
        this.supplement();
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
            // can.when(can.ajax({url: 'json/sf.b2c.mall.index.getBanner.json'}))
              .done(function (data) {
                var arr = [];
                _.each(data.value, function(value, key, list){
                  arr.push({
                    imgUrl: value.imgUrl,
                    url: value.link
                  });
                });
                that.component.slide = new SFSlide('.sf-b2c-mall-main-slider', {imgs: arr});
                // that.component.slide = new SFSlide('.sf-b2c-mall-main-slider', {
                //   imgs: [{
                //     imgUrl: 'img/banner1.jpg',
                //     url: 'http://www.google.com'
                //   }, {
                //     imgUrl: 'img/banner2.jpg',
                //     url: 'http://www.baidu.com'
                //   }]
                // });
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
        var serverRendered = _.find($('.sf-b2c-mall-limitedtimesale')[0].classList, function(item) {
          return item == 'serverRendered'
        })

        //作为参数传递进去
        new LimitedTimeSale('.sf-b2c-mall-limitedtimesale4Client', {'serverRendered': (typeof serverRendered != 'undefined')});

        new RapidSeaBuy('.sf-b2c-mall-rapidseabuy');
      },

      supplement: function() {

      }
    });

    new home('#content');
  });