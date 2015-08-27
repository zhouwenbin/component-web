// Auto Generated.  DO NOT EDIT!
/**
  * @class sf.b2c.mall.api.commentGoods.getComments
  * @param  {Object} $
  * @param  {Object} can
  * @param  {Object} _
  * @param  {can.Construct} Comm
  * @param  {Object} SecurityType
  * @return {can.Construct}
  */
define(
'sf.b2c.mall.api.commentGoods.getComments',
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
      METHOD_NAME: 'commentGoods.getComments',
      SECURITY_TYPE: SecurityType.UserLogin.name,
      REQUIRED: {
        'orderId': 'long',
      },
      OPTIONAL: {
        'itemID': 'long'
      },
      VERIFY:{
      },
      ERROR_CODE: {
        '14017000': '获取评价详情错误!'
      }
    }
  });
});