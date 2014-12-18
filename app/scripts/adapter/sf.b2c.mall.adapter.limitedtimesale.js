'use strict';

define('sf.b2c.mall.adapter.limitedtimesale', ['can'], function(can) {
  return new can.Map({

    format: function(data) {
      var that = this;

      _.each(data, function(value, key, list) {
        that.attr(key, value);
      });

      that.limitedtimesaleInfoList.attr();
      return that;
    },

    formatPrice: function(data, priceData, showCountDown) {
      _.each(data, function(item) {
        _.each(priceData, function(priceItem) {
          if (item.homePageProductInfo && item.homePageProductInfo.skuId == priceItem.skuId) {
            item.attr('originPrice', priceItem.originPrice);
            item.attr('sellingPrice', priceItem.sellingPrice);
            item.attr('endTime', priceItem.endTime);
            item.attr('time','');
          }else if (item.homepageTopicInfo) {
            item.attr('price', item.homepageTopicInfo.price);
            item.attr('discount', item.homepageTopicInfo.discount);
          }
        });
      });

    }
  })
})