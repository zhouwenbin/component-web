// Auto Generated.  DO NOT EDIT!
/**
  * @class sf.b2c.mall.api.order.liulianCustomerSubmitOrder
  * @param  {Object} $
  * @param  {Object} can
  * @param  {Object} _
  * @param  {can.Construct} Comm
  * @param  {Object} SecurityType
  * @return {can.Construct}
  */
define(
'sf.b2c.mall.api.order.liulianCustomerSubmitOrder',
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
      METHOD_NAME: 'order.liulianCustomerSubmitOrder',
      SECURITY_TYPE: SecurityType.UserLogin.name,
      REQUIRED: {
        'addressId': 'json',
        'items': 'json',
        'sysType': 'string',
      },
      OPTIONAL: {
        'userMsg': 'string',
        'sysInfo': 'string'
      },
      VERIFY:{
      },
      ERROR_CODE: {
        '4000100': 'order unkown error',
        '4000200': '订单地址不存在',
        '4000400': '订单商品信息改变',
        '4000500': '订单商品库存不足',
        '4000600': '订单商品超过限额',
        '4000700': '订单商品金额改变'
      }
    }
  });
});