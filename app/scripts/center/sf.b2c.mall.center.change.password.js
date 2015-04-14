/**
 * Created by 魏志强 on 2014/12/26.
 */
define(
    'sf.b2c.mall.center.change.password',
    [
      'can',
      'jquery',
      'md5',
      'sf.b2c.mall.framework.comm',
      'sf.b2c.mall.api.user.changePassword',
      'sf.b2c.mall.api.user.getUserInfo',
      'sf.b2c.mall.api.user.downSmsCode',
      'sf.b2c.mall.api.user.resetPassword',
      'sf.util'
    ],
    function(can,$,md5,SFComm,SFChangePwd, SFGetUserInfo, SFApiUserDownSmsCode, SFResetPassword, SFFn){

      SFComm.register(1);

      var ERROR_NO_INPUT_OLDPWD = '请输入原密码';
      var ERROR_INPUT_OLDPWD = '原密码输入有误';
      var ERROR_NO_INPUT_NEWPWD = '请输入新密码';
      var ERROR_INPUT_NEWPWD = '请输入6-18位密码';
      var ERROR_NO_INPUT_CONFIRMPWD = '请输入确认密码';
      var ERROR_INPUT_CONFIRMPWD = '您两次输入的密码不一致，请重新输入';
      var ERROR_SAME_PWD = '新密码与原密码一致，请重新设置密码';

      var ERROR_NO_MOBILE_CHECKCODE = '请输入验证码';
      var ERROR_MOBILE_CHECKCODE = '短信验证码输入有误，请重新输入';

      var DEFAULT_DOWN_SMS_ERROR_MAP = {
        '1000010' : '未找到手机用户',
        '1000020' : '手机号已存在，<a href="login.html">立即登录</a>',
        '1000070' : '参数错误',
        '1000230' : '手机号错误，请输入正确的手机号',
        '1000270' : '短信请求太过频繁,请稍后重试',
        '1000290' : '短信请求太多'
      }

      return can.Control.extend({

        init: function () {
          this.component = {};
          this.component.sms = new SFApiUserDownSmsCode();
          this.component.changePwd = new SFChangePwd();
          this.component.resetpw = new SFResetPassword();

          this.data = new can.Map({
            oldPwd: null,
            phoneNumber: null,
            mobileCode: null,
            newPwd: null,
            confirmPwd: null
          });
          this.render(this.data);
        },
        render: function (data) {

          var that = this;

          var getUserInfo = new SFGetUserInfo();
          getUserInfo.sendRequest()
          .done(function(userinfo){
            if (!userinfo.hasPswd) {
              data.attr("phoneNumber", userinfo.mobile);
              var html = can.view('templates/center/sf.b2c.mall.center.bindsecret.mustache', data);
              that.element.html(html);
            } else {
              // var html = can.view('templates/center/sf.b2c.mall.center.bindsecret.mustache', data);
              // that.element.html(html);
              var html = can.view('templates/center/sf.b2c.mall.center.secret.mustache', data);
              that.element.html(html);
            }
          })
          .fail()

        },
        //检验输入密码是否正确(密码要求的格式)
        isPwd: function (password) {
          var pwd = /^[0-9a-zA-Z~!@#\$%\^&\*\(\)_+=-\|~`,./<>\[\]\{\}]{6,18}$/.test(password);
          if (pwd) {
            return true;
          } else {
            return false;
          }
        },
        //旧密码检验
        checkOldPwd: function (oldPwd) {
          if (!oldPwd) {
            this.element.find('#oldPwd-error-tips').text(ERROR_NO_INPUT_OLDPWD).show();
            return false;
          } else if (!this.isPwd(oldPwd)) {
            this.element.find('#oldPwd-error-tips').text(ERROR_INPUT_OLDPWD).show();
            return false;
          } else {
            return true;
          }
        },
        //新密码检验
        checkNewPwd: function (newPwd) {
          if (!newPwd) {
            this.element.find('#newPwd-error-tips').text(ERROR_NO_INPUT_NEWPWD).show();
            return false;
          } else if (!this.isPwd(newPwd)) {
            this.element.find('#newPwd-error-tips').text(ERROR_INPUT_NEWPWD).show();
            return false;
          } else {
            return true;
          }
        },
        //确认密码验证
        checkConfirmPwd: function (confirmPwd) {
          if (!confirmPwd) {
            this.element.find('#confirmPwd-error-tips').text(ERROR_NO_INPUT_CONFIRMPWD).show();
            return false;
          } else if (!this.isPwd(confirmPwd)) {
            this.element.find('#confirmPwd-error-tips').text(ERROR_INPUT_CONFIRMPWD).show();
            return false;
          } else {
            return true;
          }
        },
        //

        '#old-password focus': function (element, event) {
          event && event.preventDefault();
          this.element.find('#oldPwd-error-tips').hide();
        },
        '#old-password blur': function (element, event) {
          event && event.preventDefault();

          var oldPwd = this.data.attr('oldPwd');
          this.checkOldPwd.call(this, oldPwd);
        },

        '#new-password focus': function (element, event) {
          event && event.preventDefault();
          this.element.find('#newPwd-error-tips').hide();
        },
        '#new-password blur': function (element, event) {
          event && event.preventDefault();

          var newPwd = this.data.attr('newPwd');

          this.checkNewPwd.call(this, newPwd);
        },

        '#confirm-password focus': function (element, event) {
          event && event.preventDefault();
          this.element.find('#confirmPwd-error-tips').hide();
        },
        '#confirm-password blur': function (element, event) {
          event && event.preventDefault();

          var newPwd = this.data.attr('newPwd');
          var confirmPwd = this.data.attr('confirmPwd');
          this.checkConfirmPwd.call(this, confirmPwd);
          if(newPwd !==confirmPwd){
            this.element.find('#confirmPwd-error-tips').text(ERROR_INPUT_CONFIRMPWD).show();
            return false;
          }
        },

        checkCode: function (code) {
          if (!code) {
            this.element.find('#mobile-code-error').text(ERROR_NO_MOBILE_CHECKCODE).show();
            return false;
          }else if (!/^[0-9]{6}$/.test(code)) {
            this.element.find('#mobile-code-error').text(ERROR_MOBILE_CHECKCODE).show();
            return false;
          }else{
            return true;
          }
        },

        '#input-mobile-code focus': function ($element, event) {
          this.element.find('#mobile-code-error').hide();
        },

        '#input-mobile-code blur': function ($element, event) {
          var code = this.element.find('#input-mobile-code').val();
          this.checkCode.call(this, code);
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

        '#mobile-code-btn click': function($element, event) {
          event && event.preventDefault();

          var mobile = this.element.find('#input-mobile').val();

          // 发起请求发送号码
          var that = this;
          this.component.sms.setData({
            mobile: mobile,
            askType: 'RESETPSWD'
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
                  that.element.find('#input-mobile-error').html(errorText).show();
                } else {
                  that.element.find('#mobile-code-error').html(errorText).show();
                }
              }
            })

        },

        '#btn-confirm-bind click': function (element, event) {
          event && event.preventDefault();

          $('#mobile-code-error').hide();
          $('#newPwd-error-tips').hide();
          $('#confirmPwd-error-tips').hide();
          var that = this;
          if (SFComm.prototype.checkUserLogin.call(that)) {

            var inputData = {
              phoneNumber: this.data.attr('phoneNumber'),
              mobileCode: this.data.attr('mobileCode'),
              newPassword: this.data.attr('newPwd'),
              repeatPassword: this.data.attr('confirmPwd')
            };
            if(inputData.newPassword !==inputData.repeatPassword){
              return $('#confirmPwd-error-tips').text(ERROR_INPUT_CONFIRMPWD).show();
            }

            if (this.checkCode(inputData.mobileCode) && this.checkNewPwd.call(this, inputData.newPassword) && this.checkConfirmPwd.call(this, inputData.newPassword)) {

              var params = {
                accountId: inputData.phoneNumber,
                type: 'MOBILE',
                smsCode: inputData.mobileCode,
                newPassword: md5(inputData.newPassword + 'www.sfht.com')
              };

              this.component.resetpw.setData(params);
              this.component.resetpw.sendRequest()
                .done(function (data) {
                    var html ='<div class="order retrieve-success"><span class="icon icon33"></span><h1>密码修改成功</h1><a href="index.html" class="btn btn-send">返回首页</a></div>'
                    $('.change-password-wrap').html(html);
                })
                .fail(function (error) {
                  console.error(error);
                })
            }
          }else{
            window.location.href = 'index.html';
          }
        },

        '#btn-confirm click': function (element, event) {
          event && event.preventDefault();

          $('#oldPwd-error-tips').hide();
          $('#newPwd-error-tips').hide();
          $('#confirmPwd-error-tips').hide();
          var that = this;
          if (SFComm.prototype.checkUserLogin.call(that)) {

            var inputData = {
              oldPassword: this.data.attr('oldPwd'),
              newPassword: this.data.attr('newPwd'),
              repeatPassword: this.data.attr('confirmPwd')
            };
            if(inputData.newPassword !==inputData.repeatPassword){
              return $('#confirmPwd-error-tips').text(ERROR_INPUT_CONFIRMPWD).show();
            }
            if (this.checkOldPwd.call(this, inputData.oldPassword) && this.checkNewPwd.call(this, inputData.newPassword) && this.checkConfirmPwd.call(this, inputData.newPassword)) {
              var params = {
                oldPassword: md5(inputData.oldPassword + 'www.sfht.com'),
                newPassword: md5(inputData.newPassword + 'www.sfht.com')
              };
              this.component.changePwd.setData(params);
              this.component.changePwd.sendRequest()
                .done(function (data) {
                    var html ='<div class="order retrieve-success"><span class="icon icon33"></span><h1>密码修改成功</h1><a href="index.html" class="btn btn-send">返回首页</a></div>'
                    $('.change-password-wrap').html(html);
                })
                .fail(function (error) {
                  if (error === 1000040) {
                    $('#oldPwd-error-tips').text(ERROR_INPUT_OLDPWD).show();
                  }else if (error === 1000060) {
                    $('#newPwd-error-tips').text(ERROR_SAME_PWD).show();
                  }else{
                    console.error(error);
                  }
                })
            }
          }else{
            window.location.href = 'index.html';
          }
        }
      })
    }
)