// Auto Generated.  DO NOT EDIT!
/**
  * @class sf.b2c.mall.api.integral.getUserIntegralLog
  * @param  {Object} $
  * @param  {Object} can
  * @param  {Object} _
  * @param  {can.Construct} Comm
  * @param  {Object} SecurityType
  * @return {can.Construct}
  */
define(
'sf.b2c.mall.api.integral.getUserIntegralLog',
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
      METHOD_NAME: 'integral.getUserIntegralLog',
      SECURITY_TYPE: SecurityType.UserLogin.name,
      REQUIRED: {
        'page': 'int',
        'size': 'int',
      },
      OPTIONAL: {
        'operateType': 'string',
        'startDate': 'string',
        'endDate': 'string',
        'appId': 'string',
        'channel': 'string'
      },
      VERIFY:{
      },
      ERROR_CODE: {
      }
    }
  });
});