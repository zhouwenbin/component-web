'use strict';

// @description 申请命名空间
sf.util.namespace('b2c.mall.adapter.shopping.car');

/**
 * @class sf.b2c.mall.adapter.shopping.car
 * @author Michael.Lee (leewind19841209@gmail.com)
 * @description ShoppingCar
 */
sf.b2c.mall.adapter.shopping.car = can.Map.extend({

  init:function (data) {
    // this.format(data.products, data.skus);
  },

  replace: function (data) {

    var that = this;
    _.each(data, function(value, key, list){
      that.attr(key, value);
    });
  },

  /**
   * @description 从album中将图片解析出来
   * @return {Array} 图片列表
   */
  filterImages: function (specs, defaultImgs) {
    var images = [];
    _.each(specs, function(spec){
      if (spec.album) {
        images = _.union(images, spec.album.split(','));
      }
    });

    if ((!images || images.length === 0) && defaultImgs) {
      images = _.union(images, [defaultImgs]);
    }

    return images;
  },

  remove: function (index) {
    this.products.removeAttr(index);
    this.attr('num', this.products.length);
  },

  /**
   * @description 将data model转化为view model
   * @function sf.b2c.mall.adapter.shopping.car.format format
   * @param  {Map} shopping car SKU信息
   */
  format: function(products, skus) {

    // 对product的字段进行扩展
    var that = this;
    _.each(products, function(product){
      var found = _.find(skus, function(sku){
        return sku.skuId == product.skuId;
      });

      var images = that.filterImages(product.skuSpec, product.defaultImgs);
      var name = _.isEmpty(product.name) ? product.foreignName : product.name;

      product = _.extend(product, {
        name:name,
        img: images[0],
        oprice: product.listPrice,
        sku: product.skuId,
        attrs: product.skuSpec,
        limit: product.numberInStock < 0 ? 99999 : product.numberInStock,
        num: found && found.count,
        status: found && found.status,
        selected: false,
        sum: function () {
          return this.attr('price') * this.attr('num');
        }
      });
    });

    // 替换map中的值
    this.replace({
      products: products,
      num: function () {
        return +(this.products && this.products.attr('length'))
      },
      calculate: function () {
        if (this.products) {
          var products = this.products.attr();
          return _.reduce(products, function(memo, value, key, list){
            if (value.selected) {
              return memo + value.price * value.num;
            }else{
              return memo;
            }
          }, 0);
        }else{
          return 0;
        }
      },
      error: {
        errorMsg: null
      },
      comment: null,
      canGotoPay: 'disabled',
      selectAll: false
    });
  }
});

sf.b2c.mall.adapter.shopping.car.getInstance = function (data) {
  if (this.inst) {
    return this.inst;
  }else{
    this.inst = new sf.b2c.mall.adapter.shopping.car(data);
    return this.inst;
  }
}