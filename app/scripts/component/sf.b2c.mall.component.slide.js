'use strict';

// @description 声明命名空间
sf.util.namespace('b2c.mall.component.slide');

/**
 * @class sf.b2c.mall.component.slide
 * @author Michael.Lee (leewind19841209@gmail.com)
 * @description 加载首页大Banner的展示
 */
sf.b2c.mall.component.slide = can.Control.extend({

  /**
   * @description 初始化方法，当调用new时会执行init方法
   * @param  {Dom} element 当前dom元素
   * @param  {Map} options 传递的参数
   */
  init: function (element, options) {

    this.render(options.data);
    this.bind();
  },

  /**
   * @description 对页面进行渲染
   * @param  {Map} data 渲染页面的数据
   */
  render: function (data) {
    var html = can.view('templates/component/sf.b2c.mall.component.slide.mustache')(data);
    this.element.html(html);
  },

  /**
   * 绑定slide的事件，通过vendor.slide.js获得
   */
  bind: function () {
    $(".fullSlide").slide({
      titCell: ".hd ul",
      mainCell: ".bd ul",
      effect: "fold",
      autoPlay: true,
      autoPage: true,
      trigger: "click"
    });
  }

});