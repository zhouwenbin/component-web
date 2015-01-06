'use strict';

define(
  'sf.b2c.mall.center.receiveperson', [
    'can',
    'jquery',
    'sf.b2c.mall.api.user.getIDCardUrlList',
    'sf.b2c.mall.api.user.webLogin',
    'sf.b2c.mall.component.receivepersoneditor',
    'md5',
    'sf.b2c.mall.framework.comm',
    'sf.b2c.mall.adapter.receiveperson.list',
    'sf.b2c.mall.api.user.delRecvInfo',
    'sf.b2c.mall.widget.modal',
    'sf.b2c.mall.widget.message'
  ],
  function(can, $, SFGetIDCardUrlList, SFUserWebLogin, SFRecpersoneditor, md5, SFFrameworkComm, ReceivePersonAdapter, SFUerDelRecvInfo, SFModal, SFMessage) {

    SFFrameworkComm.register(1);

    return can.Control.extend({

      /**
       * 初始化
       * @param  {DOM} element 容器element
       * @param  {Object} options 传递的参数
       */
      init: function(element, options) {
        this.adapter4List = {};
        this.component = {};
        this.component.getIDCardUrlList = new SFGetIDCardUrlList();
        this.component.modal = new SFModal('body');
        this.component.delRecvInfo = new SFUerDelRecvInfo();
//        this.data = new can.Map({
//          confirmText:true,
//          username:null
//        });
        this.paint();
      },

      render: function(data) {
          //进行渲染
          var html = can.view('templates/center/sf.b2c.mall.center.receiveperson.mustache', data);
          this.element.html(html);
      },

      paint:function(){
        var that = this;

        this.component.getIDCardUrlList.sendRequest()
        .done(function(message) {

          //获得地址列表
          that.adapter4List.persons = new ReceivePersonAdapter({
            personList: message.items,
            hasData: false
          });

          if (that.adapter4List.persons.personList != null && that.adapter4List.persons.personList.length > 0) {
            that.adapter4List.persons.attr("hasData", true);
          }

          that.render(that.adapter4List.persons);

          that.component.personEditor = new SFRecpersoneditor('#addPersonArea', {
            onSuccess: _.bind(that.paint, that)
          });

        })
        .fail(function(errorCode) {

        })

      },
      /**
       * [description 点击编辑]
       * @param  {[type]} element
       * @param  {[type]} event
       * @return {[type]}
       */
      ".order-edit click": function(element, event) {
        event && event.preventDefault();
        var index = element.data('index');
        var person = this.adapter4List.persons.get(index);
        this.adapter4List.persons.input.attr('recId', person.recId);

        $('#editPersonArea').hide();
        $('#addPersonArea').hide();

        var editPersonArea = element.parents("li[name='personEach']").find("#editPersonArea");
        editPersonArea.show();
        this.component.personEditor.show("editor", person, $(editPersonArea));
        return false;
      },

      '.order-del click': function(element, event) {
        event && event.preventDefault();
        var index = element.data('index');
        var person = this.adapter4List.persons.get(index);

        var that = this;
        var message = new SFMessage(null, {
          'tip': '确认要删除该收货人“'+person.recName+'”的信息吗？',
          'type': 'confirm',
          'okFunction': _.bind(that.delPerson, that, element, person)
        });
      },

      delPerson: function(element, person) {
        this.adapter4List.persons.input.attr('recId', person.recId);
        var that = this;
        this.component.delRecvInfo.setData({
          recId: person.recId
        });
        this.component.delRecvInfo.sendRequest()
          .done(function(data){
            if(data.value){
              that.paint();
            }
          })
          .fail(function(error){
          })
      },

      /**
       * [description 点击新增]
       * @param  {[type]} element
       * @param  {[type]} event
       * @return {[type]}
       */
      ".btn-add click": function(element, event) {
        $('#editPersonArea').hide();
        $("#addPersonArea").show();
        $(element).hide();
        this.component.personEditor.show('create', null, $("#addPersonArea"));

        return false;
      },

      showTemplate:function(){
        return '<div class="mask"></div><div class="dialog dialog-center"><a href="#" class="btn btn-close">关闭</a>'+
        '{{#confirmText}}<p>确定要删除收货人“{{username}}”的信息吗？</p>{{/confirmText}}'+
        '{{^confirmText}}<p>确定要删除此收货地址吗？</p>{{/confirmText}}'+
        '<div class="dialog-r1"><a id="btn-del" href="#" class="btn btn-send">确定</a><a id="btn-cancel" href="#" class="btn btn-cancel">取消</a></div></div>'
      }

    })
  })