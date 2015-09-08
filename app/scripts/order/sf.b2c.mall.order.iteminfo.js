'use strict';

define('sf.b2c.mall.order.iteminfo', [
  'text',
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
  'sf.b2c.mall.widget.message',
  'sf.b2c.mall.business.config',
  'sf.mediav',
  'sf.b2c.mall.api.order.orderPriceReCalculate',
  'text!template_order_iteminfo'
], function(text, can, store, $cookie, helpers, RegionsAdapter,
  SFSubmitOrderForAllSys, SFQueryOrderCoupon, SFOrderRender,
  SFReceiveExCode, SFGetRecAddressList, SFMessage, SFConfig, SFMediav, SFOrderPriceReCalculate, template_order_iteminfo) {

  return can.Control.extend({

    helpers: {

      'sf-should-show': function(price) {
        if (price() > 0) {
          return price() / 100
        } else {
          return '0'
        }
      },

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
      },
      'isShowSeckillIcon': function(goodsType, options) {
        if (goodsType() == 'SECKILL') {
          return options.fn(options.contexts || this);
        } else {
          return options.inverse(options.contexts || this);
        }
      },
      'sf-show-etk': function(transporterName, options) {
        if (typeof transporterName() !== 'undefined' && transporterName() === 'ETK') {
          return options.fn(options.contexts || this);
        } else {
          return options.inverse(options.contexts || this);
        }
      },
      'sf-show-firstOrderTips': function(activityDescription, options) {
        var activityDescription = activityDescription();
        if (activityDescription && activityDescription['FIRST_ORDER']) {
          return options.fn(options.contexts || this);
        }
      },
      //展示最优的优惠券
      'sf-show-bestCoupon': function(orderCouponItem, options) {
        var orderCouponItem = orderCouponItem();
        if (orderCouponItem && orderCouponItem.avaliableAmount > 0) {
          return options.fn(options.contexts || this);
        } else {
          return options.inverse(options.contexts || this);
        }
      },
      //是否展示显示更多
      'sf-show-morecoupon': function(orderCouponItem, options) {
        var orderCouponItem = orderCouponItem();
        if ((orderCouponItem.avaliableCoupons && orderCouponItem.avaliableCoupons.length > 0) || (orderCouponItem.disableCoupons && orderCouponItem.disableCoupons.length > 0)) {
          return options.fn(options.contexts || this);
        }
      },
      'sf-free-shipping': function(activityDescription, options) {
        var activityDescription = activityDescription();
        if (activityDescription && activityDescription['LOGISTICS_FEE_REDUCE']) {
          return options.fn(options.contexts || this);
        }
      },
      //是否包邮
      'sf-show-postage': function(activityDescription, goodsTotalFee, options) {
        var activityDescription = activityDescription();
        var goodsTotalFee = goodsTotalFee();
        if (goodsTotalFee > activityDescription['LOGISTICS_FEE_REDUCE']) {
          return options.fn(options.contexts || this);
        } else {
          return options.inverse(options.contexts || this);
        }
      },
      //显示邮费
      'sf-logistics-fee': function(activityDescription, options) {
        var activityDescription = activityDescription();
        return activityDescription['LOGISTICS_FEE_REDUCE'] / 100;

      },
      //显示还差多少钱才能包邮
      'sf-postage': function(activityDescription, goodsTotalFee, options) {
        var activityDescription = activityDescription();
        var goodsTotalFee = goodsTotalFee();
        return (activityDescription['LOGISTICS_FEE_REDUCE'] - goodsTotalFee) / 100;
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
      var heike_sign = $.cookie('1_uinfo'); //@note 从cookie中获取嘿客穿越过来标示
      if (heike_sign) {
        arr = heike_sign.split(',');
      }
      this.options.data = new can.Map({
        saleid: arr[2]
      });
      this.adapter = {};
      this.request();
      this.render();
    },
    render: function() {
      var that = this;
      can.when(that.initOrderRender())
        .done(function() {
          var renderFn = can.mustache(template_order_iteminfo);
          var html = renderFn(that.options.data, that.helpers);
          that.element.html(html);
          var invariableGoodshtml = can.view.mustache(that.invariableGoodsTemplate());
          $('.goodsItemArea').append(invariableGoodshtml(that.options.data));
          that.calculateUseIntegral();
          //如果用户没有录入收货地址，或者用户没有优惠券和积分不调用reCalculateOrderPrice
          if (that.options.data.attr('submitKey') && (that.options.data.attr('integral') > 0 || that.options.data.attr('orderCouponItem.avaliableAmount') > 0)) {
            that.reCalculateOrderPrice();
          }
          that.watchIteminfo.call(that);
        });
    },
    //计算本次订单可以使用的积分数（订单总价*积分比例）
    calculateUseIntegral: function() {
      if (this.options.data.attr('proportion') > 0) {
        var point = this.options.data.attr('orderFeeItem.actualTotalFee') * this.options.data.attr('proportion') / 100;
        point = (point < 0) ? 0 : point;
        if (point < this.options.data.attr('integral')) {
          this.options.data.attr('useIntegral', point);
        } else {
          this.options.data.attr('useIntegral', this.options.data.attr('integral'));
        }
      }
    },
    watchIteminfo: function() {
      var uinfo = $.cookie('3_uinfo');
      var arr = [];
      if (uinfo) {
        arr = uinfo.split(',');
      }

      var name = arr[0];

      var products = [];
      _.each(this.options.data.attr('orderPackageItemList'), function(packageInfo, index) {
        _.each(packageInfo.orderGoodsItemList, function(value) {
          products.push(value);
        });
      });

      SFMediav.watchShoppingCart({
        name: name
      }, products);
    },

    watchSubmit: function() {
      var uinfo = $.cookie('3_uinfo');
      var arr = [];
      if (uinfo) {
        arr = uinfo.split(',');
      }

      var name = arr[0];

      var products = [];
      _.each(this.options.data.attr('orderPackageItemList'), function(packageInfo, index) {
        _.each(packageInfo.orderGoodsItemList, function(value) {
          products.push(value);
        });
      });

      SFMediav.watchOrderSubmit({
        name: name
      }, {
        amount: this.options.data.attr('orderFeeItem.actualTotalFee')
      }, products);
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
    //组合购买商品条目参数
    initItemsParam: function() {
      var paramsUrl = can.deparam(window.location.search.substr(1)),
        itemStr,
        result = [],
        mainItemId,
        mainProductPrice = this.options.data.orderPackageItemList[0].orderGoodsItemList[0].price;

      if (paramsUrl.mixproduct) {
        mainItemId = JSON.parse(paramsUrl.mixproduct)[0].itemId;
        _.each(this.options.data.orderPackageItemList, function(packageItem) {
            _.each(packageItem.orderGoodsItemList, function(goodItem) {
              result.push({
                "itemId": goodItem.itemId,
                "num": 1,
                "price": goodItem.price,
                "groupKey": "group:immediately"
              });
            })
          })
          //删掉数组中第一个商品
        result.splice(0, 1);
        var mixObj = [{
          "itemId": mainItemId,
          "num": 1,
          "price": mainProductPrice,
          "saleItemList": result
        }];
        itemStr = JSON.stringify(mixObj);
      } else {
        itemStr = JSON.stringify([{
          "itemId": paramsUrl.itemid,
          "num": paramsUrl.amount,
          "price": mainProductPrice
        }]);
      }
      return itemStr;
    },
    /**
     * 初始化 OrderRender
     */
    initOrderRender: function(element, options) {
      var that = this,
        params = can.deparam(window.location.search.substr(1)),
        selectAddr = this.options.selectReceiveAddr.getSelectedAddr(),
        itemStr,
        result = [],
        mainItemId;
      if (params.mixproduct) {
        mainItemId = JSON.parse(params.mixproduct)[0].itemId;
        $.each(JSON.parse(params.mixproduct), function(index, val) {
          var obj = {
            "itemId": val.itemId,
            "num": 1,
            "groupKey": 'group:immediately'
          }
          result.push(obj);
        });
        result.splice(0, 1);
        var mixObj = [{
          "itemId": mainItemId,
          "num": 1,
          "groupKey": 'group:immediately',
          "saleItemList": result
        }];
        itemStr = JSON.stringify(mixObj);
      } else {
        itemStr = JSON.stringify([{
          "itemId": params.itemid,
          "num": params.amount
        }]);
      }
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
        items: itemStr,
        sysType: that.getSysType(that.options.data.attr('saleid')),
        sysInfo: that.options.vendorinfo.getVendorInfo(that.options.data.attr('saleid'))
      });
      return orderRender.sendRequest()
        .done(function(orderRenderItem) {

          that.processProducts(orderRenderItem);
          that.options.data.attr(orderRenderItem);
          if (that.options.data.orderCouponItem.avaliableAmount > 0) {
            //获取最优的一张优惠券
            that.options.data.attr('bestCoupon', that.options.data.orderCouponItem.avaliableCoupons[0]);
            //删除可用优惠券中的第一张，因为第一张在上面展示了 
            that.options.data.orderCouponItem.avaliableCoupons.splice(0, 1);
          };
        })
        .fail(function(errorCode) {

        });
    },
    //计算总价
    reCalculateOrderPrice: function(element, options) {
      var that = this;
      var orderPriceReCalculate = new SFOrderPriceReCalculate({
        request: JSON.stringify({
          "couponCode": that.getCouponCodes(),
          "integral": $("#pointUsed").val(),
          "submitKey": that.options.data.attr('submitKey')
        })
      });
      if (this.options.data.attr('submitKey') && (this.options.data.attr('integral') > 0 || this.options.data.attr('orderCouponItem.avaliableAmount') > 0)) {
        return orderPriceReCalculate.sendRequest()
          .done(function(data) {
            that.options.data.attr('orderFeeItem', data.orderFeeItem);
            //输入框内的积分使用量
            that.options.data.attr('usedIntegral', data.usedIntegral || 0);

            //that.calculateUseIntegral();
          })
          .fail(function(errorCode) {

          })
      };

    },

    /**
     * 加工包裹信息
     * @param 商品列表
     */
    processProducts: function(orderRenderItem) {
      //活动信息
      if (typeof orderRenderItem.activityDescription !== 'undefined' && !can.isEmptyObject(orderRenderItem.activityDescription)) {
        orderRenderItem.activityDescription = JSON.parse(orderRenderItem.activityDescription.value);
      }

      //计算商品总价
      if (orderRenderItem.orderPackageItemList.length > 0) {
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
        });
      };

      //遍历不可用商品，计算总价
      if (orderRenderItem.invariableGoodsItemList.length > 0) {
        _.each(orderRenderItem.invariableGoodsItemList, function(goodItem) {
          goodItem.totalPrice = goodItem.price * goodItem.quantity;
        });
      };

    },

    initCoupons: function(options) {
      var that = this,
        params = {
          "items": this.initItemsParam(),
          'system': that.getSysType(this.options.data.attr('saleid'))
        },
        queryOrderCoupon = new SFQueryOrderCoupon(params);
      return queryOrderCoupon.sendRequest()
        .done(function(orderCoupon) {
          $('#conpon').val('');
          that.options.data.attr('orderCouponItem', orderCoupon);
        })
        .fail(function(error) {
          console.error(error);
        });
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
      "4100907": "该商品不能使用此优惠券",
      "4001641": "积分使用失败"
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
      if (span.length > 0) {
        $(element).find('span.icon85').remove();
        this.reCalculateOrderPrice();
      } else {
        $(element).append('<span class="icon icon85"></span>')
        this.reCalculateOrderPrice();
      }
    },
    //获取选中优惠券的码
    getCouponCodes: function() {
      var span = $("#useCoupon").find('span.icon85'), //优惠券是否选中的标示
        $li = $('#avaliableCoupons li').find('span.icon85');
      if (span.length > 0) {
        return $("#useCoupon").attr('data-code');
      } else if ($li.length > 0) {
        return $li.closest('li').data('coupon').couponCode;
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

      var paramsUrl = can.deparam(window.location.search.substr(1));

      var selectAddr = that.options.selectReceiveAddr.getSelectedAddr();
      var isDetailInvalid = /[<>'"]/.test($.trim(selectAddr.detail));

      var isReceiverName = /先生|女士|小姐/.test($.trim(selectAddr.recName));
      if (typeof selectAddr == 'undefined' || selectAddr == false) {
        new SFMessage(null, {
          'tip': '请选择收货地址！',
          'type': 'error'
        });

        return false;
      } else if (isReceiverName) {
        new SFMessage(null, {
          'tip': '请您输入真实姓名。感谢您的配合!',
          'type': 'error'
        });

        return false;
      } else if (isDetailInvalid) {
        new SFMessage(null, {
          'tip': '亲，您的收货地址输入有误，不能含有< > \' \" 等特殊字符！',
          'type': 'error'
        });

        return false;
      } else if (/(嘿客|门店)/.test(selectAddr.detail)) {
        new SFMessage(null, {
          'tip': "根据中国海关针对个人物品进境购物限制要求,<br />请使用家庭地址作为个人收货地址",
          'type': 'error'
        });

        return false;
      }

      var verifYVendorResult = that.options.vendorinfo.verifYVendor(this.options.data.attr('saleid'));
      if (verifYVendorResult && !verifYVendorResult.result) {
        new SFMessage(null, {
          'tip': verifYVendorResult.message,
          'type': 'error'
        });

        return false;
      }

      var params = {
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
          "certType": "ID",
          "certNo": selectAddr.credtNum2
        }),
        "items": this.initItemsParam(),
        "sysType": that.getSysType(this.options.data.attr('saleid')),
        "sysInfo": that.options.vendorinfo.getVendorInfo(this.options.data.attr('saleid')),
        "couponCodes": JSON.stringify([that.getCouponCodes()]),
        "integral": $("#pointUsed").val(),
        "submitKey": that.options.data.attr('submitKey')
      };

      var submitOrderForAllSys = new SFSubmitOrderForAllSys(params);
      can.when(submitOrderForAllSys.sendRequest())
        .done(function(message) {
          //下单后把选中地址设为默认地址，把省市区存入localstorage中，便于详情页自动展示
          var provinceId = that.adapter.regions.getIdByName(selectAddr.provinceName);
          var cityId = that.adapter.regions.getIdBySuperreginIdAndName(provinceId, selectAddr.cityName);
          var regionId = that.adapter.regions.getIdBySuperreginIdAndName(cityId, selectAddr.regionName);

          store.set('provinceId', provinceId);
          store.set('cityId', cityId);
          store.set('regionId', regionId);

          // 对mediav的转化做监控
          // that.monitor['mediav'].call(that, params);
          that.watchSubmit.call(that);
          //用户到去支付页面：1.用户从详情页直接进入订单确认页，在去支付页面点击回退，页面返回到
          //订单确认页；2.用户从购物车进入订单确认页，在去支付页面点击回退，页面返回购物车页面。
          if (paramsUrl.from == 'shoppingcart') {
            window.location.replace('gotopay.html?' + $.param({
              "orderid": message.value,
              "recid": selectAddr.recId
            }));
          } else {
            window.location.href = 'gotopay.html?' +
              $.param({
                "orderid": message.value,
                "recid": selectAddr.recId
              });
          }
        })
        .fail(function(error) {
          element.removeClass("btn-disable");
          new SFMessage(null, {
            'tip': that.errorMap[error] || '下单失败',
            'type': 'error'
          });
          that.render();
          //window.location.href.reload();
        });
    },

    //积分模块是否展现
    '#point-use click': function(element, event) {
      $(element).toggleClass('active');
      $('.cart-integral-r1').toggle(300);
      $('.cart-integral-r2').toggle(300);
    },

    '#pointselected click': function(element, event) {
      //    event && event.preventDefault();   
      $("#pointUsed").val("0");
      $("#pointToMoney").text("-￥0.0");
      this.reCalculateOrderPrice();
    },

    '#pointUsed onblur': function(element, event) {
      event && event.preventDefault();
      var pointValue = $(element).val(); //输入使用积分数

      if ($("#pointselected").is(":checked")) {
        if (pointValue == null || pointValue == "") {
          $("#pointToMoney").text("-￥0.0");
          this.reCalculateOrderPrice();
        } else {
          $("#pointToMoney").text("-￥" + pointValue);
          this.reCalculateOrderPrice();
        }
      } else {
        $("#pointToMoney").text("-￥0.0");
        this.reCalculateOrderPrice();
      }
    },

    '#pointUsed keyup': function(element, event) {
      event && event.preventDefault();
      var that = this;
      var pointValue = $(element).val(); //输入使用积分数
      var canUsePoints = this.options.data.attr('useIntegral'); //本次订单可用积分数 
      var rateValue = this.options.data.attr('proportion'); //积分比例


      if (rateValue == 0) {
        $(element).val(0);
        $("#pointToMoney").text("-￥0");
        return false;
      }
      if ($("#pointselected")[0].checked) {
        //输入非数字字符自动转为0
        if (pointValue && !/^[1-9]+[0-9]*$/.test(pointValue)) {
          $(element).val(0);
          return false;
        }

        if (pointValue > canUsePoints) {
          can.when(that.reCalculateOrderPrice())
            .done(function() {
              var saveMoney = that.options.data.attr('usedIntegral');
              $(element).val(saveMoney);
              $("#pointToMoney").text("-￥" + saveMoney / rateValue);
            });
        } else {
          $("#pointToMoney").text("-￥" + pointValue / rateValue);
          this.reCalculateOrderPrice();
        }
      } else {
        $(element).val(0);
        $("#pointToMoney").text("-￥0.0");
        this.reCalculateOrderPrice();
      }

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

      if (activeTag.length > 0) {
        $(element).find('span.icon85').remove();
        $(element).siblings().find('span.icon85').remove();

        this.reCalculateOrderPrice();
      } else {
        $(element).children('.coupon').append(activeHtml);
        $(element).siblings().find('span.icon85').remove();

        this.reCalculateOrderPrice();
      }
    },
    //兑换优惠券
    '#useCouponCodeBtn click': function(element, event) {
      event && event.preventDefault();
      var that = this;
      var exCode = $('#conpon').val();
      var receiveExCode = new SFReceiveExCode({
        exCode: exCode
      });
      receiveExCode.sendRequest()
        .done(function(userCouponInfo) {
          can.when(that.initCoupons())
            .then(function() {

              new SFMessage(null, {
                'tip': '兑换成功！',
                'type': 'success'
              });
            });
          that.render();
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
        if (/^media_v/.test(__src)) {
          // if (__src == 'mediav') {
          var _mvq = window._mvq || [];
          window._mvq = _mvq;
          _mvq.push(['$setAccount', 'm-123868-0']);

          _mvq.push(['$setGeneral', 'ordercreate', '', /*用户名*/ '', /*用户id*/ '']);
          _mvq.push(['$logConversion']);
          _mvq.push(['$addOrder', /*订单号*/ orderid, /*订单金额*/ this.options.data.attr('orderFeeItem.actualTotalFee')]);

          _.each(this.options.data.attr('orderPackageItemList'), function(packageInfo, index) {
            _.each(packageInfo.orderGoodsItemList, function(value) {
              _mvq.push(['$addItem', /*订单号*/ orderid, /*商品id*/ value.itemId, /*商品名称*/ value.goodsName, /*商品价格*/ value.price, /*商品数量*/ value.quantity, /*商品页url*/ value.detailUrl, /*商品页图片url*/ '']);
            });
          });
          _mvq.push(['$logData']);
        }
      }
    }
  });
})