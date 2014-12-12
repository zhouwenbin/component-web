'use strict';

sf.util.namespace('b2c.mall.launcher.list');

can.route.ready();

/**
 * @description 产品列表页加载逻辑
 */
sf.b2c.mall.launcher.list = can.Control.extend({

  helpers: {
    'sp': function (price) {
      return Math.rount(price/100, 2);
    }
  },

  init: function() {
    this.component = this.component || {};

    new sf.b2c.mall.header('.sf-b2c-mall-header');
    new sf.b2c.mall.footer('.sf-b2c-mall-footer');

    new sf.b2c.mall.component.nav.search('.sf-b2c-mall-nav');

    // new sf.b2c.mall.sider.nav('.sf-b2c-mall-sider-nav');
    new sf.b2c.mall.sider.hot('.sf-b2c-mall-sider-hot', {direction: 'landscape'});

    this.options.page = new sf.b2c.mall.adapter.pagination({});
    this.options.queryQueue = [];
    this.options.queryStatus = 'READY';

    this.component.productList = new sf.b2c.mall.product.list();
    this.component.breadcrumb = new sf.b2c.mall.product.breadcrumb();
    this.component.loading = new sf.b2c.mall.widget.loading('.sf-b2c-mall-loading');

    // deparam过程 -- 从url中获取需要请求的sku参数
    var params = can.deparam(window.location.search.substr(1));

    this.render(params);

    // @deprecated 接口废弃
    // this.supplement(params);

    var condition = can.route.attr();
    if (!condition.type) {
      condition.type = 'default'
    }

    if (!condition.page) {
      condition.page = 1;
    }

    this.pushQuery(condition);
  },

  render: function(data) {
    this.options.productListAdapter = new sf.b2c.mall.adapter.product.list();
    this.options.redirect = function(param) {
      can.route.attr(param);
    };

    this.component.productList.paint(this.element.find('.sf-b2c-mall-product-list'), this.options);
  },

  supplement: function(data) {
    can.when(sf.b2c.mall.model.product.getProductAttrs(data))
      .done(function (data) {
        if (sf.util.access(data)) {
          new sf.b2c.mall.product.filter.panel('.sf-b2c-mall-product-filter-panel', {
            data: data.content[0]
          });
        }
      });
  },

  pushQuery: function (params) {
    // deparam过程 -- 从url中获取需要请求的sku参数
    var info = can.deparam(window.location.search.substr(1));

    var typeMap = {
      'price': 'price=asc',
      'sales': 'sales=asc'
    };

    var condition = {
      frontcategory: info.cid,
      pagesize: 36,
      pagenum: params.page,
      type: params.type // @notation type这里具体的搜索词需要心远那里给出
    };

    if (typeMap[params.type]) {
      condition.sort = typeMap[params.type];
    }

    if (info.saletype) {
      condition.saletype = info.saletype
    }

    var query = $.param(condition);
    query = window.decodeURIComponent(query);

    this.options.queryQueue.push(_.extend(condition, {query: query}));
    this.options.queryQueue = _.reject(this.options.queryQueue, function(value, i, list){
      return !value.query;
    });

    this.options.queryQueue = _.uniq(this.options.queryQueue, function(value, key, list){
      return value.query;
    });

    if (this.options.queryStatus == 'READY') {
      var q = this.options.queryQueue.shift();
      this.options.queryQueue = [];

      this.options.queryStatus = 'PROCESS';
      this.query(q);
    }
  },

  removeQuery: function (params) {
    this.options.queryStatus = 'READY';
    this.options.queryQueue = _.reject(this.options.queryQueue, function(value, i, list){
      return value.query === params.query;
    });
  },

  query: function (params) {
    var that = this;
    this.component.loading.show();
    can.when(sf.b2c.mall.model.product.getProductList({q: params.query}))
      .done(function (data) {
        that.removeQuery.call(that, params)
        if (sf.util.access(data) && data.content[0].isSuccess) {
          that.options.productListAdapter.format(data.content[0]);

          that.options.page.format(that.options.productListAdapter.attr('page'));

          new sf.b2c.mall.widget.pagination('.sf-b2c-mall-pagination', that.options);
          if (that.component.productFilterType) {
            that.component.productFilterType.destroy();
          }
          that.component.productFilterType = new sf.b2c.mall.product.filter.type('.sf-b2c-mall-product-filter-type', that.options);
        }
      })
      .fail(function (error) {

      })
      .then(function () {
        if (params.frontcategory && params.frontcategory.cid) {
          return sf.b2c.mall.model.category.getAllParents({cid: params.frontcategory.cid})
        }else{
          return;
        }
      })
      .done(function (data) {
        if (data && sf.util.access(data) && data.content[0]) {
          that.component.breadcrumb.paint(that.element.find('.sf-b2c-mall-product-breadcrumb'), {
            data: {
              path: data.content[0],
              sum: that.options.productListAdapter.page.totalNum,
              noresult: false
            }
          });
        }
      })
      .fail(function (error) {

      })
      .then(function () {
        that.component.loading.hide();
      })
  },

  '{can.route} change': function(el, attr, how, newVal, oldVal) {
    var params = can.route.attr();
    // this.query(params);
    this.pushQuery(params)

  }
});

new sf.b2c.mall.launcher.list('#content');