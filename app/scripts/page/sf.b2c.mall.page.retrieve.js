'use strict';

define(
  'sf.b2c.mall.page.retrieve',

  [
    'jquery',
    'can',
    'underscore',
    'sf.b2c.mall.framework.comm',
    'sf.b2c.mall.component.header',
    'sf.b2c.mall.component.footer'
  ],

  function ($, can, _, SFFrameworkComm, SFHeader, SFFooter) {

    SFFrameworkComm.register(1);

    var PageRetrieve = can.Control.extend({

      init: function () {

      },

      render: function () {
        var html = can.view('templates/component/sf.b2c.mall.component.retrieve.fillinfo.mustache', data);
      },



    })

  })