define(
  'sf.b2c.mall.page.proxy',
  [
    'JSON',
    'jquery',
    'can',
    'store',
    'sf.b2c.mall.business.config'
  ],

  function (JSON, $, can, store) {
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