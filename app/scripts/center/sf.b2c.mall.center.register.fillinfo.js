'use strict';

// @description 申明命名空间
sf.util.namespace('b2c.mall.center.register.fillinfo');

/**
 * @class sf.b2c.mall.center.register.fillinfo
 * @author Michael.Lee (leewind19841209@gmail.com)
 * @description 用户注册信息填写
 */
sf.b2c.mall.center.register.fillinfo = can.Control.extend({

  /**
   * @description 初始化方法，当调用new时会执行init方法
   * @param  {Dom} element 当前dom元素
   * @param  {Map} options 传递的参数
   */
  init: function () {
    // 暂时不用default的链接数据
    this.paint({});
  },

  /**
   * @description 默认参数
   * @type {Map}
   */
  defaults: {
    title: '使用三方平台账户注册',
    others: [{
      name: '顺丰会员注册',
      link: '#',
      imgUrl: 'images/l1.png'
    }, {
      name: '支付宝会员注册',
      link: '#',
      imgUrl: 'images/l2.png'
    }, {
      name: '微博用户注册',
      link: '#',
      imgUrl: 'images/l4.png'
    }, {
      name: '腾讯用户注册',
      link: '#',
      imgUrl: 'images/l3.png'
    }]
  },

  /**
   * @description 对页面做第一次绘制
   * @param  {Map} data 绘制页面的数据
   */
  paint: function (data) {
    this.data = this.parse(data);

    this.data.user = new can.Map({
      username: null,
      password: null,
      repeatPassword: null,
      inviteCode: null,
      verifiedCode: null,
      verifiedCodeUrl: null,
      sessionId: null
    });

    this.data.result = {
      id: 'haitaob2c',
      hash: '5f602a27181573d36e6c9d773ce70977'
    }

    this.data.error = can.compute(false);
    this.data.errorContent = can.compute(null);
    this.data.isSfExpress = can.compute(false);

    this.render(this.data);
    this.getVerifiedCode();
  },

  getVerifiedCode: function () {
    var sessionId = md5(Date().valueOf() + parseInt(Math.random()*10000));
    this.data.user.attr('sessionId', sessionId);
    var verifiedCodeUrl = sf.config.current.captcha + '?' + $.param({id: this.data.result.id, hash: this.data.result.hash, sessionID: sessionId});
    this.data.user.attr('verifiedCodeUrl', verifiedCodeUrl);
  },

  /**
   * @description 对页面进行渲染
   * @param  {Map} data 渲染页面的数据
   */
  render: function (data) {
    var html = can.view('templates/center/sf.b2c.mall.center.register.fillinfo.mustache', data);
    this.element.html(html);
  },

  /**
   * @description 获取用户注册的email/用户名
   * @return {String} Email Address
   */
  getEmail: function () {
    return this.data.user.username;
  },

  /**
   * @description 将datamodel转化为viewmodel
   * @param  {Map} data datamodel
   * @return {Map}      viewmodel
   */
  parse: function (data) {
    return data;
  },

  /**
   * @description 设置error的信息
   * @param {String} data 错误信息
   * @return {Boolean} 返回是否生效
   */
  setError: function (data) {
    this.data.error(true);
    this.data.errorContent(data);
    return true;
  },

  /**
   * @description event:用户提交注册信息
   * @param  {Dom} element 触发事件的元素
   * @param  {Event} event   事件对象
   */
  '#sf-b2c-mall-register-input-submit-btn click': function (element, event) {

    if (this.data.user.attr('password') != this.data.user.attr('repeatPassword')) {
      return this.setError('登录密码与确认密码不一致');
    }

    var data = {
      username: this.data.user.attr('username'),
      password: _.str.trim(this.data.user.attr('password')),
      repeatPassword: _.str.trim(this.data.user.attr('repeatPassword')),
      inviteCode: this.data.user.attr('inviteCode') || 1,
      verifiedCode: _.str.trim(this.data.user.attr('verifiedCode'))
    };

    // 验证是否username输入是mail
    if(!sf.util.checkEmail(data.username)){
      return this.setError('用户名请输入正确的邮箱地址');
    }

    if (!data.password) {
      return this.setError('请输入登录密码');
    }

    if (!data.repeatPassword) {
      return this.setError('请重复输入登录密码')
    };

    if (data.password !== data.repeatPassword) {
      return this.setError('登录密码与确认密码不一致');
    }

    if (data.password.length < 6 || data.password.length > 18) {
      return this.setError('密码请设为6-18位字母、数字或标点符号');
    }

    //针对内部员工 不需要输入邀请码，其他用户需要输入邀请码
    if (!/(@sf-express.com)/.test(data.username) && 1 == data.inviteCode){
      return this.setError('请输入邀请码');
    }

    if (!data.verifiedCode || data.verifiedCode.length !== 6) {
      return this.setError('请输入正确的验证码');
    }

    // 对密码做加密处理
    data.password = md5(data.password + 'www.sfht.com');
    data.verifiedCode = $.param({id: this.data.result.id, hash: this.data.result.hash, sessionID: this.data.user.sessionId, answer: data.verifiedCode});

    var that = this;
    can.when(sf.b2c.mall.model.user.mailRegister(data))
      .done(function (data) {
        if (data.stat.code === 0 && data.content[0].value) {
          can.route.attr('tag', 'confirminfo');
        }else{
          var errorCode = data.stat.stateList[0].code;
          var errorText = that.registerErrorMap[errorCode] || '注册失败';
          that.setError(errorText);
          that.getVerifiedCode();
        }
      })
      .fail(function (data) {

        // 显示错误
        // that.setError()
      });
  },

  registerErrorMap: {
    1000020: '账户已注册',
    1000050: '试运营阶段仅针对内测用户注册',
    1000090: '邀请码错误',
    1000100: '验证码错误',
    1000180: '该邀请码已经被使用'
  },

  /**
   * @description event:用户点击error提示上的关闭按钮，清除error提示
   * @param  {Dom} element 触发事件的元素
   * @param  {Event} event   事件对象
   */
  '.login-error em click': function (element, event) {
    this.data.error(false);
  },

  /**
   * @description event:input元素被聚焦之后清除所有的error提示
   * @param  {Dom} element 触发事件的元素
   * @param  {Event} event   事件对象
   */
  'input focus': function (element, event) {
    this.data.error(false);
  },

  /**
   * @description event:用户点击验证码图片更新验证码
   * @param  {Dom} element 触发事件的元素
   * @param  {Event} event   事件对象
   */
  '.verified-code-img click': function (element, event) {
    event && event.preventDefault();
    this.getVerifiedCode();
  },

  /**
   * @description event:username输入失焦之后，判断username是否已经存在
   * @param  {Dom} element 触发事件的元素
   * @param  {Event} event   事件对象
   */
  '#sf-b2c-mall-register-username-input blur': function (element, event) {
    var username = this.data.user.attr('username');
    if (username) {
      var that = this;
      can.when(sf.b2c.mall.model.user.checkUserExist({username: username}))
        .done(function (data) {
          if (data.stat.code === 0 && data.content[0].value) {
            that.setError('该用户名已存在');
          }
        });

        //根据邮箱地址判断是否展示邀请码，如果为顺丰内部邮箱 不展示邀请码
        that.data.isSfExpress(!/(@sf-express.com)/.test(username));
    }
  },

  '#sf-verified-code click': function (element, event) {
    event && event.preventDefault();

    this.getVerifiedCode();
  }

});