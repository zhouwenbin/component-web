'use strict';

// @description 申明命名空间
sf.util.namespace('b2c.mall.banner.category');

/**
 * @class sf.b2c.mall.banner.category
 * @author Michael.Lee (leewind19841209@gmail.com)
 * @description 加载商品类目列表
 */
sf.b2c.mall.banner.category = can.Control.extend({

  /**
   * @description 初始化方法，当调用new时会执行init方法
   * @param  {Dom} element 当前dom元素
   * @param  {Map} options 传递的参数
   */
  init: function (element, options) {

    // 数据通过外部传入，加载到模板中进行渲染
    this.render(options.data);

    // 渲染完成之后加载组件
    this.bind();
  },

  /**
   * @description 对页面进行渲染
   * @param  {Map} data 渲染页面的数据
   */
  render: function (data) {
    var html = can.view('templates/component/sf.b2c.mall.banner.category.mustache')(data);
    this.element.html(html);
  },

  /**
   * @description 渲染完成之后初始化控件
   */
  bind: function () {
    $('.category .category-list').slide({
      type: 'menu',
      titCell: '.js_toggle',
      targetCell: '.menu-item',
      delayTime: 0,
      triggerTime: 10,
      defaultPlay: false,
      returnDefault: true
    });

    if (this.data.hoverEffect) {
      $('.content-l-nav').hover(function(){
        $(this).children('.category').show();
      },function(){
        $(this).children('.category').hide();
      });
    }
  }

});