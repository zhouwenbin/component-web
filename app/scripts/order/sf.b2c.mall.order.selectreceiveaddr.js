'use strict';

define('sf.b2c.mall.order.selectreceiveaddr', [
  'can',
  'sf.b2c.mall.api.user.getRecAddressList',
  'sf.b2c.mall.adapter.address.list',
  'sf.b2c.mall.component.addreditor',
  'sf.b2c.mall.api.user.webLogin',
  'md5'
], function(can, SFGetRecAddressList, AddressAdapter, SFAddressEditor, SFUserWebLogin, md5) {
  return can.Control.extend({

    /**
     * 初始化
     * @param  {DOM} element 容器element
     * @param  {Object} options 传递的参数
     */
    init: function(element, options) {
      this.adapter4List = {};
      this.component = {};
      this.paint();
    },

    render: function(data) {
      var html = can.view('templates/order/sf.b2c.mall.order.selectrecaddr.mustache', data);
      this.element.html(html);
    },

    paint: function() {
      var that = this;

      var getRecAddressList = new SFGetRecAddressList();

      getRecAddressList
        .sendRequest()
        .done(function(reAddrs) {

          var params = can.deparam(window.location.search.substr(1));
          var map = {
            'heike_online': []
          }

          //获得地址列表
          that.adapter4List.addrs = new AddressAdapter({
            addressList: map[params.saleid] || reAddrs.items || [],
            hasData: false
          });

          //进行倒排序
          //that.adapter4List.addrs.addressList.reverse();

          if (that.adapter4List.addrs.addressList != null && that.adapter4List.addrs.addressList.length > 0) {
            that.adapter4List.addrs.addressList[0].attr("active", "active");
            that.adapter4List.addrs.attr("hasData", true);
          }

          //进行渲染
          that.render(that.adapter4List.addrs);

          // if (that.component.addressEditor) {
          //   that.component.addressEditor.destroy();
          // }

          that.component.addressEditor = new SFAddressEditor('#addAdrArea', {
            onSuccess: _.bind(that.paint, that)
          });
        })
        .fail(function(error) {
          console.error(error);
        })
    },

    getCityList: function() {
      return can.ajax('json/sf.b2c.mall.regions.json');
    },



    /**
     * [description 新增保存]
     * @param  {[type]} element
     * @param  {[type]} event
     * @return {[type]}
     */
    "#addSave click": function(element, event) {


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
     * [description 点击编辑]
     * @param  {[type]} element
     * @param  {[type]} event
     * @return {[type]}
     */
    ".order-edit click": function(element, event) {

      var index = element.data('index');
      var addr = this.adapter4List.addrs.get(index);
      this.adapter4List.addrs.input.attr('addrId', addr.addrId);

      var editAdrArea = element.parents("li[name='addrEach']").find("#editAdrArea");
      this.component.addressEditor.show("editor", addr, $(editAdrArea));

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
      $("#addrList").find(".order-r2").hide();
      $("#addAdrArea").show();
      $(element).hide();
      this.component.addressEditor.show('create', null, $("#addAdrArea"));
      // console.log(this.component.addressEditor.adapter);
      return false;
    },

    /**
     * [description 点击选中事件]
     * @param  {[type]} element
     * @param  {[type]} e
     * @return {[type]}
     */
    "#addrList click": function(element, e) {
      if (event.srcElement.tagName == 'SPAN') {
        this.clearActive();
        $(event.srcElement).parents("li[name='addrEach']").addClass("active");

        return false;
      }
    },

    /**
     * [clearActive 清除所有激活状态]
     * @return {[type]}
     */
    clearActive: function() {
      //其他所有节点都是非active状态
      $("li[name='addrEach']").removeClass("active");
      //隐藏其它编辑和新增状态
      $("#addrList").find(".order-r2").hide();
    }
  });
})