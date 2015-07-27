define(
  'sf.b2c.mall.order.fn',

  [
    'jquery',
    'can',
    'underscore',
    'sf.b2c.mall.api.order.requestPayV2',
    'sf.b2c.mall.api.order.cancelOrder',
    'sf.b2c.mall.api.order.confirmReceive',
    'sf.b2c.mall.api.order.deleteOrder'
  ],

  function($, can, _, SFApiRequestPayV2, SFApiCancelOrder, SFConfirmReceive, SFDeleteOrder) {

    var requestPayV2 = new SFApiRequestPayV2();
    var cancelOrder = new SFApiCancelOrder();
    var confirmReceive = new SFConfirmReceive();
    var deleteOrder = new SFDeleteOrder();

    return {

      helpers: {
        'sf-status-show-case': function(status, target, options) {
          var map = {
            'SUBMITED': ['NEEDPAY', 'CANCEL', 'INFO', 'REBUY'],
            'AUTO_CANCEL': ['INFO', 'REBUY'],
            'USER_CANCEL': ['INFO', 'REBUY'],
            'AUDITING': ['CANCEL', 'INFO', 'REBUY'],
            'OPERATION_CANCEL': ['INFO', 'REBUY'],
            'BUYING': ['INFO', 'REBUY'],
            'BUYING_EXCEPTION': ['INFO', 'REBUY'],
            'WAIT_SHIPPING': ['INFO', 'REBUY'],
            'SHIPPING': ['ROUTE', 'INFO', 'REBUY'],
            'LOGISTICS_EXCEPTION': ['ROUTE', 'INFO', 'REBUY'],
            'SHIPPED': ['INFO', 'ROUTE', 'RECEIVED', 'REBUY'],
            'CONSIGNED': ['INFO', 'ROUTE', 'RECEIVED', 'REBUY'],
            'COMPLETED': ['INFO', 'ROUTE', 'REBUY'],
            'RECEIPTED': ['INFO', 'ROUTE', 'RECEIVED', 'REBUY'],
            'CLOSED': ['INFO', 'REBUY'],
            'AUTO_COMPLETED': ['INFO', 'ROUTE', 'REBUY']
          }

          var array = map[status];
          if (array && _.contains(array, target)) {
            return options.fn(options.contexts || this);
          } else {
            return options.inverse(options.contexts || this);
          }
        }
      },
      payV2: function(data, callback) {
        requestPayV2.setData({
          "orderId": data.orderid,
          "payType": data.payType
        });

        requestPayV2
          .sendRequest()
          .done(function(data) {
            //note 兼容连连支付ie8浏览器
            if (/https:\/\/yintong.com.cn/.test(data.url) && navigator.userAgent.indexOf("MSIE 8.0") > 0) {
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
      },
      //确认收货
      orderConfirm: function(params, success, error) {
        confirmReceive.setData({
          subOrderId: params
        });

        confirmReceive.sendRequest().done(success).fail(error);
      },
      //删除订单
      orderDelete: function(params, success, error) {
        deleteOrder.setData({
          orderId: params
        });

        deleteOrder.sendRequest().done(success).fail(error);
      },
      //取消订单
      orderCancel: function(params, success, error) {
        cancelOrder.setData({
          orderId: params
        });

        cancelOrder.sendRequest().done(success).fail(error);
      }



    }

  })