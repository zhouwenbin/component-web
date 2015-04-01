'use strict';

define('sf.b2c.mall.component.addreditor', [
  'can',
  'store',
  'jquery.cookie',
  'sf.b2c.mall.adapter.regions',
  'sf.b2c.mall.api.user.createRecAddress',
  'sf.b2c.mall.api.user.createReceiverInfo',
  'sf.b2c.mall.api.user.updateRecAddress',
  'sf.b2c.mall.api.user.updateReceiverInfo',
  'placeholders',
  'sf.b2c.mall.widget.message',
  'sf.b2c.mall.adapter.address.list'

], function(can,store,$cookie,RegionsAdapter, SFCreateRecAddress,SFCreateReceiverInfo,SFUpdateRecAddress, SFUpdateReceiverInfo,placeholders, SFMessage,AddressAdapter) {
  return can.Control.extend({

    init: function() {
      this.adapter = {};
      this.request();
      this.onSuccess = this.options.onSuccess;
      this.from = this.options.from;
    },

    request: function() {
      var that = this;
      return can.ajax('json/sf.b2c.mall.regions.json')
        .done(_.bind(function(cities) {
          this.adapter.regions = new RegionsAdapter({
            cityList: cities
          });
        }, this))
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
              provinceName: '0',
              cityName: null,
              regionName: null,
              detail: null,
              recId: null,
              cellphone: null,
              zipCode: null,
              receiverName:null,
              receiverId:null
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
              consignee:null,
              detail: null,
              zipCode: null,
              cellphone: null,
              receiver:null,
              receiverCertId:null
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
              recId: data.recId,
              receiverName:data.recName,
              receiverId:data.credtNum2
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
              cellphone: null,
              receiver:null,
              receiverCertId:null
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
      if (pid == 0) {
        this.adapter.addr.input.attr('cityName', '0');
        this.adapter.addr.place.attr('cities', '0');
      }else{
        $('#consigneeError').hide();
        var cities = this.adapter.regions.findGroup(window.parseInt(pid));
        this.adapter.addr.place.attr('cities', cities);
        this.adapter.addr.input.attr('cityName', cities[0].id);
      }

    },

    changeRegion: function() {
      var cid = this.adapter.addr.input.attr('cityName');
      if (cid == 0) {
        this.adapter.addr.input.attr('regionName', '0');
        this.adapter.addr.place.attr('regions', '0');
      }else{
        var regions = this.adapter.regions.findGroup(window.parseInt(cid));
        this.adapter.addr.place.attr('regions', regions);
        this.adapter.addr.input.attr('regionName', regions[0].id);
      }

    },

    '#s2 change': function(element, event) {
      var cid = this.adapter.addr.input.attr('cityName');
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

      var person = {
        recName: addr.receiverName,
        type: "ID",
        credtNum: addr.receiverId
      };

      //@TODO 从cookie中获取嘿客穿越过来标示1_uinfo
      var heike_sign = $.cookie('1_uinfo');
      var arr = [];
      if (heike_sign) {
        arr = heike_sign.split(',');
      }
      //var cinfo = can.deparam(window.location.search.substr(1));
      if (arr[2] == 'heike') {
        addr.partnerId = 'heike';
        person.partnerId = 'heike';
      }

      var recId = null;
      var createReceiverInfo = new SFCreateReceiverInfo(person);
      createReceiverInfo
        .sendRequest()
        .done(function(data) {
          recId = data.value;
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
        })
        .then(function(){
          addr.recId = recId;
          var createRecAddress = new SFCreateRecAddress(addr);
          return createRecAddress.sendRequest()
        })
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

    update: function(addr,element) {
      var that = this;
      var person = {
        recId:addr.recId,
        recName: addr.receiverName,
        type: "ID",
        credtNum: addr.receiverId
      };
      var updateReceiverInfo = new SFUpdateReceiverInfo(person);
      var updateRecAddress = new SFUpdateRecAddress(addr);
      can.when(updateReceiverInfo.sendRequest(),updateRecAddress.sendRequest())
        .done(function(data,data1) {

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

      //保存时清掉所有错误提示
      $('#consigneeError').hide();
      $('#detailerror').hide();
      $('#cellphoneerror').hide();
      $('#zipcodeerror').hide();
      $('#receiverNameError').hide();
      $('#receiverCertIdError').hide();

      //验证是否选择省市区
      if(typeof addr.provinceName == 'undefined' || typeof addr.cityName == 'undefined' || typeof addr.regionName == 'undefined'){
        this.adapter.addr.attr("error", {
          "consignee": '请选择收货地区'
        })
        $('#consigneeError').show();
        return false;
      }

      //验证详细地址是否填写
      if (!addr.detail) {
        this.adapter.addr.attr("error", {
          "detail": '请填写详细地址信息！'
        })
        $('#detailerror').show();
        return false;
      }

      // 详细收货地址5~120字符之间(中文，数字，英文字符和# - ，。)
      var isDetail = /^[\u4e00-\u9fa5\d\w#。，-]+$/.test($.trim(addr.detail));
      if (addr.detail.length > 60 || addr.detail.length < 5 || !isDetail) {
        this.adapter.addr.attr("error", {
          "detail": '请输入正确地址信息!'
        })
        $('#detailerror').show();
        return false;
      }

      //检测收货人姓名是否填写
      if(!addr.receiverName){
        this.adapter.addr.attr("error", {
          "receiver": '请输入收货人姓名!'
        })
        $('#receiverNameError').show();
        return false;
      }
      //@noto 收货人姓名必须是中文和英文，且不能存在先生，小姐，女士等字符
      var testRecName = /^[\u4e00-\u9fa5]{0,10}$/.test($.trim(addr.receiverName));
      var isReceiverName =  /先生|女士|小姐/.test($.trim(addr.receiverName));
      if (testRecName && !isReceiverName) {} else {
        this.adapter.addr.attr("error", {
          "receiver": '由于海关发货需要实名制的信息，请您输入真实姓名。感谢您的配合!'
        })
        $('#receiverNameError').show();
        return false;
      }

      //检测收货人手机号码是否填写
      if (!addr.cellphone) {
        this.adapter.addr.attr("error", {
          "cellphone": '请填写收货人手机号码！'
        })
        $('#cellphoneerror').show();
        return false;
      }

      //电话号码正则验证（以1开始，11位验证）
      if (!/^1\d{10}$/.test(addr.cellphone)) {
        this.adapter.addr.attr("error", {
          "cellphone": '收货人手机号码填写有误！'
        })
        $('#cellphoneerror').show();
        return false;
      }
      //身份证号码是否填写，长度是否是18
      if (!addr.receiverId) {
        this.adapter.addr.attr("error", {
          "receiverCertId": '请填写收货人身份证号码！'
        })
        $('#receiverCertIdError').show();
        return false;
      }
      if (addr.receiverId.length < 18 || addr.receiverId.length > 18) {
        this.adapter.addr.attr("error", {
          "receiverCertId": '收货人身份证号码填写有误！'
        })
        $('#receiverCertIdError').show();
        return false;
      }

      var info = {};
      var cardNo = addr.receiverId;
      if (cardNo.length == 18) {
        var year = cardNo.substring(6, 10);
        var month = cardNo.substring(10, 12);
        var day = cardNo.substring(12, 14);
        var p = cardNo.substring(14, 17)
        var birthday = new Date(year, parseFloat(month) - 1,
          parseFloat(day));
        // 这里用getFullYear()获取年份，避免千年虫问题
        if (birthday.getFullYear() != parseFloat(year) || birthday.getMonth() != parseFloat(month) - 1 || birthday.getDate() != parseFloat(day)) {
          info.isTrue = false;
        }
        var Wi = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2, 1]; // 加权因子
        var Y = [1, 0, 10, 9, 8, 7, 6, 5, 4, 3, 2]; // 身份证验证位值.10代表X
        // 验证校验位
        var sum = 0; // 声明加权求和变量
        var _cardNo = cardNo.split("");
        if (_cardNo[17].toLowerCase() == 'x') {
          _cardNo[17] = 10; // 将最后位为x的验证码替换为10方便后续操作
        }
        for (var i = 0; i < 17; i++) {
          sum += Wi[i] * _cardNo[i]; // 加权求和
        }
        var i = sum % 11; // 得到验证码所位置
        if (_cardNo[17] != Y[i]) {
          info.isTrue = false;
        } else {
          info.isTrue = true;
        }
        info.year = birthday.getFullYear();
        info.month = birthday.getMonth() + 1;
        info.day = birthday.getDate();
        if (p % 2 == 0) {
          info.isFemale = true;
          info.isMale = false;
        } else {
          info.isFemale = false;
          info.isMale = true
        }

      }
      if (!info.isTrue) {
        this.adapter.addr.attr("error", {
          "receiverCertId": '收货人身份证号码填写有误！'
        })
        $('#receiverCertIdError').show();
        return false;
      }

      //验证邮编
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
        this.update(addr,element);
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