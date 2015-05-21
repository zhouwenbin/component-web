'use strict';

/**
 * [description]
 * @param  {[type]} can
 * @return {[type]}
 */
define('sf.b2c.mall.component.search', [
  'text',
  'jquery',
  'jquery.cookie',
  'can',
  'underscore',
  'md5',
  'store',
  'sf.b2c.mall.framework.comm',
  'sf.b2c.mall.business.config',
  'sf.util',
  'sf.b2c.mall.widget.message',
  'sf.b2c.mall.api.search.searchItem',
  'text!template_component_search'
], function(text, $, cookie, can, _, md5, store, SFComm, SFConfig, SFFn, SFMessage,
            SFSearchItem,
            template_component_search) {

  return can.Control.extend({
    helpers: {
      isBybrand: function(name, options) {
        if (name == 'byBrand') {
          return options.fn(options.contexts || this);
        } else {
          return options.inverse(options.contexts || this);
        }
      }
    },

    renderData: new can.Map({
      searchData: {
        q: ""
      },
      itemSearch: {}
    }),

    /**
     * @description 初始化方法，当调用new时会执行init方法
     * @param  {Dom} element 当前dom元素
     * @param  {Map} options 传递的参数
     */
    init: function(element, options) {
      var that = this;
      var params = can.deparam(window.location.search.substr(1));

      //获取存储搜索关键字
      var keyword = params.keyword;
      this.renderData.attr("searchData.q", keyword);

      //获取处理过滤条件
      var filterStr = params.filter;
      this.filterDataHandler(filterStr);


      this.render(this.renderData);
    },

    /**
     * @description 处理过滤条件
     * @param filterStr 过滤字符串
     */
    filterDataHandler: function(filterStr) {
      if (!filterStr) {
        return;
      }
      var filterArr = filterStr.split("@");
      _.each(filterArr, function(element, index, list) {
        var key = filterArr.split("_")[0];
        var value = filterArr.split("_")[1];
        renderData.searchData[key] = value.split("||");
      })
    },

    /**
     * @description 渲染页面
     * @param  {Dom} element 当前dom元素
     * @param  {Map} options 传递的参数
     */
    render: function(data) {
      var that = this;
      can.when(this.initSearchItem(this.searchData))
        .done(function() {

          //渲染页面
          var renderFn = can.mustache(template_component_search);
          var html = renderFn(data, this.helpers);
          that.element.html(html);
        });


    },
    /**
     * @description 从服务器端获取数据
     * @param searchData
     */
    initSearchItem: function(searchData) {
      var that = this;
      var searchItem = new SFSearchItem({itemSearchRequest: JSON.stringify(this.renderData.searchData._data)});
      return searchItem.sendRequest()
        .done(function(itemSearchData) {
          that.renderData.attr("itemSearch", itemSearchData);
        });
    }

  });

});
