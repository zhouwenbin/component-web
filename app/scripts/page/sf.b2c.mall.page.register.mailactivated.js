'use strict';

define(
  'sf.b2c.mall.page.register.mailactivated',
  [
    'jquery',
    'can',
    'underscore',
    'sf.b2c.mall.framework.comm'
  ],
  function ($, can, _, SFFrameworkComm) {

    SFFrameworkComm.register(1);

    var PageMailActivated = can.Control.extend({
      init: function () {

      },

      '#btn-register click': function ($element, event) {
        var password = this.element.find('#password');
        var repeatpassword = this.element.find('#repeatpassword');
      }
    });

    var pageMailactivated = new PageMailActivated('body');


  });
