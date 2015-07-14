// Auto Generated.  DO NOT EDIT!
/**
  * @class sf.b2c.mall.api.payment.appRequestPay
  * @param  {Object} $
  * @param  {Object} can
  * @param  {Object} _
  * @param  {can.Construct} Comm
  * @param  {Object} SecurityType
  * @return {can.Construct}
  */
define(
'sf.b2c.mall.api.payment.appRequestPay',
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
      METHOD_NAME: 'payment.appRequestPay',
      SECURITY_TYPE: SecurityType.UserLogin.name,
      REQUIRED: {
        'serviceType': 'string',
        'orderId': 'string',
        'amount': 'int',
        'orderName': 'string',
      },
      OPTIONAL: {
        'reserved': 'string',
        'ext_params': 'string'
      },
      VERIFY:{
      },
      ERROR_CODE: {
      }
    }
  });
});