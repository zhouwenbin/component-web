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
            this.callbacks[name][i].apply(this.context, Array.prototype.slice.call(arguments, 1));
          }
        }
      },

      helpers: {
        showStar: function(score) {
          var imgArr = [];
          var onImg = "http://img0.sfht.com/img/5fdc69349cd3d4c3f32531c9c2b07d35.jpg";
          var offImg = "http://img0.sfht.com/img/4b9d8e58142d0d0c5daeab5b6560c858.jpg";
          for (var i = 0; i < score; i++) {
            imgArr.push('<img style="margin-right:5px" src="' + onImg + '">');
          }

          for (var i = 0; i < 5 - score; i++) {
            imgArr.push('<img style="margin-right:5px" src="' + offImg + '">');
          }

          return imgArr.join("");
        }
      },

      init: function(element, options) {
        this.star = options.level || options.defaultLevel;
        this.view = options.view;
        this.el = null;

        this.render();

        this.initStar(this.star);

        this.dataWatcher.on("star", this.setTip, this);
      },

      render: function() {
        var that = this;

        that.data = {};
        that.data.view = this.view;
        that.data.score = this.star;

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

      getValue: function() {
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