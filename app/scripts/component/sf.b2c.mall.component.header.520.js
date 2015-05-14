'use strict';

/**
 * [description]
 * @param  {[type]} can
 * @return {[type]}
 */
define('sf.b2c.mall.component.header.520', [
  'text',
  'jquery',
  'jquery.cookie',
  'can',
  'underscore',
  'md5',
  'store',
  'sf.b2c.mall.framework.comm',
  'sf.b2c.mall.business.config',
  'sf.util',
  'sf.b2c.mall.widget.message',
  'sf.b2c.mall.api.user.downSmsCode',
  'sf.b2c.mall.api.user.mobileRegister',
  'sf.b2c.mall.api.user.checkUserExist',
  'sf.b2c.mall.api.user.downInviteSms',
  'sf.b2c.mall.api.promotion.receivePro',
  'text!template_header_520'
], function(text, $, cookie, can, _, md5, store, SFComm, SFConfig, SFFn, SFMessage,
  SFApiUserDownSmsCode, SFApiUserMobileRegister, SFCheckUserExist, SFDownInviteSms, SFReceivePro,
  template_header_520) {

  var DEFAULT_FILLINFO_TAG = 'fillinfo';
  var DEFAULT_CAPTCHA_LINK = 'http://checkcode1.sfht.com/get.do/';
  var DEFAULT_CAPTCHA_LINK1 = 'http://121.42.42.43:9090/captcha.web/bin/get.do';
  var DEFAULT_CAPTCHA_ID = 'haitaob2c';
  var DEFAULT_CAPTCHA_HASH = '5f602a27181573d36e6c9d773ce70977';

  var DEFAULT_ACTIVATE_ERROR_MAP = {
    '1000020': '邮箱地址已存在，<a href="login.html">立即登录</a>',
    '1000050': '邮箱地址错误',
    '1000070': '参数错误',
    '1000100': '验证码错误',
    '1000160': '邮件请求频繁'
  };

  var DEFAULT_DOWN_SMS_ERROR_MAP = {
    '1000010': '未找到手机用户',
    '1000020': '手机号已存在',
    '1000070': '参数错误',
    '1000230': '手机号错误，请输入正确的手机号',
    '1000270': '短信请求太过频繁,请稍后重试',
    '1000290': '短信请求太多'
  }

  var DEFAULT_MOBILE_ACTIVATE_ERROR_MAP = {
    '1000020': '手机号已存在',
    '1000230': '手机号错误，请输入正确的手机号',
    '1000240': '手机验证码错误',
    '1000250': '验证码输入有误，请重新输入'
  }

  var ERROR_NO_INPUT_MOBILE = '请输入您的手机号码';
  var ERROR_INPUT_MOBILE = '您的手机号码格式有误';
  var ERROR_NO_MOBILE_CHECKCODE = '请输入验证码';
  var ERROR_MOBILE_CHECKCODE = '短信验证码输入有误，请重新输入';
  var ERROR_NO_PASSWORD = '请设置登录密码';
  var ERROR_PASSWORD = '密码请设置6-18位字母、数字或标点符号';
  var ERROR_EMAIL = '邮箱格式有误';
  var ERROR_NO_EMAIL = '请输入您的常用邮箱地址';
  var ERROR_NO_EMAIL_CODE = '请输入右侧图片中信息';
  var ERROR_EMAIL_CODE = '验证码输入有误，请重新输入';
  var DEFAULT_RESEND_SUCCESS = '验证邮件已重新发送，请注意查收';
  var ERROR_NO_SET_PWD = '手机号已存在';

  var MESSAGE_CLOSE_TIME = 1000;

  var MAIL_MAP = {
    '163': 'http://mail.163.com',
    'qq': 'http://mail.qq.com',
    'sina': 'http://mail.sina.com.cn',
    'sohu': 'http://mail.sohu.com',
    '21cn': 'http://mail.21cn.com',
    'hotmail': 'http://www.hotmail.com',
    'gmail': 'https://mail.google.com',
    '126': 'http://mail.126.com/'
  };

  can.route.ready();

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

    /**
     * @description 初始化方法，当调用new时会执行init方法
     * @param  {Dom} element 当前dom元素
     * @param  {Map} options 传递的参数
     */
    init: function(element, options) {
      this.component = {};
      this.component.sms = new SFApiUserDownSmsCode();
      this.component.mobileRegister = new SFApiUserMobileRegister();

      this.data = new can.Map({
        mobile: true,
        mail: false
      });

      var tag = can.route.attr('tag') || DEFAULT_FILLINFO_TAG;

      this.render(tag, this.data);
    },

    '{can.route} change': function() {
      var tag = can.route.attr('tag') || DEFAULT_FILLINFO_TAG;

      this.render.call(this, tag, this.data);
    },

    renderMap: {
      'fillinfo': function(data) {
        this.element.find('.step1').show();
        this.element.find('.step1success').hide();
      },

      'success': function(data) {
        this.element.find('.step1').hide();
        this.element.find('.step1success').show();
      }
    },

    render: function(tag, data) {
      //渲染页面
      var renderFn = can.mustache(template_header_520);
      var html = renderFn(data, this.helpers);
      this.element.prepend(html);

      this.showAD();

      this.getVerifiedCode.call(this);

      var params = can.deparam(window.location.search.substr(1));
      var fn = this.renderMap[tag];
      if (_.isFunction(fn)) {
        if (SFFn.isMobile.any() || params.platform) {
          data.attr('platform', params.platform || (SFFn.isMobile.any() ? 'mobile' : null));
          data.attr('ilogin', SFConfig.setting.link.ilogin);
        }
        fn.call(this, data);
      }
    },

    showAD: function() {
      if (!this.isInShowPage()) {
        return false;
      }

      if (this.needShowAd()) {
        $('.banner-scroll').delay(100).animate({
          "height": 820
        }, 5000, function() {
          $(".close").show();
        });
        store.set("lastadshowtime", new Date().getTime());
      } else {
        $(".close").hide();
        $('.banner-scroll2').delay(100).animate({
          "height": 90
        }, 300);
      }
    },

    isInShowPage: function() {

      var url = window.location.href;

      //URL补齐
      if (url == "http://www.sfht.com/") {
        url = url + "index.html";
      }

      // 如果不是详情页 首页和活动页 则不显示广告
      var isShowURL = /index|activity|detail/.test(url);
      if (!isShowURL) {
        return false;
      }

      return true;
    },

    needShowAd: function() {
      // 如果已经登录了 则不显示
      if (store.get('csrfToken')) {
        return false;
      }

      // 如果显示没超过一天 则不要显示广告
      if (store.get('lastadshowtime') && (new Date().getTime() - store.get('lastadshowtime') < 60 * 60 * 24 * 1000)) {
        return false;
      }

      return true;
    },

    checkMobile: function(mobile) {
      var that = this;
      var isTelNum = /^1\d{10}$/.test(mobile);
      //@note 手机号码输完11位时，验证该账号是否有密码
      if (isTelNum) {
        var checkUserExist = new SFCheckUserExist({
          'accountId': mobile,
          'type': 'MOBILE'
        });
        checkUserExist.sendRequest()
          .fail(function(errorCode) {
            if (errorCode == 1000340) {
              var fn = can.view.mustache(ERROR_NO_SET_PWD);

              new SFMessage(null, {
                'tip': fn({
                  tel: username
                }),
                'type': 'error',
                'closeTime': MESSAGE_CLOSE_TIME
              });

              //that.element.find('#input-mobile-error').html(fn({tel:username})).show();
              return false;
            };
          })
      };
      if (!mobile) {
        new SFMessage(null, {
          'tip': ERROR_NO_INPUT_MOBILE,
          'type': 'error',
          'closeTime': MESSAGE_CLOSE_TIME
        });
        return false;
      } else if (!/^1[0-9]{10}$/.test(mobile)) {
        new SFMessage(null, {
          'tip': ERROR_INPUT_MOBILE,
          'type': 'error',
          'closeTime': MESSAGE_CLOSE_TIME
        });
        return false;
      } else {
        return true;
      }
    },

    checkInviteMobile: function(mobile) {
      var that = this;
      var isTelNum = /^1\d{10}$/.test(mobile);
      //@note 手机号码输完11位时，验证该账号是否有密码
      if (!mobile) {
        new SFMessage(null, {
          'tip': ERROR_NO_INPUT_MOBILE,
          'type': 'error',
          'closeTime': MESSAGE_CLOSE_TIME
        });
        return false;
      } else if (!/^1[0-9]{10}$/.test(mobile)) {
        new SFMessage(null, {
          'tip': ERROR_INPUT_MOBILE,
          'type': 'error',
          'closeTime': MESSAGE_CLOSE_TIME
        });
        return false;
      } else {
        return true;
      }
    },

    checkCode: function(code) {
      if (!code) {
        new SFMessage(null, {
          'tip': ERROR_NO_MOBILE_CHECKCODE,
          'type': 'error',
          'closeTime': MESSAGE_CLOSE_TIME
        });
        return false;
      } else if (!/^[0-9]{6}$/.test(code)) {
        new SFMessage(null, {
          'tip': ERROR_MOBILE_CHECKCODE,
          'type': 'error',
          'closeTime': MESSAGE_CLOSE_TIME
        });
        return false;
      } else {
        return true;
      }
    },

    checkPassword: function(password, tag) {
      if (!password) {
        new SFMessage(null, {
          'tip': ERROR_NO_PASSWORD,
          'type': 'error',
          'closeTime': MESSAGE_CLOSE_TIME
        });
        return false;
      } else if (!/^[0-9a-zA-Z~!@#\$%\^&\*\(\)_+=-\|~`,./<>\[\]\{\}]{6,18}$/.test(password)) {
        new SFMessage(null, {
          'tip': ERROR_PASSWORD,
          'type': 'error',
          'closeTime': MESSAGE_CLOSE_TIME
        });
        return false;
      } else {
        return true;
      }
    },

    checkVerifiedCode: function(code) {
      if (!code) {
        new SFMessage(null, {
          'tip': "请输入验证码",
          'type': 'error',
          'closeTime': MESSAGE_CLOSE_TIME
        });
        return false;
      } else if (!/^[a-zA-Z0-9]{4}$/.test(code)) {
        new SFMessage(null, {
          'tip': "验证码错误",
          'type': 'error',
          'closeTime': MESSAGE_CLOSE_TIME
        });
        return false;
      } else {
        return true;
      }
    },

    '#input-mobile blur': function($element, event) {
      var mobile = $element.val();
      //this.checkMobile.call(this, mobile);
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
        this.component.sms.setData({
          mobile: mobile,
          askType: 'REGISTER'
        });
        this.component.sms.sendRequest()
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
                new SFMessage(null, {
                  'tip': errorText,
                  'type': 'error',
                  'closeTime': MESSAGE_CLOSE_TIME
                });
              } else {
                new SFMessage(null, {
                  'tip': errorText,
                  'type': 'error',
                  'closeTime': MESSAGE_CLOSE_TIME
                });
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
      //this.checkCode.call(this, code);
    },

    '#input-password blur': function($element, event) {
      var password = $element.val();
      if (password) {
        $element.val(password);
      } else {
        $('#pwd-default-text').show();
      }
      //this.checkPassword.call(this, password, '#password-error');
    },


    '#input-password focus': function($element, event) {
      $('#pwd-default-text').hide();
      this.element.find('#password-error').hide();
    },

    '#mobile-register-btn click': function($element, event) {
      event && event.preventDefault();

      // 发起请求注册

      var that = this;
      var mobile = this.element.find('#input-mobile').val();
      var code = this.element.find('#input-mobile-code').val();
      var password = this.element.find('#input-password').val();

      if (this.checkMobile.call(this, mobile) && this.checkCode(code) && this.checkPassword(password, '#password-error')) {
        this.component.mobileRegister.setData({
          mobile: mobile,
          smsCode: code,
          password: md5(password + SFConfig.setting.md5_key)
        });

        var receivePro = new SFReceivePro({
          "channel": "B2C",
          "event": "REGISTER_USER_SUCCESS",
          "password": md5(password + SFConfig.setting.md5_key)
        });

        this.component.mobileRegister.sendRequest()
          .done(function(data) {
            if (data.csrfToken) {
              // store.set('csrfToken', data.csrfToken);
              can.route.attr({
                'tag': 'success',
                'csrfToken': data.csrfToken
              });

              receivePro.sendRequest();
            }

            store.set("alipaylogin", "false");
            SFFn.dotCode();
          })
          .fail(function(errorCode) {
            if (_.isNumber(errorCode)) {
              var defaultText = '注册失败';
              var errorText = DEFAULT_MOBILE_ACTIVATE_ERROR_MAP[errorCode.toString()] || defaultText;
              if (errorCode == 1000020) {
                new SFMessage(null, {
                  'tip': errorText,
                  'type': 'error',
                  'closeTime': MESSAGE_CLOSE_TIME
                });
              } else {
                new SFMessage(null, {
                  'tip': errorText,
                  'type': 'error',
                  'closeTime': MESSAGE_CLOSE_TIME
                });
              }
            }
          })
      }
    },

    getVerifiedCode: function() {
      var sessionId = md5(Date().valueOf() + window.parseInt(Math.random() * 10000));
      this.data.attr('sessionId', sessionId);
      var verifiedCodeUrl = DEFAULT_CAPTCHA_LINK + '?' + $.param({
        type: "default",
        sessionID: sessionId
      });

      this.data.attr('verifiedCodeUrl', verifiedCodeUrl);
    },

    '#verified-code-btn click': function($element, event) {
      event && event.preventDefault();
      this.getVerifiedCode();
    },

    '#inviteTaBtn click': function($element, event) {
      if (!SFComm.prototype.checkUserLogin.call(that)) {
        new SFMessage(null, {
          'tip': "请先注册顺丰海淘会员",
          'type': 'error',
          'closeTime': MESSAGE_CLOSE_TIME
        });
        return false;
      }

      var inviteMobile = $("#inviteMobile").val();
      var code = $("#inviteMobileCode").val();
      var message = $(".messagedetail:visible").test();
      if (this.checkVerifiedCode.call(this, code) && this.checkInviteMobile(inviteMobile)) {
        var downInviteSms = new SFDownInviteSms({
          invtMobile: inviteMobile,
          vfcode: code,
          message: message
        });
        can.when(downInviteSms.sendRequest())
          .done(function(result) {
            if (result) {
              new SFMessage(null, {
                'tip': "邀请成功",
                'type': 'error',
                'closeTime': MESSAGE_CLOSE_TIME
              });
            } else {
              new SFMessage(null, {
                'tip': "邀请失败",
                'type': 'error',
                'closeTime': MESSAGE_CLOSE_TIME
              });
            }
          })
          .fail(function(errorCode) {
            var errMap = {
              "1000020": "账户已注册",
              "1000100": "验证码错误",
              "1000230": "手机号错误，请输入正确的手机号"
            }
            new SFMessage(null, {
              'tip': errMap[errorCode],
              'type': 'error',
              'closeTime': MESSAGE_CLOSE_TIME
            });
          });
      }
    },

    '.close click': function(element, event) {
      $('.banner-scroll')
        .animate({
          'height': 0,
        }, 1000, function() {
          $(".close").hide();
        })

      $('.banner-scroll2').delay(100).animate({
        "height": 90
      }, 300);


    },

    '.banner-scroll2 click': function(element, event) {
      $('.banner-scroll2')
        .animate({
          'height': 0
        }, 300)

      $('.banner-scroll').delay(100).animate({
        "height": 820
      }, 1000, function() {
        $(".close").show();
      });

    },

    '.radio click': function($element, event) {
      $(".radio").removeClass("active");
      $element.addClass("active");
      var name = $element.attr("name");
      $(".messagedetail").hide();
      $(".messagedetail[name='" + name + "']").show();
    }

  });

});