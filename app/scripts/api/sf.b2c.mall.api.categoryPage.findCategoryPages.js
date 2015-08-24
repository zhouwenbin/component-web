// Auto Generated.  DO NOT EDIT!
/**
  * @class sf.b2c.mall.api.categoryPage.findCategoryPages
  * @param  {Object} $
  * @param  {Object} can
  * @param  {Object} _
  * @param  {can.Construct} Comm
  * @param  {Object} SecurityType
  * @return {can.Construct}
  */
define(
'sf.b2c.mall.api.categoryPage.findCategoryPages',
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
      METHOD_NAME: 'categoryPage.findCategoryPages',
      SECURITY_TYPE: SecurityType.None.name,
      REQUIRED: {
        'pId': 'long',
      },
      OPTIONAL: {
        'limit': 'int'
      },
      VERIFY:{
      },
      ERROR_CODE: {
        '5029000': '获取前台类目数据错误'
      }
    }
  });
});