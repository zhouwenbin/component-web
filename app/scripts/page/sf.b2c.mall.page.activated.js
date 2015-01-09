'use strict';

define(
  'sf.b2c.mall.page.activated',
  [
    'jquery',
    'can',
    'underscore',
    'md5',
    'store',
    'sf.b2c.mall.framework.comm',
    'sf.b2c.mall.component.header',
    'sf.b2c.mall.component.footer',
    'sf.b2c.mall.api.user.mailRegister',
    'sf.b2c.mall.business.config'
  ],
  function ($, can, _, md5, store, SFFrameworkComm, SFHeader, SFFooter, SFApiUserMailRegister, SFBizConf) {

    SFFrameworkComm.register(1);

    var ERROR_PASSWORD = '密码请设置6-18位字母、数字或标点符号';
    var ERROR_NOT_SAME = '两次填写的密码不一致';
    var ERROR_REGISTER_MAP = {
      '1000020':   '账户已注册',
      '1000050':   '邮箱地址错误',
      '1000070':   '参数错误',
      '1000120':   '链接已过期',
      '1000130':   '签名验证失败'
    }

    var PageMailActivated = can.Control.extend({
      init: function () {
        this.component = {};
        this.component.mailRegister = new SFApiUserMailRegister();
        this.paint();
      },

      paint: function () {
        this.component.header = new SFHeader('.sf-b2c-mall-header');
        this.component.footer = new SFFooter('.sf-b2c-mall-footer');

        var params = can.deparam(window.location.search.substr(1));
        this.data = new can.Map({
          link: window.location.search.substr(1),
          email: params.mailId,
          repassword: null,
          password: null,
          errorText: null
        })
        this.render(this.data);
      },

      render: function (data) {
        var templateFn = can.view.mustache(this.template());
        this.element.find('.sf-b2c-mall-content').html(templateFn(data));
      },

      '#input-password focus': function ($element, event) {
        this.data.attr('errorText', null);
      },

      '#input-repassword focus': function ($element, event) {
        this.data.attr('errorText', null);
      },

      '#input-password blur': function ($element, event) {
        var password = this.data.attr('password');

        if (!/^[0-9a-zA-Z~!@#\$%\^&\*\(\)_+=-\|~`,./<>\[\]\{\}]{6,18}$/.test(password)) {
          return this.data.attr('errorText', ERROR_PASSWORD);
        }
      },

      '#input-repassword blur': function ($element, event) {
        var repassword = this.data.attr('repassword');
        var password = this.data.attr('password');

        if (!/^[0-9a-zA-Z~!@#\$%\^&\*\(\)_+=-\|~`,./<>\[\]\{\}]{6,18}$/.test(password)) {
          return this.data.attr('errorText', ERROR_PASSWORD);
        }else if (_.isEmpty(repassword) || password !== repassword) {
          return this.data.attr('errorText', ERROR_NOT_SAME);
        }
      },

      '.btn-send click': function ($element, event) {
        event && event.preventDefault();

        var password = this.data.attr('password');
        var repassword = this.data.attr('repassword');
        var email = this.data.attr('email');
        var linkContent = this.data.attr('link');

        if (!/^[0-9a-zA-Z~!@#\$%\^&\*\(\)_+=-\|~`,./<>\[\]\{\}]{6,18}$/.test(password)) {
          return this.data.attr('errorText', ERROR_PASSWORD);
        }else if (_.isEmpty(repassword) || password !== repassword) {
          return this.data.attr('errorText', ERROR_NOT_SAME);
        }

        this.component.mailRegister.setData({
          mailId: email,
          passWord: md5(password+SFBizConf.setting.md5_key),
          linkContent:  window.decodeURIComponent(linkContent)
        });

        var that = this;
        this.component.mailRegister.sendRequest()
          .done(function (data) {
            if (data.csrfToken) {
              store.set('csrfToken', data.csrfToken);
              window.location.href = 'index.html'
            }
          })
          .fail(function (errorCode) {
            if (_.isNumber(errorCode)) {
              var errorText = ERROR_REGISTER_MAP[errorCode.toString()];
              that.data.attr('errorText', errorText);
            }
          })
      },

      template: function(){
        return '<div class="pb">'+
          '<div class="pm">'+
            '<div class="order verification">'+
              '<h1><span class="icon icon36"></span>恭喜你，账户验证成功，请设置登录密码。</h1>'+
              '<ol>'+
                '<li><label for="">登录邮箱：</label>{{email}}</li>'+
                '<li><label for="password">设置密码：</label><input type="password" class="input" id="input-password" can-value="password" placeholder=""><p>6-18位字母、数字或标点符号</p></li>'+
                '<li><label for="repassword">重输密码：</label><input type="password" class="input" id="input-repassword" can-value="repassword" placeholder=""></li>'+
                '{{#errorText}}<li style="padding-left: 88px;"><span class="icon icon26 error">{{errorText}}</span></li>{{/errorText}}'+
              '</ol>'+

              '<a href="#" class="btn btn-send">确认</a>'+
              '<span class="icon icon28"></span>'+
            '</div>'+
          '</div>'+
        '</div>'
      }
    });

    var pageMailactivated = new PageMailActivated('body');
  });
