'use strict';

/**
 * [description]
 * @param  {[type]} can
 * @return {[type]}
 */
define('sf.b2c.mall.component.header.searchbox', [
  'text',
  'jquery',
  'jquery.cookie',
  'can',
  'underscore',
  'store',
  'sf.util',
  'sf.b2c.mall.framework.comm',
  'sf.b2c.mall.business.config',
  'sf.b2c.mall.api.search.getSearchHeaderConfig',
  'sf.b2c.mall.api.search.suggestKeywords'
], function(text, $, cookie, can, _, store, SFFn, SFComm, SFConfig, SFGetSearchHeaderConfig, SFSuggestKeywords) {

  var STORE_HISTORY_LIST = "searchhistories";
  var HISTORY_SIZE = 10;

  return can.Control.extend({

    renderData: new can.Map({
      "searchHeaderConfig": null,
      "historyList": {
        data: null,
        show: true
      },
      "associateList": {
        data: null,
        show: true
      }
    }),

    initHistoriesFlag: true,
    initAssociateFlag: true,

    templateMap: {
      "suggestKeywords": function() {
        return '{{#each searchLinkList}}'
                + '<li class="active"><a href="{{link}}">{{content}}</a></li>'
                + '{{/each}}'
                + '{{#each hotKeywordList}}'
                + '<li><a href="http://www.sfht.com/search.html?keyword={{.}}" data-keyword="{{.}}" role="header-search-link">{{.}}</a></li>'
                + '{{/each}}';
      },
      'historyList': function() {
        return '{{#each historyList.data}}'
                + '<li>' 
                + '<a class="clearfix" role="header-search-link" data-keyword="{{.}}" href="http://www.sfht.com/search.html?keyword={{.}}">'
                + '<div class="fl">{{.}}</div>'
                + '</a>'
                + '</li>'
                + '{{/each}}';
      },
      'associateList': function() {
        return '<li>' 
                + '<a class="clearfix" role="header-search-link" data-keyword="{{associateList.data.suggestKeywords}}" href="http://www.sfht.com/search.html?keyword={{associateList.data.suggestKeywords}}">'
                + '<div class="fl">{{associateList.data.suggestKeywords}}</div>'
                + '<div class="fr">共{{associateList.data.totalCount}}个结果</div>'
                + '</a>'
                + '</li>'
                + '{{#each associateList.data.aggregation.buckets}}'
                + '<li class="header-search-dropdown-category">'
                + '<a class="clearfix" role="header-search-link" data-keyword="{{associateList.data.suggestKeywords}}" data-category-ids={{id}} href="http://www.sfht.com/search.html?keyword={{associateList.data.suggestKeywords}}&categoryIds={{id}}">'
                + '<div class="fl">在<span>{{key}}</span>下搜索</div>'
                + '<div class="fr">共{{count}}个结果</div>'
                + '</a>'
                + '</li>'
                + '{{/each}}'
                + '{{#each associateList.data.relevanceList}}'
                + '<li>' 
                + '<a class="clearfix" role="header-search-link" data-keyword="{{keyword}}" href="http://www.sfht.com/search.html?keyword={{keyword}}">'
                + '<div class="fl">{{keyword}}</div>'
                + '<div class="fr">共{{count}}个结果</div>'
                + '</a>'
                + '</li>'
                + '{{/each}}';
      }
    },

    helpers: {
    },

    /**
     * @description 初始化方法，当调用new时会执行init方法
     * @param  {Dom} element 当前dom元素
     * @param  {Map} options 传递的参数
     */
    init: function(element, options) {
      var that = this;

      can.when(this.initGetSearchHeaderConfig())
        .done(function(searchHeaderConfig) {
          if (searchHeaderConfig.defaultSearchText) {
            element.find("#default-search-text").text(searchHeaderConfig.defaultSearchText);
          }


          var renderFn = can.mustache(that.templateMap["suggestKeywords"]());
          var html = renderFn(searchHeaderConfig, that.helpers);
          that.element.find(".header-search-suggestKeywords").html(html);
        })
    },

    /**
     * @description 对页面进行渲染
     * @param  {Map} data 渲染页面的数据
     */
    render: function(data) {
    },

    initGetSearchHeaderConfig: function() {
    	var that = this;

      var getSearchHeaderConfig = new SFGetSearchHeaderConfig({});
      return getSearchHeaderConfig.sendRequest()
      .done(function(searchHeaderConfig) {
        that.renderData.attr("searchHeaderConfig", searchHeaderConfig);
        });
    },

    lazyInitSuggestKeywords: null,
    initSuggestKeywords: function(keyword) {
    	var that = this;

      var params = {
        "keywords": keyword
      }

      var suggestKeywords = new SFSuggestKeywords(params);
      can.when(suggestKeywords.sendRequest())
        .done(function(suggestKeywords) {
            that.renderData.attr("associateList.data", suggestKeywords);
          });
    },


    /**
     * @author zhang.ke
     * @description 获取store中history数据
     */
    initHistories: function() {
      var that = this;

      var histories = store.get(STORE_HISTORY_LIST);
      if (!histories) {
        return;
      }
      that.renderData.attr("historyList.data", store.get(STORE_HISTORY_LIST));

      var renderFn = can.mustache(that.templateMap["historyList"]());
      var html = renderFn(that.renderData, that.helpers);
      that.element.find("#header-search-history > ul").html(html);

      this.initHistoriesFlag = false;
    },

    trim: function(str) {
      return str.replace(/(^\s*)|(\s*$)/g, "");
    },

    /**
     * @author zhang.ke
     * @description 将关键字添加到store中的搜索历史
     */
    saveHistories: function(keyword) {
      var histories;
      if (!this.renderData.historyList.data) {
        histories = [];
      } else {
        histories = this.renderData.historyList.data.serialize();
      }
      if (_.indexOf(histories, keyword) !== -1) {
        return;
      }
      histories.splice(0, 0, keyword);
      if (histories.length > HISTORY_SIZE) {
        histories = histories.slice(0, HISTORY_SIZE);
      }
      store.set(STORE_HISTORY_LIST, histories);
    },

    showHistoriesPanel: function() {
      this.element.find("#header-search-history").show();
      this.hideAssociatePanel();
    },

    hideHistoriesPanel: function() {
      this.element.find("#header-search-history").hide();
    },

    showAssociatePanel: function() {
      this.element.find("#header-search-associate").show();
      this.hideHistoriesPanel();
    },

    hideAssociatePanel: function() {
      this.element.find("#header-search-associate").hide();
    },

    showPanel: function() {
      var keyword = $("#header-search-input").val();
      if (keyword) {
        this.showAssociatePanel();
      } else {
        this.showHistoriesPanel();
      }
    },

    hidePanel: function() {
      this.hideAssociatePanel();
      this.hideHistoriesPanel();
    },

    initAssociatePanel: function() {
      var renderFn = can.mustache(this.templateMap["associateList"]());
      var html = renderFn(this.renderData, this.helpers);
      this.element.find("#header-search-associate > ul").html(html);

      this.initAssociateFlag = false;
    },

    /**
     * @author zhang.ke
     * @description 清空搜索历史
     */
    ".clear-history-btn click": function() {
      store.remove(STORE_HISTORY_LIST);
      this.renderData.attr("historyList.data", null);
      this.hideHistoriesPanel();
      this.initHistoriesFlag = true;
    },

    "#header-search-input focus": function() {
      $(".header-search-placeholder").hide();

      if (this.initHistoriesFlag) {
        this.initHistories();
      }

      if (!this.initHistoriesFlag) {
        this.showHistoriesPanel();
      }
    },
    "#header-search-input blur": function(element, event) {
      var keyword = $(element).val();
      keyword = this.trim(keyword);
      if (!keyword) {
        $(".header-search-placeholder").show();
      }
    },

    "#header-search-input keydown": function(element, event) {
      var keyword = $(element).val();
      keyword = this.trim(keyword)

      if (event.keyCode == 13) {
        this.search(keyword);
        return false;
      }

      if (event.keyCode == 38 || event.keyCode == 40) {
        var links = $(".header-search-dropdown:visible li");
        var count = links.length;
        var index = links.index(links.filter(".active"));
        $(links[index]).removeClass("active");

        if (event.keyCode == 38) {
          if (index == -1 || index == 0) {
            index = count - 1;
          } else {
            index--;
          }
        } else {
          index++;
          if (index == count) {
            index = 0;
          }
        }
        
        $(links[index]).addClass("active");
        var keyword = $(links[index]).find("[data-keyword]").data("keyword");
        var categoryIds = $(links[index]).find("[data-category-ids]").data("categoryIds");

        $("#header-search-input").val(keyword).attr("data-category-ids", categoryIds);
      }

      /*
      if (event.keyCode == 38) {
        var links = $(".header-search-dropdown:visible li");
        $(links[0]).addClass("active");
        var keyword = $(links[0]).find("[data-keyword]").data("keyword");
        $("#header-search-input").val(keyword);
      }

      if (event.keyCode == 40) {
        var links = $(".header-search-dropdown:visible li");
        $(links[0]).addClass("active");
        var keyword = $(links[0]).find("[data-keyword]").data("keyword");
        $("#header-search-input").val(keyword);
      }
      */
    },

    "#header-search-input keyup": function(element, event) {
      if (event.keyCode == 38 || event.keyCode == 40) {
        return;
      }

      $("#header-search-input").attr("data-category-ids", "");

      var keyword = $(element).val();
      keyword = this.trim(keyword)
      if (!keyword) {
        this.showHistoriesPanel();
        this.hideAssociatePanel();
        return
      }

      if (!this.lazyInitSuggestKeywords) {
        this.lazyInitSuggestKeywords = _.debounce(this.initSuggestKeywords, 200);
      }
      this.lazyInitSuggestKeywords(keyword);

      if (this.initAssociateFlag) {
        this.initAssociatePanel();
      }
      if (!this.initAssociateFlag) {
        this.showAssociatePanel();
      }

    },


    "#header-search-btn click": function() {
      var keyword = $("#header-search-input").val();
      if (!keyword) {
        return false;
      }
      this.search(keyword);
    },

    "[role=header-search-link] click": function(element, event) {
      var keyword = $(element).data("keyword");

      if (this.initHistoriesFlag) {
        this.initHistories();
      }

      this.saveHistories(keyword);
    },

    ".header-search-dropdown,.header-search-input mouseout": function() {
      var hsddv = $(".header-search-dropdown:visible");
      var startX = $(".header-search").offset().left;
      var startY = $(".header-search").offset().top;
      var endX = hsddv.offset().left + hsddv.width();
      var endY = hsddv.offset().top + hsddv.height();
      var mouseX = event.pageX;
      var mouseY = event.pageY;

      if (mouseX > endX
       || mouseX < startX 
       || mouseY > endY
       || mouseY < startY) {
        this.hideAssociatePanel();
        this.hideHistoriesPanel();
      }
    },

    /**
     * @author zhang.ke
     * @description 搜素
     */
    search: function(keyword) {
      keyword = this.trim(keyword)

      if (!keyword) {
        return false;
      }
      this.saveHistories(keyword);

      var categoryIds = $("#header-search-input").data("categoryIds");

      this.gotoSearchPage(keyword, categoryIds);
    },

    /**
     * @author zhang.ke
     * @description 跳转到搜索结果页
     */
    gotoSearchPage: function(keyword, categoryIds) {
      var params = can.deparam(window.location.search.substr(1));
      var href = ["http://www.sfht.com/search.html?keyword=", keyword]

      if (categoryIds) {
        href.push("&categoryIds=");
        href.push(categoryIds);
      }

      window.location.href = href.join("");
    }

  });
});