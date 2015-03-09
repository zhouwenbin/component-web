'use strict';

define('sf.b2c.mall.center.receiveaddr', [
    'can',
    'jquery',
    'store',
    'sf.b2c.mall.api.user.getRecAddressList',
    'sf.b2c.mall.api.user.getIDCardUrlList',
    'sf.b2c.mall.adapter.address.list',
    'sf.b2c.mall.component.addreditor',
    'sf.b2c.mall.api.user.webLogin',
    'md5',
    'sf.b2c.mall.framework.comm',
    'sf.b2c.mall.api.user.delRecAddress',
    'sf.b2c.mall.widget.message'
  ],
  function(can, $,store, SFGetRecAddressList,SFGetIDCardUrlList, AddressAdapter, SFAddressEditor, SFUserWebLogin, md5, SFFrameworkComm, SFDelRecAddress,SFMessage) {

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

        var getRecAddressList = new SFGetRecAddressList();
        var getIDCardUrlList = new SFGetIDCardUrlList();

        can.when(getRecAddressList.sendRequest(), getIDCardUrlList.sendRequest())
          .done(function(recAddrs, recPersons) {

            that.result = that.queryAddress(recAddrs, recPersons);

            //获得地址列表
            that.adapter4List.addrs = new AddressAdapter({
              addressList: that.result,
              hasData: false
            });

            if (that.adapter4List.addrs.addressList != null && that.adapter4List.addrs.addressList.length > 0) {
              that.adapter4List.addrs.attr("hasData", true);
            }

            //进行渲染
            that.render(that.adapter4List.addrs);

            that.component.addressEditor = new SFAddressEditor('#addAdrArea', {
              onSuccess: _.bind(that.paint, that),
              from:'center'
            });

          });        
      },

      getCityList: function() {
        return can.ajax('json/sf.b2c.mall.regions.json');
      },

      /** 获得收获人和收获地址 */
      queryAddress: function(recAddrs, recPersons) {
        var result = new Array();

        //取得默认的收货人和收货地址
        var defaultRecAddrID = null;
        var defaultRecID = null;
        _.each(recAddrs.items, function(recAddrItem) {
          _.each(recPersons.items, function(presonItem) {
            if (recAddrItem.isDefault != 0 && presonItem.isDefault != 0 && recAddrItem.recId != 0 && presonItem.recId != 0) {
              recAddrItem.recName = presonItem.recName;
              recAddrItem.credtNum = presonItem.credtNum;
              result.push(recAddrItem);

              defaultRecAddrID = recAddrItem.addrId;
              defaultRecID = recAddrItem.recId;
            }
          })
        })

        //取得关联的收货人和收货地址（为啥要遍历两次：因为要确保默认收货人和收货地址放在第一条）
        var tempObje = {};
        _.each(recAddrs.items, function(recAddrItemTemp) {
          _.each(recPersons.items, function(presonItemTemp) {
            if (recAddrItemTemp.recId == presonItemTemp.recId && (recAddrItemTemp.isDefault == 0 || presonItemTemp.isDefault == 0) && recAddrItemTemp.recId != 0 && presonItemTemp.recId != 0) {

              if (recAddrItemTemp.addrId != defaultRecAddrID) {
                tempObje = recAddrItemTemp;
                tempObje.recName = presonItemTemp.recName;
                tempObje.credtNum = presonItemTemp.credtNum;

                result.push(tempObje);
              }

            }
          })
        })

        return result;
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
            var defaultId = element.attr('data-isdefault');
            if (defaultId == 1) {
              store.remove('provinceId');
              store.remove('cityId');
              store.remove('regionId');
            };
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