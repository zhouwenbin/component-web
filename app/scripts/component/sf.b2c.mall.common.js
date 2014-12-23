'use strict';

var mall = sf.util.namespace('b2c.mall');

mall.common = can.Control.extend({

  /**
   * @param  {DOM} element 容器element
   * @param  {Object} options 传递的参数
   */
  init: function (element, options) {
    this.data = options.data;

    this.template = options.template;
    this.tag = options.tag;

    this.render(this.template, this.data);

    if (typeof options.callback) {
      options.callback.call(this);
    }
  },

  render: function (template, data) {
    // var html = can.view(template)(data);

    var html = null;
    if (this.template) {
      html = can.view(template)(data);
    }else if (this.tag) {
      html = can.view(this.tag, data);
    }

    this.element.html(html);
  }

});