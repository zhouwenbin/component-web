// Auto Generated.  DO NOT EDIT!
/**
  * @class sf.b2c.mall.api.order.requestPayV2
  * @param  {Object} $
  * @param  {Object} can
  * @param  {Object} _
  * @param  {can.Construct} Comm
  * @param  {Object} SecurityType
  * @return {can.Construct}
  */
define(
'sf.b2c.mall.api.order.requestPayV2',
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
      METHOD_NAME: 'order.requestPayV2',
      SECURITY_TYPE: SecurityType.UserLogin.name,
      REQUIRED: {
        'orderId': 'string',
        'payType': 'string'
      },
      OPTIONAL: {
      },
      VERIFY:{
      },
      ERROR_CODE: {
        '4000100': 'order unkown error',
        '4001500': '请求支付系统失败',
        '4001700': '满足查询条件的订单不存在',
        '4002200': '子订单获取物流线路信息为空'
      }
    }
  });
});