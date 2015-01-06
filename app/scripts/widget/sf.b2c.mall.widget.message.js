'use strict';

define(
  'sf.b2c.mall.widget.message',

  [
    'jquery',
    'can'
  ],

  function($, can) {
    return can.Control.extend({

      init: function(element, options) {
        //类型有三种，提示错误信息error，提示确认信息confirm，提示成功信息success
        this.data = {};
        this.data.type = this.options.type;
        this.data.tip = this.options.tip;
        this.data.okFunction = this.options.okFunction;
        this.data.buttons = this.buttonsMap[this.data.type];

        this.render();
      },

      render: function() {
        this.setup($('body'))
        this.options.html = can.view('templates/widget/sf.b2c.mall.widget.message.mustache', this.data);
        $('body').append(this.options.html);
      },

      buttonsMap: {
        'confirm': '<a href="javascript:void(0)" class="btn btn-send" id="ok">确定</a><a href="javascript:void(0)" class="btn btn-cancel" id="cancel">取消</a>'
      },

      '#close click': function() {
        this.close();
        return false;
      },

      '#ok click': function() {
        this.data.okFunction.apply(this);
        this.close();
        return false;
      },

      '#cancel click': function() {
        this.close();
        return false;
      },

      close: function(){
        $('#messagedialog').remove();
      }
    });
  })