// Auto Generated.  DO NOT EDIT!
/**
  * @class sf.b2c.mall.api.product.findRecommendProducts
  * @param  {Object} $
  * @param  {Object} can
  * @param  {Object} _
  * @param  {can.Construct} Comm
  * @param  {Object} SecurityType
  * @return {can.Construct}
  */
define(
'sf.b2c.mall.api.product.findRecommendProducts',
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
      METHOD_NAME: 'product.findRecommendProducts',
      SECURITY_TYPE: SecurityType.None.name,
      REQUIRED: {
        'itemId': 'long',
      },
      OPTIONAL: {
        'size': 'int'
      },
      VERIFY:{
      },
      ERROR_CODE: {
        '5000400': '类目未发现'
      }
    }
  });
});