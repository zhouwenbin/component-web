'use strict';

define('sf.b2c.mall.product.detailcontent', [
    'can',
    'vendor.jquery.imagezoom',
    'sf.b2c.mall.adapter.detailcontent',
    'sf.b2c.mall.api.b2cmall.getProductHotData',
    'sf.b2c.mall.api.b2cmall.getSkuInfo',
    'sf.b2c.mall.api.product.findRecommendProducts',
    'sf.helpers',
    'sf.b2c.mall.business.config'
  ],
  function(can, imagezoom, SFDetailcontentAdapter, SFGetProductHotData, SFGetSKUInfo, SFFindRecommendProducts, helpers, SFConfig) {
    return can.Control.extend({

      helpers: {
        'sf-showCurrentStock': function(currentStock, options) {
          if (currentStock() != -1 && currentStock() != -2) {
            return options.fn(options.contexts || this);
          } else {
            return options.inverse(options.contexts || this);
          }
        },

        'sf-is-limitedTimeBuy': function(productShape, options) {
          if (productShape() == 'LIMITEDTIMEBUY') {
            return options.fn(options.contexts || this);
          } else {
            return options.inverse(options.contexts || this);
          }
        },

        'sf-is-rapidSeaBuy': function(productShape, options) {
          if (productShape() == 'RAPIDSEABUY') {
            return options.fn(options.contexts || this);
          } else {
            return options.inverse(options.contexts || this);
          }
        }
      },

      /**
       * 初始化控件
       * @param  {DOM} element 容器element
       * @param  {Object} options 传递的参数
       */
      init: function(element, options) {
        this.detailUrl = SFConfig.setting.api.detailurl;
        this.mainUrl = SFConfig.setting.api.mainurl;
        this.adapter = new SFDetailcontentAdapter({});
        this.render();
      },

      /**
       * [render 渲染入口方法]
       */
      render: function() {
        var that = this;

        if (that.options.serverRendered) {
          this.supplement();
        } else {
          can.ajax({
              url: 'json/sf-b2c.mall.detail.getItemInfo.json'
            })
            .then(function(itemInfoData) {
              that.options.detailContentInfo = {};
              that.adapter.formatItemInfo(that.options.detailContentInfo, itemInfoData);

              return can.ajax({
                url: 'json/sf-b2c.mall.detail.getSkuInfoByItemIdPrice.json'
              })
            })
            .done(function(priceData) {
              that.adapter.formatPrice(that.options.detailContentInfo, priceData);

            })
            .then(function() {
              return can.ajax({
                url: 'json/sf-b2c.mall.detail.getRecommendProducts.json'
              })
            })
            .done(function(recommendProducts) {
              that.adapter.formatRecommendProducts(that.options.detailContentInfo, recommendProducts);

              that.options.detailContentInfo = that.adapter.format(that.options.detailContentInfo);

              var html = can.view('templates/product/sf.b2c.mall.product.detailcontent.mustache', that.options.detailContentInfo, that.helpers);
              that.element.html(html);

              //设置为选中
              that.setFirstPicSelected();

              that.interval = setInterval(function() {
                that.setCountDown(that.options.detailContentInfo.priceInfo)
              }, '1000')
            })
        }
      },

      /**
       * [setFirstPicSelected 设置图片为选中]
       */
      setFirstPicSelected: function() {
        $('.thumb-item:lt(1)').addClass('active');
      },

      /**
       * [supplement 客户端渲染]
       * @return {[type]}
       */
      supplement: function() {
        //渲染放大镜
        $(".jqzoom").imagezoom();

        //设置为选中
        this.setFirstPicSelected();

        //渲染规格信息
        this.renderSpecInfo();

        //渲染价格信息
        this.renderPriceInfo();

        //渲染推荐商品信息
        this.renderRecommendProducts();
      },

      /**
       * [renderRecommendProducts 渲染推荐商品信息]
       * @return {[type]}
       */
      renderRecommendProducts: function() {
        var that = this;

        var findRecommendProducts = new SFFindRecommendProducts({
          'itemId': $('.sf-b2c-mall-detail-content').eq(0).attr('data-itemid')
        });

        findRecommendProducts
          .sendRequest()
          .fail(function(error) {
            //console.error(error);
          })
          .done(function(data) {

            data.hasData = true;

            if ((typeof data.value == "undefined") || (data.value && data.value.length == 0)) {
              data.hasData = false;
            }

            _.each(data.value, function(item) {
              item.linkUrl = that.detailUrl + "/" + item.itemId + ".html"
            })

            var template = can.view.mustache(that.recommendProductsTemplate());
            $('#recommend-wrap').html(template(data));
          });
      },

      recommendProductsTemplate: function() {
        return '{{#if hasData}}' +
          '<div class="recommend" id="recommend">'+
          '<h2>推荐商品</h2>' +
          '<ul class="clearfix" id = "recommendProdList">' +
          '{{#each value}}' +
          '<li>' +
          '<a class="fl" href="{{linkUrl}}"><img src="{{imageName}}" alt="" /></a>' +
          '<div class="recommend-c1">' +
          '<h3><a href="{{linkUrl}}">{{productName}}</a></h3>' +
          '<div class="recommend-r1">¥{{sellingPrice}}</div>' +
          '<div class="recommend-r2"><del>¥{{originPrice}}</del></div>' +
          '</div>' +
          '</li>' +
          '{{/each}}' +
          '</ul>' +
          '</div>'+
          '{{/if}}'
      },

      /**
       * [renderSpecInfo 渲染规格信息]
       */
      renderSpecInfo: function() {
        var specGroups = JSON.parse($('#specArea').eq(0).attr('data-specgroups'));
        var specId = JSON.parse($('#specArea').eq(0).attr('data-skuspectuple'));
        var saleSkuSpecTupleList = JSON.parse($('#specArea').eq(0).attr('data-saleskuspectuplelist'));

        var index = 0;

        this.options.detailContentInfo = {};
        this.options.detailContentInfo.itemInfo = {};
        this.options.detailContentInfo.itemInfo.specGroups = specGroups;
        this.options.detailContentInfo.itemInfo.saleSkuSpecTupleList = saleSkuSpecTupleList;

        var that = this;

        _.each(this.options.detailContentInfo.itemInfo.specGroups, function(group) {
          //设置选中
          that.adapter.setSelectedSpec(index, specId, group);
          //设置可选
          that.adapter.setCanSelectedSpec(index, specId, group, saleSkuSpecTupleList);

          ++index;
        })

        this.options.detailContentInfo.input = {};
        this.options.detailContentInfo = that.adapter.format(this.options.detailContentInfo);

        var template = can.view.mustache(this.specTemplate());
        $('#specArea').html(template(this.options.detailContentInfo));
      },

      /**
       * [renderPriceInfo 渲染价格信息]
       */
      renderPriceInfo: function() {
        var that = this;
        var itemid = $('.sf-b2c-mall-detail-content').eq(0).attr('data-itemid');

        var getProductHotData = new SFGetProductHotData({
          'itemId': itemid
        });

        getProductHotData
          .sendRequest()
          .fail(function(error) {
            //console.error(error);
          })
          .done(function(data) {
            //获得服务器时间
            var currentServerTime = getProductHotData.getServerTime()
            that.options.detailContentInfo.attr("priceInfo", data);

            //设置价格相关信息
            data.discount = (data.sellingPrice * 10 / data.originPrice).toFixed(1);
            data.lessspend = data.originPrice - data.sellingPrice;
            data.showDiscount = data.originPrice > data.sellingPrice;

            //渲染模板
            var itemPriceTemplate = can.view.mustache(that.itemPriceTemplate());
            $('#itemPrice').html(itemPriceTemplate(data));

            var currentClientTime = new Date().getTime();
            var distance = currentServerTime - currentClientTime;

            if (that.interval) {
              clearInterval(that.interval);
            }

            //设置倒计时
            //如果当前时间活动已经结束了 就不要走倒计时设定了
            if (data.endTime - new Date().getTime() + distance > 0) {
              that.interval = setInterval(function() {

                //走倒计时过程中 如果发现活动时间已经结束了，则去刷新下当前页面
                if (data.endTime - new Date().getTime() + distance <= 0) {
                  that.refreshPage();
                } else {
                  that.setCountDown(that.options.detailContentInfo.priceInfo, distance, data.endTime);
                }
              }, '1000')
            } else {
              that.options.detailContentInfo.priceInfo.attr("timeIcon", "");
            }

            //渲染购买信息
            that.renderBuyInfo(that.options.detailContentInfo);
          });
      },

      refreshPage: function() {
        this.gotoNewItem();
        clearInterval(this.interval);
        this.options.detailContentInfo.priceInfo.attr("timeIcon", "");
      },

      /**
       * [renderBuyInfo 渲染购买信息]
       * @param  {[type]} detailContentInfo
       * @return {[type]}
       */
      renderBuyInfo: function(detailContentInfo) {
        detailContentInfo.input.attr("buyNum", 1);
        detailContentInfo.input.attr("reduceDisable", "disable");

        var logisticsstart = $('#buyInfo').eq(0).attr('data-logisticsstart');
        var logisticsend = $('#buyInfo').eq(0).attr('data-logisticsend');

        if (parseInt(logisticsend, 10) > parseInt(logisticsstart, 10)) {
          detailContentInfo.priceInfo.attr("sendTime", logisticsstart + '-' + logisticsend);
        } else {
          detailContentInfo.priceInfo.attr("sendTime", logisticsstart);
        }

        detailContentInfo.priceInfo.attr("productShape", $('#buyInfo').eq(0).attr('data-productshape'));

        var template = can.view.mustache(this.buyInfoTemplate());
        $('#buyInfo').html(template(detailContentInfo, this.helpers));
      },

      '#gotobuy click': function() {
        window.location.href = SFConfig.setting.link.detail + '?' + $.param({
          "itemId": $('.sf-b2c-mall-detail-content').eq(0).attr('data-itemid'),
          "saleid": $('.sf-b2c-mall-detail-content').eq(0).attr('data-saleid'),
          "amount": this.options.detailContentInfo.input.buyNum
        });
      },

      buyInfoTemplate: function() {
        return '<div class="mr8">购买数量：' +
          '<span class="btn btn-num">' +
          '<a class="btn-num-reduce {{input.reduceDisable}}" href="#">-</a><a class="btn-num-add {{input.addDisable}}" href="#">+</a>' +
          '<input type="text" class="input_txt" value="{{input.buyNum}}" /></span>' +
          '</div>' +
          '<div class="mr9">' +
          '{{#sf-showCurrentStock priceInfo.currentStock}}<span class="icon icon26">商品库存{{priceInfo.currentStock}}件</span>{{/sf-showCurrentStock}}' +
          '{{#if input.showRestrictionTips}}<span class="icon icon26" style="visibility:visible" id="showrestrictiontipsspan">商品限购{{priceInfo.limitBuy}}件</span>{{/if}}' +
          '</div>' +

          '{{#if priceInfo.soldOut}}' +
          '<div class="mr10"><a href="#" class="btn btn-buy disable" id="gotobuy">立即购买</a></div>' +
          '{{/if}}' +

          '{{^if priceInfo.soldOut}}' +
          // '<div class="mr10"><a href="#" class="btn btn-buy">立即购买</a></div>' +
          '<div class="mr10"><a href="#" class="btn btn-buy" id="gotobuy">立即购买</a></div>' +
          '{{/if}}' +

          '<!--限时特卖-->' +
          '<div class="u1">' +
          '{{#sf-is-limitedTimeBuy priceInfo.productShape}}' +
          '<span class="icon icon6 icon6-2">限时特卖<i></i></span>' +
          '<div class="u1-r1"><span class="icon {{priceInfo.timeIcon}}"></span>{{priceInfo.time}}</div>' +
          '{{/sf-is-limitedTimeBuy}}' +
          '</div>' +

          '<!--急速海淘-->' +
          '{{#sf-is-rapidSeaBuy priceInfo.productShape}}' +
          '<!--7天到-->' +
          '<div class="u2">' +
          '<span class="icon icon25"></span><strong>{{priceInfo.sendTime}}</strong>天到' +
          '</div>' +
          '<!--7天到-->' +

          '{{/sf-is-rapidSeaBuy}}' +

          '</div>' +
          '<!--限时特卖-->' +
          '<!--售完-->' +
          '{{#if priceInfo.soldOut}}' +
          '<span class="icon icon24">售完</span>' +
          '{{/if}}' +
          '<!--售完-->';
      },

      itemPriceTemplate: function() {
        return '<div class="mr1">单价：<strong>¥ {{sf.price sellingPrice}}</strong><span>（含税）</span>{{#if showDiscount}}<del>¥ {{sf.price originPrice}}</del>{{/if}}</div>' +
          '{{#if showDiscount}}' +
          '<div class="mr2"><span>{{discount}}折</span>已降{{sf.price lessspend}}元</div>' +
          '{{/if}}';
      },

      specTemplate: function() {
        return '{{#each itemInfo.specGroups}}' +
          '<div class="mr6" data-specidorder="{{specIdOrder}}">{{specName}}：' +
          '{{#each specs}}' +

              '<label data-specid="{{specId}}" id="1" data-specIndex="{{specIndex}}" data-compose="{{compose}}" class="btn btn-goods {{selected}} {{canShowDottedLine}} {{disabled}}">{{specValue}}<span class="icon icon23"></span></label>' +


              // '{{#if selected}}' +
              //   '<label data-specid="{{specId}}" id="1" data-specIndex="{{specIndex}}" data-compose="{{compose}}" class="btn btn-goods active">{{specValue}}<span class="icon icon23"></span></label>' +
              // '{{else}}' +

              //   '{{#if canSelected}}' +
              //     '<label data-specid="{{specId}}" id="2" data-specIndex="{{specIndex}}" data-compose="{{compose}}" class="btn btn-goods">{{specValue}}<span class="icon icon23"></span></label>' +
              //   '{{else}}' +

              //     '{{#if canShowDottedLine}}' +
              //       '<label data-specid="{{specId}}" id="3" data-specIndex="{{specIndex}}" data-compose="{{compose}}" class="btn btn-goods dashed">{{specValue}}<span class="icon icon23"></span></label>' +
              //     '{{else}}' +
              //       '<label data-specid="{{specId}}" id="4" data-specIndex="{{specIndex}}" data-compose="{{compose}}" class="btn btn-goods disable">{{specValue}}<span class="icon icon23"></span></label>' +
              //     '{{/if}}' +

              //   // '<label data-specid="{{specId}}" class="btn btn-goods disable">{{specValue}}<span class="icon icon23"></span></label>' +
              //   '{{/if}}' +
              // '{{/if}}' +

          '{{/each}}' +
          '</div>' +
          '{{/each}}'
      },

      /**
       * @description event:点击thumb-item切换图片
       * @param  {Dom} element 触发事件的元素
       * @param  {Event} event   事件对象
       */
      '.thumb-item click': function(element, event) {
        event && event.preventDefault() && event.stopPropogation();
        // 删除所有的focus class
        $('.thumb-item').removeClass('active');
        element.addClass('active');

        var image = $(element).eq(0).attr('data-big-pic');

        if (this.options.serverRendered) {
          $('#bigPicArea')[0].innerHTML = '<a href="' + image + '"><img src="' + image + '" rel="' + image + '" alt="" class="jqzoom"/></a><span></span>';
        }

        $(".jqzoom").imagezoom();

        //this.options.detailContentInfo.itemInfo.attr("currentImage", image);
      },

      /**
       * @description event:数量增加，限制是accountRestriction
       * @param  {Dom} element 触发事件的元素
       * @param  {Event} event   事件对象
       */
      '.btn-num-add click': function(element, event) {
        event && event.preventDefault();

        var priceInfo = this.options.detailContentInfo.priceInfo;
        var input = this.options.detailContentInfo.input;

        if (priceInfo.soldOut) {
          return false;
        }

        var amount = parseInt(input.attr("buyNum"));
        if (priceInfo.limitBuy > 0 && amount > priceInfo.limitBuy - 1) {
          input.attr("showRestrictionTips", true);
          $('#showrestrictiontipsspan').show();
          input.attr("addDisable", "disable");
          return false;
        }

        input.attr("reduceDisable", "");
        input.attr('buyNum', amount + 1);
        return false;
      },

      /**
       * @description event:数量减少，限制最小是1
       * @param  {Dom} element 触发事件的元素
       * @param  {Event} event   事件对象
       */
      '.btn-num-reduce click': function(element, event) {
        event && event.preventDefault();

        var priceInfo = this.options.detailContentInfo.priceInfo;
        var input = this.options.detailContentInfo.input;

        input.attr("showRestrictionTips", false);
        $('#showrestrictiontipsspan').hide();

        if (input.buyNum > 1) {
          input.attr('buyNum', --input.buyNum);
        } else {
          input.attr("reduceDisable", "disable");
        }

        input.attr("addDisable", "");
        return false;
      },

      /**
       * [description 购买数量手工输入]
       * @param  {[type]} element
       * @param  {[type]} event
       * @return {[type]}
       */
      '.input_txt keyup': function(element, event) {
        event && event.preventDefault();

        this.dealBuyNumByInput(element);

        return false;
      },

      /**
       * [description 购买数量手工输入]
       * @param  {[type]} element
       * @param  {[type]} event
       * @return {[type]}
       */
      '.input_txt blur': function(element, event) {
        event && event.preventDefault();

        this.dealBuyNumByInput(element);

        return false;
      },

      /**
       * [description 购买数量手工输入]
       * @param  {[type]} element
       * @return {[type]}
       */
      dealBuyNumByInput: function(element) {
        var priceInfo = this.options.detailContentInfo.priceInfo;
        var input = this.options.detailContentInfo.input;

        if (priceInfo.soldOut) {
          return false;
        }

        var amount = element[0].value;
        if (priceInfo.limitBuy > 0 && amount > priceInfo.limitBuy) {
          input.attr("showRestrictionTips", true);
          $('#showrestrictiontipsspan').show();
          element.val(priceInfo.limitBuy);
          return false;
        }

        input.attr('buyNum', amount);
        input.attr("showRestrictionTips", false);
        $('#showrestrictiontipsspan').hide();
      },

      /**
       * [description 规格选择]
       * @param  {[type]} element
       * @param  {[type]} event
       * @return {[type]}
       */
      '.btn-goods click': function(element, event) {
        event && event.preventDefault();

        var type = "";
        if (element.hasClass("disable")) {
          return false;
        }

        if (element.hasClass("dashed")) {
          type = "dashed";
        }

        //获得数据信息
        var orderId = $($(element)[0].parentElement).eq(0).attr('data-specidorder');
        var specId = $(element).eq(0).attr('data-specid');

        _.each(this.options.detailContentInfo.itemInfo.specGroups, function(group) {

          if (group.specIdOrder == orderId) {
            //修改选择状态  如果之前选中的 则要修改为未选中状态
            _.each(group.specs, function(spec) {
              if (spec.selected) {
                spec.attr("selected", "");
              }
            })
          } else {
            //修改选择状态
            _.each(group.specs, function(spec) {
              if (spec.specId == specId) {
                spec.attr("selected", "active");
                spec.attr("canSelected", "");
              } else {
                if (spec.selected) {
                  spec.attr("canSelected", "");
                  spec.attr("selected", "");
                }
              }
            })
          }
        })

        //去获得最新的sku信息
        this.gotoNewItem(element, type);
        return false;
      },

      getSKUIdBySpecs: function(saleSkuSpecTupleList, gotoItemSpec, element, type) {
        var saleSkuSpecTuple;
        if (type == 'dashed') {
          saleSkuSpecTuple = _.find(saleSkuSpecTupleList, function(saleSkuSpecTuple) {
            return saleSkuSpecTuple.skuSpecTuple.specIds.join(",") == $(element).eq(0).attr('data-compose');
          })
        } else {
          saleSkuSpecTuple = _.find(saleSkuSpecTupleList, function(saleSkuSpecTuple) {
            return saleSkuSpecTuple.skuSpecTuple.specIds.join(",") == gotoItemSpec;
          });
        }

        //重新设定itemid
        $(".sf-b2c-mall-detail-content").eq(0).attr('data-itemid', saleSkuSpecTuple.itemId);
        return saleSkuSpecTuple.skuSpecTuple.skuId;
      },

      /**
       * [gotoNewItem description]
       * @return {[type]}
       */
      gotoNewItem: function(element, type) {
        //获得选中的表示列表
        var gotoItemSpec = new String($(element).eq(0).attr('data-compose')).split(",");

        var skuId = this.getSKUIdBySpecs(this.options.detailContentInfo.itemInfo.saleSkuSpecTupleList, gotoItemSpec.join(","), element, type);

        var that = this;
        var getSKUInfo = new SFGetSKUInfo({
          'skuId': skuId
        });
        getSKUInfo
          .sendRequest()
          .fail(function(error) {
            console.error(error);
          })
          .done(function(skuInfoData) {
            that.options.detailContentInfo.itemInfo.attr("basicInfo", new can.Map(skuInfoData));
            that.adapter.reSetSelectedAndCanSelectedSpec(that.options.detailContentInfo, gotoItemSpec);

            that.renderPriceInfo();

            that.renderSkuInfo();

            //设置为选中
            that.setFirstPicSelected();
          })
      },

      /**
       * [renderSkuInfo 渲染sku变化信息]
       */
      renderSkuInfo: function() {
        this.renderBreadScrumbInfo();

        this.renderTitleInfo();

        this.renderBandInfo();

        this.renderPicInfo();

        //小编推荐
        this.renderRecommend2();

        //详情属性
        this.renderDetailattributes();

        //详情
        this.renderDetail();
      },

      renderRecommend2: function() {
        var template = can.view.mustache(this.recommend2Template());
        $('#recommend2').html(template(this.options.detailContentInfo));
      },

      renderDetailattributes: function() {
        var template = can.view.mustache(this.detailattributesTemplate());
        $('#detailattributes').html(template(this.options.detailContentInfo.attr()));
      },

      renderDetail: function() {
        var template = can.view.mustache(this.detailTemplate());
        $('#detailcontent').html(template(this.options.detailContentInfo));
      },

      recommend2Template: function() {
        return '<h2>小编推荐</h2>' +
          '<p>{{itemInfo.basicInfo.recommend}}</p>';
      },

      detailattributesTemplate: function() {
        return '{{#each itemInfo.basicInfo.attributes}}' +
          '<li>【{{key}}】 {{value}}</li>' +
          '{{/each}}';
      },

      detailTemplate: function() {
        return '{{itemInfo.basicInfo.description}}';
      },

      /**
       * [renderTitleInfo 渲染标题信息]
       * @return {[type]}
       */
      renderTitleInfo: function() {
        var template = can.view.mustache(this.titleTemplate());
        $('#titleInfo').html(template(this.options.detailContentInfo));
      },

      /**
       * [renderBandInfo 渲染品牌信息]
       * @return {[type]}
       */
      renderBandInfo: function() {
        var template = can.view.mustache(this.bandInfoTemplate());
        $('#bandInfo').html(template(this.options.detailContentInfo));
      },

      /**
       * [renderPicInfo 渲染图片信息]
       * @return {[type]}
       */
      renderPicInfo: function() {
        this.options.detailContentInfo.itemInfo.attr("currentImage", this.options.detailContentInfo.itemInfo.basicInfo.images[0].bigImgUrl);
        var template = can.view.mustache(this.picInfoTemplate());
        $('#allSkuImages').html(template(this.options.detailContentInfo));

        $(".jqzoom").imagezoom();
      },

      renderBreadScrumbInfo: function() {
        var template = can.view.mustache(this.breadScrumbTemplate());
        $('.sf-b2c-mall-product-breadcrumb').html(template(this.options.detailContentInfo));
      },

      /**
       * [titleTemplate 获得图片模板]
       * @return {[type]}
       */
      titleTemplate: function() {
        return '<h1>{{itemInfo.basicInfo.title}}</h1>' +
          '<p>{{itemInfo.basicInfo.subtitle}}</p>'
      },

      /**
       * [bandInfoTemplate 获得品牌模板]
       * @return {[type]}
       */
      bandInfoTemplate: function() {
        return '品牌：<label class="btn btn-goods">{{itemInfo.basicInfo.brand}}</label>';
      },

      /**
       * [picInfoTemplate 获得图片模板]
       * @return {[type]}
       */
      picInfoTemplate: function() {
        return '<div class="goods-c1r1" id="bigPicArea">' +
          '<a href="{{itemInfo.currentImage}}"><img src="{{itemInfo.currentImage}}" rel="{{itemInfo.currentImage}}" alt="" class="jqzoom"/></a>' +
          '</div>' +
          '<div class="goods-c1r2">' +
          '<ul class="clearfix">' +
          '{{#each itemInfo.basicInfo.images}}' +
          '<li class="thumb-item" data-big-pic="{{bigImgUrl}}"><a href=""><img src="{{thumbImgUrl}}" alt="" /></a><span></span></li>' +
          '{{/each}}' +
          '</ul>' +
          '</div>'
      },

      breadScrumbTemplate: function() {
        return '<div class="crumbs">' +
          '<a href="index.html">首页</a><span>&gt;</span>{{itemInfo.basicInfo.title}}' +
          '</div>'
      },

      /**
       * [showCountDown 参考倒计时]
       * @param  {[type]} currentTime
       * @param  {[type]} destTime
       * @return {[type]}
       */
      setCountDown: function(item, distance, endDate) {
        var leftTime = endDate - new Date().getTime() + distance;
        var leftsecond = parseInt(leftTime / 1000);
        var day1 = Math.floor(leftsecond / (60 * 60 * 24));
        var hour = Math.floor((leftsecond - day1 * 24 * 60 * 60) / 3600);
        var minute = Math.floor((leftsecond - day1 * 24 * 60 * 60 - hour * 3600) / 60);
        var second = Math.floor(leftsecond - day1 * 24 * 60 * 60 - hour * 3600 - minute * 60);
        item.attr('time', day1 + "天" + hour + "小时" + minute + "分" + second + "秒");
        item.attr('timeIcon', "icon4");
      }

    });
  })