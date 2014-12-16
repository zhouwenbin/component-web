'use strict';

define('sf.b2c.mall.product.breadscrumb', ['can'], function(can) {
  return can.Control.extend({

    /**
     * 初始化slide控件
     * @param  {DOM} element 容器element
     * @param  {Object} options 传递的参数
     */
    init: function(element, options) {
      this.data = options.data;
      this.render(this.data);
    },

    render: function(data) {
      var html = can.view('templates/product/sf.b2c.mall.product.breadcrumb.mustache')(data);
      this.element.html(html);
    }
  });
})