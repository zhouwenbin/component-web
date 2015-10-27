// Auto Generated.  DO NOT EDIT!
/**
  * @class sf.b2c.mall.api.finance.createRefundTax
  * @param  {Object} $
  * @param  {Object} can
  * @param  {Object} _
  * @param  {can.Construct} Comm
  * @param  {Object} SecurityType
  * @return {can.Construct}
  */
define(
'sf.b2c.mall.api.finance.createRefundTax',
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
      METHOD_NAME: 'finance.createRefundTax',
      SECURITY_TYPE: SecurityType.UserLogin.name,
      REQUIRED: {
        'bizId': 'string',
        'masterBizId': 'string',
        'mailNo': 'string',
        'buyerName': 'string',
        'buyerTelephone': 'string',
        'alipayAccount': 'string',
        'alipayUserName': 'string',
        'url': 'string'
      },
      OPTIONAL: {
      },
      VERIFY:{
      },
      ERROR_CODE: {
        '12100000': '财务系统内部异常',
        '12110000': '该订单已提交过退税申请'
      }
    }
  });
});