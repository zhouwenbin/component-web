'use strict';

sf.util.namespace('b2c.mall.model');

sf.b2c.mall.model.category = can.Model.extend({

  getSubcategory: function (data) {
    return can.ajax('json/sf.b2c.mall.subcategory.json');
  },

  getSiderHotList: function (data) {
    return can.ajax('json/sf.b2c.mall.sider.hot.json');
  },

  getAllParents: function(data) {
    return can.ajax({
      url: sf.config.current.url,
      type: 'post',
      data: sf.util.sign({
        level: 'NONE',
        data: {
          _mt: 'products.getAllParents',
          cid: data.cid
        }
      })
    });
  },

  findCategoryAll: function () {
    return can.ajax({
      url: sf.config.current.url,
      type: 'post',
      data: sf.util.sign({
        level: 'NONE',
        data: {
          _mt: 'products.getCategories'
        }
      })
    });
  },

  findHotCategory: function () {
    return can.ajax('json/sf.b2c.mall.hot.category.json');
  },

  getCategories: function () {
    return can.ajax('json/sf.b2c.mall.categories.json');
  }

},{});