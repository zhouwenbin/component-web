// Auto Generated.  DO NOT EDIT!
/**
  * @class sf.b2c.mall.api.product.searchShopInfo
  * @param  {Object} $
  * @param  {Object} can
  * @param  {Object} _
  * @param  {can.Construct} Comm
  * @param  {Object} SecurityType
  * @return {can.Construct}
  */
define(
'sf.b2c.mall.api.product.searchShopInfo',
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
      METHOD_NAME: 'product.searchShopInfo',
      SECURITY_TYPE: SecurityType.None.name,
      REQUIRED: {
        'shopId': 'long'
      },
      OPTIONAL: {
      },
      VERIFY:{
      },
      ERROR_CODE: {
        '5023000': '店铺不存在'
      }
    }
  });
});