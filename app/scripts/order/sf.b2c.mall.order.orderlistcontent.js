'use strict';

define('sf.b2c.mall.order.orderlistcontent', [
    'can',
    'jquery',
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
    'sf.b2c.mall.widget.message',
    'sf.b2c.mall.api.product.findRecommendProducts'
  ],
  function(can, $, qrcode, SFGetOrderList, PaginationAdapter, Pagination, SFGetOrder, helpers, SFCancelOrder, SFRequestPayV2, SFConfirmReceive, SFOrderFn, SFGetUserRoutes, SFMessage, SFFindRecommendProducts) {

    return can.Control.extend({

      helpers: {
        //确定第一个td需要rowspan的行数（根据第一个包裹内商品数量）
        countTypeOfGoodsInPackage: function(orderGoodsItemList, options) {
          return orderGoodsItemList.length;
        },
        //包裹内商品数量
        countGoodsInPackage: function(orderGoodsItemList, options) {
          return orderGoodsItemList.length; //待修改
        },
        //每一个包裹中商品list中的第一条数据
        first: function(orderGoodsItemList, options) {
          if (orderGoodsItemList.length > 0) {
            return options.fn(orderGoodsItemList[0]);
          };
        },
        //后几个td的rowspan的行数（根据包裹数量）
        countTypeOfGoodsInOrder: function(orderPackageItemList, options) {
          return orderPackageItemList.length;
        },
        //渲染包裹中除了第一个商品以外的其他商品
        others: function(orderGoodsItemList, options) {
          if (orderGoodsItemList.length > 1) {
            return options.fn(options.contexts || this);
          };
        },
        //如果订单是已提交，展示倒计时
        isNotShowEndTime: function(orderStatus, options) {
          if (orderStatus === '已提交') {
            return options.fn(options.contexts || this);
          };
        },
        //如果订单是取消状态，展示删除订单按钮
        isShowDeleteIcon: function(orderStatus, options) {
          if (orderStatus === '自动取消' || orderStatus == '用户取消' || orderStatus == '运营取消') {
            return options.fn(options.contexts || this);
          };
        }
      },

      init: function(element, options) {
        var that = this;

        var routeParams = can.route.attr();
        if (!routeParams.page) {
          routeParams = _.extend(routeParams, {
            page: 1
          });
        }

        this.options.tab = new can.Map({
          'allorderTab': true,
          'notPayOrderListTab': false,
          'notSendOrderListTab': false,
          'notGetOrderListTab': false
        });

        var params = {
          "query": JSON.stringify({
            "status": null,
            "receiverName": that.options.searchValue,
            "orderId": that.options.searchValue,
            "pageNum": routeParams.page,
            "pageSize": 10
          })
        }

        this.render(params);
      },

      render: function(params, data) {
        var that = this;

        var getOrderList = new SFGetOrderList(params);
        getOrderList
          .sendRequest()
          .done(function(data) {
            if (data.orders) {

              that.options.orders = data.orders;
              that.options.orderListIsNotEmpty = true;
              _.each(that.options.orders, function(order) {

                that.options.notPayOrderListLength = that.options.orders.length;
                that.options.notSendOrderListLength = that.options.orders.length;
                that.options.notGetOrderListfLength = that.options.orders.length;

                order.leftTime = order.gmtCreate + 7200000 - getOrderList.getServerTime();
                setInterval(function() {
                  that.setCountDown(order.leftTime)
                }, 1000);

                order.paymentAmount = order.totalPrice - order.discount;
                order.showRouter = that.routeMap[order.orderStatus];
                order.optionHMTL = that.getOptionHTML(that.optionMap[order.orderStatus]);
                order.orderStatus = that.statsMap[order.orderStatus];
                //遍历包裹
                var lastPackageItemList = [];
                if (order.orderPackageItemList && order.orderPackageItemList.length > 0) {
                  _.each(order.orderPackageItemList, function(orderPackageItem, i) {
                    if (i !== 0) {
                      lastPackageItemList.push(orderPackageItem.orderGoodsItemList[i]);
                    };
                  })
                };
                that.options.orderGoods = lastPackageItemList;
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

              })

              var html = can.view('templates/order/sf.b2c.mall.order.orderlist.mustache', that.options, that.helpers);
              that.element.html(html);
              //分页 保留 已经调通 误删 后面设计会给样式
              that.options.page = new PaginationAdapter();
              that.options.page.format(data.page);
              new Pagination('.sf-b2c-mall-order-orderlist-pagination', that.options);

            } else {
              // 商品推荐
              var findRecommendProducts = new SFFindRecommendProducts({
                'itemId': -1,
                'size': 3
              });

              findRecommendProducts.sendRequest()
                .fail(function(error) {})
                .done(function(data) {
                  data.hasData = true;
                  if ((typeof data.value == "undefined") || (data.value && data.value.length == 0)) {
                    data.hasData = false;
                  }
                  _.each(data.value, function(item) {
                    item.linkUrl = 'http://www.sfht.com/detail' + "/" + item.itemId + ".html";
                    item.imageName = item.imageName + "@102h_102w_80Q_1x.jpg";
                  })

                  var template = can.view.mustache(that.noResultShowPageTemplate());
                  $('.noOrderShow').html(template(data));
                });
            }
          })
          .fail(function(error) {
            console.error(error);
          })
      },

      '{can.route} change': function(el, attr, how, newVal, oldVal) {
        var params = can.route.attr();
        this.render(params);
      },
      //倒计时
      setCountDown: function(leftTime) {
        var leftsecond = parseInt(leftTime / 1000);
        var day1 = Math.floor(leftsecond / (60 * 60 * 24));
        var hour = Math.floor((leftsecond - day1 * 24 * 60 * 60) / 3600);
        var minute = Math.floor((leftsecond - day1 * 24 * 60 * 60 - hour * 3600) / 60);
        var second = Math.floor(leftsecond - day1 * 24 * 60 * 60 - hour * 3600 - minute * 60);
        $('.showOrderEndTime').html(hour + "小时" + minute + "分" + second + "秒");
      },

      '.myorder-tab li click': function(element, event) {
        event && event.preventDefault();
        var that = this;
        // @todo 知道当前需要访问那个tag，并且根据tag，设置params，传给render
        var tag = $(element).attr('tag');
        this.switchTag(tag);
        var statusMap = {
          'allorderTab': null,
          'notPayOrderListTab': 'SUBMITED',
          'notSendOrderListTab': 'WAIT_SHIPPING',
          'notGetOrderListTab': 'SHIPPING'
        };
        var routeParams = can.route.attr();
        if (!routeParams.page) {
          routeParams = _.extend(routeParams, {
            page: 1
          });
        }
        var params = {
          "query": JSON.stringify({
            "status": statusMap[tag],
            "receiverName": that.options.searchValue,
            "orderId": that.options.searchValue,
            "pageNum": routeParams.page,
            "pageSize": 10
          })
        }

        this.render(params);
      },
      switchTag: function(tag) {
        var that = this;
        _.each(this.options.tab.attr(), function(value, key) {
          that.options.tab.attr(key, false);
        });

        this.options.tab.attr(tag, true);
      },
      //无订单页面展示状态
      noResultShowPageTemplate: function() {
        return '<div class="myorder-none">' +
          '<span class="icon icon89"></span>' +
          '<p>亲，您当前还没有任何订单。<br /><a href="www.sfht.com" class="text-link">去逛逛</a></p>' +
          '< /div>' +
          '{{#if hasData}}' +
          '<div class="product"><h2>大家都在买</h2><div class="mb"><ul class="clearfix product-list">' +
          '{{#each value}}' +
          '<li>' +
          '<div class="product-r1">' +
          '<a href="{{linkUrl}}><img src="{{sf.img imageName}}" alt="" ></a><span></span>' +
          '</div>' +
          '<h3><a href="{{linkUrl}}">{{productName}}</a></h3>' +
          '<div class="product-r2 clearfix">' +
          '<div class="product-r2c1 fl">' +
          '<span>￥</span><strong>{{sf.price sellingPrice}}</strong>' +
          '</div>' +
          '<div class="product-r2c2 fr"><a href="" class="icon icon90">购买</a></div>' +
          '</div>' +
          '</li>' +
          '</ul></div></div>'
      },

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
        'SUBMITED': ['NEEDPAY', 'CANCEL', 'INFO'],
        'AUTO_CANCEL': ['INFO'],
        'USER_CANCEL': ['INFO'],
        'AUDITING': ['CANCEL', 'INFO'],
        'OPERATION_CANCEL': ['INFO'],
        'BUYING': ['INFO'],
        'BUYING_EXCEPTION': ['INFO'],
        'WAIT_SHIPPING': ['INFO'],
        'SHIPPING': ['ROUTE', 'INFO'],
        'LOGISTICS_EXCEPTION': ['ROUTE', 'INFO'],
        'SHIPPED': ['INFO', 'ROUTE', 'RECEIVED'],
        'COMPLETED': ['INFO', 'ROUTE'],
        'AUTO_COMPLETED': ['INFO', 'ROUTE']
      },

      /**
       * [optionHTML 操作对应的html]
       */
      optionHTML: {
        "NEEDPAY": '<a href="#" class="btn btn-danger btn-small gotoPay">立即付款</a>',
        "CANCEL": '<a href="#" class="btn btn-normal btn-small cancelOrder">取消订单</a>',
        "RECEIVED": '<a href="#" class="btn btn-success btn-small received">确认收货</a>',
        "INFO": '<a href="#" class="myorder-link viewOrder">订单详情</a>'
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
        var subOrderId = element.parent('td').attr('data-suborderid');
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
        var orderId = element.parent('td').attr('data-orderid');
        var recid = element.parent('td').attr('data-recid');

        window.open("/gotopay.html?orderid=" + orderId + "&recid=" + recid + "&otherlink=1", "_blank");
      },

      ".viewOrder click": function(element, event) {
        var orderid = element.parent('td').attr('data-orderid');
        var suborderid = element.parent('td').attr('data-suborderid');
        var recid = element.parent('td').attr('data-recid');

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
        var orderid = element.parent('td').attr('data-orderid');
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