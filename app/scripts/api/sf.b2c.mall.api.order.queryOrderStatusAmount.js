// Auto Generated.  DO NOT EDIT!
/**
  * @class sf.b2c.mall.api.order.queryOrderStatusAmount
  * @param  {Object} $
  * @param  {Object} can
  * @param  {Object} _
  * @param  {can.Construct} Comm
  * @param  {Object} SecurityType
  * @return {can.Construct}
  */
define(
'sf.b2c.mall.api.order.queryOrderStatusAmount',
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
      METHOD_NAME: 'order.queryOrderStatusAmount',
      SECURITY_TYPE: SecurityType.UserLogin.name,
      REQUIRED: {
      },
      OPTIONAL: {
      },
      VERIFY:{
      },
      ERROR_CODE: {
        '4000100': 'order unkown error',
        '4100600': '请求参数有误'
      }
    }
  });
});