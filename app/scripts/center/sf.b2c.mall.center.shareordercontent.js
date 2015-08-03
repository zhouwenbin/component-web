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
    'sf.b2c.mall.api.order.getOrderV2',
    'text!template_center_shareordercontent'
  ],
  function(can, $, qrcode, helpers, chart, moment, SFMessage, SFConfig, SFCommenteditor, SFGetOrder, template_center_shareordercontent) {

    return can.Control.extend({

      helpers: {
        showImage: function(group) {
          var array = eval(group);
          if (array && _.isArray(array)) {
            var url = array[0].replace(/.jpg/g, '.jpg@63h_63w.jpg');
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

            var renderFn = can.mustache(template_center_shareordercontent);
            that.options.html = renderFn(that.options.orderInfo.orderItem, that.helpers);

            that.element.html(that.options.html);
          })
          .fail(function(error) {
            console.error(error);
          });
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
        var itemid = element.attr('data-itemid');

        // 进行销毁和重新初始化
        if (this.commenteditor) {
          $(".commentEditorArea").html("")
        }

        this.commenteditor = new SFCommenteditor();

        var handler = _.bind(this.submitCallback, this);
        this.commenteditor.show({
          "orderid": this.orderid,
          "itemid": itemid,
        }, "add", $(".commentEditorArea", element.parents("td")), handler);

        // 做动画效果
        $(".commentEditorArea").stop(true, false).animate({
          height: "0px",
          opacity: 0
        }, 500);

        $(".commentEditorArea", element.parents("td")).stop(true, false).animate({
          height: "555px",
          opacity: 1
        }, 500);

      }

    });
  })