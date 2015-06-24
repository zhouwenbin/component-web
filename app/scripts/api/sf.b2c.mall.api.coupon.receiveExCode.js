// Auto Generated.  DO NOT EDIT!
/**
  * @class sf.b2c.mall.api.coupon.receiveExCode
  * @param  {Object} $
  * @param  {Object} can
  * @param  {Object} _
  * @param  {can.Construct} Comm
  * @param  {Object} SecurityType
  * @return {can.Construct}
  */
define(
'sf.b2c.mall.api.coupon.receiveExCode',
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
      METHOD_NAME: 'coupon.receiveExCode',
      SECURITY_TYPE: SecurityType.UserLogin.name,
      REQUIRED: {
        'exCode': 'string'
      },
      OPTIONAL: {
      },
      VERIFY:{
      },
      ERROR_CODE: {
        '11000100': '用户已领过该券',
        '11000160': '优惠码不存在',
        '11000170': '优惠码已使用',
        '11000200': '优惠码已过期',
        '11000209': '共用card不存在',
        '11000220': '本账户兑换次数超出限制'
      }
    }
  });
});