// Auto Generated.  DO NOT EDIT!
/**
  * @class sf.b2c.mall.api.user.mobileRegister
  * @param  {Object} $
  * @param  {Object} can
  * @param  {Object} _
  * @param  {can.Construct} Comm
  * @param  {Object} SecurityType
  * @return {can.Construct}
  */
define(
'sf.b2c.mall.api.user.mobileRegister',
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
      METHOD_NAME: 'user.mobileRegister',
      SECURITY_TYPE: SecurityType.None.name,
      REQUIRED: {
        'mobile': 'string',
        'smsCode': 'string',
        'password': 'string',
      },
      OPTIONAL: {
        'nick': 'string'
      },
      VERIFY:{
      },
      ERROR_CODE: {
        '1000020': '账户已注册',
        '1000230': '手机号错误，请输入正确的手机号',
        '1000240': '手机验证码错误',
        '1000250': '手机验证码已过期'
      }
    }
  });
});