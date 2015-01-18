// Auto Generated.  DO NOT EDIT!
/**
  * @class sf.b2c.mall.api.user.federatedLogin
  * @param  {Object} $
  * @param  {Object} can
  * @param  {Object} _
  * @param  {can.Construct} Comm
  * @param  {Object} SecurityType
  * @return {can.Construct}
  */
define(
'sf.b2c.mall.api.user.federatedLogin',
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
      METHOD_NAME: 'user.federatedLogin',
      SECURITY_TYPE: SecurityType.None.name,
      REQUIRED: {
        'reqParas': 'string'
      },
      OPTIONAL: {
      },
      VERIFY:{
      },
      ERROR_CODE: {
        '1000130': '签名验证失败',
        '1000210': '校验第三方accessToken失败',
        '1000220': '不支持非门店账户下单or非门店下单'
      }
    }
  });
});