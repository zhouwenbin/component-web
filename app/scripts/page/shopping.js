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
      name: '我的购物车',
      num: 1,
      tag: 'mycar'
    }, {
      name: '填写并核对订单信息',
      num: 2,
      tag: 'confirm'
    }, {
      name: '成功提交订单',
      num: 3,
      tag: 'submit'
    }],
    active: 'mycar',
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
    this.component.shopping =  new sf.b2c.mall.order.shopping.list('#sf-b2c-mall-shopping');
    this.component.bookingList = new sf.b2c.mall.order.booking.list('#sf-b2c-mall-shopping', { onOrderSubmited: _.bind(this.orderSubmit, this) });
    this.component.bookingFinish = new sf.b2c.mall.order.booking.finish('#sf-b2c-mall-shopping');

    this.paint(can.route.attr());

    this.options.car = sf.b2c.mall.adapter.shopping.car.getInstance({});
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
      this.component.navSearch = new sf.b2c.mall.component.nav.search('.sf-b2c-mall-nav');

      this.component.board = new sf.b2c.mall.widget.board('.sf-b2c-mall-shop-car-board', {
        data: this.defaults
      });

      this.element.attr('status', 'ready');
    }
  },

  /**
   * @description supplement绘制阶段，在render之后继续执行的绘制阶段，主要处理不重要的渲染
   * @param  {Map} data 渲染页面的数据
   */
  supplement: function(data) {
    var type = (data && data.type) || 'car';

    var action = this.supplementMap[type];
    if (_.isFunction(action)) {
      action.call(this);
    }
  },

  supplementMap: {
    'car': function() {

      if (this.component.board) {
        this.component.board.change({
          active: 'mycar'
        });

        var that = this;
        var skuIds = [];
        var skus = null;
        can.when(sf.b2c.mall.model.order.carGetSkuAll())
          .done(function (response) {
            if (sf.util.access(response) && response.content[0].value) {
              _.each(response.content[0].value, function(value, key, list){
                skuIds.push(value.skuId);
              });

              skus = response.content[0].value;
            }
          })
          .fail(function (data) {

          })
          .then(function () {
            return sf.b2c.mall.model.product.getSKUBaseList({skus: skuIds});
          })
          .done(function (data) {
            if (sf.util.access(data)) {
              that.options.car.format(data.content[0].value, skus);
              that.component.shopping.paint(that.options.car);
            }
          })
          .fail(function () {

          });
      } else {
        this.paint(can.route.attr());
      }
    },

    'confirm': function() {
      if (this.component.shopping) {
        this.component.board.change({
          active: 'confirm'
        });
        var shoppingProducts = _.filter(this.component.shopping.getProductList().attr(), function(value, key, list) {
          return value.selected === true;
        });

        this.component.bookingList.paint(new can.Map({
          products: shoppingProducts,
          calculate: this.options.car.calculate
        }));
      } else {
        can.route.attr({
          type: 'car'
        });
      }
    },

    'finish': function() {
      this.component.board.change({
        active: 'submit'
      });

      if (this.component.bookingList) {

        var orderInfo = this.component.bookingList.getOrderInfo();
        this.component.bookingFinish.paint({ orderInfo: orderInfo });
      }else{
        can.route.attr({
          type: 'car'
        });
      }
    }
  },

  /**
   * @description 将datamodel转化为viewmodel
   * @param  {Map} data datamodel
   * @return {Map}      viewmodel
   */
  parse: function(data) {
    return data;
  },

  orderSubmit: function () {
    this.component.navSearch.draw();
    can.route.attr({type: 'finish'});
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