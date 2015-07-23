// Auto Generated.  DO NOT EDIT!
/**
  * @class sf.b2c.mall.api.coupon.randomCard
  * @param  {Object} $
  * @param  {Object} can
  * @param  {Object} _
  * @param  {can.Construct} Comm
  * @param  {Object} SecurityType
  * @return {can.Construct}
  */
define(
'sf.b2c.mall.api.coupon.randomCard',
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
      METHOD_NAME: 'coupon.randomCard',
      SECURITY_TYPE: SecurityType.None.name,
      REQUIRED: {
        'name': 'string',
      },
      OPTIONAL: {
        'mobile': 'string'
      },
      VERIFY:{
      },
      ERROR_CODE: {
        '11000050': '卡券已领完',
        '11000240': '用户今天的券已经领完了',
        '11000250': '用户已经领完该活动期间所有的券',
        '11000260': '用户输入手机号有误'
      }
    }
  });
});