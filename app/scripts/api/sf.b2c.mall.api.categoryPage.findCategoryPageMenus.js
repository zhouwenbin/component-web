// Auto Generated.  DO NOT EDIT!
/**
  * @class sf.b2c.mall.api.categoryPage.findCategoryPageMenus
  * @param  {Object} $
  * @param  {Object} can
  * @param  {Object} _
  * @param  {can.Construct} Comm
  * @param  {Object} SecurityType
  * @return {can.Construct}
  */
define(
'sf.b2c.mall.api.categoryPage.findCategoryPageMenus',
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
      METHOD_NAME: 'categoryPage.findCategoryPageMenus',
      SECURITY_TYPE: SecurityType.None.name,
      REQUIRED: {
        'pId': 'long'
      },
      OPTIONAL: {
      },
      VERIFY:{
      },
      ERROR_CODE: {
        '-101': ''
      }
    }
  });
});
