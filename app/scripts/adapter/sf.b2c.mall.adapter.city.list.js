'use strict';

// @description 申请命名空间
sf.util.namespace('b2c.mall.adapter.city.list');

/**
 * @class sf.b2c.mall.adapter.city.list
 * @author Michael.Lee (leewind19841209@gmail.com)
 * @description CityList
 */
sf.b2c.mall.adapter.city.list = can.Map.extend({

  init: function (data) {
    this.format(data);
  },

  replace: function (data) {
    this.attr(null);
    this.attr(data);
  },

  select: function (tag, id) {
    var data = _.where(this.backup, { superregion_id: window.parseInt(id) });
    this.attr(tag, data);
  },

  findOne: function (id) {
    return _.findWhere(this.backup, {id: window.parseInt(id)});
  },

  format: function (data) {
    var provinces = _.where(data, { superregion_id: 0 });
    var backup = data;

    this.replace({
      countries: [{
        id: 0,
        name: '中国',
        superregion_id: -1
      }],
      provinces: provinces,
      backup: backup
    });
  }

});