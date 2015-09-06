// Auto Generated.  DO NOT EDIT!
/**
  * @class sf.b2c.mall.api.user.updateRecAddress
  * @param  {Object} $
  * @param  {Object} can
  * @param  {Object} _
  * @param  {can.Construct} Comm
  * @param  {Object} SecurityType
  * @return {can.Construct}
  */
define(
'sf.b2c.mall.api.user.updateRecAddress',
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
      METHOD_NAME: 'user.updateRecAddress',
      SECURITY_TYPE: SecurityType.UserLogin.name,
      REQUIRED: {
        'addrId': 'long',
      },
      OPTIONAL: {
        'nationName': 'string',
        'provinceName': 'string',
        'cityName': 'string',
        'regionName': 'string',
        'detail': 'string',
        'zipCode': 'string',
        'cellphone': 'string',
        'recName': 'string',
        'recId': 'long',
        'type': 'string',
        'credtNum': 'string'
      },
      VERIFY:{
      },
      ERROR_CODE: {
        '1000230': '手机号错误，请输入正确的手机号',
        '1000280': '身份证号码错误',
        '1000332': '输入的邮编错误',
        '1000490': '海关发货需要实名制信息，请输入真实姓名'
      }
    }
  });
});