'use strict';

// @description 申请命名空间
sf.util.namespace('b2c.mall.center.register.success');

/**
 * @class sf.b2c.mall.center.register.success
 * @author Michael.Lee (leewind19841209@gmail.com)
 * @description 用户注册成功展示
 */
sf.b2c.mall.center.register.success = can.Control.extend({

  /**
   * @description 初始化方法，当调用new时会执行init方法
   * @param  {Dom} element 当前dom元素
   * @param  {Map} options 传递的参数
   */
  init: function () {
    this.paint({});
  },

  /**
   * @description 对页面做第一次绘制
   * @param  {Map} data 绘制页面的数据
   */
  paint: function (data) {
    this.data = this.parse(data);
    this.render(this.data);
  },

  /**
   * @description 对页面进行渲染
   * @param  {Map} data 渲染页面的数据
   */
  render: function (data) {
    var html = can.view('templates/center/sf.b2c.mall.center.register.success.mustache', data);
    this.element.html(html);
  },

  active: function (data) {

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