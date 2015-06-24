'use strict';

define('sf.b2c.mall.center.invitationcontent', [
    'can',
    'jquery',
    'qrcode',
    'sf.helpers',
    'sf.b2c.mall.widget.message',
    'sf.b2c.mall.business.config',
    'text!template_center_invitationcontent'
  ],
  function(can, $, qrcode, helpers, SFMessage, SFConfig, template_center_invitationcontent) {

    return can.Control.extend({

      helpers: {

      },

      init: function(element, options) {
        var data = {};

        var renderFn = can.mustache(template_center_invitationcontent);
        this.options.html  = renderFn(data, this.helpers);
        this.element.append(this.options.html);
      }

    });
  })