/**
 * Created by 张可 on 2015/3/5.
 */
define(
  'sf.b2c.mall.center.coupon',
  [
    'can',
    'jquery',
    'sf.b2c.mall.framework.comm',
    'sf.util',
    'sf.b2c.mall.api.coupon.getUserCouponList'
  ],
  function(can,$,SFComm, SFFn, SFGetUserCouponList){
    SFComm.register(1);

    return can.Control.extend({
      init: function () {
        this.render();
      },
      render: function (data) {
        var that = this;
        that.options.notUsedCount = 0;
        that.options.usedCount = 0;
        that.options.expiredCount = 0;
        that.options.invalidCount = 0;
        that.options.notUsedList = [
          {price: 5, title: "新年满减优惠券", desc: "满10元立减", startDate: "2015-3-3", endDate: "2015-3-18", useNotice: "特惠商品不可用"},
          {price: 5, title: "新年满减优惠券", desc: "满10元立减", startDate: "2015-3-3", endDate: "2015-3-18", useNotice: "特惠商品不可用"},
          {price: 5, title: "新年满减优惠券", desc: "满10元立减", startDate: "2015-3-3", endDate: "2015-3-18", useNotice: "特惠商品不可用"}];
        that.options.usedList = [
          {price: 5, title: "新年满减优惠券", desc: "满10元立减", startDate: "2015-3-3", endDate: "2015-3-18", useNotice: "特惠商品不可用"},
          {price: 5, title: "新年满减优惠券", desc: "满10元立减", startDate: "2015-3-3", endDate: "2015-3-18", useNotice: "特惠商品不可用"}
        ];
        that.options.expiredList = [
          {price: 5, title: "新年满减优惠券", desc: "满10元立减", startDate: "2015-3-3", endDate: "2015-3-18", useNotice: "特惠商品不可用"},
          {price: 5, title: "新年满减优惠券", desc: "满10元立减", startDate: "2015-3-3", endDate: "2015-3-18", useNotice: "特惠商品不可用"}];
        that.options.invalidList = [{price: 5, title: "新年满减优惠券", desc: "满10元立减", startDate: "2015-3-3", endDate: "2015-3-18", useNotice: "特惠商品不可用"}];
        

        var html = can.view('templates/center/sf.b2c.mall.center.coupon.mustache', that.options);
        this.element.html(html);


        var params = {
          "query": JSON.stringify({
          })
        }
        var getUserCouponList = new SFGetUserCouponList(params);
        getUserCouponList
          .sendRequest()
          .done(function(data) {
            var html = can.view('templates/center/sf.b2c.mall.center.coupon.mustache', that.options);
            this.element.html(html);
          })
          .fail(function(error) {
            console.error(error);
          });
      },

      ".mycoupon-h li click": function(targetElement){
        var index = $('.mycoupon-h li').index(targetElement);
        $('.mycoupon-h li.active').removeClass('active');
        $('.mycoupon-b.active').removeClass('active');
        $(targetElement).addClass('active');
        $('.mycoupon-b').eq(index).addClass('active');
        return false;
      }
    })
  }
)
