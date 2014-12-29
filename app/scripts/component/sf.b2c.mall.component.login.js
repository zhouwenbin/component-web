'use strict';

define(

  'sf.b2c.mall.component.login',

  [
    'jquery',
    'can',
    'md5',
    'sf.b2c.mall.business.config',
    'sf.b2c.mall.api.user.webLogin',
    'sf.b2c.mall.api.user.needVfCode'
  ],

  function($, can, md5, SFConfig, SFLogin,SFNeedVfCode){

    var DEFAULT_CAPTCHA_LINK = 'http://checkcode.sfht.com/captcha/';
    var DEFAULT_CAPTCHA_ID = 'haitaob2c';
    var DEFAULT_CAPTCHA_HASH = '5f602a27181573d36e6c9d773ce70977';

    var COUNT = 0;

    var ERROR_NO_INPUT_USERNAME = '请输入顺丰海淘帐号';
    var ERROR_INPUT_USERNAME = '账户有误，请重新输入';
    var ERROR_NO_INPUT_PWD = '请输入密码';
    var ERROR_INPUT_PWD = '密码有误，请重新输入';
    var ERROR_NO_INPUT_VERCODE = '请输入验证码';
    var ERROR_INPUT_VERCODE = '您的验证码输入有误，请重新输入';

    return can.Control.extend({

      /**
       * @override
       * @description 初始化方法
       */
      init: function () {
        this.component = {};
        this.component.login = new SFLogin();
        this.component.needVfCode = new SFNeedVfCode();

        this.data = new can.Map({
          username: null,
          password:null,
          verifiedCode: null,
          isNeedVerifiedCode: false,
          verifiedCodeUrl:null,
          autologin:false,
          sessionId:null
        })

        this.render(this.data);
        this.getVerifiedCode();
      },

      /**
       * @description 渲染页面
       * @param  {can.Map} data 输入的观察者对象
       */
      render: function (data) {
        var html = can.view('templates/component/sf.b2c.mall.component.login.mustache', data);
        this.element.append(html);

        if(COUNT >=3){
          this.data.attr('isNeedVerifiedCode',true);
        }

        this.funPlaceholder(document.getElementById('user-name'));
      },
      /**
       * @description 验证码更换
       * @param  {String}
       * @return {String}
       */
      getVerifiedCode: function () {
        var sessionId = md5(Date().valueOf() + window.parseInt(Math.random()*10000));
        this.data.attr('sessionId', sessionId);
        var verifiedCodeUrl = DEFAULT_CAPTCHA_LINK + '?' + $.param({id: DEFAULT_CAPTCHA_ID, hash: DEFAULT_CAPTCHA_HASH, sessionID: sessionId});

        this.data.attr('verifiedCodeUrl', verifiedCodeUrl);
      },
      /**
       * @description 换一张验证码错误提示
       * @param  {String}
       * @return {String}
       */
      '#verified-code-btn click': function (element,event) {
        event && event.preventDefault();
        this.getVerifiedCode()
      },
      /**
       * @description 用户名验证
       * @param  {String}
       * @return {String}
       */
      checkUserName: function (username) {
        if (!username) {
          this.element.find('#username-error-tips').text(ERROR_NO_INPUT_USERNAME).show();
          return false;
        }else if(username.length>30){
          this.element.find('#username-error-tips').text(ERROR_INPUT_USERNAME).show();
          return false;
        }else{
          return true;
        }
      },
      /**
       * @description 密码验证
       * @param  {String}
       * @return {String}
       */
      checkPwd: function (password) {
        if (!password) {
          this.element.find('#pwd-error-tips').text(ERROR_NO_INPUT_PWD).show();
          return false;
        }else if(password.length>30){
          this.element.find('#pwd-error-tips').text(ERROR_INPUT_PWD).show();
          return false;
        }else{
          return true;
        }
      },
      /**
       * @description 验证码验证
       * @param  {String}
       * @return {String}
       */
      checkVerCode: function (code) {
        if (!code) {
          this.element.find('#code-error-tips').text(ERROR_NO_INPUT_VERCODE).show();
          return false;
        }else if(code.length>30){
          this.element.find('#code-error-tips').text(ERROR_INPUT_VERCODE).show();
          return false;
        }else{
          return true;
        }
      },
      /**
       * @description 是否需要显示验证码
       * @param  {String}
       * @return {String}
       */
      isNeedVerCode:function(){
        var username =this.data.attr('username');
        var that = this;
        this.component.needVfCode.setData({accountId:username});
        this.component.needVfCode.sendRequest()
          .done(function(data){
            if(data.value){
              that.data.attr('isNeedVerifiedCode',true);
            }else{
              that.data.attr('isNeedVerifiedCode',false);
            }
          })
          .fail(function(error){
            console.error(error);
          })
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
       * @description 获得焦点之后对账号输入内容做检查
       * @param  {dom} element jquery dom对象
       * @param  {event} event event对象
       */
      '.input-username keyup': function (element, event) {
        event && event.preventDefault();
        this.element.find('#username-error-tips').hide();
      },

      /**
       * @description 获得焦点之后对密码输入内容做检查
       * @param  {dom} element jquery dom对象
       * @param  {event} event event对象
       */
      '.input-password keyup': function (element, event) {
        event && event.preventDefault();
        this.element.find('#pwd-error-tips').hide();
        $(element).siblings('label').hide();
      },
      /**
       * @description 失去焦点之后对账号输入内容做检查
       * @param  {dom} element jquery dom对象
       * @param  {event} event event对象
       */
      '.input-username blur': function (element, event) {
        event && event.preventDefault();

        var username =this.data.attr('username');

        this.checkUserName.call(this,username);
        this.isNeedVerCode();
      },

      /**
       * @description 失去焦点之后对密码输入内容做检查
       * @param  {dom} element jquery dom对象
       * @param  {event} event event对象
       */
      '.input-password blur': function (element, event) {
        event && event.preventDefault();
        var password = $(element).val();
        this.checkPwd.call(this,password);

      },

      sendRequest:function(){
        var that =this;
        // @todo 发起登录请求
        this.component.login.sendRequest()
          .done(function (data) {
            if (data.userId) {
              that.data.attr('autologin')

              if (window.localStorage) {
                window.localStorage.setItem('csrfToken', data.csrfToken);
              } else {
                $.jStorage.set('csrfToken', data.csrfToken);
              }

              // deparam过程 -- 从url中获取需要请求的sku参数
              var params = can.deparam(window.location.search.substr(1));
              setTimeout(function () {
                window.location.href = params.from || 'index.html';
              }, 2000);
            }
          })
          .fail(function (error) {
            if(error === '1000300'){
              that.data.attr('isNeedVerifiedCode',true);
            }
            var map = {
              '-140': '账户名或登录密码错误，请重新输入',
              '1000010': '账户未注册，立即注册',
              '1000030': '账户名或登录密码错误，请重新输入',
              '1000070': '账户名或登录密码错误，请重新输入',
              '1000100': '验证码错误',
              '1000110': '账户尚未激活'
            };

            var errorText = map[error.toString()];
            if(errorText === '验证码错误'){
              $('#code-error-tips').text(errorText).show();
            }else{
              $('#username-error-tips').text(errorText).show();
            }
          })
      },
      /**
       * @description 用户点击注册按钮之后回调
       * @param  {dom} element jquery dom对象
       * @param  {event} event event对象
       */
      '.btn-register click': function (element, event) {
        event && event.preventDefault();

        var that = this;

        var username = $('#user-name').val();
        var password = $('#user-pwd').val();
        var verCode = $('#verified-code').val();

        $('#username-error-tips').hide();
        $('#pwd-error-tips').hide();
        $('#code-error-tips').hide();
        // @todo 检查用户名和密码是否符合规范

        // 设置登录请求信息
        if(this.data.attr('isNeedVerifiedCode')){
          if(this.checkUserName.call(this,username) && this.checkPwd.call(this,password) && this.checkVerCode.call(this,verCode)) {
            var vfCode = $.param({id: DEFAULT_CAPTCHA_ID, hash: DEFAULT_CAPTCHA_HASH, sessionID: this.data.sessionId, answer:this.data.attr('verifiedCode')});

            this.component.login.setData({
              accountId: this.data.attr('username'),
              type: this.checkTypeOfAccount(this.data.attr('username')),
              password: md5(this.data.attr('password') + SFConfig.setting.md5_key),
              vfCode: vfCode
            });
            that.sendRequest();
            that.getVerifiedCode();
          }
        }else{
          if(this.checkUserName.call(this,username) && this.checkPwd.call(this,password)) {
            this.component.login.setData({
              accountId: this.data.attr('username'),
              type: this.checkTypeOfAccount(this.data.attr('username')),
              password: md5(this.data.attr('password') + SFConfig.setting.md5_key)
            });
            that.sendRequest();

          }
        }
      }
    });
  });