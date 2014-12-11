
define(['sf.b2c.mall.api.user.webLogin', 'sf.b2c.mall.api.user.getUserInfo', 'sf.b2c.mall.util.utils'], function(SFUserWebLogin, SFGetUserInfo, utils) {

  describe('测试', function() {

    it('测试登录获得用户信息', function(done) {

      var user4Login = {
        accountId: 'jiyanliang@sf-express.com',
        type: 'MAIL',
        password: utils.md5('123456')
      };

      var webLogin = new SFUserWebLogin(user4Login);
      webLogin
        .sendRequest()
        .done(function(loginResult) {
          done();
        })
        .fail(function(errorCode) {
          errorCode.should.equal(-1);
          done();
        })
        .then(function(loginResult) {
          var getUserInfo = new SFGetUserInfo();
          return getUserInfo.sendRequest();
        })
        .done(function(message) {
          (typeof message.userId != 'undefined').should.equal(true);
          done();
        })
        .fail(function(errorCode) {
          errorCode.should.equal(0);
          done();
        })

    })
  });

});