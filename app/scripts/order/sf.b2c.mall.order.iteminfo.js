'use strict';

define('sf.b2c.mall.order.iteminfo', [
  'can',
  'store',
  'jquery.cookie',
  'sf.b2c.mall.adapter.regions',
  'sf.b2c.mall.api.b2cmall.getProductHotData',
  'sf.b2c.mall.api.b2cmall.getItemSummary',
  'sf.b2c.mall.api.order.submitOrderForAllSys',
  'sf.b2c.mall.api.order.queryOrderCoupon',
  'sf.b2c.mall.api.coupon.receiveExCode',
  'sf.b2c.mall.api.user.getRecAddressList',
  'sf.helpers',
  'sf.b2c.mall.api.user.setDefaultAddr',
  'sf.b2c.mall.api.user.setDefaultRecv',
  'sf.b2c.mall.widget.message',
  'sf.b2c.mall.business.config'
], function(can, store, $cookie, RegionsAdapter, SFGetProductHotData, SFGetItemSummary, SFSubmitOrderForAllSys, SFQueryOrderCoupon, SFReceiveExCode, SFGetRecAddressList, helpers, SFSetDefaultAddr, SFSetDefaultRecv, SFMessage, SFConfig) {

  return can.Control.extend({
    itemObj: new can.Map({
      isShowCouponArea: false,
      links: SFConfig.setting.link
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
      that.options.itemid = params.itemid;
      that.options.saleid = arr[2];
      that.options.amount = params.amount;
      that.itemObj.itemid = params.itemid;
      that.itemObj.saleid = arr[2];
      that.itemObj.amount = params.amount;

      can.when(that.initItemSummary(options), that.initProductHotData(options))
        .then(function() {
          return that.initCoupons(options)
            .always(function() {
              var html = can.view('templates/order/sf.b2c.mall.order.iteminfo.mustache', that.itemObj);
              that.element.html(html);
              // that.options.productChannels = 'heike';
              // arr[2] ='undefined';
              //@noto如果商品渠道是嘿客，但是该用户不是从嘿客穿越过来的，则不能购买此商品
              if (that.options.productChannels == 'heike' && arr[2] == 'undefined') {
                $('#submitOrder').addClass('disable');
              };
            });
        })
        .fail(function(error) {
          console.error(error);
        });
    },

    initItemSummary: function(options) {
      var that = this;
      var getItemSummary = new SFGetItemSummary({
        "itemId": that.itemObj.itemid
      });
      return getItemSummary.sendRequest()
        .done(function(iteminfo) {
          that.itemObj.attr({
            showTax: iteminfo.bonded, //是否是宁波保税，是得话才展示税额
            itemName: iteminfo.title,
            picUrl: iteminfo.image ? iteminfo.image.thumbImgUrl : "",
            skuId: iteminfo.skuId
          });
          //@note 如果channels(渠道编号) = 'heike',
          //cookie中1_uinfo中没有heike，则该用户不能购买
          that.options.productChannels = iteminfo.channels[0];
          if (typeof iteminfo.specs != "undefined") {
            var result = new Array();
            _.each(iteminfo.specs, function(item) {
              result.push(item.specName + ":" + item.spec.specValue);
            });
            that.itemObj.attr("spec", result.join('&nbsp;/&nbsp;'));
          }
        })
        .fail(function(error) {
          console.error(error);
        })
    },

    initProductHotData: function(options) {
      var that = this;
      var getProductHotData = new SFGetProductHotData({
        'itemId': that.itemObj.itemid
      });

      return getProductHotData.sendRequest()
        .done(function(productHotData) {
          that.itemObj.attr({
            "singlePrice": productHotData.sellingPrice,
            "amount": that.itemObj.amount,
            "totalPrice": productHotData.sellingPrice * that.itemObj.amount,
            "allTotalPrice": productHotData.sellingPrice * that.itemObj.amount,
            "shouldPay": productHotData.sellingPrice * that.itemObj.amount,
            "sellingPrice": productHotData.sellingPrice
          });
        })
        .fail(function(error) {
          console.error(error);
        })
    },


    /*
     * author:zhangke
     */
    initCoupons: function(options) {
      var that = this;
      var queryOrderCoupon = new SFQueryOrderCoupon({
        "items": JSON.stringify([{
          "itemId": this.itemObj.itemid,
          "num": this.itemObj.amount,
          "price": this.itemObj.singlePrice,
          skuId: this.itemObj.skuId
        }]),
        'system': that.getSysType(that.options.saleid)
      });
      var queryOrderCouponDefer = queryOrderCoupon.sendRequest();
      queryOrderCouponDefer.done(function(orderCoupon) {
          that.itemObj.attr("isShowCouponArea", true);
          can.extend(orderCoupon, {
            isHaveAvaliable: orderCoupon.avaliableAmount != 0,
            isHaveDisable: orderCoupon.disableAmount != 0,
            useQuantity: 0,
            discountPrice: 0,
            couponExCode: ""
          });
          that.itemObj.attr("orderCoupon", orderCoupon);
          that.itemObj.orderCoupon.selectCoupons = [];

          that.itemObj.bind("orderCoupon.discountPrice", function(ev, newVal, oldVal) {
            that.itemObj.attr("shouldPay", that.itemObj.shouldPay + oldVal - newVal);
          });
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
      "4000500": "订单商品库存不足",
      "4000600": "订单商品超过限额",
      "4000700": "订单商品金额改变",
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
      var isDetail = /^[\u4e00-\u9fa5\d\w#。，-]+$/.test($.trim(selectAddr.detail));
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
      } else if (!isDetail) {
        new SFMessage(null, {
          'tip': '请您输入正确的收货地址!',
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
      var verifYVendorResult = that.options.vendorinfo.verifYVendor(that.options.saleid);
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
              "zipCode": selectAddr.zipCode,
              "recId": selectAddr.recId
            }),
            "userMsg": "",
            "items": JSON.stringify([{
              "itemId": that.itemObj.itemid,
              "num": that.itemObj.amount,
              "price": that.itemObj.sellingPrice
            }]),
            "sysType": that.getSysType(that.options.saleid),
            "sysInfo": that.options.vendorinfo.getVendorInfo(that.options.saleid),
            "couponCodes": that.getCouponCodes()
          }
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
            11000200: "兑换码已过期"
          }
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
