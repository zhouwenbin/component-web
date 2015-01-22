// Auto Generated.  DO NOT EDIT!
/**
  * @class sf.b2c.mall.api.user.changePassword
  * @param  {Object} $
  * @param  {Object} can
  * @param  {Object} _
  * @param  {can.Construct} Comm
  * @param  {Object} SecurityType
  * @return {can.Construct}
  */
define(
'sf.b2c.mall.api.user.changePassword',
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
      METHOD_NAME: 'user.changePassword',
      SECURITY_TYPE: SecurityType.UserLogin.name,
      REQUIRED: {
        'oldPassword': 'string',
        'newPassword': 'string'
      },
      OPTIONAL: {
      },
      VERIFY:{
      },
      ERROR_CODE: {
        '1000010': '未找到用户',
        '1000040': '原密码错误',
        '1000060': '密码与原密码相同'
      }
    }
  });
});