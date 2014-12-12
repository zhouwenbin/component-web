'use strict';

sf.util.namespace('b2c.mall.model.user');

/**
 * @class sf.b2c.mall.model.user
 * @author Michael.Lee (leewind19841209@gmail.com)
 * @description 用户信息Model
 */
sf.b2c.mall.model.user = can.Model.extend({

  /**
   * @description 用户登陆请求
   * @param  {Map} data 用户登陆信息
   */
  login: function (data) {
    return can.ajax({
      url: sf.config.current.url,
      type: 'post',
      data: sf.util.sign({
        level: 'NONE',
        data: {
          _mt: 'user.webLogin',
          accountId: data.username,
          type: data.type,
          password: data.password
        }
      })
    });
  },

  logout: function() {
    return can.ajax({
      url: sf.config.current.url,
      type: 'post',
      data: sf.util.sign({
        level: 'USERLOGIN',
        data: {
          _aid: 1,
          _mt: 'user.logout'
        }
      })
    });
  },

  mailRegister: function(data) {
    return can.ajax({
      url: sf.config.current.url,
      type: 'post',
      data: sf.util.sign({
        level: 'NONE',
        data: {
          _mt: 'user.mailRegister',
          mailId: data.username,
          passWord: data.password,
          nick: '海淘访客',
          verifyCode: data.verifiedCode,
          inviteCode: data.inviteCode
        }
      })
    });
  },

  getVerifiedCode: function (data) {
    return can.ajax({
      url: sf.config.current.captcha,
      type: 'post',
      data: {
        action: 'register',
        key: '@SFHaitao',
        sessionID: data.sessionID
      }
    })
  },

  /**
   * @description 检查用户是否存在
   * @param  {Map} data 提交参数信息
   */
  checkUserExist: function(data) {
    return can.ajax({
      url: sf.config.current.url,
      type: 'post',
      data: sf.util.sign({
        level: 'NONE',
        data: {
          _mt: 'user.checkUserExist',
          accountId: data.username,
          type: 'MAIL'
        }
      })
    });
  },

  getUserInfo: function (data) {
    return can.ajax({
      url: sf.config.current.url,
      type: 'post',
      data: sf.util.sign({
        level: 'USERLOGIN',
        data: {
          _mt:'user.getUserInfo'
        }
      })
    });
  },

  upateUserInfo: function(data) {
    return can.ajax({
      url: sf.config.current.url,
      type: 'post',
      data: sf.util.sign({
        level: 'USERLOGIN',
        data: {
          _mt: 'user.upateUserInfo',
          gender: data.gender,
          nick: data.nick
        }
      })
    });
  },

  getRecAddressList: function(data) {
    return can.ajax({
      url: sf.config.current.url,
      type: 'post',
      data: sf.util.sign({
        level: 'USERLOGIN',
        data: {
          _mt: 'user.getRecAddressList'
        }
      })
    });
  },

  changePassword: function(data) {
    return can.ajax({
      url: sf.config.current.url,
      type: 'post',
      data: sf.util.sign({
        level: 'USERLOGIN',
        data: {
          _mt: 'user.changePassword',
          oldPassword: data.oldPassword,
          newPassword: data.newPassword
        }
      })
    });
  },

  userActivate: function (data) {
    return can.ajax({
      url: sf.config.current.url,
      type: 'post',
      data: sf.util.sign({
        level: 'NONE',
        data: {
          _mt: 'user.userActivate',
          mailId: data.mailId,
          tm: data.tm,
          sign: data.sign
        }
      })
    })
  },

  userSendResetPwdLink: function (data) {
    return can.ajax({
      url: sf.config.current.url,
      type: 'post',
      data: sf.util.sign({
        level: 'NONE',
        data: {
          _mt: 'user.sendResetPwdLink',
          mailId: data.accountId
        }
      })
    })
  },

  userResetPassword: function (data) {
    return can.ajax({
      url: sf.config.current.url,
      type: 'post',
      data: sf.util.sign({
        level: 'NONE',
        data: {
          _mt: 'user.resetPassword',
          accountId: data.mailId,
          tm: data.tm,
          sign: data.sign,
          newPassword: data.newPassword,
          type: 'MAIL'
        }
      })
    })
  },

  verifyPassword: function(data) {
    return can.ajax({
      url: sf.config.current.url,
      type: 'post',
      data: sf.util.sign({
        level: 'USERLOGIN',
        data: {
          _mt: 'user.verifyPassword',
          oldPassword: data.oldPassword
        }
      })
    });
  },

  delRecAddress: function(data) {
    return can.ajax({
      url: sf.config.current.url,
      type: 'post',
      data: sf.util.sign({
        level: 'USERLOGIN',
        data: {
          _mt: 'user.delRecAddress',
          addrId: data.addrId
        }
      })
    });
  },

  createRecAddress: function(data) {
    return can.ajax({
      url: sf.config.current.url,
      type: 'post',
      data: sf.util.sign({
        level: 'USERLOGIN',
        data: _.extend(data, {
          _mt: 'user.createRecAddress'
        })
      })
    });
  },

  updateRecAddress: function (data) {
    return can.ajax({
      url: sf.config.current.url,
      type: 'post',
      data: sf.util.sign({
        level: 'USERLOGIN',
        data: _.extend(data, {
          _mt:'user.updateRecAddress'
        })
      })
    });
  },


  updateReceiverInfo: function (data) {
    return can.ajax({
      url: sf.config.current.url,
      type: 'post',
      data: sf.util.sign({
        level: 'USERLOGIN',
        data: _.extend(data, {
          _mt: 'user.updateReceiverInfo'
        })
      })
    });
  },

  createReceiverInfo: function (data) {
    return can.ajax({
      url: sf.config.current.url,
      type: 'post',
      data: sf.util.sign({
        level: 'USERLOGIN',
        data: _.extend(data, {
          _mt: 'user.createReceiverInfo'
        })
      })
    });
  },

  /**
   * @description 获取账户已有的身份证信息列表
   * @return {can.Deferred}
   */
  getIDCardUrlList: function () {
    return can.ajax({
      url: sf.config.current.url,
      type: 'post',
      data: sf.util.sign({
        level: 'USERLOGIN',
        data: {
          _mt: 'user.getIDCardUrlList'
        }
      })
    });
  },

  /**
   * @description 重新发送激活邮件
   * @param  {Map} data 激活
   */
  resendActivateMail: function (data) {
    return can.ajax({
      url: sf.config.current.url,
      type: 'post',
      data: sf.util.sign({
        level: 'NONE',
        data: {
          _mt: 'user.sendActivateMail',
          mailId: data.username
        }
      })
    });
  },

  getCityList: function () {
    return can.ajax('json/sf.b2c.mall.regions.json');
  },

  getUserPhotoUrl: function (param) {
    var data = sf.util.sign({
      level: 'USERLOGIN',
      data: {
        n: param.n
      }
    })
    return sf.config.current.fileurl + '?' + $.param(data);

  },

  /**
   * @description 获得邀请码列表
   */
  getInviteCodeList: function() {
    return can.ajax({
      url: sf.config.current.url,
      type: 'post',
      data: sf.util.sign({
        level: 'USERLOGIN',
        data: {
          _mt: 'user.getInviteCodeList'
        }
      })
    });
  }

},{});