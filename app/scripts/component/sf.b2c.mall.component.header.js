'use strict';

/**
 * [description]
 * @param  {[type]} can
 * @return {[type]}
 */
define('sf.b2c.mall.component.header', [
  'text',
  'jquery',
  'jquery.cookie',
  'can',
  'underscore',
  'md5',
  'store',
  'sf.b2c.mall.framework.comm',
  'sf.b2c.mall.api.user.getUserInfo',
  'sf.b2c.mall.api.user.logout',
  'sf.b2c.mall.api.b2cmall.getHeaderConfig',
  'sf.b2c.mall.widget.modal',
  'sf.b2c.mall.business.config',
  'sf.b2c.mall.widget.not.support',
  'sf.util',
  'text!template_header_user_navigator',
  'text!template_header_info_common',
  'text!template_header_channel_navigator',
  'text!template_header_info_step_fillinfo',
  'text!template_header_info_step_pay',
  'text!template_header_info_step_success'
], function(text, $, cookie, can, _, md5, store, SFComm, SFGetUserInfo, SFLogout, SFGetHeaderConfig, SFModal, SFConfig, SFNotSupport, SFFn,
  template_header_user_navigator,
  template_header_info_common,
  template_header_channel_navigator,
  template_header_info_step_fillinfo,
  template_header_info_step_pay,
  template_header_info_step_success) {

  var APPID = 1;

  return can.Control.extend({

    defaults: {
      login: {
        myOrder: SFConfig.setting.link.orderlist
      },
      nologin: {
        myOrder: SFConfig.setting.link.login
      },
      channels: [
        { name: '首页', link: 'http://www.sfht.com/index.html', extra: "" },
        { name: '母婴专区', link: 'http://www.sfht.com/index.html', extra: "" },
        { name: '个护美装', link: 'http://www.sfht.com/index.html', extra: "" },
        { name: '食品保健', link: 'http://www.sfht.com/index.html', extra: "" },
        { name: '生活服饰', link: 'http://www.sfht.com/index.html', extra: '<span class="icon icon54">NEW</span>' },
        { name: '黑5狂欢', link: 'http://www.sfht.com/index.html', extra: '<span class="icon icon55">HOT</span>' },
        { name: '正品保障', link: 'http://www.sfht.com/index.html', extra: "" }
      ],
      slogan: 'http://www.sfht.com/img/slogan.png'
    },

    helpers: {
      'sf-isactive': function(name, channel, options) {
        if (name() == channel()) {
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
      this.component.modal = new SFModal('body');
      // this.component.scanner = new SFLoginScanner();
      this.component.notSupport = new SFNotSupport('body');

      this.watchLoginState.call(this);

      this.afterLoginDest = null;

      if (SFComm.prototype.checkUserLogin.call(this)) {

        var userinfo = $.cookie(APPID + '_uinfo');
        var arr = [];
        if (userinfo) {
          arr = userinfo.split(',');
        }

        this.data = new can.Map(_.extend(this.defaults.login, {
          isUserLogin: true,
          index: SFConfig.setting.link.index,
          nickname: arr[0],
          channels: this.defaults.channels,
          current: this.options.channel || '',
          slogan: this.defaults.slogan
          // domain: SFConfig.setting.api.mainurl
        }));

      } else {
        this.data = new can.Map(_.extend(this.defaults.nologin, {
          isUserLogin: false,
          index: SFConfig.setting.link.index,
          nickname:null,
          channels: this.defaults.channels,
          current: this.options.channel || '',
          slogan: this.defaults.slogan
            // domain: SFConfig.setting.api.mainurl
        }));
      }

      var that = this;
      this.data.bind("isUserLogin", function(ev, newVal, oldVal) {
        if (newVal != oldVal) {
          that.renderMap['template_header_user_navigator'].call(that, that.data, true);
        };
      });

      if (!this.element.hasClass('serverRendered')) {
        this.render(this.data);
      }

      this.supplement(this.data);

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
      this.renderMap['template_header_info_common'].call(this, data);
      this.renderMap['template_header_channel_navigator'].call(this, data);

      // var html = can.view('templates/component/sf.b2c.mall.header_01.mustache', data);
      // this.element.html(html);
    },

    renderMap: {
      'template_header_user_navigator': function (data, isForce) {
        var renderFn = can.mustache(template_header_user_navigator);
        var html = renderFn(data);

        var $el = this.element.find('.header-user-navigator');

        // 如果用户登录一定进行强刷，如果服务端没有渲染都刷
        if (isForce || ($el && $el.length > 0 && (data.isUserLogin || !this.element.hasClass('serverRendered')))) {
          $el.html(html);
        }
      },

      'template_header_info_common': function (data) {
        var $el = this.element.find('.header-info-common');

        var templateid = 'template_header_info_common';

        if ($el && $el.length > 0) {
          templateid = $el.attr('data-templateid');
        }

        var map = {
          'template_header_info_common': template_header_info_common,
          'template_header_info_step_fillinfo': template_header_info_step_fillinfo,
          'template_header_info_step_pay': template_header_info_step_pay,
          'template_header_info_step_success': template_header_info_step_success
        }

        var renderFn = can.mustache(map[templateid]);
        var html = renderFn(data);

        this.element.find('.header-info-common').html(html);
      },

      'template_header_channel_navigator': function (data) {
        var renderFn = can.mustache(template_header_channel_navigator);
        var html = renderFn(data, this.helpers);

        this.element.find('.header-channel-navigator').html(html);
      },
    },

    supplement: function (data) {
      var that = this;

      this.renderMap['template_header_user_navigator'].call(this, data);

      var pathname = window.location.pathname;

      // @note 只有在首页需要显示浮动导航栏
      if (pathname == '/' || pathname == '/index.html') {
        $(window).scroll(function(){
            setTimeout(function() {
              if($(window).scrollTop() > 166){
                  $(".nav").addClass('nav-fixed');
                  $(".nav-fixed .nav-inner").stop(true,false).animate({
                    top:'0px',
                    opacity:1
                  },300);
              }else{
                  $(".nav-fixed .nav-inner").stop(true,false).animate({
                    top:'-56px',
                    opacity:1
                  },300);
                  $(".nav").removeClass('nav-fixed');
              }

            }, 200);
        })
        $('#js-focus')
          .hover(function(){
            $('.nav-qrcode').addClass('show');
            return false;
          })
          .bind('mouseleave', function(){
            $('.nav-qrcode').removeClass('show');
            return false;
          })
      };

      // @note 通过服务端进行渲染，暂时这里不做动作
      // SFGetHeaderConfig
      //   .sendRequest()
      //   .done(function(config){
      //     _.each(config, function(value, key, list){
      //       that.data.attr(key, value);
      //     });

      //     // 暂时不做修改
      //   })
      //   .fail(function (errorCode) {

      //   })
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

    '#user-orderlist click': function($element, event) {
      event && event.preventDefault();

      if (SFComm.prototype.checkUserLogin.call(this)) {
        window.location.href = SFConfig.setting.link.orderlist + window.location.search + window.location.hash;
      }else{
        this.showLogin('orderlist');
      }
    },

    '#user-password-change click': function($element, event) {
      event && event.preventDefault();

      if (SFComm.prototype.checkUserLogin.call(this)) {
        window.location.href = SFConfig.setting.link.passwordchange;
      } else {
        this.showLogin('passwordchange');
      }
    },

    '#user-center click': function($element, event) {
      event && event.preventDefault();

      if (SFComm.prototype.checkUserLogin.call(this)) {
        window.location.href = SFConfig.setting.link.center;
      } else {
        this.showLogin('center');
      }
    },

    '#user-name click': function ($element, event) {
      event && event.preventDefault();

      if (SFComm.prototype.checkUserLogin.call(this)) {
        window.location.href = SFConfig.setting.link.center;
      } else {
        this.showLogin('center');
      }
    },

    '#user-coupon click': function($element, event) {
      event && event.preventDefault();

      if (SFComm.prototype.checkUserLogin.call(this)) {
        window.location.href = SFConfig.setting.link.coupon;
      } else {
        this.showLogin('coupon');
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
            store.remove('csrfToken');
            setTimeout(function(){
              window.location.href = SFConfig.setting.link.index;
            },2000);

              store.remove('provinceId');
              store.remove('cityId');
              store.remove('regionId');

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

    '#user-login click': function(element, event) {
      event && event.preventDefault();
      this.showLogin();
    },

    '#user-register click': function(element, event) {
      event && event.preventDefault();
      this.showRegister();
    },

    showRegister: function(dest) {
      if (SFFn.isMobile.any()) {
        return window.location.href = SFConfig.setting.link.iregister;
      }

      if (dest) {
        this.afterLoginDest = dest
      }

      this.component.modal.show({
        title: '顺丰海淘',
        html: '<iframe height="535px" width="100%" frameborder="no" seamless="" src="' + SFConfig.setting.link.register + '"></iframe>'
      });
      // this.watchLoginState.call(this);
      // this.setIframe.call(this);
    },

    showLogin: function(dest) {

      // 给微信登录使用(！！！位置不能移)
      store.set("weixinto", SFConfig.setting.link[dest] || dest);

      // 如果没有指定去哪个页面，则使用当前页面 （因为微信要转跳后关闭后去到指定页面，所以这里必须要设定）
      if (typeof dest == "undefined") {
        store.set("weixinto", window.location.href);
      }

      if (SFFn.isMobile.any()) {
        return window.location.href = SFConfig.setting.link.ilogin;
      }

      if (dest) {
        this.afterLoginDest = dest
      }

      this.component.modal.show({
        title: '顺丰海淘',
        html: '<iframe height="535px" width="100%" frameborder="no" seamless="" src="' + SFConfig.setting.link.login + '"></iframe>'
      });
      this.component.modal.setTitle('顺丰海淘');
    },

    watchLoginState: function() {
      var that = this;
      // if (!this.component.modal.isClosed()) {
      setInterval(function() {
        if (that.component.modal.isClosed()) {
          that.afterLoginDest = null
        }

        //console.log(SFComm.prototype.checkUserLogin.call(that))
        if (SFComm.prototype.checkUserLogin.call(that)) {
          // if (!that.component.modal.isClosed()) {
            that.component.modal.hide();
          // }

          if (that.afterLoginDest) {
            var link = SFConfig.setting.link[that.afterLoginDest] || that.afterLoginDest;
            window.location.href = link;
          }

          var userinfo = $.cookie(APPID + '_uinfo');
          var arr = [];
          if (userinfo) {
            arr = userinfo.split(',');
          }
          //window.location.reload();
          that.data.attr('isUserLogin', true);
          that.data.attr('nickname',arr[0]);

          // that.renderMap['template_header_user_navigator'].call(that, that.data);

        } else {
          that.data.attr('isUserLogin', false);
          that.data.attr('nickname',null);

          // that.renderMap['template_header_user_navigator'].call(that, that.data);
        }


        // that.watchLoginState.call(that);
      }, 500);
      // }
    }
  });
});
