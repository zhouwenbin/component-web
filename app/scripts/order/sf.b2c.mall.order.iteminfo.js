'use strict';

define('sf.b2c.mall.order.iteminfo', [
  'can',
  'store',
  'jquery.cookie',
  'sf.helpers',
  'sf.b2c.mall.adapter.regions',
  'sf.b2c.mall.api.order.submitOrderForAllSys',
  'sf.b2c.mall.api.order.queryOrderCoupon',
  'sf.b2c.mall.api.order.orderRender',
  'sf.b2c.mall.api.coupon.receiveExCode',
  'sf.b2c.mall.api.user.getRecAddressList',
  'sf.b2c.mall.api.user.setDefaultAddr',
  'sf.b2c.mall.api.user.setDefaultRecv',
  'sf.b2c.mall.widget.message',
  'sf.b2c.mall.business.config'
], function(can, store, $cookie, helpers, RegionsAdapter,
  SFSubmitOrderForAllSys, SFQueryOrderCoupon, SFOrderRender,
  SFReceiveExCode, SFGetRecAddressList, SFSetDefaultAddr, SFSetDefaultRecv, SFMessage, SFConfig) {

  return can.Control.extend({
    itemObj: new can.Map({
      isShowCouponArea: false,
      links: SFConfig.setting.link,
      amount: 0
    }),
    /**
     * 初始化
     * @param  {DOM} element 容器element
     * @param  {Object} options 传递的参数
     */
    init: function(element, options) {
      var that = this;

      var arr = [];
      this.adapter = {};
      this.request();
      //@note 从cookie中获取嘿客穿越过来标示
      var heike_sign = $.cookie('1_uinfo');
      if (heike_sign) {
        arr = heike_sign.split(',');
      }

      var params = can.deparam(window.location.search.substr(1));
      that.itemObj.attr({
        itemid: params.itemid,
        saleid: arr[2],
        amount: params.amount
      });

      can.when(that.initOrderRender())
        .done(function() {
          var html = can.view('templates/order/sf.b2c.mall.order.iteminfo.mustache', that.itemObj);
          that.element.html(html);
          // that.options.productChannels = 'heike';
          // arr[2] ='undefined';
          //@noto如果商品渠道是嘿客，但是该用户不是从嘿客穿越过来的，则不能购买此商品
          if (that.options.productChannels == 'heike' && arr[2] == 'undefined') {
            $('#submitOrder').addClass('disable');
          };
        });
    },
    /**
     * 初始化 OrderRender
     */
    initOrderRender: function() {
      var that = this;
      var selectAddr = that.options.selectReceiveAddr.getSelectedAddr();
      var orderRender = new SFOrderRender({
        address: JSON.stringify({
          "addrId": selectAddr.addrId,
          "nationName": selectAddr.nationName,
          "provinceName": selectAddr.provinceName,
          "cityName": selectAddr.cityName,
          "regionName": selectAddr.regionName,
          "detail": selectAddr.detail,
          "recName": selectAddr.recName,
          "mobile": selectAddr.cellphone,
          "telephone": selectAddr.cellphone,
          "zipCode": selectAddr.zipCode,
          "recId": selectAddr.recId,
          certType: "ID",
          certNo: selectAddr.credtNum2
        }),
        items: JSON.stringify([{
          "itemId": that.itemObj.itemid,
          "num": that.itemObj.amount
        }]),
        sysType: that.getSysType(that.itemObj.saleid),
        sysInfo: that.options.vendorinfo.getVendorInfo(that.itemObj.saleid)
      });
      return orderRender.sendRequest()
        .done(function(orderRenderItem) {
          that.processFoundation(orderRenderItem);
          that.processProducts(orderRenderItem.orderGoodsItemList);
          that.processCoupons(orderRenderItem.orderCouponItem);
        })
        .fail();
    },

    /*
     * 加工基础信息
     * @param 数据
     */
    processFoundation: function(orderRenderItem) {
      this.itemObj.attr({
        submitKey: orderRenderItem.submitKey,
        flag: orderRenderItem.flag,
        errorDes: orderRenderItem.errorDes,
        orderFeeItem: can.extend(orderRenderItem.orderFeeItem, {
          shouldPay: orderRenderItem.orderFeeItem.actualTotalFee,
          actualTotalFee: orderRenderItem.orderFeeItem.actualTotalFee
        })
      });
    },

    /**
     * 加工商品信息
     * @param 商品列表
     */
    processProducts: function(orderGoodsItemList) {
      //@note 如果channels(渠道编号) = 'heike',
      //cookie中1_uinfo中没有heike，则该用户不能购买
      this.options.productChannels = orderGoodsItemList[0].channels[0];
      //是否是宁波保税，是得话才展示税额
      this.itemObj.attr("showTax", orderGoodsItemList[0].bonded);

      _.each(orderGoodsItemList, function(goodItem) {
        if (goodItem.specItemList) {
          var result = new Array();
          _.each(goodItem.specItemList, function(item) {
            result.push(item.specName + ":" + item.spec.specValue);
          });
          goodItem.spec = result.join('&nbsp;/&nbsp;');
          goodItem.totalPrice = goodItem.price * goodItem.quantity;
        }
      });
      this.itemObj.attr("orderGoodsItemList", orderGoodsItemList);
    },
    /**
     * 加工优惠券信息
     * @param 优惠券
     */
    processCoupons: function(orderCoupon) {
      this.itemObj.attr("isShowCouponArea", true);
      can.extend(orderCoupon, {
        isHaveAvaliable: orderCoupon.avaliableAmount != 0,
        isHaveDisable: orderCoupon.disableAmount != 0,
        useQuantity: 0,
        discountPrice: 0,
        couponExCode: ""
      });
      this.itemObj.attr("orderCoupon", orderCoupon);
      this.itemObj.orderCoupon.selectCoupons = [];


      this.itemObj.unbind("orderCoupon.discountPrice").bind("orderCoupon.discountPrice", function(ev, newVal, oldVal) {
        this.attr("orderFeeItem.shouldPay", this.attr("orderFeeItem.shouldPay") + oldVal - newVal);
      });

    },

    initCoupons: function(options) {
      var that = this;

      var params = {
        "items": "",
        'system': that.getSysType(that.itemObj.saleid)
      }
      var goodItems = [];
      _.each(that.itemObj.orderGoodsItemList, function(goodItem) {
        goodItems.push({
          "itemId": goodItem.itemId,
          "num": goodItem.quantity,
          "price": goodItem.price,
          skuId: goodItem.skuId
        });
      });
      params.items = JSON.stringify(goodItems);

      var queryOrderCoupon = new SFQueryOrderCoupon(params);
      var queryOrderCouponDefer = queryOrderCoupon.sendRequest();
      queryOrderCouponDefer.done(function(orderCoupon) {
          that.itemObj.attr("isShowCouponArea", true);
          that.itemObj.orderFeeItem.shouldPay = orderFeeItem.actualTotalFee;
          can.extend(orderCoupon, {
            isHaveAvaliable: orderCoupon.avaliableAmount != 0,
            isHaveDisable: orderCoupon.disableAmount != 0,
            useQuantity: 0,
            discountPrice: 0,
            couponExCode: ""
          });
          that.itemObj.attr("orderCoupon", orderCoupon);
          that.itemObj.orderCoupon.selectCoupons = [];
        })
        .fail(function(error) {
          console.error(error);
        });
      return queryOrderCouponDefer;
    },

    request: function() {
      var that = this;
      return can.ajax('json/sf.b2c.mall.regions.json')
        .done(_.bind(function(cities) {
          this.adapter.regions = new RegionsAdapter({
            cityList: cities
          });
        }, this))
        .fail(function() {

        });
    },
    errorMap: {
      //"4000100": "order unkown error",
      "4000200": "订单地址不存在",
      "4000400": "订单商品信息改变",
      "4000401": "购买数量超过活动每人限购数量",
      "4000402": "折扣金额大于订单总金额",
      "4000403": "购买数量超过活动剩余库存",
      "4000404": "活动已经结束",
      "4000405": "折扣金额过大，超过订单总金额的30%",
      "4000500": "订单商品库存不足",
      "4000600": "订单商品超过限额",
      "4000700": "订单商品金额改变",
      "4002300": "购买的多个商品货源地不一致",
      "4002400": "购买的多个商品的商品形态不一致",
      "4002500": "购买的商品支付卡类型为空",
      "4002600": "购买的商品不在配送范围内",
      "4002700": "订单商品已下架",
      "4100901": "优惠券使用失败",
      "4100902": "优惠券不在可使用的时间范围内",
      "4100903": "优惠券不能在该渠道下使用",
      "4100904": "优惠券不能在该终端下使用",
      "4100905": "使用的优惠券不满足满减条件",
      "4100906": "使用的优惠券金额超过商品总金额的30%",
      "4100907": "该商品不能使用此优惠券"
    },

    getSysType: function(saleid) {
      var defaultKey = 'b2c';
      var mapKey = {
        'heike': 'HEIKE_ONLINE'
      }
      return mapKey[saleid] || defaultKey;
    },

    getCouponCodes: function() {
      var selectedCoupon = $(".js-coupon .radio.active");
      var codes = [];
      for (var i = 0, tmpSelectedCoupon; tmpSelectedCoupon = selectedCoupon[i]; i++) {
        tmpSelectedCoupon = $(tmpSelectedCoupon);
        codes.push($(tmpSelectedCoupon).data("code"));
      }
      return JSON.stringify(codes);
    },

    getSysInfo: function() {
      var mapKey = {
        'heike': this.options.vendorinfo.get
      }
    },
    '#submitOrder click': function(element, event) {
      var that = this;

      //防止重复提交
      if (element.hasClass("disable")) {
        return false;
      }
      $('#errorTips').addClass('visuallyhidden');
      element.addClass("disable");


      var selectAddr = that.options.selectReceiveAddr.getSelectedAddr();
      var isDetailInvalid = /[<>'"]/.test($.trim(selectAddr.detail));

      var isReceiverName = /先生|女士|小姐/.test($.trim(selectAddr.recName));
      if (typeof selectAddr == 'undefined' || selectAddr == false) {
        new SFMessage(null, {
          'tip': '请选择收货地址！',
          'type': 'error'
        });

        element.removeClass("disable");
        return false;
      } else if (isReceiverName) {
        new SFMessage(null, {
          'tip': '请您输入真实姓名。感谢您的配合!',
          'type': 'error'
        });

        element.removeClass("disable");
        return false;
      } else if (isDetailInvalid) {
        new SFMessage(null, {
          'tip': '亲，您的收货地址输入有误，不能含有< > \' \" 等特殊字符！',
          'type': 'error'
        });

        element.removeClass("disable");
        return false;
      } else if (/(嘿客|门店)/.test(selectAddr.detail)) {
        new SFMessage(null, {
          'tip': "根据中国海关针对个人物品进境购物限制要求,<br />请使用家庭地址作为个人收货地址",
          'type': 'error'
        });

        element.removeClass("disable");
        return false;
      }
      var verifYVendorResult = that.options.vendorinfo.verifYVendor(that.itemObj.saleid);
      if (verifYVendorResult && !verifYVendorResult.result) {
        new SFMessage(null, {
          'tip': verifYVendorResult.message,
          'type': 'error'
        });

        element.removeClass("disable");
        return false;
      }

      //实例化接口
      var setDefaultRecv = new SFSetDefaultRecv({
        "recId": selectAddr.recId
      });

      var setDefaultAddr = new SFSetDefaultAddr({
        "addrId": selectAddr.addrId
      });

      var params = {};

      can.when(setDefaultAddr.sendRequest(), setDefaultRecv.sendRequest())
        .done(function(addrDefault, personDefault) {
          params = {
            "address": JSON.stringify({
              "addrId": selectAddr.addrId,
              "nationName": selectAddr.nationName,
              "provinceName": selectAddr.provinceName,
              "cityName": selectAddr.cityName,
              "regionName": selectAddr.regionName,
              "detail": selectAddr.detail,
              "recName": selectAddr.recName,
              "mobile": selectAddr.cellphone,
              "telephone": selectAddr.cellphone,
              "recId": selectAddr.recId,
              certType: "ID",
              certNo: selectAddr.credtNum2
            }),
            "userMsg": "",
            "items": "",
            "sysType": that.getSysType(that.itemObj.saleid),
            "sysInfo": that.options.vendorinfo.getVendorInfo(that.itemObj.saleid),
            "couponCodes": that.getCouponCodes(),
            submitKey: that.itemObj.submitKey
          };

          var goodItems = [];
          _.each(that.itemObj.orderGoodsItemList, function(goodItem) {
            goodItems.push({
              "itemId": goodItem.itemId,
              "num": goodItem.quantity,
              "price": goodItem.price
            });
          });
          params.items = JSON.stringify(goodItems);
        })
        .fail(function(error) {
          element.removeClass("disable");
        })
        .then(function() {
          var submitOrderForAllSys = new SFSubmitOrderForAllSys(params);
          return submitOrderForAllSys.sendRequest();
        })
        .done(function(message) {
          var provinceId = that.adapter.regions.getIdByName(selectAddr.provinceName);
          var cityId = that.adapter.regions.getIdBySuperreginIdAndName(provinceId, selectAddr.cityName);
          var regionId = that.adapter.regions.getIdBySuperreginIdAndName(cityId, selectAddr.regionName);

          store.set('provinceId', provinceId);
          store.set('cityId', cityId);
          store.set('regionId', regionId);

          // 对mediav的转化做监控
          that.monitor['mediav']();

          window.location.href = 'gotopay.html?' +
            $.param({
              "orderid": message.value,
              "recid": selectAddr.recId
            });


        })
        .fail(function(error) {
          element.removeClass("disable");
          new SFMessage(null, {
            'tip': that.errorMap[error] || '下单失败',
            'type': 'error'
          });
        });
    },

    monitor: {
      'mediav': function() {
        var __src = $.cookie('__src');
        if (__src == 'mediav') {
          var _mvq = window._mvq || [];
          window._mvq = _mvq;
          _mvq.push(['$setAccount', 'm-123868-0']);

          _mvq.push(['$setGeneral', 'ordercreate', '', /*用户名*/ '', /*用户id*/ '']);
          _mvq.push(['$logConversion']);
          _mvq.push(['$addOrder', /*订单号*/ '', /*订单金额*/ '']);
          _mvq.push(['$addItem', /*订单号*/ '', /*商品id*/ '', /*商品名称*/ '', /*商品价格*/ '', /*商品数量*/ '', /*商品页url*/ '', /*商品页图片url*/ '']);
          _mvq.push(['$logData']);
        }
      }
    },

    //优惠券功能交互
    '.mycoupon-h li click': function(targetElement) {
      var index = $('.mycoupon-h li').index(targetElement);
      $('.mycoupon-h li').removeClass('active');
      $(targetElement).addClass('active');
      $('.coupon2-b').removeClass('active');
      $('.coupon2-b').eq(index).addClass('active');
      return false;
    },
    '.coupon2-btn click': function(targetElement) {
      $('.js-coupon').toggleClass("hide");
      if ($('.js-coupon').hasClass('hide')) {
        $(targetElement).text('+');
      } else {
        $(targetElement).text('-');
      }
      return false;
    },
    '.coupon2 .radio click': function(targetElement) {
      if ($(targetElement).hasClass("active")) {
        $(targetElement).removeClass('active');
        this.itemObj.attr("orderCoupon.useQuantity", 0);
        this.itemObj.attr("orderCoupon.discountPrice", 0);
      } else {
        $('.coupon2 .radio.active').removeClass('active');
        $(targetElement).addClass('active');
        this.itemObj.attr("orderCoupon.useQuantity", 1);
        this.itemObj.attr("orderCoupon.discountPrice", targetElement.data("price"));
      }

      return false;
    },
    '#inputCouponCode click': function(targetElement) {
      $(".coupon2-r2.hide").show();
    },
    '#useCouponCodeBtn click': function(targetElement) {
      if (targetElement.hasClass("disable")) return;
      targetElement.addClass("disable");
      var that = this;
      var exCode = that.itemObj.orderCoupon.couponExCode;
      var receiveExCode = new SFReceiveExCode({
        exCode: exCode
      });
      receiveExCode.sendRequest()
        .done(function(userCouponInfo) {
          can.when(that.initCoupons())
            .then(function() {
              $(".coupon2-b1 [data-code=" + exCode + "]").trigger("click");
              new SFMessage(null, {
                'tip': '兑换成功！',
                'type': 'success'
              });
            });
        })
        .fail(function(error) {
          var errorMap = {
            11000160: "请输入有效的兑换码",
            11000170: "兑换码已使用",
            11000200: "兑换码已过期",
            11000209: "请输入正确的兑换码",
            11000220: "本账户超过兑换次数限制"
          };
          new SFMessage(null, {
            'tip': errorMap[error] ? errorMap[error] : '请输入有效的兑换码！',
            'type': 'error'
          });
        })
        .always(function() {
          targetElement.removeClass("disable");
        });

    }
  });
})
