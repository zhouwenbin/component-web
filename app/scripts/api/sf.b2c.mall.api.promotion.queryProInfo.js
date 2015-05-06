// Auto Generated.  DO NOT EDIT!
/**
  * @class sf.b2c.mall.api.promotion.queryProInfo
  * @param  {Object} $
  * @param  {Object} can
  * @param  {Object} _
  * @param  {can.Construct} Comm
  * @param  {Object} SecurityType
  * @return {can.Construct}
  */
define(
'sf.b2c.mall.api.promotion.queryProInfo',
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
      METHOD_NAME: 'promotion.queryProInfo',
      SECURITY_TYPE: SecurityType.None.name,
      REQUIRED: {
        'channel': 'string',
        'event': 'string'
      },
      OPTIONAL: {
      },
      VERIFY:{
      },
      ERROR_CODE: {
      }
    }
  });
});