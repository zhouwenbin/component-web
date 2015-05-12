// Auto Generated.  DO NOT EDIT!
/**
  * @class sf.b2c.mall.api.user.downInviteSms
  * @param  {Object} $
  * @param  {Object} can
  * @param  {Object} _
  * @param  {can.Construct} Comm
  * @param  {Object} SecurityType
  * @return {can.Construct}
  */
define(
'sf.b2c.mall.api.user.downInviteSms',
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
      METHOD_NAME: 'user.downInviteSms',
      SECURITY_TYPE: SecurityType.UserLogin.name,
      REQUIRED: {
        'invtMobile': 'string',
        'vfcode': 'string'
      },
      OPTIONAL: {
      },
      VERIFY:{
      },
      ERROR_CODE: {
        '1000020': '账户已注册',
        '1000100': '验证码错误',
        '1000230': '手机号错误，请输入正确的手机号'
      }
    }
  });
});