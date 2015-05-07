define(
  'sf.b2c.mall.widget.modal',
  [
    'jquery',
    'underscore',
    'can'
  ],

  function ($, _, can) {
    return can.Control.extend({

      init: function (element, options) {
        // this.modalid = Date.now();
        this.modalid =  new Date().valueOf();
      },

      show: function (data) {
        data = _.extend(data, {id: this.modalid});
        var template = can.view.mustache((data && data.template) || this.template())
        this.element.append(template(data || this.options));
        this.element.find('.modal#'+this.modalid+' .mask').show();
      },

      hide: function () {
        var $el = this.element.find('#'+this.modalid);
        if ($el) {
          $el.remove();
        }
        this.closed = true;
      },

      isClosed: function () {
        return this.closed;
      },

      template: function () {
        return  '<div class="modal" id="{{id}}">' +
                  '<div class="mask"></div>' +
                  '<div class="register">' +
                    '<div class="register-h">' +
                      '<h2>{{title}}</h2>' +
                      '<a href="#" class="btn btn-close">关闭</a>'+
                    '</div>' +
                    '<div class="">' +
                      '{{&html}}' +
                    '</div>' +
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