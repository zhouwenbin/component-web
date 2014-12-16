'use strict';

define('sf.b2c.mall.adapter.detailcontent', ['can'], function(can) {
  return new can.Map({

    format: function(data) {
      var that = this;

      _.each(data, function(value, key, list) {
        that.attr(key, value);
      });

      return that;
    },

    formatPrice: function(detailContentInfo, priceData) {
      var that = this;

      detailContentInfo.priceInfo = priceData[0];
      detailContentInfo.priceInfo.discount = detailContentInfo.priceInfo.sellingPrice * 10 / detailContentInfo.priceInfo.originPrice
      detailContentInfo.priceInfo.lessspend = detailContentInfo.priceInfo.originPrice - detailContentInfo.priceInfo.sellingPrice;
      detailContentInfo.priceInfo.time = "";
    },

    formatItemInfo: function(detailContentInfo, itemInfoData) {
      detailContentInfo.itemInfo = {};
      detailContentInfo.itemInfo.colorInfo = _.find(itemInfoData.specGroups, function(group) {
        return group.specName == '颜色';
      });

      detailContentInfo.itemInfo.sizeInfo = _.find(itemInfoData.specGroups, function(group) {
        return group.specName == '尺码';
      });

      detailContentInfo.input = {};
      detailContentInfo.input.buyNum = 1;
    }
  })
})