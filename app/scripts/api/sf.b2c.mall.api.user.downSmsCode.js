// Auto Generated.  DO NOT EDIT!
/**
  * @class sf.b2c.mall.api.user.downSmsCode
  * @param  {Object} $
  * @param  {Object} can
  * @param  {Object} _
  * @param  {can.Construct} Comm
  * @param  {Object} SecurityType
  * @return {can.Construct}
  */
define(
'sf.b2c.mall.api.user.downSmsCode',
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
      METHOD_NAME: 'user.downSmsCode',
      SECURITY_TYPE: SecurityType.None.name,
      REQUIRED: {
        'mobile': 'string',
        'askType': 'string'
      },
      OPTIONAL: {
      },
      VERIFY:{
      },
      ERROR_CODE: {
        '1000010': '未找到用户',
        '1000020': '账户已注册',
        '1000230': '手机号错误，请输入正确的手机号',
        '1000270': '短信请求太过频繁',
        '1000290': '短信请求太多'
      }
    }
  });
});