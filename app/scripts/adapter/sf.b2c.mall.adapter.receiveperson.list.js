'use strict';

define('sf.b2c.mall.adapter.receiveperson.list', ['can'], function(can) {
  return can.Map({

    init: function(data) {
      this.attr('input', {
        recId: this.findDefaultPerson()
      });
    },

    findDefaultPerson: function() {
      if (this.personList) {
        var address = this.personList.attr('0');
        return address && address.addrId;
      }
    },

    remove: function(index) {
      this.personList.removeAttr(index);
    },

    get: function(index) {
      return this.personList.attr(index);
    },

    length: function() {
      return this.personList.attr('length');
    }
  })
})