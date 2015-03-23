/**
 * Created by 魏志强 on 2014/12/26.
 */
define(
  'sf.b2c.mall.page.404',
  [
    'can',
    'jquery',
    'sf.b2c.mall.api.product.findRecommendProducts',
    'sf.b2c.mall.framework.comm',
    'sf.util'
  ],
  function(can, $,SFFindRecommendProducts,SFFrameworkComm,SFFn) {

    SFFrameworkComm.register(1);
    SFFn.monitor();
    var findNoPage = can.Control.extend({

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

        // new Header('.sf-b2c-mall-header');
        // new Footer('.sf-b2c-mall-footer');

        var findRecommendProducts = new SFFindRecommendProducts({
          'itemId': -1,
          'size': 4
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
              //<img src="58dd43abc59b1ebe37508d03f28f3cfd.jpg@71h_71w_50Q_1x.jpg" alt="">
            })

            var template = can.view.mustache(that.recommendProductsTemplate());
            $('.recommend').html(template(data));


      		})
  		},
      // 404页面推荐商品模板
      recommendProductsTemplate: function() {
        return '{{#if hasData}}' +
          '<h2>推荐商品</h2>' +
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

    new findNoPage('#page-404');
  })