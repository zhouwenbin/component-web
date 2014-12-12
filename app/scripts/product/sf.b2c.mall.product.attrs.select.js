'use strict';

// @description 申请命名空间
sf.util.namespace('b2c.mall.product.attrs.select');

/**
 * @class sf.b2c.mall.product.attrs.select
 * @author Michael.Lee (leewind19841209@gmail.com)
 * @description
 */
sf.b2c.mall.product.attrs.select = can.Control.extend({

  /**
   * @description 默认参数设置
   * @type {Map}
   */
  defaults: {},

  /**
   * @description 自定义mustache helpers
   * @type {Map}
   */
  helpers: {
    focus: function(id, info) {

      var found = _.findWhere(info, {specId: id});
      if (found) {
        return 'on';
      }

      return '';
    },

    isFocus: function (id, info, options) {
      var found = _.findWhere(info, {specId: id});
      if (found) {
        return options.fn(options.scope || this);
      }else{
        return options.inverse(options.scope || this);
      }
    }
  },

  /**
   * @description 初始化方法，当调用new时会执行init方法
   * @param  {Dom} element 当前dom元素
   * @param  {Map} options 传递的参数
   */
  init: function (element, options) {
    this.paint(this.options.data.attr());
  },

  /**
   * @description 改变观察的数据
   * @param  {Map} data 新数据
   */
  change: function (data) {
    var viewModel = this.parse(data);

    // @todo 将改变的数据进行部署
  },

  /**
   * @description 对页面做第一次绘制
   * @param  {Map} data 绘制页面的数据
   */
  paint: function (data) {
    this.data = this.parse(data);

    // @todo 注册观察的数据

    this.render(this.data);
  },

  /**
   * @description 对页面进行渲染
   * @param  {Map} data 渲染页面的数据
   */
  render: function (data) {
    var html = can.view('templates/product/sf.b2c.mall.product.attrs.select.mustache', data, this.helpers);
    this.element.html(html);
  },

  /**
   * @description supplement绘制阶段，在render之后继续执行的绘制阶段，主要处理不重要的渲染
   * @param  {Map} data 渲染页面的数据
   */
  supplement: function (data) {

  },

  /**
   * @description 将datamodel转化为viewmodel
   * @param  {Map} data datamodel
   * @return {Map}      viewmodel
   */
  parse: function (data) {
    return data;
  },

  findGroup: function (attrId, selectedAttrId) {
    var group = _.find(this.data.attrs, function(attr){
      var arr = _.pluck(attr.values, 'valueId');
      return _.contains(arr, attrId) && _.contains(arr, selectedAttrId);
    });

    return group;
  },

  equalSKU: function (newSelected, sku) {
    var skuIds = _.pluck(sku, 'specId');
    var ids = _.pluck(newSelected, 'specId');

    skuIds = _.uniq(skuIds);
    ids = _.uniq(ids);

    if (skuIds.length !== ids.length) {
      return false;
    }

    var result = true;
    for(var i in ids){
      // result = result && _.contains(ids[i], skuIds);
      result = result && _.contains(skuIds, ids[i]);
      if (!result) {
        return false;
      }
    }

    return result;
  },

  /**
   * @description event:
   * @param  {Dom} element 触发事件的元素
   * @param  {Event} event   事件对象
   */
  '.item a click': function(element, event){
    event && event.preventDefault();

    var attr = element.data('attribute');

    // 组合新的sku的属性
    var selected = this.data.selected;
    var tmp = _.reject(selected, function(value, i, list){
      return value.specName === attr.specName;
    });

    var newSelected = [attr];
    newSelected = _.union(newSelected, tmp);
    this.data.selected = newSelected;

    // 使用新的sku的属性去找到sku的值
    for(var i in this.data.skus){
      var result = this.equalSKU(newSelected, this.data.skus[i].specs);
      if (result) {
        element.closest('dl').find('a').removeClass('on').find('i').remove();
        element.addClass('on').append('<i></i>');
        return this.options.onSKUChanged(this.data.skus[i].skuId);
      }
    }
  }

});