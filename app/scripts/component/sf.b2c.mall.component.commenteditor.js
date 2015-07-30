'use strict';

define('sf.b2c.mall.component.commenteditor', [
  'can',
  'store',
  'jquery',
  'jquery.cookie',
  'placeholders',
  'sf.b2c.mall.business.config',
  'sf.b2c.mall.widget.message',
  'sf.b2c.mall.component.commenttag',
  'sf.b2c.mall.component.commentstar',
  'sf.b2c.mall.component.commentpic',
  'text!template_component_commenteditor'

], function(can, store, $, $cookie, placeholders, SFConfig, SFMessage, SFCommenttag, SFCommentstar, SFCommentpic, template_component_commenteditor) {
  return can.Control.extend({

    init: function(element, options) {

    },

    show: function(data, tag, element) {
      this.render(data, tag, element);
    },

    render: function(data, tag, element) {
      this.setup(element);
      var renderFn = can.mustache(template_component_commenteditor);
      element.html(renderFn);

      //初始化评价星星
      var commentstar = new SFCommentstar($("#commentstararea"), {
        "clickCallback": this.clickCallback
      });

      //初始化标签
      var data = this.getTagData();

      var tag = new SFCommenttag($("#commenttagarea"), {
        "data": data
      });

      //初始化图片
      var imgData = this.getImgData();
      var commentpic = new SFCommentpic(null, {
        "imgData": []
      });
    },

    getImgData: function() {
      return ["http://img0.sfht.com/sf/b267/a77adbad88d5e2128ee262d5276ade88.jpg@144h_144w_50Q_1x.jpg", "http://img0.sfht.com/sf/b267/a77adbad88d5e2128ee262d5276ade88.jpg@144h_144w_50Q_1x.jpg"]
    },

    getTagData: function(itemIds) {
      return [{
        "id": "1",
        "name": "送人不错的"
      }, {
        "id": "2",
        "name": "功能挺多"
      }, {
        "id": "3",
        "name": "内容较丰富"
      }, {
        "id": "4",
        "name": "外观很漂亮"
      }, {
        "id": "5",
        "name": "发货快"
      }, {
        "id": "6",
        "name": "操作灵敏"
      }]
    },

    // 回调，用于组件和业务分离
    clickCallback: function(value) {
      $("[name=commentStar]").val(value);
    }

  });
})