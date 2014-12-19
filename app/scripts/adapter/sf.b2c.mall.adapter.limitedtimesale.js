'use strict';

define('sf.b2c.mall.adapter.limitedtimesale', ['can'], function(can) {
  return new can.Map({

    format: function(data) {
      var that = this;

      _.each(data, function(value, key, list) {
        that.attr(key, value);
      });

      return that;
    },

    formatPrice: function(data, priceData, showCountDown) {
      _.each(data, function(item) {
        _.each(priceData, function(priceItem) {
          if (item.homepageProductInfo && item.homepageProductInfo.itemId == priceItem.itemId) {
            item.attr('originPrice', priceItem.originPrice);
            item.attr('sellingPrice', priceItem.sellingPrice);
            //TODO 要增加小数位数处理
            item.attr('discount',priceItem.sellingPrice*10/priceItem.originPrice);
            item.attr('endTime', priceItem.endTime);
            item.attr('time','');
          }else if (item.contentType == 'TOPIC') {
            item.attr('endTime', item.displayEndTime);
            item.attr('price', item.price);
            item.attr('discount', item.discount);
          }
        });
      });

    },

    format4SecondParse: function(data) {
      var that = this;

      _.each(data, function(value, key, list) {
        that.attr(key, value);
      });

      that.attr('time', "");

      return that;
    }
  })
})