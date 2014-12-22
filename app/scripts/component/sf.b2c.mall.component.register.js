'use strict';

define(

  'sf.b2c.mall.component.register',

  [
    'jquery',
    'can',
    'md5',
    'underscore'
  ],

  function ($, can, md5, _) {

    return can.Control.extend({

      init: function (element, event) {
        this.data = new can.Map({
          mobile: true,
          mail: false
        });

        this.render(this.data);
      },

      render: function (data) {
        var html = can.view('templates/component/sf.b2c.mall.component.register.mustache', data);
        this.element.append(html)
        this.element.find('.register').fadeIn('slow');
      },

      switchTag: function (tag) {
        var that = this;
        _.each(this.data.attr(), function(value, key){
          that.data.attr(key, false);
        });

        this.data.attr(tag, true);
      },

      '.register-h ul li click': function ($element, event) {
        event && event.preventDefault();

        var tag = $element.data('tag');
        this.switchTag(tag);
      }

    });

  });