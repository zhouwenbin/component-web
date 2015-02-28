define(
  'sf.b2c.mall.page.federal.login',

  [
    'jquery',
    'can',
    'store',
    'sf.b2c.mall.framework.comm',
    'sf.b2c.mall.api.user.federatedLogin',
    'sf.b2c.mall.business.config'
  ],

  function ($, can, store, SFFrameworkComm, SFApiUserFederatedLogin) {

    SFFrameworkComm.register(1);

    var Launcher = can.Control.extend({

      init: function () {
        this.component = {};
        this.component.federatedLogin = new SFApiUserFederatedLogin();
        this.request();
      },

      request: function () {
        var params = can.deparam(window.location.search.substr(1));

        this.component.federatedLogin.setData({
          reqParas: window.location.search.substr(1)
        });

        this.component.federatedLogin
          .sendRequest()
          .done(function (data) {
            if (data && data.csrfToken) {
              store.set('csrfToken', data.csrfToken);
              window.location.href = data.redirectUrl;
            }
          })
          .fail(function (errorCode) {
            window.location.href = 'error.html'
          });
      }
    });

    new Launcher();
  });