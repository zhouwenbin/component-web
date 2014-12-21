define(
  'sf.b2c.mall.widget.modal',
  [
    'jquery',
    'can'
  ],

  function ($, can) {
    return can.Control.extend({

      init: function (element, options) {

      },

      show: function (data) {
        var template = can.view.mustache(this.template())
        this.element.append(template(data || this.options));
      },

      hide: function () {
        this.element.find('.mask').remove();
        this.element.find('.register').remove();
      },

      template: function () {
        return  '<div class="mask"></div>' +
                '<div class="register">' +
                  '<div class="register-h">' +
                    '<h2>{{title}}</h2>' +
                    '<a href="#" class="btn btn-close">关闭</a>'+
                  '</div>' +
                  '<div class="">' +
                    '{{&html}}' +
                  '</div>' +
                '</div>'
      },

      '.btn-close click': function (element, event) {
        event && event.preventDefault();
        this.hide();
      }
    })
  })