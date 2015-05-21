'use strict';

define('sf.b2c.mall.order.orderdetailcontent', [
    'can',
    'sf.b2c.mall.api.order.getOrder',
    'sf.helpers',
    'sf.b2c.mall.widget.loading',
    'sf.b2c.mall.framework.comm',
    'sf.util',
    'sf.b2c.mall.business.config',
    'sf.b2c.mall.api.sc.getUserRoutes',
    'sf.b2c.mall.widget.message',
    'moment',
    'sf.b2c.mall.api.order.confirmReceive'
  ],
  function(can, SFGetOrder, helpers, loading, FrameworkComm, Utils, SFConfig, SFGetUserRoutes, SFMessage, moment, SFConfirmReceive) {

    return can.Control.extend({
      helpers: {
        indexOfPackage: function(orderPackageItemList, options) {
          for (var i = 0; i < orderPackageItemList.length; i++) {
            return i + 1;
          };
        }
      },
      init: function(element, options) {
        this.render();
        //this.renderPackageItemInfo(0,this.options);
        //模板外要绑定事件。 todo：针对弹出层 要做一个公用组件出来
        // $('#closeExample')[0].onclick = function() {
        //   $(".orderdetail-upload").hide();
        //   $(".mask2").hide();
        //   return false;
        // }
      },

      render: function(data) {
        var that = this;
        var params = can.deparam(window.location.search.substr(1));

        var getOrder = new SFGetOrder({
          "orderId": params.orderid
        });

        var getUserRoutes = new SFGetUserRoutes({
          'bizId': params.orderid
        });

        this.options.userRoutes = new Array()

        can.when(getOrder.sendRequest())
          .done(function(data) {

            that.options.orderPackageItemList = data.orderItem.orderPackageItemList;
            var couponTypeMap = {
              "CASH": function() {
                switch (tmpOrderCouponItem.orderAction) {
                  case "COST":
                    {
                      that.options.isCostCoupon = true;
                      that.options.costCoupon = tmpOrderCouponItem;
                      break;
                    }
                  case "PRESENT":
                    {
                      that.options.isPresentCoupon = true;
                      that.options.presentCoupon = tmpOrderCouponItem;
                      break;
                    }
                }
              },
              "GIFTBAG": function() {
                that.options.isGiftBag = true;
                that.options.giftBag = tmpOrderCouponItem;
              },
              "SHAREBAG": function() {
                that.options.isShareBag = true;
                that.options.shareBag = tmpOrderCouponItem;
              }
            }
            var couponTypeHandle = function(tag) {
              var fn = couponTypeMap[tag];
              if (_.isFunction(fn)) {
                return fn.call(this)
              }
            }

            that.options.orderId = data.orderId;
            that.options.recId = data.orderItem.rcvrId;
            that.options.payType = that.payWayMap[data.orderItem.payType];
            that.options.discount = data.orderItem.discount || 0;
            that.options.isCostCoupon = false;
            that.options.isPresentCoupon = false;
            that.options.isGiftBag = false;
            that.options.isShareBag = false;
            //处理卡券信息
            if (data.orderItem.orderCouponItemList && data.orderItem.orderCouponItemList.length > 0) {
              for (var i = 0, tmpOrderCouponItem; tmpOrderCouponItem = data.orderItem.orderCouponItemList[i]; i++) {
                couponTypeHandle(tmpOrderCouponItem.couponType);
              }
            }

            that.options.orderStatus = that.statsMap[data.orderItem.orderStatus];
            that.options.nextStep = that.optionHTML[that.nextStepMap[data.orderItem.orderStatus]];

            var productShape = data.orderItem.orderGoodsItemList[0].abbreviation;

            if (productShape == 'SF-SHLK' && (data.orderItem.orderStatus == 'SHIPPED' || data.orderItem.orderStatus == 'SHIPPING')) {
              that.options.currentStepTips = that.currentStepTipsMap[data.orderItem.orderStatus + "_FRESH"];
            } else {
              that.options.currentStepTips = that.currentStepTipsMap[data.orderItem.orderStatus];
            }

            that.options.showStep = true;
            if (data.orderItem.orderStatus == 'AUTO_CANCEL' || data.orderItem.orderStatus == 'USER_CANCEL' || data.orderItem.orderStatus == 'OPERATION_CANCEL') {
              that.options.showStep = false;
            }
            //订单状态流程图
            var map = {
              'SUBMITED': '', //待支付
              'AUDITING': 'order-detail-step2', //待审核
              'SHIPPING': 'order-detail-step3', //待出库
              'SHIPPED': 'order-detail-step4', //出库中
              'COMPLETED': 'order-detail-step5' //已完成
            };
            that.options.showWhereStep = map[data.orderItem.orderStatus];
            that.options.traceList = data.orderActionTraceItemList;

            _.each(that.options.traceList, function(trace) {
              trace.operator = that.operatorMap[trace.operator] || '系统';
              if (productShape == 'SF-SHLK' && (trace.status == 'SHIPPED' || trace.status == 'SHIPPING')) {
                trace.description = that.statusDescription[trace.status + "_FRESH"];
              } else {
                trace.description = that.statusDescription[trace.status];
              }
            })

            //加入路由
            _.each(that.options.traceList, function(trace) {
              if (trace.status != 'COMPLETED' && trace.status != 'AUTO_COMPLETED') {
                that.options.userRoutes.push(trace);
              }
            })

            that.options.receiveInfo = data.orderItem.orderAddressItem;
            that.options.productList = data.orderItem.orderGoodsItemList;

            var html = can.view('templates/order/sf.b2c.mall.order.orderdetail.mustache', that.options, that.helpers);
            that.element.html(html);
            that.renderPackageItemInfo(0,that.options);
            $('.order-detail-tab li:first').addClass('active');

          })
          .then(function() {
            return getUserRoutes.sendRequest();
          })
          .done(function(routesList) {
            if (routesList && routesList.value) {
              _.each(_.filter(routesList.value, function(route) {
                return typeof route.carrierCode != 'undefined' && route.carrierCode == 'SF';
              }), function(route, index) {
                that.options.userRoutes.push({
                  "gmtHappened": moment(route.eventTime).format('YYYY/MM/DD HH:mm:ss'),
                  "description": (typeof route.position != 'undefined' ? route.position : "") + " " + route.remark,
                  "operator": "系统"
                });
                if (index == 0) {
                  that.options.mailNo = route.mailNo;
                  if (typeof that.options.mailNo != "undefined" && that.options.mailNo !== "") {
                    _.last(that.options.userRoutes).description += " ， 承运单号：" + that.options.mailNo;
                  } else {
                    _.last(that.options.userRoutes).description;
                  }

                }
              })
            }

            //增加剩下的
            _.each(that.options.traceList, function(trace) {
              if (trace.status == 'COMPLETED' || trace.status == 'AUTO_COMPLETED') {
                that.options.userRoutes.push(trace);
              }
            })

            var templates = can.view.mustache(that.showUserRoutesTemplates());
            $('#showUserRoutes').append(templates(that.options));

          })
          .fail(function(error) {
            var templates = can.view.mustache(that.showUserRoutesTemplates());
            $('#showUserRoutes').append(templates(that.options));
            console.error(error);
          })
          .then(function() {
            return getUserRoutes.sendRequest();
          })
          .done(function(routes) {
            _.each(routes.value, function(route) {
              if (typeof route.carrierCode != 'undefined' && route.carrierCode == 'SF') {
                that.options.userRoutes.push({
                  "gmtHappened": route.eventTime,
                  "description": (typeof reoute.position != 'undefined' ? reoute.position : "") + " " + reoute.remark,
                  "operator": "系统"
                });
              }
            })
          })
          .fail()
      },
      renderPackageItemInfo: function(tag, data) {
        var packageInfo = data.orderPackageItemList[tag];
        var html = can.view('templates/order/sf.b2c.mall.order.packageinfo.mustache', packageInfo);
        $('#packageItemInfo').append(html);
      },
      payWayMap: {
        'alipay': '支付宝',
        'tenpay_forex': '财付通',
        'tenpay_forex_wxsm': '微信支付',
        'lianlianpay': '快捷支付'
      },
      showUserRoutesTemplates: function() {
        return '{{#each userRoutes}}' +
          '<li class="clearfix">' +
          '<span>{{gmtHappened}}</span>' +
          '<span>{{description}}</span>' +
          '<span>{{operator}}</span>' +
          '</li>{{/each}}';
      },

      statusDescription: {
        'ORDER_EDIT': '您的收货信息已成功修改，正在等待顺丰审核',
        'SUBMITED': '您的订单已提交，请尽快完成支付',
        'AUTO_CANCEL': '超时未支付，订单自动取消',
        'USER_CANCEL': '用户取消订单成功',
        'AUDITING': '您的订单已付款成功，正在等待顺丰审核',
        'OPERATION_CANCEL': '订单取消成功',
        'BUYING': '您的订单已经审核通过，不能修改。订单进入顺丰海外采购阶段',
        // 'BUYING_EXCEPTION': '采购异常',
        'WAIT_SHIPPING': '您的订单已经审核通过，不能修改，订单正在等待仓库发货',
        'SHIPPING': '您的订单已经分配给顺丰海外仓，正在等待出库操作',
        'SHIPPED': '您的订单已从顺丰海外仓出库完成，正在进行跨境物流配送',
        'SHIPPING_FRESH': '您的订单已经分配给顺丰仓库，正在等待出库操作',
        'SHIPPED_FRESH': '您的订单已从顺丰仓库出库完成，正在进行物流配送',
        'COMPLETED': '您已确认收货，订单已完成',
        'AUTO_COMPLETED': '系统确认订单已签收超过7天，订单自动完成'
      },



      getOptionHTML: function(operationsArr) {
        var that = this;
        var result = [];
        _.each(operationsArr, function(option) {
          if (that.optionHTML[option]) {
            result.push(that.optionHTML[option]);
          }
        })

        return result.join("");
      },

      operatorMap: {
        "USER": "用户"
      },

      optionHTML: {
        "NEEDPAY": '<a href="#" class="btn btn-danger btn-small" id="pay">立即支付</a>',
        "RECEIVED": '<a href="#" class="btn btn-danger btn-small received">确认签收</a>'
      },

      statsMap: {
        'SUBMITED': '已提交',
        'AUTO_CANCEL': '自动取消',
        'USER_CANCEL': '用户取消',
        'AUDITING': '待审核',
        'OPERATION_CANCEL': '运营取消',
        'BUYING': '采购中',
        'BUYING_EXCEPTION': '采购异常',
        'WAIT_SHIPPING': '待发货',
        'SHIPPING': '正在出库',
        'LOGISTICS_EXCEPTION': '物流异常',
        'SHIPPED': '已发货',
        'COMPLETED': '已完成',
        'AUTO_COMPLETED': '自动完成'
      },

      stepMap: {
        'SUBMITED': '<li class="active"><div><h3>提交订单</h3><p></p>2014/12/23 11:34:23<p></p></div><span></span><div class="line"></div></li>',
        'AUDITING': '<li><div><h3>付款成功</h3></div><span></span><div class="line"></div></li>',
        'BUYING': '<li><div><h3>采购中</h3></div><span></span><div class="line"></div></li>',
        'SHIPPING': '<li><div><h3>商品出库</h3></div><span></span><div class="line"></div></li>',
        'COMPLETED': '<li><div><h3>订单完成</h3></div><span></span><div class="line"></div></li>'
      },

      nextStepMap: {
        'SUBMITED': 'NEEDPAY',
        'SHIPPED': 'RECEIVED'
      },

      currentStepTipsMap: {
        'SUBMITED': '尊敬的客户，我们还未收到该订单的款项，请您尽快付款。<br />' +
          '该订单会为您保留2小时（从下单时间算起），2小时后系统将自动取消未付款的订单。',
        'AUTO_CANCEL': '尊敬的客户，由于我们2小时内未收到您的订单款项，订单已被自动取消。<br />' +
          '订单取消规则：订单会为您保留2小时（从下单时间算起），2小时后系统将自动取消未付款的订单。',
        'USER_CANCEL': '尊敬的客户，您的订单已成功取消，期待您再次使用顺丰海淘。',
        'AUDITING': '尊敬的客户，您的订单正在等待顺丰海淘运营审核。',
        'OPERATION_CANCEL': '尊敬的客户，您的订单已被运营取消，期待您再次使用顺丰海淘。',
        'BUYING': '尊敬的客户，您的订单已经审核通过，不能修改。<br />' +
          '订单正在进行境外采购，请等待采购结果。',
        'WAIT_SHIPPING': '尊敬的客户，您的订单已经通过系统审核，不能修改。<br />' +
          '订单正在等待仓库发货。',
        'SHIPPING': '尊敬的客户，您的订单正在顺丰海外仓进行出库操作。<br />' +
          '网上订单已被打印，目前订单正在等待海外仓库人员进行出库处理。',
        'SHIPPED_FRESH': '尊敬的客户，您的订单已从顺丰仓库出库完成，正在进行物流配送。',
        'SHIPPING_FRESH': '尊敬的客户，您的订单已经分配给顺丰仓库。<br />' +
          '网上订单已被打印，目前订单正在等待顺丰仓库人员进行出库处理。',
        'SHIPPED': '尊敬的客户，您的订单已从顺丰海外仓出库完成，正在进行跨境物流配送。',
        'COMPLETED': '尊敬的客户，您的订单已经完成，感谢您在顺丰海淘购物。',
        'AUTO_COMPLETED': '尊敬的用户，您的订单已经签收超过7天，已自动完成。期待您再次使用顺丰海淘'
      },
      '{can.route} change': function(el, attr, how, newVal, oldVal) {
        var params = can.route.attr();
        this.renderPackageItemInfo(params.tag, this.options);
      },
      '.order-detail-tab click': function(element, event) {
        event && event.preventDefault();
        $(element).addClass('active').siblings().removeClass('active');
        var tag = $(element).attr('data-index');
        can.route.attr('tag', tag);
      },
      "#orderdetail-view click": function(element, event) {
        $(".orderdetail-upload").show();
        $(".mask2").show();
        return false;
      },

      "#closeDialog click": function(element, event) {

        $(element).parents(".register").hide(300);
        $(".mask").hide();
        return false;
      },

      '.received click': function(element, event) {
        var that = this;

        var message = new SFMessage(null, {
          'tip': '确认要签收该订单？',
          'type': 'confirm',
          'okFunction': _.bind(that.received, that, element)
        });

        return false;
      },

      received: function(element) {
        var that = this;
        var params = can.deparam(window.location.search.substr(1));
        var confirmReceive = new SFConfirmReceive({
          "subOrderId": params.suborderid
        });
        confirmReceive
          .sendRequest()
          .done(function(data) {

            var message = new SFMessage(null, {
              'okFunction': function() {
                that.render();
              },
              'tip': '确认签收成功！',
              'type': 'success'
            });

            that.render();
          })
          .fail(function(error) {

            var message = new SFMessage(null, {
              'tip': '确认签收失败！',
              'type': 'error'
            });

          })
      },

      '#pay click': function(element, event) {
        event && event.preventDefault();
        var that = this;
        var params = can.deparam(window.location.search.substr(1));

        window.open("/gotopay.html?orderid=" + params.orderid + "&recid=" + params.recid + "&otherlink=1", "_blank");
      }

    });
  })