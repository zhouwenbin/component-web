'use strict';

define(
  'sf.b2c.mall.page.register.mailactivated',
  [
    'jquery',
    'can',
    'underscore'
  ],
  function ($, can, _) {

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
