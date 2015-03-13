// Auto Generated.  DO NOT EDIT!
/**
  * @class sf.b2c.mall.api.llproduct.getEntryHot
  * @param  {Object} $
  * @param  {Object} can
  * @param  {Object} _
  * @param  {can.Construct} Comm
  * @param  {Object} SecurityType
  * @return {can.Construct}
  */
define(
'sf.b2c.mall.api.llproduct.getEntryHot',
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
      METHOD_NAME: 'llproduct.getEntryHot',
      SECURITY_TYPE: SecurityType.None.name,
      REQUIRED: {
        'pageIndex': 'int',
        'sizePerPage': 'int'
      },
      OPTIONAL: {
      },
      VERIFY:{
      },
      ERROR_CODE: {
        '7001200': '分页错误'
      }
    }
  });
});