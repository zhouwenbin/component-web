// Auto Generated.  DO NOT EDIT!
/**
  * @class sf.b2c.mall.api.user.renewToken
  * @param  {Object} $
  * @param  {Object} can
  * @param  {Object} _
  * @param  {can.Construct} Comm
  * @param  {Object} SecurityType
  * @return {can.Construct}
  */
define(
'sf.b2c.mall.api.user.renewToken',
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
      METHOD_NAME: 'user.renewToken',
      SECURITY_TYPE: SecurityType.RegisteredDevice.name,
      REQUIRED: {
        'token': 'string'
      },
      OPTIONAL: {
      },
      VERIFY:{
      },
      ERROR_CODE: {
        '1000070': '参数错误'
      }
    }
  });
});