'use strict';

var mall = sf.util.namespace('b2c.mall');

mall.findpassword = can.Control.extend({

  defaults: {
    alert: '更新密码失败'
  },

  /**
   * 初始化slide控件
   * @param  {DOM} element 容器element
   * @param  {Object} options 传递的参数
   */
  init: function (element, options) {

    can.route.ready();

    var tag = options.tag || 1;

    this.data = {
      active: tag,
      process:[
        { num: 1, name: '提供账户信息' },
        { num: 2, name: '验证身份' },
        { num: 3, name: '重置密码' },
        { num: 4, name: '完成' }
      ]
    };

    this.data.user = new can.Map({
      accountId: null,
      newPassword: null,
      repeatPassword: null
    })

    this.render(tag||1, this.data);
  },

  render: function (tag, data) {
    this.element.empty();

    var helpers = {
      isActive: function (num) {
        return num == data.active ? 'on' : ''
      },
      isLast: function (name) {
        for (var i = 0; i < data.process.length; i++) {
          if(data.process[i].name == name && i+1 == data.process.length){
            return 'margin-right:0px';
          }
        };
      }
    }

    var boardhtml = can.view('templates/center/sf.b2c.mall.center.findpassword.board.mustache', data, helpers);
    this.element.append(boardhtml);

    var templateUrl = this.map[tag];
    var containerhtml = can.view(templateUrl, this.data);

    this.element.append(containerhtml);
  },

  errorMap: {
    '1000010': '未找到用户',
    '1000070': '参数错误',
    '1000120': '链接已过期',
    '1000130':  '签名验证失败',
    '1000140': '密码修改间隔太短'
  },

  errorSentMailMap: {
    '1000010': '未找到用户',
    '1000050': '邮箱地址错误',
    '1000070': '参数错误',
    '1000110': '账户尚未激活',
    '1000160': '邮件请求频繁'
  },

  map: {
    1: 'templates/center/sf.b2c.mall.center.findpassword.support.mustache',
    2: 'templates/center/sf.b2c.mall.center.findpassword.confirm.mustache',
    3: 'templates/center/sf.b2c.mall.center.findpassword.reset.mustache',
    4: 'templates/center/sf.b2c.mall.center.findpassword.finish.mustache'
  },

  '#sf-b2c-mall-support-btn click': function (el, event) {
    event && event.preventDefault();

    if (this.data.user.accountId) {
      if(!sf.util.checkEmail(this.data.user.accountId)){
        return alert('用户名请输入正确的邮箱地址!');
      }

      var that = this;
      this.request(this.data.user, function () {
        can.route.attr({'tag': 2});
      }, function (errorCode) {
        var errorText = that.errorSentMailMap[errorCode.toString()] || that.defaults.alert;
        alert(errorText);
      });
    }else{
      alert('请填写注册邮箱')
    }
  },

  '#register-resend-confirm-email click': function (el, event) {
    event && event.preventDefault();

    var that = this;
    this.request(this.data.user, function () {
      alert('发送成功')
    }, function (errorCode) {
      var errorText = that.errorSentMailMap[errorCode.toString()] || that.defaults.alert;
      alert(errorText);
    })
  },

  '#sf-b2c-mall-reset-btn click': function (el, event) {
    event && event.preventDefault();

    //新密码和重复密码为空
    if (!_.str.trim(this.data.user.newPassword) || !_.str.trim(this.data.user.repeatPassword)) {
      return alert('请输入正确的密码');
    }

    //新密码和重复密码不一致
    if (this.data.user.newPassword !== this.data.user.repeatPassword) {
      return alert('两次输入密码不一致');
    }

    if (this.data.user.newPassword.length < 6 || this.data.user.newPassword.length > 18) {
      return alert('设置密码在6-18位');
    }

    // deparam过程 -- 从url中获取需要请求的sku参数
    var params = can.deparam(window.location.search.substr(1));
    if (this.data.user && this.data.user.newPassword) {
      params.newPassword = md5(this.data.user.newPassword + 'www.sfht.com');
    }

    var that = this;
    can.when(sf.b2c.mall.model.user.userResetPassword(params))
      .done(function (data) {
        if (sf.util.access(data) && data.content[0].value) {
          that.data.user.attr('accountId', params.mailId )
          can.route.attr({'tag': 4});
        }else{
          var errorCode = data.stat.stateList[0].code;
          var errorText = that.errorMap[errorCode.toString()] || that.defaults.alert;
          alert(errorText);
          can.route.attr({tag: 1})
        }
      })
      .fail(function (data) {

      })
  },

  '{can.route} change': function () {
    var tag = can.route.attr('tag');
    this.data.active = tag;
    this.render(tag||1, this.data);
  },

  request: function (data, callback, error) {
    return can.when(sf.b2c.mall.model.user.userSendResetPwdLink(data))
      .done(function (data) {
        if (sf.util.access(data) && data.content[0].value) {
          if (_.isFunction(callback)) {
            callback();
          }
        }else{
          var errorCode = data.stat.stateList[0].code;
          if(_.isFunction(error)){
            error(errorCode);
          }
        }
      })
      .fail(function (data) {
        if(_.isFunction(error)){
          error();
        }
      })
  }
});