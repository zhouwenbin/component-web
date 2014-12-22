'use strict';

// @description 申明命名空间
sf.util.namespace('b2c.mall.widget.board');

/**
 * @class sf.b2c.mall.widget.board
 * @author Michael.Lee (leewind19841209@gmail.com)
 * @description 可定制化的步骤board widget
 */
sf.b2c.mall.widget.board = can.Control.extend({

  /**
   * @description 初始化方法，当调用new时会执行init方法
   * @param  {Dom} element 当前dom元素
   * @param  {Map} options 传递的参数
   */
  init: function (element, options) {

    /**
     * data数据结构
     *
     * - process [array]提供需要展示的
     *   - name 显示的名称
     *   - num 步骤编号
     *   - tag 标签
     * - active 需要on的标签
     * - classname
     * - style
     *   -last 最后一个item的style
     *   -common 普通的一个item的style
     */
    this.data = options.data;
    this.data.active = can.compute(this.data.active);

    this.render(this.data);
  },

  change: function (data) {
    this.data.active(data.active);
  },

  /**
   * @description 定制化的mustache helper
   * @type {Map}
   */
  helpers: {
    'on': function (tag, active) {
      if (active() === tag) {
        return 'on';
      }
    },

    'custom': function (process, tag, style) {
      var last = process[process.length - 1];
      if (last.tag === tag) {
        return style.last;
      }else{
        return style.common;
      }
    }
  },

  /**
   * @description 对页面进行渲染
   * @param  {Map} data 渲染页面的数据
   */
  render: function (data) {
    var html = can.view('templates/widget/sf.b2c.mall.widget.board.mustache', data, this.helpers);
    this.element.html(html);
  }
});