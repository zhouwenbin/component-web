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
  'sf.b2c.mall.fixture.case.center.comment',
  'text!template_component_commenteditor'

], function(can, store, $, $cookie, placeholders, SFConfig, SFMessage, SFCommenttag, SFCommentstar, SFCommentpic,
  SFPublishComment,
  FixtureComment,
  template_component_commenteditor) {
  return can.Control.extend({

    init: function(element, options) {
      this.component = {};
      this.adapter = {};

    },

    show: function(data, tag, element, callback) {
      // orderid和itemid为全局变量
      this.orderid = data.orderid;
      this.itemid = data.itemid;

      var map = {
        'add': function(data) {
          return {
            input: {
              score: 0,
              commentGoodsLabels: null,
              content: '',
              img0: null,
              img1: null,
              img2: null,
              img3: null,
              img4: null,
              isAnonym: false
            },
            error: {
              score: null,
              commentGoodsLabels: null,
              content: null,
              img: null,
              receiver: null
            }
          };
        },
        'edit': function(data) {

          return {
            input: {
              score: data.score,
              commentGoodsLabels: null,
              content: data.content,
              img0: data.img0,
              img1: data.img1,
              img2: data.img2,
              img3: data.img3,
              img4: data.img4,
              isAnonym: data.isAnonym
            },
            error: {
              score: null,
              commentGoodsLabels: null,
              content: null,
              img: null,
              receiver: null
            }
          };
        }
      };

      var info = map[tag].call(this, data);
      this.adapter.comment = new can.Map(info);

      this.render(this.adapter, tag, element, callback);
    },

    render: function(data, tag, element, submitCallback) {

      // 初始化模板
      this.setup(element);
      var renderFn = can.mustache(template_component_commenteditor);
      var html = renderFn(data, this.helpers);
      element.html(html);

      //初始化评价星星。在点击星星后，要调用回调设定下map中取值，做到两个组件的分离
      var handle = _.bind(this.starClickCallback, this);
      this.component.commentstar = new SFCommentstar($("#commentstararea"), {
        "clickCallback": handle
      });

      //初始化标签
      var data = this.getTagData();

      this.component.commenttag = new SFCommenttag($("#commenttagarea"), {
        "data": data
      });

      //初始化图片
      var imgData = this.getImgData();
      this.component.commentpic = new SFCommentpic(null, {
        "imgData": []
      });
    },

    '#submitcomment click': function(element, event) {
      debugger;
      event && event.preventDefault();

      var comment = this.adapter.comment.input.attr();

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

      var publishComment = new SFPublishComment({"commentGoodsInfos": objArr, "fixture":true});
      publishComment
        .sendRequest()
        .done(function(data) {
          debugger;
        })
        .fail(function(error) {
          debugger;
        })

      if (_.isFunction(this.submitCallback)) {
        this.submitCallback();
      };
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
    starClickCallback: function(value) {
      this.adapter.comment.input.attr("score", value)
    }

  });
})