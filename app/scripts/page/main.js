'use strict';

require(['can', 'sf.b2c.mall.header', 'sf.b2c.mall.footer'], function(can, header, footer) {

  var home = can.Control.extend({

    init: function(element, options) {
      this.render();
      this.supplement();
    },

    render: function() {

      new header('.sf-b2c-mall-header');
      new footer('.sf-b2c-mall-footer');
    },

    supplement: function() {

    }
  });

  new home('#content');
});