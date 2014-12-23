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
          password: null,
          verifiedCode: null,
          isNeedVerifiedCode: false
        });

        this.render(this.data);
      },

      /**
       * @description 渲染页面
       * @param  {can.Map} data 输入的观察者对象
       */
      render: function (data) {
        var html = can.view('templates/component/sf.b2c.mall.component.login.mustache', data);
        this.element.append(html)
        this.element.find('.register').fadeIn('slow');
      },

      /**
       * @description 通过正则表达式检查账号类型
       * @param  {String} account 账号
       * @return {String} 返回MAIL或者MOBILE
       */
      checkTypeOfAccount: function (account) {
        // 检查账号的类型返回MOBILE或者MAIL
        return 'MAIL';
      },

      /**
       * @description 显示错误信息
       * @param  {String} data 错误信息提示内容
       */
      showErrorAlert: function (data) {

      },

      /**
       * @description 失去焦点之后对账号输入内容做检查
       * @param  {dom} element jquery dom对象
       * @param  {event} event event对象
       */
      '.input-username blur': function (element, event) {
        event && event.preventDefault();

        var username = this.element.val();
        var validateUserName = /^([a-zA-Z0-9-_]*[-_\.]?[a-zA-Z0-9]+)*@([a-zA-Z0-9]*[-_]?[a-zA-Z0-9]+)+[\.][a-zA-Z]{2,3}([\.][a-zA-Z]{2})?$/.test(username);
        if(!username){
          this.showErrorAlert();
        }
      },

      /**
       * @description 失去焦点之后对密码输入内容做检查
       * @param  {dom} element jquery dom对象
       * @param  {event} event event对象
       */
      '.input-password blur': function (element, event) {

      },

      /**
       * @description 用户点击注册按钮之后回调
       * @param  {dom} element jquery dom对象
       * @param  {event} event event对象
       */
      '.btn-register click': function (element, event) {
        event && event.preventDefault();

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
          .done(function (done) {

          })
          .fail(function (error) {

          })

      }
    });
  });