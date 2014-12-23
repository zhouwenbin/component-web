'use strict';

// @description 申请命名空间
sf.util.namespace('b2c.mall.launcher.shopping');

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
  defaults: {},

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
  init: function (element, options) {
    // @todo 初始化操作
  },

  /**
   * @description 改变观察的数据
   * @param  {Map} data 新数据
   */
  change: function (data) {
    var viewModel = this.parse(data);

    // @todo 将改变的数据进行部署
  },

  /**
   * @description 对页面做第一次绘制
   * @param  {Map} data 绘制页面的数据
   */
  paint: function (data) {
    this.data = this.parse(data);

    // @todo 注册观察的数据

    this.render(this.data);
  },

  /**
   * @description 对页面进行渲染
   * @param  {Map} data 渲染页面的数据
   */
  render: function (data) {
    var html = can.view('', data);
    this.element.html(html);
  },

  /**
   * @description supplement绘制阶段，在render之后继续执行的绘制阶段，主要处理不重要的渲染
   * @param  {Map} data 渲染页面的数据
   */
  supplement: function (data) {

  },

  /**
   * @description 将datamodel转化为viewmodel
   * @param  {Map} data datamodel
   * @return {Map}      viewmodel
   */
  parse: function (data) {
    return data;
  },

  /**
   * @description event:
   * @param  {Dom} element 触发事件的元素
   * @param  {Event} event   事件对象
   */
  'selector click': function(element, event){

  }

});




'use strict';

sf.util.namespace('b2c.mall.launcher.shopcar');

sf.b2c.mall.launcher.shopcar = can.Control.extend({

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

  init: function() {
    this.render();
  },

  render: function() {
    // 初始化header
    new sf.b2c.mall.header('.sf-b2c-mall-header');

    // 初始化footer
    new sf.b2c.mall.footer('.sf-b2c-mall-footer');

    // 初始化nav
    new sf.b2c.mall.component.nav.search('.sf-b2c-mall-nav');

    new sf.b2c.mall.widget.board('.sf-b2c-mall-shop-car-board', {
      data: this.defaults
    });

    can.when(sf.b2c.mall.model.order.findShoppingList())
      .done(function(data) {
        new sf.b2c.mall.order.booking.list('.sf-b2c-mall-shopping', {
          products: data.list
        });
      })
      .fail(function(data) {
        // @todo 错误处理
      });
  }

});

new sf.b2c.mall.launcher.shopping();