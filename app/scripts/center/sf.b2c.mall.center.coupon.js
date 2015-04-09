/**
 * Created by 张可 on 2015/3/5.
 */
define(
  'sf.b2c.mall.center.coupon',
  [
    'JSON',
    'can',
    'jquery',
    'sf.helpers',
    'sf.b2c.mall.api.coupon.getUserCouponList'
  ],
  function(JSON, can, $, helpers, SFGetUserCouponList){


    var optionsMap;
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
            var options = {
              unUsed : {
                isShow: true,
                count: 0,
                items: []
              },
              used : {
                isShow: false,
                count: 0,
                items: []
              },
              expired : {
                isShow: false,
                count: 0,
                items: []
              },
              cancel : {
                isShow: false,
                count: 0,
                items: []
              }
            };

            var couponStatusMap = {
              "UNUSED" : function() {
                options.unUsed.count++;
                options.unUsed.items.push(tmpCoupon);
              },
              "USED" : function() {
                options.used.count++;
                options.used.items.push(tmpCoupon);
              },
              "CANCELED" : function() {
                options.cancel.count++;
                options.cancel.items.push(tmpCoupon);
              },
              "EXPIRED" : function() {
                options.expired.count++;
                options.expired.items.push(tmpCoupon);
              }
            }
            var pushCoupon = function(tag) {
              var fn = couponStatusMap[tag];
              if (_.isFunction(fn)) {
                return fn.call(this)
              }
            }
            if (data.items) {
              for (var i = 0, tmpCoupon; tmpCoupon = data.items[i]; i++) {
                pushCoupon(tmpCoupon.status);
              }
            }

            optionsMap = new can.Map(options);
            var html = can.view('templates/center/sf.b2c.mall.center.coupon.mustache', optionsMap);
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
