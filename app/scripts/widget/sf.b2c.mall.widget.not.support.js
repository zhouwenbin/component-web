define(
  'sf.b2c.mall.widget.not.support',

  [
    'jquery',
    'can'
  ],

  function ($, can) {

    return can.Control.extend({

      init:function  () {

        if(this.isIE(6) || this.isIE(7)){
          this.render();
        }
      },

      //判断浏览器是IE几
      isIE:function(ver){
        var b = document.createElement('b');
        b.innerHTML = '<!--[if IE ' + ver + ']><i></i><![endif]-->';
        return b.getElementsByTagName('i').length === 1;
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