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
    'sf.b2c.mall.api.commentGoods.publishCompreComment',
    'sf.b2c.mall.api.order.getOrderV2',
    'sf.b2c.mall.component.commentstar',
    'sf.b2c.mall.fixture.case.center.comment',
    'text!template_center_shareordercontent'
  ],
  function(can, $, qrcode, helpers, chart, moment, SFMessage, SFConfig, SFCommenteditor, SFGetComments,
    SFPublishCompreComment,
    SFGetOrder,
    SFCommentstar,
    SFFixturecomment,
    template_center_shareordercontent) {

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

        showSpec: function(spec) {
          if (!spec) {
            return "--";
          } else {
            return spec;
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

        this.component = {};

        this.render(this.adapter);
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
            debugger;
            that.options.orderInfo = data;

            _.each(that.options.orderInfo.orderItem.orderPackageItemList, function(item) {

              _.each(item.orderGoodsItemList, function(childItem) {
                // 调试代码begin
                item.itemStatus = that.getRandomStatus();
                // 调试代码end
                if (!item.spec || "" == item.spec) {
                  item.spec = "--";
                }
                item.operationHTML = that.nameMap[item.itemStatus];
              })

            })

            var renderFn = can.mustache(template_center_shareordercontent);
            that.options.html = renderFn(that.options.orderInfo.orderItem, that.helpers);

            that.element.html(that.options.html);

            //渲染整体评价
            that.component.commentstar1 = new SFCommentstar($("#commentstararea1"), {
              "showtip": false
            });

            that.component.commentstar2 = new SFCommentstar($("#commentstararea2"), {
              "showtip": false
            });

            that.component.commentstar3 = new SFCommentstar($("#commentstararea3"), {
              "showtip": false
            });

          })
          .fail(function(error) {
            console.error(error);
          });
      },

      getRandomStatus: function() {
        var status = ["needComment", "needRecomment", "viewComment"];
        return status[Math.floor(Math.random() * 3)];
      },

      nameMap: {
        "needComment": "去评价",
        "needRecomment": "去追评",
        "viewComment": "查看评价"
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

      "#submittotaljudge click": function(element, event) {
        event && event.preventDefault();

        var serviceScore = this.component.commentstar1.getValue();
        var sendScore = this.component.commentstar2.getValue();
        var logisticsScore = this.component.commentstar3.getValue();

        var publishCompreComment = new SFPublishCompreComment({
          "serviceScore": serviceScore * 100,
          "sendScore": sendScore * 100,
          "logisticsScore": logisticsScore * 100,
          "fixture": true
        });

        publishCompreComment
          .sendRequest()
          .done(function(data) {
            if (data.value) {
              debugger;
              $("#inputtotal").addClass("hide");
              $("#showtotal").removeClass("hide");
            }
          })
          .fail(function(error) {
            console.error(error);
          })
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

            data = _.extend(data.value[0], {
              "orderid": that.orderid,
              "itemid": itemId,
            });

            that.commenteditor = new SFCommenteditor();

            var handler = _.bind(that.submitCallback, that);
            that.commenteditor.show(data, that.operationMap[itemStatus], $(".commentEditorArea", element.parents("li")), handler);
          })
          .fail(function(error) {
            console.error(error);
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