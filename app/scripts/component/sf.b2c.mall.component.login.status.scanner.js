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
        if (window.postMessage) {
          this.setPostMesageScanner();
        }else{
          this.setWindowNameScanner()
        }
      },

      setCsrfToken: function (evet) {
        if (event) {
          try{
            var info = JSON.parse(event.data);
            var ocsrfToken = store.get('csrfToken');
            if (ocsrfToken != info.csrfToken) {
              store.set('csrfToken', info.csrfToken);
            }
          }catch(e){

          }
        }
      },

      setPostMesageScanner: function () {
        window.onmessage = this.setCsrfToken;
        // $(window).on('message', this.setCsrfToken);
        // if (window.addEventListener) {
        //   window.addEventListener("message", this.setCsrfToken, false);
        // }else {
        //   window.attachEvent("message", this.setCsrfToken);
        // }
      },

      setWindowNameScanner: function () {
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