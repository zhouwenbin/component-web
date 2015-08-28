'use strict';

define(
  'sf.b2c.mall.component.centerleftside',

  [
    'jquery',
    'can',
    'sf.b2c.mall.business.config',
    'text!template_component_centerleftside'
  ],

  function($, can, SFConfig, template_component_centerleftside) {

    return can.Control.extend({

      /**
       * @override
       * @description 初始化方法
       */
      init: function(options) {
        var data = {};
        data.link = [];

        data.link.push({
          "url": "/message.html",
          "name": "消息中心"
        }, {
          "url": "/orderlist.html",
          "name": "我的订单"
        }, {
          "url": "/accountmanage.html",
          "name": "账户管理"
        }, {
          "url": "/address-manage.html",
          "name": "收货地址"
        }, {
          "url": "/point-manage.html",
          "name": "积分管理"
        }, {
          "url": "/invitation.html",
          "name": "邀请有礼"
        });

    // data.link.push({
    //       "url": "/orderlist.html",
    //       "name": "我的订单"
    //     }, {
    //       "url": "/coupon.html",
    //       "name": "我的优惠券"
    //     }, {
    //       "url": "/accountmanage.html",
    //       "name": "账户管理"
    //     }, {
    //       "url": "/address-manage.html",
    //       "name": "收货地址"
    //     }, {
    //       "url": "/point-manage.html",
    //       "name": "积分管理"
    //     }, {
    //       "url": "/invitation.html",
    //       "name": "邀请有礼"
    //     });

        var that = this;

        // 设定当前活动tab
        _.each(data.link, function(item) {
          if (item.url == window.location.pathname) {
            item.active = "active";
          }
        })

        var renderFn = can.mustache(template_component_centerleftside);
        this.options.html = renderFn(data);
        this.element.append(this.options.html);
      }
    });
  });
