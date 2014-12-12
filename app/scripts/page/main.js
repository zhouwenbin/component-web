'use strict';

require(['can', 'sf.b2c.mall.header', 'sf.b2c.mall.footer', 'sf.b2c.mall.limitedtimesale', 'sf.b2c.mall.rapidseabuy'], function(can, Header, Footer, LimitedTimeSale, RapidSeaBuy) {

  var home = can.Control.extend({

    init: function(element, options) {
      this.render();
      this.supplement();
    },

    render: function() {

      new Header('.sf-b2c-mall-header');
	  new footer('.sf-b2c-mall-footer');
      new LimitedTimeSale('.sf-b2c-mall-limitedtimesale');
      new RapidSeaBuy('.sf-b2c-mall-rapidseabuy');
    },

    supplement: function() {

    }
  });

  new home('#content');
});