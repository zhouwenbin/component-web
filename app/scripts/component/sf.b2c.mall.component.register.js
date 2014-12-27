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
    'sf.b2c.mall.api.user.sendActivateMail',
    'sf.b2c.mall.business.config'
  ],

  function ($, can, md5, _, placeholders, SFApiUserDownSmsCode, SFApiUserMobileRegister, SFApiUserSendActivateMail, SFBizConf) {

    var DEFAULT_FILLINFO_TAG = 'fillinfo';
    var DEFAULT_CAPTCHA_LINK = 'http://checkcode.sfht.com/captcha/';
    var DEFAULT_CAPTCHA_ID = 'haitaob2c';
    var DEFAULT_CAPTCHA_HASH = '5f602a27181573d36e6c9d773ce70977';

    var DEFAULT_ACTIVATE_ERROR_MAP = {
      '1000020':   '账户已注册',
      '1000050':   '邮箱地址错误',
      '1000070':   '参数错误',
      '1000100':   '验证码错误',
      '1000160':   '邮件请求频繁'
    };

    var DEFAULT_DOWN_SMS_ERROR_MAP = {
      '1000010' : '未找到手机用户',
      '1000020' : '手机号已存在，<a href="login.html">立即登陆</a>',
      '1000070' : '参数错误',
      '1000230' : '手机号错误，请输入正确的手机号',
      '1000270' : '短信请求太过频繁,请稍后重试',
      '1000290' : '短信请求太多'
    }

    var DEFAULT_MOBILE_ACTIVATE_ERROR_MAP = {
      '1000020': '账户已注册',
      '1000230': '手机号错误，请输入正确的手机号',
      '1000240': '手机验证码错误',
      '1000250': '手机验证码已过期'
    }

    var ERROR_NO_INPUT_MOBILE = '请输入您的手机号码';
    var ERROR_INPUT_MOBILE = '您的手机号码格式有误';
    var ERROR_MOBILE_CHECKCODE = '短信验证码输入有误，请重新输入';
    var ERROR_PASSWORD = '密码请设置6-18位字母、数字或标点符号';
    var ERROR_EMAIL = '您的邮箱地址格式输入有误';
    var ERROR_NO_EMAIL = '请输入您的常用邮箱地址';
    var ERROR_NO_EMAIL_CODE = '请输入验证码';
    var ERROR_EMAIL_CODE = '验证码输入有误，请重新输入';

    can.route.ready();

    return can.Control.extend({

      init: function (element, event) {
        this.component = {};
        this.component.sms = new SFApiUserDownSmsCode();
        this.component.mobileRegister = new SFApiUserMobileRegister();
        this.component.activateMail = new SFApiUserSendActivateMail();

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
        },

        'confirminfo': function (data) {
          var params = can.deparam(window.location.search.substr(1));
          data.attr('mailId', params.mailId);
          data.attr('mailLink', this.getEmailLink(params.mailId));

          var html = can.view('templates/component/sf.b2c.mall.component.register.confirminfo.mustache', data);
          this.element.html(html)
          this.element.find('.register').fadeIn('slow');
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

      getEmailLink: function (email) {
        // @todo 处理email链接
        if (email) {
          var arr = email.split('@');
          return 'http://mail.'+arr[1];
        }
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
        if (!mobile) {
          this.element.find('#input-mobile-error').text(ERROR_NO_INPUT_MOBILE).show();
          return false;
        }else if(!/^1[0-9]{10}$/.test(mobile)){
          this.element.find('#input-mobile-error').text(ERROR_INPUT_MOBILE).show();
          return false;
        }else{
          return true;
        }
      },

      checkCode: function (code) {
        if (!/^[0-9]{6}$/.test(code)) {
          this.element.find('#mobile-code-error').text(ERROR_MOBILE_CHECKCODE).show();
          return false;
        }else{
          return true;
        }
      },

      checkMailCode: function (code) {
        if (!code) {
          this.element.find('#mail-code-error').text(ERROR_NO_EMAIL_CODE).show();
          return false;
        }else if (!/^[0-9]{6}$/.test(code)) {
          this.element.find('#mail-code-error').text(ERROR_EMAIL_CODE).show();
          return false;
        }else{
          return true;
        }
      },

      checkPassword: function (password, tag) {
        if (!/^[0-9a-zA-Z~!@#\$%\^&\*\(\)_+=-\|~`,./<>\[\]\{\}]{6,18}$/.test(password)) {
          this.element.find(tag).text(ERROR_PASSWORD).show();
          return false;
        }else{
          return true;
        }
      },

      checkEmail: function (email) {
        if (!email) {
          this.element.find('#input-mail-error').text(ERROR_NO_EMAIL).show();
          return false;
        }else if (!/^([a-zA-Z0-9-_]*[-_\.]?[a-zA-Z0-9]+)*@([a-zA-Z0-9]*[-_]?[a-zA-Z0-9]+)+[\.][a-zA-Z]{2,3}([\.][a-zA-Z]{2})?$/.test(email)) {
          this.element.find('#input-mail-error').text(ERROR_EMAIL).show();
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

      countdown: function (time) {
        var that = this;
        setTimeout(function() {
          if (time > 0) {
            time--;
            that.element.find('#mobile-code-btn').text(time+'秒后可重新发送').addClass('disable');
            that.countdown.call(that, time);
          }else{
            that.element.find('#mobile-code-btn').text('发送短信验证码').removeClass('disable');
          }
        }, 1000);
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
              that.countdown.call(that, 60);
              that.element.find('#mobile-code-error').hide();
            })
            .fail(function (errorCode) {
              if (_.isNumber(errorCode)) {
                var defaultText = '短信请求发送失败';
                that.element.find('#mobile-code-error').html(DEFAULT_DOWN_SMS_ERROR_MAP[errorCode.toString()] || defaultText).show();
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
        this.checkPassword.call(this, password, '#password-error');
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

        if (this.checkMobile.call(this, mobile) && this.checkCode(code) && this.checkPassword(password, '#password-error')) {
          this.component.mobileRegister.setData({
            mobile: mobile,
            smsCode: code,
            password: md5(password+SFBizConf.setting.md5_key)
          });

          this.component.mobileRegister.sendRequest()
            .done(function (data) {
              if (data.csrfToken) {
                can.route.attr('tag', 'success');
              }
            })
            .faile(function (errorCode) {
              if (_.isNumber(errorCode)) {
                var defaultText = '注册失败';
                that.element.find('#mobile-register-error').text(DEFAULT_MOBILE_ACTIVATE_ERROR_MAP[errorCode.toString()] || defaultText).show();
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

      '#input-mail-code focus': function ($element, event) {
        this.element.find('#mail-code-error').hide();
      },

      '#input-mail-code blur': function ($element, event) {
        var code = $element.val();
        this.checkMailCode.call(this, code);
      },

      '#input-mail-password focus': function ($element, event) {
        this.element.find('#mail-password-error').hide();
      },

      '#input-mail-password blur': function ($element, event) {
        var password = $element.val();
        this.checkPassword.call(this, password, '#mail-password-error');
      },

      '#mail-register-btn click': function ($element, event) {
        event && event.preventDefault();

        var email = this.element.find('#input-mail');
        var code = this.element.find('#input-mail-code');
        var password = this.element.find('#input-mail-password');
        if (this.checkEmail.call(email) && this.checkPassword.call(this, password, '#mail-password-error') && this.checkMailCode.call(this, code)) {
          this.component.activateMail.setData({
            mailId: email,
            vfCode: code
          });

          this.component.activateMail.sendRequest()
            .done(function (data) {
              if (data.value) {
                can.route.attr('tag', 'confirminfo');
              }
            })
            .fail(function (errorCode) {
              if (_.isNumber(errorCode)) {
                var defaultText = '注册失败';
                that.element.find('#mail-register-error').text(DEFAULT_ACTIVATE_ERROR_MAP[errorCode.toString()] || defaultText).show();
              }
            })
        };
      },

      'input focus': function ($element, event) {
        this.element.find('#mobile-register-error').hide();
        this.element.find('#mail-register-error').hide();
      },

      '#mail-resend-activate click': function ($element, event) {
        event && event.preventDefault();

        var mailId = this.data.attr('mailId');

        if (mailId) {
          this.component.activateMail.setData({
            mailId: mailId,
            from: 'RESEND'
          });

          this.component.activateMail.sendRequest()
            .done(function (data) {
              if (data.value) {
                // @todo 发送成功
                alert('@todo activateMail send success')
              }
            })
            .fail(function (errorCode) {
              // @todo 处理错误码
              alert('@todo activateMail send fail:'+errorCode)
            })
          }else{
            // @todo 没有传递mailId
            alert('@todo activateMail no mailId')
          }
      }
    });

  });