/**
  * @class sf.b2c.mall.api.shopcart.isShowCart
  * @param  {Object} $
  * @param  {Object} can
  * @param  {Object} _
  * @param  {can.Construct} Comm
  * @param  {Object} SecurityType
  * @return {can.Construct}
  */
define(
'sf.b2c.mall.api.shopcart.isShowCart',
[
  'jquery',
  'can',
  'underscore',
  'sf.b2c.mall.framework.comm',
  'sf.b2c.mall.api.security.type'
],
function($, can, _, Comm, SecurityType) {
  'use strict';

  return can.Control.extend({

    init: function () {

    },

    sendRequest: function () {
      var def = can.Deferred();
      def.resolve({value: true});
      return def;
    }

  });
});