// Auto Generated.  DO NOT EDIT!
/**
  * @class sf.b2c.mall.api.commentGoods.findCommentInfoList
  * @param  {Object} $
  * @param  {Object} can
  * @param  {Object} _
  * @param  {can.Construct} Comm
  * @param  {Object} SecurityType
  * @return {can.Construct}
  */
define(
'sf.b2c.mall.api.commentGoods.findCommentInfoList',
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
      METHOD_NAME: 'commentGoods.findCommentInfoList',
      SECURITY_TYPE: SecurityType.None.name,
      REQUIRED: {
        'itemId': 'long',
        'type': 'int',
        'pageNum': 'int',
      },
      OPTIONAL: {
        'pageSize': 'int'
      },
      VERIFY:{
      },
      ERROR_CODE: {
      }
    }
  });
});