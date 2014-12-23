
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
            arr.push(value)
          });

          this.attr('pageInfo', data.pageInfo);
          console.log(this)
        },

        formatPrice:function(data,priceData){
          _.each(data.fastSaleInfos,function(item){
            _.each(priceData.value,function(priceItem){
              if(item.homepageProductInfo && item.homepageProductInfo.itemId == priceItem.itemId){
                item.attr('originPrice',priceItem.originPrice);
                item.attr('sellingPrice',priceItem.sellingPrice);
                item.attr('discount', ((priceItem.sellingPrice/priceItem.originPrice)*10).toFixed(1));
              }else if(item.homepageTopicInfo){
                item.attr('price', item.homepageTopicInfo.price);
                item.attr('discount', item.homepageTopicInfo.discount);
              }
            });
          });
        }
      })
    })