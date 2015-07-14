define(
  'sf.b2c.mall.page.shop',
  [
    'can',
    'jquery',
    'sf.b2c.mall.framework.comm',
    'sf.util',
    'sf.b2c.mall.business.config',
    'sf.b2c.mall.component.search',
    'sf.b2c.mall.shop.detail',
    'sf.b2c.mall.module.header'
  ],
  function(can, $, SFFrameworkComm, SFFn, SFBusiness,
           SFSearch, SFShopDetail, SFHeader) {
    SFFrameworkComm.register(1);
    SFFn.monitor();
    var searchPage = can.Control.extend({

      /**
       * [init 初始化]
       */
      init: function() {
        this.render();
      },

      /**
       * [render 渲染]
       */
      render: function() {
        var that = this;
        new SFShopDetail('#sf-b2c-mall-shop-detail');
        new SFSearch('#sf-b2c-mall-search', {
          filterCustom: {
            showStatInfo: false,
            brandName: "人气品牌",
            categoryName: "商品分类",
            secondCategoryName: "选购热点",
            originName: ""
          }
        });
      }

    });

    new searchPage();
  })
