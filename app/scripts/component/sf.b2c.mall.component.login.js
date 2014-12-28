'use strict';

define(

  'sf.b2c.mall.component.login',

  [
    'jquery',
    'can',
    'md5',
    'sf.b2c.mall.business.config',
    'sf.b2c.mall.api.user.webLogin'
  ],

  function($, can, md5, SFConfig, SFLogin){
    return can.Control.extend({

      /**
       * @override
       * @description 初始化方法
       */
      init: function () {
        this.component = {};
        this.component.login = new SFLogin();

        this.data = new can.Map({
          username: null,
          password:null,
          verifiedCode: null,
          isNeedVerifiedCode: false,
          userNameError:null,
          pwdError:null,
          autologin:false
        })

        this.render(this.data);
      },

      /**
       * @description 渲染页面
       * @param  {can.Map} data 输入的观察者对象
       */
      render: function (data) {
        var html = can.view('templates/component/sf.b2c.mall.component.login.mustache', data);
        this.element.append(html)

        this.funPlaceholder(document.getElementById('user-name'));
      },

      /**
       * @description 修复ie7,8,9placeholder bug
       * @param  {String}
       * @return {String}
       */
      funPlaceholder:function(element){
        var placeholder = '';
        if(element && !("placeholder" in document.createElement("input")) && (placeholder = element.getAttribute("placeholder"))){
          element.onfocus = function(){
            if(this.value === placeholder){
              this.value = "";
            }
          };

          element.onblur = function(){
            if(this.value === ""){
              this.value = placeholder;
            }
          };

          if(element.value === ""){
            element.value = placeholder;
          }

        }
      },
      /**
       * @description 通过正则表达式检查账号类型
       * @param  {String} account 账号
       * @return {String} 返回MAIL或者MOBILE
       */
      checkTypeOfAccount: function (account) {
        // 检查账号的类型返回MOBILE或者MAIL
        var isTelNum =/^1\d{10}$/.test(account);
        var isEmail = /^([a-zA-Z0-9-_]*[-_\.]?[a-zA-Z0-9]+)*@([a-zA-Z0-9]*[-_]?[a-zA-Z0-9]+)+[\.][a-zA-Z]{2,3}([\.][a-zA-Z]{2})?$/.test(account);
        if(isTelNum){
          return 'MOBILE';
        }
        if(isEmail){
          return 'MAIL';
        }
      },

      /**
       * @description 显示用户名错误信息
       * @param  {String} data 错误信息提示内容
       */
      showUserNameError: function (data) {
        this.data.attr("userNameError",data);
      },

      /**
       * @description 显示密码错误信息
       * @param  {String} data 错误信息提示内容
       */
      showPwdError: function (data) {
        this.data.attr('pwdError',data)
      },

      /**
       * @description 获得焦点之后对账号输入内容做检查
       * @param  {dom} element jquery dom对象
       * @param  {event} event event对象
       */
      '.input-username keyup': function (element, event) {
        event && event.preventDefault();
        $('#username-error-tips').hide();
      },

      /**
       * @description 获得焦点之后对密码输入内容做检查
       * @param  {dom} element jquery dom对象
       * @param  {event} event event对象
       */
      '.input-password keyup': function (element, event) {
        event && event.preventDefault();
        $('#pwd-error-tips').hide();
        $(element).siblings('label').hide();
      },
      /**
       * @description 失去焦点之后对账号输入内容做检查
       * @param  {dom} element jquery dom对象
       * @param  {event} event event对象
       */
      '.input-username blur': function (element, event) {
        event && event.preventDefault();

        var username = $(element).val();

        if(!username){
          $('#username-error-tips').show();
          return this.showUserNameError('用户名不能为空');
        }

      },

      /**
       * @description 失去焦点之后对密码输入内容做检查
       * @param  {dom} element jquery dom对象
       * @param  {event} event event对象
       */
      '.input-password blur': function (element, event) {
        event && event.preventDefault();

        var password = $(element).val();

        if(!password){
          $(element).siblings('label').show();
          $('#pwd-error-tips').show();
          return this.showPwdError('密码不能为空');
        }

      },

      /**
       * @description 用户点击注册按钮之后回调
       * @param  {dom} element jquery dom对象
       * @param  {event} event event对象
       */
      '.btn-register click': function (element, event) {
        event && event.preventDefault();

        var that = this;
        var count = 0;
        $('#username-error-tips').hide();
        $('#pwd-error-tips').hide();
        // @todo 检查用户名和密码是否符合规范

        // 设置登录请求信息
        this.component.login.setData({
          accountId: this.data.attr('username'),
          type: this.checkTypeOfAccount(this.data.attr('username')),
          password: md5(this.data.attr('password') + SFConfig.setting.md5_key),
          vfCode: this.data.attr('verifiedCode')
        });

        // @todo 发起登录请求
        this.component.login.sendRequest()
          .done(function (data) {
              if (data.userId) {
                that.data.attr('autologin')

                if (window.localStorage) {
                  window.localStorage.setItem('csrfToken', data.csrfToken)
                } else {
                  $.jStorage.set('csrfToken', data.csrfToken);
                }

                // deparam过程 -- 从url中获取需要请求的sku参数
                var params = can.deparam(window.location.search.substr(1));
                setTimeout(function() {
                  window.location.href = params.from || 'index.html';
                }, 2000);
              }
          })
          .fail(function (error) {
            if(count <=3){
              count++;
            }
            var map ={
              '-140':'参数错误',
              '1000010':'未找到用户',
              '1000030':'用户名或密码错误',
              '1000070':'参数错误',
              '1000100':'验证码错误',
              '1000110':'账户尚未激活'
            };

            var errorText = map[error.toString()];
            $('#username-error-tips').show();
            that.showUserNameError(errorText);

          })

      }
    });
  });