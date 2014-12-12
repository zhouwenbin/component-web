'use strict';

// @description 申请命名空间
sf.util.namespace('b2c.mall.adapter.address.list');

/**
 * @class sf.b2c.mall.adapter.address.list
 * @author Michael.Lee (leewind19841209@gmail.com)
 * @description CityList
 */
sf.b2c.mall.adapter.address.list = can.Map.extend({

  init: function (data) {
    this.attr('input', {
      addrId: this.findDefaultAddress()
    });
  },

  findDefaultAddress: function () {
    var address = this.addressList.attr('0');
    return address && address.addrId;
  },

  remove: function (index) {
    this.addressList.removeAttr(index);
  },

  get: function (index) {
    return this.addressList.attr(index);
  },

  length: function () {
    return this.addressList.attr('length');
  }

});