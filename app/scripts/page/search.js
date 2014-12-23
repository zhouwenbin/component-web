'use strict';

sf.util.namespace('b2c.mall.launcher.list');

can.route.ready();

/**
 * @description 产品列表页加载逻辑
 */
sf.b2c.mall.launcher.list = can.Control.extend({

  init: function() {
    this.component = this.component || {};

    new sf.b2c.mall.header('.sf-b2c-mall-header');
    new sf.b2c.mall.footer('.sf-b2c-mall-footer');

    new sf.b2c.mall.component.nav.search('.sf-b2c-mall-nav');
    var params = can.route.attr();
    if (!params.page) {
      params = _.extend(params, {page: 1});
    }

    this.options.queryQueue = [];
    this.options.queryStatus = 'READY';

    this.component.productList = new sf.b2c.mall.product.list();
    this.component.breadcrumb = new sf.b2c.mall.product.breadcrumb();
    this.component.loading = new sf.b2c.mall.widget.loading('.sf-b2c-mall-loading');

    this.pushQuery(params);
  },

  pushQuery: function (params) {
    // deparam过程 -- 从url中获取需要请求的sku参数
    var info = can.deparam(window.location.search.substr(1));

    var typeMap = {
      'price': 'price=asc',
      'sales': 'sales=asc'
    };

    var condition = {
      q: info.q,
      pagesize: 36,
      pagenum: params.page || 1
    };

    if (params.category) {
      condition.category = params.category;
    }

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
      this.options.queryQueue = []

      this.options.queryStatus = 'PROCESS';
      this.search(q);
    }
  },

  removeQuery: function (params) {
    this.options.queryStatus = 'READY';
    this.options.queryQueue = _.reject(this.options.queryQueue, function(value, i, list){
      return value.query === params.query;
    });
  },

  render: function(tag, data) {
    var action = this.renderMap[tag];

    if (_.isFunction(action)) {
      action.call(this, data);
    }
  },

  renderMap: {
    'noResults': function(data) {
      var html = can.view('templates/product/sf.b2c.mall.product.search.no.results.mustache', data);
      this.element.find('.sf-b2c-mall-search-panel').html(html);
    },
    'hasResults': function(data) {
      var html = can.view('templates/product/sf.b2c.mall.product.search.has.results.mustache', {});
      this.element.find('.sf-b2c-mall-search-panel').html(html);

      // 不再展示左侧类目
      // new sf.b2c.mall.sider.nav('.sf-b2c-mall-sider-nav', this.options.productListAdapter.catagories.attr());

      new sf.b2c.mall.sider.hot('.sf-b2c-mall-sider-hot', { direction: 'landscape'});

      this.component.productList.paint(this.element.find('.sf-b2c-mall-product-list'), this.options);

      if (this.component.productFilterType) {
        this.component.productFilterType.destroy();
      }
      this.component.productFilterType = new sf.b2c.mall.product.filter.type('.sf-b2c-mall-product-filter-type', this.options);

      this.options.page = new sf.b2c.mall.adapter.pagination();
      this.options.page.format(this.options.productListAdapter.page);
      new sf.b2c.mall.widget.pagination('.sf-b2c-mall-pagination', this.options);
    }
  },


  redirect: function(param) {
    can.route.attr(param);
  },

  search: function(params) {
    var that = this;
    this.component.loading.show();
    can.when(sf.b2c.mall.model.product.getProductList({q: params.query}))
      .then(function(data) {
        that.removeQuery.call(that, params)

        if (sf.util.access(data)&& data.content[0].isSuccess) {

          that.options.productListAdapter = new sf.b2c.mall.adapter.product.list();
          that.options.productListAdapter.format(data.content[0]);
          that.options.redirect = that.redirect;

          if(that.options.productListAdapter.products.length == 0){
            that.render('noResults', params);

            new sf.b2c.mall.component.category('.sf-b2c-mall-component-category', {
              hoverEffect: true
            });

            that.component.breadcrumb.paint(that.element.find('.sf-b2c-mall-product-breadcrumb'), {
              data: {
                path: [{
                  'name': '首页',
                  'link': '#'
                }],
                sum: '0',
                noresult: true
              }
            });

            new sf.b2c.mall.sider.hot('.sf-b2c-mall-sider-hot',{direction: 'horizontal'});
          }else{
            that.render('hasResults', that.options);

            that.component.breadcrumb.paint(that.element.find('.sf-b2c-mall-product-breadcrumb'), {
              data: {
                categories:  that.options.productListAdapter.catagories,
                sum: that.options.productListAdapter.page.totalNum,
                noresult: false,
                keyword: params.q
              }
            });

            var filters = that.options.productListAdapter.attr('filters');
            var source = [];

            _.each(filters, function(filter){
              var type = 'plain';
              if (filter.filterConditions && filter.filterConditions.length> 0 && filter.filterConditions[0].imgUrl) {
                type = 'media';
              }

              var tmp = { name: filter.group.name, value: filter.group.value, list: [], type: type};
              _.each(filter.filterConditions, function(condition){
                tmp.list.push({
                  text: condition.name,
                  name: condition.id
                });
              });
              source.push(tmp);
            });

            new sf.b2c.mall.product.filter.panel('.sf-b2c-mall-product-filter-panel', {
              data: source
            });
          }
        }else{
          // that.render('noResults', info);
          that.render('noResults', params);

          new sf.b2c.mall.component.category('.sf-b2c-mall-component-category', {
            hoverEffect: true
          });

          that.component.breadcrumb.paint(that.element.find('.sf-b2c-mall-product-breadcrumb'), {
            data: {
              path: [{
                'name': '首页',
                'link': '#'
              }],
              sum: '0',
              noresult: true
            }
          });
          new sf.b2c.mall.sider.hot('.sf-b2c-mall-sider-hot',{direction: 'horizontal'});
        }

        that.component.loading.hide();
      });
  },

  '{can.route} change': function(el, attr, how, newVal, oldVal) {
    var params = can.route.attr();
    this.pushQuery(params);
  }
});

new sf.b2c.mall.launcher.list('#content');