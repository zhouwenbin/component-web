'use strict';

define(
  'sf.b2c.mall.component.recommendProducts',
  [
    'can',
    'jquery',
    'sf.b2c.mall.api.product.findRecommendProducts'
  ],
  function(can, $, SFFindRecommendProducts) {

    return can.Control.extend({
      /**
       * [init 初始化]
       */
      init: function() {
        this.detailUrl = 'http://www.sfht.com/detail';
        this.render();
      },

      /**
       * [render 渲染]
       */
      render: function() {
        var that = this;


        var findRecommendProducts = new SFFindRecommendProducts({
          'itemId': -1,
          'size': 8
        });

        findRecommendProducts
          .sendRequest()
          .fail(function(error) {
            //console.error(error);
          })
          .done(function(data) {

            data.hasData = true;

            if ((typeof data.value == "undefined") || (data.value && data.value.length == 0)) {
              data.hasData = false;
            }

            _.each(data.value, function(item) {
              item.linkUrl = that.detailUrl + "/" + item.itemId + ".html";
              item.imageName = item.imageName + "@102h_102w_80Q_1x.jpg";
              item.sellingPrice = item.sellingPrice/100;
            })

            var template = can.view.mustache(that.recommendProductsTemplate());
            that.element.html(template(data));
          })
      },
      // 页面推荐商品模板
      recommendProductsTemplate: function() {
        return '{{#if hasData}}' +
          '<h2>为您推荐</h2>' +
          '<ul class="clearfix" id = "recommendProdList">' +
          '{{#each value}}' +
          '<li>' +
          '<div class="recommend-c2">'+
          '<a href="{{linkUrl}}"><img src="{{imageName}}" alt="" /></a>'+
          '</div>'+
          '<div class="recommend-c1">' +
          '<h3><a href="{{linkUrl}}">{{productName}}</a></h3>' +
          '<div class="recommend-r1">¥{{sellingPrice}}</div>' +
          '</div>'+
          '</li>' +
          '{{/each}}' +
          '</ul>' +
          '{{/if}}'
      }
    });
  });
