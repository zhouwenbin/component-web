'use strict';

define('sf.b2c.mall.order.selectreceiveaddr', [
  'can',
  'sf.b2c.mall.api.user.getRecAddressList',
  'sf.b2c.mall.adapter.address.list',
  'sf.b2c.mall.component.addrEditor'
], function(can, SFGetRecAddressList, AddressAdapter, SFAddressEditor) {
  return can.Control.extend({

    /**
     * 初始化
     * @param  {DOM} element 容器element
     * @param  {Object} options 传递的参数
     */
    init: function(element, options) {
      this.adapter = {};
      this.component = {};
      this.render();
    },

    render: function(data){
      var html = can.view('templates/order/sf.b2c.mall.order.selectrecaddr.mustache', data);
      this.element.html(html);
    },

    paint: function() {
      var that = this;

      var getRecAddressList = new SFGetRecAddressList();

      getRecAddressList
        .sendRequest()
        .done(function(reAddrs) {
          debugger;

          //获得地址列表
          that.adapter.addrs = new AddressAdapter({
            addressList: reAddrs.items
          });

          //进行渲染
          that.render(that.adapter.addrs);

          if (that.component.addressEditor) {
            that.component.addressEditor.destroy();
          }

          that.component.addressEditor = new SFAddressEditor('#addAdrArea',{});
        })
        .fail(function() {

        });
    },

    /**
     * [description 编辑保存]
     * @param  {[type]} element
     * @param  {[type]} event
     * @return {[type]}
     */
    "#editSave click": function(element, event) {
      debugger;

      return false;
    },

    /**
     * [description 新增保存]
     * @param  {[type]} element
     * @param  {[type]} event
     * @return {[type]}
     */
    "#addSave click": function(element, event) {
      debugger;

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
      debugger;
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
    ".btn-add click": function(element, event) {debugger;
      //隐藏其它编辑和新增状态

      $("#addarea").show();
      return false;
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