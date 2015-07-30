define(
  'sf.b2c.mall.component.commentstar', [
    'jquery',
    'can',
    'sf.b2c.mall.business.config',
    'sf.util',
    'underscore',
    'text!template_component_commentstar'
  ],
  function($, can, SFBizConf, SFFn, _, template_component_commentstar) {
    'use strict'

    return can.Control.extend({

      init: function(element, options) {
        this.star = 0;
        this.el = null;

        this.render();

        if (options.level){
          this._initStar(options.level);
        }
      },

      render: function() {
        var that = this;

        var renderFn = can.mustache(template_component_commentstar);
        that.options.html = renderFn(that.data, that.helpers);
        that.element.html(that.options.html);

        that.el = $(".commstar a");
      },

      '.commstar a click': function(element, event) {
        this.el.removeClass("active");
        element.addClass("active");
        this.star = element.attr("_val");

        this._resetStar(this.star);

        if (typeof this.options.clickCallback != 'undefined') {
          this.options.clickCallback.apply(this, [this.star]);
        }
      },

      '.commstar a mouseover': function(element, event) {
        element.addClass("hover")
      },

      '.commstar a mouseout': function(element, event) {
        element.removeClass("hover")
      },

      _initStar: function(level) {
        this._resetStar(level);
      },

      _resetStar: function(level) {
        var index = parseInt(level) - 1;
        var starLength = this.el.length;
        _.each(this.el, function(item, itemIndex) {
          if (itemIndex <= index) {
            $(item).addClass("active");
          }
        })
      }

    });
  })