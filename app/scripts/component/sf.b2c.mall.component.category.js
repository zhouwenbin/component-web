'use strict';

// @description 申明命名空间
sf.util.namespace('b2c.mall.component.category');

/**
 * @class sf.b2c.mall.component.category
 * @author Michael.Lee (leewind19841209@gmail.com)
 * @description 全局类目控件
 */
sf.b2c.mall.component.category = can.Control.extend({

  helpers: {
    limit: function (children, size, options) {
      var len = children.length > size ? size : children.length;
      var results = [];
      for (var i = 0; i < len; i++) {
        results.push({
          name: children[i].categoryInfo.catagoryName,
          id: children[i].categoryInfo.categoryId
        });
      }

      return options.fn(new can.Map({items: results}));
    }
  },

  /**
   * @description 初始化方法，当调用new时会执行init方法
   * @param  {Dom} element 当前dom元素
   * @param  {Map} options 传递的参数
   */
  init: function(element, options) {
    var that = this;
    can.when(sf.b2c.mall.model.category.findCategoryAll())
      .done(function (data) {
        if (sf.util.access(data) && data.content[0]) {
          that.paint(data.content[0], options.hoverEffect);
        }
      })
      .fail(function () {

      });
  },

  /**
   * @description 对页面做第一次绘制
   * @param  {Map} data 绘制页面的数据
   */
  paint: function(data, hoverEffect) {
    this.data = this.parse(data);
    this.data.hoverEffect = hoverEffect;

    // 数据通过外部传入，加载到模板中进行渲染
    this.render(this.data);

    // 渲染完成之后加载组件
    this.bind();
  },

  /**
   * @description 对页面进行渲染
   * @param  {Map} data 渲染页面的数据
   */
  render: function(data) {
    var html = can.view('templates/component/sf.b2c.mall.component.category.mustache', data, this.helpers);
    this.element.html(html);
  },

  /**
   * @description 将datamodel转化为viewmodel
   * @param  {Map} data datamodel
   * @return {Map}      viewmodel
   */
  parse: function(data) {

    return data;
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
      $('.content-l-nav .category').hide();

      $('.content-l-nav').hover(function(){
        $(this).children('.category').show();
      },function(){
        $(this).children('.category').hide();
      });
    }
  }

});