'use strict';
define('sf.b2c.mall.component.freshfood', [
      'JSON',
      'can',
      'underscore',
      'jquery',
      'sf.b2c.mall.api.b2cmall.getProductHotDataList'
    ],
    function(JSON, can,_,$,SFGetProductHotDataList) {
      return can.Control.extend({
        /**
         * [init description]
         * @param  {[type]} element
         * @param  {[type]} options
         * @return {[type]}
         */
        init: function(element, options) {
          this.data = {};
          this.render();
        },
        /**
         * [init description]
         * @param  {[type]} 调用获取价格接口，渲染价格模块showPriceModel
         * @return {[type]}
         */
        render:function(){
          this.showPriceModel();
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

        showPriceModel:function() {
          var that = this;

          //获取页面上没有价格的节点
          var ulNode = this.element.find('ul.product-list-freshfood');
          var priceNodeList = this.element.find('ul.product-list-freshfood #price4ProductClient');

          var arr = [];
          this.element.find('ul.product-list-freshfood #price4ProductClient').each(function (index, element) {
            arr.push(parseInt($(element).attr('data-itemid')));
          });
          if (arr.length != 0) {
            arr = _.uniq(arr);

            var paramData = {
              'itemIds': JSON.stringify(arr)
            }

            //渲染价格模块
            var getProductHotDataList = new SFGetProductHotDataList(paramData);
            //获得价格信息
            getProductHotDataList
              .sendRequest()
              .fail(function (error) {
                console.error(error);
              })
              .done(function (data) {
                var template = can.view.mustache(that.priceTemplate());
                _.each(data.value, function (priceItem) {
                  priceItem.sellingPrice = priceItem.sellingPrice / 100;
                  priceItem.originPrice = priceItem.originPrice / 100;
                });

                _.each(priceNodeList, function (priceNode) {
                  _.each(data.value, function (priceItem) {
                    if (priceItem.itemId == $(priceNode).attr('data-itemid')) {
                      priceItem.discount = (priceItem.sellingPrice * 10 / priceItem.originPrice).toFixed(1);
                      $(priceNode).html(template(priceItem));
                      if (priceItem.soldOut) {
                        $(priceNode).parent().find("div.product-r1").append('<div class="mask"></div><span class="icon icon24">售完</span>');
                      }
                    }
                  });
                })
              })
          }
        }
      });
    })
