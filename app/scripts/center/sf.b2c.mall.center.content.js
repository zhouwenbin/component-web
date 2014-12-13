'use strict';

// @description 申请命名空间
sf.util.namespace('b2c.mall.center.content');

/**
 * @class sf.b2c.mall.center.content
 * @author Michael.Lee (leewind19841209@gmail.com)
 * @description 用户中心content控制器
 */
sf.b2c.mall.center.content = can.Control.extend({

  /**
   * @description 默认参数设置
   * @type {Map}
   */
  defaults: {
    required: true
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
  init: function (element, options) {
    // @todo 初始化操作
    can.route.ready();

    var tag = can.route.attr('type') || options.tag || 'account';
    this.paint(tag, this.defaults);
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
  paint: function (tag, data) {
    this.data = this.parse(data);

    // @todo 注册观察的数据

    this.render(tag, this.data);
  },

  /**
   * @description render渲染的map表
   * @type {Map}
   */
  renderMap: {
    'account': function (data) {
      this.options.nav.data.active('account');
      if(this.partOne){
        this.partOne.destroy();
      }
      this.partOne = new sf.b2c.mall.center.account('.sf-b2c-mall-center-content');
    },
    'binding': function (data) {
      new sf.b2c.mall.center.binding('.sf-b2c-mall-center-content');
    },
    'secret': function (data) {
      this.options.nav.data.active('secret');
      if(secret){
          secret.destroy();
      }
      var secret = new sf.b2c.mall.center.secret('.sf-b2c-mall-center-content');
    },
    'favorite': function (data) {
      new sf.b2c.mall.center.favorite('.sf-b2c-mall-center-content');
    },
    'booking': function (data) {
      this.options.nav.data.active('booking');
      if(booking){
         booking.destroy();
      }
      var booking = new sf.b2c.mall.center.booking('.sf-b2c-mall-center-content');

    }
  },

  /**
   * @description 对页面进行渲染
   * @param {String} tag 页面内容标签
   * @param  {Map} data 渲染页面的数据
   */
  render: function (tag, data) {
    var action = this.renderMap[tag];
    if (typeof action === 'function') {
      var html = action.call(this, data);
      this.element.html(html);
    }
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
  '{can.route} change': function (ev, attr, how, newVal, oldVal) {
    var tag = can.route.attr('type') || 'account';
    this.render(tag, this.data);
  }

});