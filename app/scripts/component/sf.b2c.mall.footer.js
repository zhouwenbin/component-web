'use strict';

// @description 申明命名空间
sf.util.namespace('b2c.mall.footer');

/**
 * @class sf.b2c.mall.footer
 * @author Michael.Lee (leewind19841209@gmail.com)
 * @description 页脚
 */
sf.b2c.mall.footer = can.Control.extend({

  /**
   * 初始化slide控件
   * @param  {DOM} element 容器element
   * @param  {Object} options 传递的参数
   */
  init: function (element, options) {
    var html = can.view('templates/component/sf.b2c.mall.footer.mustache')({});
    this.element.html(html);
  }
});