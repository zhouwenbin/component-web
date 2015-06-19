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
  'sf.b2c.mall.api.shopcart.addItemsToCart',
  'sf.b2c.mall.api.shopcart.isShowCart',
  'sf.b2c.mall.component.recommendProducts',
  'text!template_component_search'
], function(text, $, cookie, can, _, md5, store, helpers, SFFrameworkComm, SFConfig, SFFn, SFMessage,
  SFSearchItem, SFGetProductHotDataList, SFAddItemToCart, SFIsShowCart,
  SFRecommendProducts,
  template_component_search) {

  return can.Control.extend({
    helpers: {
      'sf-isShowMoreBrand': function(brands, options) {
        if (brands().length > 10) {
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
        if (!sort() || sort().value == "DEFAULT") {
          return options.fn(options.contexts || this);
        } else {
          return options.inverse(options.contexts || this);
        }
      },
      'sf-isSortBySALE': function(sort, options) {
        if (sort() && (sort().value == "SALE_DESC" || sort().value == "SALE_ASC")) {
          return options.fn(options.contexts || this);
        } else {
          return options.inverse(options.contexts || this);
        }
      },
      'sf-isSortByPRICE': function(sort, options) {
        if (sort() && (sort().value == "PRICE_DESC" || sort().value == "PRICE_ASC")) {
          return options.fn(options.contexts || this);
        } else {
          return options.inverse(options.contexts || this);
        }
      },
      'sf-isSortByPRICEDESC': function(sort, options) {
        if (sort() && (sort().value == "PRICE_DESC")) {
          return options.fn(options.contexts || this);
        } else {
          return options.inverse(options.contexts || this);
        }
      },
      'sf-isSortByPRICEASC': function(sort, options) {
        if (sort() && (sort().value == "PRICE_ASC")) {
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
      'sf-isShowAddToCart': function(soldOut, supportShoppingCart, options) {
        if (!soldOut() && (supportShoppingCart() === undefined || supportShoppingCart())) {
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
      },
      'sf-isYZYW': function(productForm, options) {
        if (productForm() == "YZYW") {
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

    //url中的参数
    searchData: {
    },

    //用于模板渲染
    renderData: new can.Map({
      //接口吐出的原始数据
      itemSearch: {},
      keyword: "",
      page: null,
      nextPage: null,
      prevPage: 0,
      sort : {
        value: "DEFAULT",
        name: "综合"
      },
      //是否展示购物车
      isShowShoppintCart: false,
      //聚合数据，主要用于前端数据展示
      brands: {},
      categories: {},
      secondCategories: {},
      origins: {},
      shopNations: {},
      //已选中的聚合数据
      filterBrands: [],
      filterCategories: [],
      filterSecondCategories: [],
      filterOrigins: [],
      filterShopNations: [],
      filters: [],
      //定制过滤条件
      filterCustom: {
        showCrumbs: false,
        showStatInfo: true,
        brandName: "品牌",
        categoryName: "分类",
        secondCategoryName: "",
        originName: "货源地",
        shopNationName: ""
      }
    }),

    //排序类型map
    sortMap: {
      "DEFAULT": {
        value: "DEFAULT",
        name: "综合"
      },
      "SCORE":  {
        value: "SCORE",
        name: ""
      },
      "PRICE_DESC":  {
        value: "PRICE_DESC",
        name: "价格由高到低"
      },
      "PRICE_ASC":  {
        value: "PRICE_ASC",
        name: "价格由低到高"
      },
      "SALE_DESC":  {
        value: "SALE_DESC",
        name: "人气"
      },
      "SALE_ASC":  {
        value: "SALE_ASC",
        name: "人气"
      }
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
      this.renderData.attr("page", page);

      //获取存储搜索关键字
      var keyword = params.keyword;
      this.renderData.attr("keyword", keyword || "");

      //获取处理过滤条件
      var brandIds = params.brandIds;
      if (brandIds) {
        this.renderData.attr("brandIds", brandIds.split("||"));
      }
      var categoryIds = params.categoryIds;
      if (categoryIds) {
        this.renderData.attr("categoryIds", categoryIds.split("||"));
      }
      var secondCategoryIds = params.catg2ndIds;
      if (secondCategoryIds) {
        this.renderData.attr("secondCategoryIds", secondCategoryIds.split("||"));
      }
      var originIds = params.originIds;
      if (originIds) {
        this.renderData.attr("originIds", originIds.split("||"));
      }
      var shopNationIds = params.snIds;
      if (shopNationIds) {
        this.renderData.attr("shopNationIds", shopNationIds.split("||"));
      }

      //获取处理排序条件
      var sort = params.sort;
      if (sort) {
        this.renderData.attr("sort", this.sortMap[sort] || this.sortMap["DEFAULT"]);
      }

      //获取产品形态
      var pfs = params.pfs;
      if (pfs) {
        this.renderData.attr("pfs", pfs.split("||"));
      }

      if (pfs == "YZYW") {
        this.renderData.attr("filterCustom", {
          showStatInfo: true,
          brandName: "人气品牌",
          categoryName: "商品分类",
          secondCategoryName: "选购热点",
          shopNationName: "名品货源"
        });
      }

      //过滤店铺
      var shopId = params.shopId;
      if (shopId) {
        this.renderData.attr("shopId", shopId.split("||"));
      }


      //覆盖定制过滤条件
      if (options.filterCustom) {
        this.renderData.attr("filterCustom", options.filterCustom);
      }

      this.render(this.renderData, element);
    },

    /**
     * @description 给renderData添加bind
     */
    addRenderDataBind: function() {
      var that = this;
      this.renderData.bind("keyword", function(ev, newVal, oldVal) {
        that.searchData.keyword = newVal;
        that.searchParams.q = newVal;
      });
      this.renderData.bind("page", function(ev, newVal, oldVal) {
        that.searchData.page = newVal;
        that.searchParams.from = (newVal - 1) * that.searchParams.size;
        that.renderData.attr("nextPage", 1 + +newVal);
        that.renderData.attr("prevPage", newVal - 1);
      });
      this.renderData.bind("sort", function(ev, newVal, oldVal) {
        that.searchParams.sort = newVal.value;
        that.searchData.sort = newVal.value;
      });
      this.renderData.bind("brandIds", function(ev, newVal, oldVal) {
        if (newVal) {
          that.searchParams.brandIds = newVal.serialize();
          that.searchData.brandIds = newVal.serialize();
        } else {
          delete that.searchParams.brandIds;
          delete that.searchData.brandIds;
        }
      });
      this.renderData.bind("categoryIds", function(ev, newVal, oldVal) {
        if (newVal) {
          that.searchParams.categoryIds = newVal.serialize();
          that.searchData.categoryIds = newVal.serialize();
        } else {
          delete that.searchParams.categoryIds;
          delete that.searchData.categoryIds;
        }
      });
      this.renderData.bind("secondCategoryIds", function(ev, newVal, oldVal) {
        if (newVal) {
          that.searchParams.secondCategoryIds = newVal.serialize();
          that.searchData.catg2ndIds = newVal.serialize();
        } else {
          delete that.searchParams.secondCategoryIds;
          delete that.searchData.catg2ndIds;
        }
      });
      this.renderData.bind("originIds", function(ev, newVal, oldVal) {
        if (newVal) {
          that.searchParams.originIds = newVal.serialize();
          that.searchData.originIds = newVal.serialize();
        } else {
          delete that.searchParams.originIds;
          delete that.searchData.originIds;
        }
      });
      this.renderData.bind("shopNationIds", function(ev, newVal, oldVal) {
        if (newVal) {
          that.searchParams.shopNationIds = newVal.serialize();
          that.searchData.snIds = newVal.serialize();
        } else {
          delete that.searchParams.shopNationIds;
          delete that.searchData.snIds;
        }
      });
      this.renderData.bind("itemSearch", function(ev, newVal, oldVal) {
        if (that.renderData.page * that.searchParams.size >= that.renderData.itemSearch.totalHits) {
          that.renderData.attr("nextPage", 0)
        }
      });
      this.renderData.bind("pfs", function(ev, newVal, oldVal){
        if(newVal) {
          that.searchParams.productForms = newVal.serialize();
          that.searchData.pfs = newVal.serialize();
        } else {
          delete that.searchParams.productForms;
          delete that.searchData.pfs;
        }
      });
      this.renderData.bind("shopId", function(ev, newVal, oldVal){
        if(newVal) {
          that.searchParams.shopIds = newVal.serialize();
          that.searchData.shopId = newVal.serialize();
        } else {
          delete that.searchParams.shopIds;
          delete that.searchData.shopId;
        }
      });
    },

    /**
     * @description 渲染页面
     * @param  {Dom} element 当前dom元素
     * @param  {Map} options 传递的参数
     */
    render: function(data, element) {
      var that = this;

      can.when(this.initSearchItem())
        .always(function() {
          $(".mask, .loading, .loadingBg").hide();
          //渲染页面
          that.renderHtml(data);
        })
        .fail(function() {
          that.searchFail();
        })
        .then(function() {
          if (that.renderData.itemSearch.results.length != 0 && that.renderData.itemSearch.totalHits) {

            that.checkCartIsShown.call(that, element);
            //获取实时价格和库存
            var itemIds = _.pluck(that.renderData.itemSearch.results, 'itemId');
            return that.initGetProductHotDataList(itemIds);
          } else {
            that.searchFail();
          }
        });
    },
    /**
     * 搜索失败
     */
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
     * @param searchParams
     */
    initSearchItem: function(searchParams) {
      var that = this;
      var searchItem = new SFSearchItem({
        itemSearchRequest: JSON.stringify(this.searchParams)
      });
      return searchItem.sendRequest()
        .done(function(itemSearchData) {
          that.renderData.attr("itemSearch", itemSearchData);

          //将得到的聚合数据存储起来，用于展示赛选条件
          _.each(itemSearchData.aggregations, function(value, key, list) {
            var fn = that.aggregationsMap[value.name];
            if (_.isFunction(fn)) {
              fn.call(that, value)
            }
          });

          //关联一二级分类
          that.unionCategory();
        });
    },
    /**
     * 关联一二级分类
     */
    unionCategory: function() {
      if (this.renderData.filterCustom.secondCategoryName) {
        var categoryies = this.renderData.attr("categories");
        var secondCategoryies = this.renderData.attr("secondCategories");

        _.each(categoryies.buckets, function(value, key, list) {
          var tempSecondCategories = [];
          _.find(secondCategoryies.buckets, function(secondCategory) {
            if (value.id == secondCategory.levelOneCategoryId) {
              tempSecondCategories.push(secondCategory);
            }
          });
          value.attr("innerSecondCategories", tempSecondCategories);
        });
      }
    },
    /**
     * 聚合数据处理map
     */
    aggregationsMap: {
      byBrand: function(value) {
        var that = this;

        var brandIds = this.searchParams.brandIds;
        if (brandIds) {
          _.each(brandIds, function(bvalue, bkey, blist) {
            _.find(value.buckets, function(bucket) {
              if (bucket.id == bvalue) {
                bucket.selected = true;
                that.renderData.filterBrands.push(bucket);
                that.renderData.filters.push(bucket);
              }
            });
          })
        }
        this.renderData.attr("brands", value);
      },
      byCategory: function(value) {
        var that = this;

        var categoryIds = this.searchParams.categoryIds;
        _.each(value.buckets, function(bvalue, bkey, blist) {
          var result = _.find(categoryIds, function(cateId) {
            if (cateId == bvalue.id) {
              return true;
            }
          });
          if (result) {
            bvalue.selected = true;
            that.renderData.filterCategories.push(bvalue);
            that.renderData.filters.push(bvalue);
          } else {
            bvalue.selected = false;
          }
        })

        this.renderData.attr("categories", value);
      },
      bySecondCategory: function(value) {
        var that = this;

        var secondCategoryIds = this.searchParams.secondCategoryIds;
        //处理已选项
        _.each(value.buckets, function(bvalue, bkey, blist) {
          var result = _.find(secondCategoryIds, function(cateId) {
            if (cateId == bvalue.id) {
              return true;
            }
          })
          if (result) {
            bvalue.selected = true;
            that.renderData.filterSecondCategories.push(bvalue);
            that.renderData.filters.push(bvalue);
          } else {
            bvalue.selected = false;
          }
        });

        this.renderData.attr("secondCategories", value);
      },
      byGoodsOrigin: function(value) {
        var that = this;

        var originIds = this.searchParams.originIds;
        if (originIds) {
          _.each(originIds, function(bvalue, bkey, blist) {
            _.find(value.buckets, function(bucket) {
              if (bucket.id == bvalue) {
                bucket.selected = true;
                that.renderData.filterOrigins.push(bucket);
                that.renderData.filters.push(bucket);
              }
            });
          })
        }
        this.renderData.attr("origins", value);
      },
      byShopNation: function(value) {
        var that = this;

        var shopNationIds = this.searchParams.shopNationIds;
        if (shopNationIds) {
          _.each(shopNationIds, function(bvalue, bkey, blist) {
            _.find(value.buckets, function(bucket) {
              if (bucket.id == bvalue) {
                bucket.selected = true;
                that.renderData.filterShopNations.push(bucket);
                that.renderData.filters.push(bucket);
              }
            });
          })
        }
        this.renderData.attr("shopNations", value);
      }
    },
    /**
     * 实时获取商品的价格和库存数据
     * @param itemIds 商品的items
     * @returns {*}
     */
    initGetProductHotDataList: function(itemIds) {
      var that = this;
      var getProductHotDataList = new SFGetProductHotDataList({
        itemIds: JSON.stringify(itemIds)
      });
      return getProductHotDataList.sendRequest()
        .done(function(hotDataList) {

          //合并价格 并入库存 购物车支持
          _.each(hotDataList.value, function(value, key, list) {
            _.each(that.renderData.itemSearch.results, function(ivalue, ikey, ilist) {
              if (ivalue.itemId == value.itemId) {
                ivalue.attr("sellingPrice", value.sellingPrice);
                ivalue.attr("referencePrice", value.referencePrice);
                ivalue.attr("actualPrice", value.originPrice);
                ivalue.attr("soldOut", value.soldOut);
                ivalue.attr("supportShoppingCart", value.supportShoppingCart);
                ivalue.attr("originPrice", value.localSellingPrice);
                ivalue.attr("currencySymbol", value.currencySymbol);
              }
            });
          })
        });
    },
    /**
     * 格式化url参数，用于跳到新的搜索页面
     * @param {object} data url参数
     * @returns {string} url参数
     */
    getSearchParamStr: function(data) {
      if (!data) {
        data = this.searchData;
      }
      var paramStr = "";
      _.each(data, function(value, key, list) {
        if (_.isArray(value)) {
          paramStr += key + "=" + value.join("||") + "&";
        } else {
          paramStr += key + "=" + value + "&";
        }
      });
      return paramStr.substr(0, paramStr.length - 1);
    },
    /**
     * 按新的筛选条件跳到新的搜索页面
     * @param data url参数
     */
    gotoNewPage: function(data) {
      window.location.href = window.location.pathname + "?" + this.getSearchParamStr(data);
    },

    /**
     * 筛选条件更多按钮展开事件
     */
    "#classify-more click": function(targetElement) {
      targetElement.parents('li').toggleClass('active');
    },
    /**
     * 按品牌条件筛选
     * @param targetElement
     */
    "[data-role=selectBrand] li click": function(targetElement) {
      var searchDataTemp = _.clone(this.searchData);
      delete searchDataTemp.page;
      searchDataTemp.brandIds = [targetElement.data("id")];
      this.gotoNewPage(searchDataTemp);
    },
    /**
     * 按一级分类条件筛选
     * @param targetElement
     */
    "[data-role=selectCategory] li click": function(targetElement) {
      var searchDataTemp = _.clone(this.searchData);
      delete searchDataTemp.page;
      searchDataTemp.categoryIds = [targetElement.data("id")];
      this.gotoNewPage(searchDataTemp);
    },
    /**
     * 按二级分类条件筛选
     * @param targetElement
     */
    "[data-role=selectSecondCategory] li click": function(targetElement) {
      var searchDataTemp = _.clone(this.searchData);
      delete searchDataTemp.page;
      searchDataTemp.catg2ndIds = [targetElement.data("id")];
      this.gotoNewPage(searchDataTemp);
    },
    /**
     * 按货源地条件筛选
     * @param targetElement
     */
    "[data-role=selectOrigin] li click": function(targetElement) {
      var searchDataTemp = _.clone(this.searchData);
      delete searchDataTemp.page;
      searchDataTemp.originIds = [targetElement.data("id")];
      this.gotoNewPage(searchDataTemp);
    },
    /**
     * 按店铺所在地条件筛选
     * @param targetElement
     */
    "[data-role=selectShopNation] li click": function(targetElement) {
      var searchDataTemp = _.clone(this.searchData);
      delete searchDataTemp.page;
      searchDataTemp.snIds = [targetElement.data("id")];
      this.gotoNewPage(searchDataTemp);
    },
    /**
     * 清空已选择条件
     * @param targetElement
     */
    '#emptyFilterBtn click': function(targetElement) {
      var searchDataTemp = _.clone(this.searchData);
      delete searchDataTemp.page;
      delete searchDataTemp.brandIds;
      delete searchDataTemp.categoryIds;
      delete searchDataTemp.catg2ndIds;
      delete searchDataTemp.originIds;
      delete searchDataTemp.snIds;
      this.gotoNewPage(searchDataTemp);
    },
    /**
     * 删除一个以选中条件
     * @param targetElement
     */
    '#classify-select li .btn-search-close click': function(targetElement) {
      var role = targetElement.data("role");

      var searchDataTemp = _.clone(this.searchData);
      delete searchDataTemp.page;
      delete searchDataTemp[role];
      this.gotoNewPage(searchDataTemp);
    },

    /**
     * 上一页事件
     * @param targerElement
     */
    "#pageUpBtn click": function(targetElement) {
      var prevPage = this.renderData.prevPage;

      var searchDataTemp = _.clone(this.searchData);
      searchDataTemp.page = prevPage ? prevPage : 1;
      this.gotoNewPage(searchDataTemp);
    },

    /**
     * 下一页事件
     * @param targerElement
     */
    "#pageDownBtn click": function(targetElement) {
      var nextPage = this.renderData.nextPage;

      var searchDataTemp = _.clone(this.searchData);
      searchDataTemp.page = nextPage;
      this.gotoNewPage(searchDataTemp);
    },

    /**
     * 排序事件
     * @param targerElement
     */
    "[data-role=sortBox] li click": function(targerElement) {
      var role = targerElement.data("role");
      var selectSort = _.find(this.sortMap, function(item){
        if (item.value == role) {
          return item;
        }
      })
      this.renderData.attr("sort", selectSort);
      this.gotoNewPage();
    },
    /**
     * 是否显示接口数据、用户数据、实时库存
     * @param element
     */
    checkCartIsShown: function(element) {

      var that = this;

      var isShowFlag = false;
      if (SFFrameworkComm.prototype.checkUserLogin.call(this)) {
        // 从cookie中获得值确认购物车是不是显示
        var uinfo = $.cookie('1_uinfo');
        var arr = [];
        if (uinfo) {
          arr = uinfo.split(',');
        }

        // 判断纬度，用户>总开关
        //
        // 第四位标示是否能够展示购物车
        // 0表示听从总开关的，1表示显示，2表示不显示
        var flag = arr[4];

        // 如果判断开关关闭，使用dom操作不显示购物车
        if (typeof flag == 'undefined' || flag == '2') {
          that.renderData.attr("isShowShoppintCart", false);
        } else if (flag == '0') {
          isShowFlag = true;
        } else {
          that.renderData.attr("isShowShoppintCart", true);
        }
      } else {
        isShowFlag = true;
      }

      // @todo 请求总开关进行判断
      if (isShowFlag) {
        var isShowCart = new SFIsShowCart();
        isShowCart
          .sendRequest()
          .done(function(info) {
            that.renderData.attr("isShowShoppintCart", !!info.value)
          });
      }
    },

    /**
     * @author Michael.Lee
     * @description 添加购物车动作触发
     * @param  {element} el
     */
    '.addtocart click': function(el, event) {
      event && event.preventDefault();

      var itemId = el.parents("li[data-item-id]").data("itemId");
      if (SFFrameworkComm.prototype.checkUserLogin.call(this)) {

        window.el = el;

        // 用户如果如果登录
        this.addCart.call(this, itemId, 1, el);

      } else {
        store.set('temp-action-addCart', {
          itemId: itemId
        });
        can.trigger(window, 'showLogin', [window.location.href]);
      }
    },


    /**
     * @author Michael.Lee
     * @description 加入购物车
     */
    addCart: function(itemId, num, $el) {
      var itemsStr = JSON.stringify([{
        itemId: itemId,
        num: num || 1
      }]);
      var addItemToCart = new SFAddItemToCart({
        items: itemsStr
      });

      // 添加购物车发送请求
      addItemToCart.sendRequest()
        .done(function(data) {
          if (data.isSuccess) {
            // 更新mini购物车
            can.trigger(window, 'updateCart');

            var $el = window.el;

            if ($(window).scrollTop() > 166) {
              var target = $('.nav .icon100').eq(1).offset()
            } else {
              var target = $('.nav .icon100').eq(0).offset()
            }
            var targetX = target.left,
              targetY = target.top,
              current = $el.offset(),
              currentX = current.left,
              currentY = current.top,
              cart_num = $('.cart-num').eq(0).text();
            $el.clone().appendTo($el.parent());
            $el.css({
              left: targetX - currentX,
              top: targetY - currentY,
              zIndex: 2,
              visibility: 'hidden'
            })

            setTimeout(function() {
              $el.remove();
            }, 1000);
            cart_num++;
            $('.cart-num').text(cart_num);
            $('.nav .label-error').addClass('active');

            setTimeout(function() {
              $('.nav .label-error').removeClass('active');
            }, 500);
          } else {
            var $el = $('<div class="dialog-cart" style="z-index:9999;"><div class="dialog-cart-inner" style="width:242px;padding:20px 60px;"><p style="margin-bottom:10px;">' + data.resultMsg + '</p></div><a href="javascript:" class="icon icon108 closeDialog">关闭</a></div>');
            if ($('.dialog-cart').length > 0) {
              return false;
            };
            $(document.body).append($el);
            $('.closeDialog').click(function(event) {
              $el.remove();
            });
            setTimeout(function() {
              $el.remove();
            }, 3000);
          }


        })
        .fail(function(data) {

        })
    }
  });

});
