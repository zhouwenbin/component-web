// Auto Generated.  DO NOT EDIT!
/**
  * @class sf.b2c.mall.api.shopcart.removeItemsForCart
  * @param  {Object} $
  * @param  {Object} can
  * @param  {Object} _
  * @param  {can.Construct} Comm
  * @param  {Object} SecurityType
  * @return {can.Construct}
  */
define(
'sf.b2c.mall.api.shopcart.removeItemsForCart',
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
      METHOD_NAME: 'shopcart.removeItemsForCart',
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
        '15000300': '购物车删除商品失败'
      }
    }
  });
});