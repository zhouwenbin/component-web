/**
 * Created by 张可 on 2015/3/5.
 */
define(
  'sf.b2c.mall.center.coupon',
  [
    'can',
    'jquery',
    'sf.b2c.mall.framework.comm',
    'sf.util'
  ],
  function(can,$,SFComm, SFFn){
    SFComm.register(1);

    return can.Control.extend({
      init: function () {
        this.render();
      },
      render: function (data) {

        var html = can.view('templates/center/sf.b2c.mall.center.coupon.mustache', {});
        this.element.html(html);
        var params = {
          "query": JSON.stringify({
            "status": null
          })
        }

        var getOrderList = new SFGetOrderList(params);
        getOrderList
          .sendRequest()

          .done(function(data) {

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
