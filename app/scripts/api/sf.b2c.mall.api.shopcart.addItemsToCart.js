// Auto Generated.  DO NOT EDIT!
/**
  * @class sf.b2c.mall.api.shopcart.addItemsToCart
  * @param  {Object} $
  * @param  {Object} can
  * @param  {Object} _
  * @param  {can.Construct} Comm
  * @param  {Object} SecurityType
  * @return {can.Construct}
  */
define(
'sf.b2c.mall.api.shopcart.addItemsToCart',
[
  'jquery',
  'can',
  'underscore',
  'sf.b2c.mall.framework.comm',
  'sf.b2c.mall.api.security.type'
],
function($, can, _, Comm, SecurityType) {
  'use strict';

  return Comm.extend({
    api: {
      METHOD_NAME: 'shopcart.addItemsToCart',
      SECURITY_TYPE: SecurityType.UserLogin.name,
      REQUIRED: {
        'items': 'json'
      },
      OPTIONAL: {
      },
      VERIFY:{
      },
      ERROR_CODE: {
        '15000100': '请求参数有误',
        '15000201': '该商品不支持加入购物车',
<<<<<<< HEAD
        '15000202': '添加进购物车的商品列表为空',
        '15000203': '添加进购物车的商品超过限购',
=======
>>>>>>> test.search
        '15000800': '您的购物车已满'
      }
    }
  });
});