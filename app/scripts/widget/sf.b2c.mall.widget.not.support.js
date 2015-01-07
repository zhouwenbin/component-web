define(
  'sf.b2c.mall.widget.not.support',

  [
    'jquery',
    'can'
  ],

  function ($, can) {

    return can.Control.extend({

      init:function  () {

        var isIE = !!window.ActiveXObject;
        var isIE6 = isIE&&!window.XMLHttpRequest;
        var isIE8 = isIE&&!!document.documentMode;
        var isIE7 = isIE&&!isIE6&&!isIE8;

        if (isIE6 || isIE7) {
          this.render();
        }
      },

      '.btn-close click': function ($element, event) {
        $('.u-dialog-browser').remove();
        $('.mask').remove()
      },

      render: function () {
        var html = can.view('templates/widget/sf.b2c.mall.widget.not.support.mustache', {});
        this.element.prepend(html);
      }
    })
  })