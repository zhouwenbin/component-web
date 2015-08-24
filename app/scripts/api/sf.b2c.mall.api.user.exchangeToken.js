// Auto Generated.  DO NOT EDIT!
/**
  * @class sf.b2c.mall.api.user.exchangeToken
  * @param  {Object} $
  * @param  {Object} can
  * @param  {Object} _
  * @param  {can.Construct} Comm
  * @param  {Object} SecurityType
  * @return {can.Construct}
  */
define(
'sf.b2c.mall.api.user.exchangeToken',
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
      METHOD_NAME: 'user.exchangeToken',
      SECURITY_TYPE: SecurityType.None.name,
      REQUIRED: {
        'tempToken': 'string'
      },
      OPTIONAL: {
      },
      VERIFY:{
      },
      ERROR_CODE: {
        '1000350': '验证临时token失败,请重新登录'
      }
    }
  });
});