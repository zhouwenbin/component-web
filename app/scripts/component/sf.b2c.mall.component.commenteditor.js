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

    helpers: {

    },

    init: function(element, options) {
      this.component = {};
      this.adapter = {};
    },

    show: function(data, tag, element, submitCallback) {
      // orderid和itemid为全局变量
      this.orderid = data.orderid;
      this.itemid = data.itemid;
      this.submitCallback = submitCallback;

      var map = {
        'add': function(data) { //发表评论
          return {
            input: {
              score: 0,
              commentGoodsLabels: null,
              viewcontent: false,
              content: '',
              viewpluscontent: false,
              pluscontent: '',
              img: null,
              isAnonym: true,
              view: false
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
              score: data.commentGoodsInfo.score,
              commentGoodsLabels: null,
              viewcontent: true,
              content: data.commentGoodsInfo.content,
              viewpluscontent: false,
              pluscontent: '',
              img: data.commentGoodsInfo.imgs,
              isAnonym: true,
              view: false
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
              commentGoodsLabels: null,
              viewcontent: true,
              content: data.commentGoodsInfo.content,
              viewpluscontent: true,
              pluscontent: data.children.content,
              img: data.commentGoodsInfo.imgs,
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

      this.render(this.adapter, element, tag);
    },

    render: function(adapter, element, tag) {

      // 初始化模板
      this.setup(element);
      var renderFn = can.mustache(template_component_commenteditor);
      var html = renderFn(adapter, this.helpers);
      element.html(html);

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
        "view": tag === 'add' ? false : true,
        "showtip": true
      });

      //初始化标签
      this.component.findCommentLabels = new SFFindCommentLabels({
        "itemId": this.itemid,
        "fixture": true
      });
      this.component.findCommentLabels
        .sendRequest()
        .done(function(data) {

          that.component.commenttag = new SFCommenttag($("#commenttagarea"), {
            "data": data.CommentGoodsLabels,
            "showtip": true,
            "view": tag === 'add' ? false : true,
            "adapter": adapter
          });

        })
        .fail(function(error) {

        })

      // 初始化图片
      this.component.commentpic = new SFCommentpic(null, {
        "imgData": adapter.comment.input.attr("img")
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

      // 校验标签
      var tags = this.component.commenttag.getValue();

      if (tags && tags.length > 5) {
        this.adapter.comment.attr("error", {
          "commentGoodsLabels": '最多只能选择5个标签哦，选你认为最贴切的吧'
        });
        return false;
      }

      return true;
    },

    '#submitcomment click': function(element, event) {
      event && event.preventDefault();

      var comment = this.adapter.comment.input.attr();
      var tagList = this.component.commenttag.getValue();

      if (!this.check(comment)) {
        return false;
      }

      if (tagList === false) {
        return false;
      }

      var objArr = [];
      var obj = {
        "orderId": this.orderid,
        "itemId": this.itemid,
        "score": comment.score,
        "content": comment.content,
        "imgs": this.component.commentpic.getValue(),
        "commentGoodsLabels": this.component.commenttag.getValue(),
        "isAnonym": comment.isAnonym,
        "terminalType": 1
      }
      objArr.push(obj);

      var publishComment = new SFPublishComment({
        "commentGoodsInfos": objArr,
        "fixture": true
      });

      var that = this;
      publishComment
        .sendRequest()
        .done(function(data) {

          // 执行回调
          if (_.isFunction(that.submitCallback)) {
            that.submitCallback();
          };

        })
        .fail(function(error) {
          debugger;
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

      return true;
    },

    '#inputContent blur': function(element, event) {
      event && event.preventDefault();
      this.checkContent();
    },

    '#inputContent keyup': function(element, event) {
      event && event.preventDefault();
      // 统计内容个数
      $("#currentword").text(element.val().length);
    }

  });
})