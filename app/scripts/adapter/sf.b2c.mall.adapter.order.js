'use strict';

// @description 申请命名空间
sf.util.namespace('b2c.mall.adapter.order');

/**
 * @class sf.b2c.mall.adapter.order
 * @author Michael.Lee (leewind19841209@gmail.com)
 * @description Order
 */
sf.b2c.mall.adapter.order = can.Map.extend({

  init: function (data, ids) {
    this.format(data, ids);
  },

  replace: function (data) {
    this.attr(null);
    this.attr(data);
  },

  filter: function (status, subOrderList) {
    var NO_ORIGIN = ['SHIPPED', 'COMPLETED'];

    if (_.contains(NO_ORIGIN, status)) {
      subOrderList = _.reject(subOrderList, function(value, i, list){
        return value.type === 'ORIGIN' || value.type == 'UNASSIGNED';
      });
    }else{
      subOrderList = _.filter(subOrderList, function(value, key, list){
        return value.type == 'ORIGIN';
      });
    }

    return subOrderList;
  },

  format: function (data, ids) {

    data.basicInfo.receiverDesc = JSON.parse(data.basicInfo.receiverDesc);
    var user = _.findWhere(ids.items, {recId: window.parseInt(data.basicInfo.receiverDesc.recId)});
    if (user) {
      data.basicInfo.user = user;
    }

    var subOrderList = this.filter(data.basicInfo.orderStatus, data.subOrderList);

    this.attr('order', data.basicInfo);
    this.attr('subOrderList', subOrderList);
    this.attr('logistic', null);
  },

  getAllProducts: function () {
    var arr = [];
    var subOrderList = this.subOrderList.attr();
    _.each(subOrderList, function(subOrder){
      _.each(subOrder.subOrderItems, function(item){
        arr.push(item.sku);
      });
    });

    arr = _.uniq(arr);

    return arr;
  },

  setProducts: function (productList) {
    var that = this;
    var order = this.order.attr();
    var subOrderList = this.subOrderList.attr();

    _.each(subOrderList, function(subOrder, i){
      _.each(subOrder.subOrderItems, function(item, key){
        var skuinfo = _.findWhere(productList, {skuId: item.sku});
        if (skuinfo) {
          var imgs = [];
          var albums = [];
          _.each(skuinfo.skuSpec, function(value, key, list){
            albums.push(value.album);
          });

          _.each(albums, function(value, key, list){
            if (value) {
              var arr = value.split(',');
              imgs = _.union(imgs, arr);
            }
          });

          if ((!imgs || imgs.length === 0) && skuinfo.defaultImgs) {
            imgs = _.union(imgs, [skuinfo.defaultImgs]);
          }

          skuinfo.img = imgs[0];

          var name = _.isEmpty(skuinfo.name) ? skuinfo.foreignName : skuinfo.name;

          var info = {
            count: item.count,
            price: item.price,
            sku: item.sku,
            skuSnapshotId: item.skuSnapshotId,
            img: skuinfo.img,
            listPrice: skuinfo.listPrice,
            name: name,
            seller: skuinfo.seller,
            skuId: skuinfo.skuId,
            skuSpec: skuinfo.skuSpec,
            shippingStartPointId: skuinfo.shippingStartPointId
          };

          // that.subOrderList[i].subOrderItems.attr(key, _.extend(item, skuinfo));
          that.subOrderList[i].subOrderItems.attr(key, info);
        }
      });
    });
  }

});