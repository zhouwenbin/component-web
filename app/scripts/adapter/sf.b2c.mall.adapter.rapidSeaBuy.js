
'use strict'

define('sf.b2c.mall.adapter.rapidSeaBuy',[
      'can',
    ],function(can){
      return new can.Map({
        format:function(data){
          var that = this;

          _.each(data,function(value,key,list){
            that.attr(key,value);
          });
          return that;
        },
        formatPrice:function(data,priceData){
          _.each(data.fastSaleInfos,function(item){
            _.each(priceData,function(priceItem){
              if(item.homePageProductInfo && item.homePageProductInfo.itemId == priceItem.skuId){
                item.attr('originPrice',priceItem.originPrice);
                item.attr('sellingPrice',priceItem.sellingPrice);
                item.attr('discount',priceItem.discount);
              }else if(item.homepageTopicInfo){
                item.attr('price', item.homepageTopicInfo.price);
                item.attr('discount', item.homepageTopicInfo.discount);
              }
            });
          });
        }
      })
    })