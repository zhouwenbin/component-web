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
  'sf.b2c.mall.api.commentGoods.publishComment',
  'sf.b2c.mall.api.commentGoods.findCommentLabels',
  'sf.b2c.mall.fixture.case.center.comment',
  'text!template_component_commenteditor'

], function(can, store, $, $cookie, placeholders, SFConfig, SFMessage, SFCommenttag, SFCommentstar, SFCommentpic,
  SFPublishComment,
  SFFindCommentLabels,
  FixtureComment,
  template_component_commenteditor) {
  return can.Control.extend({

    init: function(element, options) {
      this.component = {};
      this.adapter = {};
      this.commentId = null;

      this.show(this.options.data, this.options.tag);
    },

    destroy: function() {
      can.Control.prototype.destroy.call(this);
    },

    statusMap: {
      "add": 0,
      "addplus": 1,
      "view": 2
    },

    show: function(data, tag) {
      // orderid和itemid为全局变量
      this.orderid = data.orderid;
      this.itemid = data.itemid;
      this.itemName = data.itemName;
      this.skuid = data.skuid;
      this.spec = data.spec;
      this.packageNo = data.packageNo;
      this.itemImg = data.itemImg;
      this.tag = tag;

      // 获得标签
      var labels = [];
      // if (data.skuLabels) {
      //   labels = labels.concat(data.skuLabels);
      // }
      if (tag == 'add') {
        if (data.skuLabels) {
          labels = labels.concat(data.skuLabels);
        }
      } else if (tag == "view" || tag == "addplus") {
        if (data.commentGoodsLabels) {
          labels = labels.concat(data.commentGoodsLabels);
        }
      }

      // 获得commentId
      if (data.commentId) {
        this.commentId = data.commentId;
      }

      this.status = this.statusMap[tag];

      var map = {
        'add': function(data) { //发表评论
          return {
            input: {
              score: 0,
              commentGoodsLabels: labels,
              viewcontent: false,
              content: '',
              showpluscontent: false,
              pluscontent: '',
              img: null,
              isAnonym: true,
              view: false,
              isLastEdit: data.isLastEdit
            },
            error: {
              score: null,
              commentGoodsLabels: null,
              content: null,
              contentTip: null,
              img: null,
              receiver: null
            }
          };
        },
        'addplus': function(data) { //追加评论

          return {
            input: {
              score: data.score,
              commentGoodsLabels: labels,
              viewcontent: true,
              content: data.content,
              showpluscontent: true,
              viewpluscontent: false,
              pluscontent: '',
              img: data.imgs,
              isAnonym: true,
              view: false,
              isLastEdit: data.isLastEdit
            },
            error: {
              score: null,
              commentGoodsLabels: null,
              content: null,
              contentTip: null,
              img: null,
              receiver: null
            }
          };
        },
        'view': function(data) { //查看评论

          return {
            input: {
              score: data.score,
              commentGoodsLabels: labels,
              viewcontent: true,
              content: data.content,
              showpluscontent: true,
              viewpluscontent: true,
              pluscontent: data.extralContent,
              img: data.imgs,
              isAnonym: data.isAnonym,
              view: true
            },
            error: {
              score: null,
              commentGoodsLabels: null,
              content: null,
              contentTip: null,
              img: null,
              receiver: null
            }
          };
        }
      };

      var info = map[tag].call(this, data);
      this.adapter.comment = new can.Map(info);

      this.render(this.adapter, tag);
    },

    render: function(adapter, tag) {

      // 初始化模板
      // this.setup(element);
      var renderFn = can.mustache(template_component_commenteditor);
      var html = renderFn(adapter, this.helpers);
      this.element.html(html);

      this.renderComponent(adapter, tag);
    },

    /**
     * [renderComponent 渲染组件]
     * @param  {[type]} data [description]
     * @return {[type]}      [description]
     */
    renderComponent: function(adapter, tag) {
      var that = this;

      //初始化评价星星。在点击星星后，要调用回调设定下map中取值，做到两个组件的分离
      var handle = _.bind(this.starClickCallback, this);
      this.component.commentstar = new SFCommentstar($("#commentstararea"), {
        "clickCallback": handle,
        "defaultLevel": 5,
        "level": adapter.comment.input.score/100,
        "view": tag === 'add' ? false : true,
        "showtip": true
      });

      //初始化标签
      var isTagView = (tag === 'add' ? false : true);
      if (isTagView && adapter.comment.input.commentGoodsLabels.length == 0) {
        $("#tagLi").remove();
      } else {
        that.component.commenttag = new SFCommenttag($("#commenttagarea"), {
          "data": adapter.comment.input.commentGoodsLabels,
          "showtip": true,
          "view": isTagView,
          "adapter": adapter
        });
      }

      // 初始化图片
      this.component.commentpic = new SFCommentpic(null, {
        "imgData": adapter.comment.input.attr("img"),
        "view": adapter.comment.input.attr("view")
      });
    },

    check: function(comment) {

      // 校验分数
      if (!comment.score) {
        this.adapter.comment.attr("error", {
          "score": '还没评分哟'
        });
        return false;
      }

      // 校验内容
      if (!this.checkContent()) {
        return false;
      }


      if (this.tag == "addplus") {
        if (!this.checkContentPlus()) {
          return false;
        }
      }

      // 校验标签
      if (this.component.commenttag) {
        var tags = this.component.commenttag.getValue();

        if (tags && tags.length > 5) {
          this.adapter.comment.attr("error", {
            "commentGoodsLabels": '最多只能选择5个标签哦，选你认为最贴切的吧'
          });
          return false;
        }
      }

      return true;
    },

    '#submitcomment click': function(element, event) {
      event && event.preventDefault();

      if (element.hasClass("disable")) {
        return false;
      }

      element.addClass("disable");

      var comment = this.adapter.comment.input.attr();

      if (!this.check(comment)) {
        element.removeClass("disable");
        return false;
      }

      if (this.component.commenttag) {
        var tagList = this.component.commenttag.getValue();
        if (tagList === false) {
          element.removeClass("disable");
          return false;
        }
      }

      var objArr = [];
      var obj = {
        "commentId": this.commentId,
        "orderId": this.orderid,
        "packageNo": this.packageNo,
        "skuId": this.skuid,
        "itemId": this.itemid,
        "itemName": this.itemName,
        "itemImg": this.itemImg,
        "score": comment.score * 100,
        "content": comment.content,
        "extralContent": comment.pluscontent,
        "imgs": this.component.commentpic.getValue(),
        "commentGoodsLabels": this.component.commenttag ? this.component.commenttag.getValue() : [],
        "isAnonym": comment.isAnonym,
        "commentStatus2": this.status,
        "terminalType": 1,
        "itemPro": this.spec
      }
      objArr.push(obj);

      var publishComment = new SFPublishComment({
        "commentGoodsInfos": JSON.stringify(objArr)
      });

      var that = this;
      publishComment
        .sendRequest()
        .done(function(data) {

          // 执行回调
          if (_.isFunction(that.options.submitCallback)) {
            that.options.submitCallback(data.value[0].integralAmount);
          };

        })
        .fail(function(error, message) {
          if (error == 14029000) {
            that.adapter.comment.attr("error", {
              "commentGoodsLabels": '您的标签中有如下敏感词：' + message + "。请重新选择哦~"
            });
          } else if (error == 14013000) {
            that.adapter.comment.attr("error", {
              "content": '您的评价中有如下敏感词：' + message + "。请重新输入哦~",
              "pluscontent": '您的评价中有如下敏感词：' + message + "。请重新输入哦~"
            });
          }

        })
        .always(function() {
          element.removeClass("disable");
        })
    },

    // 回调，用于组件和业务分离
    starClickCallback: function(value) {
      this.adapter.comment.input.attr("score", value)
    },

    checkContent: function() {
      var comment = this.adapter.comment.input.attr();

      if (!comment.content) {
        this.adapter.comment.attr("error", {
          "content": '和小伙伴分享下购物心得嘛'
        });
        return false;
      }

      if (!comment.content || comment.content.length < 5) {
        this.adapter.comment.attr("error", {
          "content": '最少5个字，多说几句吧，小伙伴期待你的使用心得'
        });
        return false;
      }

      if (!comment.content || comment.content.length > 300) {
        this.adapter.comment.attr("error", {
          "content": '最多300个字哦'
        });
        return false;
      }

      this.adapter.comment.attr("error", {
        "content": ''
      });
      return true;
    },

    checkContentPlus: function() {
      var comment = this.adapter.comment.input.attr();

      if (!comment.pluscontent) {
        this.adapter.comment.attr("error", {
          "pluscontent": '和小伙伴分享下购物心得嘛'
        });
        return false;
      }

      if (!comment.pluscontent || comment.pluscontent.length < 5) {
        this.adapter.comment.attr("error", {
          "pluscontent": '最少5个字，多说几句吧，小伙伴期待你的使用心得'
        });
        return false;
      }

      if (!comment.pluscontent || comment.pluscontent.length > 300) {
        this.adapter.comment.attr("error", {
          "pluscontent": '最多300个字哦'
        });
        return false;
      }

      this.adapter.comment.attr("error", {
        "pluscontent": ''
      });
      return true;
    },

    "#inputContentplus blur": function(element, event) {
      event && event.preventDefault();

      this.checkContentPlus();
    },

    '#inputContentplus keyup': function(element, event) {
      event && event.preventDefault();
      // 统计内容个数
      $("#pluscurrentword").text(element.val().length);
    },

    '#inputContent blur': function(element, event) {
      event && event.preventDefault();

      this.checkContent();
    },

    '#inputContent keyup': function(element, event) {
      event && event.preventDefault();
      // 统计内容个数
      $("#currentword").text(element.val().length);
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