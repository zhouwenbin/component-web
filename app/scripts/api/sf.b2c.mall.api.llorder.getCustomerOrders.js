// Auto Generated.  DO NOT EDIT!
/**
  * @class sf.b2c.mall.api.llorder.getCustomerOrders
  * @param  {Object} $
  * @param  {Object} can
  * @param  {Object} _
  * @param  {can.Construct} Comm
  * @param  {Object} SecurityType
  * @return {can.Construct}
  */
define(
'sf.b2c.mall.api.llorder.getCustomerOrders',
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
      METHOD_NAME: 'llorder.getCustomerOrders',
      SECURITY_TYPE: SecurityType.UserLogin.name,
      REQUIRED: {
        'orderType': 'int',
        'pageIndex': 'int',
        'sizePerPage': 'int'
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