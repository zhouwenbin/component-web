define(
  'sf.b2c.mall.component.commenttag', [
    'jquery',
    'can',
    'sf.b2c.mall.business.config',
    'sf.util',
    'underscore',
    'text!template_component_commenttag'
  ],
  function($, can, SFBizConf, SFFn, _, template_component_commenttag) {
    'use strict'

    return can.Control.extend({

      init: function(element, options) {
        this.render();
      },

      render: function() {
        var that = this;

        var renderFn = can.mustache(template_component_commenttag);
        that.options.html = renderFn(that.options, that.helpers);
        that.element.html(that.options.html);
      },

      '#customeized click': function(element, event) {
        event && event.preventDefault();
        $("#customeizedinput").removeClass("hide");
        $("#customeized").addClass("hide");
      },

      ".tips-list li:not(.list-last) click": function(element, event) {
        debugger;
        element.toggleClass("select");
        this.checkTag(element.parents(":eq(4)"));
      },

      checkTag: function(parentElement) {
        var tagflag = $(parentElement).find("#commenttagarea").attr("tagflag");
        if (typeof tagflag != 'undefined' && "false" == tagflag.toString())
          return true;

        var commenttagarea = $("#commenttagarea", $(parentElement));
        var errortip = $(".msg-error-01", commenttagarea);
        var taglist = $("ul li:not(.list-last).select", commenttagarea);
        if (0 == taglist.length || taglist.length > 5) {
          this.tip("要在1到5个之间");
          return false;
        }

        return true;
      },

      tip: function(message, time) {
        var $el = $('<div class="dialog-cart" style="z-index:9999;"><div class="dialog-cart-inner" style="width:242px;padding:20px 60px;"><p style="margin-bottom:10px;">' + message + '</p></div><a href="javascript:" class="icon icon108 closeDialog">关闭</a></div>');
        if ($('.dialog-cart').length > 0) {
          return false;
        };
        $(document.body).append($el);
        $('.closeDialog').click(function(event) {
          $el.remove();
        });
        setTimeout(function() {
          $el.remove();
        }, time || 3000);
      }

    });
  })