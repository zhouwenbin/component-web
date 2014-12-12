'use strict';

var center = sf.util.namespace('b2c.mall.center');

center.favorite = can.Control.extend({

  /**
   * @param  {DOM} element 容器element
   * @param  {Object} options 传递的参数
   */
  init: function (element, options) {

    this.render({
      types: [
        { name: '全部商品' },
        { name: '在售商品' },
        { name: '下架商品' },
        { name: '失效商品' }
      ]
    });
    this.supplement({
      current: 2,
      all: 15
    });
  },

  render: function (data) {

    // @todo 'sf.b2c.mall.center.favorite.mustache' 需要提炼列表布局

    var html = can.view('templates/center/sf.b2c.mall.center.favorite.mustache')(data);
    this.element.html(html);
  },

  supplement: function (data) {
    new sf.b2c.mall.widget.pagination('.sf-b2c-mall-pagination', {
      current: data.current,
      all: data.all
    });
  }

});