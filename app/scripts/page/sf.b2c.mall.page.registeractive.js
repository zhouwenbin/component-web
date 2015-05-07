'use strict';

define("sf.b2c.mall.page.registeractive", [
    'can',
    'jquery',
    'sf.b2c.mall.framework.comm',
    'sf.b2c.mall.api.coupon.hasReceivedCp',
    'sf.b2c.mall.api.coupon.receiveCoupon',
    'sf.b2c.mall.component.header',
    'sf.b2c.mall.widget.message',
    'sf.b2c.mall.business.config'
  ],
  function(can, $, SFFrameworkComm, SFHasReceivedCp, SFReceiveCoupon, SFHeader, SFMessage, SFBizConf) {

    SFFrameworkComm.register(1);

    var header = new SFHeader('.sf-b2c-mall-header', {
      "afterLoginDest": location.href
    });

    var naturalcoupon = can.Control.extend({

      init: function(element, options) {

        this.options.data = new can.Map({});

        this.render(element);
      },

      render: function(element) {
        var html = can.view('templates/natural/sf.b2c.mall.natural.registeractive.mustache', {});
        element.html(html);
      },

      ".btn-big click": function(element, event) {
        window.location.href = "http://www.sfht.com/detail/184.html";
      }
    });

    new naturalcoupon('.haitao-b2c-mall-register-active');

  })