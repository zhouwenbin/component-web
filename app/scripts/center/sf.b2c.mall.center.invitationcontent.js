'use strict';

define('sf.b2c.mall.center.invitationcontent', [
    'can',
    'jquery',
    'qrcode',
    'sf.helpers',
    'sf.b2c.mall.widget.message',
    'sf.b2c.mall.business.config',
    'sf.b2c.mall.component.bindalipay',
    'sf.b2c.mall.api.user.getUserInfo',
    'text!template_center_invitationcontent'
  ],
  function(can, $, qrcode, helpers, SFMessage, SFConfig, SFBindalipay, SFGetUserInfo, template_center_invitationcontent) {

    return can.Control.extend({

      init: function(element, options) {
        this.render();
      },

      render: function() {
        var data = {};

        var renderFn = can.mustache(template_center_invitationcontent);
        this.options.html = renderFn(data, this.helpers);
        this.element.html(this.options.html);
        this.supplement();
      },

      supplement: function() {
        this.renderQrcode();
      },

      /** 渲染二维码 */
      renderQrcode: function() {
        var getUserInfo = new SFGetUserInfo();
        getUserInfo.sendRequest()
          .done(function(userinfo) {
            var url = "http://www.sfht.com?src=" + userinfo.userId;
            var qrParam = {
              width: 140,
              height: 140,
              text: url
            };

            $('#shareURLQrcode').html("").qrcode(qrParam);
            $('#urlinput').val(url);
          })
          .fail()
      },

      '#getmoney click': function(element, event) {
        var isBindAlipay = false;
        // 您的账户余额少于50元，无法提现
        new SFBindalipay();
      }

    });
  })