// Auto Generated.  DO NOT EDIT!
/**
  * @class sf.b2c.mall.api.b2cmall.getCmsHeaderConfig
  * @param  {Object} $
  * @param  {Object} can
  * @param  {Object} _
  * @param  {can.Construct} Comm
  * @param  {Object} SecurityType
  * @return {can.Construct}
  */
define(
'sf.b2c.mall.api.b2cmall.getCmsHeaderConfig',
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
      METHOD_NAME: 'b2cmall.getCmsHeaderConfig',
      SECURITY_TYPE: SecurityType.None.name,
      REQUIRED: {
        'pageUrl': 'string'
      },
      OPTIONAL: {
      },
      VERIFY:{
      },
      ERROR_CODE: {
        '9000005': 'url不合法'
      }
    }
  });
});