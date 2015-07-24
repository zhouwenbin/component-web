// Auto Generated.  DO NOT EDIT!
/**
  * @class sf.b2c.mall.api.integral.preCalIntegralAfterFinishOrder
  * @param  {Object} $
  * @param  {Object} can
  * @param  {Object} _
  * @param  {can.Construct} Comm
  * @param  {Object} SecurityType
  * @return {can.Construct}
  */
define(
'sf.b2c.mall.api.integral.preCalIntegralAfterFinishOrder',
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
      METHOD_NAME: 'integral.preCalIntegralAfterFinishOrder',
      SECURITY_TYPE: SecurityType.UserLogin.name,
      REQUIRED: {
        'channel': 'string',
        'orderAmount': 'long',
        'isFirst': 'boolean'
      },
      OPTIONAL: {
      },
      VERIFY:{
      },
      ERROR_CODE: {
      }
    }
  });
});