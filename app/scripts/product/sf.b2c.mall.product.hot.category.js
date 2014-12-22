'use strict';

sf.util.namespace('b2c.mall.product.hot.category');

/**
 * @class sf.b2c.mall.product.hot.category
 * @author Michael.Lee (leewind19841209@gmail.com)
 * @description 热门商品类目 -- 首页显示
 */
sf.b2c.mall.product.hot.category = can.Control.extend({

  /**
   * @description 初始化方法，当调用new时会执行init方法
   * @param  {Dom} element 当前dom元素
   * @param  {Map} options 传递的参数
   */
  init: function(element, options) {

    this.paint(options.data);
  },

  /**
   * @description 对页面做第一次绘制
   * @param  {Map} data 绘制页面的数据
   */
  paint: function (data) {
    var viewmodel = this.parse(data);
    this.render(viewmodel);
  },

  /**
   * @description 对页面进行渲染
   * @param  {Map} data 渲染页面的数据
   */
  render: function (data) {
    var html = can.view('templates/product/sf.b2c.mall.product.hot.category.mustache')(data);
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