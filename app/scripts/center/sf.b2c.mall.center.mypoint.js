'use strict';

define('sf.b2c.mall.center.mypoint', [
    'can',
    'jquery',
    'sf.b2c.mall.api.integral.getUserIntegralLog',
    'sf.b2c.mall.adapter.pagination',
    'sf.b2c.mall.widget.pagination',
    'sf.helpers',
    'sf.b2c.mall.api.sc.getUserRoutes',
    'sf.b2c.mall.widget.message',
    'sf.b2c.mall.api.product.findRecommendProducts',
    'sf.b2c.mall.business.config',
    'sf.b2c.mall.framework.comm'
  ],
  function(can, $,  IntegralLog,  PaginationAdapter, Pagination, helpers,  SFGetUserRoutes, SFMessage, SFFindRecommendProducts, SFConfig,SFFrameworkComm) {

    can.route.ready();
    SFFrameworkComm.register(1);
    return can.Control.extend({
      init: function(element, options) {
            var that = this;
            this.handler = null;

              //获取当前的页码，如果为空在默认为1
            var routeParams = can.route.attr();
            if (!routeParams.page) {
              routeParams = _.extend(routeParams, {
                page: 1
              });
            }

          var dateList = this.getQueryDate();
            var operateTypeV = "";

            var params = {
              "operateType": routeParams.operateType,
                "startDate":dateList.startDateFormat,
                "endDate":dateList.endDateFormat,
                "page": routeParams.page,
                "size": 4
            }
            this.render(params);
      },

      render: function(params) {
        var that = this;
          //调用积分接口
        var getPointList = new IntegralLog(params);
          getPointList.sendRequest()
          .done(function(data) {
                  that.options.integralTotalAmount = data.userTotalIntegral.integralTotalAmount;
                  that.options.expirationDate = data.userTotalIntegral.expireDate;
                  that.options.expireIntegralAmount = data.userTotalIntegral.expireIntegralAmount;
                   if (data.result && data.result.length > 0) {
                          that.options.result = data.result;

                          _.each(that.options.result, function(point) {
                                    if(point.integralAmount > 0){
                                        point.flag = "text-success";
                                        point.integralAmount = "+" + point.integralAmount;
                                    }
                                   else{
                                        point.flag = "text-important";
                                    }
                              point.createDate =  that.getDateAndTime(point.createDate);
                          })
                    } else {

                    }
                  var html = can.view('templates/center/sf.b2c.mall.center.point.mustache', that.options);
                  that.element.html(html);
                  //获取当前的操作类型，设置当前的li标签
                  var routeParams = can.route.attr();
                  if (routeParams.operateType) {
                      _.each($(".integral-tab-c1 li"), function(element) {
                          if($(element).attr("tag") == routeParams.operateType){
                              $(element).addClass("active").siblings().removeClass("active");
                          }
                      }, this)
                  } else {
                      $(".integral-tab-c1 li").eq(0).addClass("active");
                  }

                  //分页 保留 已经调通 误删 后面设计会给样式
                  that.options.page = new PaginationAdapter();
                  that.options.page.format({
                      "pageNum":data.currentPage,
                      "currentNum":data.currentPage,
                      "totalNum":data.totalCount,
                      "pageSize":data.pageSize
                  });
                  new Pagination('.sf-b2c-mall-order-orderlist-pagination', that.options);
          })
          .fail(function(error) {
            console.error(error);
          });
      },

        //根据毫秒值计算日期
        getDateAndTime: function(timeValue){
            var DateValue = new Date(timeValue);
            var monV = DateValue.getMonth() + 1;
            var dayV = DateValue.getDate();
            var hourV = DateValue.getHours();
            var minV = DateValue.getMinutes();
            var secV = DateValue.getSeconds();
            var datePart = DateValue.getFullYear() + "-" + (monV < 10?("0" + monV):monV) + "-" + (dayV < 10?("0" + dayV):dayV);
            var timePart = (hourV < 10?("0" + hourV):hourV) + ":" + (minV < 10?("0" + minV):minV)+ ":" + (secV < 10?("0" + secV):secV);
            return   datePart + " " + timePart;
        },

        //根据当前日期查询出最近三个月的起始和终止时间，以及之前的时间
      getQueryDate:function(){
          var routeParams = can.route.attr();
          var current = new Date();
          var yearV = current.getFullYear();
          var monV =  current.getMonth() + 1;
          var dayV = current.getDate();
          var endDateFormat = yearV + "-" + (monV < 10 ? '0' + monV:  monV )+ "-" +(dayV < 10 ? '0'+dayV:dayV);
          var startDateFormat = yearV + "-" + ((monV -2)  < 10 ? '0' + (monV -2) : (monV -2))+ "-01" ;
          var endDate = new Date(yearV, monV - 3, 1, 0, 0, 0);
          var newDate = new Date(new Date(yearV, monV - 3, 1, 0, 0, 0).getTime() - 100);
          var endDateForT = newDate.getFullYear() + "-" + (newDate.getMonth() + 1) + "-" + newDate.getDate();
          var startDateForT = "2015-07-01";
          return {
              "startDateFormat":startDateFormat,
              "endDateFormat":endDateFormat,
              "startDateForT":startDateForT,
              "endDateForT":endDateForT
          };
      },

      '{can.route} change': function(el, attr, how, newVal, oldVal) {
          var routeParams = can.route.attr();
          var dateList = this.getQueryDate();
          var params = {
              "operateType": routeParams.operateType,
              "startDate":dateList.startDateFormat,
              "endDate":dateList.endDateFormat,
              "page": routeParams.page,
              "size": 4
          };
          this.render(params);
      },


        //点击不同的li，传入不同的参数
      '.integral-tab-c1 li click': function(element, event) {
        event && event.preventDefault();
        var that = this;
        // @todo 知道当前需要访问那个tag，并且根据tag，设置params，传给render
        var tag = $(element).attr('tag');
        if(tag == "all"){
            tag = "";
        }
         //选中li的样式的改变
       $(element).addClass("active").siblings().removeClass("active");

        //window.location.href = SFConfig.setting.link.pointlist + '#!' + $.param({
          window.location.href = " http://www.sfht.com/point-manage.html" + '#!' + "operateType=" + tag + "&page=" + 1;

      }
    });
  })