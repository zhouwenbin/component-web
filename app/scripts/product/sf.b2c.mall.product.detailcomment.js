'use strict';

define('sf.b2c.mall.product.detailcomment', ['can',
  'sf.b2c.mall.api.commentGoods.findCommentLabels',
  'sf.b2c.mall.api.commentGoods.findCommentInfoList',
  'sf.b2c.mall.fixture.case.center.comment',
  'sf.b2c.mall.adapter.pagination',
  'sf.b2c.mall.widget.pagination',
  'text!template_product_detailcomment'
], function(can, SFFindCommentLabels, SFfindCommentInfoList, Fixturecomment, PaginationAdapter, Pagination, template_product_detailcomment) {

  can.route.ready();

  return can.Control.extend({

    helpers: {
      hasComments: function(comments, options) {
        if (comments().length > 0) {
          return options.fn(options.contexts || this);
        } else {
          return options.inverse(options.contexts || this);
        }
      },

      hasComments2: function(commentCount, options) {
        if (commentCount() > 0) {
          return options.fn(options.contexts || this);
        } else {
          return options.inverse(options.contexts || this);
        }
      },

      hasLabel: function(labels, options) {
        if (labels() && labels().length > 0) {
          return options.fn(options.contexts || this);
        } else {
          return options.inverse(options.contexts || this);
        }
      },

      showCommentPlusTime: function(plusTime, time) {
        plusTime = plusTime();
        time = time();

        var day = (plusTime - time) / (3600 * 24 * 1000);
        var hour = (plusTime - time) / (3600 * 1000);
        var min = (plusTime - time) / (60 * 1000);
        var sec = (plusTime - time) / (1000);

        if (min < 1) {
          return sec.toFixed() + "秒后"
        } else if (hour < 1) {
          return min.toFixed() + "分钟后"
        } else if (day < 1) {
          return hour.toFixed() + "小时后"
        } else {
          return day.toFixed() + "天后"
        }
      },

      showTerminal: function(terminalType) {
        var map = {
          "1": "顺丰海淘web网页版",
          "3": "顺丰海淘H5网页版",
          "4": "顺丰海淘iOS手机版",
          "5": "顺丰海淘Andriod版",
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
      var routeParams = can.route.attr();
      if (!routeParams.page) {
        routeParams = _.extend(routeParams, {
          page: 1
        });
      }

      this.render(routeParams.page);
    },

    render: function(page) {
      var that = this;

      var findCommentLabels = new SFFindCommentLabels({
        "itemId": this.options.itemId
      });
      var findCommentInfoList = new SFfindCommentInfoList({
        "itemId": this.options.itemId,
        "type": 0,
        "pageNum": 3,
        "pageSize": page
      });

      can.when(findCommentLabels.sendRequest(), findCommentInfoList.sendRequest())
        .done(function(labels, commentData) {

          that.options.outline = labels;
          that.options.comments = commentData;

          if (that.options.outline.keyValuePaires) {
            that.options.outline.totalCount = labels.keyValuePaires[0].value;
            that.options.outline.goodCount = labels.keyValuePaires[1].value;
            that.options.outline.middleCount = labels.keyValuePaires[2].value;
            that.options.outline.badCount = labels.keyValuePaires[3].value;
            that.options.outline.shareorderCount = labels.keyValuePaires[4].value;
            that.options.outline.addplusCount = labels.keyValuePaires[5].value;
          }

          that.options = new can.Map(that.options);

          var renderFn = can.mustache(template_product_detailcomment);
          that.options.html = renderFn(that.options, that.helpers);
          that.element.html(that.options.html);

          that.options.page = new PaginationAdapter();
          that.formatPageData(commentData);

          new Pagination('.sf-b2c-mall-detailcomment-pagination', that.options);

          that.supplement(that.options.outline.totalCount);
        })
        .fail(function(error) {
          console.error(error);
        })
    },

    '{can.route} change': function(el, attr, how, newVal, oldVal) {
      if (el.page == this.currentRouteData) {
        return true;
      } else {
        var routeParams = can.route.attr();
        this.render(routeParams.page);
        $("body,html").animate({
          scrollTop: $('#detaillastcomment').offset().top - $(".nav-inner").height()
        }, 0);
        this.currentRouteData = el.page;
      }
    },

    supplement: function(value) {
      $("#comment-totalcount").text("（" + value + "）")
    },

    getComments: function(type) {
      var that = this;

      var findCommentInfoList = new SFfindCommentInfoList({
        "itemId": that.options.itemId,
        "type": type,
        "pageNum": 3,
        "pageSize": 1
      });

      findCommentInfoList
        .sendRequest()
        .done(function(data) {

          // 放入缓存，后面不要重复请求
          that.options[that.commentsObjMap[type]] = data;

          that.options.attr("comments", data);

          that.formatPageData(data);

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
        var cacheData = this.options[this.commentsObjMap[type]];
        this.options.attr("comments", cacheData);

        this.formatPageData(cacheData);
      }

    },

    formatPageData: function(pageData) {
      this.options.page.format({
        "pageNum": pageData.page.pageSize,
        "currentNum": pageData.page.currentNum,
        "totalNum": pageData.page.totalNum,
        "pageSize": pageData.page.pageNum
      });
    },

    '.comment-img li click': function(element, event) {
      this.smallImg = element.parents('.comment-img');
      this.bigImg = this.smallImg.siblings('.comment-img-big');
      this.num = this.smallImg.find('li').length;
      this.index = this.smallImg.find('li').index(element);
      element.toggleClass('active').siblings().removeClass('active');
      this.bigImg.find('li').eq(this.index).toggleClass('active').siblings().removeClass('active');

      this.checkBtn();
    },

    '.comment-img-big li click': function() {
      this.smallImg.find('li').removeClass('active');
      this.bigImg.find('li').removeClass('active');
      this.bigImg.find('a').hide();
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
    '.comment-img-big-prev click': function() {
      this.index--;
      this.smallImg.find('li').eq(this.index).addClass('active').siblings().removeClass('active');
      this.bigImg.find('li').eq(this.index).addClass('active').siblings().removeClass('active');
      this.checkBtn();
    },

    //向后
    '.comment-img-big-next click': function() {
      this.index++;
      this.smallImg.find('li').eq(this.index).addClass('active').siblings().removeClass('active');
      this.bigImg.find('li').eq(this.index).addClass('active').siblings().removeClass('active');
      this.checkBtn();
    }


  });
})