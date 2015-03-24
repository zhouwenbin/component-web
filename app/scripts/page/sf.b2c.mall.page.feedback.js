'use strict';

define(
  'sf.b2c.mall.page.feedback', [
    'can',
    'jquery',
    'sf.helpers',
    'sf.b2c.mall.framework.comm',
    'sf.b2c.mall.component.header',
    'sf.b2c.mall.component.footer',
    'sf.b2c.mall.api.product.commitFeedback'
  ],

  function(can, $, helpers, SFFrameworkComm, Header, Footer, SFCommitFeedback) {
    SFFrameworkComm.register(1);

    var feedback = can.Control.extend({

      init: function(element, options) {
        this.render();
      },

      render: function() {
        this.data = new can.Map({
          "mobile": null,
          "email": null,
          "feedback": null,
          "error": {
            "feedback": null,
            "email": null,
            "mobile": null
          }
        });

        var template = can.view.mustache(this.feedbackTemplate());
        $('.sf-b2c-mall-page-feedback').html(template(this.data));
      },

      feedbackTemplate: function() {
        return '<div class="feedback">' +
          '<h2>意见反馈</h2>' +
          '<textarea can-value="feedback" placeholder="输入您对顺丰海淘的建议或意见，帮助我们做的更好"></textarea><span class="text-error">{{error.feedback}}</span>' +
          '<div class="feedback-r1">' +
          '<label class="justify">手机号码</label>:<input type="text" can-value="mobile"/><span class="text-error">{{error.mobile}}</span><br><br>' +
          '<label class="justify">邮 箱</label>:<input type="text" can-value="email"/><span class="text-error">{{error.email}}</span></label>' +
          '</div>' +
          '<div class="feedback-r2">' +
          '<a href="#" class="btn btn-send" id="submitFeedBack">提交</a>' +
          '</div>' +
          '</div>'
      },

      '#submitFeedBack click': function() {

        var data = this.data.attr();

        var key;
        for (key in data) {
          data[key] = _.str.trim(data[key]);
        }

        // if (data["feedback"].length > 800){
        //   data["feedback"] = data["feedback"].substring(0, 800);
        // }

        if (data.feedback == null || data.feedback.length == 0 || data.feedback.length > 800){
          this.data.attr("error", {"feedback": "反馈意见输入错误，长度请在1-800个字符以内！"});
          return false;
        }

        if (data.mobile.length == 0 && data.email.length == 0){
          this.data.attr("error", {"email": "手机号码或者邮箱必须选择一个作为联系方式！"});
          return false;
        }

        if (data.mobile.length > 50){
          this.data.attr("error", {"mobile": "手机号码输入错误，长度请在1-50个字符以内！"});
          return false;
        }

        if (data.email.length > 50){
          this.data.attr("error", {"email": "邮箱输入错误，长度请在1-50个字符以内！"});
          return false;
        }

        if (data.email.length > 0) {

        }
        var isTelNum =/^1\d{10}$/.test(data.mobile);
        var isEmail = /^([a-zA-Z0-9-_]*[-_\.]?[a-zA-Z0-9]+)*@([a-zA-Z0-9]*[-_]?[a-zA-Z0-9]+)+[\.][a-zA-Z]{2,3}([\.][a-zA-Z]{2})?$/.test(data.email);

        if (data.mobile.length > 0 && !isTelNum) {
          this.data.attr("error", {"mobile": "手机号码格式输入错误！"});
          return false;
        }

        if (data.email.length > 0 && !isEmail) {
          this.data.attr("error", {"email": "邮箱格式输入错误！"});
          return false;
        }

        var commitFeedback = new SFCommitFeedback({
          "phoneNumber": data.mobile,
          "email": data.email,
          "feedback": data.feedback
        });

        commitFeedback
          .sendRequest()
          .done(function(data) {
            window.location.href = "www.sfht.com/index.html";
          })
          .fail(function(error) {
            console.error(error);
          })
      }

    });

    new feedback(".sf-b2c-mall-page-feedback");
  });