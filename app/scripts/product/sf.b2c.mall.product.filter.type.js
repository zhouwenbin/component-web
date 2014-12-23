'use strict';

sf.util.namespace('b2c.mall.product.filter.type');

sf.b2c.mall.product.filter.type = can.Control.extend({

  defaults: {
    types: [
      { name: '默认', on: can.compute(true), tag:'default'},
      { name: '价格', on: can.compute(false), tag:'price'},
      { name: '销量', on: can.compute(false), tag: 'sales' }
      // { name: '最新', on: can.compute(false), tag:'recent' }
    ]
  },

  init: function (element, options) {
    this.paint();
  },

  paint: function () {
    var page = this.options.productListAdapter.page;

    var current = page.pageNum;
    var all = Math.ceil(page.totalNum / page.rowNum);

    this.type = 'default';

    var datamodel = {
      types: this.defaults.types,
      page: current,
      sum: all
    };

    this.data = this.parse(datamodel);

    this.data.page = can.compute(this.data.page);
    this.data.allpage = can.compute(this.data.allpage);

    this.render(this.data);
  },

  render: function (data) {
    var html = can.view('templates/product/sf.b2c.mall.product.filter.type.mustache', data);
    this.element.html(html);
  },

  parse: function (data) {
    return {
      page:data.page,
      allpage: data.sum,
      types: data.types
    };
  },

  request: function (params) {

    // @todo 发起一次请求或者通过改变url获得新数据和页面
    can.route.attr(params);
  },

  change: function (data) {
    var datamodel = {
      types: this.data.types,
      page: data.page,
      sum: data.sum
    };

    var viewmodel = this.parse(datamodel);

    this.data.page(viewmodel.page);
    this.data.allpage(viewmodel.allpage);
  },

  /**
   * @description event:用户点击"filter-type"按钮之后的动作回调 -选择不同类型
   * @param  {Dom} element 触发事件的元素
   * @param  {Event} event   事件对象
   */
  '.filter-type click': function (element, event) {
    event && event.preventDefault();

    var type = can.data(can.$(element), 'type');
    var found = _.findWhere(this.data.types, {name: type.name});

    var that = this;
    if (found && found.on()) {
      // 如果已经选中了直接返回
      return;
    }else{

      _.each(this.data.types, function(value, key, list){
        if (value.name == type.name) {
          that.type = type.tag;
          value.on(true);
        }else{
          value.on(false);
        }
      });

      // @todo 整理请求参数,发起一次服务进行新的搜索
      this.request({type: this.type, page: this.data.page()});
    }
  },

  /**
   * @description event:用户点击"filter-type-prev"按钮之后的动作回调 -选择页
   * @param  {Dom} element 触发事件的元素
   * @param  {Event} event   事件对象
   */
  '.filter-type-prev click': function (element, event) {
    event && event.preventDefault();

    var filter = can.data(can.$(element), 'filter');
    if (filter.page() > 1) {

      this.data.page(this.data.page()-1);

      // @todo 整理请求参数,发起一次服务进行新的搜索
      this.request({page: this.data.page()});
    }
  },

  /**
   * @description event:用户点击"filter-type-next"按钮之后的动作回调 -选择页
   * @param  {Dom} element 触发事件的元素
   * @param  {Event} event   事件对象
   */
  '.filter-type-next click': function (element, event) {
    event && event.preventDefault();

    var filter = can.data(can.$(element), 'filter');
    if (filter.page() < filter.allpage()) {

      this.data.page(this.data.page()+1);

      // @todo 整理其你去参数,发起一次服务进行新的搜索
      this.request({page: this.data.page()});
    }
  }

});