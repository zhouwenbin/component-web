// Auto Generated.  DO NOT EDIT!
/**
  * @class sf.b2c.mall.api.llorder.changeOrderPrice
  * @param  {Object} $
  * @param  {Object} can
  * @param  {Object} _
  * @param  {can.Construct} Comm
  * @param  {Object} SecurityType
  * @return {can.Construct}
  */
define(
'sf.b2c.mall.api.llorder.changeOrderPrice',
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
      METHOD_NAME: 'llorder.changeOrderPrice',
      SECURITY_TYPE: SecurityType.UserLogin.name,
      REQUIRED: {
        'orderId': 'string',
        'price': 'int'
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