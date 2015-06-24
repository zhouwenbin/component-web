// Auto Generated.  DO NOT EDIT!
/**
  * @class sf.b2c.mall.api.shopcart.updateItemNumForCart
  * @param  {Object} $
  * @param  {Object} can
  * @param  {Object} _
  * @param  {can.Construct} Comm
  * @param  {Object} SecurityType
  * @return {can.Construct}
  */
define(
'sf.b2c.mall.api.shopcart.updateItemNumForCart',
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
      METHOD_NAME: 'shopcart.updateItemNumForCart',
      SECURITY_TYPE: SecurityType.UserLogin.name,
      REQUIRED: {
        'itemId': 'string',
        'num': 'int',
        'refItemId': 'int'
      },
      OPTIONAL: {
      },
      VERIFY:{
      },
      ERROR_CODE: {
        '15000100': '请求参数有误',
        '15000900': '商品不在购物车内'
      }
    }
  });
});