define(
  'sf.b2c.mall.component.login.status.scanner',
  [
    'jquery',
    'can',
    'underscore',
    'store'
  ],

  function ($, can, _, store) {

    return can.Control.extend({

      init: function (element, options) {
        this.userLogin = false;
        this.insertScanner();
        this.setScanner();
      },

      insertScanner: function () {
        if ($('#proxy').length == 0) {
          $('body').append('<iframe id="proxy" src="http://www.sfht.com/proxy.html" style="display:none;"></iframe>')
        }
      },

      setScanner: function () {
        var that = this;
        this.handler = setInterval(function () {
          try{
            var csrfToken = $('#proxy').get(0) && $('#proxy').get(0).contentWindow.name;
            if(csrfToken){
              store.set('csrfToken', csrfToken);
              if (that.handler) {
                clearInterval(that.handler);
              }

              if (this.userStatus != true && _.isFunction(that.options.changeStatus)) {
                that.options.changeStatus(true);
              }
            }
          }catch(e){

          }
        }, 300);
      }

    });
  })