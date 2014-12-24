'use strict';

define('sf.b2c.mall.adapter.order', ['can'], function(can) {
  return can.Map({

    format: function(data) {
      var that = this;

      _.each(data, function(value, key, list) {
        that.attr(key, value);
      });

      return that;
    }
  })
})