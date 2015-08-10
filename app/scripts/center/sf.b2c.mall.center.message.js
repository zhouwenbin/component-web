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

       var findCommentInfoListByType = new SFfindCommentInfoListByType({
         "type": 0,
         "pageNum": 10,
         "pageSize": 1
       });


       can.when(findCommentInfoListByType.sendRequest())
         .done(function(commentData) {
           that.options.comments = commentData;

           if (commentData.commentGoods && commentData.commentGoods.length > 0) {
             that.options.commentGoods = commentData.commentGoods;

             _.each(that.options.commentGoods, function(date) {
               date.commentGoodsInfo.gmtReply =  that.getDate(date.commentGoodsInfo.gmtReply);
             })
           } else {
             that.options.commentGoods = null;
           }
           that.options = new can.Map(that.options);

           var html = can.view('templates/center/sf.b2c.mall.center.message.mustache', that.options);
           that.element.html(html);
           that.options.page = new PaginationAdapter();
           that.options.page.format({
             "pageNum":commentData.page.pageNum,
             "currentNum":commentData.page.currentNum,
             "totalNum":commentData.page.totalNum,
             "pageSize":commentData.page.pageSize
           });
           new Pagination('.sf-b2c-mall-message-pagination', that.options);
         })
         .fail(function(error) {
           console.error(error);
         });
    },

    getDate: function(timeValue){
      var DateValue = new Date(timeValue);
      var monV = DateValue.getMonth() + 1;
      var dayV = DateValue.getDate();
      var datePart = DateValue.getFullYear() + "-" + (monV < 10?("0" + monV):monV) + "-" + (dayV < 10?("0" + dayV):dayV);
      return datePart;
    }
  })
})