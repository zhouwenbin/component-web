'use strict';

define('sf.b2c.mall.center.shareordercontent', [
    'can',
    'jquery',
    'qrcode',
    'sf.helpers',
    'chart',
    'moment',
    'sf.b2c.mall.widget.message',
    'sf.b2c.mall.business.config',
    'sf.b2c.mall.component.commenteditor',
    'sf.b2c.mall.api.order.getOrderV2',
    'text!template_center_shareordercontent'
  ],
  function(can, $, qrcode, helpers, chart, moment, SFMessage, SFConfig, SFCommenteditor, SFGetOrder, template_center_shareordercontent) {

    return can.Control.extend({

      helpers: {
        showImage: function(group) {
          var array = eval(group);
          if (array && _.isArray(array)) {
            var url = array[0].replace(/.jpg/g, '.jpg@63h_63w.jpg');
            if (/^http/.test(url)) {
              return url;
            } else {
              return 'http://img0.sfht.com' + url;
            }
          } else {
            return array;
          }
        },
        'isSecGoods': function(goodsType, options) {
          if (goodsType == "SECKILL") {
            return options.fn(options.contexts || this);
          } else {
            return options.inverse(options.contexts || this);
          }
        }
      },

      init: function(element, options) {
        this.render();
      },

      render: function() {
        var that = this;

        that.commenteditor = new SFCommenteditor();

        var params = can.deparam(window.location.search.substr(1));

        var getOrder = new SFGetOrder({
          "orderId": params.orderid
        });

        getOrder
          .sendRequest()
          .done(function(data) {
            debugger;
            that.options.orderInfo = data;

            var renderFn = can.mustache(template_center_shareordercontent);
            that.options.html = renderFn(that.options.orderInfo.orderItem, that.helpers);

            that.element.html(that.options.html);
          })
          .fail(function(error) {
            console.error(error);
          });
      },

      ".gotoshareorder click": function(element, event) {
        this.commenteditor.show(null, "add", $(".commentEditorArea", element.parents("td")));

        $(".commentEditorArea").stop(true, false).animate({
          height: "0px",
          opacity: 0
        }, 500);

        $(".commentEditorArea", element.parents("td")).stop(true, false).animate({
          height: "405px",
          opacity: 1
        }, 500);

      }

    });
  })