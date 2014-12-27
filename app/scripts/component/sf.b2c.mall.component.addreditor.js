'use strict';

define('sf.b2c.mall.component.addrEditor', [
  'can',
  'sf.b2c.mall.adapter.regions',
  'sf.b2c.mall.api.user.createRecAddress',
  'sf.b2c.mall.api.user.updateRecAddress'

], function(can, RegionsAdapter, SFCreateRecAddress, SFUpdateRecAddress) {
  return can.Control.extend({

    init: function() {
      this.adapter = {};
      this.component = {};
      this.request();
      this.onSuccess = this.options.onSuccess;
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
              mobile: null,
              telephone: null,
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
              text: '新增收货地址'
            }
          };
        },
        'editor': function(data) {
          var provinceId = this.adapter.regions.getIdByName(data.provinceName);
          var cityId = this.adapter.regions.getIdBySuperreginIdAndName(provinceId, data.cityName);
          return {
            input: {
              addrId: data.addrId,
              nationName: 0,
              provinceName: provinceId,
              cityName: cityId,
              regionName: this.adapter.regions.getIdBySuperreginIdAndName(cityId, data.regionName),
              detail: data.detail,
              mobile: data.mobile,
              telephone: data.telephone,
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

      var createRecAddress = new SFCreateRecAddress(addr);
      createRecAddress
        .sendRequest()
        .done(function(data) {
          that.hide();
          that.onSuccess();
        })
        .fail(function() {

        });
    },

    update: function(addr) {
      var that = this;

      var updateRecAddress = new SFUpdateRecAddress(addr);
      updateRecAddress
        .sendRequest()
        .done(function(data) {
          that.hide();
          that.onSuccess();
        })
        .fail(function() {

        });
    },

    buttonClick: function() {
      $('.tel-hide').hide();
      var addr = this.adapter.addr.input.attr();

      addr.nationName = '中国 ';
      addr.provinceName = this.adapter.regions.findOneName(window.parseInt(addr.provinceName));
      addr.cityName = this.adapter.regions.findOneName(window.parseInt(addr.cityName));
      addr.regionName = this.adapter.regions.findOneName(window.parseInt(addr.regionName));

      //验证详细地址
      if (!addr.detail || addr.detail.length > 50) {
        return window.alert('您输入的收货地址有误');
      }
      //验证邮编，如果用户没输，跳过；反之进行验证
      if (!addr.zipCode) {} else {
        var zipCodeRegex = /[1-9]\d{5}(?!\d)$/.test($.trim(addr.zipCode));
        if (!zipCodeRegex || addr.zipCode.length > 6) {
          return window.alert('邮编输入错误');
        }
      }

      if (addr.addrId) {
        this.update(addr);
      } else {
        this.add(addr);
      }
    },

    '#addressSave click': function(element, event) {
      event && event.preventDefault();

      console.log(this.adapter)

      $('.tel-hide').hide();
      var addr = this.adapter.addr.input.attr();

      addr.nationName = '中国 ';
      addr.provinceName = this.adapter.regions.findOneName(window.parseInt(addr.provinceName));
      addr.cityName = this.adapter.regions.findOneName(window.parseInt(addr.cityName));
      addr.regionName = this.adapter.regions.findOneName(window.parseInt(addr.regionName));

      //验证详细地址
      if (!addr.detail || addr.detail.length > 50) {
        return window.alert('您输入的收货地址有误');
      }
      //验证邮编，如果用户没输，跳过；反之进行验证
      if (!addr.zipCode) {} else {
        var zipCodeRegex = /[1-9]\d{5}(?!\d)$/.test($.trim(addr.zipCode));
        if (!zipCodeRegex || addr.zipCode.length > 6) {
          return window.alert('邮编输入错误');
        }
      }

      if (addr.addrId) {
        this.update(addr);
        element.parents('div#editAdrArea').toggle();
      } else {
        this.add(addr);
        element.parents('div#addAdrArea').toggle();
      }
    }
  });
})