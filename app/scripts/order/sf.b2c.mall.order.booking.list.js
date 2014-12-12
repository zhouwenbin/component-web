'use strict';

// @description 申请命名空间
sf.util.namespace('b2c.mall.order.booking.list');

/**
 * @class sf.b2c.mall.order.booking.list
 * @author Michael.Lee (leewind19841209@gmail.com)
 * @description 订单 -- 确认订单
 */
sf.b2c.mall.order.booking.list = can.Control.extend({

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
    'list': function (products, options) {

      if (_.isFunction(products)) {
        products = products();
      }

      var countries = _.groupBy(products, function(value, key, list){
        return value.seller.nationName;
      });

      var result = [];
      _.each(countries, function(value, key, list){
        result.push({
          tagCountry: value[0].shippingStartPointId,
          // tagCountryImgUrl: value[0].seller.nationLogoUrl,
          tagItems: value
        });
      });

      if (result && result.length > 0) {
        return options.fn(new can.view.Scope({productList: result}));
      }else{
        return options.inverse(options.scope);
      }
    },

    'activePayType': function (activeType, currentType) {
      if (currentType == activeType()) {
        return 'active'
      }else{
        return ''
      }
    }
  },

  /**
   * @description 初始化方法，当调用new时会执行init方法
   * @param  {Dom} element 当前dom元素
   * @param  {Map} options 传递的参数
   */
  init: function (element, options) {
    this.component = this.options.component || {};
  },

  /**
   * @description 对页面做第一次绘制
   * @param  {Map} data 绘制页面的数据
   */
  paint: function (data) {
    this.data = this.parse(data);
    this.render(this.data);
    this.supplement();
  },

  /**
   * @description 对页面进行渲染
   * @param  {Map} data 渲染页面的数据
   */
  render: function (data) {
    var html = can.view('templates/order/sf.b2c.mall.booking.list.mustache', data, this.helpers);
    this.element.html(html);
  },

  /**
   * @description supplement绘制阶段，在render之后继续执行的绘制阶段，主要处理不重要的渲染
   * @param  {Map} data 渲染页面的数据
   */
  supplement: function (data) {
    this.component.address =new sf.b2c.mall.center.address.list('.sf-b2c-mall-center-address');
  },

  /**
   * @description 获取用户提交的订单信息
   * @return {Map} 订单信息
   */
  getOrderInfo: function () {
    var address = this.component.address.getSelectedAddress();
    var products = this.data.products;

    var sum = _.reduce(products, function(memo, value, key, list){
      return memo + value.price * value.num;
    }, 0);

    var comment = this.data.comment;
    if (_.isFunction(comment)) {
      comment = this.data.comment();
    }

    return {
      address: address,
      products: products,
      sum: sum,
      comment: comment,
      orderId: this.data.orderId
    };
  },

  /**
   * @description 将datamodel转化为viewmodel
   * @param  {Map} data datamodel
   * @return {Map}      viewmodel
   */
  parse: function (data) {
    data.attr('payType', 'alipay');
    return data;
  },

  '.sf-pay-type click': function (element, event) {
    event && event.preventDefault();

    var payType = element.data('type');
    this.data.attr('payType', payType);
  },

  errorMap: {
    '4000100':  '订单提交失败',
    '4000200':  '订单地址不存在',
    '4000300':  '订单地址状态错误',
    '4000400':  '订单商品信息改变',
    '4000500':  '很抱歉，订单内的商品库存不足，请重新确认订单',
    '4000600':  '订单商品超过限额',
    '4000700':  '订单商品金额改变'
  },

  /**
   * @description event:
   * @param  {Dom} element 触发事件的元素
   * @param  {Event} event   事件对象
   */
  '#booking-submit-btn click': function(element, event){
    event && event.preventDefault();

    var tmp = this.getOrderInfo();

    // 错误检查
    if (!tmp.address) {
      return setTimeout(function() {
        window.alert('请添加收货地址！');
      }, 0);
    }

    var items = [];
    _.each(tmp.products, function(value, key, list){
      items.push({
        sku: value.sku,
        num: value.num,
        price: value.price
      });
    });

    var params = {
      addr: JSON.stringify(tmp.address),
      msg: tmp.comment,
      items: JSON.stringify(items)
    };

    params = sf.util.clean(params);

    var skuList = _.pluck(items, 'sku');

    var car = sf.b2c.mall.adapter.shopping.car.getInstance();

    var that = this;


    // can.when(sf.b2c.mall.model.order.submitOrder(params))
    can.when(sf.b2c.mall.model.order.submitOrderV2(params))
      .done(function (data) {
        if (sf.util.access(data, true) && data.content[0].value) {
          that.data.orderId = data.content[0].value;
          // that.options.onOrderSubmited(data.content[0].value);
        }else{
          var errorCode = data.stat.stateList[0].code;
          var errorText = that.errorMap[errorCode.toString()] || '订单提交失败';
          alert(errorText);
          window.location.href = 'index.html'
        }
      })
      .fail(function (data) {

      })
      .then(function (data) {
        return sf.b2c.mall.model.order.carBulkDeleteShopCart({skulist: skuList})
      })
      .done(function (data) {
        if (sf.util.access(data) && data.content[0].value) {
          if (car.products) {
            car.products.each(function (sku, index, value) {
              if (_.contains(skuList, sku.skuId)) {
                car.products.removeAttr(index);
              }
            })
          };
        }
      })
      .fail(function () {

      })
      .then(function () {
        that.options.onOrderSubmited(that.data.orderId);
      });
  },

  /**
   * @description event:用户留言50字符限制
   * @param  {Dom} element 触发事件的元素
   * @param  {Event} event   事件对象
   */
  '.message-textarea keyup': function(element, event) {
    event && event.preventDefault();
    var $messageTextarea = $('.message-textarea').val();
    if ($messageTextarea.length > 200) {
      window.alert('留言不能超过200字！');
      return false;
    }
  }

});