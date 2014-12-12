'use strict';

// @description 申明命名空间
sf.util.namespace('b2c.mall.product.breadcrumb');

/**
 * @class sf.b2c.mall.product.breadcrumb
 * @author Michael.Lee (leewind19841209@gmail.com)
 * @description 商品列表中显示的面包屑
 */
sf.b2c.mall.product.breadcrumb = can.Control.extend({

  /**
   * @description 初始化方法，当调用new时会执行init方法
   * @param  {Dom} element 当前dom元素
   * @param  {Map} options 传递的参数
   */
  init: function (element, options) {
    // this.paint(options.data);
  },

  /**
   * @description 对页面做第一次绘制
   * @param  {Map} data 绘制页面的数据
   */
  paint: function ($dom, params) {
    this.element = $dom;

    var viewmodel = this.parse(params.data);
    this.data = new can.Map(viewmodel);

    this.render(this.data);
  },

  /**
   * @description 为模板定制helpers
   * @type {Map}
   */
  helpers: {
    last: function (path, item) {
      var arr = path();
      var last = arr[arr.length - 1];

      if (last.attr('categoryId') == item.categoryId) {
        return '';
      }else{
        return '<em class="s-i">&gt;</em>';
      }
    }
  },

  /**
   * @description 对页面进行渲染
   * @param  {Map} data 渲染页面的数据
   */
  render: function (data) {
    var html = can.view('templates/product/sf.b2c.mall.product.breadcrumb.mustache', data, this.helpers);
    this.element.html(html);
  },

  /**
   * @description 将datamodel转化为viewmodel
   * @param  {Map} data datamodel
   * @return {Map}      viewmodel
   */
  parse: function (data) {
    var path = null;
    if (data.path && data.path.value && _.isArray(data.path.value)) {
      path = data.path.value.reverse();
    }
    return {
      categories: data.categories,
      noresult: data.noresult,
      path: path,
      title: data.title,
      sku: data.sku,
      sum: data.sum,
      keyword: data.keyword
    };
  },

  '.plain click': function (element, event) {
    event && event.preventDefault();

    var id = element.data('id');
    // var params = can.deparam(window.location.search.substr(1));
    // params = _.extend(params, {category: id});
    // var iparams = can.route.attr();

    can.route.attr({category: id})

    // window.location.href = window.location.pathname + '?' + $.param(params) + '#!' + $.param(iparams);

  }

});