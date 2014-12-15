'use strict';

define('sf.b2c.mall.component.footer', ['can'], function(can) {
  return can.Control.extend({

    /**
     * 初始化slide控件
     * @param  {DOM} element 容器element
     * @param  {Object} options 传递的参数
     */
    init: function(element, options) {
      var html = can.view('templates/component/sf.b2c.mall.footer.mustache')({});
      this.element.html(html);
    }
  });
})