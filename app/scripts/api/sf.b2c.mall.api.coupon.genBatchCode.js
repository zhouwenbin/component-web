// Auto Generated.  DO NOT EDIT!
/**
  * @class sf.b2c.mall.api.coupon.genBatchCode
  * @param  {Object} $
  * @param  {Object} can
  * @param  {Object} _
  * @param  {can.Construct} Comm
  * @param  {Object} SecurityType
  * @return {can.Construct}
  */
define(
'sf.b2c.mall.api.coupon.genBatchCode',
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
      METHOD_NAME: 'coupon.genBatchCode',
      SECURITY_TYPE: SecurityType.None.name,
      REQUIRED: {
        'cardId': 'long',
      },
      OPTIONAL: {
        'genNum': 'int',
        'receiveChannel': 'string',
        'receiveTernimal': 'string',
        'receiveWay': 'string'
      },
      VERIFY:{
      },
      ERROR_CODE: {
      }
    }
  });
});