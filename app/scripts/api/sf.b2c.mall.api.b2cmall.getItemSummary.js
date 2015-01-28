// Auto Generated.  DO NOT EDIT!
/**
  * @class sf.b2c.mall.api.b2cmall.getItemSummary
  * @param  {Object} $
  * @param  {Object} can
  * @param  {Object} _
  * @param  {can.Construct} Comm
  * @param  {Object} SecurityType
  * @return {can.Construct}
  */
define(
'sf.b2c.mall.api.b2cmall.getItemSummary',
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
      METHOD_NAME: 'b2cmall.getItemSummary',
      SECURITY_TYPE: SecurityType.None.name,
      REQUIRED: {
        'itemId': 'long'
      },
      OPTIONAL: {
      },
      VERIFY:{
      },
      ERROR_CODE: {
        '9000210': '未知的item',
        '9000220': 'su不可售'
      }
    }
  });
});