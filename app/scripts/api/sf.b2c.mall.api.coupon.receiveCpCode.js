// Auto Generated.  DO NOT EDIT!
/**
  * @class sf.b2c.mall.api.coupon.receiveCpCode
  * @param  {Object} $
  * @param  {Object} can
  * @param  {Object} _
  * @param  {can.Construct} Comm
  * @param  {Object} SecurityType
  * @return {can.Construct}
  */
define(
'sf.b2c.mall.api.coupon.receiveCpCode',
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
      METHOD_NAME: 'coupon.receiveCpCode',
      SECURITY_TYPE: SecurityType.UserLogin.name,
      REQUIRED: {
        'promotionId': 'long',
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
        '11000040': '目前不再卡券发放有效期内',
        '11000050': '卡券已领完',
        '11000100': '用户已领过该券',
        '11000110': '用户不存在'
      }
    }
  });
});