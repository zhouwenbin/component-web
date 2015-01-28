// Auto Generated.  DO NOT EDIT!
/**
  * @class sf.b2c.mall.api.b2cmall.getTimeLimitedSaleInfoList
  * @param  {Object} $
  * @param  {Object} can
  * @param  {Object} _
  * @param  {can.Construct} Comm
  * @param  {Object} SecurityType
  * @return {can.Construct}
  */
define(
'sf.b2c.mall.api.b2cmall.getTimeLimitedSaleInfoList',
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
      METHOD_NAME: 'b2cmall.getTimeLimitedSaleInfoList',
      SECURITY_TYPE: SecurityType.None.name,
      REQUIRED: {
        'filter': 'string',
      },
      OPTIONAL: {
        'size': 'int'
      },
      VERIFY:{
      },
      ERROR_CODE: {
      }
    }
  });
});