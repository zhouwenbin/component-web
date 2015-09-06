// Auto Generated.  DO NOT EDIT!
/**
  * @class sf.b2c.mall.api.user.getRegstedList
  * @param  {Object} $
  * @param  {Object} can
  * @param  {Object} _
  * @param  {can.Construct} Comm
  * @param  {Object} SecurityType
  * @return {can.Construct}
  */
define(
'sf.b2c.mall.api.user.getRegstedList',
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
      METHOD_NAME: 'user.getRegstedList',
      SECURITY_TYPE: SecurityType.UserLogin.name,
      REQUIRED: {
        'status': 'string',
      },
      OPTIONAL: {
        'pgIndex': 'int',
        'pgSize': 'int'
      },
      VERIFY:{
      },
      ERROR_CODE: {
      }
    }
  });
});