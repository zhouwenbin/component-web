// Auto Generated.  DO NOT EDIT!
/**
  * @class sf.b2c.mall.api.llorder.customerSubmitOrder
  * @param  {Object} $
  * @param  {Object} can
  * @param  {Object} _
  * @param  {can.Construct} Comm
  * @param  {Object} SecurityType
  * @return {can.Construct}
  */
define(
'sf.b2c.mall.api.llorder.customerSubmitOrder',
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
      METHOD_NAME: 'llorder.customerSubmitOrder',
      SECURITY_TYPE: SecurityType.UserLogin.name,
      REQUIRED: {
        'snapshotProducts': 'json',
        'snapshotRecAddress': 'json',
        'snapshotReceiver': 'json'
      },
      OPTIONAL: {
      },
      VERIFY:{
      },
      ERROR_CODE: {
      }
    }
  });
});