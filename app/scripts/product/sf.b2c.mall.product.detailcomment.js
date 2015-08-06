'use strict';

define('sf.b2c.mall.product.detailcomment', ['can',
  'sf.b2c.mall.api.commentGoods.findCommentLabels',
  'sf.b2c.mall.api.commentGoods.findCommentInfoList',
  'sf.b2c.mall.fixture.case.center.comment',
  'text!template_product_detailcomment'
], function(can, SFFindCommentLabels, SFfindCommentInfoList, Fixturecomment, template_product_detailcomment) {
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

      var findCommentLabels = new SFFindCommentLabels({
        "itemId": this.options.itemId,
        "fixture": true
      });
      var findCommentInfoList = new SFfindCommentInfoList({
        "itemId": this.options.itemId,
        "type": 0,
        "pageNum": 0,
        "pageSize": 10,
        "fixture": true
      });

      can.when(findCommentLabels.sendRequest(), findCommentInfoList.sendRequest)
        .done(function(labels, commentData) {
          var renderFn = can.mustache(template_product_detailcomment);
          that.options.html = renderFn(that.data, that.helpers);
          that.element.html(that.options.html);
        })
        .fail(function(error) {
          console.error(error);
        })
    }
  });
})