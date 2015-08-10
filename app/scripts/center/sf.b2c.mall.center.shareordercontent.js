'use strict';

define('sf.b2c.mall.center.shareordercontent', [
    'can',
    'jquery',
    'qrcode',
    'sf.helpers',
    'chart',
    'moment',
    'sf.util',
    'sf.b2c.mall.widget.message',
    'sf.b2c.mall.business.config',
    'sf.b2c.mall.component.commenteditor',
    'sf.b2c.mall.api.commentGoods.getComments',
    'sf.b2c.mall.api.commentGoods.publishCompreComment',
    'sf.b2c.mall.api.commentGoods.findCommentStatus',
    'sf.b2c.mall.api.order.getOrderV2',
    'sf.b2c.mall.component.commentstar',
    'sf.b2c.mall.fixture.case.center.comment',
    'text!template_center_shareordercontent'
  ],
  function(can, $, qrcode, helpers, chart, moment, utils, SFMessage, SFConfig, SFCommenteditor, SFGetComments,
    SFPublishCompreComment,
    SFFindCommentStatus,
    SFGetOrder,
    SFCommentstar,
    SFFixturecomment,
    template_center_shareordercontent) {

    return can.Control.extend({

      helpers: {
        showImage: function(group) {
          var array = eval(group());
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
          if (!spec()) {
            return "--";
          } else {
            return spec();
          }
        },

        'isSecGoods': function(goodsType, options) {
          if (goodsType() == "SECKILL") {
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

      firstItemClick: function() {
        var firstEle = $(".gotoshareorder").eq(0);
        var status = firstEle.attr("data-status");
        if (status == 0 || status == 1) {
          firstEle.click();
        }
      },

      render: function() {
        var that = this;

        var params = can.deparam(window.location.search.substr(1));
        this.orderid = params.orderid;
        this.commentSatisf = params.commentSatisf;

        var getOrder = new SFGetOrder({
          "orderId": this.orderid
        });

        var findCommentStatus = new SFFindCommentStatus({
          "ids": JSON.stringify([this.orderid]),
          "type": 1
        })

        can.when(getOrder.sendRequest(), findCommentStatus.sendRequest())
          .done(function(orderData, commentStatus) {

            // 格式化数据
            that.formatData(orderData, commentStatus);

            // 进行渲染
            var renderFn = can.mustache(template_center_shareordercontent);
            that.options.html = renderFn(that.options, that.helpers);
            that.element.html(that.options.html);

            //渲染整体评价
            that.supplement();
          })
          .fail(function(error) {
            console.error(error);
          });
      },

      formatData: function(orderData, commentStatus) {
        var dataArr = [];
        var that = this;

        // 遍历设置状态和spec
        _.each(orderData.orderItem.orderPackageItemList, function(item) {
          var packageStatus = item.status;
          _.each(item.orderGoodsItemList, function(childItem) {

            // 设置状态
            if (packageStatus != 'COMPLETED' && packageStatus != 'AUTO_COMPLETED') {
              childItem.itemStatus = "-1";
            } else {
              childItem.itemStatus = that.getCommentStatus(childItem.itemId, commentStatus);
            }

            // 设置spec
            if (!childItem.spec || "" == childItem.spec) {
              childItem.spec = "--";
            }

            // 设置按钮
            childItem.operationHTML = that.nameMap[childItem.itemStatus];

            // 加入到数组中去
            dataArr.push(new can.Map(childItem));
          })
        })

        that.options.orderItem = dataArr;
        that.options.showinputtotal = (this.commentSatisf === "1") ? false : true;
        that.options = new can.Map(this.options);
      },

      supplement: function() {
        this.component.commentstar1 = new SFCommentstar($("#commentstararea1"), {
          "showtip": false
        });

        this.component.commentstar2 = new SFCommentstar($("#commentstararea2"), {
          "showtip": false
        });

        this.component.commentstar3 = new SFCommentstar($("#commentstararea3"), {
          "showtip": false
        });

        this.firstItemClick();
      },

      getCommentStatus: function(itemId, commentStatus) {
        var result = "";

        _.each(commentStatus.value, function(item) {
          if (item.itemId == itemId) {
            result = item.status;
          }
        })

        return result;
      },

      nameMap: {
        "-1": "商品未签收，暂无法评价",
        "0": "去评价",
        "1": "去追评",
        "2": "查看评价"
      },

      operationMap: {
        "0": "add",
        "1": "addplus",
        "2": "view"
      },

      /**
       * [submitCallback 编辑组件点击提交之后的回调]
       * @return {[type]} [description]
       */
      submitCallback: function() {
        // 设置按钮状态和文案
        var currentObj = this.options.orderItem[this.editIndex];
        var status = currentObj.attr("itemStatus");
        if (status == 0 || status == 1) {
          var currentStatus = parseInt(status) + 1;
          currentObj.attr("itemStatus", currentStatus);
          currentObj.attr("operationHTML", this.nameMap[currentStatus]);
        }

        if (nextEle.length > 0) {
          // 如果下一个状态为不能评价，咋停止自动打开
          var nextEle = $(".gotoshareorder").eq(this.editIndex + 1);
          if (that.options.orderItem[nextEle].status == -1) {
            if (this.commenteditor) {
              $(".commentEditorArea").html("")
            }

            return false;
          }

          nextEle.click();
        } else {
          // 最后一个 进行销毁
          if (this.commenteditor) {
            $(".commentEditorArea").html("")
          }
        }
      },

      "#submittotaljudge click": function(element, event) {
        event && event.preventDefault();

        var serviceScore = this.component.commentstar1.getValue();
        var sendScore = this.component.commentstar2.getValue();
        var logisticsScore = this.component.commentstar3.getValue();

        if (!serviceScore) {
          utils.tip("请选择服务态度哦~");
          return false;
        }

        if (!sendScore) {
          utils.tip("请选择发货速度哦~");
          return false;
        }

        if (!logisticsScore) {
          utils.tip("请选择物流速度哦~");
          return false;
        }

        var publishCompreComment = new SFPublishCompreComment({
          "orderId": this.orderid,
          "serviceScore": serviceScore * 100,
          "sendScore": sendScore * 100,
          "logisticsScore": logisticsScore * 100
        });

        var that = this;
        publishCompreComment
          .sendRequest()
          .done(function(data) {
            if (data.value) {
              that.options.attr("showinputtotal", false);
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
        var skuId = element.attr('data-skuid');
        var spec = element.attr('data-spec');

        if (itemStatus == "-1") {
          return false;
        }

        var isLastEdit = (this.editIndex == this.options.orderItem.length - 1);

        // 进行销毁和重新初始化
        if (this.commenteditor) {
          $(".commentEditorArea").html("")
        }

        var getComments = new SFGetComments({
          "orderId": this.orderid,
          "itemID": itemId
        });

        var that = this;
        getComments.sendRequest()
          .done(function(data) {

            if (data.value) {
              data = _.extend(data.value[0], {
                "orderid": that.orderid,
                "itemid": itemId,
                "skuid": skuId,
                "spec": spec,
                "isLastEdit": isLastEdit
              });
            } else {
              data = {
                "orderid": that.orderid,
                "itemid": itemId,
                "skuid": skuId,
                "spec": spec,
                "isLastEdit": isLastEdit
              }
            }

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