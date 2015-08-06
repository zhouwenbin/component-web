'use strict';

define('sf.b2c.mall.product.detailcomment', ['can',
  'sf.b2c.mall.api.commentGoods.findCommentInfoListByType',
  'sf.b2c.mall.fixture.case.center.comment',
  'text!template_center_message'
], function(can, SFfindCommentInfoListByType, Fixturecomment, template_center_message) {
  return can.Control.extend({

    /**
     * 初始化控件
     * @param  {DOM} element 容器element
     * @param  {Object} options 传递的参数
     */
    init: function(element, options) {
      this.render();
    },

    render: function() {
      var that = this;

      var findCommentInfoListByType = new SFfindCommentInfoListByType({
        "type": 0,
        "pageNum": 0,
        "pageSize": 10,
        "fixture": true
      });

      can.when(findCommentInfoListByType.sendRequest())
        .done(function(commentData) {

          that.options.comments = commentData;

          that.options = new can.Map(that.options);

          var renderFn = can.mustache(template_center_message);
          that.options.html = renderFn(that.options, that.helpers);
          that.element.html(that.options.html);
        })
        .fail(function(error) {
          console.error(error);
        })
    }
  });
})