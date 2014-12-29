'use strict';

define('sf.b2c.mall.order.step', ['can'], function(can) {
  return can.Control.extend({

    /**
     * 初始化
     * @param  {DOM} element 容器element
     * @param  {Object} options 传递的参数
     */
    init: function(element, options) {
      var html = can.view('templates/order/sf.b2c.mall.order.step.mustache', {
        "firststep": this.options.firststep,
        "secondstep": this.options.secondstep,
        "thirdstep": this.options.thirdstep
      });

      this.element.html(html);
    }
  });
})