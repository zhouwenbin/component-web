// Auto Generated.  DO NOT EDIT!
/**
  * @class sf.b2c.mall.api.commentGoods.findCommentInfoListByType
  * @param  {Object} $
  * @param  {Object} can
  * @param  {Object} _
  * @param  {can.Construct} Comm
  * @param  {Object} SecurityType
  * @return {can.Construct}
  */
define(
'sf.b2c.mall.api.commentGoods.findCommentInfoListByType',
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
      METHOD_NAME: 'commentGoods.findCommentInfoListByType',
      SECURITY_TYPE: SecurityType.UserLogin.name,
      REQUIRED: {
        'type': 'int',
        'pageSize': 'int',
      },
      OPTIONAL: {
        'pageNum': 'int'
      },
      VERIFY:{
      },
      ERROR_CODE: {
        '14021000': '通过指定类型分页获取评论列表错误!'
      }
    }
  });
});