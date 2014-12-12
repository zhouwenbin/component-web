'use strict';

sf.util.namespace('b2c.mall.product.list');

/**
 * @class sf.b2c.mall.product.list
 * @author Michael.Lee (leewind19841209@gmail.com)
 * @description 加载商品列表数据并且进行显示
 */
sf.b2c.mall.product.list = can.Control.extend({

  /**
   * @description 初始化方法，当调用new时会执行init方法
   * @param  {Dom} element 当前dom元素
   * @param  {Map} options 传递的参数
   */
  init: function (element, options) { },

  /**
   * @description 对页面做第一次绘制
   * @param  {Map} data 绘制页面的数据
   */
  paint: function ($dom, data) {
    this.element = $dom;
    this.render('templates/product/sf.b2c.mall.product.list.mustache', data, this.helpers);
  },

  /**
   * @description 模板专用的helper适用于mustache模板
   */
  helpers: {
    last: function (i) {
      if ( i() % 3 === 0 ) {
        return 'margin-right:0px';
      }
    },
    getUrl: function (id, options) {
      return 'detail.html?sku='+id();
    },
    thumb: function (img) {
      return 'http://img0.sfht.com/spu/'+img()+'@300h_300w_50Q_1x.jpg'
    }
  },

  /**
   * @description 对页面进行渲染
   * @param  {Map} data 渲染页面的数据
   */
  render: function (template, data, helpers) {
    var html = can.view(template, data, helpers);
    this.element.html(html);
  }

});