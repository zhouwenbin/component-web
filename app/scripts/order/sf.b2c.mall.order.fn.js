define(
  'sf.b2c.mall.order.fn',

  [
    'jquery',
    'can',
    'underscore',
    'sf.b2c.mall.api.order.requestPayV2'
  ],

  function ($, can, _, SFApiRequestPayV2) {

    var requestPayV2 = new SFApiRequestPayV2();

    return {
      payV2: function (data, callback) {
        requestPayV2.setData({
          "orderId": data.orderid,
          'payType': 'alipay'
        });

        requestPayV2
          .sendRequest()
          .done(function(data) {
            window.location.href = data.url + '?' + data.postBody;
            if (callback && _.isFunction(callback.success)) {
              callback.success();
            }
          })
          .fail(function(error) {
            //var errorText = that.payErrorMap[error.toString()] || '支付失败';
            if (callback && _.isFunction(callback.error)) {
              callback.error();
            }
          });
      }
    }

  })