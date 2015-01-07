'use strict';

define('sf.b2c.mall.order.step', ['can'], function(can) {
  return can.Control.extend({

    /**
     * 初始化
     * @param  {DOM} element 容器element
     * @param  {Object} options 传递的参数
     */
    init: function(element, options) {
      var firststep = this.options.firststep;
      var secondstep = this.options.secondstep;
      var thirdstep = this.options.thirdstep;

      this.data = new can.Map({
        "firststep": firststep,
        "secondstep": secondstep,
        "thirdstep": thirdstep
      });
      var html = can.view('templates/order/sf.b2c.mall.order.step.mustache', this.data);

      this.element.html(html);
    },

    setActive: function(stepx) {
      var that = this;
      var map = {
        "firststep": function() {
          that.data.attr("firststep", "active");
          that.data.attr("secondstep", "");
          that.data.attr("thirdstep", "");
        },

        "secondstep": function() {
          that.data.attr("firststep", "");
          that.data.attr("secondstep", "active");
          that.data.attr("thirdstep", "");
        },

        "thirdstep": function() {
          that.data.attr("firststep", "");
          that.data.attr("secondstep", "");
          that.data.attr("thirdstep", "active");
        }
      }

      if (typeof map[stepx] != 'undefined') {
        map[stepx].call(this);
      }
    }
  });
})