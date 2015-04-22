'use strict';

define("sf.b2c.mall.page.naturalcoupon", [
    'can',
    'jquery',
    'sf.b2c.mall.framework.comm',
    'sf.b2c.mall.api.coupon.receiveCoupon',
    'sf.b2c.mall.component.header',
    'sf.b2c.mall.business.config'
  ],
  function(can, $, SFFrameworkComm, SFReceiveCoupon, SFHeader, SFBizConf) {

    SFFrameworkComm.register(1);

    var naturalcoupon = can.Control.extend({

      init: function(element, options) {

        var header = new SFHeader('.sf-b2c-mall-header', {"afterLoginDest": location.href});

        if (!SFFrameworkComm.prototype.checkUserLogin.call(this)) {
          header.showLogin(location.href);
          return false;
        }

        this.options.data = new can.Map({});

        this.render(element);
      },

      render: function(element) {
        var that = this;

        var params = can.deparam(window.location.search.substr(1));
        var bagid = params.bagid;

        var receiveCoupon = new SFReceiveCoupon({
          "type": "CARD", //"GIFTBAG",
          "bagId": bagid,
          "receiveChannel": 'B2C',
          "receiveWay": 'ZTLQ'
        });

        receiveCoupon
          .sendRequest()
          .done(function(data) {
            // 是否显示领取按钮，未领过还要显示领取按钮
            that.options.data.attr("showbutton", true);
            that.options.data.attr("showcoupon", false);
            that.renderHtml(element, that.options.data);
          })
          .fail(function(error) {
            // 已经领过了
            if (error === 11000100) {
              // 是否显示领取按钮 已经领过了就不显示了
              that.options.data.attr("showbutton", false);
              that.options.data.attr("showcoupon", true);
              that.renderHtml(element, that.options.data);
            } else {
              console.error(error);
            }
          })
      },

      /** 渲染 */
      renderHtml: function(element, data) {
        var html = can.view('templates/natural/sf.b2c.mall.natural.coupon.mustache', data);
        element.html(html);
      },

      "#getcoupon click": function(element, event) {
        this.options.data.attr("showbutton", false);
        this.options.data.attr("showcoupon", true);
      }
    });

    new naturalcoupon('.haitao-b2c-mall-natural-coupon');

  })