'use strict';

define('sf.b2c.mall.order.selectreceiveperson', [
    'can',
    'md5',
    'sf.b2c.mall.api.user.getIDCardUrlList',
    'sf.b2c.mall.api.user.webLogin'
  ],
  function(can, md5, SFGetIDCardUrlList, SFUserWebLogin) {
    return can.Control.extend({

      defaults: {
        user: new can.Map({
          recId: null,
          recName: null,
          credtNum: null,
          cellphone: null
        })
      }

      /**
       * 初始化
       * @param  {DOM} element 容器element
       * @param  {Object} options 传递的参数
       */
      init: function(element, options) {
        this.render();
      },

      render: function() {
        debugger;
        var that = this;

        //模拟登陆
        var webLogin = new SFUserWebLogin({
          accountId: 'jiyanliang@sf-express.com',
          type: 'MAIL',
          password: md5('123456' + 'www.sfht.com')
        });

        webLogin
          .sendRequest()
          .then(function() {
            var getIDCardUrlList = new SFGetIDCardUrlList();
            getIDCardUrlList
              .sendRequest()
              .done(function(data) {
                debugger;

                var html = can.view('templates/order/sf.b2c.mall.order.selectrecperson.mustache')({});
                that.element.html(html);
              })
          })


      }
    });
  })