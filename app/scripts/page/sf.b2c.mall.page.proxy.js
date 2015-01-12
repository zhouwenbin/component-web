define(
  'sf.b2c.mall.page.proxy',
  [
    'jquery',
    'can',
    'store'
  ],

  function ($, can, store) {
    var scanner = can.Control.extend({

      init: function (element, options) {
        setInterval(function () {
          var csrfToken = store.get('csrfToken')
          if (csrfToken) {
            if (window.postMessage) {
              window.parent.postMessage(JSON.stringify({csrfToken: csrfToken}),'*')
            }else{
              window.name = csrfToken;
              window.location.href = 'about:blank'
            }
          }
        }, 500)
      }

    });

    new scanner();
  })