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
            var renderFn = can.mustache(template_center_shareordercontent);
            that.options.html = renderFn(that.data, that.helpers);
            that.element.html(that.options.html);
          })
          .fail(function(error){
            var renderFn = can.mustache(template_center_shareordercontent);
            that.options.html = renderFn(that.data, that.helpers);
            that.element.html(that.options.html);
          });
      },

      ".gotoshareorder click": function(element, event) {
        this.commenteditor.show(null, "add", $("#commentEditorArea"));
      }

    });
  })