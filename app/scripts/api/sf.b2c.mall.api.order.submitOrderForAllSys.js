// Auto Generated.  DO NOT EDIT!
/**
  * @class sf.b2c.mall.api.order.submitOrderForAllSys
  * @param  {Object} $
  * @param  {Object} can
  * @param  {Object} _
  * @param  {can.Construct} Comm
  * @param  {Object} SecurityType
  * @return {can.Construct}
  */
define(
'sf.b2c.mall.api.order.submitOrderForAllSys',
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
      METHOD_NAME: 'order.submitOrderForAllSys',
      SECURITY_TYPE: SecurityType.UserLogin.name,
      REQUIRED: {
        'address': 'json',
        'items': 'json',
        'sysType': 'string',
      },
      OPTIONAL: {
        'userMsg': 'string',
        'couponCodes': 'string',
        'sysInfo': 'string',
        'submitKey': 'string'
      },
      VERIFY:{
      },
      ERROR_CODE: {
        '4000100': 'order unkown error',
        '4000200': '订单地址不存在',
        '4000401': '购买数量超过活动每人限购数量',
        '4000402': '折扣金额大于订单总金额',
        '4000403': '购买数量超过活动剩余库存',
        '4000404': '活动已经结束',
        '4000405': '折扣金额过大，超过订单总金额的30%！',
        '4000500': '订单商品库存不足',
        '4000600': '订单商品超过限额',
        '4000700': '订单商品金额改变',
        '4002300': '购买的多个商品货源地不一致',
        '4002400': '购买的多个商品的商品形态不一致',
        '4002500': '购买的商品支付卡类型为空',
        '4002600': '购买的商品不在配送范围内',
        '4002700': '购买的商品不是上架状态',
        '4100901': '优惠券使用失败！',
        '4100902': '优惠券不在可使用的时间范围内！',
        '4100903': '优惠券不能在该渠道下使用！',
        '4100904': '优惠券不能在该终端下使用！',
        '4100905': '使用的优惠券不满足满减条件！',
        '4100906': '使用的优惠券金额超过商品总金额的30%！',
        '4100907': '通知商户状态变更失败!'
      }
    }
  });
});