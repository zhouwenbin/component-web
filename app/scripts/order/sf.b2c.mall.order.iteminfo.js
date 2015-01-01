'use strict';

define('sf.b2c.mall.order.iteminfo', [
  'can',
  'sf.b2c.mall.api.b2cmall.getProductHotData',
  'sf.b2c.mall.api.b2cmall.getItemInfo',
  'sf.b2c.mall.api.order.submitOrderForAllSys',
  'sf.b2c.mall.api.user.getRecAddressList',
  'sf.b2c.mall.api.user.getIDCardUrlList',
  'sf.helpers'

], function(can, SFGetProductHotData, SFGetItemInfo, SFSubmitOrderForAllSys, SFGetRecAddressList, SFGetIDCardUrlList, helpers) {
  return can.Control.extend({

    /**
     * 初始化
     * @param  {DOM} element 容器element
     * @param  {Object} options 传递的参数
     */
    init: function(element, options) {
      var that = this;

      var params = can.deparam(window.location.search.substr(1));
      this.options.itemid = params.itemid;
      that.options.saleid = params.saleid;
      this.options.amount = params.amount;

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

          itemObj.itemName = iteminfo.skuInfo.title;
          itemObj.picUrl = iteminfo.skuInfo.images[0].thumbImgUrl;

          itemObj.spec = "黑色";


          that.options.allTotalPrice = itemObj.allTotalPrice;

          var html = can.view('templates/order/sf.b2c.mall.order.iteminfo.mustache', itemObj);
          that.element.html(html);

        })
        .fail(function(error) {

        })


    },

    '#submitOrder click': function(element, event) {
      var that = this;

      var addressid = element.parents().find("#addrList").find("li.active").eq(0).attr('data-addressid');
      var personid = element.parents().find("#personList").find("li.active").eq(0).attr('data-recid');

      if (typeof personid == 'undefined'){
        alert('没有选择收货人！');
        return false;
      }

      if (typeof addressid == 'undefined'){
        alert('没有选择收货地址！');
        return false;
      }

      var getRecAddressList = new SFGetRecAddressList();
      var getIDCardUrlList = new SFGetIDCardUrlList();

      var params = {};

      can.when(getRecAddressList.sendRequest(), getIDCardUrlList.sendRequest())
        .done(function(addrList, personList) {

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
              "price": that.options.allTotalPrice
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
              "orderid": message.value
            });
        })
        .fail(function(error) {

        });
    }
  });
})