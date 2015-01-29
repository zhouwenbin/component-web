// Auto Generated.  DO NOT EDIT!
/**
  * @class sf.b2c.mall.api.sc.getUserRoutes
  * @param  {Object} $
  * @param  {Object} can
  * @param  {Object} _
  * @param  {can.Construct} Comm
  * @param  {Object} SecurityType
  * @return {can.Construct}
  */
define(
'sf.b2c.mall.api.sc.getUserRoutes',
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
      METHOD_NAME: 'sc.getUserRoutes',
      SECURITY_TYPE: SecurityType.UserLogin.name,
      REQUIRED: {
        'bizId': 'string'
      },
      OPTIONAL: {
      },
      VERIFY:{
      },
      ERROR_CODE: {
        '2004020': '订单不存在失败'
      }
    }
  });
});