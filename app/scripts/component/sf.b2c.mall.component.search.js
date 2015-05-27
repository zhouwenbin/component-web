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
  'sf.helpers',
  'sf.b2c.mall.framework.comm',
  'sf.b2c.mall.business.config',
  'sf.util',
  'sf.b2c.mall.widget.message',
  'sf.b2c.mall.api.search.searchItem',
  'sf.b2c.mall.api.b2cmall.getProductHotDataList',
  'sf.b2c.mall.component.recommendProducts',
  'text!template_component_search'
], function(text, $, cookie, can, _, md5, store, SFComm, SFConfig, SFFn, SFMessage, helpers,
            SFSearchItem, SFGetProductHotDataList,
            SFRecommendProducts,
            template_component_search) {

  return can.Control.extend({
    helpers: {
      'sf-isShowMoreBrand': function(brands, options) {
        if (brands().length > 8) {
          return options.fn(options.contexts || this);
        } else {
          return options.inverse(options.contexts || this);
        }
      },
      'sf-discount': function(sellingPrice, referencePrice, options) {
        if (sellingPrice() < referencePrice()) {
          return (parseInt(sellingPrice(), 10) * 10 / parseInt(referencePrice(), 10)).toFixed(1) + "折";
        }
      },
      'sf-hasSelect': function(filters, options) {
        if (filters().length <= 0) {
          return options.inverse(options.contexts || this);
        } else {
          return options.fn(options.contexts || this);
        }
      },
      'sf-hasSelectEmpty': function(filters, options) {
        if (filters().length > 1) {
          return options.fn(options.contexts || this);
        } else {
          return options.inverse(options.contexts || this);
        }
      },
      'sf-isSortByDEFAULT': function(sort, options) {
        if (sort() == "DEFAULT" || !sort()) {
          return options.fn(options.contexts || this);
        } else {
          return options.inverse(options.contexts || this);
        }
      },
      'sf-isSortBySALE': function(sort, options) {
        if (sort() == "SALE_DESC" || sort() == "SALE_ASC") {
          return options.fn(options.contexts || this);
        } else {
          return options.inverse(options.contexts || this);
        }
      },
      'sf-isSortByPRICE': function(sort, options) {
        if (sort() == "PRICE_DESC" || sort() == "PRICE_ASC") {
          return options.fn(options.contexts || this);
        } else {
          return options.inverse(options.contexts || this);
        }
      },
      'sf-isSortByPRICEDESC': function(sort, options) {
        if (sort() == "PRICE_DESC") {
          return options.fn(options.contexts || this);
        } else {
          return options.inverse(options.contexts || this);
        }
      },
      'sf-isSoldOut': function(soldOut, options) {
        if (soldOut() == true) {
          return options.fn(options.contexts || this);
        } else {
          return options.inverse(options.contexts || this);
        }
      },
      'sf-isHasResults': function(totalHits, results, options) {
        if (results() && results().length > 0 && totalHits() > 0) {
          return options.fn(options.contexts || this);
        } else {
          return options.inverse(options.contexts || this);
        }
      }
    },

    //用于调用搜索接口的对象
    searchParams: {
      q: "",
      size: 20,
      from: 0
    },

    //用于模板渲染
    renderData: new can.Map({
      //url中的参数
      searchData: {
        keyword: "",
        page: null
      },
      nextPage: null,
      prevPage: 0,
      //接口吐出的原始数据
      itemSearch: {},
      //聚合数据，主要用于前端数据展示
      brands: {},
      categories: {},
      origins: {},
      //已选中的聚合数据
      filterBrands: [],
      filterCategories: [],
      filterOrigins: [],
      filters: []
    }),

    sortMap: {
      "DEFAULT": "DEFAULT",
      "SCORE": "SCORE",
      "PRICE_DESC": "PRICE_DESC",
      "PRICE_ASC": "PRICE_ASC",
      "SALE_DESC": "SALE_DESC",
      "SALE_ASC": "SALE_ASC"
    },

    /**
     * @description 初始化方法，当调用new时会执行init方法
     * @param  {Dom} element 当前dom元素
     * @param  {Map} options 传递的参数
     */
    init: function(element, options) {

      var that = this;

      this.addRenderDataBind();
      var params = can.deparam(window.location.search.substr(1));

      //获取存储页数
      var page = params.page;
      if (!/^\+?[1-9]\d*$/.test(page)) {
        page = 1;
      }
      this.renderData.attr("searchData.page", page);

      //获取存储搜索关键字
      var keyword = params.keyword;
      this.renderData.attr("searchData.keyword", keyword || "");

      //获取处理过滤条件
      var brandIds = params.brandIds;
      if (brandIds) {
        this.renderData.attr("searchData.brandIds", brandIds.split("||"));
      }
      var categoryIds = params.categoryIds;
      if (categoryIds) {
        this.renderData.attr("searchData.categoryIds", categoryIds.split("||"));
      }
      var originIds = params.originIds;
      if (originIds) {
        this.renderData.attr("searchData.originIds", originIds.split("||"));
      }

      //获取处理排序条件
      var sort = params.sort;
      if (sort) {
        this.renderData.attr("searchData.sort", this.sortMap[sort] || this.sortMap["DEFAULT"]);
      }

      this.render(this.renderData);
    },

    /**
     * @description 给renderData添加bind
     */
    addRenderDataBind: function() {
      var that = this;
      this.renderData.bind("searchData.keyword", function(ev, newVal, oldVal){
        that.searchParams.q = newVal;
      });
      this.renderData.bind("searchData.page", function(ev, newVal, oldVal){
        that.searchParams.from = (newVal - 1) * that.searchParams.size;
        that.renderData.attr("nextPage", 1 + +newVal);
        that.renderData.attr("prevPage", newVal - 1);
      });
      this.renderData.bind("searchData.sort", function(ev, newVal, oldVal){
        that.searchParams.sort = newVal;
      });
      this.renderData.bind("searchData.brandIds", function(ev, newVal, oldVal){
        if(newVal) {
          that.searchParams.brandIds = newVal.serialize();
        } else {
          delete that.searchParams.brandIds;
        }
      });
      this.renderData.bind("searchData.categoryIds", function(ev, newVal, oldVal){
        if(newVal) {
          that.searchParams.categoryIds = newVal.serialize();
        } else {
          delete that.searchParams.categoryIds;
        }
      });
      this.renderData.bind("searchData.originIds", function(ev, newVal, oldVal){
        if(newVal) {
          that.searchParams.originIds = newVal.serialize();
        } else {
          delete that.searchParams.originIds;
        }
      });
      this.renderData.bind("itemSearch", function(ev, newVal, oldVal){
        if (that.renderData.searchData.page * that.searchParams.size >= that.renderData.itemSearch.totalHits) {
          that.renderData.attr("nextPage", 0)
        }
      });
    },


    /**
     * @description 渲染页面
     * @param  {Dom} element 当前dom元素
     * @param  {Map} options 传递的参数
     */
    render: function(data) {
      var that = this;

      can.when(this.initSearchItem(this.searchData))
        .always(function(){
          $(".loading").hide();
          //渲染页面
          that.renderHtml(data);
        })
        .fail(function() {
          that.searchFail();
        })
        .then(function() {
          if (that.renderData.itemSearch.results.length != 0 && that.renderData.itemSearch.totalHits) {
            //获取价格
            var itemIds = _.pluck(that.renderData.itemSearch.results, 'itemId');
            return that.initGetProductHotDataList(itemIds);
          } else {
            that.searchFail();
          }
        });
    },

    searchFail: function() {
      new SFRecommendProducts('.recommend')
    },
    /**
     * @description 渲染html
     * @param data
     */
    renderHtml: function(data) {
      //渲染页面
      var renderFn = can.mustache(template_component_search);
      var html = renderFn(data || this.renderData, this.helpers);
      this.element.html(html);
    },
    /**
     * @description 从服务器端获取数据
     * @param searchData
     */
    initSearchItem: function(searchData) {
      var that = this;
      var searchItem = new SFSearchItem({itemSearchRequest: JSON.stringify(this.searchParams)});
      return searchItem.sendRequest()
        .done(function(itemSearchData) {
          that.renderData.attr("itemSearch", itemSearchData);

          //将得到的聚合数据存储起来，用于展示赛选条件
          _.each(itemSearchData.aggregations, function(value, key, list){
            var fn = that.aggregationsMap[value.name];
            if (_.isFunction(fn)){
              fn.call(that, value)
            }
          })
        });
    },

    aggregationsMap: {
      byBrand: function(value) {
        var that = this;
        this.renderData.attr("brands", value);

        var brandIds = this.searchParams.brandIds;
        if(brandIds) {
          _.each(brandIds, function(bvalue, bkey, blist) {
            _.each(value.buckets, function(ivalue, ikey, ilist) {
              if (ivalue.id ==   bvalue) {
                that.renderData.filterBrands.push(ivalue);
                that.renderData.filters.push(ivalue);
              }
            })
          })
        }
      },
      byCategory: function(value) {
        var that = this;
        this.renderData.attr("categories", value);

        var categoryIds = this.searchParams.categoryIds;
        if(categoryIds) {
          _.each(categoryIds, function(bvalue, bkey, blist) {
            _.each(value.buckets, function(ivalue, ikey, ilist) {
              if (ivalue.id == bvalue) {
                that.renderData.filterCategories.push(ivalue);
                that.renderData.filters.push(ivalue);
              }
            })
          })
        }
      },
      byGoodsOrigin: function(value) {
        var that = this;
        this.renderData.attr("origins", value);

        var originIds = this.searchParams.originIds;
        if(originIds) {
          _.each(originIds, function(bvalue, bkey, blist) {
            _.each(value.buckets, function(ivalue, ikey, ilist) {
              if (ivalue.id == bvalue) {
                that.renderData.filterOrigins.push(ivalue);
                that.renderData.filters.push(ivalue);
              }
            })
          })
        }
      }
    },

    initGetProductHotDataList: function(itemIds) {
      var that = this;
      var getProductHotDataList = new SFGetProductHotDataList({
        itemIds: JSON.stringify(itemIds)
      });
      return getProductHotDataList.sendRequest()
        .done(function(hotDataList) {

          //合并价格 并入库存
          _.each(hotDataList.value, function(value, key, list) {
            _.each(that.renderData.itemSearch.results, function(ivalue, ikey, ilist) {
              if (ivalue.itemId == value.itemId) {
                ivalue.attr("sellingPrice", value.sellingPrice);
                ivalue.attr("referencePrice", value.referencePrice);
                ivalue.attr("actualPrice", value.originPrice);
                ivalue.attr("soldOut", value.soldOut);
              }
            });
          })
        });
    },

    getSearchParamStr: function(data) {
      if(!data) {
        data = this.renderData.searchData._data;
      }
      var paramStr = "";
      _.each(data, function(value, key, list) {
        if (value.serialize) {
          paramStr += key + "=" + value.serialize().join("||") + "&";
        } else {
          paramStr += key + "=" + value + "&";
        }
      });
      return paramStr.substr(0, paramStr.length - 1);
    },

    gotoNewPage: function(data) {
      window.location.href = "search.html?" + this.getSearchParamStr(data);
    },

    /**
     * 筛选条件更多按钮展开事件
     */
    "#classify-more click": function(targetElement) {
      targetElement.parents('li').toggleClass('active');
    },
    "[data-role=selectBrand] li click": function(targetElement) {
      this.renderData.searchData.attr("page", 1);
      this.renderData.searchData.attr("brandIds", [targetElement.data("id")]);
      this.gotoNewPage();
    },
    "[data-role=selectCategory] li click": function(targetElement) {
      this.renderData.searchData.attr("page", 1);
      this.renderData.searchData.attr("categoryIds", [targetElement.data("id")]);
      this.gotoNewPage();
    },
    "[data-role=selectOrigin] li click": function(targetElement) {
      this.renderData.searchData.attr("page", 1);
      this.renderData.searchData.attr("originIds", [targetElement.data("id")]);
      this.gotoNewPage();
    },
    '#emptyFilterBtn click': function(targetElement) {
      this.renderData.attr("searchData", {keyword: this.renderData.searchData.attr("keyword")});
      this.gotoNewPage();
    },
    '#classify-select li .btn-search-close click': function(targetElement) {
      this.renderData.searchData.attr("page", 1);
      var id = targetElement.data("id");
      var role = targetElement.data("role");
      this.renderData.searchData.removeAttr(role);
      this.gotoNewPage();
    },
    "#pageUpBtn click": function(targetElement) {
      var prevPage = this.renderData.prevPage;
      this.renderData.searchData.attr("page", prevPage ? prevPage : 1);
      this.gotoNewPage();
    },
    "#pageDownBtn click": function(targetElement) {
      var nextPage = this.renderData.nextPage;
      this.renderData.searchData.attr("page", nextPage);
      this.gotoNewPage();
    },
    "#sortBox li click": function(targerElement) {
      var role = targerElement.data("role");
      this.renderData.searchData.attr("sort", this.sortMap[role]);
      this.gotoNewPage();
    }
  });

});
