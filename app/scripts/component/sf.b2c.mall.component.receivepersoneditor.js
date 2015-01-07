'use strict';

define('sf.b2c.mall.component.receivepersoneditor', [
  'can',
  'sf.b2c.mall.api.user.createReceiverInfo',
  'sf.b2c.mall.api.user.updateReceiverInfo',
  'sf.b2c.mall.widget.message'

], function(can, SFCreateReceiverInfo, SFUpdateReceiverInfo, SFMessage) {

  return can.Control.extend({

    init: function() {
      this.adapter = {};
      this.onSuccess = this.options.onSuccess;
    },

    idErrorMap: {
      //"1000070": "参数错误",
      "1000200": "该身份证信息已存在！",
      "1000280": "身份证号码错误！"
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
      var def = can.Deferred();
      var that = this;

      var createReceiverInfo = new SFCreateReceiverInfo(person);
      createReceiverInfo
        .sendRequest()
        .done(function(data) {
          def.resolve(data);
          //that.hide();
          that.onSuccess();
        })
        .fail(function(error) {
          if (error === 1000310) {
            new SFMessage(null, {
              'tip': '您已添加20条收货人信息，请返回修改！',
              'type': 'error'
            });
          }
          def.reject(error);
          //console.error(error)
        });
      return def;
    },

    update: function(person) {
      var def = can.Deferred();
      var that = this;

      var updateReceiverInfo = new SFUpdateReceiverInfo(person);
      updateReceiverInfo
        .sendRequest()
        .done(function(data) {
          def.resolve(data);
          //that.hide();
          that.onSuccess();
        })
        .fail(function(error) {
          def.reject(error);
          //console.error(error)
        });

      return def;
    },

    '#personSaveCancel click': function(element, event) {
      this.element.hide();
      this.element.empty();
      $('#btn-add-person').show();
      return false;
    },
    '#recRealName focus': function(element, event) {
      event && event.preventDefault();
      $('#recnameerror').hide();
    },
    '#identity focus': function(element, event) {
      event && event.preventDefault();
      $('#credtnumerror').hide();
    },
    '#personSave click': function(element, event) {
      event && event.preventDefault();
      $('#recnameerror').hide();
      $('#credtnumerror').hide();

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
      var testRecName = /^[\u4e00-\u9fa5]{0,10}$/.test($.trim(person.recName));
      if (testRecName) {} else {
        this.adapter.person.attr("error", {
          "recName": '请填写身份证上真实姓名'
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

      var that = this;

      if (person.recId) {
        var result = this.update(person);
        result
          .done(function(result) {
            element.parents('div#editPersonArea').toggle();
          })
          .fail(function(error) {
            //显示错误
            if (that.idErrorMap[error]) {
              that.adapter.person.attr("error", {
                "credtNum": that.idErrorMap[error]
              })

              $('#credtnumerror')[0].style.display = "inline"; //.show();
              //$('#credtnumerror').show();
            }

            return false;
          })

      } else {debugger;
        var result = this.add(person);
        result
          .done(function(result) {debugger;
            person.recId = result.value;
            element.parents('div#addPersonArea').toggle();
            $('#btn-add-person').show();
          })
          .fail(function(error) {debugger;
            //显示错误
            if (that.idErrorMap[error]) {
              that.adapter.person.attr("error", {
                "credtNum": that.idErrorMap[error]
              })
              $('#credtnumerror').show();
            }
            return false;
          })
      }
    }
  });
})