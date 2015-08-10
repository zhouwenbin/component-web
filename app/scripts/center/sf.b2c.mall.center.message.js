'use strict';

define('sf.b2c.mall.center.message', ['can',
  'sf.b2c.mall.api.commentGoods.findCommentInfoListByType',
  'sf.b2c.mall.fixture.case.center.comment',
  'sf.b2c.mall.adapter.pagination',
  'sf.b2c.mall.widget.pagination'
], function(can, SFfindCommentInfoListByType, Fixturecomment, PaginationAdapter, Pagination) {
  return can.Control.extend({

    /**
     * 初始化控件
     * @param  {DOM} element 容器element
     * @param  {Object} options 传递的参数
     */
    init: function(element, options) {
      this.render();
    },

    render: function() {
      var that = this;

      // var findCommentInfoListByType = new SFfindCommentInfoListByType({
      //   "type": 0,
      //   "pageNum": 1,
      //   "pageSize": 10,
      //   "fixture": true
      // });


      // can.when(findCommentInfoListByType.sendRequest())
      //   .done(function(commentData) {

      //     that.options.comments = commentData;

      //     that.options = new can.Map(that.options);

      //     var renderFn = can.mustache(template_center_message);
      //     that.options.html = renderFn(that.options, that.helpers);
      //     that.element.html(that.options.html);
      //   })
      //   .fail(function(error) {
      //     console.error(error);
      //   });
      that.options.comments = {
        "commentGoods":[{
          "commentGoodsInfo": {
            "commentId":1,
            "pId":1,
            "orderId":1,
            "skuId":1,
            "itemId":1,
            "score":500,
            "content":"小章鱼祝您购物愉快哦~~本月27号顺丰海淘有大促活动哦~希望您能继续支持，见证顺丰海淘的成长！",
            "extralContent":"追评",
            "imgs": "http://img0.sfht.com/sf/bundefined/5415d8c2b1dc83eecb37a75a92bb778a.jpg@63h_63w.jpg",
            "isAnonym":true,
            "terminalType":"pc",
            "commentStatus":0,
            "commentStatus2":0,
            "skuLabels":[{
              "id":1,
              "name":"好用",
              "count":10
            }],
            "commentGoodsLabels":[{
              "id":1,
              "name":"好用",
              "count":10
            }],
            "userId":1,
            "userHeadImageUrl":"http://img0.sfht.com/sf/bundefined/5415d8c2b1dc83eecb37a75a92bb778a.jpg@63h_63w.jpg",
            "userNick":"昵称",
            "itemPro":"",
            "gmtCreate":"2015-07-26",
            "gmtExtral":"2015-07-26"
          },
          "children":{
            "commentGoodsInfo": {
              "commentId":1,
              "pId":1,
              "orderId":1,
              "skuId":1,
              "itemId":1,
              "score":500,
              "content":"很赞，用得很开心~已经推荐给朋友，大家都说想买呢。很赞，用得很开心~已经推荐给朋友，大家都说想买呢。很赞，用得很开心~已经推荐给朋友，大家都说想买呢。",
              "extralContent":"追评",
              "imgs": ["http://img0.sfht.com/sf/bundefined/5415d8c2b1dc83eecb37a75a92bb778a.jpg@63h_63w.jpg"],
              "isAnonym":true,
              "terminalType":"pc",
              "commentStatus":0,
              "commentStatus2":0,
              "skuLabels":[{
                "id":1,
                "name":"好用",
                "count":10
              }],
              "commentGoodsLabels":[{
                "id":1,
                "name":"好用",
                "count":10
              }],
              "userId":1,
              "userHeadImageUrl":"http://img0.sfht.com/sf/bundefined/5415d8c2b1dc83eecb37a75a92bb778a.jpg@63h_63w.jpg",
              "userNick":"昵称",
              "itemPro":"",
              "gmtCreate":"2015-07-26",
              "gmtExtral":"2015-07-26"
            }
          }

        },{
          "commentGoodsInfo": {
            "commentId":1,
            "pId":1,
            "orderId":1,
            "skuId":1,
            "itemId":1,
            "score":500,
            "content":"本月27号顺丰海淘有大促活动哦~希望您能继续支持，见证顺丰海淘的成长！",
            "extralContent":"追评",
            "imgs": "http://img0.sfht.com/sf/bundefined/5415d8c2b1dc83eecb37a75a92bb778a.jpg@63h_63w.jpg",
            "isAnonym":true,
            "terminalType":"pc",
            "commentStatus":0,
            "commentStatus2":0,
            "skuLabels":[{
              "id":1,
              "name":"好用",
              "count":10
            }],
            "commentGoodsLabels":[{
              "id":1,
              "name":"好用",
              "count":10
            }],
            "userId":1,
            "userHeadImageUrl":"http://img0.sfht.com/sf/bundefined/5415d8c2b1dc83eecb37a75a92bb778a.jpg@63h_63w.jpg",
            "userNick":"昵称",
            "itemPro":"",
            "gmtCreate":"2015-07-26",
            "gmtExtral":"2015-07-26"
          },
          "children":{
            "commentGoodsInfo": {
              "commentId":1,
              "pId":1,
              "orderId":1,
              "skuId":1,
              "itemId":1,
              "score":500,
              "content":"补水效果不错，很赞~",
              "extralContent":"追评",
              "imgs": ["http://img0.sfht.com/sf/bundefined/5415d8c2b1dc83eecb37a75a92bb778a.jpg@63h_63w.jpg"],
              "isAnonym":true,
              "terminalType":"pc",
              "commentStatus":0,
              "commentStatus2":0,
              "skuLabels":[{
                "id":1,
                "name":"好用",
                "count":10
              }],
              "commentGoodsLabels":[{
                "id":1,
                "name":"好用",
                "count":10
              }],
              "userId":1,
              "userHeadImageUrl":"http://img0.sfht.com/sf/bundefined/5415d8c2b1dc83eecb37a75a92bb778a.jpg@63h_63w.jpg",
              "userNick":"昵称",
              "itemPro":"",
              "gmtCreate":"2015-07-26",
              "gmtExtral":"2015-07-26"
            }
          }

        }],
        "page": {
          "pageNum": 1,
          "currentNum": 0,
          "totalNum": 100,
          "pageSize": 10
        }
      };
      that.options.page = new PaginationAdapter();

      that.options.page.format({
          "pageNum":that.options.comments.page.pageNum,
          "currentNum":that.options.comments.page.currentNum,
          "totalNum":that.options.comments.page.totalNum,
          "pageSize":that.options.comments.page.pageSize
      });

      new Pagination('.sf-b2c-mall-message-pagination', that.options);
      // that.options = new can.Map(that.options);
      var html = can.view('templates/center/sf.b2c.mall.center.message.mustache', that.options);
      that.element.html(html);

      // var renderFn = can.mustache(template_center_message);
      // that.options.html = renderFn(that.options);
      // that.element.html(that.options.html);
    }
  })
})