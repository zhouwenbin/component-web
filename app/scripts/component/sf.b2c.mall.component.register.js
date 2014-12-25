'use strict';

define(

  'sf.b2c.mall.component.register',

  [
    'jquery',
    'can',
    'md5',
    'underscore',
    'placeholders',
    'sf.b2c.mall.api.user.downSmsCode',
    'sf.b2c.mall.api.user.mobileRegister',
    'sf.b2c.mall.business.config'
  ],

  function ($, can, md5, _, placeholders, SFApiUserDownSmsCode, SFApiUserMobileRegister, SFBizConf) {

    var DEFAULT_FILLINFO_TAG = 'fillinfo';
    var DEFAULT_CAPTCHA_LINK = 'http://checkcode.sfht.com/captcha/';
    var DEFAULT_CAPTCHA_ID = 'haitaob2c';
    var DEFAULT_CAPTCHA_HASH = '5f602a27181573d36e6c9d773ce70977';

    can.route.ready();

    return can.Control.extend({

      init: function (element, event) {
        this.component = {};
        this.component.sms = new SFApiUserDownSmsCode();
        this.component.mobileRegister = new SFApiUserMobileRegister();

        this.data = new can.Map({
          mobile: true,
          mail: false,
          timmer: 2
        });

        var tag = can.route.attr('tag') || DEFAULT_FILLINFO_TAG

        this.render(tag, this.data);
      },

      '{can.route} change': function() {
        var tag = can.route.attr('tag') || DEFAULT_FILLINFO_TAG;

        this.render.call(this, tag, this.data);
      },

      renderMap: {
        'fillinfo': function (data) {
          var html = can.view('templates/component/sf.b2c.mall.component.register.fillinfo.mustache', data);
          this.element.html(html)
          this.element.find('.register').fadeIn('slow');
        },

        'success': function(data) {
          var that = this;
          var html = can.view('templates/component/sf.b2c.mall.component.register.success.mustache', data);
          this.element.html(html);
          this.element.find('.register').fadeIn('slow', function () {
            that.timmer.call(that)
          });
        }
      },

      render: function (tag, data) {
        var fn = this.renderMap[tag];
        if (_.isFunction(fn)) {
          fn.call(this, data);
        }
      },

      timmer: function () {
        var that = this;
        setTimeout(function() {
          var timmer = that.data.attr('timmer');
          if (timmer > 0) {
            that.data.attr('timmer', timmer - 1);
            that.timmer.call(that);
          }else{
            // @todo调用onRegistered 回调
            if (_.isFunction(that.options.onRegistered)) {
              that.options.onRegistered();
            }
          }
        }, 1000);
      },

      switchTag: function (tag) {
        var that = this;
        _.each(this.data.attr(), function(value, key){
          that.data.attr(key, false);
        });

        this.data.attr(tag, true);
        if (tag == 'mail') {
          this.getVerifiedCode.call(this);
        }
      },

      checkMobile: function (mobile) {
        if(!/^1[0-9]{10}$/.test(mobile)){
          this.element.find('#input-mobile-error').show();
          return false;
        }else{
          return true;
        }
      },

      checkCode: function (code) {
        var defaultText = '请输入正确的手机验证码';
        if (!/^[0-9]{6}$/.test(code)) {
          this.element.find('#mobile-code-error').text(defaultText).show();
          return false;
        }else{
          return true;
        }
      },

      checkPassword: function (password) {
        if (!/^[0-9a-zA-Z~!@#\$%\^&\*\(\)_+=-\|~`,./<>\[\]\{\}]{6,18}$/.test(password)) {
          this.element.find('#password-error').show();
          return false;
        }else{
          return true;
        }
      },

      checkEmail: function (email) {
        if (!/^([a-zA-Z0-9-_]*[-_\.]?[a-zA-Z0-9]+)*@([a-zA-Z0-9]*[-_]?[a-zA-Z0-9]+)+[\.][a-zA-Z]{2,3}([\.][a-zA-Z]{2})?$/.test(email)) {
          this.element.find('#input-mail-error').text('邮箱地址输入错误').show();
          return false;
        }else{
          return true;
        }
      },

      '.register-h ul li click': function ($element, event) {
        event && event.preventDefault();

        var tag = $element.data('tag');
        this.switchTag(tag);
      },

      '#input-mobile blur': function ($element, event) {
        var mobile = $element.val();
        this.checkMobile.call(this, mobile);
      },

      '#input-mobile focus': function ($element, event) {
        this.element.find('#input-mobile-error').hide()
      },

      '#mobile-code-btn click': function ($element, event) {
        event && event.preventDefault();

        var mobile = this.element.find('#input-mobile').val();
        if (this.checkMobile.call(this, mobile)) {
          // 发起请求发送号码

          var that = this;
          this.component.sms.setData({mobile: mobile, askType: 'REGISTER'});
          this.component.sms.sendRequest()
            .done(function (data) {
              // @todo 开始倒计时
            })
            .fail(function (errorCode) {
              if (_.isNumber(errorCode)) {
                var defaultText = '短信请求发送失败';
                var map = {
                  '1000010' : '未找到用户',
                  '1000020' : '账户已注册',
                  '1000070' : '参数错误',
                  '1000230' : '手机号错误，请输入正确的手机号',
                  '1000270' : '短信请求太过频繁',
                  '1000290' : '短信请求太多'
                }

                that.element.find('#mobile-code-error').text(map[errorCode.toString()] || defaultText).show();
              }
            })
        }
      },

      '#input-mobile-code focus': function ($element, event) {
        this.element.find('#mobile-code-error').hide();
      },

      '#input-mobile-code blur': function ($element, event) {
        var code = this.element.find('#input-mobile-code').val();
        this.checkCode.call(this, code);
      },

      '#input-password blur': function ($element, event) {
        var password = $element.val();
        this.checkPassword.call(this, password);
      },


      '#input-password focus': function ($element, event) {
        this.element.find('#password-error').hide();
      },

      '#mobile-register-btn click': function ($element, event) {
        event && event.preventDefault();

        // 发起请求注册

        var mobile = this.element.find('#input-mobile').val();
        var code = this.element.find('#input-mobile-code').val();
        var password = this.element.find('#input-password').val();

        if (this.checkMobile.call(this, mobile) && this.checkCode(code) && this.checkPassword(password)) {
          this.component.mobileRegister.setData({
            mobile: mobile,
            smsCode: code,
            password: md5(password+SFBizConf.setting.md5_key)
          });

          this.component.mobileRegister.sendRequest()
            .done(function (data) {
              if (data.csrfToken) {
                route.attr('tag', 'success');
              }
            })
            .faile(function (errorCode) {
              if (_.isNumber(errorCode)) {
                var defaultText = '注册失败';
                var map = {
                  '1000020': '账户已注册',
                  '1000230': '手机号错误，请输入正确的手机号',
                  '1000240': '手机验证码错误',
                  '1000250': '手机验证码已过期'
                }
                that.element.find('#mobile-register-error').text(map[errorCode.toString()] || defaultText).show();
              }
            })
        }
      },

      '#input-mail focus': function ($element, event) {
        this.element.find('#input-mail-error').hide();
      },

      '#input-mail blur': function ($element, event) {
        var email = $element.val();
        this.checkEmail.call(this, email);
      },

      getVerifiedCode: function () {
        var sessionId = md5(Date().valueOf() + window.parseInt(Math.random()*10000));
        this.data.attr('sessionId', sessionId);
        var verifiedCodeUrl = DEFAULT_CAPTCHA_LINK + '?' + $.param({id: DEFAULT_CAPTCHA_ID, hash: DEFAULT_CAPTCHA_HASH, sessionID: sessionId});

        this.data.attr('verifiedCodeUrl', verifiedCodeUrl);
      },

      '#verified-code-btn click': function () {
        this.getVerifiedCode()
      },


    });

  });