//绑定账号js
'use strict'

define(
  'sf.b2c.mall.component.bindaccount', [
    'jquery',
    'can',
    'store',
    'sf.b2c.mall.business.config',
    'sf.util',
    'sf.b2c.mall.api.user.partnerBind'
  ],
  function($, can, store,SFConfig, SFFn, SFPartnerBind) {

    var ERROR_NO_INPUT_USERNAME = '请输入您的常用手机号';
    var ERROR_INPUT_USERNAME = '手机号输入有误，请重新输入';

    var DEFAULT_BIND_ERROR_MAP = {
      '1000020':   '手机账号已存在，<a href="login.html">立即登录</a>',
      '1000350':   '验证临时token失败,请重新登录',
      '1000360':   '第三方账户已绑定海淘账户'
    };

    return can.Control.extend({
      helpers: {
        ismobile: function(mobile, options) {
          if (mobile() == 'mobile') {
            return options.fn(options.contexts || this);
          } else {
            return options.inverse(options.contexts || this);
          }
        }
      },

      init: function() {
        var params = can.deparam(window.location.search.substr(1));
        this.data = new can.Map({
          username: null,
          platform: params.platform || (SFFn.isMobile.any() ? 'mobile' : null),
        });

        this.render(this.data);

      },

      render: function(data) {
        var template = can.view.mustache(this.bindAccountTemplate());
        this.element.append(template(data, this.helpers));
      },

      bindAccountTemplate: function() {
        return '{{! <div class="mask"></div> }}' +
          '<div class="register {{^ismobile platform}}register-top{{/ismobile}}">' +
          '{{!   <div class="register-h">' +
          '<h2>绑定手机账号</h2>' +
          '<a href="#" class="btn btn-close">关闭</a>' +
          '<span class="icon icon34"></span>' +
          '<span class="icon icon35"></span>' +
          '</div> }}' +
          '<div class="register-b register-b3 register-main active">' +
          '<form action="">' +
          '<ol>' +
          '<li>' +
          '<input id="user-name" type="text" class="input-username" placeholder="手机号" can-value="username" />' +
          '<span id="username-error-tips" class="icon icon26"></span>' +
          '</li>' +
          '</ol>' +
          '<div class="register-br1">' +
          '<button id="bindaccount" type="submit" class="btn btn-register btn-send">确定</button>' +
          '</div>' +
          '</form>' +
          '</div>' +
          '</div>';
      },
      '#bindaccount click': function(element,event) {
        event && event.preventDefault();
        var telNum = this.data.attr('username');
        var isTelNum = /^1\d{10}$/.test(telNum);
        if (!telNum) {
          $('#username-error-tips').text(ERROR_NO_INPUT_USERNAME).show();
          return false;
        } else if (!isTelNum) {
          $('#username-error-tips').text(ERROR_INPUT_USERNAME).show();
          return false;
        }

        var partnerBind = new SFPartnerBind({
          'tempToken': store.get('tempToken'),
          'type': 'MOBILE',
          'accountId': telNum
        });
        partnerBind.sendRequest()
          .done(function(data){
            store.set('csrfToken',data.csrfToken);
            store.remove('tempToken');
          }).fail(function(errorCode){
            if (_.isNumber(errorCode)) {
                var defaultText = '绑定失败';
                var errorText = DEFAULT_BIND_ERROR_MAP[errorCode.toString()] || defaultText;
                if (errorCode === 1000020) {
                  $('#username-error-tips').html(errorText).show();
                }else{
                  $('#username-error-tips').html(errorText).show();
                }
              }
          })

      }
    });
  })