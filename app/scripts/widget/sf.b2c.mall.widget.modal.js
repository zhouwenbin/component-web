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
        this.closed = true;
      },

      isClosed: function () {
        return this.closed;
      },

      template: function () {
        return  '<div class="mask"></div>' +
                '<div class="register">' +
                  '<div class="register-h">' +
                    '<h2>{{title}}</h2>' +
                    '<a href="#" class="btn btn-close">关闭</a>'+
                    '<span class="icon icon34"></span>'+
                    '<span class="icon icon35"></span>'+
                  '</div>' +
                  '<div class="">' +
                    '{{&html}}' +
                  '</div>' +
                '</div>'
      },

      '.btn-close click': function (element, event) {
        event && event.preventDefault();
        this.hide();
      },

      setTitle: function (title) {
        this.element.find('.register-h h2').text(title)
      }
    })
  })