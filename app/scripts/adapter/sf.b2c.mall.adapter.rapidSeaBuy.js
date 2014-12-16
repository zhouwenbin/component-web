/**
 * Created by 魏志强 on 2014/12/16.
 */
'use strict'

define('sf.b2c.mall.adapter.rapidSeaBuy',['can','underscore'],function(can,_){
  return new can.Map({
    format:function(data){
      var that = this;

      _each(data,function(value,key,list){
        that.attr(key,value);
      });

      return that;
    },
    formatPrice:function(data,priceData,showCountDown){
      _each(data,function(item){
        _.each(priceData,function(priceItem){
          if(item.homePageProductInfo && item.homePageProductInfo.skuId == priceItem.skuId){
            item.attr('originPrice',priceItem.originPrice);
            item.attr('sellingPrice',priceItem.sellingPrice);

          }
        })
      })
    }
  })
})