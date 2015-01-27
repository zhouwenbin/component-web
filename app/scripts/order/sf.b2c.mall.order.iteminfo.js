'use strict';

define('sf.b2c.mall.order.iteminfo', [
  'can',
  'sf.b2c.mall.api.b2cmall.getProductHotData',
//  'sf.b2c.mall.api.b2cmall.getItemInfo',
  'sf.b2c.mall.api.b2cmall.getItemSummary',
  'sf.b2c.mall.api.order.submitOrderForAllSys',
  'sf.b2c.mall.api.user.getRecAddressList',
  'sf.b2c.mall.api.user.getIDCardUrlList',
  'sf.helpers',
  'sf.b2c.mall.api.user.setDefaultAddr',
  'sf.b2c.mall.api.user.setDefaultRecv',
  'sf.b2c.mall.widget.message',
  'sf.b2c.mall.api.b2cmall.checkLogistics',
  //'sf.b2c.mall.widget.showArea'

], function(can, SFGetProductHotData, SFGetItemSummary, SFSubmitOrderForAllSys, SFGetRecAddressList, SFGetIDCardUrlList, helpers, SFSetDefaultAddr, SFSetDefaultRecv, SFMessage,CheckLogistics,SFShowArea) {
  return can.Control.extend({

    /**
     * 初始化
     * @param  {DOM} element 容器element
     * @param  {Object} options 传递的参数
     */
    init: function(element, options) {
      var that = this;
      this.component = {};
      var params = can.deparam(window.location.search.substr(1));
      that.options.itemid = params.itemid;
      that.options.saleid = params.saleid;
      that.options.amount = params.amount;

      // var receiverper =
      // var receiveraddr = element.parents

//      var getItemInfo = new SFGetItemInfo({
//        "itemId": this.options.itemid
//      });
      var getItemSummary = new SFGetItemSummary({
        "itemId":this.options.itemid
      });
      var prceInfo = new SFGetProductHotData({
        'itemId': this.options.itemid
      });
      this.component.checkLogistics = new CheckLogistics();
      //this.component.showArea = new SFShowArea();
//      var areaId = $('#logisticsArea').attr('data-areaid');
//      var provinceId =this.component.showArea.adapter.addr.input.attr('provinceName');
//      var cityId =this.component.showArea.adapter.addr.input.attr('cityName');
//      var districtId =this.component.showArea.adapter.addr.input.attr('regionName');


      can.when(getItemSummary.sendRequest(), prceInfo.sendRequest())
        .done(function(iteminfo, priceinfo) {
          var itemObj = {};
          itemObj.errorTips = '';
          //检测是否是可配送区域
          that.component.checkLogistics.setData({
            areaId:iteminfo.areaId,
            provinceId:$.cookie('provinceId'),
            cityId:$.cookie('cityId'),
            districtId:$.cookie('regionId')
          });

          that.component.checkLogistics.sendRequest()
              .done(function(data){
                  if(data.value == false){
                    itemObj.errorTips = '该商品的配送不支持该区域';
                  }
              }).fail(function(){

              });

          itemObj.singlePrice = priceinfo.sellingPrice;
          itemObj.amount = that.options.amount;

          itemObj.totalPrice = priceinfo.sellingPrice * that.options.amount;
          itemObj.allTotalPrice = itemObj.totalPrice;
          itemObj.shouldPay = itemObj.totalPrice;

          //是否是宁波保税，是得话才展示税额
          itemObj.showTax = iteminfo.bonded;
          itemObj.itemName = iteminfo.title;

		      if(typeof iteminfo.image !== 'undefined'){
            itemObj.picUrl = iteminfo.image.thumbImgUrl;
          }

          if(typeof iteminfo.specs != "undefined"){
            var result = new Array();
            _.each(iteminfo.specs,function(item){
              result.push(item.specName + ":" +item.spec.specValue);
            });
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

    getSysType: function (saleid) {
      var defaultKey = 'b2c';
      var mapKey = {
        'heike_online': 'HEIKE_ONLINE'
      }
      return mapKey[saleid] || defaultKey;
    },

    getSysInfo: function () {
      var mapKey = {
        'heike_online': this.options.vendorinfo.get
      }
    },
    '#submitOrder click': function(element, event) {
      var that = this;

      //防止重复提交
      if (element.hasClass("disable")){
        return false;
      }

      element.addClass("disable");

      var selectPer = that.options.selectReceivePerson.getSelectedIDCard();
      var selectAddr = that.options.selectReceiveAddr.getSelectedAddr();

      //进行校验，不通过则把提交订单点亮
      if (typeof selectPer == 'undefined' || selectPer === false) {

        new SFMessage(null, {
          'tip': '请选择收货人！',
          'type': 'error'
        });

        element.removeClass("disable");
        return false;
      }

      if (typeof selectAddr == 'undefined' || selectAddr == false) {

        new SFMessage(null, {
          'tip': '请选择收货地址！',
          'type': 'error'
        });

        element.removeClass("disable");
        return false;
      }

      //实例化接口
      var setDefaultRecv = new SFSetDefaultRecv({
        "recId": selectPer.recId
      });

      var setDefaultAddr = new SFSetDefaultAddr({
        "addrId": selectAddr.addrId
      });

      var params = {};

      can.when(setDefaultAddr.sendRequest(), setDefaultRecv.sendRequest())
        .done(function(addrDefault, personDefault) {

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
            "sysType": that.getSysType(that.options.saleid),
            "sysInfo": that.options.vendorinfo.getVendorInfo(that.options.saleid)
          }

          // var areaId = $('#logisticsArea').attr('data-areaid');
          // var provinceId =this.component.showArea.adapter.addr.input.attr('provinceName');
          // var cityId =this.component.showArea.adapter.addr.input.attr('cityName');
          // var districtId =this.component.showArea.adapter.addr.input.attr('regionName');

          // this.component.checkLogistics.setData({
          //   areaId:areaId,
          //   provinceId:provinceId,
          //   cityId:cityId,
          //   districtId:districtId
          // });
        })
        .fail(function(error) {
          element.removeClass("disable");
        })
        .then(function() {
          var submitOrderForAllSys = new SFSubmitOrderForAllSys(params);
          return submitOrderForAllSys.sendRequest();
        })
        .done(function(message) {
          window.location.href = 'gotopay.html?' +
            $.param({
              "orderid": message.value,
              "recid": selectPer.recId
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