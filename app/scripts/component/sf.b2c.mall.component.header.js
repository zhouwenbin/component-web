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
  'store',
  'sf.b2c.mall.component.login.status.scanner',
  'sf.b2c.mall.framework.comm',
  'sf.b2c.mall.api.user.getUserInfo',
  'sf.b2c.mall.api.user.logout',
  'sf.b2c.mall.widget.modal',
  'sf.b2c.mall.business.config',
  'sf.b2c.mall.widget.not.support',
  'sf.util'
], function($, cookie, can, _, md5, store, SFLoginScanner, SFComm, SFGetUserInfo, SFLogout, SFModal, SFConfig, SFNotSupport, SFFn) {

  return can.Control.extend({

    defaults: {
      login: {
        myOrder: SFConfig.setting.link.orderlist
      },
      nologin: {
        myOrder: SFConfig.setting.link.login
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
      this.component.scanner = new SFLoginScanner();
      this.component.notSupport = new SFNotSupport('body');
      this.watchLoginState.call(this);

      this.afterLoginDest = null;

      if (SFComm.prototype.checkUserLogin.call(this)) {
        this.data = new can.Map(_.extend(this.defaults.login, {
          isUserLogin: true,
          index: SFConfig.setting.link.index
          // domain: SFConfig.setting.api.mainurl
        }));
      }else{
        this.data = new can.Map(_.extend(this.defaults.nologin, {
          isUserLogin: false,
          index: SFConfig.setting.link.index
          // domain: SFConfig.setting.api.mainurl
        }));
      }

      this.render(this.data);

      if (this.options.isForceLogin) {
        var that = this;
        // 暂时没有跨域存在在需要控制跳转的页面
        // setTimeout(function() {
          if (!SFComm.prototype.checkUserLogin.call(that)) {
            window.location.href = SFConfig.setting.link.index;
          }
        // }, 800);
      }
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
        window.location.href = SFConfig.setting.link.orderlist;
      }else{
        this.showLogin('orderlist');
      }
    },

    '#user-password-change click': function ($element, event) {
      event && event.preventDefault();

      if (SFComm.prototype.checkUserLogin.call(this)) {
        window.location.href = SFConfig.setting.link.passwordchange;
      }else{
        this.showLogin('passwordchange');
      }
    },

    '#user-center click': function ($element, event) {
      event && event.preventDefault();

      if (SFComm.prototype.checkUserLogin.call(this)) {
        window.location.href = SFConfig.setting.link.center;
      }else{
        this.showLogin('center');
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
            store.remove('csrfToken')
            window.location.href = SFConfig.setting.link.index;
          })
          .fail(function() {})
      }
    },

    '#my-account click': function(element, event) {
      event && event.preventDefault();
      // event.stopPropagation();

      // if(SFFn.isMobile.any()){
      //   return element.hover();
      // }

      // if (SFComm.prototype.checkUserLogin.call(this)) {

      // } else {
      //   this.showLogin('center');
      // }
    },

    '#user-login click': function (element, event) {
      event && event.preventDefault();
      this.showLogin();
    },

    '#user-register click': function (element, event) {
      event && event.preventDefault();
      this.showRegister();
    },

    showRegister: function (dest) {
      if (SFFn.isMobile.any()) {
        return window.location.href = SFConfig.setting.link.register;
      }

      if (dest) {
        this.afterLoginDest = dest
      }

      this.component.modal.show({
        title: '登录顺丰海淘',
        html: '<iframe height="535px" width="100%" frameborder="no" seamless="" src="'+ SFConfig.setting.link.register +'"></iframe>'
      });
      // this.watchLoginState.call(this);
      // this.setIframe.call(this);
    },

    showLogin: function(dest) {
      if (SFFn.isMobile.any()) {
        return window.location.href = SFConfig.setting.link.login + '?' + $.param({platform: 'mobile'});
      }


      if (dest) {
        this.afterLoginDest = dest
      }

      this.component.modal.show({
        title: '登录顺丰海淘',
        html: '<iframe height="535px" width="100%" frameborder="no" seamless="" src="'+ SFConfig.setting.link.login +'"></iframe>'
      });
      this.component.modal.setTitle('顺丰海淘');
    },

    watchLoginState: function(){
      var that = this;
      // if (!this.component.modal.isClosed()) {
        setInterval(function() {
          if (that.component.modal.isClosed()) {
            that.afterLoginDest = null
          }

          //console.log(SFComm.prototype.checkUserLogin.call(that))
          if (SFComm.prototype.checkUserLogin.call(that)) {
            if (!that.component.modal.isClosed()) {
              that.component.modal.hide();
            }

            if (that.afterLoginDest) {
              var link = SFConfig.setting.link[that.afterLoginDest] || that.afterLoginDest;
              window.location.href = link;
            }

            that.data.attr('isUserLogin', true);
          }else{
            that.data.attr('isUserLogin', false);
          }

          that.watchLoginState.call(that);
        }, 300);
      // }
    }
  });
});