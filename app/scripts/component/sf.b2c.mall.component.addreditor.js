'use strict';

define('sf.b2c.mall.component.addreditor', [
  'can',
  'store',
  'sf.b2c.mall.adapter.regions',
  'sf.b2c.mall.api.user.createRecAddress',
  'sf.b2c.mall.api.user.updateRecAddress',
  'placeholders',
  'sf.b2c.mall.widget.message',
  'sf.b2c.mall.api.b2cmall.getItemSummary',
  'sf.b2c.mall.api.b2cmall.checkLogistics'

], function(can,store,RegionsAdapter, SFCreateRecAddress, SFUpdateRecAddress, placeholders, SFMessage,SFGetItemSummary,CheckLogistics) {
  var AREAID;
  return can.Control.extend({

    init: function() {
      this.adapter = {};
      this.component = {};
      this.request();
      this.onSuccess = this.options.onSuccess;
      this.from = this.options.from;
      this.component.checkLogistics = new CheckLogistics();

      
    },

    request: function() {
      var that = this;
      return can.ajax('json/sf.b2c.mall.regions.json')
        .done(_.bind(function(cities) {
          this.adapter.regions = new RegionsAdapter({
            cityList: cities
          });
        }, this))
        //   function(cities) {
        //   that.adapter.regions = new RegionsAdapter({
        //     cityList: cities
        //   });
        // })
        .fail(function() {

        });
    },

    /**
     * @description 对页面进行渲染
     * @param  {Map} data 渲染页面的数据
     */
    render: function(data, tag, element) {
      this.setup(element)
      var html = can.view('templates/component/sf.b2c.mall.component.addreditor.mustache', data);
      element.html(html);
      // this.switchView('list', {
      //   recId: data.addr.input.recId
      // });

      this.supplement(tag);
    },

    /**
     * @description 对页面进行补充处理
     */
    supplement: function(tag) {
      if (tag == 'create') {
        this.changeCity();
        this.changeRegion();
      }
    },

    show: function(tag, data, element) {
      var that = this;
      if (this.adapter.regions) {
        that._show.call(that, tag, data, element);
      } else {
        this.request().then(function() {
          that._show.call(that, tag, data, element);
        });
      }
    },

    _show: function(tag, params, element) {
      var map = {
        'create': function(data) {
          return {
            input: {
              addrId: null,
              nationName: '0',
              provinceName: this.adapter.regions.findGroup(0)[0].id,
              cityName: null,
              regionName: null,
              detail: null,
              recId: null,
              cellphone: null,
              zipCode: null
            },
            place: {
              countries: [{
                id: 0,
                name: '中国'
              }],
              provinces: this.adapter.regions.findGroup(0),
              cities: null,
              regions: null
            },
            control: {
              add: false
            },
            mainTitle: {
              text: '添加收货地址'
            },
            cancle: {
              text: '取消添加'
            },
            error: {
              detail: null,
              zipCode: null,
              cellphone: null
            }
          };
        },
        'editor': function(data) {
          var provinceId = this.adapter.regions.getIdByName(data.provinceName);
          var cityId = this.adapter.regions.getIdBySuperreginIdAndName(provinceId, data.cityName);
          var regionId = this.adapter.regions.getIdBySuperreginIdAndName(cityId, data.regionName);

          return {
            input: {
              addrId: data.addrId,
              nationName: 0,
              provinceName: provinceId,
              cityName: cityId,
              regionName: regionId,
              detail: data.detail,
              cellphone: data.cellphone,
              zipCode: data.zipCode,
              recId: data.recId
            },
            place: {
              countries: [{
                id: 0,
                name: '中国'
              }],
              provinces: this.adapter.regions.findGroup(0),
              cities: this.adapter.regions.getGroupByName(data.provinceName),
              regions: this.adapter.regions.getGroupByName(data.cityName)
            },
            control: {
              add: false
            },
            mainTitle: {
              text: '修改收货地址'
            },
            cancle: {
              text: '取消修改'
            },
            error: {
              detail: null,
              zipCode: null,
              cellphone: null
            }
          };
        }
      };
      var info = map[tag].call(this, params);
      this.adapter.addr = new can.Map(info);

      this.render(this.adapter, tag, element);
    },

    hide: function() {
      this.destroy();
    },

    clearComponents: function() {
      if (this.component.idList) {
        this.component.idList.destroy();
      }

      if (this.component.idEditor) {
        this.component.idEditor.destroy();
      }
    },

    changeCity: function() {
      var pid = this.adapter.addr.input.attr('provinceName');

      var cities = this.adapter.regions.findGroup(window.parseInt(pid));
      this.adapter.addr.place.attr('cities', cities);
      this.adapter.addr.input.attr('cityName', cities[0].id);
    },

    changeRegion: function() {
      var cid = this.adapter.addr.input.attr('cityName');

      var regions = this.adapter.regions.findGroup(window.parseInt(cid));
      this.adapter.addr.place.attr('regions', regions);
      this.adapter.addr.input.attr('regionName', regions[0].id);
    },

    '#s2 change': function(element, event) {
      this.changeCity();
      this.changeRegion();
    },

    /**
     * @description 城市发生变化，区同时发生变化
     * @param  {Dom}    element
     * @param  {Event}  event
     */
    '#s3 change': function(element, event) {
      this.changeRegion();
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

    add: function(addr) {
      var that = this;
      delete addr.recId;
      if(typeof this.from != 'undefined' && this.from == 'order'){
        if (AREAID != 0) {
          var params = can.deparam(window.location.search.substr(1));
          var getItemSummary = new SFGetItemSummary({
            "itemId":params.itemid
          });
          can.when(getItemSummary.sendRequest())
            .done(function(data){
              var provinceId = that.adapter.addr.input.attr('provinceName');
              var cityId = that.adapter.addr.input.attr('cityName');
              var regionId = that.adapter.addr.input.attr('regionName');

              that.component.checkLogistics.setData({
                areaId:data.areaId,
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
            })
            .fail(function(data){

            })         
        }
      }
      var cinfo = can.deparam(window.location.search.substr(1));
      if (cinfo.saleid == 'heike_online' && !_.isEmpty(cinfo.orgCode)) {
        addr.partnerId = 'heike';
      }

      var createRecAddress = new SFCreateRecAddress(addr);
      createRecAddress
        .sendRequest()
        .done(function(data) {

          var message = new SFMessage(null, {
            'tip': '新增收货地址成功！',
            'type': 'success'
          });

          that.hide();
          that.onSuccess(data);

          return true;
        })
        .fail(function(error) {
          if (error === 1000310) {
            new SFMessage(null, {
              "title": '顺丰海淘',
              'tip': '您已添加20条收货地址信息，请返回修改！',
              'type': 'error'
            });
          }
          return false;
        });
    },

    update: function(addr) {
      var that = this;
      if(typeof this.from != 'undefined' && this.from == 'order'){
        if (AREAID != 0) {
          var params = can.deparam(window.location.search.substr(1));
          var getItemSummary = new SFGetItemSummary({
            "itemId":params.itemid
          });
          can.when(getItemSummary.sendRequest())
            .done(function(data){
              var provinceId = that.adapter.addr.input.attr('provinceName');
              var cityId = that.adapter.addr.input.attr('cityName');
              var regionId = that.adapter.addr.input.attr('regionName');

              that.component.checkLogistics.setData({
                areaId:data.areaId,
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
            })
            .fail(function(data){

            })
         
        }
      }

      if(typeof this.from != 'undefined' && this.from == 'center'){
        var provinceId = that.adapter.addr.input.attr('provinceName');
        var cityId = that.adapter.addr.input.attr('cityName');
        var regionId = that.adapter.addr.input.attr('regionName');

        store.set('provinceId',provinceId);
        store.set('cityId',cityId);
        store.set('regionId',regionId);
      }

      var updateRecAddress = new SFUpdateRecAddress(addr);
      updateRecAddress
        .sendRequest()
        .done(function(data) {

          var message = new SFMessage(null, {
            'tip': '修改收货地址成功！',
            'type': 'success'
          });

          that.hide();
          that.onSuccess({value: window.parseInt(addr.addrId)});
        })
        .fail(function(error) {});
    },

    '#paddressSaveCancel click': function(element, event) {
      // this.hide();
      this.element.hide();
      this.element.empty();
      $('#btn-add-addr').show();
      return false;
    },

    '#address focus': function(element, event) {
      event && event.preventDefault();
      $('#detailerror').hide();
    },
    '#cellphone focus': function(element, event) {
      event && event.preventDefault();
      $('#cellphoneerror').hide();
    },
    '#zipcode focus': function(element, event) {
      event && event.preventDefault();
      $('#zipcodeerror').hide();
    },
    '#addressSave click': function(element, event) {
      event && event.preventDefault();

      $('.tel-hide').hide();
      var addr = this.adapter.addr.input.attr();

      var key;
      for (key in addr) {
        addr[key] = _.str.trim(addr[key]);
      }

      addr.nationName = '中国';
      addr.provinceName = this.adapter.regions.findOneName(window.parseInt(addr.provinceName));
      addr.cityName = this.adapter.regions.findOneName(window.parseInt(addr.cityName));
      addr.regionName = this.adapter.regions.findOneName(window.parseInt(addr.regionName));

      $('#detailerror').hide();
      $('#cellphoneerror').hide();
      $('#zipcodeerror').hide();

      //验证详细地址
      if (!addr.detail) {
        this.adapter.addr.attr("error", {
          "detail": '请填写详细地址信息！'
        })
        $('#detailerror').show();
        return false;
      }

      // 5~120字符之间
      if (addr.detail.length > 120 || addr.detail.length < 5) {
        this.adapter.addr.attr("error", {
          "detail": '请输入正确地址信息!'
        })
        $('#detailerror').show();
        return false;
      }

      if (!addr.cellphone) {
        this.adapter.addr.attr("error", {
          "cellphone": '请填写收货人手机号码！'
        })
        $('#cellphoneerror').show();
        return false;
      }

      //电话号码正则验证（以1开始，11位验证）)
      if (!/^1\d{10}$/.test(addr.cellphone)) {
        this.adapter.addr.attr("error", {
          "cellphone": '收货人手机号码填写有误！'
        })
        $('#cellphoneerror').show();
        return false;
      }

      //验证邮编，如果用户没输，跳过；反之进行验证
      if (!addr.zipCode) {
        this.adapter.addr.attr("error", {
          "zipCode": '请填写邮编！'
        });
        $('#zipcodeerror').show();
        return false;
      }

      var zipCodeRegex = /[0-9]\d{5}(?!\d)$/.test($.trim(addr.zipCode));
      if (!zipCodeRegex || addr.zipCode.length > 6) {
        this.adapter.addr.attr("error", {
          "zipCode": '邮编填写有误！'
        })

        $('#zipcodeerror').show();
        return false;
      }


      if (addr.addrId) {
        this.update(addr);
        element.parents('div#editAdrArea').toggle();
      } else {
        var result = this.add(addr);
        if (result) {
          element.parents('div#addAdrArea').toggle();
          $('#btn-add-addr').show();
        }
      }
    }
  });
})