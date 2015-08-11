// Auto Generated.  DO NOT EDIT!
/**
  * @class sf.b2c.mall.api.order.orderPriceReCalculate
  * @param  {Object} $
  * @param  {Object} can
  * @param  {Object} _
  * @param  {can.Construct} Comm
  * @param  {Object} SecurityType
  * @return {can.Construct}
  */
define(
'sf.b2c.mall.api.order.orderPriceReCalculate',
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
      METHOD_NAME: 'order.orderPriceReCalculate',
      SECURITY_TYPE: SecurityType.UserLogin.name,
      REQUIRED: {
      },
      OPTIONAL: {
        'request': 'json'
      },
      VERIFY:{
      },
      ERROR_CODE: {
        '4000100': 'order unkown error',
        '4001651': '缓存失效，请重新刷新页面'
      }
    }
  });
});