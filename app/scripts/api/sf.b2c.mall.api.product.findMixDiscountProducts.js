// Auto Generated.  DO NOT EDIT!
/**
  * @class sf.b2c.mall.api.product.findMixDiscountProducts
  * @param  {Object} $
  * @param  {Object} can
  * @param  {Object} _
  * @param  {can.Construct} Comm
  * @param  {Object} SecurityType
  * @return {can.Construct}
  */
define(
'sf.b2c.mall.api.product.findMixDiscountProducts',
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
      METHOD_NAME: 'product.findMixDiscountProducts',
      SECURITY_TYPE: SecurityType.None.name,
      REQUIRED: {
        'itemId': 'long',
      },
      OPTIONAL: {
        'activityId': 'long'
      },
      VERIFY:{
      },
      ERROR_CODE: {
        '5024000': '获取搭配折扣数据错误'
      }
    }
  });
});