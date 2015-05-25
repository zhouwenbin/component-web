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
  'sf.b2c.mall.widget.message',
  'sf.b2c.mall.api.user.partnerLogin', //传参判断第三方账号是否绑定手机号码
  'sf.b2c.mall.framework.comm',
  'sf.b2c.mall.api.user.getUserInfo',
  'sf.b2c.mall.api.user.logout',
  'sf.b2c.mall.api.b2cmall.getHeaderConfig',
  'sf.b2c.mall.widget.modal',
  'sf.b2c.mall.business.config',
  'sf.b2c.mall.widget.not.support',
  'sf.util',
  'sf.b2c.mall.component.header.520',
  'text!template_header_user_navigator',
  'text!template_header_info_common',
  'text!template_header_channel_navigator',
  'text!template_header_info_step_fillinfo',
  'text!template_header_info_step_pay',
  'text!template_header_info_step_success'
], function(text, $, cookie, can, _, md5, store, SFMessage, SFPartnerLogin, SFComm, SFGetUserInfo, SFLogout, SFGetHeaderConfig, SFGetTotalCount, SFAddItemToCart, SFModal, SFConfig, SFNotSupport, SFFn, SFHeader520,

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
      channels: [{
        name: '首页',
        link: 'http://www.sfht.com/index.html',
        extra: ""
      }, {
        name: '母婴专区',
        link: 'http://www.sfht.com/index.html',
        extra: ""
      }, {
        name: '个护美装',
        link: 'http://www.sfht.com/index.html',
        extra: ""
      }, {
        name: '食品保健',
        link: 'http://www.sfht.com/index.html',
        extra: ""
      }, {
        name: '生活服饰',
        link: 'http://www.sfht.com/index.html',
        extra: '<span class="icon icon54">NEW</span>'
      }, {
        name: '黑5狂欢',
        link: 'http://www.sfht.com/index.html',
        extra: '<span class="icon icon55">HOT</span>'
      }, {
        name: '正品保障',
        link: 'http://www.sfht.com/index.html',
        extra: ""
      }],
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
          nickname: null,
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

      // @author Michael.Lee
      // 将更新购物车事件注册到window上
      // 其他地方添加需要更新mini购物车的时候调用can.trigger('updateCart')
      can.on.call(window, 'updateCart', _.bind(this.updateCart, this));

      // @author Michael.Lee
      // 将弹出登录框事件注册到window上
      // 其他地方需要弹出登录框的时候调用window.trigger('showLogin')
      can.on.call(window, 'showLogin', _.bind(this.showLogin, this));
    },

    /**
     * @author Michael.Lee
     * @description 用户点击购物车之后的动作变化
     * @param  {element}  $el   点击对象的jquery对象
     * @param  {event}    event 绑定在点击对象的event对象
     * @return
     */
    '.mini-cart-container click': function($el, event) {
      event && event.preventDefault();

      var href = $el.attr('href');
      if (SFComm.prototype.checkUserLogin.call(this)) {
        window.location.href = href;
      } else {
        // can.trigger(window, 'showLogin', [href]);
        this.showLogin(href);
      }
    },

    /**
     * @author Michael.Lee
     * @description 检查有没有临时的添加购物车的任务需要执行
     * @return
     */
    checkTempActionAddCart: function() {
      var params = store.get('temp-action-addCart');

      if (params) {
        var itemId = params.itemId;
        var num = params.num || 1;

        if (itemId && num) {
          store.remove('temp-action-addCart');
          this.addCart(itemId, num);
        }
      }
    },

    /**
     * @author Michael.Lee
     * @description 加入购物车
     */
    addCart: function(itemId, num) {
      var addItemToCart = new SFAddItemToCart({
        itemId: itemId,
        num: num || 1
      });

      // 添加购物车发送请求
      addItemToCart.sendRequest()
        .done(function(data) {
          if (data.value) {
            // 更新mini购物车
            can.trigger(window, 'updateCart');
          }
        })
        .fail(function(data) {
          // @todo 添加失败提示
          var error = SFAddItemToCart.api.ERROR_CODE[data.code];

          if (error) {
            // @todo 需要确认是不是需要提交
          }
        })
    },

    /**
     * @author Michael.Lee
     * @description 更新导航栏购物车，调用接口刷新购物车数量
     */
    updateCart: function() {
      var that = this;

      // 如果用户已经登陆了，可以进行购物车更新
      // @todo 如果是白名单的用户可以看到购物车
      if (SFComm.prototype.checkUserLogin.call(this)) {
        this.element.find('.mini-cart').show();

        var getTotalCount = new SFGetTotalCount();
        getTotalCount.sendRequest()
          .done(function(data) {
            // @description 将返回数字显示在头部导航栏
            // 需要跳动的效果
            that.element.find('.mini-cart-num').text(data.value);
          })
          .fail(function(data) {
            // 更新mini cart失败，不做任何显示
          });
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
      'template_header_user_navigator': function(data, isForce) {
        var renderFn = can.mustache(template_header_user_navigator);
        var html = renderFn(data);

        var $el = this.element.find('.header-user-navigator');

        // 如果用户登录一定进行强刷，如果服务端没有渲染都刷
        if (isForce || ($el && $el.length > 0 && (data.isUserLogin || !this.element.hasClass('serverRendered')))) {
          $el.html(html);
        }
      },

      'template_header_info_common': function(data) {
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

      'template_header_channel_navigator': function(data) {
        var renderFn = can.mustache(template_header_channel_navigator);
        var html = renderFn(data, this.helpers);

        this.element.find('.header-channel-navigator').html(html);
      },

      'template_header_520': function(data) {
        new SFHeader520('.sf-b2c-mall-header', {
          "originheader": this
        });
      }
    },

    supplement: function(data) {
      var that = this;

      this.renderMap['template_header_user_navigator'].call(this, data);

      var pathname = window.location.pathname;

      // @note 只有在首页需要显示浮动导航栏
      if (pathname == '/' || pathname == '/index.html') {
        /*  520活动暂时关闭浮动导航栏
        $(window).scroll(function() {
          setTimeout(function() {
            if ($(window).scrollTop() > 166) {
              $(".nav-fixed .nav-inner").stop(true, false).animate({
                top: '0px',
                opacity: 1
              }, 300);
            } else {
              $(".nav-fixed .nav-inner").stop(true, false).animate({
                top: '-56px',
                opacity: 0
              }, 0);
            }

          }, 200);
        })
        */
        $('#js-focus')
          .hover(function() {
            $('.nav-qrcode').addClass('show');
            return false;
          })
          .bind('mouseleave', function() {
            $('.nav-qrcode').removeClass('show');
            return false;
          })
      };
      //@note 判断是否登录，登录不做任何操作，没有登录解析url传回服务端
      var authResp = can.deparam(window.location.search.substr(1));
      if (!SFComm.prototype.checkUserLogin.call(that) && !can.isEmptyObject(authResp) && typeof authResp.partnerId != 'undefined') {
        delete authResp.partnerId;
        var partnerLogin = new SFPartnerLogin({
          'partnerId': store.get('alipay-or-weixin'),
          'authResp': decodeURIComponent($.param(authResp))
        });
        partnerLogin.sendRequest()
          .done(function(data) {
            if (data.tempToken) {
              store.set('tempToken', data.tempToken);
              that.component.modal.show({
                title: '绑定账号',
                html: '<iframe height="260px" width="100%" frameborder="no" seamless="" src="' + SFConfig.setting.link.bindaccount + '"></iframe>'
              });
            } else {
              store.set('csrfToken', data.csrfToken);

              // 登陆后设置下昵称，不要调用userLoginSccuessCallback
              var userinfo = $.cookie(APPID + '_uinfo');
              var arr = [];
              if (userinfo) {
                arr = userinfo.split(',');
              }

              that.data.attr('isUserLogin', true);
              that.data.attr('nickname', arr[0]);

            }
          }).fail(function(errorCode) {})

      };

      that.setNavActive();

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
     * [setNavActive 导航设定为active]
     */
    setNavActive: function() {
      var url = window.location.href;

      //URL补齐
      if (url == "http://www.sfht.com/") {
        url = url + "index.html";
      }

      var navHref = $(".nav-inner").find("a");
      _.each(navHref, function(item) {

        if (item.href == url) {
          $(item).parent().addClass("active");
        }
      })
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
      } else {
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

    '#user-name click': function($element, event) {
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
            setTimeout(function() {
              window.location.href = SFConfig.setting.link.index;
            }, 2000);

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
        html: '<iframe height="450px" width="100%" frameborder="no" seamless="" src="' + SFConfig.setting.link.register + '"></iframe>'
      });
      // this.watchLoginState.call(this);
      // this.setIframe.call(this);
    },

    showLogin: function(dest) {

      // 如果没有指定去哪个页面，则使用当前页面 （因为微信要转跳后关闭后去到指定页面，所以这里必须要设定）
      if (typeof dest == "undefined") {
        store.set("weixinto", encodeURIComponent(window.location.href));
      } else {
        // 给微信登录使用(！！！位置不能移)
        store.set("weixinto", encodeURIComponent(SFConfig.setting.link[dest] || dest));
      }

      if (SFFn.isMobile.any()) {
        return window.location.href = SFConfig.setting.link.ilogin;
      }

      if (dest) {
        this.afterLoginDest = dest
      }

      this.component.modal.show({
        title: '顺丰海淘',
        html: '<iframe height="450px" width="100%" frameborder="no" seamless="" src="' + SFConfig.setting.link.login + '"></iframe>'
      });
      this.component.modal.setTitle('顺丰海淘');
    },

    watchLoginState: function() {
      var that = this;
      document.domain = "sfht.com";
      // can.on.call(window, 'login', function () {
      window.userLoginSccuessCallback = function() {

        if (that.component.modal.isClosed()) {
          that.afterLoginDest = null;
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

          that.data.attr('isUserLogin', true);
          that.data.attr('nickname', arr[0]);

          // 登录后刷新页面，520项目的注册信息要隐藏
          if (!that.afterLoginDest) {
            window.location.reload();
          }
          // that.renderMap['template_header_user_navigator'].call(that, that.data);

        } else {
          that.data.attr('isUserLogin', false);
          that.data.attr('nickname', null);

          // that.renderMap['template_header_user_navigator'].call(that, that.data);
        }
      };

      window.popMessage = function() {
        setTimeout(function() {
          new SFMessage(null, {
            'tip': "礼包领取成功，请至我的优惠券查看！",
            'type': 'success'
          });
        }, 1000);
      }
    }
  });
});