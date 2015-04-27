// Auto Generated.  DO NOT EDIT!
/**
  * @class sf.b2c.mall.api.coupon.hasReceivedCp
  * @param  {Object} $
  * @param  {Object} can
  * @param  {Object} _
  * @param  {can.Construct} Comm
  * @param  {Object} SecurityType
  * @return {can.Construct}
  */
define(
'sf.b2c.mall.api.coupon.hasReceivedCp',
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
      METHOD_NAME: 'coupon.hasReceivedCp',
      SECURITY_TYPE: SecurityType.UserLogin.name,
      REQUIRED: {
        'bagType': 'string',
        'bagId': 'long'
      },
      OPTIONAL: {
      },
      VERIFY:{
      },
      ERROR_CODE: {
        '11000020': '卡券id不存在',
        '11000130': '卡包不存在'
      }
    }
  });
});