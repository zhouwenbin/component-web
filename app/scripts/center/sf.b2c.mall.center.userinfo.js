'use strict';

// @description 申请命名空间
sf.util.namespace('b2c.mall.center.userinfo');

/**
 * @class sf.b2c.mall.center.userinfo
 * @author Michael.Lee (leewind19841209@gmail.com)
 * @description 用户中心--用户信息模块
 */
sf.b2c.mall.center.userinfo = can.Control.extend({

  /**
   * @description 默认参数设置
   * @type {Map}
   */
  defaults: {},

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
  init: function (element, options) {
    // @todo 初始化操作

    this.paint(options.data);
  },

  /**
   * @description 对页面做第一次绘制
   * @param  {Map} data 绘制页面的数据
   */
  paint: function (data) {
    this.data = this.parse(data);
    this.data.isModified = can.compute(false);

    // @todo 注册观察的数据

    this.render(this.data);
  },

  /**
   * @description 对页面进行渲染
   * @param  {Map} data 渲染页面的数据
   */
  render: function (data) {
    var html = can.view('templates/center/sf.b2c.mall.center.userinfo.mustache', data);
    this.element.html(html);
  },

  /**
   * @description 将datamodel转化为viewmodel
   * @param  {Map} data datamodel
   * @return {Map}      viewmodel
   */
  parse: function (data) {

    var user = new can.Map({
      uid: data.userId,
      nick: data.nick,
      gender: data.gender,
      genderStr: data.gender === 'FEMALE' ? '女' : '男',
      mobile: data.mobile,
      bindMobile: data.mobile,
      buyType: '人民币'
    });

    var input = new can.Map({
      nick: data.nick,
      gender: data.gender
    });

    return {
      user: user,
      input: input
    };
  },

  /**
   * @description event:用户需要修改用户信息
   * @param  {Dom} element 触发事件的元素
   * @param  {Event} event   事件对象
   */
  '#user-info-modify-btn click': function (element, event) {
    event && event.preventDefault();
    if (!this.data.isModified()) {
      this.data.isModified(true);
    }
  },

  /**
   * @description event:用户确认修改用户信息
   * @param  {Dom} element 触发事件的元素
   * @param  {Event} event   事件对象
   */
  '#user-info-confirm-btn click': function (element, event) {
    event && event.preventDefault();

    if (this.data.isModified()) {

      var nickName = this.data.input.attr('nick');
      if(nickName.length >10){
          window.alert('您的昵称太长，不能超过10个字节');
          return false;
      }

      var params = {
        gender: this.data.input.attr('gender'),
        nick: this.data.input.attr('nick')
      };

      // @todo 向服务器提交修改
      var that = this;
      can.when(sf.b2c.mall.model.user.upateUserInfo(params))
        .done(function (data) {
          if (sf.util.access(data) && data.content[0].value) {
            var nick = that.data.input.attr('nick');
            var gender = that.data.input.attr('gender');

            that.data.user.attr({'nick': nick, 'gender': gender, 'genderStr': gender === 'FEMALE' ? '女' : '男'});

            that.data.isModified(false);
            window.location.reload();
          }
        })
        .fail(function () {
          that.data.isModified(false);
        });
    }
  },

  /**
   * @description event:用户取消修改用户信息
   * @param  {Dom} element 触发事件的元素
   * @param  {Event} event   事件对象
   */
  '#user-info-cancel-btn click': function (element, event) {
    event && event.preventDefault();

    if (this.data.isModified()) {

      this.data.isModified(false);
      this.data.input.attr({'nick': this.data.user.attr('nick'), 'gender': this.data.user.attr('gender')});
    }
  }
});