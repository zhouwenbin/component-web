'use strict';

// @description 申请命名空间
sf.util.namespace('b2c.mall.spu.adapter');

/**
 * @class sf.b2c.mall.spu.adapter
 * @author Michael.Lee (leewind19841209@gmail.com)
 * @description SPUInfo
 */
sf.b2c.mall.spu.adapter = can.Map.extend({

  statusMap: {
    'ONSALE': 'onsale',
    'SOLDOUT': 'soldout',
    'GROUPON': 'groupon'
  },

  sellerMap: {
    '1': {
      name: '中国',
      logoUrl: 'images/china.jpg'
    },
    '2': {
      name: '美国',
      logoUrl: 'images/america.jpg'
    },
    '3': {
      name: '日本',
      logoUrl: 'images/japan.jpg'
    },
    '4': {
      name: '澳大利亚',
      logoUrl: 'images/australia.jpg'
    },
    '5': {
      name: '新西兰',
      logoUrl: 'images/newz.jpg'
    },
    '6': {
      name: '中国香港',
      logoUrl: 'images/hk.jpg'
    },
    '7': {
      name: '荷兰',
      logoUrl: 'images/holland.jpg'
    },
    '8': {
      name: '德国',
      logoUrl: 'images/german.jpg'
    },
    '9': {
      name: '英国',
      logoUrl: 'images/britain.jpg'
    },
    '10': {
      name: '欧洲',
      logoUrl: 'images/europe.jpg'
    }
  },

  /**
   * @description 将data model转化为view model
   * @function sf.b2c.mall.spu.adapter.format format
   * @param  {Map} skuinfo SKU信息
   */
  format: function(spuinfo) {

    var getImgInfo = function(img) {
      return {
        thumbImgUrl: img + '@71h_71w_50Q_1x.jpg',
        midImgUrl: img + '@451h_451w_50Q_1x.jpg',
        bigImgUrl: img
      };
    };

    var imgs = [];
    _.each(spuinfo.defaultImgs, function(value, key, list){
      imgs.push(getImgInfo(value));
    });

    var map = {
      0: 'created',
      1: 'confirmed',
      2: 'removed',
      3: 'onsale',
      4: 'offsale'
    };
    var status = map[spuinfo.status];

    if (status == map[0] || status == map[1] || status == map[2]) {
      window.location.href = '/';
    }

    var shipCountry = this.sellerMap[spuinfo.shippingStartPointId]

    var title = _.isEmpty(spuinfo.name) ? spuinfo.foreignName : spuinfo.name;

    this.attr({
      foreignDescription: spuinfo.foreignDescription,
      imgs: imgs,
      cid: spuinfo.categoryId,
      spu: spuinfo.spuId,
      skus: spuinfo.specSkuTuple,
      title: title,
      subtitle: spuinfo.subname,
      limit: spuinfo.maxPerOrder,
      fromCountry: shipCountry && shipCountry.name,
      fromCountryImgUrl: shipCountry && shipCountry.logoUrl,
      seller: spuinfo.seller,
      supplierImgUrl: spuinfo.seller && spuinfo.seller.logoUrl,
      intro: spuinfo.description && window.unescape(spuinfo.description),
      infos: spuinfo.attrs,
      attrs: spuinfo.specGroup,
      status: status,
      shipping: spuinfo.shippingStartPointId,
      saleType: spuinfo.saleType
    });
  }
});