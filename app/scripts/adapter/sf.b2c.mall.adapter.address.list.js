'use strict';

define('b2c.mall.adapter.address.list', ['can'], function(can) {

  /**
   * @class sf.b2c.mall.adapter.address.list
   * @description CityList
   */
  return can.Map.extend({

    init: function(data) {
      this.attr('input', {
        addrId: this.findDefaultAddress()
      });
    },

    findDefaultAddress: function() {
      var address = this.addressList.attr('0');
      return address && address.addrId;
    },

    remove: function(index) {
      this.addressList.removeAttr(index);
    },

    get: function(index) {
      return this.addressList.attr(index);
    },

    length: function() {
      return this.addressList.attr('length');
    }
  })
})