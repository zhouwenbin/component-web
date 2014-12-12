'use strict';

sf.util.namespace('b2c.mall.product.hot.list');

/**
 * @class sf.b2c.mall.product.hot.list
 * @author Michael.Lee (leewind19841209@gmail.com)
 * @description 显示热卖产品列表 -- 首页显示
 */
sf.b2c.mall.product.hot.list = can.Control.extend({

  /**
   * @description 初始化方法，当调用new时会执行init方法
   * @param  {Dom} element 当前dom元素
   * @param  {Map} options 传递的参数
   */
  init: function(element, options) {

    var viewmodel = this.parse(options.data);
    this.render(viewmodel);

    this.bind();
  },

  /**
   * @description 对页面进行渲染
   * @param  {Map} data 渲染页面的数据
   */
  render: function (data) {
    var html = can.view('templates/product/sf.b2c.mall.product.hot.list.mustache', data);
    this.element.html(html);
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
   * @description 渲染完成之后初始化Slide控件
   */
  bind: function() {
    $('.content1-right').slide({
      titCell: '.hd ul',
      mainCell: '.bd ul',
      autoPage: true,
      effect: 'left',
      scroll: 4,
      vis: 4
    });
  }
});