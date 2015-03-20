// Auto Generated.  DO NOT EDIT!
/**
  * @class sf.b2c.mall.api.product.arrivalNotice
  * @param  {Object} $
  * @param  {Object} can
  * @param  {Object} _
  * @param  {can.Construct} Comm
  * @param  {Object} SecurityType
  * @return {can.Construct}
  */
define(
'sf.b2c.mall.api.product.arrivalNotice',
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
      METHOD_NAME: 'product.arrivalNotice',
      SECURITY_TYPE: SecurityType.None.name,
      REQUIRED: {
        'itemId': 'long',
        'mobileNumber': 'long'
      },
      OPTIONAL: {
      },
      VERIFY:{
      },
      ERROR_CODE: {
        '5002000': '到货通知存储信息失败'
      }
    }
  });
});