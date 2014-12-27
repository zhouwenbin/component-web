'use strict';

define('sf.b2c.mall.component.receivepersoneditor',
  [
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
              credtNum: null,
              cellphone: null
            },
            mainTitle: {
              text: '新增收货人'
            }
          };
        },
        'editor': function(data) {
          return {
            input: {
              recId: data.recId,
              recName: data.recName,
              type: "ID",
              credtNum: data.credtNum,
              cellphone: data.cellphone
            },
            mainTitle: {
              text: '修改收货地址'
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
        .fail(function() {

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
        .fail(function() {

        });
    },

    '#personSaveCancel click': function(element, event){
      // this.hide();
      this.element.hide();
      this.element.empty();

      return false;
    },

    '#personSave click': function(element, event) {
      event && event.preventDefault();

      var person = this.adapter.person.input.attr();

      if (person.recId) {
        this.update(person);
        element.parents('div#editAdrArea').toggle();
      } else {
        this.add(person);
        element.parents('div#addAdrArea').toggle();
      }
    }
  });
})