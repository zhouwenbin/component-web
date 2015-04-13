//绑定账号js
'use strict'

define(
  'sf.b2c.mall.component.setpassword', [
    'jquery',
    'can',
    'store',
    'sf.b2c.mall.business.config',
    'sf.util',
    'sf.b2c.mall.api.user.setPswdAndLogin',
    'sf.b2c.mall.api.user.downSmsCode'
  ],
  function($, can, store, SFConfig, SFFn, SFSetPswdAndLogin,SFDownSmsCode) {

    var DEFAULT_DOWN_SMS_ERROR_MAP = {
      '1000010' : '未找到手机用户',
      '1000020' : '手机号已存在，<a href="i.login.html">立即登录</a>',
      '1000070' : '参数错误',
      '1000230' : '手机号错误，请输入正确的手机号',
      '1000270' : '短信请求太过频繁,请稍后重试',
      '1000290' : '短信请求太多'
    }
    
    var ERROR_NO_INPUT_MOBILE = '请输入您的手机号码';
    var ERROR_INPUT_MOBILE = '您的手机号码格式有误';
    var ERROR_NO_MOBILE_CHECKCODE = '请输入验证码';
    var ERROR_MOBILE_CHECKCODE = '短信验证码输入有误，请重新输入';
    var ERROR_NO_PASSWORD = '请设置登录密码';
    var ERROR_PASSWORD = '密码请设置6-18位字母、数字或标点符号';

    return can.Control.extend({

      init: function() {
        this.data = new can.Map({

        });
        this.render(this.data);
      },

      render: function(data) {
        var html = can.view('templates/component/sf.b2c.mall.component.setpassword.mustache',data);
        this.element.append(html);
      },

      checkMobile: function(mobile) {
        if (!mobile) {
          this.element.find('#input-mobile-error').text(ERROR_NO_INPUT_MOBILE).show();
          return false;
        } else if (!/^1[0-9]{10}$/.test(mobile)) {
          this.element.find('#input-mobile-error').text(ERROR_INPUT_MOBILE).show();
          return false;
        } else {
          return true;
        }
      },

      checkCode: function(code) {
        if (!code) {
          this.element.find('#mobile-code-error').text(ERROR_NO_MOBILE_CHECKCODE).show();
          return false;
        } else if (!/^[0-9]{6}$/.test(code)) {
          this.element.find('#mobile-code-error').text(ERROR_MOBILE_CHECKCODE).show();
          return false;
        } else {
          return true;
        }
      },

      checkPassword: function (password, tag) {
        if (!password) {
          this.element.find(tag).text(ERROR_NO_PASSWORD).show();
          return false;
        }else if (!/^[0-9a-zA-Z~!@#\$%\^&\*\(\)_+=-\|~`,./<>\[\]\{\}]{6,18}$/.test(password)) {
          this.element.find(tag).text(ERROR_PASSWORD).show();
          return false;
        }else{
          return true;
        }
      },
      '#input-mobile blur': function($element, event) {
        var mobile = $element.val();
        this.checkMobile.call(this, mobile);
      },

      '#input-mobile focus': function($element, event) {
        this.element.find('#input-mobile-error').hide()
      },

      countdown: function(time) {
        var that = this;
        setTimeout(function() {
          if (time > 0) {
            time--;
            that.element.find('#mobile-code-btn').text(time + '秒后可重新发送').addClass('disable');
            that.countdown.call(that, time);
          } else {
            that.element.find('#mobile-code-btn').text('发送短信验证码').removeClass('disable');
          }
        }, 1000);
      },

      '#mobile-code-btn click': function($element, event) {
        event && event.preventDefault();

        var mobile = this.element.find('#input-mobile').val();
        if (this.checkMobile.call(this, mobile)) {
          // 发起请求发送号码

          var that = this;
          var downSmsCode = new SFDownSmsCode({
            mobile: mobile,
            askType: 'REGISTER'
          });
          downSmsCode.sendRequest()
            .done(function(data) {
              // @todo 开始倒计时
              that.countdown.call(that, 60);
              that.element.find('#mobile-code-error').hide();
            })
            .fail(function(errorCode) {
              if (_.isNumber(errorCode)) {
                var defaultText = '短信请求发送失败';
                var errorText = DEFAULT_DOWN_SMS_ERROR_MAP[errorCode.toString()] || defaultText;
                if (errorCode === 1000020) {
                  that.element.find('#input-mobile-error').html(errorText).show();
                } else {
                  that.element.find('#mobile-code-error').html(errorText).show();
                }
              }
            })
        }
      },

      'input focus': function($element, event) {
        this.element.find('#input-mobile-error').hide();
      },

      '#input-mobile-code focus': function($element, event) {
        this.element.find('#mobile-code-error').hide();
      },

      '#input-mobile-code blur': function($element, event) {
        var code = this.element.find('#input-mobile-code').val();
        this.checkCode.call(this, code);
      },

      '#input-password blur': function($element, event) {
        var password = $element.val();
        if (password) {
          $element.val(password);
        } else {
          $('#pwd-default-text').show();
        }
        this.checkPassword.call(this, password, '#password-error');
      },


      '#input-password focus': function($element, event) {
        $('#pwd-default-text').hide();
        this.element.find('#password-error').hide();
      },

      '#mobile-register-btn click': function ($element, event) {
        event && event.preventDefault();

        // 发起请求注册

        var that = this;
        var mobile = this.element.find('#input-mobile').val();
        var code = this.element.find('#input-mobile-code').val();
        var password = this.element.find('#input-password').val();

        if (this.checkMobile.call(this, mobile) && this.checkCode(code) && this.checkPassword(password, '#password-error')) {
          var setPswdAndLogin = new SFSetPswdAndLogin({
            mobile: mobile,
            smsCode: code,
            password: md5(password+SFBizConf.setting.md5_key)
          });

          setPswdAndLogin.sendRequest()
            .done(function (data) {
              if (data.csrfToken) {
                  store.set('csrfToken', data.csrfToken);
                //can.route.attr({'tag':'success', 'csrfToken': data.csrfToken});
              }
            })
            .fail(function (errorCode) {
              if (_.isNumber(errorCode)) {
                var defaultText = '注册失败';
                var errorText = DEFAULT_MOBILE_ACTIVATE_ERROR_MAP[errorCode.toString()] || defaultText;
                if (errorCode == 1000020) {
                  that.element.find('#input-mobile-error').html(errorText).show();
                }else{
                  that.element.find('#mobile-register-error').html(errorText).show();
                }
              }
            })
        }
      }
    });
  })