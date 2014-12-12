'use strict';

var launcher = sf.util.namespace('b2c.mall.launcher.detail');

can.route.ready();

sf.b2c.mall.launcher.detail = can.Control.extend({

  init: function() {

    this.component = this.options.component || {};

    new sf.b2c.mall.header('.sf-b2c-mall-header');
    new sf.b2c.mall.footer('.sf-b2c-mall-footer');

    this.component.navSearch = new sf.b2c.mall.component.nav.search('.sf-b2c-mall-nav');
    this.component.loading = new sf.b2c.mall.widget.loading('.sf-b2c-mall-loading');

    // deparam过程 -- 从url中获取需要请求的sku参数
    var params = can.deparam(window.location.search.substr(1));

    if (!params || !params.sku) {
      window.location.href = '/index.html';
    }

    new sf.b2c.mall.component.category('.sf-b2c-mall-component-category', {
      hoverEffect: true
    });

    var that = this;

    this.component.loading.show();

    // 请求getSKUInfo和getSPUInfo，都返回之后才可以拼接页面
    can.when(sf.b2c.mall.model.product.getSKUInfo(params))
      .done(function(data) {
        if (sf.util.access(data)) {
          that.options.skuAdapter = new sf.b2c.mall.sku.adapter();
          that.options.skuAdapter.format(data.content[0]);
        }
      })
      .fail(function() {
        that.component.loading.hide();
        // @todo 没有请求到skuinfo的错误处理
      })
      .then(function() {
        if (that.options.skuAdapter && that.options.skuAdapter.attr('spu')) {
          return sf.b2c.mall.model.product.getSPUInfo({
            spu: that.options.skuAdapter.attr('spu')
          });
        }
      })
      .done(function(data) {
        //查询不到商品后直接返回
        if (typeof data == 'undefined') {
          that.component.loading.hide();
          return;
        }
        if (sf.util.access(data)) {
          that.options.spuAdapter = new sf.b2c.mall.spu.adapter();
          that.options.spuAdapter.format(data.content[0]);
        }
      })
      .fail(function(error) {
        // @todo 没有请求到spuinfo的错误处理
      })
      .then(function() {
        if (!that.options.spuAdapter) return;

        that.options.input = new can.Map({
          amount: 1, //设置默认数量
          selectedImgUrl: null
        });

        var skus = that.options.spuAdapter.attr('skus');
        var sku = that.options.skuAdapter.attr('sku');
        var selectedSku = _.findWhere(skus, {
          skuId: window.parseInt(sku)
        });

        if (selectedSku) {
          that.options.spuAdapter.attr({
            selected: selectedSku.specs
          });
        }

        that.render(that.options);
        that.bind('nav');
        that.supplement(that.data);

        new sf.b2c.mall.sider.hot('.section-1-left', {
          direction: 'horizontal'
        });

        var element = $('.thumb-item').get(0);
        $(element).trigger('click');
      })
      .then(function () {
        if (that.options.spuAdapter) {
          var breadcrumb = new sf.b2c.mall.product.breadcrumb();
          breadcrumb.paint(that.element.find('.sf-b2c-mall-product-breadcrumb'), {
            data: {
              path: [],
              title: that.options.spuAdapter.attr('title'),
              sku: that.options.skuAdapter.attr('sku'),
              sum: null
            }
          });
          that.bind('zoom');
        }else{
          return that.render404();
        }
      })
      // .then(function() {
      //   if (that.options.spuAdapter) {
      //     return sf.b2c.mall.model.category.getAllParents({
      //       cid: that.options.spuAdapter.attr('cid') || 0
      //     });
      //   }else{
      //     return that.render404();
      //   }
      // })
      // .done(function(data) {
      //   if (data && sf.util.access(data)) {
      //     var breadcrumb = new sf.b2c.mall.product.breadcrumb();
      //     breadcrumb.paint(that.element.find('.sf-b2c-mall-product-breadcrumb'), {
      //       data: {
      //         path: data.content[0],
      //         title: that.options.spuAdapter.attr('title'),
      //         sku: that.options.skuAdapter.attr('sku'),
      //         sum: null
      //       }
      //     });
      //     that.bind('zoom');
      //   }
      // })
      // .fail(function() {

      // })
      .then(function() {
        that.component.loading.hide();
      });
  },

  render404: function(data) {
    var html = can.view('templates/product/sf.b2c.mall.product.no.detail.mustache', {});
    this.element.find('.sf-b2c-mall-detail-content').html(html);
  },

  render: function(data) {
    var html = can.view('templates/product/sf.b2c.mall.product.detail.mustache', data, this.helpers);
    this.element.find('.sf-b2c-mall-detail-content').html(html);
  },

  /**
   * @description 当SKU发生变化时发生的回调, 更新SKU的信息，不再重复刷新页面
   * @param  {String} sku 变化后的sku
   */
  changeSKU: function(sku) {
    if (this.options.skuAdapter.sku == sku) {
      return false;
    }

    var skus = this.options.spuAdapter.skus.attr();
    var selected = _.findWhere(skus, {
      skuId: sku
    });

    this.options.spuAdapter.attr({
      selected: selected.specs
    });

    var that = this;
    can.when(sf.b2c.mall.model.product.getSKUInfo({
        sku: sku
      }))
      .done(function(data) {
        if (sf.util.access(data)) {
          that.options.skuAdapter.format(data.content[0]);
          var element = $('.thumb-item').get(0);
          $(element).trigger('click');
        }
      })
      .fail(function(data) {

      });
  },

  supplement: function(data) {
    new sf.b2c.mall.product.attrs.select('.detail-attrs-select', {
      data: this.options.spuAdapter,
      onSKUChanged: _.bind(this.changeSKU, this)
    });
  },

  helpers: {
    isOpenBuy: function(skuAdapter, spuAdapter, options) {
      var sku = skuAdapter.attr();
      var spu = spuAdapter.attr();

      var found = _.find(spu.skus, function(value, key, list) {
        return value.skuId == sku.sku;
      });

      if (sku.stock == 0 || !found || spu.status == 'offsale') {
        return options.inverse(options.scope || this);
      } else {
        return options.fn(options.scope || this);
      }
    },

    isOpenAddCar: function(skuAdapter, spuAdapter, options) {
      var sku = skuAdapter.attr();
      var spu = spuAdapter.attr();

      var found = _.find(spu.skus, function(value, key, list) {
        return value.skuId == sku.sku;
      });

      if (spu.status == 'offsale' || sku.status == 'groupon' || sku.stock == 0) {
        return options.inverse(options.scope || this);
      } else {
        return options.fn(options.scope || this);
      }
    },

    classify: function(skuAdapter, spuAdapter) {
      var sku = skuAdapter.attr();
      var spu = spuAdapter.attr();

      var map = {
        'groupon': 'shop-tag',
        'soldout': 'out-tag',
        'offsale': 'lower-tag'
      };

      if (spu.status == 'offsale') {
        return map['offsale'];
      } else if (!sku.stock) {
        return map['soldout'];
      }
    },

    background: function(skuAdapter, spuAdapter) {
      if (spuAdapter.status == 'offsale' || !skuAdapter.attr('stock')) {
        return 'lower';
      } else {
        return '';
      }
    },

    isEmptyArray: function(value, options) {
      if (value().attr('length') == 0) {
        return options.inverse(options.scope || this);
      } else {
        return options.fn(options.scope || this);
      }
    },

    isSelfProduct: function (saleType, options) {
      if (saleType() == 'SELF') {
        return options.fn(options.scope || this);
      } else {
        return options.inverse(options.scope || this);
      }
    },

    setImgs: function(skuImgs, spuImgs, options) {

      var arr = [];
      arr = _.union(arr, skuImgs().attr());

      if (arr.length == 0) {
        arr = _.union(arr, spuImgs().attr());
      }

      if (arr.length > 5) {
        var subarr = [];
        for (var i = 0; i < 5; i++) {
          subarr.push(arr[i]);
        }

        return options.fn({
          imgs: subarr
        });
      } else {
        return options.fn({
          imgs: arr
        });
      }
    }
  },

  bind: function(tag) {
    var map = {
      'nav': function() {
        // navigation 单页内的导航功能
        // $('#section-nav').onePageNav({
        //   begin: function() {
        //   },
        //   end: function() {
        //   },
        //   scrollOffset: 30
        // });

        var m_st, m_po = 821; //滚动到600像素时显示
        $(window).scroll(function() {
          m_st = Math.max(document.body.scrollTop || document.documentElement.scrollTop);
          if (m_st > m_po) {
            $('#section-nav').css('position', 'fixed');
            $('#section-nav').css('left', '50%');
            $('#section-nav').css('margin-left', '-494px');
          }
          if (m_st < m_po) {
            $('#section-nav').css('position', 'relative');
            $('#section-nav').css('left', '0');
            $('#section-nav').css('margin-left', '0');
          }
        });
      },

      'zoom': function() {
        // 图片放大功能
        $('.jqzoom').imagezoom();
      }
    };

    var action = map[tag];
    if (_.isFunction(action)) {
      action.call(this);
    }
  },

  /**
   * @description event:点击thumb-item切换图片
   * @param  {Dom} element 触发事件的元素
   * @param  {Event} event   事件对象
   */
  '.thumb-item click': function(element, event) {
    event && event.preventDefault() && event.stopPropogation();
    // 删除所有的focus class
    $('.thumb-item').removeClass('tb-selected');
    element.addClass('tb-selected');

    // 为选中元素添加focus class
    var image = element.find('img').attr('big');
    this.options.input.attr('selectedImgUrl', image);
  },

  /**
   * @description event:数量增加，限制是stock
   * @param  {Dom} element 触发事件的元素
   * @param  {Event} event   事件对象
   */
  '.num_plus click': function(element, event) {
    event && event.preventDefault();

    // 如果没有获得库存数量认为数量无限大
    var stock = this.options.skuAdapter.stock < 0 ? 999999 : this.options.skuAdapter.stock;
    var limit = this.options.spuAdapter.limit;
    var amount = parseInt(this.options.input.amount);

    if (stock < 0 && limit < 1) {
      return this.options.input.attr('amount', amount + 1);
    }

    var num = stock < limit ? stock : limit;

    if (num < 0 || this.options.input.attr('amount') < num) {
      return this.options.input.attr('amount', amount + 1);
    } else {
      return this.options.input.attr('amount', num);
    }
    return false;
  },

  /**
   * @description event:数量较少，限制最小是0
   * @param  {Dom} element 触发事件的元素
   * @param  {Event} event   事件对象
   */
  '.num_min click': function(element, event) {
    event && event.preventDefault();
    var amount = this.options.input.amount;
    if (amount > 1) {
      this.options.input.attr('amount', --amount);
    }
    return false;
  },

  '.input_txt keyup': function(element, event) {
    event && event.preventDefault();

    // var amount = parseInt(this.options.input.amount);
    var amount = parseInt(element.val());
    var stock = this.options.skuAdapter.stock < 0 ? 999999 : this.options.skuAdapter.stock;
    var limit = this.options.spuAdapter.limit;

    if (!amount) {
      this.options.input.attr('amount', 1);
      return element.val(1)
    }

    if (!limit || (limit && limit > stock)) {
      if (amount > stock) {
        if (stock >= 0) {
          this.options.input.attr('amount', stock);
          element.val(stock);
        }
      } else if (amount < 0) {
        this.options.input.attr('amount', 1);
        element.val(1);
      }else{
        this.options.input.attr('amount', amount);
        element.val(amount);
      }
    } else {
      if (amount > limit) {
        if (limit >= 0) {
          this.options.input.attr('amount', limit);
          element.val(limit);
        }
      } else if (amount < 0) {
        this.options.input.attr('amount', 1);
        element.val(1);
      }else{
        this.options.input.attr('amount', amount);
        element.val(amount);
      }
    }
  },

  /**
   * @description event:数量输入框失去焦点时做检查
   * @param  {Dom} element 触发事件的元素
   * @param  {Event} event   事件对象
   */
  '.input_txt blur': function(element, event) {
    event && event.preventDefault();
    var amount = parseInt(this.options.input.amount);
    var stock = this.options.skuAdapter.stock < 0 ? 999999 : this.options.skuAdapter.stock;
    var limit = this.options.spuAdapter.limit;

    if (!amount) {
      return this.options.input.attr('amount', 1);
    }

    if (!limit || (limit && limit > stock)) {
      if (amount > stock) {
        if (stock >= 0) {
          this.options.input.attr('amount', stock);
        }
      } else if (amount < 0) {
        this.options.input.attr('amount', 1);
      }else{
        this.options.input.attr('amount', amount);
      }
    } else {
      if (amount > limit) {
        if (limit >= 0) {
          this.options.input.attr('amount', limit);
        }
      } else if (amount < 0) {
        this.options.input.attr('amount', 1);
      }else{
        this.options.input.attr('amount', amount);
      }
    }
  },

  /**
   * @description event:点击直接购买，跳转到buy.html
   * @param  {Dom} element 触发事件的元素
   * @param  {Event} event   事件对象
   */
  '.btn-shop click': function(element, event) {
    event && event.preventDefault();

    if (sf.util.isLogin()) {
      var sku = this.options.skuAdapter.sku;
      var amount = this.options.input.amount;
      var saleType = this.options.spuAdapter.saleType;

      if (amount > 0) {
        window.location.href = 'buy.html?' + $.param({
          sku: sku,
          amount: amount,
          saleType: saleType
        });
      }
    } else {
      var sku = this.options.skuAdapter.sku;
      var amount = this.options.input.amount;

      window.location.href = 'login.html?from=' + encodeURIComponent('buy.html?' + $.param({
        sku: sku,
        amount: amount,
        saleType: saleType
      }));
    }
  },

  /**
   * @description event:点击添加购物车
   * @param  {Dom} element 触发事件的元素
   * @param  {Event} event   事件对象
   */
  '.btn-append click': function(element, event) {
    event && event.preventDefault();

    var sku = this.options.skuAdapter.sku;
    var amount = this.options.input.amount;
    var $mDialogCart = $('.m-dialog-cart');
    if (sf.util.isLogin()) {
      this.component.navSearch.add({
        sku: sku,
        amount: amount
      });
      $mDialogCart.show();
    }
    if (!sf.util.isLogin()) {
      window.location.href = 'login.html';
    }
  },
  '.icon-close click': function(element, event) {
    event && event.preventDefault();
    var $mDialogCart = $('.m-dialog-cart');
    $mDialogCart.hide();
  },
  '.m-btn2 click': function(element, event) {
    event && event.preventDefault();
    var $mDialogCart = $('.m-dialog-cart');
    $mDialogCart.hide();
  }
});

new sf.b2c.mall.launcher.detail('#content');