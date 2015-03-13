// Auto Generated.  DO NOT EDIT!
/**
  * @class sf.b2c.mall.api.user.updateReceiverInfo
  * @param  {Object} $
  * @param  {Object} can
  * @param  {Object} _
  * @param  {can.Construct} Comm
  * @param  {Object} SecurityType
  * @return {can.Construct}
  */
define(
'sf.b2c.mall.api.user.updateReceiverInfo',
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
      METHOD_NAME: 'user.updateReceiverInfo',
      SECURITY_TYPE: SecurityType.UserLogin.name,
      REQUIRED: {
        'recId': 'long',
      },
      OPTIONAL: {
        'recName': 'string',
        'type': 'string',
        'credtNum': 'string',
        'credtImgUrl1': 'string',
        'credtImgUrl2': 'string'
      },
      VERIFY:{
      },
      ERROR_CODE: {
        '1000200': '收货人身份信息已存在，选择即可',
        '1000280': '身份证号码错误'
      }
    }
  });
});