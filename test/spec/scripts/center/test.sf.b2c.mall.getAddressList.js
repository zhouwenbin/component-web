require(['sf.b2c.mall.api.user.webLogin', 'sf.b2c.mall.api.user.getRecAddressList', 'sf.b2c.mall.util.utils', 'sf.b2c.mall.util.testUtils'], function(SFUserWebLogin, SFGetRecAddressList, utils, testUtils) {

  var should = chai.should();

  describe('个人中心', function() {

    it('获取用户地址信息', function(done) {

      var webLogin = new SFUserWebLogin(testUtils.testData.user4Login);
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
          var getRecAddressList = new SFGetRecAddressList();
          return getRecAddressList.sendRequest();
        })
        .done(function(message) {

          //制作标题
          var div = document.createElement('div');
          div.innerHTML = '<h1>获取用户地址信息</h1>';
          document.getElementById('view').appendChild(div);

          //渲染内容
          var html = can.view('spec/templates/center/sf.b2c.mall.center.address.mustache', message);
          document.getElementById('view').appendChild(html);

          (typeof html != 'undefined').should.equal(true);
          done();
        })
        .fail(function(errorCode) {
          errorCode.should.equal(0);
          done();
        })

    })
  });

});