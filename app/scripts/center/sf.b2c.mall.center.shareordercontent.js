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
    'text!template_center_shareordercontent'
  ],
  function(can, $, qrcode, helpers, chart, moment, SFMessage, SFConfig, template_center_shareordercontent) {

    return can.Control.extend({

      helpers: {

      },

      init: function(element, options) {
        this.render();
      },

      render: function() {
        var that = this;

        var renderFn = can.mustache(template_center_shareordercontent);
        that.options.html = renderFn(that.data, that.helpers);
        that.element.html(that.options.html);
      }

    });
  })