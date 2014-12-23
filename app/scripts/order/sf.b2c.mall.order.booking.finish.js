'use strict';

// @description 申请命名空间
sf.util.namespace('b2c.mall.order.booking.finish');

/**
 * @class sf.b2c.mall.order.booking.finish
 * @author Michael.Lee (leewind19841209@gmail.com)
 * @description 用户下单完成
 */
sf.b2c.mall.order.booking.finish = can.Control.extend({

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

      var result = [];
      var countries = _.pluck(products, 'country');
      countries = _.uniq(countries);

      _.each(countries, function(value, key, list){
        var founds = _.where(products, {country: value});
        if (founds && founds.length > 0) {
          result.push({
            tagCountry: founds[0].shippingStartPointId,
            tagItems: founds
          });
        }
      });

      if (result && result.length > 0) {
        return options.fn(new can.view.Scope({productList: result}));
      }else{
        return options.inverse(options.scope);
      }
    },

    isSelfProduct: function (saleType, options) {
      if (saleType == 'SELF') {
        return options.fn(options.scope || this);
      } else {
        return options.inverse(options.scope || this);
      }
    },
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
  },

  /**
   * @description 对页面进行渲染
   * @param  {Map} data 渲染页面的数据
   */
  render: function (data) {
    var html = can.view('templates/order/sf.b2c.mall.order.booking.finish.mustache', data, this.helpers);
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
    var info = data.orderInfo;
    info = _.extend(info, {payType: 'alipay'});
    info = _.extend(info, {saleType: data.saleType});
    return info;
  },

  request: function () {
    var that = this;
    setTimeout(function() {
      can.when(sf.b2c.mall.model.order.getOrder({orderId: that.data.orderId}))
        .done(function (data) {

          if (sf.util.access(data, true) && data.content[0]) {
            var order = data.content[0].basicInfo;
            if (order.orderStatus == 'AUDITING') {
              window.location.href = '/center.html';
            }else{
              that.request.call(that);
            }
          }
        })
        .fail(function () {
          that.request.call(that);
        });
    }, 1000);
  },

  errorMap: {
    '3000001':   '支付金额非法',
    '3000002':   '支付状态不允许支付',
    '3000007':   '用户订单不正确'
  },

  /**
   * @description event:
   * @param  {Dom} element 触发事件的元素
   * @param  {Event} event   事件对象
   */
  '#booking-request-pay click': function(element, event){
    event && event.preventDefault();
    var that = this;

    // can.when(sf.b2c.mall.model.order.requestPay(this.data))
    can.when(sf.b2c.mall.model.order.requestPayV2(this.data))
      .done(function (data) {
        if (sf.util.access(data) && data.content[0]) {
              var payinfo = data.content[0];

              //改为直接打开连接，防止在IE下面支付时候弹出空白页
              window.location.href = (payinfo.url + '?' + payinfo.postBody);
              return false;

              //that.element.find('#pay-form').attr('action', payinfo.url + '?' + payinfo.postBody);
              //that.element.find('#pay-form').submit();

          // var map = {
          //   'sfp': function () {
          //     var payinfo = data.content[0];
          //     that.element.find('#pay-form').attr('action', payinfo.url + '?' + payinfo.postBody);
          //     that.element.find('#pay-form').submit();
          //   },

          //   'alipay': function () {
          //     var payinfo = data.content[0];
          //     window.location.href = payinfo.url + '?' + payinfo.postBody;
          //   }
          // }

          // var action = map[that.data.payType];
          // if (_.isFunction(action)) {
          //   action.call(that)
          // }
        }else{
          var errorCode = data.stat.stateList[0].code;
          var errorText = that.errorMap[errorCode.toString()] || '支付失败';
          alert(errorText);
          window.location.href = 'index.html'
        }

      })
      .fail(function (error) {
      });
  }

});