'use strict';
define('sf.b2c.mall.component.rapidseabuy', [
      'can',
      'underscore',
      'jquery',
      'sf.b2c.mall.adapter.rapidSeaBuy',
      'sf.b2c.mall.api.b2cmall.getFastSaleInfoList'
    ],
    function(can,_,$,SFAdapterRapidSeaBuy,SFGetFastSaleInfoList) {
      return can.Control.extend({

        helpers:{
          'sf-is-product':function(fastSaleContentType,options){
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
          this.render();
        },
        /**
         * [init description]
         * @param  {[type]} 如果页面中有serverRendered，调用获取价格接口，渲染价格模块showPriceModel
         * @param  {[type]} 没有调用showMoreProduct方法，加载所有数据接口和价格接口
         * @return {[type]}
         */
        render:function(){
          var that = this;
          var $el = $('.sf-b2c-mall-rapidseabuy').hasClass('serverRendered');
          var $btnMore = $('.btn-more');

          if($el){
            this.showPriceModel();
          }else{
            this.supplement();
          }
        },
        supplement:function(){
          this.showMoreProduct();
        },

        moreProductTemplate:function(){
          return '{{#each fastSaleInfos}}' +
          '<li><div class="product-r1">' +
          '<a href="{{link}}" target="_blank"><img src="{{imgUrl}}" alt="" ></a><span></span>' +
          '</div>' +
          '<h3><a href="{{link}}" target="_blank">{{title}}</a></h3>' +
          '<p>{{subTitle}}</p>' +
          '<div class="product-r2 clearfix">' +
          '<div class="product-r2c1 fl"><span class="icon icon6"><b>{{limitedTime}}</b>天到<i></i></span></div>' +
          '{{#sf-is-product fastSaleContentType}}' +
          '<div class="product-r2c2 fr"><span class="icon icon5"><img src="{{homePageProductInfo.showNationalUrl}}" alt=""/></span></div>' +
          '{{/sf-is-product}}' +
          '{{^sf-is-product fastSaleContentType}}' +
          '<div class="product-r2c2 fr"><span class="icon icon5"></span></div>' +
          '{{/sf-is-product}}' +
          '</div>' +
          '<div class="product-r3 clearfix">' +
          '{{#sf-is-product fastSaleContentType}}' +
          '<div class="product-r3c1 fl" >' +
          '<strong>￥{{sellingPrice}}</strong>' +
          '<del>￥{{originPrice}}</del>' +
          '</div>' +
          '<div class="product-r3c2 fr">' +
          '<strong>{{discount}}</strong>折' +
          '</div>' +
          '{{/sf-is-product}}' +
          '{{^sf-is-product fastSaleContentType}}' +
          '<div class="product-r3c1 fl">' +
          '<strong>￥{{price}}</strong>元起' +
          '</div>' +
          '<div class="product-r3c2 fr">' +
          '<strong>{{discount}}</strong>折起' +
          '</div>' +
          '{{/sf-is-product}}' +
          '</div>' +
          '</li>'+
          '{{/each}}'
        },

        priceTemplate: function() {
          return '{{#sf-is-product fastSaleContentType}}' +
              '<div class="product-r3c1 fl">' +
              '<strong>￥{{sellingPrice}}</strong>' +
              '<del>￥{{originPrice}}</del>' +
              '</div>' +
              '<div class="product-r3c2 fr">' +
              '<strong>{{discount}}</strong>折' +
              '</div>' +
              '{{/sf-is-product}}' +

              '{{^sf-is-product fastSaleContentType}}' +
              '<div class="product-r3c1 fl">' +
              '<strong>￥{{price}}</strong>元起' +
              '</div>' +
              '<div class="product-r3c2 fr">' +
              '<strong>{{discount}}</strong>折起' +
              '</div>' +
              '{{/sf-is-product}}'
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
        showMoreProduct:function(){
          var that = this;

          can.when(can.ajax({
            url:'json/sf-b2c.mall.index.rapidseabuy.json'
          }))
          .done(function(data){
            that.options.fastSaleInfoList = data;
            that.options = SFAdapterRapidSeaBuy.format(that.options);
          })
          .then(function(){
            return can.ajax({
              url:'json/sf-b2c.mall.index.rapidseabuyPrice.json'
            })
          })
          .done(function(data){
            SFAdapterRapidSeaBuy.formatPrice(that.options.fastSaleInfoList,data);
            //var html = can.view('templates/component/sf.b2c.mall.rapidseabuy.mustache',that.options);
            var template = can.view.mustache(that.moreProductTemplate());
            $($('.product-list').get(2)).append(template(that.options.fastSaleInfoList));
          })



        },

        showPriceModel:function(){
          var that = this;

          //获取节点
          var ulNode = $('ul.product-list');
          var priceNodeList = $('ul.product-list #priceWrap');

          //获得数据列表，传递给ajax请求，方便一次性获得价格信息
          var skuIdList = ulNode.skuList;
          var topicIdList = ulNode.topicIdList;

          //渲染价格模块
          can.ajax({
            url:'json/sf-b2c.mall.index.timelimitedsalePrice.json'
          })
          .done(function(data) {
              var template = can.view.mustache(that.priceTemplate());
              _.each(priceNodeList, function (priceNode) {
                _.each(data, function (priceItem) {
                  if (priceItem.skuId == priceNode.attributes['skuid'].value) {
                    priceItem.fastSaleContentType = "PRODUCT";
                    $(priceNode).html(template(priceItem));
                  }
                });
              })
          });
        },

        getSkuList: function(data) {
          var result = "";
          _.each(data, function (item) {
            if (item.contentType == 'PRODUCT') {
              result += item.homePageProductInfo.skuId + ',';
            }
          })
        }



      });
    })