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
      'fastclick'
    ],
    function(can,$,md5,SFComm,SFChangePwd, fastclick){

      SFComm.register(1);

      var ERROR_NO_INPUT_OLDPWD = '请输入原密码';
      var ERROR_INPUT_OLDPWD = '原密码输入有误';
      var ERROR_NO_INPUT_NEWPWD = '请输入新密码';
      var ERROR_INPUT_NEWPWD = '请输入6-18位密码';
      var ERROR_NO_INPUT_CONFIRMPWD = '请输入确认密码';
      var ERROR_INPUT_CONFIRMPWD = '您两次输入的密码不一致，请重新输入';
      var ERROR_SAME_PWD = '新密码与原密码一致，请重新设置密码';

      fastclick.attach(document.body);
      return can.Control.extend({

        init: function () {
          this.component = {};
          this.component.changePwd = new SFChangePwd();

          this.data = new can.Map({
            oldPwd: null,
            newPwd: null,
            confirmPwd: null
          });
          this.render(this.data);
        },
        render: function (data) {

          var html = can.view('templates/center/sf.b2c.mall.center.secret.mustache', data);
          this.element.html(html);
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
                    var html ='<div class="order retrieve-success"><span class="icon icon33"></span><h1>密码修改成功</h1><a href="index.html" class="btn btn-send">返回首页</a><span class="icon icon28"></span></div>'
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