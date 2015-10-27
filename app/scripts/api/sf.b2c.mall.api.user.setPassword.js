// Auto Generated.  DO NOT EDIT!
/**
  * @class sf.b2c.mall.api.user.setPassword
  * @param  {Object} $
  * @param  {Object} can
  * @param  {Object} _
  * @param  {can.Construct} Comm
  * @param  {Object} SecurityType
  * @return {can.Construct}
  */
define(
'sf.b2c.mall.api.user.setPassword',
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
      METHOD_NAME: 'user.setPassword',
      SECURITY_TYPE: SecurityType.UserLogin.name,
      REQUIRED: {
        'pswd': 'string'
      },
      OPTIONAL: {
      },
      VERIFY:{
      },
      ERROR_CODE: {
        '1000500': '用户手机号尚未验证，不允许设置密码'
      }
    }
  });
});