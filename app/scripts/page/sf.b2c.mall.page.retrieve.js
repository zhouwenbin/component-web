'use strict';

define(
  'sf.b2c.mall.page.retrieve',

  [
    'jquery',
    'can',
    'underscore',
    'sf.b2c.mall.framework.comm',
    'sf.b2c.mall.component.header',
    'sf.b2c.mall.component.footer',
    'sf.b2c.mall.component.retrieve',
    'sf.b2c.mall.business.config'
  ],

  function ($, can, _, SFFrameworkComm, SFHeader, SFFooter, SFRetrieve) {

    SFFrameworkComm.register(1);

    var PageRetrieve = can.Control.extend({

      init: function () {
        this.component = {};
        this.paint();
      },

      paint: function () {
        this.component.header = new SFHeader('.sf-b2c-mall-header');
        this.component.footer = new SFFooter('.sf-b2c-mall-footer');
        this.component.retrieve = new SFRetrieve('.sf-b2c-mall-content');
      }
    });

    var pageRetireve = new PageRetrieve('body');

  })