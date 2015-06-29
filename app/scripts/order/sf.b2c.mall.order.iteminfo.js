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
  'sf.b2c.mall.business.config',
  'sf.mediav'
], function(can, store, $cookie, helpers, RegionsAdapter,
  SFSubmitOrderForAllSys, SFQueryOrderCoupon, SFOrderRender,
  SFReceiveExCode, SFGetRecAddressList, SFSetDefaultAddr,
  SFSetDefaultRecv, SFMessage, SFConfig, SFMediav) {

  return can.Control.extend({
    itemObj: new can.Map({
      links: SFConfig.setting.link, //? link参数是干什么的
      amount: 0,
      couponPrice: 0,
      totalPoint:0  //总积分
    }),

    helpers: {
      'sf-needshowcart': function(options) {
        var params = can.deparam(window.location.search.substr(1));
        var uinfo = $.cookie('1_uinfo');
        var arr = new Array();
        if (uinfo) {
          arr = uinfo.split(',');
        }

        if ((typeof arr[4] != 'undefined' && arr[4] != '2') && typeof params.from != 'undefined') {
          return options.fn(options.contexts || this);
        } else {
          return options.inverse(options.contexts || this);
        }
      }
    },
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
           that.itemObj.attr("getpoint", Math.floor(that.itemObj.orderFeeItem.shouldPay/100)*that.itemObj.attr('proportion'));
          var html = can.view('templates/order/sf.b2c.mall.order.iteminfo.mustache', that.itemObj, that.helpers);
          that.element.html(html);

          var invariableGoodshtml = can.view.mustache(that.invariableGoodsTemplate());
          $('.goodsItemArea').append(invariableGoodshtml(that.itemObj));
            var point = that.itemObj.orderFeeItem.shouldPay * that.itemObj.proportion/100;
           if(point  < that.itemObj.totalPoint ){
               if(point < 0){
                   point = 0;
               }
               $("#usedPoint").text(point);
           }
              else{
               $("#usedPoint").text(that.itemObj.totalPoint);
           }

          //@noto如果商品渠道是嘿客，但是该用户不是从嘿客穿越过来的，则不能购买此商品
          // if (that.options.productChannels == 'heike' && arr[2] == 'undefined') {
          //   $('#submitOrder').addClass('btn-disable');
          // };

          that.watchIteminfo.call(that);
        });
    },

    watchIteminfo: function () {
      var uinfo = $.cookie('3_uinfo');
      var arr = [];
      if (uinfo) {
        arr = uinfo.split(',');
      }

      var name = arr[0];

      var products = [];
      this.itemObj.orderPackageItemList.each(function (packageInfo, index) {
        packageInfo.orderGoodsItemList.each(function (value) {
          products.push(value);
        });
      });
      SFMediav.watchShoppingCart({name: name}, products);
    },

    watchSubmit: function () {
      var uinfo = $.cookie('3_uinfo');
      var arr = [];
      if (uinfo) {
        arr = uinfo.split(',');
      }

      var name = arr[0];

      var products = [];
      this.itemObj.orderPackageItemList.each(function (packageInfo, index) {
        packageInfo.orderGoodsItemList.each(function (value) {
          products.push(value);
        });
      });
      SFMediav.watchOrderSubmit({name: name}, {amount: this.itemObj.orderFeeItem.actualTotalFee}, products);
    },

    invariableGoodsTemplate: function() {
      return '{{#each invariableGoodsItemList}}' +
        '<tr class="cart-disable">' +
        '<td class="td1"><div class="cart-pos">' +
        '<a href=""><img src="{{sf.img productImage.thumbImgUrl}}"></a>' +
        '<div class="order-confirm-info">' +
        '<div class="text-error">{{description}}</div>' +
        '<h2><a href="">{{goodsName}}</a></h2>' +
        '<div class="cart-standard">{{{spec}}}</div>' +
        '</div></div>' +
        '</td>' +
        '<td class="td2"></td>' +
        '<td class="td3">{{sf.price price}}</td>' +
        '<td class="td4">{{quantity}}</td>' +
        '<td class="td5">' +
        '<strong class="text-error">{{sf.price totalPrice}}</strong>' +
        '</td>' +
        '</tr>' +
        '{{/each}}'
    },

    /**
     * 初始化 OrderRender
     */
    initOrderRender: function(element, options) {
      var that = this;
      var selectAddr = this.options.selectReceiveAddr.getSelectedAddr();
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
          "certType": "ID",
          "certNo": selectAddr.credtNum2
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
          that.processProducts(orderRenderItem);
          that.processCoupons(orderRenderItem.orderCouponItem);
          that.itemObj.attr('totalPoint',orderRenderItem.integral);
           $("#usedPoint").text(orderRenderItem.integral);
          that.itemObj.attr('proportion', orderRenderItem.proportion);
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
          shouldPay: orderRenderItem.orderFeeItem.actualTotalFee //总价含税费
        })
      });
    },

    /**
     * 加工包裹信息
     * @param 商品列表
     */
    processProducts: function(orderRenderItem) {
      var that = this;

      _.each(orderRenderItem.orderPackageItemList, function(packageItem) {
        _.each(packageItem.orderGoodsItemList, function(goodItem) {
          if (goodItem.specItemList) {
            var result = new Array();
            _.each(goodItem.specItemList, function(item) {
              result.push(item.specName + ":" + item.spec.specValue);
            });
            goodItem.spec = result.join('&nbsp;/&nbsp;');
            goodItem.totalPrice = goodItem.price * goodItem.quantity;
          }
        });
        that.itemObj.attr("orderGoodsItemList", packageItem.orderGoodsItemList);
      });

      this.itemObj.attr("orderPackageItemList", orderRenderItem.orderPackageItemList);
      //便利无效商品列表
      _.each(orderRenderItem.invariableGoodsItemList, function(goodItem) {
        goodItem.totalPrice = goodItem.price * goodItem.quantity;
      });
      this.itemObj.attr("invariableGoodsItemList", orderRenderItem.invariableGoodsItemList);
    },
    /**
     * 加工优惠券信息
     * @param 优惠券
     */
    processCoupons: function(orderCoupon) {

      can.extend(orderCoupon, {
        useQuantity: 0, //?这个参数干嘛用的
        couponExCode: "",
        isHaveAvaliable: false,
        isShowMore: false,
        bestCoupon: null
      });

      this.itemObj.attr("orderCoupon", orderCoupon);
      if (orderCoupon.avaliableAmount > 0) {
        this.itemObj.orderCoupon.attr("isHaveAvaliable", true);
        this.itemObj.orderCoupon.attr("bestCoupon", orderCoupon.avaliableCoupons[0]);
        this.itemObj.attr("couponPrice", orderCoupon.avaliableCoupons[0].price);
      };
      if (orderCoupon.avaliableAmount > 0 || orderCoupon.disableAmount > 0) {
        this.itemObj.orderCoupon.attr("isShowMore", true);
      };

      this.itemObj.orderCoupon.selectCoupons = [];
      var shouldPay = this.itemObj.attr('orderFeeItem.actualTotalFee') - this.itemObj.attr('couponPrice');
      this.itemObj.attr("orderFeeItem.shouldPay", shouldPay);
 //       this.itemObj.attr("getpoint", Math.floor(shouldPay/100)*this.itemObj.attr('orderRenderItem.proportion') );
//        var point =   shouldPay*this.itemObj.attr("proportion")/100;
//        if(point > this.itemObj.attr("integralTotalAmount")){
//            point = this.itemObj.attr("integralTotalAmount");
//        }
//        $("#usedPoint").text(point);

      // this.itemObj.unbind("couponPrice").bind("couponPrice", function(ev, newVal, oldVal) {
      //   this.attr("orderFeeItem.shouldPay", this.attr("orderFeeItem.shouldPay") + oldVal - newVal);
      // }); //?什么意思

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
          "skuId": goodItem.skuId
        });
      });
      params.items = JSON.stringify(goodItems);

      var queryOrderCoupon = new SFQueryOrderCoupon(params);
      var queryOrderCouponDefer = queryOrderCoupon.sendRequest();
      queryOrderCouponDefer.done(function(orderCoupon) {
          that.itemObj.attr("orderFeeItem.shouldPay", that.itemObj.orderFeeItem.actualTotalFee);
          this.itemObj.attr("getpoint", Math.floor(that.itemObj.orderFeeItem.actualTotalFee/100)*this.itemObj.attr('proportion'));
          can.extend(orderCoupon, {
            useQuantity: 0,
            price: 0,
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
      "4000400": "订单金额发生变化，请重新提交订单",
      "4000401": "部分商品超出可购买数量，请重新提交订单",
      "4000402": "折扣金额大于订单总金额",
      "4000403": "部分商品超出可购买数量，请重新提交订单",
      "4000404": "订单金额发生变化，请重新提交订单",
      "4000405": "折扣金额过大，超过订单总金额的30%",
      "4000500": "商品被抢光啦，看看其他商品吧",
      "4000600": "部分商品超出可购买数量，请重新提交订单",
      "4000700": "订单金额发生变化，请重新提交订单",
      "4002500": "下单失败",
      "4002600": "部分商品不支持该区域配送，无法购买",
      "4002700": "商品被抢光啦，看看其他商品吧",
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
        'heike': 'HEIKE'
      }
      return mapKey[saleid] || defaultKey;
    },
    //可用优惠券和不可用优惠券切换
    '.coupons-tab li click': function(element, event) {
      event && event.preventDefault();
      var index = $('.coupons-tab li').index($(element));
      $(element).addClass('active').siblings().removeClass('active');
      $('.coupons-list').eq(index).addClass('active').siblings().removeClass('active');
    },
    //是否使用优惠券
    '#useCoupon click': function(element, event) {
      var span = $(element).find('span.icon85');
      $('#avaliableCoupons li').find('span.icon85').remove();
        var point = 0;
      if (span.length > 0) {
        $(element).find('span.icon85').remove();
        this.itemObj.attr("couponPrice", 0);
        var shouldPay = this.itemObj.attr('orderFeeItem.actualTotalFee') - this.itemObj.attr('couponPrice');
          if($("#pointselected").is(":checked")){
              shouldPay = shouldPay-  ($("#pointUsed").val()*100/this.itemObj.attr('proportion'));
          }
        this.itemObj.attr("orderFeeItem.shouldPay", shouldPay);
          this.itemObj.attr("getpoint", Math.floor(shouldPay/100)*this.itemObj.attr('proportion'));
          point =   shouldPay*this.itemObj.attr("proportion")/100;
          if(point > this.itemObj.attr("totalPoint")){
              point = this.itemObj.attr("totalPoint");
          }
          if(point < 0){
              point = 0;
          }
          $("#usedPoint").text(point);
      } else {
        $(element).append('<span class="icon icon85"></span>')
        this.itemObj.attr("couponPrice", $(element).attr('data-price'));
        var shouldPay = this.itemObj.attr('orderFeeItem.actualTotalFee') - this.itemObj.attr('couponPrice');
          if($("#pointselected").is(":checked")){
              shouldPay = shouldPay-  ($("#pointUsed").val()*100/this.itemObj.attr('proportion'));
          }
        this.itemObj.attr("orderFeeItem.shouldPay", shouldPay);
          this.itemObj.attr("getpoint", Math.floor(shouldPay/100)*this.itemObj.attr('proportion'));
          point =   shouldPay*this.itemObj.attr("proportion")/100;
          if(point > this.itemObj.attr("totalPoint")){
              point = this.itemObj.attr("totalPoint");
          }
          if(point < 0){
              point = 0;
          }
          $("#usedPoint").text(point);
      }
    },
    //获取选中优惠券的码
    getCouponCodes: function() {

      var span = $("#useCoupon").find('span.icon85'); //优惠券是否选中的标示
      var $li = $('#avaliableCoupons li').find('span.icon85');
      console.log($li.closest('li'));
      var codes = [];
      if (span.length > 0) {
        codes.push($("#useCoupon").attr('data-code'));
        return JSON.stringify(codes);
      } else if ($li.length > 0) {
        codes.push($li.closest('li').data('coupon').couponCode);
        return JSON.stringify(codes);
      } else {
        return null;
      }

    },
    //兑换优惠券
    '.btn-exCode click': function(element, event) {
      event && event.preventDefault();
      var $inputCode = $('.cart-coupon-r4');
      if ($inputCode.hasClass('hide')) {
        $inputCode.removeClass('hide');
      } else {
        $inputCode.addClass('hide');
      }
    },
    getSysInfo: function() {
      var mapKey = {
        'heike': this.options.vendorinfo.get
      }
    },
    '#submitOrder click': function(element, event) {
      var that = this;

      //防止重复提交
      if (element.hasClass("btn-disable")) {
        return false;
      }
      $('#errorTips').addClass('visuallyhidden');
      element.addClass("btn-disable");


      var selectAddr = that.options.selectReceiveAddr.getSelectedAddr();
      var isDetailInvalid = /[<>'"]/.test($.trim(selectAddr.detail));

      var isReceiverName = /先生|女士|小姐/.test($.trim(selectAddr.recName));
      if (typeof selectAddr == 'undefined' || selectAddr == false) {
        new SFMessage(null, {
          'tip': '请选择收货地址！',
          'type': 'error'
        });

        element.removeClass("btn-disable");
        return false;
      } else if (isReceiverName) {
        new SFMessage(null, {
          'tip': '请您输入真实姓名。感谢您的配合!',
          'type': 'error'
        });

        element.removeClass("btn-disable");
        return false;
      } else if (isDetailInvalid) {
        new SFMessage(null, {
          'tip': '亲，您的收货地址输入有误，不能含有< > \' \" 等特殊字符！',
          'type': 'error'
        });

        element.removeClass("btn-disable");
        return false;
      } else if (/(嘿客|门店)/.test(selectAddr.detail)) {
        new SFMessage(null, {
          'tip': "根据中国海关针对个人物品进境购物限制要求,<br />请使用家庭地址作为个人收货地址",
          'type': 'error'
        });

        element.removeClass("btn-disable");
        return false;
      }
      //校验积分
        else if($("#pointselected").is(":checked")){
            if(!(/^[1-9]+[0-9]*$/.test($("#pointUsed").val()) ||  $("#pointUsed").val() == 0)){
                new SFMessage(null, {
                    'tip': "输入的积分格式不正确",
                    'type': 'error'
                });
                element.removeClass("btn-disable");
                return false;
            }
        }

      var verifYVendorResult = that.options.vendorinfo.verifYVendor(that.itemObj.saleid);
      if (verifYVendorResult && !verifYVendorResult.result) {
        new SFMessage(null, {
          'tip': verifYVendorResult.message,
          'type': 'error'
        });

        element.removeClass("btn-disable");
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
            "items": "",
            "sysType": that.getSysType(that.itemObj.saleid),
            "sysInfo": that.options.vendorinfo.getVendorInfo(that.itemObj.saleid),
            "couponCodes": that.getCouponCodes(),
             "integral":$("#pointUsed").val(),
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
          element.removeClass("btn-disable");
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
          // that.monitor['mediav'].call(that, params);
          that.watchSubmit.call(that);

          // window.location.href = 'gotopay.html?' +
          //   $.param({"orderid": message.value,"recid": selectAddr.recId});
          window.location.replace('gotopay.html?' + $.param({
            "orderid": message.value,
            "recid": selectAddr.recId
          }));



        })
        .fail(function(error) {
          element.removeClass("btn-disable");
          new SFMessage(null, {
            'tip': that.errorMap[error] || '下单失败',
            'type': 'error'
          });
          that.initOrderRender();
          //window.location.href.reload();

        });
    },

      //积分模块是否展现
      '#point-use click': function(element, event) {
          $(element).toggleClass('active');
          $('.cart-integral-r1').toggle(300);
          $('.cart-integral-r2').toggle(300);
      },

      '#pointselected click': function(element, event){
      //    event && event.preventDefault();
          $("#pointUsed").val("0");
          $("#pointToMoney").text("-￥0.0" );

          var shouldPay = this.itemObj.attr('orderFeeItem.actualTotalFee') -this.itemObj.attr('couponPrice')-($("#pointUsed").val()*100/this.itemObj.attr('proportion'));
          this.itemObj.attr("orderFeeItem.shouldPay", shouldPay);
          this.itemObj.attr("getpoint", Math.floor(shouldPay/100)*this.itemObj.attr('proportion'));
      },

      '#pointUsed onblur': function(element, event) {
          event && event.preventDefault();

          if($("#pointselected").is(":checked")){
              if($("#pointUsed").val() == null || $("#pointUsed").val() == ""){
                  $("#pointToMoney").text("-￥0.0");
              }
              else{
                  $("#pointToMoney").text("-￥" + $("#pointUsed").val());
                  var shouldPay = this.itemObj.attr('orderFeeItem.actualTotalFee') -$("#pointUsed").val();
                  this.itemObj.attr("orderFeeItem.shouldPay", shouldPay);
                  this.itemObj.attr("getpoint", Math.floor(shouldPay/100)*this.itemObj.attr('proportion'));
              }
          }
          else{
              $("#pointToMoney").text("-￥0.0" );
              var shouldPay = this.itemObj.attr('orderFeeItem.actualTotalFee');
              this.itemObj.attr("orderFeeItem.shouldPay", shouldPay);
              this.itemObj.attr("getpoint", Math.floor(shouldPay/100)*this.itemObj.attr('proportion'));
          }
      },

      '#pointUsed keyup': function(element, event){
          event && event.preventDefault();

        if($("#pointselected").is(":checked")){
              if($("#pointUsed").val() == null || $("#pointUsed").val() == ""){
                  $("#pointToMoney").text("-￥0.0");
              }
            else  if(!(/^[1-9]+[0-9]*$/.test($("#pointUsed").val()) ||  $("#pointUsed").val() == 0)){
                        $("#pointToMoney").text("输入的积分格式不正确");
             }
             else if($("#pointUsed").val() > parseInt($("#usedPoint").text())){
                  $("#pointUsed").val(parseInt($("#usedPoint").text()));
                  $("#pointToMoney").text("-￥" + parseInt($("#usedPoint").text())/ this.itemObj.attr('proportion'));
              }
             else{
                 $("#pointToMoney").text("-￥" + $("#pointUsed").val()/ this.itemObj.attr('proportion'));
             }
         }
          else{
            $("#pointToMoney").text("-￥0.0");
            $("#pointUsed").val(0)
        }

          var shouldPay = this.itemObj.attr('orderFeeItem.actualTotalFee') -this.itemObj.attr('couponPrice')-($("#pointUsed").val()*100/this.itemObj.attr('proportion'));
          this.itemObj.attr("orderFeeItem.shouldPay", shouldPay);
          this.itemObj.attr("getpoint", Math.floor(shouldPay/100)*this.itemObj.attr('proportion'));
      },

    //是否使用优惠券交互
    '#coupon-use click': function(element, event) {
      $(element).toggleClass('active');
      $('#coupon-use-detail').toggle(300);
    },
    //更多优惠券展开收起
    '#coupon-more click': function(element, event) {
      $(element).toggleClass('active');
      if ($(element).hasClass('active')) {
        $('#coupon-more-text').text('收起');
        $('#coupons').show();
      } else {
        $('#coupon-more-text').text('展开更多');
        $('#coupons').hide();
      }
    },
    //可用优惠券列表状态切换
    '#avaliableCoupons li click': function(element, event) {
      event && event.preventDefault();
      var index = $('#avaliableCoupons li').index($(element));
      var activeTag = $(element).find('span.icon85');
      var activeHtml = '<span class="icon icon85"></span>';
      $('#useCoupon').find('span.icon85').remove();
        var point = 0;
      if (activeTag.length > 0) {
        $(element).find('span.icon85').remove();
        $(element).siblings().find('span.icon85').remove();
        //this.itemObj.orderCoupon.attr("bestCoupon", this.itemObj.orderCoupon.attr('avaliableCoupons')[0]);
        this.itemObj.attr('couponPrice', 0);
        var shouldPay = this.itemObj.attr('orderFeeItem.actualTotalFee') - this.itemObj.attr('couponPrice');
          if($("#pointselected").is(":checked")){
              shouldPay = shouldPay-  ($("#pointUsed").val()*100/this.itemObj.attr('proportion'));
          }

        this.itemObj.attr("orderFeeItem.shouldPay", shouldPay);
        this.itemObj.attr("getpoint", Math.floor(shouldPay/100)*this.itemObj.attr('proportion'));
          point =   shouldPay*this.itemObj.attr("proportion")/100;
         if(point > this.itemObj.attr("totalPoint")){
             point = this.itemObj.attr("totalPoint");
         }
          if(point < 0){
              point = 0;
          }
        $("#usedPoint").text(point);
      } else {
        $(element).children('.coupon').append(activeHtml);
        $(element).siblings().find('span.icon85').remove();
        //this.itemObj.orderCoupon.attr("bestCoupon", this.itemObj.orderCoupon.attr('avaliableCoupons')[index]);
        this.itemObj.attr('couponPrice', $(element).data('coupon').price);
        var shouldPay = this.itemObj.attr('orderFeeItem.actualTotalFee') - this.itemObj.attr('couponPrice');
          if($("#pointselected").is(":checked")){
              shouldPay = shouldPay-  ($("#pointUsed").val()*100/this.itemObj.attr('proportion'));
          }
        this.itemObj.attr("orderFeeItem.shouldPay", shouldPay);
          this.itemObj.attr("getpoint", Math.floor(shouldPay/100)*this.itemObj.attr('proportion'));
          point =   shouldPay*this.itemObj.attr("proportion")/100;
          if(point > this.itemObj.attr("totalPoint")){
              point = this.itemObj.attr("totalPoint");
          }
          if(point < 0){
              point = 0;
          }
          $("#usedPoint").text(point);
      }
    },
    //兑换优惠券
    '#useCouponCodeBtn click': function(element, event) {
      event && event.preventDefault();
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
          that.initOrderRender();
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
        });

    },

    monitor: {
      'mediav': function(params) {
        var orderid = (new Date).valueOf();

        var __src = $.cookie('_src');
        if(/^media_v/.test(__src)){
        // if (__src == 'mediav') {
          var _mvq = window._mvq || [];
          window._mvq = _mvq;
          _mvq.push(['$setAccount', 'm-123868-0']);

          _mvq.push(['$setGeneral', 'ordercreate', '', /*用户名*/ '', /*用户id*/ '']);
          _mvq.push(['$logConversion']);
          _mvq.push(['$addOrder', /*订单号*/ orderid, /*订单金额*/ this.itemObj.orderFeeItem.actualTotalFee]);

          this.itemObj.orderGoodsItemList.each(function (value, index) {
            _mvq.push(['$addItem', /*订单号*/ orderid, /*商品id*/ value.itemId, /*商品名称*/ value.goodsName, /*商品价格*/ value.price, /*商品数量*/ value.quantity, /*商品页url*/ value.detailUrl, /*商品页图片url*/ '']);
          })
          _mvq.push(['$logData']);
        }
      }
    }
  });
})