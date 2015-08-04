'use strict';

define('sf.b2c.mall.center.shareordercontent', [
    'can',
    'jquery',
    'qrcode',
    'sf.helpers',
    'chart',
    'moment',
    'sf.b2c.mall.widget.message',
    'sf.b2c.mall.business.config',
    'sf.b2c.mall.component.commenteditor',
    'sf.b2c.mall.api.commentGoods.getComments',
    'sf.b2c.mall.api.order.getOrderV2',
    'text!template_center_shareordercontent'
  ],
  function(can, $, qrcode, helpers, chart, moment, SFMessage, SFConfig, SFCommenteditor, SFGetComments, SFGetOrder, template_center_shareordercontent) {

    return can.Control.extend({

      helpers: {
        showImage: function(group) {
          var array = eval(group);
          if (array && _.isArray(array)) {
            var url = array[0].replace(/.jpg/g, '.jpg@100h_100w.jpg');
            if (/^http/.test(url)) {
              return url;
            } else {
              return 'http://img0.sfht.com' + url;
            }
          } else {
            return array;
          }
        },
        'isSecGoods': function(goodsType, options) {
          if (goodsType == "SECKILL") {
            return options.fn(options.contexts || this);
          } else {
            return options.inverse(options.contexts || this);
          }
        }
      },

      init: function(element, options) {
        this.render();
      },

      render: function() {
        var that = this;

        var params = can.deparam(window.location.search.substr(1));
        this.orderid = params.orderid;

        var getOrder = new SFGetOrder({
          "orderId": this.orderid
        });

        getOrder
          .sendRequest()
          .done(function(data) {
            that.options.orderInfo = data;

            _.each(that.options.orderInfo.orderItem.orderPackageItemList, function(item) {

              _.each(item.orderGoodsItemList, function(childItem) {
                // 调试代码begin
                item.itemStatus = "needRecomment";
                // 调试代码end

                item.operationHTML = that.nameMap[item.itemStatus];
              })

            })

            var renderFn = can.mustache(template_center_shareordercontent);
            that.options.html = renderFn(that.options.orderInfo.orderItem, that.helpers);

            that.element.html(that.options.html);
          })
          .fail(function(error) {
            console.error(error);
          });
      },

      nameMap: {
        "needComment": "去评价",
        "needRecomment": "去追评"
      },

      operationMap: {
        "needComment": "add",
        "needRecomment": "addplus",
        "viewComment": "view"
      },

      /**
       * [submitCallback 编辑组件点击提交之后的回调]
       * @return {[type]} [description]
       */
      submitCallback: function() {
        var nextEle = $(".gotoshareorder").eq(this.editIndex + 1);
        if (nextEle.length > 0) {
          nextEle.click();
        }
      },

      ".gotoshareorder click": function(element, event) {
        // 获得当前编辑地址
        this.editIndex = parseInt(element.attr('data-index'));
        var itemId = element.attr('data-itemid');
        var itemStatus = element.attr('data-status');

        // 进行销毁和重新初始化
        if (this.commenteditor) {
          $(".commentEditorArea").html("")
        }

        var getComments = new SFGetComments({
          "orderId": this.orderid,
          "itemID": this.orderid,
          "fixture": true
        });

        var that = this;
        getComments.sendRequest()
          .done(function(data) {
            debugger;
            that.commenteditor = new SFCommenteditor();

            var handler = _.bind(that.submitCallback, that);
            that.commenteditor.show({
              "orderid": that.orderid,
              "itemid": itemId,
            }, that.operationMap[itemStatus], $(".commentEditorArea", element.parents("li")), handler);
          })
          .fail(function(error) {
            debugger;
          })



        // // 做动画效果
        // $(".commentEditorArea").stop(true, false).animate({
        //   height: "0px",
        //   opacity: 0
        // }, 500);

        // $(".commentEditorArea", element.parents("td")).stop(true, false).animate({
        //   height: "555px",
        //   opacity: 1
        // }, 500);

      }

    });
  })