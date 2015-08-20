'use strict';

define('sf.b2c.mall.center.message', ['can',
  'sf.b2c.mall.api.commentGoods.findCommentInfoListByType',
  'sf.b2c.mall.api.product.findSaleBaseInfoList',
  'sf.b2c.mall.fixture.case.center.comment',
  'sf.b2c.mall.adapter.pagination',
  'sf.b2c.mall.widget.pagination',
  'text!template_center_message'
], function(can, SFfindCommentInfoListByType, SFfindSaleBaseInfoList, Fixturecomment, PaginationAdapter, Pagination, template_center_message) {
  can.route.ready();
  return can.Control.extend({

    /**
     * 初始化控件
     * @param  {DOM} element 容器element
     * @param  {Object} options 传递的参数
     */
    helpers: {
      hasComments: function(comments, options) {
        if (comments().length > 0) {
          return options.fn(options.contexts || this);
        } else {
          return options.inverse(options.contexts || this);
        }
      }
    },

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

       var findCommentInfoListByType = new SFfindCommentInfoListByType({
         "type": 0,
         "pageNum": 3,
         "pageSize": page
       });


       can.when(findCommentInfoListByType.sendRequest())
         .done(function(commentData) {

           if (commentData.commentGoods && commentData.commentGoods.length > 0) {
             that.options.commentGoods = commentData.commentGoods;

             _.each(that.options.commentGoods, function(date) {
               date.commentGoodsInfo.gmtReply =  that.getDate(date.commentGoodsInfo.gmtReply);
             })

           } else {
             that.options.commentGoods = null;
           }
           that.options = new can.Map(that.options);

           that.options.attr("comments", commentData);

           var renderFn = can.mustache(template_center_message);
           that.options.html = renderFn(that.options, that.helpers);
           that.element.html(that.options.html);

           that.options.page = new PaginationAdapter();
           that.options.page.format({
             "pageNum":commentData.page.pageSize,
             "currentNum":commentData.page.currentNum,
             "totalNum":commentData.page.totalNum,
             "pageSize":commentData.page.pageNum
           });
           new Pagination('.sf-b2c-mall-message-pagination', that.options);
         })
         .fail(function(error) {
           console.error(error);
         });
    },

    '{can.route} change': function(el, attr, how, newVal, oldVal) {
      if (el.page == this.currentRouteData) {
        return true;
      } else {
        var routeParams = can.route.attr();
        this.render(routeParams.page);
        this.currentRouteData = el.page;
      }
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
