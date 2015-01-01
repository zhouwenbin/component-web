'use strict';

define('sf.b2c.mall.component.receivepersoneditor', [
  'can',
  'sf.b2c.mall.api.user.createReceiverInfo',
  'sf.b2c.mall.api.user.updateReceiverInfo'

], function(can, SFCreateReceiverInfo, SFUpdateReceiverInfo) {
  return can.Control.extend({

    init: function() {
      this.adapter = {};
      this.onSuccess = this.options.onSuccess;
    },

    /**
     * @description 对页面进行渲染
     * @param  {Map} data 渲染页面的数据
     */
    render: function(data, tag, element) {
      this.setup(element)
      var html = can.view('templates/component/sf.b2c.mall.component.receivepersoneditor.mustache', data);
      element.html(html);
    },

    show: function(tag, params, element) {
      var map = {
        'create': function(data) {
          return {
            input: {
              recId: null,
              recName: null,
              type: "ID",
              credtNum: null
            },
            mainTitle: {
              text: '添加收货人信息'
            },
            cancle: {
              text: '取消添加'
            },
            error: {
              recName: null,
              credtNum: null
            }
          };
        },
        'editor': function(data) {
          return {
            input: {
              recId: data.recId,
              recName: data.recName,
              type: "ID",
              credtNum: data.credtNum
            },
            mainTitle: {
              text: '修改收货人信息'
            },
            cancle: {
              text: '取消修改'
            },
            error: {
              recName: null,
              credtNum: null
            }
          };
        }
      };
      var info = map[tag].call(this, params);
      this.adapter.person = new can.Map(info);
      this.render(this.adapter, tag, element);
    },

    hide: function() {
      this.destroy();
    },

    /**
     * @description 取消保存
     * @param  {Dom}    element
     * @param  {Event}  event
     */
    '#center-add-address-cancel-btn click': function(element, event) {
      event && event.preventDefault();
      this.element.empty();
    },

    add: function(person) {
      var that = this;

      var createReceiverInfo = new SFCreateReceiverInfo(person);
      createReceiverInfo
        .sendRequest()
        .done(function(data) {
          that.hide();
          that.onSuccess();
        })
        .fail(function(error) {
          console.error(error)
        });
    },

    update: function(person) {
      var that = this;

      var updateReceiverInfo = new SFUpdateReceiverInfo(person);
      updateReceiverInfo
        .sendRequest()
        .done(function(data) {
          that.hide();
          that.onSuccess();
        })
        .fail(function(error) {
          console.error(error)
        });
    },

    '#personSaveCancel click': function(element, event) {
      this.element.hide();
      this.element.empty();

      return false;
    },

    '#personSave click': function(element, event) {
      event && event.preventDefault();
      $('#recnameerror').hide();
      $('#credtnumerror').hide();
      $('#cellphoneerror').hide();

      var person = this.adapter.person.input.attr();

      var key;
      for (key in person) {
        person[key] = _.str.trim(person[key]);
      }

      if (!person.recName) {
        this.adapter.person.attr("error", {
          "recName": '请填写收货人姓名！'
        })
        $('#recnameerror').show();
        return false;
      }
      var testRecName = /^[\u4e00-\u9fa5]{0,8}$/.test($.trim(person.recName));
      if (testRecName) {} else {
        this.adapter.person.attr("error", {
          "recName": '您输入的姓名有误。'
        })
        $('#recnameerror').show();
        return false;
      }

      if (!person.credtNum) {
        this.adapter.person.attr("error", {
          "credtNum": '请填写收货人身份证号码！'
        })
        $('#credtnumerror').show();
        return false;
      }
      if (person.credtNum.length < 18 || person.credtNum.length > 18) {
        this.adapter.person.attr("error", {
          "credtNum": '收货人身份证号码填写有误！'
        })
        $('#credtnumerror').show();
        return false;
      }

      var info = {};
      var cardNo = person.credtNum;
      if (cardNo.length == 18) {
        var year = cardNo.substring(6, 10);
        var month = cardNo.substring(10, 12);
        var day = cardNo.substring(12, 14);
        var p = cardNo.substring(14, 17)
        var birthday = new Date(year, parseFloat(month) - 1,
          parseFloat(day));
        // 这里用getFullYear()获取年份，避免千年虫问题
        if (birthday.getFullYear() != parseFloat(year) || birthday.getMonth() != parseFloat(month) - 1 || birthday.getDate() != parseFloat(day)) {
          info.isTrue = false;
        }
        var Wi = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2, 1]; // 加权因子
        var Y = [1, 0, 10, 9, 8, 7, 6, 5, 4, 3, 2]; // 身份证验证位值.10代表X
        // 验证校验位
        var sum = 0; // 声明加权求和变量
        var _cardNo = cardNo.split("");
        if (_cardNo[17].toLowerCase() == 'x') {
          _cardNo[17] = 10; // 将最后位为x的验证码替换为10方便后续操作
        }
        for (var i = 0; i < 17; i++) {
          sum += Wi[i] * _cardNo[i]; // 加权求和
        }
        var i = sum % 11; // 得到验证码所位置
        if (_cardNo[17] != Y[i]) {
          info.isTrue = false;
        } else {
          info.isTrue = true;
        }
        info.year = birthday.getFullYear();
        info.month = birthday.getMonth() + 1;
        info.day = birthday.getDate();
        if (p % 2 == 0) {
          info.isFemale = true;
          info.isMale = false;
        } else {
          info.isFemale = false;
          info.isMale = true
        }

      }
      if (!info.isTrue) {
        this.adapter.person.attr("error", {
          "credtNum": '收货人身份证号码填写有误！'
        })
        $('#credtnumerror').show();
        return false;
      }

      if (person.recId) {
        this.update(person);
        element.parents('div#editPersonArea').toggle();
      } else {
        this.add(person);
        element.parents('div#addPersonArea').toggle();
      }
    }
  });
})