'use strict';

// @description 申请命名空间
sf.util.namespace('b2c.mall.center.address.editor');

/**
 * @class sf.b2c.mall.center.address.editor
 * @author Michael.Lee (leewind19841209@gmail.com)
 * @description 用户中心 -- 用户收货地址模块
 */
sf.b2c.mall.center.address.editor = can.Control.extend({

  init: function() {
    this.adapter = {};
    this.component = {};
    this.request();
  },

  request: function() {
    var that = this;
    return can.when(sf.b2c.mall.model.user.getCityList())
      .done(function(cities) {
        that.adapter.regions = new sf.b2c.mall.adapter.regions({
          cityList: cities
        });
      })
      .fail(function() {

      });
  },

  /**
   * @description 对页面进行渲染
   * @param  {Map} data 渲染页面的数据
   */
  render: function(data, tag) {
    var html = can.view('templates/center/sf.b2c.mall.center.address.editor.mustache', data);
    this.element.html(html);
    this.switchView('list', {
      recId: data.addr.input.recId
    });

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

  show: function(tag, data) {
    var that = this;
    if (this.adapter.regions) {
      that._show.call(that, tag, data);
    } else {
      this.request().then(function() {
        that._show.call(that, tag, data);
      });
    }
  },

  _show: function(tag, params) {
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
            mainTitle:{
                text:'新增收货地址'
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
          mainTitle:{
            text:'修改收货地址'
          }
        };
      }
    };
    var info = map[tag].call(this, params);
    this.adapter.addr = new can.Map(info);

    this.render(this.adapter, tag);
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

  viewMap: {
    'list': function(idcard) {
      this.clearComponents();
      this.component.idList = new sf.b2c.mall.center.id.list('#center-add-user', {
        switchView: _.bind(this.switchView, this),
        recId: idcard && idcard.recId,
        onRender: _.bind(this.options.onUserUpdate, this)
      });
    },
    'editor': function(user) {
      this.clearComponents();
      this.component.idEditor = new sf.b2c.mall.center.id.editor('#center-add-user', {
        switchView: _.bind(this.switchView, this),
        input: user
      });
    }
  },

  switchView: function(tag, data) {
    if (_.isFunction(this.viewMap[tag])) {

      var map = {
        'list': function() {
          var recId = (data && data.recId) || this.adapter.addr.input.recId;
          this.viewMap[tag].call(this, {
            recId: recId
          });
        },

        'editor': function() {
          this.viewMap[tag].call(this, data);
        }
      };

      map[tag].call(this);
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
    can.when(sf.b2c.mall.model.user.createRecAddress(sf.util.clean(addr)))
      .done(function(data) {
        if (sf.util.access(data, true)) {
          that.hide();
          that.options.onSuccess();
        }
      })
      .fail(function() {

      });
  },

  update: function(addr) {
    var that = this;
    can.when(sf.b2c.mall.model.user.updateRecAddress(sf.util.clean(addr)))
      .done(function(data) {
        if (sf.util.access(data, true)) {
          that.hide();
          that.options.onSuccess();
        }
      })
      .fail(function() {

      });
  },

  '#center-address-save click': function(element, event) {
    event && event.preventDefault();

    $('.tel-hide').hide();
    var addr = this.adapter.addr.input.attr();
    if (this.component.idList) {
      var user = this.component.idList.getSelectedIdcard();
      addr = _.extend(addr, user);
    }else{
      return window.alert('请添加新收货人')
    }

    if (!addr.recId) {
      return window.alert('请选择收货人')
    }

    addr.nationName = '中国 ';
    addr.provinceName = this.adapter.regions.findOneName(window.parseInt(addr.provinceName));
    addr.cityName = this.adapter.regions.findOneName(window.parseInt(addr.cityName));
    addr.regionName = this.adapter.regions.findOneName(window.parseInt(addr.regionName));

    //    for(var key in this.checkMap){
    //      if (!addr[key]) {
    //        return window.alert(this.checkMap[key]);
    //      }
    //    }
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

    // 验证用户手机号码
    if (!addr.mobile) {
      $('.tel-hide').show();
      return false;
    } else {
      $('.tel-hide').hide();
      var mobileValidate = /^[0-9]\d{10}$/.test($.trim(addr.mobile));
      if (!mobileValidate) {
        return window.alert('您输入的手机号码有误！');
      }
    }


    if (addr.addrId) {
      this.update(addr);
    } else {
      this.add(addr);
    }

  }
});