'use strict';

define('sf.b2c.mall.order.orderdetailcontent', [
    'can',
    'sf.b2c.mall.api.order.getOrderV2',
    'sf.helpers',
    'sf.b2c.mall.widget.loading',
    'sf.b2c.mall.framework.comm',
    'sf.util',
    'sf.b2c.mall.business.config',
    'sf.b2c.mall.widget.message',
    'moment',
    'sf.b2c.mall.api.order.confirmReceive',
    'sf.b2c.mall.api.commentGoods.findCommentStatus',
    'sf.mediav'
  ],
  function(can, SFGetOrder, helpers, loading, FrameworkComm,
    Utils, SFConfig, SFMessage, moment, SFConfirmReceive, SFFindCommentStatus, SFMediav) {

    return can.Control.extend({
      helpers: {
        indexOfPackage: function(index, options) {
          return index + 1;
        },
        isActive: function(index, options) {
          if (index === 0) {
            return 'active';
          };
        },
        isShowBackMoney: function(orderInfo, options) {
          if (orderInfo.orderItem.paymentStatus == 'REFUNDED') {
            return options.fn(options.contexts || this);
          };
        },
        showImage: function(group) {
          var array = eval(group);
          if (array && _.isArray(array)) {
            var url = array[0].replace(/.jpg/g, '.jpg@63h_63w.jpg');
            if (/^http/.test(url)) {
              return url;
            } else {
              return 'http://img0.sfht.com' + url;
            }
          } else {
            return array;
          }
        },
        'isSecGoods': function(goodsType, options) {
          if (goodsType == "SECKILL") {
            return options.fn(options.contexts || this);
          } else {
            return options.inverse(options.contexts || this);
          }
        }
      },
      init: function(element, options) {
        this.render();
      },

      watchDetail: function(data) {
        var uinfo = $.cookie('3_uinfo');
        var arr = [];
        if (uinfo) {
          arr = uinfo.split(',');
        }

        var name = arr[0];
        SFMediav.watchOrderDetail({
          name: name
        }, {
          id: (new Date()).valueOf(),
          amount: data.totalPrice
        });
      },

      render: function(data) {
        var that = this;
        var params = can.deparam(window.location.search.substr(1));
        this.orderid = params.orderid;

        var getOrder = new SFGetOrder({
          "orderId": this.orderid
        });

        var findCommentStatus = new SFFindCommentStatus({
          "ids": JSON.stringify([this.orderid]),
          "type": 0
        })

        getOrder.sendRequest()
          .done(function(data) {

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
              },
              "INTRGAL": function() {
                switch (tmpOrderCouponItem.orderAction) {
                  case "COST":
                    {
                      that.options.isCostPoint = true;
                      that.options.costPoint = tmpOrderCouponItem.price;
                      break;
                    }
                  case "PRESENT":
                    {
                      that.options.isPresentPoint = true;
                      that.options.presentPoint = tmpOrderCouponItem.price;
                      break;
                    }
                }
              }
            };

            var couponTypeHandle = function(tag) {
              var fn = couponTypeMap[tag];
              if (_.isFunction(fn)) {
                return fn.call(this)
              }
            };

            //处理卡券信息
            if (data.orderItem.orderCouponItemList && data.orderItem.orderCouponItemList.length > 0) {
              for (var i = 0, tmpOrderCouponItem; tmpOrderCouponItem = data.orderItem.orderCouponItemList[i]; i++) {
                couponTypeHandle(tmpOrderCouponItem.couponType);
              }
            }

            that.options.orderInfo = data;
            that.options.orderInfo.totalPoint = data.presentIntegral;
            that.options.gmtCreate = data.orderItem.gmtCreate;
            that.options.payType = that.payWayMap[data.orderItem.payType] || '线上支付';
            that.options.discount = data.orderItem.discount || 0;
            // that.options.isCostCoupon = false;
            // that.options.isPresentCoupon = false;
            // that.options.isGiftBag = false;
            // that.options.isShareBag = false;

            that.options.nextStep = that.optionHTML[that.nextStepMap[data.orderItem.orderStatus]];
            that.options.receiveInfo = data.orderItem.orderAddressItem;
            that.options.orderPackageItemList = data.orderItem.orderPackageItemList;
            if (typeof that.options.costPoint == "undefined" || that.options.costPoint == "") {
              that.options.costPoint = 0;
            }
            if (typeof that.options.totalPoint == "undefined" || that.options.totalPoint == "") {
              that.options.totalPoint = 0;
            }

            var html = can.view('templates/order/sf.b2c.mall.order.orderdetail.mustache', that.options, that.helpers);
            that.element.html(html);

            that.renderPackageItemInfo(0, data.orderItem);

            that.supplement();

            that.watchDetail.call(that, data);
          })
          .then(function() {
            return findCommentStatus.sendRequest()
          })
          .done(function(commentData) {

            var showCommentButton = false;

            //只要有一个包裹为签收状态，则暂时按钮
            _.each(that.options.orderPackageItemList, function(item) {
              if (item.status == "COMPLETED" || item.status == "AUTO_COMPLETED") {
                showCommentButton = true;
              }
            })

            if (showCommentButton) {
              $("#commentstep").html(that.commentOperationHTML[commentData.value[0].status]);
              that.commentSatisf = commentData.value[0].commentSatisf;
            }

          })
      },

      supplement: function() {
        var params = can.deparam(window.location.search.substr(1));
        var pkgid = params.pkgid;
        if (pkgid) {
          $(".order-detail-tab").find("li")[pkgid - 1].click();
        };

      },

      '.btn-shareorder click': function(element, event) {
        var orderId = this.orderid;
        var commentSatisf = this.commentSatisf;
        window.location.href = "/shareorder.html?orderid=" + orderId + "&commentSatisf=" + commentSatisf;
      },

      renderPackageItemInfo: function(tag, data) {
        var packageInfo = data.orderPackageItemList[tag];
        packageInfo.userRoutes = packageInfo.actionTraceItemList;

        packageInfo.orderStatus = this.statsMap[packageInfo.status];
        _.each(packageInfo.orderGoodsItemList, function(goodItem) {
          goodItem.totalPrice = goodItem.price * goodItem.quantity - goodItem.discount;
        });

        packageInfo.showStep = true;
        packageInfo.isShowLinkServer = false;
        packageInfo.isShowShippingTime = true;

        //如果订单状态是已关闭，自动取消，用户取消，运营取消，不展示订单状态流程图
        if (packageInfo.status == 'CLOSED' || packageInfo.status == 'AUTO_CANCEL' || packageInfo.status == 'USER_CANCEL' || packageInfo.status == 'OPERATION_CANCEL') {
          packageInfo.showStep = false;
        }
        //如果包裹状态是待审核，待发货，发货中，已发货，展示联系客服
        if (packageInfo.status == 'AUDITING' || packageInfo.status == 'WAIT_SHIPPING' || packageInfo.status == 'SHIPPING' || packageInfo.status == 'SHIPPED') {
          packageInfo.isShowLinkServer = true;
        }
        //如果包裹状态是自动取消，用户取消，运营取消，订单关闭，订单完成，自动完成，不展示发货仓和预计发货时间
        if (packageInfo.status == 'AUTO_CANCEL' || packageInfo.status == 'USER_CANCEL' || packageInfo.status == 'OPERATION_CANCEL' || packageInfo.status == 'CLOSED' || packageInfo.status == 'COMPLETED' || packageInfo.status == 'AUTO_COMPLETED') {
          packageInfo.isShowShippingTime = false;
        };
        //状态流程图
        var map = {
          'SUBMITED': '', //待支付
          'AUDITING': 'order-detail-step2', //待审核
          'SHIPPING': 'order-detail-step3', //待出库
          'WAIT_SHIPPING': 'order-detail-step3',
          'SHIPPED': 'order-detail-step4', //出库中
          'COMPLETED': 'order-detail-step5', //已完成
          'CLOSED': 'order-detail-step5',
          'CONSIGNED': 'order-detail-step4',
          'RECEIPTED': 'order-detail-step5',
          'AUTO_COMPLETED': 'order-detail-step5'
        };

        packageInfo.showWhereStep = map[packageInfo.status];
        var html = can.view('templates/order/sf.b2c.mall.order.packageinfo.mustache', packageInfo, this.helpers);
        $('#packageItemInfo').html(html);
        var len = $('#showUserRoutes li').length;
        if (len > 3) {
          $('#showUserRoutes li:gt(2)').hide();
        } else {
          $('.look-more').hide();
        }

      },
      /**
       * @description 查看更多物流信息
       * @return
       */
      '.look-more click': function(element, event) {
        event && event.preventDefault();
        var tag = $(element).attr('data-tag');
        if (tag == 1) {
          $(element).text('收起');
          $('#showUserRoutes li').show();
          $(element).attr('data-tag', 2);
        } else {
          $(element).text('查看更多');
          $('#showUserRoutes li:gt(2)').hide();
          $(element).attr('data-tag', 1);
        }
      },
      payWayMap: {
        'alipay': '支付宝',
        'tenpay_forex': '财付通',
        'tenpay_forex_wxsm': '微信支付',
        'lianlianpay': '快捷支付'
      },

      // statusDescription: {
      //   'ORDER_EDIT': '您的收货信息已成功修改，正在等待顺丰审核',
      //   'SUBMITED': '您的订单已提交，请尽快完成支付',
      //   'AUTO_CANCEL': '超时未支付，订单自动取消',
      //   'USER_CANCEL': '用户取消订单成功',
      //   'AUDITING': '您的订单已付款成功，正在等待顺丰审核',
      //   'OPERATION_CANCEL': '订单取消成功',
      //   'BUYING': '您的订单已经审核通过，不能修改。订单进入顺丰海外采购阶段',
      //   'WAIT_SHIPPING': '您的订单已经审核通过，不能修改，订单正在等待仓库发货',
      //   'SHIPPING': '您的订单已经分配给顺丰海外仓，正在等待出库操作',
      //   'SHIPPED': '您的订单已从顺丰海外仓出库完成，正在进行跨境物流配送',
      //   'SHIPPING_FRESH': '您的订单已经分配给顺丰仓库，正在等待出库操作',
      //   'SHIPPED_FRESH': '您的订单已从顺丰仓库出库完成，正在进行物流配送',
      //   'COMPLETED': '您已确认收货，订单已完成',
      //   'AUTO_COMPLETED': '系统确认订单已签收超过7天，订单自动完成'
      // },

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
        "NEEDPAY": '<button class="btn btn-danger btn-small" id="pay">立即支付</button>',
        "RECEIPTED": '<button class="btn btn-success btn-small received">确认签收</button>'
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
        'AUTO_COMPLETED': '自动完成',
        'CLOSED': '已关闭',
        'CONSIGNED': '已出库',
        'RECEIPTED': '已签收'

      },

      commentOperationHTML: {
        "0": '<button class="btn btn-success btn-small btn-shareorder">填写评价</button>',
        "1": '<button class="btn btn-success btn-small btn-shareorder">追加评价</button>',
        "2": '<button class="btn btn-success btn-small btn-shareorder">查看评价</button>'
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
        'RECEIPTED': 'RECEIPTED',
        'SHIPPED': 'RECEIPTED',
        'CONSIGNED': 'RECEIPTED'
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
      '.order-detail-tab li click': function(element, event) {
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
          "subOrderId": params.orderid
        });
        confirmReceive
          .sendRequest()
          .done(function(data) {

            var message = new SFMessage(null, {
              'okFunction': function() {
                window.location.href = "/shareorder.html?orderid=" + that.orderid + "&commentSatisf=" + that.commentSatisf;
              },
              'closeFunction': function() {
                that.render();
              },
              'tip': '快去分享你的使用心得吧，每个商品首个含有晒单的评价可获得100积分~',
              'type': 'confirm'
            });

            window.location.reload();
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