'use strict';

sf.util.namespace('b2c.mall.launcher.center.order.list');

can.route.ready();

sf.b2c.mall.launcher.center.order.list = can.Control.extend({

  helpers: {
    'sf-id-status': function (status) {
      var map = {
        '0': '未上传证件',
        '1': '已上传证件',
        '2': '证件审核通过',
        '3': '证件审核未通过'
      };

      return map[status()];
    },

    'sf-is-allow-upload-img': function (status, options) {
      if (status() == 0) {
        return options.fn(options.contexts || this);
      }else{
        return options.inverse(options.contexts || this);
      }
    },

    'sf-is-allow-reupload-img': function (status, options) {
      if (status() == 3) {
        return options.fn(options.contexts || this);
      }else{
        return options.inverse(options.contexts || this);
      }
    },

    'sf-amount': function (type, list, options) {
      if (list().attr('length') > 1 && type === 'more') {
        return options.fn(options.contexts || this);
      }else{
        return options.inverse(options.contexts || this);
      }
    },

    'sf-sum': function (price, count) {
      return ((price()*count())/100).toFixed(2);
    },

    'sf-ship': function (status, options) {
      if (status() == 'SHIPPED' || status() == 'COMPLETED') {
        return options.fn(options.scope || this);
      }else{
        return options.inverse(options.scope || this);
      }
    },

    'sf-complete': function (status, options) {
      if (status() == 'COMPLETED') {
        return options.fn(options.scope || this);
      }else{
        return options.inverse(options.scope || this);
      }
    },

    'sf-suborder-status': function (status, options) {
      var map = {
        // 'UNASSIGNED': '待处理',
        'UNASSIGNED': '',
        'PURCHASING': '采购中',
        'WAIT_SHIPPING':'待发货',
        'SHIPPED': '已发货',
        'COMPLETED':'已完成',
        'EXCEPTION':'异常'
      };

      return map[status()];
    },

    'sf-status-check': function (channel, status, options) {
      if (_.isFunction(status)) {
        status = status();
      }

      var map = {
        'undefined': 'WAIT',
        'NULL': 'WAIT',
        'SUBMITED': 'PAY',
        'AUTO_CANCEL': 'WAIT',
        'USER_CANCEL': 'WAIT',
        'AUDITING': 'WAIT',
        'OPERATION_CANCEL': 'WAIT',
        'BUYING': 'WAIT',
        'LOGISTICS_EXCEPTION': 'SENT',
        'WAIT_SHIPPING': 'WAIT',
        'SHIPPING': 'WAIT',
        'SHIPPED': 'SENT',
        'COMPLETED': 'WAIT'
      };

      var signal = map[status];

      if (signal === channel) {
        return options.fn(options.scope || this);
      }else{
        return options.inverse(options.scope|| this);
      }

    }
  },

  /**
   * @description 初始化
   */
  init: function (element, options) {
    this.component = this.options.component || {};
    this.render();
    this.supplement();
  },

  /**
   * @description 渲染
   */
  render: function () {
    this.component.header = new sf.b2c.mall.header('.sf-b2c-mall-header');
    this.component.footer = new sf.b2c.mall.footer('.sf-b2c-mall-footer');

    this.component.navSearch = new sf.b2c.mall.component.nav.search('.sf-b2c-mall-nav');

    var breadscrumb = {
      main: '首页',
      mainLink: '/',
      sub: '账户管理'
    };

    this.component.breadscrumb = new sf.b2c.mall.breadscrumb('.sf-b2c-mall-breadscrumb', {data: breadscrumb});
    this.component.nav = new sf.b2c.mall.center.nav('.sf-b2c-mall-center-nav');
    this.component.nav.change({active: 'booking'})
  },

  supplement: function () {

    // deparam过程 -- 从url中获取需要请求的sku参数
    var params = can.deparam(window.location.search.substr(1));

    if (!params.orderId) {
      window.location.href = '/center.html';
    }

    var skus = [];

    var that = this;
    can.when(sf.b2c.mall.model.order.getOrder(params), sf.b2c.mall.model.user.getIDCardUrlList())
      .done(function (data, ids) {
        if (sf.util.access(data[0]) && sf.util.access(ids[0])) {
          that.options.orderAdapter = new sf.b2c.mall.adapter.order(data[0].content[0], ids[0].content[0]);
          skus = that.options.orderAdapter.getAllProducts();
        }
      })
      .fail(function (error) {

      })
      .then(function () {
        return sf.b2c.mall.model.product.getSKUBaseList({skus: skus});
      })
      .done(function (data) {
        if (sf.util.access(data)) {
          that.options.orderAdapter.setProducts(data.content[0].value);
          var html = can.view('templates/center/sf.b2c.mall.center.order.detail.info.mustache', that.options.orderAdapter, that.helpers);
          that.element.find('.sf-order__detail').html(html);
        }
      })
      .fail(function (error) {

      });
  },

  defaults: {
    pphoto: 'images/positive.png',
    nphoto: 'images/anti.png',
    spphoto: 'images/img03.png',
    snphoto: 'images/img04.png'
  },

  '.sf-photo-upload click': function (element, event) {
    var user = new can.Map({
      credtImgUrl1: this.options.orderAdapter.order.user.credtImgUrl1 || this.defaults.pphoto,
      credtImgUrl2: this.options.orderAdapter.order.user.credtImgUrl2 || this.defaults.nphoto
    });

    this.component.idPhoto = new sf.b2c.mall.center.id.photo('#center-id-photo-editor', {
      user: user,
      onUpload: _.bind(this.onUpload, this)
    });
  },

  onUpload: function (photo) {
    var user = this.options.orderAdapter.order.user.attr();

    if (photo.credtImgUrl1) {
      user.credtImgUrl1 = photo.credtImgUrl1;
    }

    if (photo.credtImgUrl2) {
      user.credtImgUrl2 = photo.credtImgUrl2;
    }

    var that = this;
    can.when(sf.b2c.mall.model.user.updateReceiverInfo(user))
      .done(function(data) {
        if (sf.util.access(data) && data.content[0].value) {
          window.location.reload()
        }
      })
      .fail(function() {

      });
  },

  request: function (orderId) {
    var that = this;
    setTimeout(function() {
      can.when(sf.b2c.mall.model.order.getOrder({orderId: orderId}))
        .done(function (data) {

          if (sf.util.access(data, true) && data.content[0]) {
            var order = data.content[0].basicInfo;
            if (order.orderStatus == 'AUDITING') {
              window.location.href = '/center.html';
            }else{
              that.request.call(that, orderId);
            }
          }
        })
        .fail(function () {
          that.request.call(that, orderId);
        });
    }, 1000);
  },

  payErrorMap: {
    '3000001':   '支付金额非法',
    '3000002':   '支付状态不允许支付',
    '3000007':   '用户订单不正确'
  },

  /**
   * @description 点击支付
   * @param  {Dom} element
   * @param  {Event} event
   */
  '.center-buy click': function (element, event) {
    event && event.preventDefault();
    var orderInfo = element.data('order');

    var that = this;
    can.when(sf.b2c.mall.model.order.requestPayV2({orderId: orderInfo.orderId, sum: orderInfo.order.totalPrice - orderInfo.order.refundPrice, payType: 'alipay'}))
      .done(function (data) {
        if (sf.util.access(data) && data.content[0]) {
          var payinfo = data.content[0];

          element.find('#pay-form').attr('action', payinfo.url + '?' + payinfo.postBody);
          element.find('#pay-form').submit();

          // $('<form method="post" target="_blank" action="'+ payinfo.url + '?' + payinfo.postBody +'" ></form>').submit();
          that.request.call(that, orderInfo.orderId);
        }else{
          var errorCode = data.stat.stateList[0].code;
          var errorText = that.payErrorMap[errorCode.toString()] || '支付失败';
          alert(errorText);
          window.location.reload();
        }
      })
      .fail(function (error) {

      });
  },

  '.center-buy-cancel click': function (element, event) {
    event && event.preventDefault();

    var orderId = element.data('id');
    if (orderId) {
      can.when(sf.b2c.mall.model.order.cancelOrder({orderId: orderId}))
        .done(function (data) {
          if (sf.util.access(data, true) && data.content[0].value) {
            window.location.reload();
          }
        })
        .fail(function (data) {

        })
    }
  },

  '.center-buy-confirm click': function (element, event) {
    event && event.preventDefault();

    var subOrderId = element.data('id');
    if (subOrderId) {

      var that = this;
      can.when(sf.b2c.mall.model.order.confirmSubOrder({subOrderId: subOrderId}))
        .done(function (data) {
          if (sf.util.access(data, true) && data.content[0].value) {
            setTimeout(function() { window.alert('确认收货成功！'); }, 0);

            var subOrder = that.options.orderAdapter.subOrderList.filter(function (item, index, list) {
              return item.subOrderId ==  subOrderId;
            });
            subOrder[0].attr('subOrderStatus', 'COMPLETED');

            //查询order状态
            //step1 查询orderid
            var params = can.deparam(window.location.search.substr(1));
            var orderId = params.orderId;
            //step2 查询ofer状态 并进行更新操作
            setTimeout(function() {
              can.when(sf.b2c.mall.model.order.getOrder({orderId: orderId}))
                .done(function (data) {
                  if (sf.util.access(data, true) && data.content[0]) {
                    var order = data.content[0].basicInfo;

                    that.options.orderAdapter.order.attr("orderStatus", order.orderStatus);
                  }
                })
                .fail(function () {

                });
            }, 1000);

          }
        })
        .fail(function (data) {

        });
    }
  },

  '.center-buy-logistic click': function (element, event) {
    event && event.preventDefault();

    var subOrderId = element.data('id');
    var that = this;
    can.when(sf.b2c.mall.model.order.getUserRouter({subOrderId: this.options.orderAdapter.order.orderId}))
      .done(function (data) {
        if (sf.util.access(data)) {
          var items = [];
          _.each(data.content[0].value, function(item){
            items.push({
              eventTime: moment(item.eventTime).format('YYYY-MM-DD HH:mm:ss'),
              position: item.position,
              remark: item.remark
            });
          });

          that.options.orderAdapter.attr('logistic', {list: items});
        }
      })
      .fail(function (data) {

      })
  },

  close: function () {
    this.options.orderAdapter.attr('logistic', null);
  },

  '.u-icon-close click': function (element, event) {
    this.close();
  },

  '.u-btn-success click': function (element, event) {
    this.close();
  }
});

new sf.b2c.mall.launcher.center.order.list('#content');