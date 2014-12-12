'use strict';

/**
 * [description]
 * @param  {[type]} can
 * @return {[type]}
 */
define('sf.b2c.mall.header', ['can'], function(can) {

  can.Control.extend({

    defaults: {
      login: {
        my: 'center.html',
        order: 'center.html#!&type=booking',
        car: 'shopping.html'
      },
      nologin: {
        my: 'login.html',
        order: 'login.html',
        car: 'login.html'
      }
    },

    /**
     * @description 初始化方法，当调用new时会执行init方法
     * @param  {Dom} element 当前dom元素
     * @param  {Map} options 传递的参数
     */
    init: function(element, options) {
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
      this.supplement();
    },

    /**
     * @description 对页面进行渲染
     * @param  {Map} data 渲染页面的数据
     */
    render: function(data) {debugger;
      var html = can.view('templates/component/sf.b2c.mall.header.mustache', data);
      this.element.html(html);
    },

    supplement: function() {
      var that = this;
      can.when(sf.b2c.mall.model.user.getUserInfo())
        .done(function(data) {
          if (sf.util.access(data)) {
            that.data.attr('user', data.content[0]);

            //解决IE789重复登录后无法访问到cookie问题
            that.data.attr('my', that.defaults.login.my);
            that.data.attr('order', that.defaults.login.order);
            that.data.attr('car', that.defaults.login.car);
          }
        })
        .fail(function(data) {})
    },

    '#user-logout click': function(element, event) {
      event && event.preventDefault()

      var that = this;
      can.when(sf.b2c.mall.model.user.logout())
        .done(function(data) {
          if (sf.util.access(data) && data.content[0].value) {
            that.data.attr('user', null);
            window.localStorage.removeItem('csrfToken');
            window.location.href = 'login.html'
          };
        })
        .fail(function() {})
    },

    '#my-ht click': function(element, event) {
      event && event.preventDefault();

      if (sf.util.isLogin()) {
        window.open('center.html')
      } else {
        window.open('login.html?from=center.html')
      }

      return false;
    },

    '#my-order click': function(element, event) {
      event && event.preventDefault();

      if (sf.util.isLogin()) {
        window.open('center.html#!&type=booking')
      } else {
        window.open('login.html?from=' + encodeURIComponent('center.html#!&type=booking'));
      }

      return false;
    }
  });
});