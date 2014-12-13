'use strict';

// @description 申请命名空间
sf.util.namespace('b2c.mall.sku.adapter');

/**
 * @class sf.b2c.mall.sku.adapter
 * @author Michael.Lee (leewind19841209@gmail.com)
 * @description SPUInfo
 */
sf.b2c.mall.sku.adapter = can.Map.extend({

  statusMap: {
    'ONSELL': 'onsale',
    'SOLDOUT': 'soldout',
    'GROUPON': 'groupon'
  },

  /**
   * @description 将data model转化为view model
   * @function sf.b2c.mall.sku.adapter.format format
   * @param  {Map} skuinfo SKU信息
   */
  format: function(skuinfo) {

    var getImgInfo = function(img) {
      return {
        thumbImgUrl: img + '@71h_71w_50Q_1x.jpg',
        midImgUrl: img + '@451h_451w_50Q_1x.jpg',
        bigImgUrl: img
      };
    };

    var imgs = [];
    var pushImg = function(skuSpec) {
      if (skuSpec && skuSpec.album) {
        var items = skuSpec.album.split(',');
        _.each(items, function(img) {
          imgs.push(getImgInfo(img));
        });
      }
    };

    var status = null;
    if (skuinfo.stock == 0) {
      status = this.statusMap['SOLDOUT'];
    }else if (skuinfo.status == 'GROUPON') {
      status = this.statusMap['GROUPON'];
    }else{
      status = this.statusMap['ONSELL'];
    }

    _.each(skuinfo.skuSpec, pushImg);

    this.attr('sku', skuinfo.skuId);
    this.attr('spu', skuinfo.spuId);
    this.attr('imgs', imgs);
    this.attr('price', skuinfo.price);
    this.attr('oprice', skuinfo.listPrice);
    this.attr('status', status);
    this.attr('stock', skuinfo.stock);
  }

});