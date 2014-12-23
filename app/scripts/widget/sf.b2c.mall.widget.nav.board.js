'use strict';

// @description 申明命名空间
sf.util.namespace('b2c.mall.widget.nav.board');

/**
 * @class sf.b2c.mall.nav.board
 * @author Michael.Lee (leewind19841209@gmail.com)
 * @description 首页导航显示简单信息的组件
 */
sf.b2c.mall.widget.nav.board = can.Control.extend({

  /**
   * @description 初始化方法，当调用new时会执行init方法
   * @param  {Dom} element 当前dom元素
   * @param  {Map} options 传递的参数
   */
  init: function (element, options) {
    this.data = this.parse(options.data);
    this.render(this.data);
  },

  /**
   * @description 将datamodel转化为viewmodel
   * @param  {Map} data datamodel
   * @return {Map}      viewmodel
   */
  parse: function (data) {
    return {
      company: {
        sf: { imgUrl: 'images/sf_logo.png', link: '#' }
//        ht: { imgUrl: 'images/logo2.png', link: '#'}
      },
      title: data.title || ''
    };
  },

  /**
   * @description 对页面进行渲染
   * @param  {Map} data 渲染页面的数据
   */
  render: function () {
    var html = can.view('templates/widget/sf.b2c.mall.widget.nav.board.mustache')(this.data);
    this.element.html(html);
  }
});