'use strict';

define("sf.b2c.mall.page.naturalcoupon", [
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

        if (!SFFrameworkComm.prototype.checkUserLogin.call(this)) {
          this.options.data.attr("hasGetLift", false);
          this.renderHtml(element, this.options.data);
        } else {
          var that = this;

          var params = can.deparam(window.location.search.substr(1));
          var bagid = params.bagid;

          var hasReceivedCp = new SFHasReceivedCp({
            "bagType": "GIFTBAG",
            "bagId": bagid
          });

          hasReceivedCp
            .sendRequest()
            .done(function(data) {
              // 是否显示领取按钮，未领过还要显示领取按钮
              if (data.value) {
                that.options.data.attr("hasGetLift", true);
              }
              that.renderHtml(element, that.options.data);
            })
            .fail(function(error) {
              console.error(error);
            })
        }

      },

      /** 渲染 */
      renderHtml: function(element, data) {
        var html = can.view('templates/natural/sf.b2c.mall.natural.coupon.mustache', data);
        element.html(html);
      },

      "#getcoupon click": function(element, event) {

        if (!SFFrameworkComm.prototype.checkUserLogin.call(this)) {
          header.showLogin(location.href);
          return false;
        }

        var that = this;

        var params = can.deparam(window.location.search.substr(1));
        var bagid = params.bagid;

        var receiveCoupon = new SFReceiveCoupon({
          "type": "GIFTBAG",
          "bagId": bagid,
          "receiveChannel": 'B2C',
          "receiveWay": 'ZTLQ'
        });

        receiveCoupon
          .sendRequest()
          .done(function(data) {
            // 是否显示领取按钮，未领过还要显示领取按钮
            that.options.data.attr("hasGetLift", true);
            that.renderHtml(element, that.options.data);

            var message = new SFMessage(null, {
              'tip': '优惠券礼包已成功加入您的账户！',
              'type': 'success'
            });
          })
          .fail(function(error) {
            // 已经领过了
            if (error === 11000100) {
              // 是否显示领取按钮 已经领过了就不显示了
              that.options.data.attr("hasGetLift", true);
              that.renderHtml(element, that.options.data);
            } else {
              console.error(error);
            }
          })
      }
    });

    new naturalcoupon('.haitao-b2c-mall-natural-coupon');

  })