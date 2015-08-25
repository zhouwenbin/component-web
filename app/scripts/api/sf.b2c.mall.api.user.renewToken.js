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
        '1000010': '未找到用户',
        '1000480': '用户账户被冻结，不允许登录'
      }
    }
  });
});