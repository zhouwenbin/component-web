
'use strict'

define(
    'sf.b2c.mall.adapter.rapidSeaBuy',

    [
      'can',
      'underscore'
    ],

    function(can, _){
      return can.Map({

        format:function(data){
          var arr = this.attr('fastSaleInfos');

          _.each(data.fastSaleInfos, function(value, key, list){
            arr.push(new can.Map(value))
          });

          this.attr('pageInfo', data.pageInfo);
          console.log(this)
        },

        formatPrice:function(data,priceData){
          _.each(data.fastSaleInfos,function(item){
            _.each(priceData.value,function(priceItem){
              if(item.homepageProductInfo && item.homepageProductInfo.itemId == priceItem.itemId){
                item.attr('soldOut', priceItem.soldOut);
                item.attr('originPrice',priceItem.originPrice/100);
                item.attr('sellingPrice',priceItem.sellingPrice/100);
                item.attr('discount', ((priceItem.sellingPrice/priceItem.originPrice)*10).toFixed(1));
              }else if(item.homepageTopicInfo){
                item.attr('soldOut', priceItem.soldOut);
                item.attr('price', item.homepageTopicInfo.price/100);
                item.attr('discount', item.homepageTopicInfo.discount);
              }
            });
          });
        }
      })
    })