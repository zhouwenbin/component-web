'use strict';

define(
  'sf.b2c.mall.widget.message',

  [
    'jquery',
    'can',
    'text!template_widget_message'
  ],

  function($, can, template_widget_message) {
    return can.Control.extend({

      init: function(element, options) {
        //类型有三种，提示错误信息error，提示确认信息confirm，提示成功信息success
        this.data = {};
        this.data.type = this.options.type;
        this.data.tip = this.options.tip;
        this.data.title = this.options.title;
        this.data.closeTime = this.options.closeTime;
        this.data.customizeClass = this.options.customizeClass;
        this.data.okFunction = typeof this.options.okFunction != 'undefined' ? this.options.okFunction : null;
        this.data.closeFunction = typeof this.options.closeFunction != 'undefined' ? this.options.closeFunction : null;
        this.data.buttons = this.buttonsMap[this.data.type];

        this.render();

        //定时关闭
        this.setTimeoutClose(this.data);
      },

      setTimeoutClose: function(data) {
        var that = this;

        // 定时关闭
        if (data.closeTime) {
          setTimeout(function() {
            that.close();
          }, data.closeTime);
        }
      },

      render: function() {
        this.setup($('body'));
        var renderFn = can.mustache(template_widget_message);
        this.options.html  = renderFn(this.data);
        $('body').append(this.options.html);
      },

      buttonsMap: {
        'confirm': '<a href="javascript:void(0)" class="btn btn-send" id="ok">确定</a><a href="javascript:void(0)" class="btn btn-cancel" id="cancel">取消</a>',
        'error': '<a href="javascript:void(0)" class="btn btn-send" id="ok">确定</a>',
        'success': '<a href="javascript:void(0)" class="btn btn-send" id="ok">确定</a>',
        'input': '<a href="javascript:void(0)" class="btn btn-send" id="input">提交</a>'
      },

      '#input click': function() {
        if (typeof this.data.okFunction != 'undefined' && this.data.okFunction != null) {
          var result = this.data.okFunction.apply(this);
          if (result !== true) {
            return false;
          }
        }
        this.close();
        return false;
      },

      '#close click': function() {
        this.close();
        return false;
      },

      '#ok click': function() {
        if (typeof this.data.okFunction != 'undefined' && this.data.okFunction != null) {
          this.data.okFunction.apply(this);
        }
        this.close();
        return false;
      },

      '#cancel click': function() {
        if (typeof this.data.closeFunction != 'undefined' && this.data.closeFunction != null) {
          this.data.closeFunction.apply(this);
        }
        this.close();
        return false;
      },

      close: function() {
        $('#messagedialog').remove();
        //要做销毁，否则绑定的事件还会存在
        this.destroy();
      }
    });
  })