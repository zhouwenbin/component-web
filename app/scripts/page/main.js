'use strict';

sf.util.namespace('b2c.mall.launcher.home');

sf.b2c.mall.launcher.home = can.Control.extend({

  init: function(element, options) {
    this.render();
    this.supplement();
  },

  render: function() {
    new sf.b2c.mall.header('.sf-b2c-mall-header');
    new sf.b2c.mall.footer('.sf-b2c-mall-footer');

    new sf.b2c.mall.component.nav.search('.sf-b2c-mall-nav');

    can.when(sf.b2c.mall.model.adv.findSlidesAll())
      .then(function(slides) {

        new sf.b2c.mall.component.slide('.sf-b2c-mall-component-slide', {
          data: slides
        });

        new sf.b2c.mall.banner.promise('.sf-b2c-mall-banner-promise');

        new sf.b2c.mall.component.category('.sf-b2c-mall-component-category');

      });
  },

  supplement: function () {
      $(".content1-right").slide({
          titCell:".hd ul",
          mainCell:".bd ul",
          autoPage:true,
          effect:"left",
          scroll:4,
          vis:4
      });
  }
});

new sf.b2c.mall.launcher.home('#content');