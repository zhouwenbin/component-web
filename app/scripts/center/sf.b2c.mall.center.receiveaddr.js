'use strict';

define('sf.b2c.mall.center.receiveaddr', [
    'can',
    'jquery',
    'sf.b2c.mall.api.user.getRecAddressList',
    'sf.b2c.mall.adapter.address.list',
    'sf.b2c.mall.component.addreditor',
    'sf.b2c.mall.api.user.webLogin',
    'md5',
    'sf.b2c.mall.framework.comm',
    'sf.b2c.mall.api.user.delRecAddress',
    'sf.b2c.mall.widget.message'
  ],
  function(can, $, SFGetRecAddressList, AddressAdapter, SFAddressEditor, SFUserWebLogin, md5, SFFrameworkComm, SFDelRecAddress,SFMessage) {


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
        this.component.getRecAddressList = new SFGetRecAddressList();
        this.paint();
      },

      helpers:{
        'isover': function (addressList, options) {
          var data = addressList();
          if (data && data.length > 15) {
            var text = '已保存了'+data.length+'条收货地址，还能保存'+(20-data.length)+'条收货地址。';
            return options.fn(new can.Map({errorText: text}));
          }else{
            return options.inverse(options.contexts || this);
          }
        }
      },

      render: function(data) {
        var html = can.view('templates/center/sf.b2c.mall.center.receiveaddr.mustache', data, this.helpers);
        this.element.html(html);
      },

      paint: function() {
        var that = this;

        this.component.getRecAddressList.sendRequest()
          .fail(function(error) {
          })
          .done(function(reAddrs) {

            //获得地址列表
            that.adapter4List.addrs = new AddressAdapter({
              addressList: reAddrs.items,
              hasData: false
            });

            //进行倒排序
            //that.adapter4List.addrs.addressList.reverse();

            if (that.adapter4List.addrs.addressList != null && that.adapter4List.addrs.addressList.length > 0) {
              that.adapter4List.addrs.attr("hasData", true);
            }

            //进行渲染
            that.render(that.adapter4List.addrs);

            that.component.addressEditor = new SFAddressEditor('#addAdrArea', {
              onSuccess: _.bind(that.paint, that)
            });
          })
      },

      getCityList: function() {
        return can.ajax('json/sf.b2c.mall.regions.json');
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

        $('#editAdrArea').hide();
        $('#addAdrArea').hide();

        var editAdrArea = element.parents("li[name='addrEach']").find("#editAdrArea");
        editAdrArea.show();
        this.component.addressEditor.show("editor", addr, $(editAdrArea));
        return false;
      },

      ".order-del click": function(element, event){
        var index = element.data('index');
        var addr = this.adapter4List.addrs.get(index);

        var that = this;
        var message = new SFMessage(null, {
          'tip': '确认要删除该收货地址信息吗？',
          'type': 'confirm',
          'okFunction': _.bind(that.delAddress, that, element, addr)
        });

        return false;
      },

      delAddress: function(element, addr){
        var that = this;

        var delRecAddress = new SFDelRecAddress({"addrId":addr.addrId});
        delRecAddress
          .sendRequest()
          .done(function(result){

            if (result.value){
              that.paint();
            }
          })
          .fail(function(error){
            //console.error(error);
          })
      },

      /**
       * [description 点击新增]
       * @param  {[type]} element
       * @param  {[type]} event
       * @return {[type]}
       */
      ".btn-add click": function(element, event) {

        //隐藏其它编辑和新增状态
        $('#editAdrArea').hide();
        $("#addAdrArea").show();
        $(element).hide();
        this.component.addressEditor.show('create', null, $("#addAdrArea"));
        return false;
      }
    })
  })