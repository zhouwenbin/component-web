'use strict';

// @description 申请命名空间
sf.util.namespace('b2c.mall.center.nav');

/**
 * @class sf.b2c.mall.center.nav
 * @author Michael.Lee (leewind19841209@gmail.com)
 * @description 用户中心侧面导航栏
 */
sf.b2c.mall.center.nav = can.Control.extend({

  /**
   * @description 初始化方法，当调用new时会执行init方法
   * @param  {Dom} element 当前dom元素
   * @param  {Map} options 传递的参数
   */
  init: function () {
    // @todo 初始化操作
    this.paint(this.defaults);
  },

  /**
   * @description 默认参数设置
   * @type {Map}
   */
  defaults: {
    userImgUrl: 'images/p-img.png',
    active: can.compute('account'),
    menu: [
      { name: '账户中心', link: '/center.html#!type=account', tag: 'account' },
      { name: '我的订单', link: '/center.html#!type=booking', tag: 'booking' },
      // { name: '我的收藏', link: '/center.html#!type=favorite', tag: 'favorite' },
      // { name: '账户绑定', link: '/center.html#!type=binding', tag: 'binding' },
      { name: '密码安全', link: '/center.html#!type=secret', tag: 'secret' }
    ]
  },

  /**
   * @description 自定义mustache helpers
   * @type {Map}
   */
  helpers: {
    isActive: function (tag, active) {
      return tag == active() ? 'on' : '';
    }
  },

  /**
   * @description 改变观察的数据
   * @param  {Map} data 新数据
   */
  change: function (data) {
    var viewModel = this.parse(data);

    this.data.active(viewModel.active);
    //viewModel.destroy();

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
    var html = can.view('templates/center/sf.b2c.mall.center.nav.mustache', data, this.helpers);
    this.element.html(html);
  },

  /**
   * @description 将datamodel转化为viewmodel
   * @param  {Map} data datamodel
   * @return {Map}      viewmodel
   */
  parse: function (data) {

    return data;
  }
});