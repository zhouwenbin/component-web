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
    'sf.helpers',
    'sf.b2c.mall.api.coupon.getUserCouponList'
  ],
  function(can,$,SFComm, SFFn, helpers, SFGetUserCouponList){
    SFComm.register(1);

    return can.Control.extend({
      init: function () {
        this.render();
      },
      render: function (data) {
        var that = this;

        var params = {
          "query": JSON.stringify({
          })
        }
        var getUserCouponList = new SFGetUserCouponList(params);
        getUserCouponList
          .sendRequest()
          .done(function(data) {
            that.options.unUsedCount = 0;
            that.options.usedCount = 0;
            that.options.expiredCount = 0;
            that.options.cancelCount = 0;
            that.options.unUsedList = [];
            that.options.usedList = [];
            that.options.expiredList = [];
            that.options.cancelList = [];

            for (var i = 0, tmpCoupon; tmpCoupon = data.items[i]; i++) {
              switch (tmpCoupon.status) {
                case "UNUSED": {
                  that.options.unUsedCount++;
                  that.options.unUsedList.push(tmpCoupon);
                  break;
                }
                case "USED": {
                  that.options.usedCount++;
                  that.options.usedList.push(tmpCoupon);
                  break;
                }
                case "CANCELED": {
                  that.options.cancelCount++;
                  that.options.cancelList.push(tmpCoupon);
                  break;
                }
                case "EXPIRED": {
                  that.options.expiredCount++;
                  that.options.expiredList.push(tmpCoupon);
                  break;
                }
              }
            }
            var html = can.view('templates/center/sf.b2c.mall.center.coupon.mustache', that.options);
            that.element.html(html);
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
