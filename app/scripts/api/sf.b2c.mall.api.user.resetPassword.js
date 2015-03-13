// Auto Generated.  DO NOT EDIT!
/**
  * @class sf.b2c.mall.api.user.resetPassword
  * @param  {Object} $
  * @param  {Object} can
  * @param  {Object} _
  * @param  {can.Construct} Comm
  * @param  {Object} SecurityType
  * @return {can.Construct}
  */
define(
'sf.b2c.mall.api.user.resetPassword',
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
      METHOD_NAME: 'user.resetPassword',
      SECURITY_TYPE: SecurityType.None.name,
      REQUIRED: {
        'accountId': 'string',
        'type': 'string',
        'newPassword': 'string',
      },
      OPTIONAL: {
        'linkContent': 'string',
        'smsCode': 'string'
      },
      VERIFY:{
      },
      ERROR_CODE: {
        '1000010': '未找到用户',
        '1000120': '链接已过期',
        '1000130': '签名验证失败',
        '1000140': '密码修改间隔太短',
        '1000230': '手机号错误，请输入正确的手机号',
        '1000240': '手机验证码错误',
        '1000250': '手机验证码已过期'
      }
    }
  });
});