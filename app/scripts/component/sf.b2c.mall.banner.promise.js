'use strict';

// @description 申明命名空间
sf.util.namespace('b2c.mall.banner.promise');

/**
 * @class sf.b2c.mall.banner.promise
 * @author Michael.Lee (leewind19841209@gmail.com)
 * @description Banner区域的对用户承诺模块
 */
sf.b2c.mall.banner.promise = can.Control.extend({

  defaults: {
    common: {
      imgUrl: 'images/banner/sbanner.cb9924ea3e9d3d8e3783ddd088b7a924.jpg',
      link: 'detail.html?sku=96295'
    },
    hz: {
      imgUrl: 'images/banner/sbanner.c1b008b14bb5432b7b7850e9c5f8f6fc.jpg',
      link: 'detail.html?sku=96290'
    }
  },

  /**
   * @description 初始化方法，当调用new时会执行init方法
   * @param  {Dom} element 当前dom元素
   * @param  {Map} options 传递的参数
   */
  init: function (element, options) {

    var that = this;
    if (sf.util.isLogin()) {
      can.when(sf.b2c.mall.model.user.getUserInfo())
        .done(function(data) {
          if (sf.util.access(data) && data.content[0].mailId === '1975432511@qq.com') {
            that.render(that.defaults.hz);
          }else{
            that.render(that.defaults.common);
          }
        })
        .fail(function(data) {
          that.render(that.defaults.common);
        });
    }else{
      that.render(that.defaults.common);
    }
  },

  /**
   * @description 对页面进行渲染
   * @param  {Map} data 渲染页面的数据
   */
  render: function (data) {
    var html = can.view('templates/component/sf.b2c.mall.banner.promise.mustache', data);
    this.element.html(html);
  }
});