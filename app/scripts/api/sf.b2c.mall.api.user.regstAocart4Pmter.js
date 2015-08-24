// Auto Generated.  DO NOT EDIT!
/**
  * @class sf.b2c.mall.api.user.regstAocart4Pmter
  * @param  {Object} $
  * @param  {Object} can
  * @param  {Object} _
  * @param  {can.Construct} Comm
  * @param  {Object} SecurityType
  * @return {can.Construct}
  */
define(
'sf.b2c.mall.api.user.regstAocart4Pmter',
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
      METHOD_NAME: 'user.regstAocart4Pmter',
      SECURITY_TYPE: SecurityType.None.name,
      REQUIRED: {
        'inviterMobile': 'string',
        'inviteeMobile': 'string',
      },
      OPTIONAL: {
        'itemIds': 'string'
      },
      VERIFY:{
      },
      ERROR_CODE: {
        '1000020': '账户已注册',
        '1000470': '邀请人并非推广员'
      }
    }
  });
});