'use strict';

define(
  'sf.b2c.mall.order.vendor.info',

  [
    'jquery',
    'can',
    'underscore'
  ],

  function ($, can, _) {

    return can.Control.extend({

      init: function (element, options) {

        // 关键参数
        // saleid: heike_online
        // orgCode: heikexxx
        // app: pc
        var params = can.deparam(window.location.search.substr(1));
        this.render(params.saleid, params);
      },

      renderMap: {
        'heike_online': function (data) {
          this.data = new can.Map({
            sellerid: null,
            orgCode: data.orgCode,
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
        'heike_online': function () {
          var params = can.deparam(window.location.search.substr(1));
          if (params.orgCode) {
            return JSON.stringify({orgCode: params.orgCode, sellerId: $.trim(this.data.sellerid), sellerName: $.trim(this.data.sellername)});
          }else{
            return null;
          }
        }
      },
      verifYVendorMap: {
        'heike_online': function () {
          var params = can.deparam(window.location.search.substr(1));
          if (params.orgCode) {
            if (!$.trim(this.data.sellerid)) {
              return { result: false, message: "请填写您的正确工号,否则将影响业绩结算"};
            } else if (!$.trim(this.data.sellername)) {
              return { result: false, message: "请填写店员姓名，否则将影响业绩结算"};
            } else {
              return {result: true, message: null}
            }
          }else{
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
