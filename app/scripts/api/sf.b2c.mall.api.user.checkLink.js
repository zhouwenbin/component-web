// Auto Generated.  DO NOT EDIT!
/**
  * @class sf.b2c.mall.api.user.checkLink
  * @param  {Object} $
  * @param  {Object} can
  * @param  {Object} _
  * @param  {can.Construct} Comm
  * @param  {Object} SecurityType
  * @return {can.Construct}
  */
define(
'sf.b2c.mall.api.user.checkLink',
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
      METHOD_NAME: 'user.checkLink',
      SECURITY_TYPE: SecurityType.None.name,
      REQUIRED: {
        'linkContent': 'string'
      },
      OPTIONAL: {
      },
      VERIFY:{
      },
      ERROR_CODE: {
        '1000020': '账户已注册',
        '1000120': '链接已过期',
        '1000130': '签名验证失败',
        '1000140': '密码修改间隔太短'
      }
    }
  });
});