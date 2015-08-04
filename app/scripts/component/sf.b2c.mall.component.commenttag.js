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

        // 统计自定义标签个数
        this.customizedTagCount = 0;

        var renderFn = can.mustache(template_component_commenttag);
        that.options.html = renderFn(that.options, that.helpers);
        that.element.html(that.options.html);
      },

      "#customeized keydown": function(element, event) {
        var value = $(element).val();

        if (event.keyCode == 13) {
            if (this.customizedTagCount == 3) {
            this.options.adapter.comment.attr("error", {
              "commentGoodsLabels": '最多只能自定义3个标签哦，选你认为最贴切的吧'
            });
            return false;
          } else {
            this.options.adapter.comment.attr("error", {
              "commentGoodsLabels": ''
            });
          }

          if (!this.checkTag(element.parents(":eq(4)"))) {
            return false;
          }
          var html = '<span data-id="-1" data-name="' + value + '" class="btn btn-goods active">' + value + '<span class="icon icon23"></span>';
          $(html).insertBefore($("#customeized"));
          $("#customeized").text("");

          ++this.customizedTagCount;
          return false;
        }
      },

      ".btn-goods click": function(element, event) {
        element.toggleClass("active");
        if (!this.checkTag(element.parents(":eq(4)"))) {
          return false;
        }
      },

      getValue: function() {
        var result = [];
        var taglist = $(".btn-goods.active", $("#commenttagarea"));
        _.each(taglist, function(item) {
          result.push({
            "id": $(item).attr("data-id"),
            "value": $(item).attr("data-name")
          })
        })

        if (result.length > 3) {
          this.options.adapter.comment.attr("error", {
            "commentGoodsLabels": '最多只能选择3个标签哦，选你认为最贴切的吧'
          });
          return false;
        }

        return result;
      },

      checkTag: function(parentElement) {

        var commenttagarea = $("#commenttagarea", $(parentElement));
        var errortip = $(".msg-error-01", commenttagarea);
        var taglist = $(".btn-goods.active", commenttagarea);
        if (taglist.length > 3) {
          this.options.adapter.comment.attr("error", {
            "commentGoodsLabels": '最多只能选择3个标签哦，选你认为最贴切的吧'
          });
          return false;
        } else {
          this.options.adapter.comment.attr("error", {
            "commentGoodsLabels": ''
          });
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