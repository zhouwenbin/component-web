'use strict';

define('sf.b2c.mall.adapter.regions', ['can'], function(can) {
  return can.Map({

    findOne: function(id) {
      var cityList = this.attr('cityList');
      return _.findWhere(cityList, {
        id: id
      });
    },

    findGroup: function(id) {
      var cityList = this.attr('cityList');
      return _.filter(cityList, function(value, key, list) {
        return value.superregion_id == id;
      });
    },

    getIdByName: function(name) {
      var cityList = this.cityList.attr();
      var address = _.findWhere(cityList, {
        name: name
      });
      return address.id;
    },

    getIdBySuperreginIdAndName: function(superregionId, name) {
      var cityList = this.cityList.attr();
      var address = _.findWhere(cityList, {
        superregion_id: superregionId,
        name: name
      });
      return address.id;
    },

    getGroupByName: function(name) {
      var id = this.getIdByName(name);
      return this.findGroup(id);
    },

    findOneName: function(id) {
      if (id && this.findOne(id)) {
        var o = this.findOne(id);
        return o.name;
      }
    }
  })
})