'use strict';

define('sf.b2c.mall.product.detailcomment', ['can',
  'sf.b2c.mall.api.commentGoods.findCommentLabels',
  'sf.b2c.mall.api.commentGoods.findCommentInfoList',
  'sf.b2c.mall.fixture.case.center.comment',
  'sf.b2c.mall.adapter.pagination',
  'sf.b2c.mall.widget.pagination',
  'text!template_product_detailcomment'
], function(can, SFFindCommentLabels, SFfindCommentInfoList, Fixturecomment, PaginationAdapter, Pagination, template_product_detailcomment) {
  return can.Control.extend({

    helpers: {
      hasComments: function(comments, options) {
        if (comments().length > 0) {
          return options.fn(options.contexts || this);
        } else {
          return options.inverse(options.contexts || this);
        }
      }
    },

    /**
     * 初始化控件
     * @param  {DOM} element 容器element
     * @param  {Object} options 传递的参数
     */
    init: function(element, options) {
      this.render();
    },

    render: function() {
      debugger;
      var that = this;

      var findCommentLabels = new SFFindCommentLabels({
        "itemId": this.options.itemId
      });
      var findCommentInfoList = new SFfindCommentInfoList({
        "itemId": this.options.itemId,
        "type": 0,
        "pageNum": 0,
        "pageSize": 10
      });

      can.when(findCommentLabels.sendRequest(), findCommentInfoList.sendRequest())
        .done(function(labels, commentData) {

          that.options.outline = labels;
          that.options.comments = commentData;

          if (that.options.outline.keyValuePaires) {
            that.options.outline.totalCount = labels.commentCount;
            that.options.outline.goodCount = labels.keyValuePaires[0].value;
            that.options.outline.middleCount = labels.keyValuePaires[1].value;
            that.options.outline.badCount = labels.keyValuePaires[2].value;
            that.options.outline.shareorderCount = labels.keyValuePaires[3].value;
            that.options.outline.addplusCount = labels.keyValuePaires[4].value;
          }

          that.options = new can.Map(that.options);

          var renderFn = can.mustache(template_product_detailcomment);
          that.options.html = renderFn(that.options, that.helpers);
          that.element.html(that.options.html);

          that.options.page = new PaginationAdapter();
          that.options.page.format({
            "pageNum": commentData.page.pageNum,
            "currentNum": commentData.page.currentNum,
            "totalNum": commentData.page.totalNum,
            "pageSize": commentData.page.pageSize
          });
          new Pagination('.sf-b2c-mall-detailcomment-pagination', that.options);

          that.supplement(that.options.outline.totalCount);
        })
        .fail(function(error) {
          console.error(error);
        })
    },

    supplement: function(value) {
      $("#comment-totalcount").text("（" + value + "）")
    },

    getComments: function(type) {
      var that = this;

      var findCommentInfoList = new SFfindCommentInfoList({
        "itemId": that.options.itemId,
        "type": type,
        "pageNum": 0,
        "pageSize": 10
      });

      findCommentInfoList
        .sendRequest()
        .done(function(data) {

          // 放入缓存，后面不要重复请求
          that.options[that.commentsObjMap[type]] = data;

          that.options.attr("comments", data);

        })
        .fail(function(error) {
          console.error(error);
        })
    },

    commentsObjMap: {
      "0": "totalComments",
      "1": "goodComments",
      "2": "middleComments",
      "3": "badComments",
      "4": "shareorderComments",
      "5": "addplusComments",
    },

    '.comment-tab li click': function(element, event) {
      element.addClass('active').siblings().removeClass('active');
      var type = element.attr("data-type");

      // 不要重复请求
      if (!this.options[this.commentsObjMap[type]]) {
        this.getComments(type);
      } else {
        this.options.attr("comments", this.options[this.commentsObjMap[type]]);
      }

    }
  });
})