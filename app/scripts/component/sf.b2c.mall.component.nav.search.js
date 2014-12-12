'use strict';

// @description 申请命名空间
sf.util.namespace('b2c.mall.component.nav.search');

/**
 * @class sf.b2c.mall.component.nav.search
 * @author Michael.Lee (leewind19841209@gmail.com)
 * @description 顶部搜索栏
 */
sf.b2c.mall.component.nav.search = can.Control.extend({

  /**
   * @description 默认参数设置
   * @type {Map}
   */
  defaults: new can.Map({
    pay: 'http://pay.haitao.com/#',
    keywords: [
      { link: 'search.html?q=学饮杯', name:'学饮杯' },
      { link: 'search.html?q=牙胶', name:'牙胶' },
      { link: 'search.html?q=鱼油', name:'鱼油' },
      { link: 'search.html?q=childlife', name:'childlife' },
      { link: 'search.html?q=电动剃须刀', name:'电动剃须刀' },
      { link: 'search.html?q=Avent', name:'Avent' },
      { link: 'search.html?q=膳魔师', name:'膳魔师' }
    ],
    company: {
      sf: { imgUrl: 'images/logo.png', link: '#' },
      ht: { imgUrl: 'images/logo2.png', link: '#'}
    }
    // shopping: sf.b2c.mall.adapter.shopping.car.getInstance({})
  }),

  /**
   * @description 自定义mustache helpers
   * @type {Map}
   */
  helpers: {},

  /**
   * @description 初始化方法，当调用new时会执行init方法
   * @param  {Dom} element 当前dom元素
   * @param  {Map} options 传递的参数
   */
  init: function (element, options) {
    this.paint();
  },

  /**
   * @description 对页面做第一次绘制
   * @param  {Map} data 绘制页面的数据
   */
  paint: function () {
    this.render(this.defaults);
    // this.draw();
  },

  draw: function () {
    var that = this;

    var skuIds = [];
    var skus = null;
    can.when(sf.b2c.mall.model.order.carGetSkuAll())
      .done(function (response) {
        if (sf.util.access(response) && response.content[0].value) {
          _.each(response.content[0].value, function(value, key, list){
            skuIds.push(value.skuId);
          });

          skus = response.content[0].value;
        }
      })
      .fail(function (data) {

      })
      .then(function () {
        return sf.b2c.mall.model.product.getSKUBaseList({skus: skuIds});
      })
      .done(function (data) {
        if (sf.util.access(data)) {
          that.defaults.shopping.format(data.content[0].value, skus);
        }
      })
      .fail(function () {

      })
      .then(function () {
        // that.render(that.defaults);
        that.supplement();
      });
  },

  /**
   * @description 对页面进行渲染
   * @param  {Map} data 渲染页面的数据
   */
  render: function (data) {
    var html = can.view('templates/component/sf.b2c.mall.component.nav.search.mustache', data);
    this.element.html(html);
  },

  /**
   * @description supplement绘制阶段，在render之后继续执行的绘制阶段，主要处理不重要的渲染
   * @param  {Map} data 渲染页面的数据
   */
  supplement: function (data) {

    var that = this;
    this.element.find('.Shopping-Cart').hover(function () {
      that.element.find('.shop-bottom').fadeIn();
    }).on('mouseleave', function () {
      that.element.find('.shop-bottom').fadeOut();
    });

    // deparam过程 -- 从url中获取需要请求的sku参数
    var params = can.deparam(window.location.search.substr(1));

    if (window.location.pathname == '/search.html') {
      if (params.q) {
        this.element.find('.input-text').val(decodeURIComponent(params.q));
      }
    }

  },

  add: function (params) {
    var that = this;
    can.when(sf.b2c.mall.model.order.carAddProduct(params, true))
      .done(function (data) {
        if (sf.util.access(data, true) && data.content[0].value) {
          that.draw();
        }
      })
      .fail(function (error) {

      });
  },

  /**
   * @description 将datamodel转化为viewmodel
   * @param  {Map} data datamodel
   * @return {Map}      viewmodel
   */
  parse: function (data) {
    return data;
  },

  /**
   * @description event:搜索商品
   * @param  {Dom} element 触发事件的元素
   * @param  {Event} event   事件对象
   */
  '#sf-b2c-mall-nav-search click': function (el, event) {
    event && event.preventDefault();

    return this.search();
  },

  '#sf-b2c-mall-nav-search submit': function(element, event){
      event && event.preventDefault();
  },

  search: function () {
    var text = this.element.find('.input-text').val();
    if (!_.isEmpty(text)) {
      window.location.href = '/search.html?q=' + encodeURIComponent(text);
      return false;
    }
  },

  /**
   * @description event:搜索商品
   * @param  {Dom} element 触发事件的元素
   * @param  {Event} event   事件对象
   */
  '.shopcar-delete click': function (element, event) {
    var index = element.data('index');

    var products = this.defaults.shopping.attr('products');
    var item = products.attr(index);

    var that = this;
    can.when(sf.b2c.mall.model.order.carRemoveProduct({sku: item.sku}))
      .done(function (data) {
        if (sf.util.access(data) && data.content[0].value) {
          that.defaults.shopping.remove(index);
        }
      })
      .fail(function (error) {

      })
  },

  "{document} keydown":function(element, event){
      var e = event || window.event,
          currKey=e.keyCode||e.which||e.charCode;
      if(currKey === 13){
        return this.search()
      }
  },

  '.go-to-shopping-car click': function (element, event) {
    event && event.preventDefault();

    if (sf.util.isLogin()) {
      window.location.href = 'shopping.html';
    }else{
      window.location.href = 'login.html';
    }
  }


});