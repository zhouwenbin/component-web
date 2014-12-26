'use strict';

define(
  'sf.b2c.mall.page.register.checklink',
  [
    'jquery',
    'can',
    'underscore',
    'sf.b2c.mall.framework.comm',
    'sf.b2c.mall.api.user.checkLink'
  ],
  function ($, can, _, SFFrameworkComm, SFApiUserChecklink) {
    SFFrameworkComm.register(1);

    var ERROR_MAP = {
      '1000120' :  '链接已过期',
      '1000130' :  '签名验证失败'
    }

    can.route.ready();
    var PageRegisterCheckLink = can.Control.extend({
      init: function () {
        this.component = {}
        this.component.checklink = new SFApiUserChecklink();

        var params = can.deparam(window.location.search.substr(1));
        var tag = route.attr('tag');
        this.act(tag);
      },

      actionMap: {
        'confirminfo': function(){
          this.component.checklink.setData({
            linkContent: window.location.href
          });

          this.component.checklink.sendRequest()
            .done(function (data) {
              if (data.value) {
                window.location.href = 'register.mail.acticated.html';
              }
            })
            .fail(function (errorCode) {
              if (_.isNumber(errorCode)) {
                alert("@todo error:"+ERROR_MAP[errorCode]);
              }
            })
        }
      },

      act: function (tag) {
        var fn = this.actionMap[tag];
        fn.call(this);
      }
    });

    var pageloader = new PageRegisterCheckLink();
  });
