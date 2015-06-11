'use strict';

define('sf.b2c.mall.shop.detail', [
    'can',
    'underscore',
    'zoom',
    'store',
    'jquery.cookie',
    'sf.helpers',
    'sf.b2c.mall.framework.comm',
    'sf.b2c.mall.business.config',
    'sf.b2c.mall.api.product.searchShopInfo',
    "text!template_shop_detail"
  ],
  function(can, _, zoom, store, cookie, helpers, SFComm, SFConfig,
           SFSearchShopInfo,
           template_shop_detail) {
  return can.Control.extend({

    helpers: {
      'sf-firstImg': function(imageList, options) {
        if (imageList() && imageList().length > 1) {
          return imageList()[0];
        } else {
          return "";
        }
      },
      "sf-num": function(list, options) {
        if (list()) {
          return list().length;
        } else {
          return "";
        }
      }
    },

    renderData: new can.Map({
      shopInfo: null
    }),

    /**
     * 初始化slide控件
     * @param  {DOM} element 容器element
     * @param  {Object} options 传递的参数
     */
    init: function(element, options) {
      var params = can.deparam(window.location.search.substr(1));
      var shopId = params.shopId;
      if (!/^\+?[1-9]\d*$/.test(shopId)) {
        this.goto404();
      }
      this.render(shopId);
    },

    render: function(shopId) {
      var that = this;
      can.when(this.initSearchShopInfo(shopId))
        .done(function(){
          that.renderHtml();
        })
        .fail(function() {
          that.goto404();
        });
    },

    goto404: function() {
      window.location.href = "404.html";
    },

    /**
     * @description 渲染html
     * @param data
     */
    renderHtml: function(data) {
      //渲染页面
      var renderFn = can.mustache(template_shop_detail);
      var html = renderFn(data || this.renderData, this.helpers);
      this.element.html(html);
    },

    /**
     * @description 从服务器端获取数据
     * @param searchData
     */
    initSearchShopInfo: function(shopId) {
      var that = this;
      var searchShopInfo = new SFSearchShopInfo({
        shopId: shopId
      });
      return searchShopInfo.sendRequest()
        .done(function(shopInfo) {
          that.renderData.attr("shopInfo", shopInfo);
        });
    }
  });
})
