'use strict';

define(
  'sf.b2c.mall.page.nullactivated',
  [
    'jquery',
    'can',
    'underscore',
    'md5',
    'sf.b2c.mall.framework.comm',
    'sf.b2c.mall.component.header',
    'sf.b2c.mall.component.footer',
    'sf.b2c.mall.api.user.sendActivateMail',
    'sf.b2c.mall.business.config'
  ],
  function ($, can, _, md5, SFFrameworkComm, SFHeader, SFFooter, SFApiUserSendActivateMail, SFBizConf) {

    SFFrameworkComm.register(1);

    var DEFAULT_ERROR = '邮箱激活失败'
    var ERROR_REGISTER_MAP = {
      '1000020': '很抱歉，您的邮箱已注册',
      '1000120': '很抱歉，您的邮箱验证链接已失效'||'链接已过期',
      '1000130': '很抱歉，您的邮箱验证链接已失效'||'签名验证失败',
      '1000140': '发送验证邮箱的频率较高，请过2分钟再试'||'密码修改间隔太短'
    }
    var ERROR_RESEND_MAP = {
      '1000020':   '账户已注册',
      '1000050':   '邮箱地址错误',
      '1000070':   '参数错误',
      '1000100':   '验证码错误',
      '1000160':   '发送验证邮箱的频率较高，请过2分钟再试'
    }
    var DEFAULT_RESEND_SUCCESS = '验证邮件已重新发送，请注意查收。';


    var PageNullActivated = can.Control.extend({
      init: function () {
        this.component = {};
        this.component.sendActivateMail = new SFApiUserSendActivateMail();
        this.paint();
      },

      paint: function () {
        this.component.header = new SFHeader('.sf-b2c-mall-header');
        this.component.footer = new SFFooter('.sf-b2c-mall-footer');

        var params = can.deparam(window.location.search.substr(1));
        this.data = new can.Map({
          errorCode: params.er,
          errorText: ERROR_REGISTER_MAP[params.er] || DEFAULT_ERROR,
          email: params.mailId,
          msg: null,
          msgType: null
        });
        this.render(this.data);
      },

      render: function (data) {
        var template = this.template(data.errorCode);
        if (_.isFunction(template)) {
          var templateFn = can.view.mustache(template());
          this.element.find('.sf-b2c-mall-content').html(templateFn(data));
        }
      },

      existedTemplate: function () {
        return '<div class="pb">'+
                '<div class="pm">'+
                  '<div class="order verification-failure">'+
                    '<h1>{{errorText}}</h1>'+
                    '<div class="verification-failure-r1">您可以：<a href="index.html#!&=login" class="btn btn-send">立即登录</a><a href="index.html" class="btn btn-add">返回首页</a></div>'+
                    '<span class="icon icon28"></span>'+
                  '</div>'+
                '</div>'+
              '</div>'
      },

      expiredTemplate: function () {
        return '<div class="pb">'+
                    '<div class="pm">'+
                      '<div class="order verification-failure">'+
                        '<h1>{{errorText}}</h1>'+
                        '<div class="verification-failure-r1">您可以：<a href="#" class="btn btn-send" id="resend">重新发送</a><a href="index.html" class="btn btn-add">返回首页</a></div>'+
                        '{{#msg}}<div class="verification-failure-r2"><span class="icon {{msgType}}">{{msg}}</span></div>{{/msg}}'+
                        '<span class="icon icon28"></span>'+
                      '</div>'+
                    '</div>'+
                  '</div>'
      },

      template: function(errorCode){
        var map = {
          '1000020': this.existedTemplate,
          '1000120': this.expiredTemplate,
          '1000130': this.expiredTemplate,
          '1000140': this.expiredTemplate
        }

        return map[errorCode];
      },

      '#resend click': function ($element, event) {
        event && event.preventDefault();

        var that = this;
        this.component.sendActivateMail.setData({
          mailId: this.data.attr('email'),
          from: 'RESEND'
        });

        this.component.sendActivateMail.sendRequest()
          .done(function (data) {
            that.data.attr('msg', DEFAULT_RESEND_SUCCESS);
            that.data.attr('msgType', 'icon26-2');
          })
          .fail(function (errorCode) {
            if (_.isNumber(errorCode)) {
              var errorText = ERROR_RESEND_MAP[errorCode];
              that.data.attr('msg', errorText);
              that.data.attr('msgType', 'icon26');
            }
          })
      }
    });

    document.domain = 'sfht.com';
    var pageNullMailactivated = new PageNullActivated('body');
  });
