'use strict';

define('sf.b2c.mall.adapter.limitedtimesale', ['can'], function(can) {
  return can.Map({

    format: function(data) {
      var that = this;

      _.each(data, function(value, key, list) {
        that.attr(key, value);
      });

      return that;
    },

    formatPrice: function(data, priceData, showCountDown,filter) {
      _.each(data, function(item) {
        _.each(priceData, function(priceItem) {
          if (item.homepageProductInfo && item.homepageProductInfo.itemId == priceItem.itemId) {
            item.attr('soldOut', priceItem.soldOut);
            item.attr('currentStock', priceItem.currentStock);
            item.attr('originPrice', priceItem.originPrice/100);
            if(filter == "NEXT"){
              item.attr('sellingPrice', item.marketingPrice);
              item.attr('discount',(item.marketingPrice*1000/priceItem.originPrice).toFixed(1));
            }else{
              item.attr('sellingPrice', priceItem.sellingPrice/100);
              item.attr('discount',(priceItem.sellingPrice*10/priceItem.originPrice).toFixed(1));
            }           
            item.attr('displayStartTime',item.displayStartTime);
            item.attr('startTime', priceItem.startTime);
            item.attr('endTime', priceItem.endTime);
            item.attr('time','');
          }else if (item.contentType == 'TOPIC') {
            item.attr('item', item.soldOut);
            item.attr('currentStock', item.currentStock);
            item.attr('startTime', item.startTime);
            item.attr('displayStartTime',item.displayStartTime);
            item.attr('endTime', item.displayEndTime);
            item.attr('price', item.homepageTopicInfo.price/100);
            item.attr('discount', item.homepageTopicInfo.discount);
            item.attr('time','');
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
