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
  'sf.b2c.mall.widget.modal'
], function($, cookie, can, _, md5, SFComm, SFGetUserInfo, SFLogout, SFModal) {

  return can.Control.extend({

    defaults: {
      login: {
        myOrder: 'center.html#!&type=booking'
      },
      nologin: {
        myOrder: 'login.html'
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

      if ($.cookie('ct') == 1) {
        this.data = new can.Map(_.extend(this.defaults.login, {
          user: null
        }));
      } else {
        this.data = new can.Map(_.extend(this.defaults.nologin, {
          user: null
        }));
      }

      this.render(this.data);
      //this.supplement();
    },

    /**
     * @description 对页面进行渲染
     * @param  {Map} data 渲染页面的数据
     */
    render: function(data) {
      var html = can.view('templates/component/sf.b2c.mall.header.mustache', data);
      this.element.html(html);
    },

    // supplement: function() {
    //   var that = this;
    // },

    /**
     * [description 登录状态下的个人设置]
     * @param  {[type]} element
     * @param  {[type]} event
     * @return {[type]}
     */
    '#user-setting click': function(element, event) {
      event && event.preventDefault()

    },

    /**
     * [description 登录状态下的退出]
     * @param  {[type]} element
     * @param  {[type]} event
     * @return {[type]}
     */
    '#user-logout click': function(element, event) {
      event && event.preventDefault()

      var that = this;
      // can.when(sf.b2c.mall.model.user.logout())

      var logout = new SFLogout({});

      logout
        .sendRequest()
        .done(function(data) {
          that.data.attr('user', null);
          window.localStorage.removeItem('csrfToken');
          window.location.href = 'login.html'
        })
        .fail(function() {})
    },

    '#my-account click': function (element, event) {
      event && event.preventDefault();
      if (SFComm.prototype.checkUserLogin.call(this)) {

      }else{
        this.showLogin();
      }
    },

    showLogin: function () {
      this.component.modal.show({
        title: '登录顺丰海淘',
        html: '<iframe height="462" width="562" frameborder="no" src="login.html">'
      });
    }

    /**
     * [description 未登录状态下的登录窗口]
     * @param  {[type]} element
     * @param  {[type]} event
     * @return {[type]}
     */
    // '#user-login click': function(element, event) {
    //   event && event.preventDefault()

    // },

    /**
     * [description 未登录状态下得注册窗口]
     * @param  {[type]} element
     * @param  {[type]} event
     * @return {[type]}
     */
    // '#user-register click': function(element, event) {
    //   event && event.preventDefault()

    // },

    /**
     * [description 我的订单]
     * @param  {[type]} element
     * @param  {[type]} event
     * @return {[type]}
     */
    // '#my-order click': function(element, event) {
    //   event && event.preventDefault();

    //   if (sf.util.isLogin()) {
    //     window.open('center.html#!&type=booking')
    //   } else {
    //     window.open('login.html?from=' + encodeURIComponent('center.html#!&type=booking'));
    //   }

    //   return false;
    // }
  });
});