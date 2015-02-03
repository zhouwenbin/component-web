// Auto Generated.  DO NOT EDIT!
/**
  * @class sf.b2c.mall.api.user.sendActivateMail
  * @param  {Object} $
  * @param  {Object} can
  * @param  {Object} _
  * @param  {can.Construct} Comm
  * @param  {Object} SecurityType
  * @return {can.Construct}
  */
define(
'sf.b2c.mall.api.user.sendActivateMail',
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
      METHOD_NAME: 'user.sendActivateMail',
      SECURITY_TYPE: SecurityType.None.name,
      REQUIRED: {
        'mailId': 'string',
      },
      OPTIONAL: {
        'vfCode': 'string',
        'from': 'string'
      },
      VERIFY:{
      },
      ERROR_CODE: {
        '1000020': '账户已注册',
        '1000050': '邮箱地址错误',
        '1000070': '参数错误',
        '1000100': '验证码错误',
        '1000160': '邮件请求频繁'
      }
    }
  });
});