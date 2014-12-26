'use strict';

define(
  'sf.b2c.mall.page.activated',
  [
    'jquery',
    'can',
    'underscore',
    'sf.b2c.mall.framework.comm',
    'sf.b2c.mall.component.header',
    'sf.b2c.mall.component.footer'
  ],
  function ($, can, _, SFFrameworkComm, SFHeader, SFFooter) {

    SFFrameworkComm.register(1);

    var PageMailActivated = can.Control.extend({
      init: function () {
        this.component = {};
        this.paint();
      },

      paint: function () {
        this.component.header = new SFHeader('.sf-b2c-mall-header');
        this.component.footer = new SFFooter('.sf-b2c-mall-footer');

        var params = can.deparam(window.location.search.substr(1));
        this.render(params);
      },

      render: function (data) {
        var templateFn = can.view.mustache(this.template());
        this.element.find('.sf-b2c-mall-content').html(templateFn(data));
      },

      '.btn-send click': function ($element, event) {
        var password = this.element.find('#input-password').val();
        var repeatpassword = this.element.find('#input-repassword').val();

      },

      template: function(){
        return '<div class="pb">'+
          '<div class="pm">'+
            '<div class="order verification">'+
              '<h1><span class="icon icon36"></span>恭喜你，账户验证成功，请设置登录密码。</h1>'+
              '<ol>'+
                '<li><label for="">登录邮箱：</label>{{email}}</li>'+
                '<li><label for="password">设置密码：</label><input type="password" class="input" id="input-password" placeholder="6-18位字母、数字或标点符号"></li>'+
                '<li><label for="repassword">重输密码：</label><input type="repassword" class="input" id="input-repassword" placeholder="重复输入您的密码"></li>'+
              '</ol>'+
              '<a href="#" class="btn btn-send">确认</a>'+
              '<span class="icon icon28"></span>'+
            '</div>'+
          '</div>'+
        '</div>'
      }
    });

    var pageMailactivated = new PageMailActivated('body');
  });
