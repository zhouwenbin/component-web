// Auto Generated.  DO NOT EDIT!
/**
  * @class sf.b2c.mall.api.order.liulianCustomerCancelOrder
  * @param  {Object} $
  * @param  {Object} can
  * @param  {Object} _
  * @param  {can.Construct} Comm
  * @param  {Object} SecurityType
  * @return {can.Construct}
  */
define(
'sf.b2c.mall.api.order.liulianCustomerCancelOrder',
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
      METHOD_NAME: 'order.liulianCustomerCancelOrder',
      SECURITY_TYPE: SecurityType.UserLogin.name,
      REQUIRED: {
        'orderId': 'string',
        'reason': 'string'
      },
      OPTIONAL: {
      },
      VERIFY:{
      },
      ERROR_CODE: {
        '4000100': 'order unkown error',
        '4000800': '订单状态不能取消'
      }
    }
  });
});