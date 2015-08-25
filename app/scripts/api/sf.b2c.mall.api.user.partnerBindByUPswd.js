// Auto Generated.  DO NOT EDIT!
/**
  * @class sf.b2c.mall.api.user.partnerBindByUPswd
  * @param  {Object} $
  * @param  {Object} can
  * @param  {Object} _
  * @param  {can.Construct} Comm
  * @param  {Object} SecurityType
  * @return {can.Construct}
  */
define(
'sf.b2c.mall.api.user.partnerBindByUPswd',
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
      METHOD_NAME: 'user.partnerBindByUPswd',
      SECURITY_TYPE: SecurityType.None.name,
      REQUIRED: {
        'tempToken': 'string',
        'type': 'string',
        'accountId': 'string',
        'passWord': 'string',
      },
      OPTIONAL: {
        'srcUid': 'string'
      },
      VERIFY:{
      },
      ERROR_CODE: {
        '1000040': '原密码错误',
        '1000340': '用户账户还没有密码',
        '1000350': '验证临时token失败,请重新登录',
        '1000360': '第三方账户已绑定海淘账户',
        '1000380': '已经绑定了同类的第三方账户',
        '1000400': '密码缺失，请输入密码',
        '1000480': '用户账户被冻结，不允许登录'
      }
    }
  });
});