'use strict';

// @description 申请命名空间
sf.util.namespace('b2c.mall.center.account');

/**
 * @class sf.b2c.mall.center.account
 * @author Michael.Lee (leewind19841209@gmail.com)
 * @description 用户中心账号信息频道
 */
sf.b2c.mall.center.account = can.Control.extend({

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
    this.paint({});
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
    this.supplement({});
  },

  /**
   * @description 对页面进行渲染
   * @param  {Map} data 渲染页面的数据
   */
  render: function (data) {
    var html = can.view('templates/center/sf.b2c.mall.center.account.mustache', data);
    this.element.html(html);
  },

  /**
   * @description supplement绘制阶段，在render之后继续执行的绘制阶段，主要处理不重要的渲染
   * @param  {Map} data 渲染页面的数据
   */
  supplement: function (data) {

    can.when(sf.b2c.mall.model.user.getUserInfo())
      .done(function (userinfo) {
        if (sf.util.access(userinfo, true)) {
          new sf.b2c.mall.center.userinfo('.sf-b2c-mall-center-userinfo', {data: userinfo.content[0]});
        }

        new sf.b2c.mall.center.address.list('.sf-b2c-mall-center-address');
      })
      .fail(function (data) {

      });
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