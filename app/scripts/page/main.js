'use strict';

define('b2c.mall.launcher.home', ['can'], function(can) {debugger;

  var header = can.Control.extend({

    init: function(element, options) {
      this.render();
      this.supplement();
    },

    render: function() {
      new sf.b2c.mall.header('.sf-b2c-mall-header');
    },

    supplement: function() {

    }
  });

  new header('#content');
});