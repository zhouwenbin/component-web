'use strict';

define('sf.b2c.mall.order.orderlistcontent', ['can'], function(can) {
  return can.Control.extend({

    /**
     * 初始化
     * @param  {DOM} element 容器element
     * @param  {Object} options 传递的参数
     */
    init: function(element, options) {debugger;
      var html = can.view('templates/order/sf.b2c.mall.order.orderlist.mustache', {});

      this.element.html(html);
    }
  });
})