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
        'recId': 'long'
      },
      VERIFY:{
      },
      ERROR_CODE: {
        '1000070': '参数错误'
      }
    }
  });
});