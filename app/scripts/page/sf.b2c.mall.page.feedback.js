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
        new Header('.sf-b2c-mall-header', {});
        new Footer('.sf-b2c-mall-footer');

        this.data = new can.Map({
          "email": null,
          "feedback": null,
          "error": {
            "feedback": null,
            "email": null
          }
        });

        var template = can.view.mustache(this.feedbackTemplate());
        $('.sf-b2c-mall-page-feedback').html(template(this.data));

      },

      feedbackTemplate: function() {
        return '<div class="feedback">' +
          '<h2>意见反馈</h2>' +
          '<textarea can-value="feedback" placeholder="输入您对顺丰海淘的建议或意见，帮助我们做的更好" id="mytext" maxlength="800"></textarea><span class="text-error">{{error.feedback}}</span>' +
          '<div class="feedback-r1">' +
          '<label class="justify">联系方式</label>：<input type="text" can-value="email"/><span class="text-error">{{error.email}}</span><br><br>' +
          '</div>' +
          '<div class="feedback-r2">' +
          '<a href="#" class="btn btn-send" id="submitFeedBack">提交</a>' +
          '</div>' +
          '</div>'
      },
      //@note 输入框只能输入800字符
      '#mytext blur': function() {
        var $feedback = $('#mytext');
        if ($feedback.val().length > 800) {
          $feedback.val($feedback[0].value.substr(0, 800));
        }
      },

      '#submitFeedBack click': function() {

        var data = this.data.attr();

        var key;
        for (key in data) {
          data[key] = _.str.trim(data[key]);
        }

        if (data["feedback"].length > 800) {
          data["feedback"] = data["feedback"].substring(0, 800);
        }

        if (data.feedback == null || data.feedback.length == 0) {
          this.data.attr("error", {
            "feedback": "请输入意见反馈内容。"
          });
          return false;
        }

        if (data.email.length == 0) {
          this.data.attr("error", {
            "email": "请留下您的联系方式，以方便客服与您联系！"
          });
          return false;
        }

        // if (data.mobile.length > 50){
        //   this.data.attr("error", {"mobile": "手机号码输入错误，长度请在1-50个字符以内！"});
        //   return false;
        // }

        if (data.email.length > 50) {
          this.data.attr("error", {
            "email": "您的联系方式输入有误，请重新输入！"
          });
          return false;
        }

        // var isTelNum = /^1\d{10}$/.test(data.mobile);
        // var isEmail = /^([a-zA-Z0-9-_]*[-_\.]?[a-zA-Z0-9]+)*@([a-zA-Z0-9]*[-_]?[a-zA-Z0-9]+)+[\.][a-zA-Z]{2,3}([\.][a-zA-Z]{2})?$/.test(data.email);

        // if (data.mobile.length > 0 && !isTelNum) {
        //   this.data.attr("error", {
        //     "mobile": "手机号码格式输入错误！"
        //   });
        //   return false;
        // }

        // if (data.email.length > 0 && !isEmail) {
        //   this.data.attr("error", {
        //     "email": "邮箱格式输入错误！"
        //   });
        //   return false;
        // }

        var commitFeedback = new SFCommitFeedback({
          "email": data.email,
          "feedback": data.feedback
        });

        commitFeedback
          .sendRequest()
          .done(function(data) {
            window.location.href = "http://www.sfht.com/index.html";
          })
          .fail(function(error) {
            console.error(error);
          })
      }

    });

    new feedback(".sf-b2c-mall-page-feedback");
  });