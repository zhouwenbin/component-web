'use strict';

define('sf.b2c.mall.order.selectreceiveaddr', [
  'can',
  'jquery',
  'jquery.cookie',
  'store',
  'md5',
  'sf.b2c.mall.adapter.regions',
  'sf.b2c.mall.adapter.address.list',
  'sf.b2c.mall.api.user.getRecAddressList',
  'sf.b2c.mall.api.user.getIDCardUrlList',
  'sf.b2c.mall.api.user.webLogin',
  'sf.b2c.mall.api.user.delRecAddress',
  'sf.b2c.mall.api.user.setDefaultAddr',
  'sf.b2c.mall.api.user.setDefaultRecv',
  'sf.b2c.mall.api.b2cmall.checkLogistics',
  'sf.b2c.mall.api.b2cmall.getItemSummary',
  'sf.b2c.mall.widget.message',
  'sf.b2c.mall.component.addreditor',
  'sf.b2c.mall.order.iteminfo'
], function(can, $, $cookie, store, md5,
    RegionsAdapter, AddressAdapter,
    SFGetRecAddressList,SFGetIDCardUrlList, SFUserWebLogin,SFDelRecAddress,SFSetDefaultAddr, SFSetDefaultRecv,
    CheckLogistics,SFGetItemSummary,
    SFMessage, SFAddressEditor, SFItemInfo) {
  var AREAID;
  return can.Control.extend({
    adapter: {},
    adapter4List: {},
    component: {},

    /**
     * 初始化
     * @param  {DOM} element 容器element
     * @param  {Object} options 传递的参数
     */
    init: function(element, options) {
      this.paint();
      this.component.checkLogistics = new CheckLogistics();

      var params = can.deparam(window.location.search.substr(1));
      var getItemSummary = new SFGetItemSummary({
        "itemId":params.itemid
      });
      getItemSummary.sendRequest()
        .done(function(data){
          AREAID = data.areaId;
        })
        .fail();
    },
    helpers:{
      'defaultAddr':function(isDefault,options){
        if (isDefault() == 1) {
          return options.fn(options.contexts || this);
        } else {
          return options.inverse(options.contexts || this);
        };
      }
    },
    render: function(data) {
      var html = can.view('templates/order/sf.b2c.mall.order.selectrecaddr.mustache', data, this.helpers);
      this.element.html(html);
    },

    paint: function(data) {
      var that = this;

      var getRecAddressList = new SFGetRecAddressList();
      var getIDCardUrlList = new SFGetIDCardUrlList();

      can.when(getRecAddressList.sendRequest(), getIDCardUrlList.sendRequest())
        .done(function(recAddrs, recPersons) {

          that.result = that.queryAddress(recAddrs, recPersons);
          //@TODO 从cookie中获取嘿客穿越过来标示
          var heike_sign = $.cookie('1_uinfo');
          var arr = [];
          if (heike_sign) {
            arr = heike_sign.split(',');
          }
          var params = can.deparam(window.location.search.substr(1));
          var map = {
            'heike': function (list, id) {
              var value = _.findWhere(list, {addrId: id});
              if (value) {
                return [value];
              }else{
                return []
              }
            }
          };

          // @note 业务代码发生变化，不再关注orgCode，只需要看arr[2]=heike
          var fn = map[arr[2]];
          var list = null;
          if (_.isFunction(fn)) {
            list = fn(that.result, data && data.value)
          }

          //获得地址列表
          that.adapter4List.addrs = new AddressAdapter({
            addressList: list || that.result || [],
            hasData: false
          });

          //设置默认地址是否显示
          that.adapter4List.addrs.attr("canShowSetDefaultAddr", typeof arr[2] == 'undefined');

          //进行倒排序
          //that.adapter4List.addrs.addressList.reverse();

          if (that.adapter4List.addrs.addressList != null && that.adapter4List.addrs.addressList.length > 0) {
            that.adapter4List.addrs.addressList[0].attr("active", "active");
            that.adapter4List.addrs.attr("hasData", true);
          }

          //进行渲染
          that.render(that.adapter4List.addrs, arr[2]);

          // if (that.component.addressEditor) {
          //   that.component.addressEditor.destroy();
          // }

          that.component.addressEditor = new SFAddressEditor('#addAdrArea', {
            onSuccess: _.bind(that.paint, that),
            from: 'order'
          });
          that.showAllAdr();
          that.request();
          if (typeof data != 'undefined') {
            $("body,html").animate({scrollTop:200});
            var changedAddr = $("li[name='addrEach']");
            var len = $("li[name='addrEach']").length;
            $("li[name='addrEach']").removeClass('active');
            for (var i = 0; i < len; i++) {
              if ($(changedAddr).eq(i).data('addressid') == data.value) {
                $(changedAddr).eq(i).addClass('active');
                break;
              };
            };
          }

          that.initItemInfo();
        })
        .fail(function(error) {
          console.error(error);
        })
    },

    initItemInfo: function() {
      this.component.itemInfo = new SFItemInfo('.sf-b2c-mall-order-itemInfo', {
        vendorinfo: this.options.vendorinfo,
        addr: this.getSelectedAddr()
      });
    },
    /**
     * 判断地址是否有效
     * @param selectValue
     */
    check: function (selectValue) {
      var that = this;
      if(AREAID != 0){
        var provinceId =that.adapter.regions.getIdByName(selectValue.provinceName);
        var cityId = that.adapter.regions.getIdBySuperreginIdAndName(provinceId, selectValue.cityName);
        var regionId = that.adapter.regions.getIdBySuperreginIdAndName(cityId, selectValue.regionName);

        that.component.checkLogistics.setData({
          areaId:AREAID,
          provinceId:provinceId,
          cityId:cityId,
          districtId:regionId
        });
        that.component.checkLogistics.sendRequest()
          .done(function(data){
            if(data){
              if(data.value == false){
                $('#errorTips').removeClass('visuallyhidden');
                $('#submitOrder').addClass('disable');
                return false;
              }else{
                $('#errorTips').addClass('visuallyhidden');
                $('#submitOrder').removeClass('disable');
                return true;
              }
            }
          })
          .fail(function(data){

          })
      }
    },

    request: function() {
      var that = this;
      return can.ajax('json/sf.b2c.mall.regions.json')
        .done(_.bind(function(cities) {
          this.adapter.regions = new RegionsAdapter({
            cityList: cities
          });
          var firstAddr = that.getSelectedAddr();
          this.check(firstAddr);
        }, this))
        //   function(cities) {
        //   that.adapter.regions = new RegionsAdapter({
        //     cityList: cities
        //   });
        // })
        .fail(function() {

        });
    },
    showAllAdr:function(){
      var len = $("li[name='addrEach']").length;
      if (len > 3) {
        $("li[name='addrEach']:lt(3)").css('display','block');
      }else{
        $("li[name='addrEach']").css('display','block');
        $('.icon30').hide();
      }
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
            recAddrItem.credtNum2 = presonItem.credtNum2;
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
              tempObje.credtNum2 = presonItemTemp.credtNum2
              result.push(tempObje);
            }

          }
        })
      })

      return result;
    },
    getCityList: function() {
      return can.ajax('json/sf.b2c.mall.regions.json');
    },

    /**
     * [getSelectedIDCard 获得选中的收货地址]
     * @return {[type]} [description]
     */
    getSelectedAddr: function() {
      var index = $("#addrList").find("li.active").eq(0).attr('data-index');
      if (typeof index == 'undefined'){
          return false;
        }
      return this.adapter4List.addrs.get(index);
    },

    //设为默认地址
    ".btn-setDefault click":function(element,event){
      var that = this;
      var index = element.data('index');
      var addr = this.adapter4List.addrs.get(index);
      this.adapter4List.addrs.input.attr('addrId', addr.addrId);

      var setDefaultRecv = new SFSetDefaultRecv({
        "recId": addr.recId
      });

      var setDefaultAddr = new SFSetDefaultAddr({
        "addrId": addr.addrId
      });
      can.when(setDefaultRecv.sendRequest(),setDefaultAddr.sendRequest())
        .done(function(data){
          new SFMessage(null,{
            'tip': '设为默认地址成功！',
            'type': 'success'
          });
          that.paint();
          var provinceId = that.adapter.regions.getIdByName(addr.provinceName);
          var cityId = that.adapter.regions.getIdBySuperreginIdAndName(provinceId, addr.cityName);
          var regionId = that.adapter.regions.getIdBySuperreginIdAndName(cityId, addr.regionName);

          store.set('provinceId',provinceId);
          store.set('cityId',cityId);
          store.set('regionId',regionId);
        })
        .fail(function(){

        })
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
      $('#btn-add-addr').show();
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
    delAddress: function(element, addr) {
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
          that.paint();
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
    "#btn-add-addr click": function(element, event) {
      //隐藏其它编辑和新增状态
      $("#addrList").find(".order-r2").hide();
      $("#addAdrArea").show();
      $(element).hide();
      this.component.addressEditor.show('create', null, $("#addAdrArea"));
      return false;
    },

    /**
     * [description 点击选中事件]
     * @param  {[type]} element
     * @param  {[type]} e
     * @return {[type]}
     */
    "#addrList click": function(element, event) {
      var event = event || window.event;
      var obj=event.srcElement ? event.srcElement : event.target;
      if (obj.tagName == 'SPAN') {
        //$('#errorTips').addClass('visuallyhidden');
        this.clearActive();
        $(obj).parents("li[name='addrEach']").addClass("active");
        var dataValue = this.getSelectedAddr();
        this.check(dataValue);
        this.initItemInfo();
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
