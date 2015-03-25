'use strict';

define(
  'sf.b2c.mall.order.vendor.info',

  [
    'jquery',
    'can',
    'underscore'
    'jquery.cookie'
  ],

  function ($, can, _,$cookie) {

    return can.Control.extend({

      init: function (element, options) {

        // 关键参数
        // saleid: heike_online
        // orgCode: heikexxx
        // app: pc
        //@TODO 从cookie中获取嘿客穿越过来标示1_uinfo
        var heike_sign = $.cookie('1_uinfo');
        var arr = [];
        if (heike_sign) {
          arr = heike_sign.split(',');
        }
        var params = can.deparam(window.location.search.substr(1));
        this.render(arr[2], params);
      },

      renderMap: {
        //@note 如果url中orgCode有值，传入输入框中；反之需要自己输入orgCode
        'heike': function (data) {
          this.data = new can.Map({
            sellerid: null,
            orgCode: data.orgCode || null,
            sellername: null
          });
          var html = can.view('templates/order/sf.b2c.mall.order.vendor.heike.mustache', this.data);
          this.element.html(html);
        }
      },

      render: function (tag, data) {
        var fn = this.renderMap[tag];
        if (_.isFunction(fn)) {
          fn.call(this, data);
        }
      },

      vendorInfoMap: {
        'heike': function () {
          return JSON.stringify({orgCode: $.trim(this.data.orgCode), sellerId: $.trim(this.data.sellerid), sellerName: $.trim(this.data.sellername)});
        }
      },
      verifYVendorMap: {
        'heike': function () {
          //@note 三个参数都为必填项
          if (!$.trim(this.data.orgCode)) {
            return { result: false, message: "请填写您的门店代码"};
          } else if (!$.trim(this.data.sellerid)) {
            return { result: false, message: "请填写您的正确工号,否则将影响业绩结算"};
          } else if (!$.trim(this.data.sellername)) {
            return { result: false, message: "请填写店员姓名，否则将影响业绩结算"};
          } else {
            return {result: true, message: null}
          }
        }
      },
      getVendorInfo:function (tag) {
        var fn = this.vendorInfoMap[tag];
        if (_.isFunction(fn)) {
          return fn.call(this)
        }
      },
      verifYVendor: function(tag) {
        var fn = this.verifYVendorMap[tag];
        if (_.isFunction(fn)) {
          return fn.call(this)
        }
      }
    })

  })
