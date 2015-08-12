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
        this.view = options.view;
        this.render();
      },

      render: function() {
        var that = this;

        // 统计自定义标签个数
        this.customizedTagCount = 0;

        this.options.showCusomized = !this.view;

        var renderFn = can.mustache(template_component_commenttag);
        that.options.html = renderFn(that.options, that.helpers);
        that.element.html(that.options.html);
      },

      "#customeized keyup": function(element, event) {
        var value = $(element).val();

        if (!value){
          return false;
        }

        if (value.length > 12) {
          this.options.adapter.comment.attr("error", {
            "commentGoodsLabels": '最多只能输入12个字哦，再删减下吧'
          });

          return false;
        }

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
          $(element).val("");

          ++this.customizedTagCount;
          return false;
        }
      },

      ".btn-goods click": function(element, event) {
        if (this.view) {
          return false;
        }
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
            "name": $(item).attr("data-name")
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
      }

    });
  })