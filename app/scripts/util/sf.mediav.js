'use strict'

define('sf.mediav', [], function() {

  var monitor = {

    watchOrderDetail: function (user, order) {
      var __src = $.cookie('_src');
      if(/^media_v/.test(__src)){
        var _mvq = window._mvq || [];
        window._mvq = _mvq;
        _mvq.push(['$setAccount', 'm-123868-0']);
        _mvq.push(['$setGeneral', 'orderdetail', '', /*用户名*/ user.name, /*用户id*/ user.id]);
        _mvq.push(['$logConversion']);
        _mvq.push(['$addOrderDetail', /*订单号*/ order.id, /*订单金额*/ order.amount, /*运费*/ order.fee, /*省*/ order.province, /*市*/ order.city]);
        _mvq.push(['$logData']);
      }
    },

    watchShoppingCart: function (user, products) {
      var __src = $.cookie('_src');
      if(/^media_v/.test(__src)){
        if (user && products) {
          var _mvq = window._mvq || [];
          window._mvq = _mvq;
          _mvq.push(['$setAccount', 'm-123868-0']);
          _mvq.push(['$setGeneral', 'cartview', '', /*用户名*/ user.name, /*用户id*/ user.id]);
          _mvq.push(['$logConversion']);

          for (var i = 0; i < products.length; i++) {
            _mvq.push(['$addItem', '', /*商品id*/ products[i].id, '','']);
          };
          _mvq.push(['$logData']);
        }
      }
    },

    watchRegistered: function (user) {
      var __src = $.cookie('_src');
      if(/^media_v/.test(__src)){
        if (user) {
          var _mvq = window._mvq || [];
          window._mvq = _mvq;
          _mvq.push(['$setAccount', 'm-123868-0']);

          _mvq.push(['$setGeneral', 'registered', '', /*用户名*/ user.name, /*用户id*/ '']);
          _mvq.push(['$logConversion']);
        }
      }
    },

    watchOrderSubmit: function (user, order, products) {
      var orderid = (new Date).valueOf();

      var __src = $.cookie('_src');
      if(/^media_v/.test(__src)){
        var _mvq = window._mvq || [];
        window._mvq = _mvq;
        _mvq.push(['$setAccount', 'm-123868-0']);

        _mvq.push(['$setGeneral', 'ordercreate', '', /*用户名*/ user.name, /*用户id*/ '']);
        _mvq.push(['$logConversion']);
        _mvq.push(['$addOrder', /*订单号*/ orderid, /*订单金额*/ order.amount]);

        for (var i = 0; i < products.length; i++) {
          var value  = products[i];
          _mvq.push(['$addItem', /*订单号*/ orderid, /*商品id*/ value.itemId, /*商品名称*/ value.goodsName, /*商品价格*/ value.price, /*商品数量*/ value.quantity, /*商品页url*/ value.detailUrl, /*商品页图片url*/ '']);
        };
        _mvq.push(['$logData']);
      }
    }
  };

  return monitor;
});