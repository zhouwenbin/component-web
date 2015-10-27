// Auto Generated.  DO NOT EDIT!
/**
  * @class sf.b2c.mall.api.coupon.receiveCouponByYaoYiYao
  * @param  {Object} $
  * @param  {Object} can
  * @param  {Object} _
  * @param  {can.Construct} Comm
  * @param  {Object} SecurityType
  * @return {can.Construct}
  */
define(
'sf.b2c.mall.api.coupon.receiveCouponByYaoYiYao',
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
      METHOD_NAME: 'coupon.receiveCouponByYaoYiYao',
      SECURITY_TYPE: SecurityType.UserLogin.name,
      REQUIRED: {
        'couponId': 'long',
        'receiveChannel': 'string',
        'receiveWay': 'string',
      },
      OPTIONAL: {
        'needSms': 'int',
        'smsCon': 'string'
      },
      VERIFY:{
      },
      ERROR_CODE: {
        '11000020': '卡券id不存在',
        '11000030': '卡券已作废',
        '11000050': '卡券已领完',
        '11000100': '用户已领过该券',
        '11000130': '卡包不存在',
        '11000140': '卡包已作废'
      }
    }
  });
});