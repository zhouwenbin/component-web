'use strict';

define('sf.b2c.mall.order.orderlistcontent', [
    'can',
    'qrcode',
    'sf.b2c.mall.api.order.getOrderList',
    'sf.b2c.mall.adapter.pagination',
    'sf.b2c.mall.widget.pagination',
    'sf.b2c.mall.api.order.getOrder',
    'sf.helpers',
    'sf.b2c.mall.api.order.cancelOrder',
    'sf.b2c.mall.api.order.requestPayV2',
    'sf.b2c.mall.api.order.confirmReceive',
    'sf.b2c.mall.order.fn',
    'sf.b2c.mall.api.sc.getUserRoutes',
    'sf.b2c.mall.widget.message'
  ],
  function(can, qrcode, SFGetOrderList, PaginationAdapter, Pagination, SFGetOrder, helpers, SFCancelOrder, SFRequestPayV2, SFConfirmReceive, SFOrderFn, SFGetUserRoutes, SFMessage) {

    return can.Control.extend({

      /**
       * 初始化
       * @param  {DOM} element 容器element
       * @param  {Object} options 传递的参数
       */
      init: function(element, options) {
        this.render();
      },

      /**
       * [render 渲染]
       * @param  {[type]} data 数据
       */
      render: function(data) {
        var that = this;

        var routeParams = can.route.attr();
        if (!routeParams.page) {
          routeParams = _.extend(routeParams, {
            page: 1
          });
        }

        var params = {
          "query": JSON.stringify({
            "status": null,
            "receiverName": that.options.searchValue,
            "orderId": that.options.searchValue,
            "pageNum": routeParams.page,
            "pageSize": 10
          })
        }

        var getOrderList = new SFGetOrderList(params);
        getOrderList
          .sendRequest()
          .done(function(data) {
            if (data.orders) {
              //所有订单
              that.options.orderlist = data.orders;
              //代付款
              that.options.notPayOrderList = [];
              //待发货
              that.options.notSendOrderList = [];
              //待收货           
              that.options.notGetOrderList = [];
              _.each(that.options.orderlist, function(order) {
                if (order.orderStatus == 'SUBMITED') {
                  that.options.notPayOrderList.push(order);
                };
                if (order.orderStatus == 'WAIT_SHIPPING') {
                  that.options.notSendOrderList.push(order);
                };
                if (order.orderStatus == 'SHIPPING' || order.orderStatus == 'SHIPPED') {
                  that.options.notGetOrderList.push(order);
                };
                //如果订单状态是自动取消、运营取消和用户取消，则该订单可以删除
                if (order.orderStatus == 'AUTO_CANCEL' || order.orderStatus == 'USER_CANCEL' || order.orderStatus == 'OPERATION_CANCEL') {
                  that.options.isOrderDeleted = true;
                }else{
                  that.options.isOrderDeleted = false;
                }

                if (typeof order.orderGoodsItemList[0] !== 'undefined') {
                  order.goodsName = order.orderGoodsItemList[0].goodsName;
                  order.itemId =  order.orderGoodsItemList[0].itemId;
                  if (order.orderGoodsItemList[0].imageUrl == "" || null == order.orderGoodsItemList[0].imageUrl) {
                    order.imageUrl = "http://www.sfht.com/img/no.png";
                  } else {
                    order.imageUrl = JSON.parse(order.orderGoodsItemList[0].imageUrl)[0];
                  }
                  if (typeof order.orderGoodsItemList[0].spec !== 'undefined') {
                    order.spec = order.orderGoodsItemList[0].spec.split(',').join("&nbsp;/&nbsp;");
                  }
                  order.optionHMTL = that.getOptionHTML(that.optionMap[order.orderStatus]);
                  order.showRouter = that.routeMap[order.orderStatus];
                  order.orderStatus = that.statsMap[order.orderStatus];
                  //order.needUploadIDCardHTML = that.uploadIDCardTemplateMap[order.rcvrState];
                  order.paymentAmount = order.totalPrice - order.discount;
                  //卡券处理

                  if (order.orderCouponItemList && order.orderCouponItemList.length > 0) {
                    _.each(order.orderCouponItemList, function(coupon) {
                      if (coupon.couponType == "SHAREBAG") {
                        order.isShareBag = true;
                        order.shareBag = coupon;
                      }
                    });
                  } else {
                    order.isShareBag = false;
                  }
                }
              })
              
              //显示nav上代付款，待发货，待收货数量
              that.options.notPayOrderListLength = that.options.notPayOrderList.length;
              that.options.notSendOrderListLength = that.options.notSendOrderList.length;
              that.options.notGetOrderListfLength = that.options.notGetOrderList.length;
              that.options.orderListIsNotEmpty = (that.options.orderlist.length > 0);
              that.options.notPayOrderListIsNotEmpty = (that.options.notPayOrderList.length > 0);
              that.options.notSendOrderListIsNotEmpty = (that.options.notSendOrderList.length > 0);
              that.options.notGetOrderListIsNotEmpty = (that.options.notGetOrderList.length > 0);

              var html = can.view('templates/order/sf.b2c.mall.order.orderlist.mustache', that.options);
              that.element.html(html);
            } else {

              //没有订单时的展示状态
              that.options.notPayOrderListLength = 0;
              that.options.notSendOrderListLength = 0;
              that.options.notGetOrderListfLength = 0;
              that.options.orderListIsNotEmpty = false;
              that.options.notPayOrderListIsNotEmpty = false;
              that.options.notSendOrderListIsNotEmpty = false;
              that.options.notGetOrderListIsNotEmpty = false;

              var html = can.view('templates/order/sf.b2c.mall.order.orderlist.mustache', that.options);
              that.element.html(html);

              // var noDataTemplate = {};
              // if (that.options.searchValue == null) {
              //   noDataTemplate = can.view.mustache(that.noDataTemplate());
              // } else {
              //   noDataTemplate = can.view.mustache(that.queryNoDataTemplate());
              // }
              // that.element.html(noDataTemplate());
            }

            //分页 保留 已经调通 误删 后面设计会给样式
            that.options.page = new PaginationAdapter();
            that.options.page.format(data.page);
            new Pagination('.sf-b2c-mall-order-orderlist-pagination', that.options);

          })
          .fail(function(error) {
            console.error(error);
          })
      },

      '{can.route} change': function(el, attr, how, newVal, oldVal) {
        var params = can.route.attr();
        this.render(params);
      },
      //状态切换
      switchTab: function(element, tab) {
        if (element.hasClass('active')) {
          return false;
        }
        //tab
        $(element).addClass('active').siblings().removeClass('active');

        var that = this;

        var map = {
          'completedTab': function() {
            $('#notCompletedTab').hide();
            $('#completedTab').show();
          },

          'notCompletedTab': function() {
            $('#completedTab').hide();
            $('#notCompletedTab').show();
          }
        }

        map[tab].apply(this);
      },
      // uploadIDCardTemplateMap: {
      //   0: '<div class="tooltip-pos">' +
      //     '<span class="icon icon26">上传身份证照片</span>' +
      //     '<div class="tooltip-outer">' +
      //     '<div class="tooltip">' +
      //     '<h4>请在“查看订单”中上传身份照片</h4>' +
      //     '<h5>为什么要传身份证？</h5>' +
      //     '<p>由于国家政策规定，您在购买海外商品时，在物流及海关清关过程中需要出示购买人的身份证复印件。</p>' +
      //     '<span class="icon icon16-3"><span class="icon icon16-4"></span></span>' +
      //     '</div>' +
      //     '</div>' +
      //     '</div>'
      // },

      // noDataTemplate: function() {
      //   return '<div class="table table-1">' +
      //     '<div class="table-h clearfix">' +
      //     '<div class="table-c1 fl">' +
      //     '订单信息' +
      //     '</div>' +
      //     '<div class="table-c2 fl">' +
      //     '收货人' +
      //     '</div>' +
      //     '<div class="table-c3 fl">' +
      //     '订单金额' +
      //     '</div>' +
      //     '<div class="table-c4 fl">' +
      //     '订单状态' +
      //     '</div>' +
      //     '<div class="table-c5 fl">' +
      //     '操作' +
      //     '</div>' +
      //     '</div>' +
      //     '<p class="table-none">您暂时没有订单哦~赶快去逛逛吧~~<a href="http://www.sfht.com/index.html">去首页</a></p>' +
      //     '</div>'
      // },

      // queryNoDataTemplate: function() {
      //   return '<div class="table table-1">' +
      //     '<div class="table-h clearfix">' +
      //     '<div class="table-c1 fl">' +
      //     '订单信息' +
      //     '</div>' +
      //     '<div class="table-c2 fl">' +
      //     '收货人' +
      //     '</div>' +
      //     '<div class="table-c3 fl">' +
      //     '订单金额' +
      //     '</div>' +
      //     '<div class="table-c4 fl">' +
      //     '订单状态' +
      //     '</div>' +
      //     '<div class="table-c5 fl">' +
      //     '操作' +
      //     '</div>' +
      //     '</div>' +
      //     '<p class="table-none">未找到相关订单记录哟！<a href="http://www.sfht.com/orderlist.html">查看全部订单</a></p>' +
      //     '</div>'
      // },

      /**
       * [description 查看物流触发鼠标悬停事件]
       * @param  {[type]} element 触发事件的元素
       * @param  {[type]} event 事件
       */
      '.find-route-list mouseover': function(element, event) {
        event && event.preventDefault();
        var that = this;

        if (element.attr('data-is-show') == 'true') {
          return;
        }

        element.attr('data-is-show', 'true');

        var getUserRoutes = new SFGetUserRoutes({
          'bizId': $(element).closest('.table-1-logistics').attr('data-orderid')
        });
        getUserRoutes
          .sendRequest()
          .done(function(data) {
            if (data.value) {

              that.options.userRoutes = data.value;

              var result = {};
              result.userRoutes = [];

              _.each(that.options.userRoutes, function(item) {
                if (typeof item.carrierCode != 'undefined' && item.carrierCode == 'SF') {
                  result.userRoutes.push(item);
                }
              });

              var len = result.userRoutes.length;
              if (len <= 5) {
                result.userRoutes = result.userRoutes.reverse();
              } else {
                result.userRoutes = result.userRoutes.slice(len - 5, len).reverse();
              }
              var template = can.view.mustache(that.getTraceListTemplate());
              $(element).siblings('.tooltip-outer').children('#traceList').html(template(result));
            }
          })
          .fail(function(error) {
            console.error(error);
          })

        return false;
      },

      /**
       * [description 鼠标移过后要隐藏该区域]
       * @param  {[type]} element 元素
       * @param  {[type]} event 事件
       */
      '.table-1-logistics mouseout': function(element, event) {
        event && event.preventDefault();
        element.removeAttr('data-is-show');
        return false;
      },

      /**
       * [getTraceListTemplate 获得查看物流模板]
       * @return {[string]} 模板字符串
       */
      getTraceListTemplate: function() {
        return '<h4>物流跟踪</h4>' +
          '<ul>' +
          '{{#each userRoutes}}' +
          '<li><div class="time fl">{{sf.time eventTime}}</div><div class="tooltip-c2">{{position}} {{remark}}</div>' +

          '{{/each}}' +
          '</ul>' +
          '<a id="find-more-info" href="#">查看全部</a>' +
          '<span class="icon icon16-3"><span class="icon icon16-4"></span></span>'
      },

      /**
       * [getOptionHTML 获得操作Html拼接]
       * @param  {[type]} operationsArr 操作数组
       * @return {[type]} 拼接html
       */
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

      /**
       * [routeMap 查看物流状态标示 哪些状态可以查看物流]
       */
      routeMap: {
        'SUBMITED': false,
        'AUTO_CANCEL': false,
        'USER_CANCEL': false,
        'AUDITING': false,
        'OPERATION_CANCEL': false,
        'BUYING': false,
        'BUYING_EXCEPTION': false,
        'WAIT_SHIPPING': false,
        'SHIPPING': false,
        'LOGISTICS_EXCEPTION': false,
        'SHIPPED': true,
        'COMPLETED': true,
        'AUTO_COMPLETED': true
      },

      /**
       * [optionMap 状态下允许执行的操作]
       */
      optionMap: {
        'SUBMITED': ['NEEDPAY', 'INFO', 'CANCEL'],
        'AUTO_CANCEL': ['INFO'],
        'USER_CANCEL': ['INFO'],
        'AUDITING': ['INFO', 'CANCEL'],
        'OPERATION_CANCEL': ['INFO'],
        'BUYING': ['INFO'],
        'BUYING_EXCEPTION': ['INFO'],
        'WAIT_SHIPPING': ['INFO'],
        'SHIPPING': ['INFO', 'ROUTE'],
        'LOGISTICS_EXCEPTION': ['INFO', 'ROUTE'],
        'SHIPPED': ['INFO', 'ROUTE', 'RECEIVED'],
        'COMPLETED': ['INFO', 'ROUTE'],
        'AUTO_COMPLETED': ['INFO', 'ROUTE']
      },

      /**
       * [optionHTML 操作对应的html]
       */
      optionHTML: {
        "NEEDPAY": '<a href="#" class="btn btn-send gotoPay">立即支付</a>',
        "INFO": '<a href="#" class="btn btn-add viewOrder">查看订单</a>',
        "CANCEL": '<a href="#" class="link cancelOrder">取消订单</a>',
        "RECEIVED": '<a href="#" class="btn btn-send received">确认签收</a>'
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
        var subOrderId = element.parent('div#operationarea').eq(0).attr('data-suborderid');
        var confirmReceive = new SFConfirmReceive({
          "subOrderId": subOrderId
        });
        confirmReceive
          .sendRequest()
          .done(function(data) {

            var message = new SFMessage(null, {
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

      '.gotoPay click': function(element, event) {
        event && event.preventDefault();

        var that = this;
        var orderId = element.parent('div#operationarea').eq(0).attr('data-orderid');
        var recid = element.parent('div#operationarea').eq(0).attr('data-recid');

        window.open("/gotopay.html?orderid=" + orderId + "&recid=" + recid + "&otherlink=1", "_blank");
      },

      ".viewOrder click": function(element, event) {
        var orderid = element.parent('div#operationarea').eq(0).attr('data-orderid');
        var suborderid = element.parent('div#operationarea').eq(0).attr('data-suborderid');
        var recid = element.parent('div#operationarea').eq(0).attr('data-recid');

        var params = can.deparam(window.location.search.substr(1));
        //@note 从cookie中获取嘿客穿越过来标示
        var heike_sign = $.cookie('1_uinfo');
        var arr = [];
        if (heike_sign) {
          arr = heike_sign.split(',');
        }
        if (arr[2] != 'undefined' && arr[2] == 'heike') {
          window.location.href = "/orderdetail.html?orderid=" + orderid + "&suborderid=" + suborderid + "&recid=" + recid;
        } else {
          window.open("/orderdetail.html?orderid=" + orderid + "&suborderid=" + suborderid + "&recid=" + recid, "_blank");
        }
      },

      "#find-more-info click": function(element, event) {
        event && event.preventDefault();

        var $el = element.closest('.table-1-logistics');
        var orderid = $el.attr('data-orderid');
        var suborderid = $el.attr('data-suborderid');
        var recid = element.closest('.table-c4').siblings('#operationarea').attr('data-recid');

        window.open("/orderdetail.html?orderid=" + orderid + "&suborderid=" + suborderid + "&recid=" + recid, "_blank");
      },
      ".cancelOrder click": function(element, event) {
        var that = this;

        var message = new SFMessage(null, {
          'tip': '确认要取消该订单？',
          'type': 'confirm',
          'okFunction': _.bind(that.cancelOrder, that, element)
        });

        return false;
      },
      "[role=shareBagLink] click": function(element, event) {
        $("[role=dialog-qrcode]").before("<div class='mask show' />");
        var url = $(element).data("url");
        this.renderLuckyMoney(url);
        $("[role=dialog-qrcode]").addClass("show");
        $(".btn-close").off("click").on("click", function() {
          $("[role=dialog-qrcode]").removeClass("show");
        })
      },
      renderLuckyMoney: function(url) {
        var qrParam = {
          width: 140,
          height: 140,
          text: url
        };

        $('#shareBagQrcode').html("").qrcode(qrParam);
      },

      cancelOrder: function(element) {
        var that = this;
        var orderid = element.parent('div#operationarea').eq(0).attr('data-orderid');
        var cancelOrder = new SFCancelOrder({
          "orderId": orderid
        });

        cancelOrder
          .sendRequest()
          .done(function(data) {
            new SFMessage(null, {
              'tip': '订单取消成功！',
              'type': 'success'
            });
            that.render();
          })
          .fail(function(error) {
            new SFMessage(null, {
              'tip': '订单取消失败！',
              'type': 'error'
            });
          })
      },

      errorMap: {
        //"4000100": 'order unkown error！',
        "4000800": '订单状态不能取消！'
      },

      receiveDErrorMap: {
        //'4000100': 'order unkown error！',
        '4000900': '子订单状态不符合确认操作！'
      },

      /**
       * [statsMap 状态对应界面词汇]
       * @type {Object}
       */
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
      }

    });
  })