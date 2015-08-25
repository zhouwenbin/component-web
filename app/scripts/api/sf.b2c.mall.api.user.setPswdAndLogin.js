// Auto Generated.  DO NOT EDIT!
/**
  * @class sf.b2c.mall.api.user.setPswdAndLogin
  * @param  {Object} $
  * @param  {Object} can
  * @param  {Object} _
  * @param  {can.Construct} Comm
  * @param  {Object} SecurityType
  * @return {can.Construct}
  */
define(
'sf.b2c.mall.api.user.setPswdAndLogin',
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
      METHOD_NAME: 'user.setPswdAndLogin',
      SECURITY_TYPE: SecurityType.None.name,
      REQUIRED: {
        'type': 'string',
        'accountId': 'string',
        'smsCode': 'string',
        'password': 'string'
      },
      OPTIONAL: {
      },
      VERIFY:{
      },
      ERROR_CODE: {
        '1000010': '未找到用户',
        '1000030': '用户名or密码错误',
        '1000100': '验证码错误',
        '1000110': '账户尚未激活',
        '1000300': '用户名或密码错误已达3次，需要输入验证码',
        '1000340': '用户账户还没有密码',
        '1000480': '用户账户被冻结，不允许登录'
      }
    }
  });
});