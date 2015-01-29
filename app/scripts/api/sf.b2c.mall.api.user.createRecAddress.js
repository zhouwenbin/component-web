// Auto Generated.  DO NOT EDIT!
/**
  * @class sf.b2c.mall.api.user.createRecAddress
  * @param  {Object} $
  * @param  {Object} can
  * @param  {Object} _
  * @param  {can.Construct} Comm
  * @param  {Object} SecurityType
  * @return {can.Construct}
  */
define(
'sf.b2c.mall.api.user.createRecAddress',
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
      METHOD_NAME: 'user.createRecAddress',
      SECURITY_TYPE: SecurityType.UserLogin.name,
      REQUIRED: {
        'nationName': 'string',
        'provinceName': 'string',
        'cityName': 'string',
        'regionName': 'string',
        'detail': 'string',
        'cellphone': 'string',
      },
      OPTIONAL: {
        'zipCode': 'string',
        'recName': 'string',
        'recId': 'long',
        'partnerId': 'string'
      },
      VERIFY:{
      },
      ERROR_CODE: {
        '1000070': '参数错误',
        '1000310': '已达到最大允许数目'
      }
    }
  });
});