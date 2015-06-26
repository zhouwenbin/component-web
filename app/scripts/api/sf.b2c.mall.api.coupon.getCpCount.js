// Auto Generated.  DO NOT EDIT!
/**
  * @class sf.b2c.mall.api.coupon.getCpCount
  * @param  {Object} $
  * @param  {Object} can
  * @param  {Object} _
  * @param  {can.Construct} Comm
  * @param  {Object} SecurityType
  * @return {can.Construct}
  */
define(
'sf.b2c.mall.api.coupon.getCpCount',
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
      METHOD_NAME: 'coupon.getCpCount',
      SECURITY_TYPE: SecurityType.UserLogin.name,
      REQUIRED: {
        'channel': 'string',
      },
      OPTIONAL: {
        'isValid': 'int'
      },
      VERIFY:{
      },
      ERROR_CODE: {
        '11000060': '参数错误'
      }
    }
  });
});