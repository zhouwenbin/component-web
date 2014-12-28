'use strict';

define(
  'sf.b2c.mall.center.receiveperson',
  [
    'can',
    'jquery',
    'sf.b2c.mall.api.user.getIDCardUrlList',
    'sf.b2c.mall.api.user.webLogin',
    'sf.b2c.mall.component.receivepersoneditor',
    'md5',
    'sf.b2c.mall.framework.comm',
    'sf.b2c.mall.adapter.receiveperson.list'
  ],
  function(can, $, SFGetIDCardUrlList, SFUserWebLogin, SFRecpersoneditor, md5, SFFrameworkComm, ReceivePersonAdapter) {

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
        this.render(this.data);
      },

      render: function(data) {
        var that = this;

        // var webLogin = new SFUserWebLogin({
        //   accountId: 'jiyanliang@sf-express.com',
        //   type: 'MAIL',
        //   password: md5('123456' + 'www.sfht.com')
        // });

        var getIDCardUrlList = new SFGetIDCardUrlList();

        // webLogin
        //   .sendRequest()
        //   .fail(function(error){
        //     console.error(error);
        //   })
        //   .then(function() {
        //     var getIDCardUrlList = new SFGetIDCardUrlList();
        //     return getIDCardUrlList.sendRequest();
        //   })
        getIDCardUrlList.sendRequest()
          .done(function(message) {

            //获得地址列表
            that.adapter4List.persons = new ReceivePersonAdapter({
              personList: message.items,
              hasData: false
            });

            //进行倒排序
            that.adapter4List.persons.personList.reverse();

            if (that.adapter4List.persons.personList != null && that.adapter4List.persons.personList.length > 0) {
              that.adapter4List.persons.attr("hasData", true);
            }

            //进行渲染
            var html = can.view('templates/center/sf.b2c.mall.center.receiveperson.mustache', that.adapter4List.persons);
            that.element.html(html);

            that.component.personEditor = new SFRecpersoneditor('#addPersonArea', {
              onSuccess: _.bind(that.render, that)
            });

          })
          .fail(function(errorCode) {
            console.error(errorCode);
          })
      },

      /**
       * [description 点击编辑]
       * @param  {[type]} element
       * @param  {[type]} event
       * @return {[type]}
       */
      ".order-edit click": function(element, event) {

        var index = element.data('index');
        var person = this.adapter4List.persons.get(index);
        this.adapter4List.persons.input.attr('recId', person.recId);

        var editPersonArea = element.parents("li[name='personEach']").find("#editPersonArea");
        editPersonArea.show();
        this.component.personEditor.show("editor", person, $(editPersonArea));
        return false;
      },

      /**
       * [description 点击新增]
       * @param  {[type]} element
       * @param  {[type]} event
       * @return {[type]}
       */
      ".btn-add click": function(element, event) {
        $("#addPersonArea").show();
        this.component.personEditor.show('create', null, $("#addPersonArea"));
        return false;
      }

    })
  })