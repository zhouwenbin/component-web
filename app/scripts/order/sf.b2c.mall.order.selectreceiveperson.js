'use strict';

define('sf.b2c.mall.order.selectreceiveperson', [
    'can',
    'md5',
    'underscore',
    'sf.b2c.mall.api.user.getIDCardUrlList',
    'sf.b2c.mall.api.user.webLogin',
    'sf.b2c.mall.api.user.createReceiverInfo',
    'sf.b2c.mall.api.user.updateReceiverInfo',
    'sf.b2c.mall.adapter.order',
    'sf.b2c.mall.adapter.receiveperson.list',
    'sf.b2c.mall.component.receivepersoneditor',
  ],
  function(can, md5, _, SFGetIDCardUrlList, SFUserWebLogin, SFCreateReceiverInfo, SFUpdateReceiverInfo, SFOrderAdapter, ReceivePersonAdapter, SFRecpersoneditor) {

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
        this.render(this.data);
      },

      render: function(data) {
        var that = this;

        this.component.getIDCardUrlList.sendRequest()
          .done(function(message) {

            var params = can.deparam(window.location.search.substr(1));
            var map = {
              'heike_online': function (list, id) {
                var value = _.findWhere(list, {recId: id});
                if (value) {
                  return [value];
                }else{
                  return [];
                }
              }
            }

            var fn = !_.isEmpty(params.orgCode) && map[params.saleid];
            var list = null
            if (_.isFunction(fn)) {
              list = fn(message.items, data && data.value)
            }

            //获得地址列表
            that.adapter4List.persons = new ReceivePersonAdapter({
              personList: list || message.items || [],
              hasData: false
            });

            //进行倒排序
            //that.adapter4List.persons.personList.reverse();

            if (that.adapter4List.persons.personList != null && that.adapter4List.persons.personList.length > 0) {
              that.adapter4List.persons.attr("hasData", true);
              that.adapter4List.persons.personList[0].attr("active", "active");
            }

            //进行渲染
            var html = can.view('templates/order/sf.b2c.mall.order.selectrecperson.mustache', that.adapter4List.persons);
            that.element.html(html);

            that.component.personEditor = new SFRecpersoneditor('#addPersonArea', {
              onSuccess: _.bind(that.render, that)
            });

          })
          .fail(function(errorCode) {
            //console.error(errorCode);
          })
      },

      /**
       * [getSelectedIDCard 获得选中的收货人]
       * @return {[type]} [description]
       */
      getSelectedIDCard: function(){
        var index = $("#personList").find("li.active").eq(0).attr('data-index');
        if (typeof index == 'undefined'){
          return false;
        }
        return this.adapter4List.persons.get(index);
      },

      /**
       * [description 点击编辑]
       * @param  {[type]} element
       * @param  {[type]} event
       * @return {[type]}
       */
      ".order-edit click": function(element, event) {
        this.clearActive();
        element.parents("li").addClass("active");

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

      /**
       * [description 点击新增]
       * @param  {[type]} element
       * @param  {[type]} event
       * @return {[type]}
       */
      ".btn-add click": function(element, event) {
        //隐藏其它编辑和新增状态
        $("#personlist").find(".order-r2").hide();

        //this.options.userList[0].user.attr("active", "active");
        $('#editPersonArea').hide();
        $("#addPersonArea").show();
        $(element).hide();
        this.component.personEditor.show('create', null, $("#addPersonArea"));
        return false;
      },

      /**
       * [description 点击 展开/关闭 的图标事件]
       * @param  {[type]} element
       * @param  {[type]} event
       * @return {[type]}
       */
      ".icon30 click": function(element, event) {
        element.parents(".order-b").toggleClass("active");
        element.parent("div").find(".order-r2").hide();
        return false;
      },

      /**
       * [description 点击选中事件]
       * @param  {[type]} element
       * @param  {[type]} e
       * @return {[type]}
       */
      "#personList click": function(element, e) {
        if (event.srcElement.tagName == 'SPAN') {
          this.clearActive();
          $(event.srcElement).parents("li[name='personEach']").addClass("active");

          return false;
        }
      },

      /**
       * [clearActive 清除所有激活状态]
       * @return {[type]}
       */
      clearActive: function() {
        //其他所有节点都是非active状态
        $("li[name='personEach']").removeClass("active");
        //隐藏其它编辑和新增状态
        $("#personlist").find(".order-r2").hide();
      }

    });
  })