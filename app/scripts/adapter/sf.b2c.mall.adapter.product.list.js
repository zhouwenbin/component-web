'use strict';

// @description 申请命名空间
sf.util.namespace('b2c.mall.adapter.product.list');

/**
 * @class sf.b2c.mall.adapter.product.list
 * @author Michael.Lee (leewind19841209@gmail.com)
 * @description ProductList
 */
sf.b2c.mall.adapter.product.list = can.Map.extend({

  format: function (data) {
    for (var i = 0; i < data.products.length; i++) {
      data.products[i].i = i+1;
    }

    _.each(data.catagories, function(value, index, list){
      if (index === 0) {
        value.on = true;
      }else{
        value.on = false;
      }
    });

    if (!data.page.pageSize) {
      data.page.pageSize = data.page.rowNum;
    }

    // 注意在canjs中需要对每一个子节点进行设置更新才会有效
    this.attr('products', data.products);
    this.attr('page', data.page);
    this.attr('filters', data.filterGroups);
    this.attr('catagories', data.catagories);
  }

});