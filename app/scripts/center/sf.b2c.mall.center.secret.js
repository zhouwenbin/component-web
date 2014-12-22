'use strict';

// @description 申请命名空间
sf.util.namespace('b2c.mall.center.secret');

/**
 * @class sf.b2c.mall.center.secret
 * @author Michael.Lee (leewind19841209@gmail.com)
 * @description 用户中心 -- 密码修改模块
 */
sf.b2c.mall.center.secret = can.Control.extend({

  /**
   * @description 默认参数设置
   * @type {Map}
   */
  defaults: {
    oldPwdError: new can.Map({
      opassed: false,
      ofailed: false,
      otext: ''
    }),
    error: can.compute(false),
    errorText: can.compute(''),

    confirmError:can.compute(false),
    confirmErrorText:can.compute(''),
    success: can.compute(false),
    input: new can.Map({
      originalPassword: null,
      password: null,
      repeatPassword: null
    })
  },

  /**
   * @description 自定义mustache helpers
   * @type {Map}
   */
  helpers: {},

  /**
   * @description 初始化方法，当调用new时会执行init方法
   * @param  {Dom} element 当前dom元素
   * @param  {Map} options 传递的参数
   */
  init: function(element, options) {

    //重置输入框内容
    this.defaults.input.attr({
      originalPassword: null,
      password: null,
      repeatPassword: null
    });

    //重置密码以及提示信息
    this.resetError();
    this.resetErrorText();
    this.resetAgainError();
    this.paint(this.defaults);
  },

  /**
   * @description 改变观察的数据
   * @param  {Map} data 新数据
   */
  change: function(data) {
    var viewModel = this.parse(data);

    // @todo 将改变的数据进行部署
  },

  /**
   * @description 对页面做第一次绘制
   * @param  {Map} data 绘制页面的数据
   */
  paint: function(data) {
    this.data = this.parse(data);

    // @todo 注册观察的数据

    this.render(this.data);
  },

  /**
   * @description 对页面进行渲染
   * @param  {Map} data 渲染页面的数据
   */
  render: function(data) {
    var html = can.view('templates/center/sf.b2c.mall.center.secret.mustache', data);
    this.element.html(html);
  },

  /**
   * @description supplement绘制阶段，在render之后继续执行的绘制阶段，主要处理不重要的渲染
   * @param  {Map} data 渲染页面的数据
   */
  supplement: function(data) {

  },

  /**
   * @description 将datamodel转化为viewmodel
   * @param  {Map} data datamodel
   * @return {Map}      viewmodel
   */
  parse: function(data) {
    return data;
  },

/**
 * @description 设置原密码错误提示
 * @param {String} data 提示的文字信息
 * @return {Boolean} 返回执行情况
 */
    alertError: function(data) {
        this.data.oldPwdError.attr({
            opassed: false,
            ofailed: true,
            otext:data || '原密码不能为空'
        });
    },
/**
 * @description 设置新密码错误提示
 * @param {String} data 提示的文字信息
 * @return {Boolean} 返回执行情况
 */
    setErrorText: function(data) {
        this.data.error(true);
        this.data.errorText(data);
        return true;
    },
/**
 * @description 设置确认密码错误提示
 * @param {String} data 提示的文字信息
 * @return {Boolean} 返回执行情况
 */
    setConfirmErrorText:function(data){
        this.data.confirmError(true);
        this.data.confirmErrorText(data);
        return true;
    },
/**
* @description 重置原密码错误提示信息
*/
    resetError: function(){
        this.defaults.oldPwdError.attr({
            opassed: false,
            ofailed: false,
            otext: ''
        });
    },
/**
* @description 重置新密码错误提示信息
*/
    resetErrorText: function()
    {
        this.defaults.error(false);
        this.defaults.errorText("");
    },
/**
 * @description 重置确认密码错误提示信息
 */
    resetAgainError:function(){
        this.defaults.confirmError(false);
        this.defaults.confirmErrorText("");
    },
/*
* 原密码错误情况
* */
    errorMap: {
        1000010: '未找到用户',
        1000040: '原密码错误',
        1000060: '密码不能与原密码相同'
    },

  /**
   * @description event:
   * @param  {Dom} element 触发事件的元素
   * @param  {Event} event   事件对象
   */
  '#center-change-password-btn click': function(element, event) {
    event && event.preventDefault();

    //重置密码以及提示信息
    this.resetError();
    this.resetErrorText();
    this.resetAgainError();

    var inputData = {
        oldPassword: this.data.input.attr('originalPassword'),
        newPassword: this.data.input.attr('password'),
        repeatPassword: this.data.input.attr('repeatPassword')
      };

    if (!inputData.oldPassword) {
      return this.alertError('原密码不能为空');
    }

    //新密码为空
    if (!inputData.newPassword) {
      return this.setErrorText('请输入新密码');
    }

    //原始密码为空
    if (!inputData.repeatPassword) {
      return this.setConfirmErrorText('请输入确认密码');
    }

    if (inputData.newPassword.length < 6 || inputData.repeatPassword.length > 18) {
      return this.setErrorText('密码请设为6-18位字母、数字或标点符号');
    }

    //新密码和重复密码不一致
    if (inputData.newPassword !== inputData.repeatPassword) {
      return this.setErrorText('两次输入密码不一致');
    }

    var params = {
      oldPassword: md5(inputData.oldPassword + 'www.sfht.com'),
      newPassword: md5(inputData.newPassword + 'www.sfht.com')
    };

    var that = this;
    can.when(sf.b2c.mall.model.user.changePassword(params))
      .done(function(data) {
        if (data.content[0].value && data.stat.code === 0) {
          that.data.success(true);

          // window.location.reload();
        } else {
          var errorCode = data.stat.stateList[0].code;
          var errorText = that.errorMap[errorCode] || '修改密码失败';

          that.alertError(errorText);
        }
      })
      .fail(function(data) {

      });

  },

  clearOriginalError: function() {
    this.data.oldPwdError.attr({
      opassed: false,
      ofailed: false,
      otext: ''
    });
  },

  /**
   * @description event:隐藏错误信息
   * @param  {Dom} element 触发事件的元素
   * @param  {Event} event   事件对象
   */
  'dd.center-secret-old-password .yes click': function(element, event) {
    this.clearOriginalError();
  },

  /**
   * @description event:隐藏错误信息
   * @param  {Dom} element 触发事件的元素
   * @param  {Event} event   事件对象
   */
  'dd.center-secret-old-password .no click': function(element, event) {
    this.clearOriginalError();
    this.input.originalPassword('');
  },

  /**
   * @description event:隐藏错误信息
   * @param  {Dom} element 触发事件的元素
   * @param  {Event} event   事件对象
   */
  'dd.center-secret-new-password .no click': function(element, event) {
    this.data.error(false);
  },

  /**
   * @description event:返回center首页
   * @param  {Dom} element 触发事件的元素
   * @param  {Event} event   事件对象
   */
  '.go-Return click': function(element, event) {
    this.data.success(false);
  }

});