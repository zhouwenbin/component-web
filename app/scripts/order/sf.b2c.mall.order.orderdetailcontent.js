'use strict';

define('sf.b2c.mall.order.orderdetailcontent', [
    'text',
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
    'sf.b2c.mall.api.finance.getRefundTax',
    'sf.mediav',
    'text!template_order_orderdetail',
    'text!template_order_packageinfo'
  ],
  function(text, can, SFGetOrder, helpers, loading, FrameworkComm,
    Utils, SFConfig, SFMessage, moment, SFConfirmReceive, SFFindCommentStatus, SFGetRefundTax, SFMediav, template_order_orderdetail, template_order_packageinfo) {

    return can.Control.extend({
      helpers: {
        //当前包裹号+1
        indexOfPackage: function(index, options) {
          return index() + 1;
        },
        //当前展示包裹
        isActive: function(index, options) {
          if (index() === 0) {
            return 'active';
          };
        },
        //是否展示退款
        isShowBackMoney: function(orderItem, options) {
          var orderItem = orderItem();
          if (orderItem.paymentStatus && orderItem.paymentStatus == 'REFUNDED') {
            return options.fn(options.contexts || this);
          }
        },
        showImage: function(group) {
          var array = eval(group());
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
        //展示消费的优惠券，以及赠送的优惠券，红包，礼包
        'sf-coupon-type': function(action, type, target, options) {
          if (action() == 'COST') {

            if (type() == 'CASH' && target == 'COSTCOUPON') {
              return options.fn(options.contexts || this);
            } else {
              return options.inverse(options.contexts || this);
            }

          } else if (action() == 'PRESENT') {

            if (type() == 'CASH' && target == 'CASH') {
              return options.fn(options.contexts || this);
            } else if (type() == 'GIFTBAG' && target == 'GIFTBAG') {
              return options.fn(options.contexts || this);
            } else if (type() == 'SHAREBAG' && target == 'SHAREBAG') {
              return options.fn(options.contexts || this);
            } else {
              return options.inverse(options.contexts || this);
            }

          } else {
            return options.inverse(options.contexts || this);
          }
        },
        'isSecGoods': function(goodsType, options) {
          if (goodsType() == "SECKILL") {
            return options.fn(options.contexts || this);
          } else {
            return options.inverse(options.contexts || this);
          }
        },
        'refundTaxStatus': function(refundTax, stateText, options) {
          var refundTax = refundTax();
          if (refundTax.state == stateText) {
            return options.fn(options.contexts || this);
          }
        },
        'sf-show-refundTax': function(refundTax, options) {
          var refundTax = refundTax();
          if (typeof refundTax == 'undefined') {
            return options.inverse(options.contexts || this);
          } else {
            if (typeof refundTax.state !== 'undefined') {
              return options.fn(options.contexts || this);
            } else {
              return options.inverse(options.contexts || this);
            }
          }
        },
        'isShowRefundTax': function(status, transporterName, options) {
          var status = status();
          if (transporterName() == 'ETK' && (status == "CONSIGNED" || status == 'COMPLETED' || status == 'AUTO_COMPLETED' || status == 'RECEIPTED')) {
            return options.fn(options.contexts || this);
          }
        },
        'sf-show-logisticsinfo': function(status, options) {
          var status = status();
          if (status == "CONSIGNED" || status == 'COMPLETED' || status == 'AUTO_COMPLETED' || status == 'RECEIPTED') {
            return options.fn(options.contexts || this);
          }
        }
      },
      init: function(element, options) {
        var params = can.deparam(window.location.search.substr(1));
        this.options = new can.Map({
          orderid: params.orderid
        });

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
        var that = this,
          orderid = this.options.attr('orderid'),
          getOrder = new SFGetOrder({
            "orderId": orderid
          }),
          findCommentStatus = new SFFindCommentStatus({
            "ids": JSON.stringify([orderid]),
            "type": 0
          });

        getOrder.sendRequest()
          .done(function(data) {
            data.costPoint = 0; //初始化积分使用量
            data.payType = that.payWayMap[data.orderItem.payType] || '线上支付';
            data.nextStep = that.optionHTML[that.nextStepMap[data.orderItem.orderStatus]];
            data.orderPackageItemList = data.orderItem.orderPackageItemList;
            _.each(data.orderItem.orderCouponItemList, function(item) {
              if (item.couponType == "INTRGAL" && item.orderAction == "COST") {
                data.costPoint = item.price
              }
            });

            that.options.attr(data);

            var renderFn = can.mustache(template_order_orderdetail);
            var html = renderFn(that.options, that.helpers);
            that.element.html(html);

            //自动切换包裹
            var params = can.route.attr();
            if (params.tag) {
              $('.order-detail-tab li').eq(params.tag).addClass('active').siblings().removeClass('active');
              that.renderPackageItemInfo(params.tag, that.options);
            } else {
              $('.order-detail-tab li').eq(0).addClass('active').siblings().removeClass('active');
              that.renderPackageItemInfo(0, that.options);
            }

            that.supplement();
            that.watchDetail.call(that, data);
          })
          .then(function() {
            return findCommentStatus.sendRequest()
          })
          .done(function(commentData) {

            that.commentStatus = commentData.value[0].status;

            var showCommentButton = false;

            //只要有一个包裹为签收状态，则展示按钮
            _.each(that.options.orderPackageItemList, function(item) {
              if (item.status == "RECEIPTED") {
                showCommentButton = true;
              }
            })

            if (showCommentButton) {
              $("#commentstep").html(that.commentOperationHTML[that.commentStatus]);
              that.commentSatisf = commentData.value[0].commentSatisf;
            }

          })
      },
      // 从订单列表过来的包裹号
      supplement: function() {
        var params = can.deparam(window.location.search.substr(1));
        var pkgid = params.pkgid;
        if (pkgid) {
          $(".order-detail-tab").find("li")[pkgid - 1].click();
        };
      },

      '.btn-shareorder click': function(element, event) {
        var orderId = this.options.attr('orderid');
        var commentSatisf = this.commentSatisf;
        window.location.href = "/shareorder.html?orderid=" + orderId + "&commentSatisf=" + commentSatisf;
      },

      renderPackageItemInfo: function(tag, data) {
        var that = this,
          map = {
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
          },
          packageInfo = data.attr('orderPackageItemList')[tag];

        _.each(packageInfo.orderGoodsItemList, function(goodItem) {
          goodItem.attr('totalPrice', goodItem.price * goodItem.quantity - goodItem.discount);
        });
        packageInfo.attr({
          'showWhereStep': map[packageInfo.status],
          'tag': tag,
          'orderStatus': this.statsMap[packageInfo.status],
          'showStep': true,
          'isShowLinkServer': false,
          'isShowShippingTime': true
        });

        //如果订单状态是已关闭，自动取消，用户取消，运营取消，不展示订单状态流程图
        if (packageInfo.status == 'CLOSED' || packageInfo.status == 'AUTO_CANCEL' || packageInfo.status == 'USER_CANCEL' || packageInfo.status == 'OPERATION_CANCEL') {
          packageInfo.attr('showStep', false);
        }
        //如果包裹状态是待审核，待发货，发货中，已发货，展示联系客服
        if (packageInfo.status == 'AUDITING' || packageInfo.status == 'WAIT_SHIPPING' || packageInfo.status == 'SHIPPING' || packageInfo.status == 'SHIPPED') {
          packageInfo.attr('isShowLinkServer', true);
        }
        //如果包裹状态是自动取消，用户取消，运营取消，订单关闭，订单完成，自动完成，不展示发货仓和预计发货时间
        if (packageInfo.status == 'AUTO_CANCEL' || packageInfo.status == 'USER_CANCEL' || packageInfo.status == 'OPERATION_CANCEL' || packageInfo.status == 'CLOSED' || packageInfo.status == 'COMPLETED' || packageInfo.status == 'AUTO_COMPLETED') {
          packageInfo.attr('isShowShippingTime', true);
        };

        //如果transporterName = etk，并且包裹状态是已出库、完成、自动完成、签收展示退税流程
        if (packageInfo.transporterName == 'ETK' && (packageInfo.status == "CONSIGNED" || packageInfo.status == 'COMPLETED' || packageInfo.status == 'AUTO_COMPLETED' || packageInfo.status == 'RECEIPTED')) {
          var getRefundTax = new SFGetRefundTax({
            bizId: packageInfo.packageNo
          });
          getRefundTax.sendRequest()
            .done(function(data) {
              packageInfo.attr('refundTax', data);
              //packageInfo.refundTax = new can.Map(data);
              var renderFn = can.mustache(template_order_packageinfo);
              var html = renderFn(packageInfo, that.helpers);
              $('#packageItemInfo').html(html);
            }).fail(function(errorCode) {

            })
        } else {
          var renderFn = can.mustache(template_order_packageinfo);
          var html = renderFn(packageInfo, that.helpers);
          $('#packageItemInfo').html(html);
        }

        var len = $('#showUserRoutes li').length;
        if (len > 3) {
          $('#showUserRoutes li:gt(2)').hide();
        } else {
          $('.look-more').hide();
        }

      },
      // 申请退税
      '.btn-refundtax click': function(element, event) {
        event && event.preventDefault();
        var params = can.deparam(window.location.search.substr(1));
        var tag = $(element).attr('data-tag')
        var gotoUrl = 'http://www.sfht.com/refund-tax.html' + '?' + $.param({
          "tag": tag,
          "orderid": params.orderid
        });
        window.location.href = gotoUrl;
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
        "0": '<button class="btn btn-normal btn-small btn-shareorder">填写评价</button>',
        "1": '<button class="btn btn-normal btn-small btn-shareorder">追加评价</button>',
        "2": '<button class="btn btn-normal btn-small btn-shareorder">查看评价</button>'
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
        $('.order-detail-tab li').eq(params.tag).addClass('active').siblings().removeClass('active');
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
        var that = this,
          orderid = this.options.attr('orderid'),
          confirmReceive = new SFConfirmReceive({
            "subOrderId": orderid
          });

        confirmReceive
          .sendRequest()
          .done(function(data) {

            if (that.commentStatus == "0") {
              var message = new SFMessage(null, {
                'okFunction': function() {
                  window.location.href = "/shareorder.html?orderid=" + orderid + "&commentSatisf=" + that.commentSatisf;
                },
                'closeFunction': function() {
                  that.render();
                },
                'tip': '快去分享你的使用心得吧，每个商品首个含有晒单的评价可获得100积分~',
                'type': 'confirm'
              });
            } else {
              var message = new SFMessage(null, {
                'okFunction': function() {
                  that.render();
                },
                'tip': '确认签收成功！',
                'type': 'success'
              });
            }

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
        var params = can.deparam(window.location.search.substr(1));

        window.open("/gotopay.html?orderid=" + params.orderid + "&recid=" + params.recid + "&otherlink=1", "_blank");
      }

    });
  })