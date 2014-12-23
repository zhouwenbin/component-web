'use strict';

// @description 申明命名空间
sf.util.namespace('b2c.mall.component.adv');

/**
 * @class sf.b2c.mall.adv.common
 * @author Michael.Lee (leewind19841209@gmail.com)
 * @description 统一的广告渲染模块
 */
sf.b2c.mall.component.adv = can.Control.extend({

  /**
   * @description 初始化方法，当调用new时会执行init方法
   * @param  {Dom} element 当前dom元素
   * @param  {Map} options 传递的参数
   */
  init: function (element, options) {

    this.paint(options.tag);
  },

  /**
   * @description 对页面做第一次绘制
   * @param  {String} tag 标签
   */
  paint: function (tag) {
    var action = this.requestMap[tag];
    if (_.isFunction(action)) {

      var that = this;
      can.when(action())
        .done(function (data) {
          that.render(tag, data);
        });
    }
  },

  /**
   * @description 请求的map表
   * @type {Map}
   */
  requestMap: {
    'login': sf.b2c.mall.model.adv.findLoginAdv
  },

  /**
   * @description 对页面进行渲染
   * @param {String} tag 模板名
   * @param  {Map} data 渲染页面的数据
   */
  render: function (tag, data) {
    var templateUrl = this.map[tag];
    if (templateUrl) {
      var html = can.view(templateUrl, data);
      this.element.html(html);
    }
  },

  /**
   * @description 模板的map表
   * @type {Map}
   */
  map: {
    'login': 'templates/component/sf.b2c.mall.login.adv.mustache'
  }
});