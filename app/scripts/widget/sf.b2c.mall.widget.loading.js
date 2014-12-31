'use strict';

define(
  'sf.b2c.mall.widget.loading',

  [
    'jquery',
    'can'
  ],

  function($, can) {
    return can.Control.extend({

      init: function() {

      },

      render: function() {
        var html = can.view('templates/widget/sf.b2c.mall.widget.loading.mustache', {});
        this.element.html(html);
      },

      show: function() {
        this.render();
        this.bind();
      },

      hide: function() {
        this.unbind();
        this.element.empty();
      },

      loading: function() {
        this.element.find('.icon-loading1').animate({
          'height': '156px'
        }, 2000, 'linear', function() {
          $(this).height(0);
        });
      },

      bind: function() {
        this.loading();
        this.handler = setInterval(_.bind(this.loading, this), 2000);
      },

      unbind: function() {
        if (this.handler) {
          clearInterval(this.handler);
        }
      }
    });
  })