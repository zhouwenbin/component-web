// Auto Generated.  DO NOT EDIT!
/**
  * @class sf.b2c.mall.api.commentGoods.publishComment
  * @param  {Object} $
  * @param  {Object} can
  * @param  {Object} _
  * @param  {can.Construct} Comm
  * @param  {Object} SecurityType
  * @return {can.Construct}
  */
define(
'sf.b2c.mall.api.commentGoods.publishComment',
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
      METHOD_NAME: 'commentGoods.publishComment',
      SECURITY_TYPE: SecurityType.UserLogin.name,
      REQUIRED: {
        'commentGoodsInfos': 'json'
      },
      OPTIONAL: {
      },
      VERIFY:{
      },
      ERROR_CODE: {
        '14003000': '发表评论失败',
        '14013000': '您发布的评论含有敏感词!',
        '14029000': '您发布的评论标签含有敏感词!'
      }
    }
  });
});