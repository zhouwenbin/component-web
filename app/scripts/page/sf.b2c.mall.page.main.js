'use strict';

require(
  [
    'can',
    'jquery',
    'sf.b2c.mall.component.header',
    'sf.b2c.mall.component.footer',
    'sf.b2c.mall.component.limitedtimesale',
    'sf.b2c.mall.component.rapidseabuy',
    'sf.b2c.mall.widget.slide'
  ],

  function(can, $, Header, Footer, LimitedTimeSale, RapidSeaBuy, SFSlide) {

    var home = can.Control.extend({

      init: function(element, options) {
        this.component = {};

        this.render();
        this.supplement();
      },

      render: function() {

        new Header('.sf-b2c-mall-header');
        new Footer('.sf-b2c-mall-footer');

        this.component.slide = new SFSlide('.sf-b2c-mall-main-slider', {
          imgs: [{
            imgUrl: 'img/banner1.jpg',
            url: 'http://www.google.com'
          }, {
            imgUrl: 'img/banner2.jpg',
            url: 'http://www.baidu.com'
          }]
        });

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