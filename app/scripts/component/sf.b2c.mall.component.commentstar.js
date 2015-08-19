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

      dataWatcher: {
        callbacks: {},
        context: this,

        on: function(name, callback, context) {
          this.context = context;

          this.callbacks[name] = this.callbacks[name] || [];
          this.callbacks[name].push(callback);
        },

        setAttr: function(name, value) {
          this.context[name] = value;
          this.trigger(name);
        },

        trigger: function(name) {
          this.callbacks[name] = this.callbacks[name] || [];
          for (var i = 0, len = this.callbacks[name].length; i < len; i++) {
            this.callbacks[name][i].apply(this.context,  Array.prototype.slice.call(arguments, 1));
          }
        }
      },

      init: function(element, options) {debugger;
        this.star = options.level || options.defaultLevel;
        this.view = options.view;
        this.el = null;

        this.render();

        this.initStar(this.star);

        this.dataWatcher.on("star", this.setTip, this);
      },

      render: function() {
        var that = this;

        var renderFn = can.mustache(template_component_commentstar);
        that.options.html = renderFn(that.data, that.helpers);
        that.element.html(that.options.html);
        that.el = $(".commstar a", that.element);
      },

      '.commstar a click': function(element, event) {
        event && event.preventDefault();

        if (this.view) {
          return false;
        }

        this.el.removeClass("active");
        element.addClass("active");

        this.dataWatcher.setAttr("star", element.attr("_val"));
        this.resetStar(this.star);
debugger;
        if (typeof this.options.clickCallback != 'undefined') {
          this.options.clickCallback.apply(this, [this.star]);
        }
      },

      setTip: function(score) {
        if (this.options.showtip !== true) {
          return false;
        }

        var map = {
          "1": "非常不满意",
          "2": "不满意",
          "3": "一般",
          "4": "满意",
          "5": "非常满意"
        }

        $(".tooltip-cart-left", this.element).removeClass("hide");

        $(".comment-add-score", this.element).text(map[score])
      },

      getValue: function() {debugger;
        return this.star;
      },

      '.commstar a mouseover': function(element, event) {
        event && event.preventDefault();
        if (this.view) {
          return false;
        }
        element.addClass("hover");

        $(".commstar a").removeClass("active");
        this.setTip(element.attr("_val"));
      },

      '.commstar a mouseout': function(element, event) {
        event && event.preventDefault();
        if (this.view) {
          return false;
        }
        element.removeClass("hover");
        this.resetStar(this.star);
        this.setTip(this.star);
      },

      initStar: function(level) {
        this.resetStar(level);
        this.setTip(level);

        if (typeof this.options.clickCallback != 'undefined') {
          this.options.clickCallback.apply(this, [this.star]);
        }
      },

      resetStar: function(level) {
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