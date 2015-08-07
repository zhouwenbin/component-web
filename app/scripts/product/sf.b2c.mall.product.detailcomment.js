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
      },

      showTerminal: function(terminalType) {
        var map = {
          "1": "顺丰海淘web网页版",
          "3": "顺丰海淘H5网页版",
          "4": "顺丰海淘APP版"
        }
        return map[terminalType()];
      },

      showStar: function(score) {
        score = score() / 100;
        var imgArr = [];
        var onImg = "http://img0.sfht.com/img/5fdc69349cd3d4c3f32531c9c2b07d35.jpg";
        var offImg = "http://img0.sfht.com/img/4b9d8e58142d0d0c5daeab5b6560c858.jpg";
        for (var i = 0; i < score; i++) {
          imgArr.push('<img src="' + onImg + '">');
        }

        for (var i = 0; i < 5 - score; i++) {
          imgArr.push('<img src="' + offImg + '">');
        }

        return imgArr.join("");
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
        "pageNum": 10,
        "pageSize": 1
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
        "pageNum": 10,
        "pageSize": 1
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

    },

    '.comment-img li click': function(element, event) {
      this.smallImg = element.parents('.comment-img');
      this.bigImg = this.smallImg.siblings('.comment-img-big');
      this.num = this.smallImg.find('li').length;
      this.index = this.smallImg.find('li').index(this);
      element.toggleClass('active').siblings().removeClass('active');
      this.bigImg.find('li').eq(this.index).toggleClass('active').siblings().removeClass('active');

      this.checkBtn();
    },

    checkBtn: function() {
      if (this.bigImg.find('li').hasClass('active')) {
        this.bigImg.find('a').show();
        if (this.index == 0) {
          this.bigImg.find('.comment-img-big-prev').hide();
        } else {
          this.bigImg.find('.comment-img-big-prev').show();
        }
        if (this.index == this.num - 1) {
          this.bigImg.find('.comment-img-big-next').hide();
        } else {
          this.bigImg.find('.comment-img-big-next').show();
        }
      } else {
        this.bigImg.find('a').hide();
      }
    },

    //向前
    '.comment-img-big-prev click': function(){
      this.index--;
      this.smallImg.find('li').eq(this.index).addClass('active').siblings().removeClass('active');
      this.bigImg.find('li').eq(this.index).addClass('active').siblings().removeClass('active');
      this.checkBtn();
    },

    //向后
    '.comment-img-big-next click': function(){
      this.index++;
      this.smallImg.find('li').eq(this.index).addClass('active').siblings().removeClass('active');
      this.bigImg.find('li').eq(this.index).addClass('active').siblings().removeClass('active');
      this.checkBtn();
    }


  });
})