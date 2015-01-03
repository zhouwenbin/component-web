'use strict';

define('sf.b2c.mall.adapter.detailcontent', ['can'], function(can) {
  return can.Map({

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
      detailContentInfo.priceInfo.timeIcon = "";
    },

    formatItemInfo: function(detailContentInfo, itemInfoData) {
      var that = this;

      //设置商品详细信息，包括标题、副标题、描述等信息
      detailContentInfo.itemInfo = {};
      detailContentInfo.itemInfo.basicInfo = itemInfoData.skuInfo;
      detailContentInfo.itemInfo.basicInfo.shippingPoint = itemInfoData.saleInfo.shippingPoint;
      detailContentInfo.itemInfo.basicInfo.orderToDelivery = itemInfoData.saleInfo.orderToDelivery;
      detailContentInfo.itemInfo.basicInfo.productShape = itemInfoData.saleInfo.productShape;

      //设置item的大图
      detailContentInfo.itemInfo.currentImage = itemInfoData.skuInfo.images[0].bigImgUrl;

      //设置颜色/尺寸等信息
      detailContentInfo.itemInfo.specGroups = itemInfoData.saleInfo.specGroups;

      detailContentInfo.itemInfo.saleSkuSpecTupleList = itemInfoData.saleInfo.saleSkuSpecTupleList;

      //设置选中和可选状态
      var specId = new String(itemInfoData.skuInfo.skuSpecTuple.specIds[0]);

      var index = 0;

      _.each(detailContentInfo.itemInfo.specGroups, function(group) {
        //设置选中
        that.setSelectedSpec(index, specId, group);
        //设置可选
        that.setCanSelectedSpec(index, specId, group, detailContentInfo);

        ++index;
      })

      //设置默认购买数量
      detailContentInfo.input = {};
      detailContentInfo.input.buyNum = 1;
    },

    reSetSelectedAndCanSelectedSpec: function(detailContentInfo, specId) {
      //设置选中和可选状态
      var that = this;

      var index = 0;

      _.each(detailContentInfo.itemInfo.specGroups, function(group) {
        //设置选中
        that.setSelectedSpec(index, specId, group);
        //设置可选
        that.setCanSelectedSpec(index, specId, group, detailContentInfo.itemInfo.saleSkuSpecTupleList);

        ++index;
      })
    },

    /**
     * [setSelectedSpec 获得选中规格]
     * 获得选中规格(按照specIdOrder进行排序后的)
     * 算法描述：服务器端返回的item信息中有skuSpecTuple中得specIds得第一个数组作为默认选中的规格
     * 因为服务器端返回的规格顺序和specGroups中的规格顺序（specIdOrder）是一样的 所以可以对specId逐个字节区匹配specGroups中得specId
     *
     * @param {[type]} index
     * @param {[type]} specId
     * @param {[type]} group
     */
    setSelectedSpec: function(index, specId, group) {
      var selectedSpec = _.find(group.specs, function(spec) {
        //一位一位去匹配
        return spec.specId == specId[index];
      })
      if (typeof selectedSpec.attr != 'undefined') {
        selectedSpec.attr("selected", "active");
        selectedSpec.attr("canSelected", "");
        selectedSpec.attr("canShowDottedLine", "");
      } else {
        // selectedSpec.canSelected = false;
        // selectedSpec.canShowDottedLine = false;
        selectedSpec.selected = "active";
        selectedSpec.canSelected = "";
        selectedSpec.canShowDottedLine = "";
      }
    },

    /**
     * [setCanSelectedSpec 获得可选规格
     * 算法描述：比如当前已经选中的是 121分别代表 颜色(3个)/型号(2个)/重量（2个）
     * 那当前我要匹配如下：在型号和重量选中的情况下分别是21，那颜色应该有如下组合121 221 321，其中121已经选中 所以不考虑。当前要判断221和321是否在json列表中
     * 如果在 则打上canSelected=true属性]
     * @param {[type]} index
     * @param {[type]} specId
     * @param {[type]} group
     * @param {[type]} detailContentInfo
     */
    setCanSelectedSpec: function(index, specId, group, saleSkuSpecTupleList) {
      //组合各种情况,看是否存在
      _.each(group.specs, function(spec) {
        spec.canSelected = false;
        var composeArr = new Array();
        composeArr = composeArr.concat(specId.slice(0, index));
        composeArr.push(spec.specId);
        composeArr = composeArr.concat(specId.slice(index + 1, specId.length));

        var compose = composeArr.join(",");

        var result = _.find(saleSkuSpecTupleList, function(saleSkuSpecTuple) {
          return saleSkuSpecTuple.skuSpecTuple.specIds.join(",") == compose;
        })

        var showDottedLine = _.find(saleSkuSpecTupleList, function(saleSkuSpecTuple) {
          return saleSkuSpecTuple.skuSpecTuple.specIds.slice(index, index + 1).join('') == spec.specId;
        })

        if (typeof result != 'undefined') {
          if (!spec.selected) {
            //因初次渲染时候还未放入到Map中去，所以要做下判断
            if (typeof spec.attr != 'undefined') {
              spec.attr("canSelected", "");
              spec.attr("compose", result.skuSpecTuple.specIds.join(","));
            } else {
              spec.canSelected = "";
              spec.compose = result.skuSpecTuple.specIds.join(",");
            }
          }
        } else {

          if (typeof spec.attr != 'undefined') {
            spec.attr("canSelected", "");
          } else {
            spec.canSelected = "";
          }

          //显示虚线框
          if (typeof showDottedLine != 'undefined') {
            if (typeof spec.attr != 'undefined') {
              spec.attr("canShowDottedLine", "dashed");
              spec.attr("compose", showDottedLine.skuSpecTuple.specIds.join(","));
            } else {
              spec.canShowDottedLine = "dashed";
              spec.compose = showDottedLine.skuSpecTuple.specIds.join(",");
            }
          } else {
            if (typeof spec.attr != 'undefined') {
              spec.attr("disabled", "disable");
            } else {
              spec.disabled = "disable";
            }
          }
        }
      })
    },

    /**
     * [formatRecommendProducts 格式化推荐产品]
     * @param  {[type]} detailContentInfo
     * @param  {[type]} recommendProducts
     * @return {[type]}
     */
    formatRecommendProducts: function(detailContentInfo, recommendProducts) {
      detailContentInfo.recommendProducts = recommendProducts.value;
    }
  })
})