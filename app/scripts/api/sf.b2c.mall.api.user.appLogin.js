// Auto Generated.  DO NOT EDIT!
/**
  * @class sf.b2c.mall.api.user.appLogin
  * @param  {Object} $
  * @param  {Object} can
  * @param  {Object} _
  * @param  {can.Construct} Comm
  * @param  {Object} SecurityType
  * @return {can.Construct}
  */
define(
'sf.b2c.mall.api.user.appLogin',
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
      METHOD_NAME: 'user.appLogin',
      SECURITY_TYPE: SecurityType.RegisteredDevice.name,
      REQUIRED: {
        'accountId': 'string',
        'type': 'string',
        'password': 'string',
      },
      OPTIONAL: {
        'vfCode': 'string'
      },
      VERIFY:{
      },
      ERROR_CODE: {
        '1000010': '未找到用户',
        '1000030': '用户名or密码错误',
        '1000070': '参数错误',
        '1000100': '验证码错误',
        '1000110': '账户尚未激活',
        '1000300': '用户名或密码错误已达3次，需要输入验证码'
      }
    }
  });
});