'use strict';
define('sf.b2c.mall.component.rapidseabuy', [
      'JSON',
      'can',
      'underscore',
      'jquery',
      'sf.b2c.mall.adapter.rapidSeaBuy',
      'sf.b2c.mall.api.b2cmall.getFastSaleInfoList',
      'sf.b2c.mall.api.b2cmall.getProductHotDataList'
    ],
    function(JSON, can,_,$,SFAdapterRapidSeaBuy,SFGetFastSaleInfoList,SFGetProductHotDataList) {
      return can.Control.extend({

        helpers:{
          'sf-is-product':function(fastSaleContentType, options){
            if(fastSaleContentType() == "PRODUCT"){
              return options.fn(options.contexts || this);
            }else{
              return options.inverse(options.contexts || this);
            }
          }
        },

        /**
         * [init description]
         * @param  {[type]} element
         * @param  {[type]} options
         * @return {[type]}
         */

        init: function(element, options) {
          this.data = {};
          this.data.fastSale = new SFAdapterRapidSeaBuy({fastSaleInfos: []});

          // console.log(this.data.fastSale)
          this.render();
        },
        /**
         * [init description]
         * @param  {[type]} 如果页面中有serverRendered，调用获取价格接口，渲染价格模块showPriceModel
         * @param  {[type]} 没有调用showMoreProduct方法，加载所有数据接口和价格接口
         * @return {[type]}
         */
        render:function(){
          var $el = $('.sf-b2c-mall-rapidseabuy').hasClass('serverRendered');
          var $btnMore = $('.btn-more');

          if($el){
            this.showPriceModel();
            var template = can.view.mustache(this.moreProductTemplate());

            var el = this.element.find('.product-list-fast').get(0);
            $(el).append(template(this.data.fastSale, this.helpers));
          }else{
            this.supplement();
          }
        },
        supplement:function(){
          this.showMoreProduct();
        },

        moreProductTemplate:function(){
          return '{{#each fastSaleInfos}}' +
          '<li>'+
            '<div class="product-r1">' +
              '<a href="{{link}}" target="_blank"><img src="{{imgUrl}}" alt="" ></a><span></span>' +
              '{{#soldOut}}<span class="icon icon24">售完</span>{{/soldOut}}'+
            '</div>' +
            '<h3><a href="{{link}}" target="_blank">{{title}}</a></h3>' +
            '<p>{{subTitle}}</p>' +
            '<div class="product-r2 clearfix">' +
              '<div class="product-r2c1 fl"><span class="icon icon6"><b>{{limitedTime}}</b>天到<i></i></span></div>' +
              '{{#sf-is-product fastSaleContentType}}' +
              '<div class="product-r2c2 fr"><img src="{{homepageProductInfo.showNationalUrl}}" alt=""/></div>' +
              '{{/sf-is-product}}'+
              '{{^sf-is-product fastSaleContentType}}' +
              '<div class="product-r2c2 fr"></div>' +
              '{{/sf-is-product}}'+
            '</div>'+
            '<div class="product-r3 clearfix">' +
              '{{#sf-is-product fastSaleContentType}}' +
              '<div class="product-r3c1 fl" >' +
                '<strong><span>￥</span>{{sellingPrice}}</strong>' +
                '<del>￥{{originPrice}}</del>' +
              '</div>' +
              '<div class="product-r3c2 fr">' +
                '<strong>{{discount}}</strong>折' +
              '</div>' +
              '{{/sf-is-product}}'+
              '{{^sf-is-product fastSaleContentType}}' +
              '<div class="product-r3c1 fl">' +
                '<strong><span>￥</span>{{price}}</strong>元起' +
              '</div>' +
              '<div class="product-r3c2 fr">' +
                '<strong>{{discount}}</strong>折起' +
              '</div>' +
              '{{/sf-is-product}}'+
            '</div>' +
          '</li>'+
          '{{/each}}'
        },

        /**
         * [init description]
         * @param  {[type]}
         * @param  {[type]} 价格模板
         * @return {[type]}
         */
        priceTemplate: function() {
          return '<div class="product-r3c1 fl">' +
              '<strong><span>￥</span>{{sellingPrice}}</strong>' +
              '<del>￥{{originPrice}}</del>' +
              '</div>' +
              '<div class="product-r3c2 fr">' +
              '<strong>{{discount}}</strong>折' +
              '</div>'

        },

        /**
         * [init description]
         * @param  {[type]}
         * @param  {[type]} 点击查看更多，二次渲染
         * @return {[type]}
         */
        '.btn-more click':function(el,event){
          event && event.preventDefault();
          this.showMoreProduct();
        },

        /**
         * [init description]
         * @param  {[type]}
         * @param  {[type]} 二次渲染
         * @return {[type]}
         */
        showMoreProduct:function(element, event){
          event && event.preventDefault();

          var that = this;
          var pageInfo = this.data.fastSale.attr('pageInfo');
          var getFastSaleInfoList = new SFGetFastSaleInfoList({pageIndex: pageInfo ? pageInfo.pageIndex+1 : 2, pageSize: 24});
          getFastSaleInfoList
            .sendRequest()
            .done(function(data){
              that.data.fastSale.format(data)
            })
            .fail(function(errorCode){

            })
            .then(function(data){
              var ids = [];
              _.each(data.fastSaleInfos, function(value, key, list){
                if(value.fastSaleContentType == 'PRODUCT'){
                  ids.push(value.homepageProductInfo.itemId)
                }
              });
              var getProductHotDataList = new SFGetProductHotDataList({itemIds: JSON.stringify(ids)});
              return getProductHotDataList.sendRequest();
            })
            .done(function(data){
              that.data.fastSale.formatPrice(that.data.fastSale,data);
              if(!that.data.fastSale.pageInfo.hasMore){
                $('.sf-b2c-mall-rapidseabuy .btn-more').hide();
              }
            })

        },
        showPriceModel:function(){
          var that = this;

          //获取页面上没有价格的节点
          var ulNode = this.element.find('ul.product-list-fast');
          var priceNodeList = this.element.find('ul.product-list-fast #price4ProductClient');

          var arr = [];
          this.element.find('ul.product-list-fast #price4ProductClient').each(function (index,element) {
            arr.push(parseInt($(element).attr('data-itemid')));
          });

          arr = _.uniq(arr);

          var paramData = {
            'itemIds': JSON.stringify(arr)
          }

          //渲染价格模块
          var getProductHotDataList = new SFGetProductHotDataList(paramData);
          //获得价格信息
          getProductHotDataList
            .sendRequest()
            .fail(function(error) {
              console.error(error);
            })
            .done(function(data){
              var template = can.view.mustache(that.priceTemplate());
              _.each(data.value, function(priceItem){
                priceItem.sellingPrice = priceItem.sellingPrice / 100;
                priceItem.originPrice = priceItem.originPrice / 100;
              });

              _.each(priceNodeList, function (priceNode) {
                if($(priceNode).attr('data-contenttype') == 'PRODUCT')
                _.each(data.value, function (priceItem) {
                  if (priceItem.itemId == $(priceNode).attr('data-itemid')) {
                    priceItem.discount = (priceItem.sellingPrice * 10 / priceItem.originPrice).toFixed(1);
                    $(priceNode).html(template(priceItem));
                    if (priceItem.soldOut){
                       $(priceNode).parent().find("div.product-r1").append('<div class="mask"></div><span class="icon icon24">售完</span>');
                    }
                  }
                });
              })
            })
        }
      });
    })
