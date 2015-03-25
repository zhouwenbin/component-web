// Auto Generated.  DO NOT EDIT!
/**
  * @class sf.b2c.mall.api.product.commitFeedback
  * @param  {Object} $
  * @param  {Object} can
  * @param  {Object} _
  * @param  {can.Construct} Comm
  * @param  {Object} SecurityType
  * @return {can.Construct}
  */
define(
'sf.b2c.mall.api.product.commitFeedback',
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
      METHOD_NAME: 'product.commitFeedback',
      SECURITY_TYPE: SecurityType.None.name,
      REQUIRED: {
        'feedback': 'string'
      },
      OPTIONAL: {
        'phoneNumber': 'string',
        'email': 'string',
      },
      VERIFY:{
      },
      ERROR_CODE: {
        '5004000': '反馈信息存储失败'
      }
    }
  });
});