'use strict';

define('sf.b2c.mall.widget.showArea', [
  'can',
  'sf.b2c.mall.adapter.regions'

], function(can, RegionsAdapter) {

  return can.Control.extend({

    init: function() {
      this.adapter = {};
      this.request();

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
      this.setup(element);
      //var html = can.view('templates/component/sf.b2c.mall.component.addreditor.mustache', data);
      var html = can.view.mustache(this.checkAreaTemplate());
      element.html(html(data));

      this.supplement(tag);
    },


    checkAreaTemplate:function(){
      return '<label for="area">送至</label>' +
          '<select id="s2"  can-value="addr.input.provinceName">'+
          '{{#each addr.place.provinces}}'+
          '<option value="{{id}}">{{name}}</option>'+
          '{{/each}}'+
          '</select>'+

          '<select id="s3"  can-value="addr.input.cityName">'+
          '{{#each addr.place.cities}}'+
          '<option value="{{id}}">{{name}}</option>'+
          '{{/each}}'+
          '</select>'+

          '<select id="s4"  can-value="addr.input.regionName">'+
          '{{#each addr.place.regions}}'+
          '<option value="{{id}}">{{name}}</option>'+
          '{{/each}}'+
          '</select>'+
          '<span id="areaErrorTips" class="label label-error">{{addr.errorTips}}</span>'
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
        'create': function() {
          return {
            input: {
              provinceName: this.adapter.regions.findGroup(0)[8].id,
              cityName: null,
              regionName: null
            },
            place: {
              provinces: this.adapter.regions.findGroup(0),
              cities: null,
              regions: null
            },
            errorTips:null
          };
        }
      };
      var info = map[tag].call(this);
      this.adapter.addr = new can.Map(info);
      this.render(this.adapter, tag, element);
      $('#areaErrorTips').hide();
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
    }

    /**
     * @description 取消保存
     * @param  {Dom}    element
     * @param  {Event}  event
     */


  });
})