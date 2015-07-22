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
    'sf.b2c.mall.api.order.requestPayV2',
    'sf.b2c.mall.order.fn',
    'sf.b2c.mall.api.sc.getUserRoutes',
    'sf.b2c.mall.widget.message',
    'sf.b2c.mall.api.product.findRecommendProducts',
    'sf.b2c.mall.api.shopcart.addItemsToCart',
    'sf.b2c.mall.business.config'
  ],
  function(can, $, qrcode, SFGetOrderList, PaginationAdapter, Pagination, SFGetOrder, helpers, SFRequestPayV2, SFOrderFn, SFGetUserRoutes, SFMessage, SFFindRecommendProducts, SFAddItemToCart, SFConfig) {

    can.route.ready();

    return can.Control.extend({

      helpers: {
        //确定第一个td需要rowspan的行数（根据第一个包裹内商品数量）
        countTypeOfGoodsInPackage: function(orderGoodsItemList, options) {
          return orderGoodsItemList.length;
        },
        //包裹内商品数量
        countGoodsInPackage: function(orderGoodsItemList, options) {
          var result = 0;
          _.each(orderGoodsItemList, function(item) {
            result = result + item.quantity;
          })
          return result;
        },
        // 计算包裹号
        getPackageNum: function(index, options) {
          return index + 1;
        },
        //每一个包裹中商品list中的第一条数据
        first: function(orderGoodsItemList, index, options) {
          if (index == 0) {
            return options.fn(orderGoodsItemList[0]);
          } else {
            return options.inverse(orderGoodsItemList[index]);
          };
        },
        //每一个包裹中商品list中的第一条数据
        firstPackage: function(orderPackageItemList, index, options) {
          if (index == 0) {
            return options.fn(options.contexts || this);
          }
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
          if (orderStatus === '自动取消' || orderStatus == '用户取消' || orderStatus == '运营取消' || orderStatus == '已关闭') {
            return options.fn(options.contexts || this);
          };
        },
        needCombineOperationRow: function(orderStatus, options) {
          if (orderStatus === '已提交' || orderStatus == '待审核' || orderStatus == '已关闭') {
            return options.fn(options.contexts || this);
          } else {
            return options.inverse(options.contexts || this);
          };
        },
        showImg: function(imageUrl, options) {
          if (imageUrl == "" || null == imageUrl) {
            return "http://www.sfht.com/img/no.png";
          } else {
            return JSON.parse(imageUrl)[0] + "@144h_144w_50Q_1x.jpg";
          }
        },
        isShowOriginPrice: function(originPrice, price, options) {
          if (originPrice !== price && originPrice > price) {
            return options.fn(options.contexts || this);
          };
        },

        'sf-items-list': function(packages) {
          var array = [];
          _.each(packages, function(packageItem) {
            _.each(packageItem.orderGoodsItemList, function(good) {
              array.push({
                itemId: good.itemId,
                num: good.quantity
              });
            });
          });

          return JSON.stringify(array);
        },

        showRouter: function(status, options) {
          if (status == 'SHIPPED' || status == 'COMPLETED' || status == 'CONSIGNED' || status == 'RECEIPTED' || status == 'AUTO_COMPLETED') {
            return options.fn(options.contexts || this);
          } else {
            return options.inverse(options.contexts || this);
          }
        },

        showPackageStatus: function(status, options) {
          var statsMap = {
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
            'CONSIGNED': '已出库',
            'RECEIPTED': '已签收',
            'COMPLETED': '已完成',
            'AUTO_COMPLETED': '自动完成',
            'CLOSED': '已关闭'
          };
          return statsMap[status];
        },
        isShowActive: function(index, options) {
          if (index == 0) {
            return 'active';
          }
        },
        'isSecKillGoods': function(goodsType, options) {
          if (goodsType == "SECKILL") {
            return options.fn(options.contexts || this);
          } else {
            return options.inverse(options.contexts || this);
          };
        },
        'sf-status-show-case': SFOrderFn.helpers['sf-status-show-case']

      },

      init: function(element, options) {
        var that = this;

        this.handler = null;

        this.options.tab = new can.Map({
          'allorderTab': false,
          'notPayOrderListTab': false,
          'notSendOrderListTab': false,
          'notGetOrderListTab': false
        });

        var routeParams = can.route.attr();
        if (!routeParams.page) {
          routeParams = _.extend(routeParams, {
            page: 1
          });
        }
        if (routeParams.status) {
          _.each(this.statusMap, function(value, key, list) {
            if (value == routeParams.status) {
              this.options.tab.attr(key, true);
            }
          }, this)
        } else {
          this.options.tab.attr("allorderTab", true);
        }

        var qparams = can.deparam(window.location.search.substr(1));

        var params = {
          "query": JSON.stringify({
            "status": routeParams.status,
            "pageNum": routeParams.page,
            "pageSize": 10,
            "searchValue": qparams.q || that.options.searchValue
          })
        }

        this.render(params);

      },

      render: function(params) {

        var that = this;

        var getOrderList = new SFGetOrderList(params);
        getOrderList.sendRequest()
          .done(function(data) {

            //获取不同状态订单的数量
            that.options.waitCompletedNum = data.waitCompletedNum;
            that.options.waitPayNum = data.waitPayNum;
            that.options.waitShippingNum = data.waitShippingNum;

            if (data.orders && data.orders.length > 0) {

              that.options.orders = data.orders;

              _.each(that.options.orders, function(order, i) {

                order.leftTime = order.gmtCreate + 7200000 - getOrderList.getServerTime();

                order.paymentAmount = order.totalPrice - order.discount;
                if (typeof order.orderPackageItemList[0].orderGoodsItemList[0].goodsType !== 'undefinded' && order.orderPackageItemList[0].orderGoodsItemList[0].goodsType == 'SECKILL') {
                  order.optionHMTL = that.getOptionHTML(that.secOptionMap[order.orderStatus]);
                }else{
                  order.optionHMTL = that.getOptionHTML(that.optionMap[order.orderStatus]);
                }
                
                order.orderStatus = that.statsMap[order.orderStatus];
                //遍历包裹
                var lastPackageItemList = [];
                if (order.orderPackageItemList && order.orderPackageItemList.length > 0) {
                  _.each(order.orderPackageItemList, function(orderPackageItem, i) {
                    //orderPackageItem.showRouter = that.routeMap[orderPackageItem.status];
                    //orderPackageItem.status = that.statsMap[orderPackageItem.status];
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

                      order.optionHMTL = '<a href="#" data-url="http://m.sfht.com/luckymoneyshare.html?id=' + coupon.code + '" class="btn btn-normal btn-small" role="shareBagLink">分享红包</a>' + order.optionHMTL
                    }
                  });
                } else {
                  order.isShareBag = false;
                }

              })

              var html = can.view('templates/order/sf.b2c.mall.order.orderlist.mustache', that.options, that.helpers);
              that.element.html(html);
              that.handler = setInterval(function() {

                var endTimeArea = $('.sf-b2c-mall-order-orderlist .showOrderEndTime');
                _.each(that.options.orders, function(item, i) {

                  if (that.options.orders[i] && that.options.orders[i].gmtEnd > 0 && endTimeArea.eq(i)) {
                      that.setCountDown(endTimeArea.eq(i), that.options.orders[i].gmtEnd);
                      that.options.orders[i].gmtEnd = that.options.orders[i].gmtEnd - 1000;
                  }

                });

              }, 1000);
              //分页 保留 已经调通 误删 后面设计会给样式
              that.options.page = new PaginationAdapter();
              that.options.page.format(data.page);
              new Pagination('.sf-b2c-mall-order-orderlist-pagination', that.options);

            } else {
              $(".orderShow").hide();

              // 商品推荐
              var findRecommendProducts = new SFFindRecommendProducts({
                'itemId': -1,
                'size': 3
              });

              findRecommendProducts
                .sendRequest()
                .done(function(data) {
                  data.hasData = true;

                  if ((typeof data.value == "undefined") || (data.value && data.value.length == 0)) {
                    data.hasData = false;
                  }

                  _.each(data.value, function(item) {
                    item.linkUrl = 'http://www.sfht.com/detail' + "/" + item.itemId + ".html";
                    item.imageName = item.imageName;
                  })

                  // 带有搜索和不带搜索的结果页不一样
                  var template = null;
                  var qparams = can.deparam(window.location.search.substr(1));
                  if (qparams.q) {
                    template = can.view.mustache(that.noSearchResultShowPageTemplate());
                  } else {
                    template = can.view.mustache(that.noResultShowPageTemplate());
                  }

                  if ($('.myorder-tab').length > 0) {
                    $(".noOrderShow").html(template(data)).removeClass('hide');
                  } else {
                    var html = can.view('templates/order/sf.b2c.mall.order.orderlist.mustache', that.options, that.helpers);
                    that.element.html(html);

                    that.element.find('.orderShow').addClass('hide');
                    that.element.find(".noOrderShow").html(template(data)).removeClass('hide');
                  }
                })
                .fail(function(error) {});
            }
          })
          .fail(function(error) {
            console.error(error);
          })
          .always(function() {
            that.hasRendered = false;
          })
      },

      '{can.route} change': function(el, attr, how, newVal, oldVal) {
        var routeParams = can.route.attr();
        var qparams = can.deparam(window.location.search.substr(1));

        var params = {
          "query": JSON.stringify({
            "status": routeParams.status,
            "searchValue": qparams.q || this.options.searchValue,
            "pageNum": routeParams.page,
            "pageSize": 10
          })
        }

        // 加上标示 防止触发三次
        if (!this.hasRendered) {

          if (this.handler) {
            clearInterval(this.handler);
          }

          this.render(params);
          this.hasRendered = true;
          // 清空条件
          this.options.searchValue = null;
        }
      },
      //倒计时
      setCountDown: function(element, leftTime) {
        var leftsecond = parseInt(leftTime / 1000);
        var day1 = Math.floor(leftsecond / (60 * 60 * 24));
        var hour = Math.floor((leftsecond - day1 * 24 * 60 * 60) / 3600);
        var minute = Math.floor((leftsecond - day1 * 24 * 60 * 60 - hour * 3600) / 60);
        var second = Math.floor(leftsecond - day1 * 24 * 60 * 60 - hour * 3600 - minute * 60);
        $(element).html(hour + "小时" + minute + "分" + second + "秒");
      },

      '.myorder-tab li click': function(element, event) {
        event && event.preventDefault();
        var that = this;
        // @todo 知道当前需要访问那个tag，并且根据tag，设置params，传给render
        var tag = $(element).attr('tag');
        this.switchTag(tag);

        // 清除条件
        this.options.searchValue = null;

        window.location.href = SFConfig.setting.link.orderlist + '#!' + $.param({
          status: this.statusMap[tag],
          page: 1
        });
      },

      statusMap: {
        'allorderTab': null,
        'notPayOrderListTab': 'SUBMITED',
        'notSendOrderListTab': 'WAIT_SHIPPING',
        'notGetOrderListTab': 'SHIPPING'
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
          '<p>没有符合条件的宝贝，请尝试其他搜索条件。<br /><a href="http://www.sfht.com" class="text-link">去逛逛</a></p>' +
          '</div>' +

          '<ul>' +
          '{{#if hasData}}' +
          '<div class="product"><h2>大家都在买</h2><div class="mb"><ul class="clearfix product-list">' +
          '{{#each value}}' +
          '<li {{data "goods"}}>' +

          '<div class="product-r1">' +
          '<a href="http://www.sfht.com/detail/{{itemId}}.html"> <img style="width:240px;height:240px;margin:0;border:0;" src="{{sf.img imageName}}" alt="" ></a><span></span>' +
          '</div>' +

          '<h3><a href="http://www.sfht.com/detail/{{itemId}}.html">{{productName}}</a></h3>' +

          '<div class="product-r2 clearfix">' +

          '<div class="product-r2c1 fl">' +
          '<span>￥</span><strong>{{sf.price sellingPrice}}</strong>' +
          '</div>' +

          '<div class="product-r2c2 fr"><a href="" class="icon icon90 addCart">购买</a></div>' +

          '</div>' +
          '</li>' +
          '{{/each}}' +
          '{{/if}}' +
          '</ul>'
      },

      noSearchResultShowPageTemplate: function() {
        return '<div class="myorder-search">' +
          '<input placeholder="输入订单号搜索" id="searchNoResultValue"><button id="search">搜索</button>' +
          '</div>' +
          '<div class="myorder-none">' +
          '<span class="icon icon89"></span>' +
          '<p>无相应订单，您可以重新搜索。<br />或者<a href="http://www.sfht.com/orderlist.html" class="text-link">查看所有订单</a></p>' +
          '</div>' +

          '<ul>' +
          '{{#if hasData}}' +
          '<div class="product"><h2>大家都在买</h2><div class="mb"><ul class="clearfix product-list">' +
          '{{#each value}}' +
          '<li {{data "goods"}}>' +

          '<div class="product-r1">' +
          '<a href="http://www.sfht.com/detail/{{itemId}}.html"> <img style="width:240px;height:240px;margin:0;border:0;" src="{{sf.img imageName}}" alt="" ></a><span></span>' +
          '</div>' +

          '<h3><a href="http://www.sfht.com/detail/{{itemId}}.html">{{productName}}</a></h3>' +

          '<div class="product-r2 clearfix">' +

          '<div class="product-r2c1 fl">' +
          '<span>￥</span><strong>{{sf.price sellingPrice}}</strong>' +
          '</div>' +

          '<div class="product-r2c2 fr"><a href="" class="icon icon90 addCart">购买</a></div>' +

          '</div>' +
          '</li>' +
          '{{/each}}' +
          '{{/if}}' +
          '</ul>'
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
        //查看物流接口传入参数，区分老订单和新订单；老订单传入orderid,新订单传入packageNo
        var routeParam;
        var bizId = $(element).closest('.table-1-logistics').attr('data-package-no');
        if (bizId == '') {
          routeParam = $(element).closest('.table-1-logistics').attr('data-orderid');
        } else {
          routeParam = bizId;
        }
        var getUserRoutes = new SFGetUserRoutes({
          'bizId': routeParam
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
              $(element).siblings('.tooltip-outer').children('#traceList').html(template(result, that.helpers));
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
          '<li class="{{isShowActive @index}}"><div class="time">{{sf.time eventTime}}</div><div class="tooltip-c2">{{position}} {{remark}}</div></li>' +
          '{{/each}}' +
          '</ul>' +
          '<span class="icon icon16-3"><span class="icon icon16-4"></span></span>' +
          '<a id="find-more-info" href="#">查看全部</a>'
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
        'CONSIGNED': true,
        'RECEIPTED': true,
        'AUTO_COMPLETED': true
      },
      // 秒杀商品不展示再次购买
      secOptionMap: {
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
        'CONSIGNED': ['INFO', 'ROUTE', 'RECEIVED'],
        'COMPLETED': ['INFO', 'ROUTE'],
        'RECEIPTED': ['INFO', 'ROUTE', 'RECEIVED'],
        'CLOSED': ['INFO'],
        'AUTO_COMPLETED': ['INFO', 'ROUTE']
      },
      /**
       * [optionMap 状态下允许执行的操作]
       */
      optionMap: {
        'SUBMITED': ['NEEDPAY', 'CANCEL', 'INFO', 'REBUY'],
        'AUTO_CANCEL': ['INFO', 'REBUY'],
        'USER_CANCEL': ['INFO', 'REBUY'],
        'AUDITING': ['CANCEL', 'INFO', 'REBUY'],
        'OPERATION_CANCEL': ['INFO', 'REBUY'],
        'BUYING': ['INFO', 'REBUY'],
        'BUYING_EXCEPTION': ['INFO', 'REBUY'],
        'WAIT_SHIPPING': ['INFO', 'REBUY'],
        'SHIPPING': ['ROUTE', 'INFO', 'REBUY'],
        'LOGISTICS_EXCEPTION': ['ROUTE', 'INFO', 'REBUY'],
        'SHIPPED': ['INFO', 'ROUTE', 'RECEIVED', 'REBUY'],
        'CONSIGNED': ['INFO', 'ROUTE', 'RECEIVED', 'REBUY'],
        'COMPLETED': ['INFO', 'ROUTE', 'REBUY'],
        'RECEIPTED': ['INFO', 'ROUTE', 'RECEIVED', 'REBUY'],
        'CLOSED': ['INFO', 'REBUY'],
        'AUTO_COMPLETED': ['INFO', 'ROUTE', 'REBUY']
      },

      /**
       * [optionHTML 操作对应的html]
       */
      optionHTML: {
        "NEEDPAY": '<a href="#" class="btn btn-danger btn-small gotoPay">立即付款</a>',
        "CANCEL": '<a href="#" class="btn btn-normal btn-small cancelOrder">取消订单</a>',
        "RECEIVED": '<a href="#" class="btn btn-success btn-small received">确认收货</a>',
        "INFO": '<a href="#" class="myorder-link viewOrder">订单详情</a>',
        "REBUY": '<a href="#" class="myorder-link btn-buyagain">再次购买</a>'
      },
      //去支付
      '.gotoPay click': function(element, event) {
        event && event.preventDefault();

        var that = this;
        var orderId = element.parent('td').attr('data-orderid');
        var recid = element.parent('td').attr('data-recid');

        window.open("/gotopay.html?orderid=" + orderId + "&recid=" + recid + "&otherlink=1", "_blank");
      },

      ".viewOrder click": function(element, event) {
        event && event.preventDefault();
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
        var pkgid = $el.attr('data-pkgid');
        var suborderid = $el.attr('data-suborderid');
        var recid = element.closest('.table-c4').siblings('#operationarea').attr('data-recid');

        window.open("/orderdetail.html?orderid=" + orderid + "&pkgid=" + pkgid + "&suborderid=" + suborderid + "&recid=" + recid, "_blank");
      },

      //取消订单
      ".cancelOrder click": function(element, event) {
        var that = this;
        var orderid = $(element).parent('td').attr('data-orderid');

        var routeParams = can.route.attr();
        var qparams = can.deparam(window.location.search.substr(1));
        var params = {
          "query": JSON.stringify({
            "status": routeParams.status,
            "searchValue": qparams.q || this.options.searchValue,
            "pageNum": routeParams.page,
            "pageSize": 10
          })
        }

        var message = new SFMessage(null, {
          'tip': '确认要取消该订单？',
          'type': 'confirm',
          'okFunction': function() {
            var success = function() {
              //window.location.reload();
              that.render(params);
            };

            var error = function() {
              // @todo 错误提示
            };
            SFOrderFn.orderCancel(orderid, success, error);
          }
        });
      },

      //删除订单
      '.deleteOrders click': function(element, event) {
        var that = this;
        var orderid = $(element).parents('th').attr('data-orderid');

        var routeParams = can.route.attr();
        var qparams = can.deparam(window.location.search.substr(1));
        var params = {
          "query": JSON.stringify({
            "status": routeParams.status,
            "searchValue": qparams.q || this.options.searchValue,
            "pageNum": routeParams.page,
            "pageSize": 10
          })
        }

        var message = new SFMessage(null, {
          'tip': '确认要删除该订单？',
          'type': 'confirm',
          'okFunction': function() {
            var success = function() {
              that.render(params);
            };

            var error = function() {
              // @todo 错误提示
            };
            SFOrderFn.orderDelete(orderid, success, error);
          }
        });
      },
      //签收订单
      '.received click': function(element, event) {
        var that = this;
        var subOrderId = element.parent('td').attr('data-orderid');

        var routeParams = can.route.attr();
        var qparams = can.deparam(window.location.search.substr(1));
        var params = {
          "query": JSON.stringify({
            "status": routeParams.status,
            "searchValue": qparams.q || this.options.searchValue,
            "pageNum": routeParams.page,
            "pageSize": 10
          })
        }

        var message = new SFMessage(null, {
          'tip': '确认要签收该订单？',
          'type': 'confirm',
          'okFunction': function() {
            var success = function() {
              //window.location.reload();
              that.render(params);
            };

            var error = function() {
              // @todo 错误提示
            };
            SFOrderFn.orderConfirm(subOrderId, success, error);
          }
        });
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
        'CONSIGNED': '已出库',
        'RECEIPTED': '已签收',
        'COMPLETED': '已完成',
        'AUTO_COMPLETED': '自动完成',
        'CLOSED': '已关闭'
      },
      //再次购买
      addCart: function(array, callback) {
        var that = this;
        var itemsStr = JSON.stringify(array);
        var addItemToCart = new SFAddItemToCart({
          items: itemsStr
        });

        // 添加购物车发送请求
        addItemToCart.sendRequest()
          .done(function(data) {
            if (data.isSuccess) {
              // 更新mini购物车
              can.trigger(window, 'updateCart');

              if (_.isFunction(callback)) {
                callback();
              } else {
                window.location.reload();
              }
            } else {
              var $el = $('<div class="dialog-cart" style="z-index:9999;"><div class="dialog-cart-inner" style="width:242px;padding:20px 60px;"><p style="margin-bottom:10px;">' + data.resultMsg + '</p></div><a href="javascript:" class="icon icon108 closeDialog">关闭</a></div>');
              if ($('.dialog-cart').length > 0) {
                return false;
              };
              $(document.body).append($el);
              $('.closeDialog').click(function(event) {
                $el.remove();
              });
              setTimeout(function() {
                $el.remove();
              }, 3000);
            }
          })
          .fail(function(data) {

          })
      },
      //再次购买加入购物车
      '.btn-buyagain click': function($element, event) {
        event && event.preventDefault();
        var itemIdList = new Array();

        // var array = []

        var array = $element.parent().attr('data-all');
        this.addCart(JSON.parse(array), function() {
          window.location.href = '/shoppingcart.html';
        });

      },
      //搜索无结果加入购物车
      '.addCart click': function(element, event) {
        event && event.preventDefault();
        var itemId = $(element).closest('li').data('goods').itemId;
        this.addCart([{
          itemId: itemId,
          num: 1
        }]);
      }

    });
  })