'use strict';

/**
 * [description]
 * @param  {[type]} can
 * @return {[type]}
 */
define('sf.b2c.mall.component.header', ['jquery',
  'jquery.cookie',
  'can',
  'underscore',
  'md5',
  'sf.b2c.mall.framework.comm',
  'sf.b2c.mall.api.user.getUserInfo',
  'sf.b2c.mall.api.user.logout',
  'sf.b2c.mall.widget.modal',
  'sf.b2c.mall.business.config'
], function($, cookie, can, _, md5, SFComm, SFGetUserInfo, SFLogout, SFModal, SFConfig) {

  return can.Control.extend({

    defaults: {
      login: {
        myOrder: SFConfig.setting.api.mailurl + '/orderList.html'
      },
      nologin: {
        myOrder: SFConfig.setting.api.mailurl + 'login.html'
      }
    },

    /**
     * @description 初始化方法，当调用new时会执行init方法
     * @param  {Dom} element 当前dom元素
     * @param  {Map} options 传递的参数
     */
    init: function(element, options) {
      this.component = {};
      this.component.modal = new SFModal('body');

      if (SFComm.prototype.checkUserLogin.call(this)) {
        this.data = new can.Map(_.extend(this.defaults.login, {
          isUserLogin: true
        }));
      }else{
        this.data = new can.Map(_.extend(this.defaults.nologin, {
          isUserLogin: false
        }));
      }

      this.render(this.data);
    },

    /**
     * @description 对页面进行渲染
     * @param  {Map} data 渲染页面的数据
     */
    render: function(data) {
      var html = can.view('templates/component/sf.b2c.mall.header.mustache', data);
      this.element.html(html);
    },

    /**
     * 登录状态下的个人设置
     * @param  {[type]} element
     * @param  {[type]} event
     * @return {[type]}
     */
    '#user-setting click': function(element, event) {
      event && event.preventDefault()

    },

    '#user-orderlist click': function ($element, event) {
      event && event.preventDefault();

      if (SFComm.prototype.checkUserLogin.call(this)) {
        window.location.pathname = 'orderlist.html'
      }else{
        this.showLogin();
      }
    },

    '#user-password-change click': function ($element, event) {
      event && event.preventDefault();

      if (SFComm.prototype.checkUserLogin.call(this)) {
        window.location.pathname = 'password-change.html';
      }else{
        this.showLogin();
      }
    },

    '#user-center click': function ($element, event) {
      event && event.preventDefault();

      if (SFComm.prototype.checkUserLogin.call(this)) {
        window.location.pathname = 'center.html'
      }else{
        this.showLogin();
      }
    },

    /**
     * 登录状态下的退出
     * @param  {[type]} element
     * @param  {[type]} event
     * @return {[type]}
     */
    '#user-logout click': function(element, event) {
      event && event.preventDefault()

      var that = this;

      if (SFComm.prototype.checkUserLogin.call(this)) {
        var logout = new SFLogout({});

        logout
          .sendRequest()
          .done(function(data) {
            that.data.attr('user', null);
            window.localStorage.removeItem('csrfToken');
            window.location.reload();
            // window.location.href = SFConfig.setting.api.mailurl + 'login.html'
          })
          .fail(function() {})
      }
    },

    '#my-account click': function(element, event) {
      event && event.preventDefault();
      if (SFComm.prototype.checkUserLogin.call(this)) {

      } else {
        this.showLogin();
      }
    },

    '#user-login click': function (element, event) {
      event && event.preventDefault();
      this.showLogin();
    },

    '#user-register click': function (element, event) {
      event && event.preventDefault();
      this.showRegister();
    },

    showRegister: function () {
      this.component.modal.show({
        title: '登录顺丰海淘',
        html: '<iframe height="535px" width="100%" frameborder="no" seamless="" src="register.html">'
      });
      this.setIframe.call(this);
    },

    showLogin: function() {
      this.component.modal.show({
        title: '登录顺丰海淘',
        html: '<iframe height="535px" width="100%" frameborder="no" seamless="" src="login.html">'
      });
      this.setIframe.call(this);
    },

    setIframe: function() {
      var link = $('iframe').contents().find('title').text();
      if (link.indexOf('登陆') > -1) {
        this.component.modal.setTitle('登录顺丰海淘');
      } else if (link.indexOf('注册') > -1) {
        this.component.modal.setTitle('注册顺丰海淘');
      }

      this.watchIframe.call(this);
      this.watchLoginState.call(this);
    },

    watchIframe: function() {
      var that = this;
      if (!this.component.modal.isClosed()) {
        setTimeout(function() {
          that.setIframe.call(that);
        }, 300);
      };
    },

    watchLoginState: function(){
      var that = this;
      if (!this.component.modal.isClosed()) {
        setTimeout(function() {
          if (SFComm.prototype.checkUserLogin.call(that)) {
            that.component.modal.hide();
            that.watchLoginState.call(that);
            that.data.attr('isUserLogin', true);
          }else{
            that.data.attr('isUserLogin', false);
          }
        }, 300);
      }
    }
  });
});