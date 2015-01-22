// Auto Generated.  DO NOT EDIT!
/**
  * @class sf.b2c.mall.api.user.createReceiverInfo
  * @param  {Object} $
  * @param  {Object} can
  * @param  {Object} _
  * @param  {can.Construct} Comm
  * @param  {Object} SecurityType
  * @return {can.Construct}
  */
define(
'sf.b2c.mall.api.user.createReceiverInfo',
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
      METHOD_NAME: 'user.createReceiverInfo',
      SECURITY_TYPE: SecurityType.UserLogin.name,
      REQUIRED: {
        'recName': 'string',
        'type': 'string',
        'credtNum': 'string',
      },
      OPTIONAL: {
        'credtImgUrl1': 'string',
        'credtImgUrl2': 'string',
        'partnerId': 'string'
      },
      VERIFY:{
      },
      ERROR_CODE: {
        '1000070': '参数错误',
        '1000200': '收货人身份信息已存在，选择即可',
        '1000230': '手机号错误，请输入正确的手机号',
        '1000280': '身份证号码错误',
        '1000310': '已达到最大允许数目'
      }
    }
  });
});