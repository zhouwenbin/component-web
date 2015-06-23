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
    'sf.b2c.mall.business.config'
  ],
  function(can, $,  IntegralLog,  PaginationAdapter, Pagination, helpers,  SFGetUserRoutes, SFMessage, SFFindRecommendProducts, SFConfig) {

    can.route.ready();

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

       //获取当前的操作类型，如果为空则默认为查询所有
        if (routeParams.operateType) {
          _.each($(".integral-tab-c1 li"), function(element) {
               if(element.attr("tag") == routeParams.operateType){
                    $(element).addClass("active").siblings().removeClass("active");
               }
          }, this)
        } else {
            $(".integral-tab-c1 li").eq(0).addClass("active");
        }

        var params = {
          "query": JSON.stringify({
            "operateType": routeParams.operateType,
            "page": routeParams.page,
            "size": 10
          })
        }
        this.render(params);
      },

      render: function(params) {
        var that = this;
          //调用积分接口
        var getPointList = new IntegralLog(params);
          getPointList.sendRequest()
          .done(function(data) {
            if (data.result && data.result.length > 0) {
              that.options.result = data.result;
              _.each(that.options.result, function(point, i) {

              })

              var html = can.view('templates/order/sf.b2c.mall.center.point.mustache', that.options);
              that.element.html(html);

              //分页 保留 已经调通 误删 后面设计会给样式
              that.options.page = new PaginationAdapter();
              that.options.page.format(data.page);
              new Pagination('.sf-b2c-mall-center-point-pagination', that.options);
            } else {

            }
          })
          .fail(function(error) {
            console.error(error);
          })
      },

      '{can.route} change': function(el, attr, how, newVal, oldVal) {
        var routeParams = can.route.attr();
        var params = {
          "query": JSON.stringify({
            "operateType": routeParams.operateType,
            "page": routeParams.page,
            "size": 10
          })
        }
          this.render(params);
      },


        //点击不同的li，传入不同的参数
      '.integral-tab-c1 li click': function(element, event) {
        event && event.preventDefault();
        var that = this;
        // @todo 知道当前需要访问那个tag，并且根据tag，设置params，传给render
        var tag = $(element).attr('tag');

         //选中li的样式的改变
       $(element).addClass("active").siblings().removeClass("active");

        window.location.href = SFConfig.setting.link.pointlist + '#!' + $.param({
            operateType: tag,
            page: 1
        });
      },

      receiveDErrorMap: {

      }
    });
  })