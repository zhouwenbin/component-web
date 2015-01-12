'use strict';

define('sf.b2c.mall.order.iteminfo', [
  'can',
  'sf.b2c.mall.api.b2cmall.getProductHotData',
  'sf.b2c.mall.api.b2cmall.getItemInfo',
  'sf.b2c.mall.api.order.submitOrderForAllSys',
  'sf.b2c.mall.api.user.getRecAddressList',
  'sf.b2c.mall.api.user.getIDCardUrlList',
  'sf.helpers',
  'sf.b2c.mall.api.user.setDefaultAddr',
  'sf.b2c.mall.api.user.setDefaultRecv',
  'sf.b2c.mall.widget.message'

], function(can, SFGetProductHotData, SFGetItemInfo, SFSubmitOrderForAllSys, SFGetRecAddressList, SFGetIDCardUrlList, helpers, SFSetDefaultAddr, SFSetDefaultRecv, SFMessage) {
  return can.Control.extend({

    /**
     * 初始化
     * @param  {DOM} element 容器element
     * @param  {Object} options 传递的参数
     */
    init: function(element, options) {
      var that = this;

      var params = can.deparam(window.location.search.substr(1));
      that.options.itemid = params.itemid;
      that.options.saleid = params.saleid;
      that.options.amount = params.amount;

      // var receiverper =
      // var receiveraddr = element.parents

      var getItemInfo = new SFGetItemInfo({
        "itemId": this.options.itemid
      });
      var prceInfo = new SFGetProductHotData({
        'itemId': this.options.itemid
      });

      can.when(getItemInfo.sendRequest(), prceInfo.sendRequest())
        .done(function(iteminfo, priceinfo) {
          var itemObj = {};

          itemObj.singlePrice = priceinfo.sellingPrice;
          itemObj.amount = that.options.amount;

          itemObj.totalPrice = priceinfo.sellingPrice * that.options.amount;
          itemObj.allTotalPrice = itemObj.totalPrice;
          itemObj.shouldPay = itemObj.totalPrice;

          //是否是宁波保税，是得话才展示税额
          itemObj.showTax = iteminfo.saleInfo.bonded;
          itemObj.itemName = iteminfo.skuInfo.title;

		      if(typeof iteminfo.skuInfo.images !== 'undefined'){
            itemObj.picUrl = iteminfo.skuInfo.images[0].thumbImgUrl;
          }
          if(typeof iteminfo.skuInfo.skuSpecTuple !== 'undefined' && typeof iteminfo.saleInfo.specGroups !== 'undefined'){
              itemObj.specIds = iteminfo.skuInfo.skuSpecTuple.specIds;
              var result = new Array();
              for (var i = 0; i < itemObj.specIds.length; i++) {
                _.each(iteminfo.saleInfo.specGroups[i].specs, function (item) {
                  if (itemObj.specIds[i] == item.specId) {
                    result.push(iteminfo.saleInfo.specGroups[i].specName + ":" + item.specValue);
                  }
                })
              }
              itemObj.spec =result.join('&nbsp;/&nbsp;');
          }

          that.options.allTotalPrice = itemObj.allTotalPrice;
          that.options.sellingPrice = priceinfo.sellingPrice;

          var html = can.view('templates/order/sf.b2c.mall.order.iteminfo.mustache', itemObj);
          that.element.html(html);

        })
        .fail(function(error) {

        })


    },

    errorMap: {
      //"4000100": "order unkown error",
      "4000200": "订单地址不存在",
      "4000400": "订单商品信息改变",
      "4000500": "订单商品库存不足",
      "4000600": "订单商品超过限额",
      "4000700": "订单商品金额改变"
    },

    '#submitOrder click': function(element, event) {
      var that = this;

      //防止重复提交
      if (element.hasClass("disable")){
        return false;
      }

      element.addClass("disable");

      var addressid = element.parents().find("#addrList").find("li.active").eq(0).attr('data-addressid');
      var personid = element.parents().find("#personList").find("li.active").eq(0).attr('data-recid');

      if (typeof personid == 'undefined') {

        new SFMessage(null, {
          'tip': '请选择收货人！',
          'type': 'error'
        });

        return false;
      }

      if (typeof addressid == 'undefined') {

        new SFMessage(null, {
          'tip': '请选择收货地址！',
          'type': 'error'
        });
        return false;
      }

      var getRecAddressList = new SFGetRecAddressList();
      var getIDCardUrlList = new SFGetIDCardUrlList();
      var setDefaultAddr = new SFSetDefaultAddr({
        "addrId": addressid
      });
      var setDefaultRecv = new SFSetDefaultRecv({
        "recId": personid
      });

      var params = {};

      can.when(getRecAddressList.sendRequest(), getIDCardUrlList.sendRequest(), setDefaultAddr.sendRequest(), setDefaultRecv.sendRequest())
        .done(function(addrList, personList, addrDefault, personDefault) {

          var selectAddr = _.find(addrList.items, function(item) {
            return item.addrId == addressid;
          });

          var selectPer = _.find(personList.items, function(item) {
            return item.recId == personid;
          });

          params = {
            "addressId": JSON.stringify({
              "addrId": selectAddr.addrId,
              "nationName": selectAddr.nationName,
              "provinceName": selectAddr.provinceName,
              "cityName": selectAddr.cityName,
              "regionName": selectAddr.regionName,
              "detail": selectAddr.detail,
              "recName": selectPer.recName,
              "mobile": selectAddr.cellphone,
              "telephone": selectAddr.cellphone,
              "zipCode": selectAddr.zipCode,
              "recId": selectPer.recId
            }),
            "userMsg": "",
            "items": JSON.stringify([{
              "itemId": that.options.itemid,
              "num": that.options.amount,
              "price": that.options.sellingPrice
            }]),
            "sysType": "b2c"
          }

        })
        .fail(function(error) {

        })
        .then(function() {
          var submitOrderForAllSys = new SFSubmitOrderForAllSys(params);
          return submitOrderForAllSys.sendRequest();
        })
        .done(function(message) {
          window.location.href = 'gotopay.html?' +
            $.param({
              "orderid": message.value,
              "recid": personid
            });
        })
        .fail(function(error) {
          element.removeClass("disable");
          new SFMessage(null, {
            'tip': that.errorMap[error] || '下单失败',
            'type': 'error'
          });
        });
    }
  });
})