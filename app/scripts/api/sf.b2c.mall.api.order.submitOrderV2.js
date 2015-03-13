// Auto Generated.  DO NOT EDIT!
/**
  * @class sf.b2c.mall.api.order.submitOrderV2
  * @param  {Object} $
  * @param  {Object} can
  * @param  {Object} _
  * @param  {can.Construct} Comm
  * @param  {Object} SecurityType
  * @return {can.Construct}
  */
define(
'sf.b2c.mall.api.order.submitOrderV2',
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
      METHOD_NAME: 'order.submitOrderV2',
      SECURITY_TYPE: SecurityType.UserLogin.name,
      REQUIRED: {
        'addressId': 'json',
        'items': 'json'
      },
      OPTIONAL: {
        'userMsg': 'string',
      },
      VERIFY:{
      },
      ERROR_CODE: {
        '4000100': 'order unkown error',
        '4000200': '订单地址不存在',
        '4000400': '订单商品信息改变',
        '4000500': '订单商品库存不足',
        '4000600': '订单商品超过限额',
        '4000700': '订单商品金额改变',
        '4002300': '购买的多个商品货源地不一致',
        '4002400': '购买的多个商品的商品形态不一致',
        '4002500': '购买的商品支付卡类型为空',
        '4002600': '购买的商品不在配送范围内',
        '4002700': '购买的商品不是上架状态'
      }
    }
  });
});