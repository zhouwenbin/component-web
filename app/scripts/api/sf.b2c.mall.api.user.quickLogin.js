// Auto Generated.  DO NOT EDIT!
/**
  * @class sf.b2c.mall.api.user.quickLogin
  * @param  {Object} $
  * @param  {Object} can
  * @param  {Object} _
  * @param  {can.Construct} Comm
  * @param  {Object} SecurityType
  * @return {can.Construct}
  */
define(
'sf.b2c.mall.api.user.quickLogin',
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
      METHOD_NAME: 'user.quickLogin',
      SECURITY_TYPE: SecurityType.None.name,
      REQUIRED: {
        'cftoken': 'string'
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