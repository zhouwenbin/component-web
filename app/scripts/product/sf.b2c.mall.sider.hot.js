'use strict';

sf.util.namespace('b2c.mall.sider.hot');

/**
 * @class sf.b2c.mall.sider.hot
 * @author Michael.Lee (leewind19841209@gmail.com)
 * @description 加载热卖推荐商品列表数据并且进行显示
 */
sf.b2c.mall.sider.hot = can.Control.extend({

  /**
   * @description 初始化方法，当调用new时会执行init方法
   * @param  {DOM} element 当前dom元素
   * @param  {Map} options 传递的参数
   */
  init: function (element, options) {

    var direction = options.direction;

    var that = this;
    can.when(sf.b2c.mall.model.product.getSiderHotList()).then(function (data) {
      var viewModel = that.data = that.parse(data);
      that.render(viewModel, direction);
    });
  },

  templateMap: {
    'landscape':'templates/product/sf.b2c.mall.sider.hot.landscape.mustache',
    'horizontal':'templates/product/sf.b2c.mall.sider.hot.horizontal.mustache'
  },

  helpers: function(){
    var index = 0;
    return {
      last: function (list) {
        index++;
        if (index === list.length) {
          return 'margin-right:0px';
        }
      }
    };
  },

  /**
   * @description 对页面进行渲染
   * @param  {Map} data 渲染页面的数据
   */
  render: function (data, direction) {
    var template = this.templateMap[direction];
    if (template) {
      var html = can.view(template, data, this.helpers());
      this.element.html(html);
    }
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