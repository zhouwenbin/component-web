// Auto Generated.  DO NOT EDIT!
/**
  * @class sf.b2c.mall.api.user.getVoteNum
  * @param  {Object} $
  * @param  {Object} can
  * @param  {Object} _
  * @param  {can.Construct} Comm
  * @param  {Object} SecurityType
  * @return {can.Construct}
  */
define(
'sf.b2c.mall.api.user.getVoteNum',
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
      METHOD_NAME: 'user.getVoteNum',
      SECURITY_TYPE: SecurityType.None.name,
      REQUIRED: {
        'voteType': 'string',
      },
      OPTIONAL: {
        'voteNo': 'string'
      },
      VERIFY:{
      },
      ERROR_CODE: {
        '1000460': '投票类型不存在'
      }
    }
  });
});