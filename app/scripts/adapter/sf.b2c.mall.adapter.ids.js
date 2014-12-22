'use strict';

// @description 申请命名空间
sf.util.namespace('b2c.mall.adapter.ids');

sf.b2c.mall.adapter.ids = can.Map.extend({

  format: function (data) {
    var that = this;
    _.each(data, function(value, key, list){
      that.attr(key, value);
    });
  },

  get: function (index) {
    return this.idList.attr(index);
  },

  getById: function (recId) {
    var idList = this.idList.attr();
    return _.findWhere(idList, { recId: recId });
  }
});