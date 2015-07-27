// Auto Generated.  DO NOT EDIT!
/**
  * @class sf.b2c.mall.api.integral.checkInV2
  * @param  {Object} $
  * @param  {Object} can
  * @param  {Object} _
  * @param  {can.Construct} Comm
  * @param  {Object} SecurityType
  * @return {can.Construct}
  */
define(
'sf.b2c.mall.api.integral.checkInV2',
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
      METHOD_NAME: 'integral.checkInV2',
      SECURITY_TYPE: SecurityType.UserLogin.name,
      REQUIRED: {
        'channel': 'string'
      },
      OPTIONAL: {
      },
      VERIFY:{
      },
      ERROR_CODE: {
        '16000001': '超过每日限制次数',
        '16000012': '没有在线的签到活动',
        '16000099': '系统未知异常'
      }
    }
  });
});