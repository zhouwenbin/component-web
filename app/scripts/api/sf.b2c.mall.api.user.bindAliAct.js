// Auto Generated.  DO NOT EDIT!
/**
  * @class sf.b2c.mall.api.user.bindAliAct
  * @param  {Object} $
  * @param  {Object} can
  * @param  {Object} _
  * @param  {can.Construct} Comm
  * @param  {Object} SecurityType
  * @return {can.Construct}
  */
define(
'sf.b2c.mall.api.user.bindAliAct',
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
      METHOD_NAME: 'user.bindAliAct',
      SECURITY_TYPE: SecurityType.UserLogin.name,
      REQUIRED: {
        'aliAct': 'string',
        'aliActName': 'string'
      },
      OPTIONAL: {
      },
      VERIFY:{
      },
      ERROR_CODE: {
        '1000440': '已绑定支付宝账户'
      }
    }
  });
});