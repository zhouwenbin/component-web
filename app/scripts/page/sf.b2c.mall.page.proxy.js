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
            window.name = csrfToken;
            window.location.href = 'about:blank'
          }
        }, 300)
      }

    });
  })