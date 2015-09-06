// Auto Generated.  DO NOT EDIT!
/**
  * @class sf.b2c.mall.api.user.ptnBindAndRcvCp
  * @param  {Object} $
  * @param  {Object} can
  * @param  {Object} _
  * @param  {can.Construct} Comm
  * @param  {Object} SecurityType
  * @return {can.Construct}
  */
define(
'sf.b2c.mall.api.user.ptnBindAndRcvCp',
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
      METHOD_NAME: 'user.ptnBindAndRcvCp',
      SECURITY_TYPE: SecurityType.None.name,
      REQUIRED: {
        'tempToken': 'string',
        'type': 'string',
        'accountId': 'string',
        'smsCode': 'string',
        'bagType': 'string',
        'bagId': 'long'
      },
      OPTIONAL: {
        'srcUid': 'string',
      },
      VERIFY:{
      },
      ERROR_CODE: {
        '1000020': '账户已注册',
        '1000070': '参数错误',
        '1000240': '手机验证码错误',
        '1000250': '手机验证码已过期',
        '1000350': '验证临时token失败,请重新登录',
        '1000360': '第三方账户已绑定海淘账户',
        '1000380': '已经绑定了同类的第三方账户',
        '1000410': '需要短信验证码，请输入',
        '1000480': '用户账户被冻结，不允许登录'
      }
    }
  });
});