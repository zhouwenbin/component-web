// Auto Generated.  DO NOT EDIT!
/**
  * @class sf.b2c.mall.api.b2cmall.checkLogistics
  * @param  {Object} $
  * @param  {Object} can
  * @param  {Object} _
  * @param  {can.Construct} Comm
  * @param  {Object} SecurityType
  * @return {can.Construct}
  */
define(
'sf.b2c.mall.api.b2cmall.checkLogistics',
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
      METHOD_NAME: 'b2cmall.checkLogistics',
      SECURITY_TYPE: SecurityType.None.name,
      REQUIRED: {
        'areaId': 'int',
        'provinceId': 'int',
        'cityId': 'int',
        'districtId': 'int'
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