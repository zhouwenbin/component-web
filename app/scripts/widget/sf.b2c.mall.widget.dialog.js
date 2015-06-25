'use strict';

define(
  'sf.b2c.mall.widget.dialog',

  [
    'jquery',
    'can',
    'text!template_widget_dialog'
  ],

  function($, can, template_widget_dialog) {
    return can.Control.extend({

      init: function(options) {
        var data = options;
        this.render(data);
      },

      render: function(data) {
        this.setup($('body'));
        var renderFn = can.mustache(template_widget_dialog);
        this.options.html  = renderFn(data);
        $('body').append(this.options.html);
        this.supplement();
      },

      // 定制html
      supplement: function() {
        $("#content").append(this.getHtml());
      },

      '#close click': function() {
        this.close();
        return false;
      },

      close: function() {
        $('#messagedialog').remove();
        //要做销毁，否则绑定的事件还会存在
        this.destroy();
      }
    });
  })