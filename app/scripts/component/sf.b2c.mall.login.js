'use strict';

// @description 申明命名空间
sf.util.namespace('b2c.mall.login');

can.route.attr();

/**
 * @class sf.b2c.mall.login
 * @author Michael.Lee (leewind19841209@gmail.com)
 * @description 登陆组件
 */
sf.b2c.mall.login = can.Control.extend({

  /**
   * @description 初始化方法，当调用new时会执行init方法
   * @param  {Dom} element 当前dom元素
   * @param  {Map} options 传递的参数
   */
  init: function (element, options) {

    this.data = this.defaults;

    var user = new can.Map({
      username: null,
      password: null,
      autologin: false
    });

    this.data.user = user;

    this.render(this.data);
  },

  /**
   * @description 默认值
   * @type {Map}
   */
  defaults: {
    alert: '您输入的账户或密码错误，请核对后重新输入',
    loginMethods: [
      { name: '顺丰会员登录', link: '#' },
      { name: '支付宝用户登录', link: '#' },
    ],
    forgetLink: '/find_password.html',
    // registerLink: '/register.html',
    loginError: can.compute(false),
    user: null
  },

  /**
   * @description 对页面进行渲染
   * @param  {Map} data 渲染页面的数据
   */
  render: function (data) {
    var html = can.view('templates/component/sf.b2c.mall.login.mustache', data);
    this.element.html(html);
  },

  errorMap: {
    '1000010': '用户名或密码错误',
    '1000030': '用户名或密码错误',
    '1000070': '参数错误',
    '1000110': '账户尚未激活'
  },

  /**
   * @description event:用户点击登陆按钮之后的动作回调 -发起登陆
   * @param  {Dom} element 触发事件的元素
   * @param  {Event} event   事件对象
   */
  '#sf-b2c-mall-login-btn click': function (element, event) {
    event && event.preventDefault();

    //$('.login-other-btn').remove('<a href="＃" id="resend-mail">重新发送激活邮件</a>');
    var data = {
      username: this.data.user.attr('username') || this.element.find('#login-text-username').val(),
      password: this.data.user.attr('password') || this.element.find('#login-text-password').val(),
      type: 'MAIL'
    };

    console.log(data)

    if (!data.username || !data.password) {
      return this.data.loginError('请输入用户名和密码！');
    }

    // 对密码加密
    data.password = md5(data.password + 'www.sfht.com');

    var that = this;
    can.when(sf.b2c.mall.model.user.login(data))
      .done(function (data) {

        if (data.stat.code === 0 && data.content[0].userId) {
          that.data.user.attr('autologin')

          if (window.localStorage) {
            window.localStorage.setItem('csrfToken', data.content[0].csrfToken)
          }else{
            // 没什么用啊，写在hash上面
            // can.route.attr('csrfToken', data.content[0].csrfToken);
            $.jStorage.set('csrfToken', data.content[0].csrfToken);
          }

          // deparam过程 -- 从url中获取需要请求的sku参数
          var params = can.deparam(window.location.search.substr(1));

          window.location.href = params.from || 'index.html';

        }else{
          //var resendMail = '<a href="＃" id="resend-mail">重新发送激活邮件</a>';
          var errorCode = data.stat.stateList[0].code;
          var errorText = that.errorMap[errorCode.toString()] || that.defaults.alert;

          if(errorCode === 1000110){

              $('#resend-mail').show();
          }


          // @todo 这里错误信息需要显示到前台
          that.data.loginError(errorText);
        }

        // 登陆成功跳转到首页
        // window.location.href = '/'

      })
      .fail(function (data) {
        that.data.loginError(that.defaults.alert);
      });
  },

  '#resend-mail click': function (element, event) {
    event && event.preventDefault();
    //var email = prompt("请输入邮箱","");
    var email = this.data.user.attr('username');
    //var that = this;

    if (email && !_.isEmpty(email)) {
      if(!sf.util.checkEmail(email)){
        return this.data.loginError('请输入正确的邮箱地址');
      }

      // if (!/(@sf-express.com)/.test(email)) {
      //   return this.setError('很抱歉，仅限内测用户注册');
      // }

      can.when(sf.b2c.mall.model.user.resendActivateMail({username: email}))
        .done(function (data) {
          if (data.stat.code === 0 && data.content[0].value) {
            setTimeout(function() {
              window.alert('重新发送激活邮件成功');
            }, 0);
          }else{
            var errorMap = {
              '1000010': '未找到用户',
              '1000160': '邮件请求频繁'
            }

            var errorCode = data.stat.stateList[0].code;
            var errorText = errorMap[errorCode] || '发送失败';
            alert(errorText);
          }
        })
        .fail(function () {

        });
    }else{
      window.alert('重新发送激活邮件失败')
    }
  },

  /**
   * @description event:用户点击关闭错误提示框的按钮，关闭错误提示
   * @param  {Dom} element 触发事件的元素
   * @param  {Event} event   事件对象
   */
  '.login-hide em click': function (element, event) {
    this.data.loginError(false);
  },

  /**
   * @description event:用户重新聚集在输入框时，将错误提示隐藏
   * @param  {Dom} element 触发事件的元素
   * @param  {Event} event   事件对象
   */
  'form dl input focus': function (element, event) {
    this.data.loginError(false);
  }
});