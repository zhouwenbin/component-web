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
      var that = this;

      //设置商品详细信息，包括标题、副标题、描述等信息
      detailContentInfo.itemInfo = {};
      detailContentInfo.itemInfo.basicInfo = itemInfoData.skuInfo;

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
        that.setCanSelectedSpec(index, specId, group, detailContentInfo);

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
        return spec.specId == specId.substring(index, index + 1);
      })
      selectedSpec.selected = true;
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
    setCanSelectedSpec: function(index, specId, group, detailContentInfo) {
      //组合各种情况,看是否存在
      _.each(group.specs, function(spec) {
        spec.canSelected = false;
        var compose = specId.substring(0, index) + spec.specId + specId.substring(index + 1, specId.length);

        var result = _.find(detailContentInfo.itemInfo.saleSkuSpecTupleList, function(saleSkuSpecTuple) {
          return saleSkuSpecTuple.skuSpecTuple.specIds.indexOf(compose) > -1;
        })

        if (typeof result != 'undefined') {
          if (!spec.selected) {
            //因初次渲染时候还未放入到Map中去，所以要做下判断
            if (typeof spec.attr != 'undefined') {
              spec.attr("canSelected", true);
            } else {
              spec.canSelected = true;
            }
          }
        } else {
          if (typeof spec.attr != 'undefined') {
              spec.attr("canSelected", false);
            } else {
              spec.canSelected = false;
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