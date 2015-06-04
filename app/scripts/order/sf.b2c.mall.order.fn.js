define(
  'sf.b2c.mall.order.fn',

  [
    'jquery',
    'can',
    'underscore',
    'sf.b2c.mall.api.order.requestPayV2'
  ],

  function($, can, _, SFApiRequestPayV2) {

    var requestPayV2 = new SFApiRequestPayV2();

    return {
      payV2: function(data, callback) {
        requestPayV2.setData({
          "orderId": data.orderid,
          "payType": data.payType
        });

        requestPayV2
          .sendRequest()
          .done(function(data) {
            //note 兼容连连支付ie8浏览器
            if (/https:\/\/yintong.com.cn/.test(data.url) && navigator.userAgent.indexOf("MSIE 8.0")>0) {
              setTimeout(function() {
                var a = document.createElement("a");
                if (!a.click) {
                  window.location = data.url + '?' + data.postBody;
                  return;
                }

                a.setAttribute("href", data.url + '?' + data.postBody);
                a.style.display = "none";
                document.body.appendChild(a);
                a.click();
              }, 100);
            } else {
              window.location.href = data.url + '?' + data.postBody;
            }
            if (callback && _.isFunction(callback.success)) {
              callback.success();
            }
          })
          .fail(function(error) {
            var map = {
              4001504: '该订单状态发生了变更，已不能支付，请进入订单列表中进行查看'
            }

            //var errorText = that.payErrorMap[error.toString()] || '支付失败';
            if (callback && _.isFunction(callback.error)) {
              callback.error(map[error] || requestPayV2.api.ERROR_CODE[error]);
            }
          });
      }
    }

  })