'use strict';

var mall = sf.util.namespace('b2c.mall');

mall.breadscrumb = can.Control.extend({

  /**
   * 初始化slide控件
   * @param  {DOM} element 容器element
   * @param  {Object} options 传递的参数
   */
  init: function (element, options) {
    this.data = options.data;
    this.render(this.data);
  },

  render: function (data) {
    var html = can.view('templates/component/sf.b2c.mall.breadscrumb.mustache')(data);
    this.element.html(html);
  }
});