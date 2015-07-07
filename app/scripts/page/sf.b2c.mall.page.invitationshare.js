'use strict';

define(
  'sf.b2c.mall.page.invitationshare', [
    'can',
    'jquery',
    'sf.b2c.mall.framework.comm',
    'sf.b2c.mall.component.header',
    'sf.b2c.mall.component.footer',
    'sf.b2c.mall.business.config',
    'text!template_center_invitationshare',
    'qrcode',
    'sf.b2c.mall.api.user.getUserInfo'
  ],

  function(can, $, SFFrameworkComm, Header, Footer, SFBusiness, template_center_invitationshare, qrcode, SFGetUserInfo) {

    SFFrameworkComm.register(1);

    var orderList = can.Control.extend({

      helpers: {
        isLogin: function(options) {
          if (SFFrameworkComm.prototype.checkUserLogin.call(this)) {
            return options.fn(options.contexts || this);
          } else {
            return options.inverse(options.contexts || this);
          }
        }
      },

      /**
       * [init 初始化]
       * @param  {[type]} element 元素
       * @param  {[type]} options 选项
       */
      init: function(element, options) {
        this.render();
      },

      /**
       * [render 执行渲染]
       */
      render: function() {
        this.header = new Header('.sf-b2c-mall-header', {
          channel: '首页'
        });
        new Footer('.sf-b2c-mall-footer');

        var params = can.deparam(window.location.search.substr(1));

        this.data = {};
        this.data.bagid = params.bagid;

        var renderFn = can.mustache(template_center_invitationshare);
        this.options.html = renderFn(this.data, this.helpers);
        this.element.html(this.options.html);

        this.supplement();

        if (!SFFrameworkComm.prototype.checkUserLogin.call(this)) {
          this.header.showLogin();
        }
      },

      supplement: function() {
        if (SFFrameworkComm.prototype.checkUserLogin.call(this)) {
          this.renderQrcode();
        }
      },

      /** 渲染二维码 */
      renderQrcode: function() {
        var getUserInfo = new SFGetUserInfo();
        getUserInfo.sendRequest()
          .done(function(userinfo) {
            var qrParam = {
              width: 125,
              height: 125,
              text: "http://m.sfht.com?_src=" + userinfo.userId
            };

            $('#shareURLQrcode').html("").qrcode(qrParam);
            $('#urlinput').val(window.location.href + "?_src=" + userinfo.userId);
          })
          .fail()
      },

      '#gotohome click': function() {
        window.location.href = "http://www.sfht.com";
      },

      "#logintoShare click": function(element, event) {
        event && event.preventDefault();

        if (!SFFrameworkComm.prototype.checkUserLogin.call(this)) {
          this.header.showLogin(window.location.href);
          return false;
        }

      }
    });

    new orderList('.sf-b2c-mall-invitationshare');
  });