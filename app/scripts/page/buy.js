'use strict';

// @description 申请命名空间
sf.util.namespace('b2c.mall.launcher.shopping');

can.route.ready();

/**
 * @class sf.b2c.mall.launcher.shopping
 * @author Michael.Lee (leewind19841209@gmail.com)
 * @description 加载商品列表数据并且进行显示
 */
sf.b2c.mall.launcher.shopping = can.Control.extend({

  /**
   * @description 默认参数设置
   * @type {Map}
   */
  defaults: {
    process: [{
      name: '填写并核对订单信息',
      num: 1,
      tag: 'confirm'
    }, {
      name: '成功提交订单',
      num: 2,
      tag: 'submit'
    },{
      name: '订单支付成功',
      num: 3,
      tag: 'success'
    }],
    active: 'confirm',
    classname: 'order-d fl clearfix',
    style: {
      last: 'margin-right:0px',
      common: ''
    }
  },

  /**
   * @description 自定义mustache helpers
   * @type {Map}
   */
  helpers: {},

  /**
   * @description 初始化方法，当调用new时会执行init方法
   * @param  {Dom} element 当前dom元素
   * @param  {Map} options 传递的参数
   */
  init: function(element, options) {
    this.component = this.options.component || {};

    // deparam过程 -- 从url中获取需要请求的sku参数
    var params = can.deparam(window.location.search.substr(1));

    if (!params.amount && !params.sku) {
      window.location.href = '/';
      return;
    }

    var attrs = can.route.attr();
    this.paint(_.extend(params, attrs));
  },

  /**
   * @description 对页面做第一次绘制
   * @param  {Map} data 绘制页面的数据
   */
  paint: function(data) {
    this.render({});
    this.supplement(data);
  },

  /**
   * @description 对页面进行渲染
   * @param  {Map} data 渲染页面的数据
   */
  render: function(data) {
    if (this.element.attr('status') !== 'ready') {
      // 初始化header
      new sf.b2c.mall.header('.sf-b2c-mall-header');

      // 初始化footer
      new sf.b2c.mall.footer('.sf-b2c-mall-footer');

      // 初始化nav
      new sf.b2c.mall.component.nav.search('.sf-b2c-mall-nav');

      this.component.board = new sf.b2c.mall.widget.board('.sf-b2c-mall-shop-car-board', {
        data: this.defaults
      });

      this.element.attr('status', 'ready');

      this.component.bookingList = new sf.b2c.mall.order.booking.list('#sf-b2c-mall-shopping', { onOrderSubmited: this.orderSubmit });
      this.component.bookingFinish = new sf.b2c.mall.order.booking.finish('#sf-b2c-mall-shopping');
    }
  },

  /**
   * @description supplement绘制阶段，在render之后继续执行的绘制阶段，主要处理不重要的渲染
   * @param  {Map} data 渲染页面的数据
   */
  supplement: function(data) {
    var type = (data && data.type) || 'confirm';

    var action = this.supplementMap[type];
    if (_.isFunction(action)) {
      action.call(this, data);
    }
  },

  showStockAlert: function (type, sku) {
    var map = {
      'nostock': function (sku) {
        alert('很抱歉，订单内的商品已售罄，下手要快噢！');
        window.location.href = 'detail.html?sku='+sku;
      },
      'lessstock': function (sku) {
        alert('很抱歉，订单内的商品库存不足，请重新确认订单。')
        window.location.href = 'detail.html?sku='+sku;
      }
    }

    var action = map[type];
    if (_.isFunction(action)) {
      action.call(this, sku);
    }
  },

  supplementMap: {
    'confirm': function(params) {

      this.component.board.change({
        active: 'confirm'
      });

      var that = this;
      var skuIds = [];
      var skus = null;

      if (params) {
        can.when(sf.b2c.mall.model.product.getSKUBaseList({skus: [params.sku]}))
          .done(function (data) {
            if (sf.util.access(data)) {
              that.options.car = new sf.b2c.mall.adapter.shopping.car({});
              that.options.car.format(data.content[0].value, [{ skuId: params.sku, count: params.amount }]);
              that.options.car.products.each(function (el, i) {
                el.attr('selected', true);
                if (!el.limit) {
                  that.showStockAlert.call(that, 'nostock', params.sku)
                }else if (el.limit < params.amount) {
                  that.showStockAlert.call(that, 'lessstock', params.sku)
                }
              });

              that.component.bookingList.paint(that.options.car);
            }
          })
          .fail(function () {

          });
      }
    },

    'finish': function() {
      this.component.board.change({
        active: 'submit'
      });

      var oid = can.route.attr('oid');
      var params = can.deparam(window.location.search.substr(1));

      if (this.component.bookingList && this.component.bookingList.data) {
        var orderInfo = this.component.bookingList.getOrderInfo();
        this.component.bookingFinish.paint({orderInfo: orderInfo, saleType: params.saleType})
      }else if(oid){
        window.location.href = 'center.order.detail.html?orderId='+oid;
      }else{
        window.location.href = 'center.html#!&type=booking';
      }
    }
  },

  orderSubmit: function (data) {
    can.route.attr({type: 'finish', oid: data});
  },

  /**
   * @description 将datamodel转化为viewmodel
   * @param  {Map} data datamodel
   * @return {Map}      viewmodel
   */
  parse: function(data) {
    return data;
  },

  /**
   * @description event:
   * @param  {Dom} element 触发事件的元素
   * @param  {Event} event   事件对象
   */
  '{can.route} change': function(ev, attr, how, newVal, oldVal) {
    this.supplement(can.route.attr());
  }

});

new sf.b2c.mall.launcher.shopping();