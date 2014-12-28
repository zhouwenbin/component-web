'use strict';

define(
  'sf.b2c.mall.component.retrieve',

  [
    'jquery',
    'can',
    'underscore',
    'md5',
    'sf.b2c.mall.framework.comm',
    'sf.b2c.mall.api.user.downSmsCode',
    'sf.b2c.mall.api.user.checkSmsCode',
    'sf.b2c.mall.api.user.resetPassword',
    'sf.b2c.mall.api.user.sendResetPwdLink',
    'sf.b2c.mall.business.config'
  ],

  function ($, can, _, md5, SFFrameworkComm, SFApiUserDownSmsCode, SFApiUserCheckSmsCode, SFApiUserResetPassword, SFApiUserSendResetPwdLink, SFBizConf) {

    var DEFAULT_FILLINFO_TAG = 'fillinfo';
    var DEFAULT_CAPTCHA_LINK = 'http://checkcode.sfht.com/captcha/';
    var DEFAULT_CAPTCHA_ID = 'haitaob2c';
    var DEFAULT_CAPTCHA_HASH = '5f602a27181573d36e6c9d773ce70977';

    var ERROR_NO_INPUT_MOBILE = '请输入您的手机号码';
    var ERROR_INPUT_MOBILE = '您的手机号码格式有误';
    var ERROR_MOBILE_CHECKCODE = '短信验证码输入有误，请重新输入';
    var ERROR_PASSWORD = '密码请设置6-18位字母、数字或标点符号';
    var ERROR_EMAIL = '您的邮箱地址格式输入有误';
    var ERROR_NO_EMAIL = '请输入您的常用邮箱地址';
    var ERROR_NO_EMAIL_CODE = '请输入验证码';
    var ERROR_EMAIL_CODE = '验证码输入有误，请重新输入';
    var ERROR_PASSWORD = '密码请设置6-18位字母、数字或标点符号';
    var ERROR_NOT_SAME = '重复密码输入有误，请重新输入';

    var DEFAULT_DOWN_SMS_ERROR_MAP = {
      '1000010' : '未找到手机用户',
      '1000020' : '手机号已存在，<a href="login.html">立即登陆</a>',
      '1000070' : '参数错误',
      '1000230' : '手机号错误，请输入正确的手机号',
      '1000270' : '短信请求太过频繁,请稍后重试',
      '1000290' : '短信请求太多'
    }

    var ERROR_CHECK_SMS_MAP = {
      '1000230':   '手机号错误，请输入正确的手机号',
      '1000250':   '手机验证码已过期'
    }

    var ERROR_RESET_PASSWORD_MAP = {
      '1000010':  '未找到用户',
      '1000070':  '参数错误',
      '1000120':  '链接已过期',
      '1000130':  '签名验证失败',
      '1000140':  '密码修改间隔太短',
      '1000230':  '手机号错误，请输入正确的手机号',
      '1000240':  '手机验证码错误',
      '1000250':  '手机验证码已过期'
    }

    var ERROR_RESND_MAIL_LINK_MAP = {
      '1000010':   '未找到用户',
      '1000050':   '邮箱地址错误',
      '1000070':   '参数错误',
      '1000100':   '验证码错误',
      '1000110':   '账户尚未激活',
      '1000160':   '邮件请求频繁'
    }

    can.route.ready();

    return can.Control.extend({
      init: function () {
        this.component = {};
        this.component.sms = new SFApiUserDownSmsCode();
        this.component.checksms = new SFApiUserCheckSmsCode();
        this.component.resetpw = new SFApiUserResetPassword();
        this.component.sendResetPwdLink = new SFApiUserSendResetPwdLink();
        this.paint();
      },

      getVerifiedCode: function () {
        var sessionId = md5(Date().valueOf() + window.parseInt(Math.random()*10000));
        this.data.attr('sessionId', sessionId);
        var verifiedCodeUrl = DEFAULT_CAPTCHA_LINK + '?' + $.param({id: DEFAULT_CAPTCHA_ID, hash: DEFAULT_CAPTCHA_HASH, sessionID: sessionId});

        this.data.attr('verifiedCodeUrl', verifiedCodeUrl);
      },

      paint: function () {

        this.data = new can.Map({});

        var tag = can.route.attr('tag') || DEFAULT_FILLINFO_TAG
        var fn = this.dataMap[tag];
        if (_.isFunction(fn)) {
          fn.call(this);
        }
        this.render(tag, this.data);
      },

      dataMap: {
        'fillinfo': function () {
          this.data.attr({
            'mobile': true,
            'mail': false,
            'msgType':'icon26',
            'msg': null,
            'verifiedCodeUrl': null
          })
        }
      },

      '{can.route} change': function() {
        var tag = can.route.attr('tag') || DEFAULT_FILLINFO_TAG;
        var fn = this.dataMap[tag];
        if (_.isFunction(fn)) {
          fn.call(this);
        }
        this.render.call(this, tag, this.data);
      },

      renderMap: {
        'fillinfo': 'templates/component/sf.b2c.mall.component.retrieve.fillinfo.mustache',
        'setpwd': 'templates/component/sf.b2c.mall.component.retrieve.setpwd.mustache',
        'success': 'templates/component/sf.b2c.mall.component.retrieve.success.mustache'
      },

      render: function (tag, data) {
        var path = this.renderMap[tag];
        if (path) {
          var html = can.view(path, data);
          this.element.html(html);
        }
      },

      '.radio click': function ($element, event) {
        event && event.preventDefault();
        var tag = $element.data('tag');
        this.switchTab(tag);
      },

      switchTab: function (tag) {
        this.data.attr('mobile', false);
        this.data.attr('mail', false);
        this.data.attr(tag, true);
        this.getVerifiedCode();
      },

      '#verified-code click': function () {
        this.getVerifiedCode();
      },

      checkPassword: function (password) {

      },

      checkMobile: function (mobile) {
        if (!mobile) {
          this.data.attr({
            'msgType': 'icon26',
            'msg': ERROR_NO_INPUT_MOBILE
          });
          return false;
        }else if(!/^1[0-9]{10}$/.test(mobile)){
          this.data.attr({
            'msgType': 'icon26',
            'msg': ERROR_INPUT_MOBILE
          })
          return false;
        }else{
          return true;
        }
      },

      checkCode: function (code) {
        if (!/^[0-9]{6}$/.test(code)) {
          this.data.attr({
            'msgType': 'icon26',
            'msg': ERROR_MOBILE_CHECKCODE
          });
          return false;
        }else{
          return true;
        }
      },

      checkMailCode: function (code) {
        if (!code) {
          this.data.attr({
            'msgType': 'icon26',
            'msg': ERROR_NO_EMAIL_CODE
          });
          return false;
        }else if (!/^[0-9]{6}$/.test(code)) {
          this.data.attr({
            'msgType': 'icon26',
            'msg': ERROR_EMAIL_CODE
          });
          return false;
        }else{
          return true;
        }
      },

      countdown: function (time) {
        var that = this;
        setTimeout(function() {
          if (time > 0) {
            time--;
            that.element.find('#send-code-btn').text(time+'秒后可重新发送').addClass('disable');
            that.countdown.call(that, time);
          }else{
            that.element.find('#send-code-btn').text('发送短信验证码').removeClass('disable');
          }
        }, 1000);
      },

      'input focus': function () {
        this.data.attr('msg', null);
      },

      '#input-mobile blur': function ($element, event) {
        this.checkMobile.call(this, $element.val());
      },

      '#input-sms blur': function ($element, event) {
        this.checkCode.call(this, $element.val());
      },

      '#send-code-btn click': function ($element, event) {
        event && event.preventDefault();

        var mobile = this.element.find('#input-mobile').val();
        if (this.checkMobile.call(this, mobile)) {
          var that = this;
          this.component.sms.setData({mobile: mobile, askType: 'RESETPSWD'});
          this.component.sms.sendRequest()
            .done(function (data) {
              // @todo 开始倒计时
              if (data.value) {
                that.countdown.call(that, 60);
                that.data.attr({
                  msgType: 'icon26',
                  msg: null
                });
              }
            })
            .fail(function (errorCode) {
              if (_.isNumber(errorCode)) {
                var defaultText = '短信请求发送失败';
                that.data.attr('msgType', 'icon26');
                that.data.attr('msg', DEFAULT_DOWN_SMS_ERROR_MAP[errorCode.toString()]||defaultText)
              }
            })
        }
      },

      '#send-mobile-activate-btn click': function ($element, event) {
        event && event.preventDefault();
        var mobile = this.element.find('#input-mobile').val();
        var sms = this.element.find('#input-sms').val();

        var that = this;
        if (this.checkMobile.call(this, mobile) && this.checkCode.call(this, sms)) {
          this.component.checksms.setData({
            mobile: mobile,
            smsCode: sms,
            askType: 'RESETPSWD'
          });

          this.component.checksms.sendRequest()
            .done(function (data) {
              if (data.value) {
                window.location.href = window.location.pathname + '?' + $.param({accountId: mobile, type: 'MOBILE', sms: sms}) + '#!&tag=setpwd'
                // can.route.attr('tag', 'setpwd')
              }
            })
            .fail(function (errorCode) {
              if (_.isNumber(errorCode)) {
                that.data.attr({
                  msg: ERROR_CHECK_SMS_MAP[errorCode.toString()],
                  msgType: 'icon26'
                });
              }
            })
        }
      },

      checkEmail: function (email) {
        if (!email) {
          this.data.attr({
            msg: ERROR_NO_EMAIL,
            msgType: 'icon26'
          })
          return false;
        }else if (!/^([a-zA-Z0-9-_]*[-_\.]?[a-zA-Z0-9]+)*@([a-zA-Z0-9]*[-_]?[a-zA-Z0-9]+)+[\.][a-zA-Z]{2,3}([\.][a-zA-Z]{2})?$/.test(email)) {
          this.data.attr({
            msg: ERROR_EMAIL,
            msgType: 'icon26'
          })
          return false;
        }else{
          return true;
        }
      },

      '#input-email blur': function ($element, event) {
        var email = $element.val();
        this.checkEmail.call(this, email);
      },

      '#nput-mail-code blur': function ($element, event) {
        var code = $element.val();
        this.checkMailCode.call(this, code);
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
      },

      '#input-password blur': function ($element, event) {
        var password = $element.val();

        if (!/^[0-9a-zA-Z~!@#\$%\^&\*\(\)_+=-\|~`,./<>\[\]\{\}]{6,18}$/.test(password)) {
          return this.data.attr({
            msg: ERROR_PASSWORD,
            msgType: 'icon26'
          });
        }
      },

      '#input-repassword blur': function ($element, event) {
        var repassword = this.element.find('#input-repassword').val();
        var password = this.element.find('#input-password').val();

        if (!/^[0-9a-zA-Z~!@#\$%\^&\*\(\)_+=-\|~`,./<>\[\]\{\}]{6,18}$/.test(password)) {
          return this.data.attr({
            msg: ERROR_PASSWORD,
            msgType: 'icon26'
          });
        }else if (!_.isEmpty(repassword) && password !== repassword) {
          return this.data.attr({
            msg: ERROR_NOT_SAME,
            msgType: 'icon26'
          });
        }
      },

      '#reset-password-btn click': function ($element, event) {
        event && event.preventDefault();

        var repassword = this.element.find('#input-repassword').val();
        var password = this.element.find('#input-password').val();

        if (!/^[0-9a-zA-Z~!@#\$%\^&\*\(\)_+=-\|~`,./<>\[\]\{\}]{6,18}$/.test(password)) {
          return this.data.attr({
            msg: ERROR_PASSWORD,
            msgType: 'icon26'
          });
        }else if (!_.isEmpty(repassword) && password !== repassword) {
          return this.data.attr({
            msg: ERROR_NOT_SAME,
            msgType: 'icon26'
          });
        }

        var params = can.deparam(window.location.search.substr(1));
        if (params.tp == 'RESETPWD') {
          this.component.resetpw.setData({
            accountId: params.mailId,
            type: 'MAIL',
            newPassword: md5(password+SFBizConf.setting.md5_key),
            linkContent: window.location.search.substr(1)
          });
        }else{
          this.component.resetpw.setData({
            accountId: params.accountId,
            type: params.type,
            newPassword: md5(password+SFBizConf.setting.md5_key),
            smsCode: params.sms
          });
        }

        var that = this;
        this.component.resetpw.sendRequest()
          .done(function (data) {
            if (data.value) {
              can.route.attr('tag', 'success');
            }
          })
          .fail(function (errorCode) {
            if (_.isNumber(errorCode)) {
              that.data.attr({
                msg: ERROR_RESET_PASSWORD_MAP[errorCode.toString()],
                msgType: 'icon26'
              });
            }
          })
      },

      '#send-mail-activate-btn click': function ($element, event) {
        event && event.preventDefault();

        var that = this;
        var email = this.element.find('#input-email').val();
        var code = this.element.find('#input-mail-code').val();

        code = $.param({id: DEFAULT_CAPTCHA_ID, hash: DEFAULT_CAPTCHA_HASH, sessionID: this.data.sessionId, answer: code});

        this.component.sendResetPwdLink.setData({
          mailId: email,
          vfCode: code
        });

        this.component.sendResetPwdLink.sendRequest()
          .done(function (data) {
            if (data.value) {
              that.data.attr({
                msg: '邮件已发送至您的邮箱，请查收',
                msgType: 'icon26-2'
              });
            }
          })
          .fail(function (errorCode) {
            if (_.isNumber(errorCode)) {
              that.data.attr({
                msg: ERROR_RESND_MAIL_LINK_MAP[errorCode.toString()],
                msgType: 'icon26'
              })
            }
          })
      }

    })
  })