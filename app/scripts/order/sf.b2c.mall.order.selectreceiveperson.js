'use strict';

define('sf.b2c.mall.order.selectreceiveperson', [
    'can',
    'md5',
    'sf.b2c.mall.api.user.getIDCardUrlList',
    'sf.b2c.mall.api.user.webLogin',
    'sf.b2c.mall.api.user.createReceiverInfo',
    'sf.b2c.mall.api.user.updateReceiverInfo',
    'sf.b2c.mall.adapter.order'
  ],
  function(can, md5, SFGetIDCardUrlList, SFUserWebLogin, SFCreateReceiverInfo, SFUpdateReceiverInfo, SFOrderAdapter) {

    return can.Control.extend({

      defaults: {
        user: new can.Map({
          recName: null,
          credtNum: null,
          cellphone: null,
          recId: null
        })
      },

      /**
       * 初始化
       * @param  {DOM} element 容器element
       * @param  {Object} options 传递的参数
       */
      init: function(element, options) {
        this.adapter = new SFOrderAdapter();
        this.render(this.data);
      },

      render: function(data) {
        var that = this;

        var webLogin = new SFUserWebLogin({
          accountId: 'jiyanliang@sf-express.com',
          type: 'MAIL',
          password: md5('123456' + 'www.sfht.com')
        });

        webLogin
          .sendRequest()
          .then(function() {
            var getIDCardUrlList = new SFGetIDCardUrlList();
            return getIDCardUrlList.sendRequest();
          })
          .done(function(message) {
            //模型转换，方便编辑数据填充
            that.options.userList = new Array();
            _.each(message.items, function(item) {
              that.options.userList.push({
                user: item
              });
            });

            //进行倒排序
            that.options.userList.reverse();

            //用于新增
            that.options.user = that.defaults.user;

            //进行属性设定，保证列表初始化时候只有一行可见
            that.options.hasData = that.options.userList.length > 0 ? true : false;

            if (that.options.hasData) {
              that.options.userList[0].user.active = "active";
              that.options = that.adapter.format(that.options);
            }

            //进行渲染
            var html = can.view('templates/order/sf.b2c.mall.order.selectrecperson.mustache', that.options);
            that.element.html(html);
          })
          .fail(function(errorCode) {

            console.error(errorCode);
          })
      },

      /**
       * [description 编辑保存]
       * @param  {[type]} element
       * @param  {[type]} event
       * @return {[type]}
       */
      "#editSave click": function(element, event) {

        var that = this;
        var recId = element[0].dataset.recid;

        var data = _.find(this.options.userList, function(item) {
          return item.user.recId == recId;
        });

        data.attr("active", "active");

        var updateReceiverInfo = new SFUpdateReceiverInfo({
          recId: recId,
          recName: data.user.recName,
          credtNum: data.user.credtNum,
          type: "ID",
          cellphone: data.user.cellphone
        });

        updateReceiverInfo
          .sendRequest()
          .fail(function(error) {
            console.error(error);
          })
          .done(function(message) {
            $("#addarea").hide();
            //重新执行查询
            var getIDCardUrlList = new SFGetIDCardUrlList();
            getIDCardUrlList
              .sendRequest()
              .done(function(message) {
                var userList = [];
                _.each(message.items, function(item) {

                  if (item.recId == recId) {
                    item.active = "active";
                  }

                  userList.push({
                    user: item
                  });
                });

                that.options.attr("userList", userList);
                that.options.attr("hasData", true);
              })
          })

        return false;
      },

      /**
       * [description 新增保存]
       * @param  {[type]} element
       * @param  {[type]} event
       * @return {[type]}
       */
      "#addSave click": function(element, event) {

        var that = this;

        var createReceiverInfo = new SFCreateReceiverInfo({
          recName: this.options.user.recName,
          credtNum: this.options.user.credtNum,
          type: "ID",
          cellphone: this.options.user.cellphone
        });
        createReceiverInfo
          .sendRequest()
          .fail(function(error) {
            console.error(error);
          })
          .done(function(message) {
            $("#addarea").hide();
            //重新执行查询
            var getIDCardUrlList = new SFGetIDCardUrlList();
            getIDCardUrlList
              .sendRequest()
              .done(function(message) {
                var userList = new Array();
                _.each(message.items, function(item) {
                  userList.push({
                    user: item
                  });
                });

                //进行倒排序
                userList.reverse();

                that.options.attr("userList", userList);
                that.options.attr("hasData", true);
                that.options.userList[0].user.attr("active", "active");
              })
          })
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
       * [description 点击编辑]
       * @param  {[type]} element
       * @param  {[type]} event
       * @return {[type]}
       */
      ".order-edit click": function(element, event) {

        this.clearActive();
        element.parents("li").find(".order-r2").toggle();
        element.parents("li").addClass("active");
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

        this.options.userList[0].user.attr("active", "active");
        $("#addarea").show();
        return false;
      },

      /**
       * [description 点击选中事件]
       * @param  {[type]} element
       * @param  {[type]} e
       * @return {[type]}
       */
      "#personlist click": function(element, e) {
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