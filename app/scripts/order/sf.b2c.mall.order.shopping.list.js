'use strict';

// @description 申请命名空间
sf.util.namespace('b2c.mall.order.shopping.list');

/**
 * @class sf.b2c.mall.order.shopping.list
 * @author Michael.Lee (leewind19841209@gmail.com)
 * @description 订单列表模块
 */
sf.b2c.mall.order.shopping.list = can.Control.extend({}, {

  /**
   * @description 自定义mustache helpers
   * @type {Map}
   */
  helpers: {
    'car-limit': function(limit, options) {
      if (limit() <= 0) {
        return options.inverse(options.scope || this);
      } else {
        return options.fn(options.scope || this);
      }
    },

    'car-status': function(limit, options) {
      if (limit() == 0) {
        return options.fn(options.scope || this);
      } else {
        return options.inverse(options.scope || this);
      }
    }
  },

  /**
   * @description 初始化方法，当调用new时会执行init方法
   * @param  {Dom} element 当前dom元素
   * @param  {Map} options 传递的参数
   */
  init: function(element, options) {},

  /**
   * @description 对页面做第一次绘制
   * @param  {Map} data 绘制页面的数据
   */
  paint: function(data) {

    this.options = data;
    this.render(data);

    var that = this;
    this.options.bind('change', function() {
      if (that.options.products) {
        that.isOpenPay(that.options.products.attr());
      }
    });
  },

  /**
   * @description 对页面进行渲染
   * @param  {Map} data 渲染页面的数据
   */
  render: function(data) {
    var html = can.view('templates/order/sf.b2c.mall.shopping.list.mustache', data, this.helpers);
    this.element.html(html);
  },

  /**
   * @description 获取用户选定的商品列表
   * @return {List} 用户选定的商品列表
   */
  getProductList: function() {
    return this.options.products;
  },

  /**
   * @description event:减少购买数量
   * @param  {Dom} element 触发事件的元素
   * @param  {Event} event   事件对象
   */
  '.order-min-btn click': function(element, event) {
    var index = element.data('index');
    var sku = this.options.products.attr(index);

    var num = sku.attr('num')
    if (num > 1) {
      sku.attr('num', num - 1);
    }

    return false;
  },

  /**
   * @description event:添加购买数量
   * @param  {Dom} element 触发事件的元素
   * @param  {Event} event   事件对象
   */
  '.order-add-btn click': function(element, event) {
    var index = element.data('index');
    var sku = this.options.products.attr(index);

    // @description 需求：限购，每位购买者每次只能下两单
    var limit = 2;
    var stock = 2;

    if (stock < 0 || limit < 1) {
      return sku.attr('num', sku.attr('num') + 1);
    }

    var num = stock > limit ? stock : limit;
    if (num < 0 || sku.attr('num') < num) {
      return sku.attr('num', sku.attr('num') + 1);
    } else {
      return sku.attr('num', num);
    }

    return false;
  },

  /**
   * @todo 需要和"{selectAll} change"进行整合
   * @description event:
   * @param  {Dom} element 触发事件的元素
   * @param  {Event} event   事件对象
   */
  '.order-select-all click': function(element, event) {
    var selectAll = this.options.selectAll;

    // 如果不是在全选状态的话，那么选中全部product，并且打开canGotoPay的按钮
    if (selectAll) {
      this.options.products.each(function(el, i) {
        if (el.stock !== 0 && el.status == 3) {
          el.attr('selected', true);
        } else {
          el.attr('selected', false);
        }
      });

      this.options.attr('canGotoPay', '');
      this.options.error.attr('errorMsg', null);
    } else {
      this.options.products.each(function(el, i) {
        el.attr('selected', false);
      });

      this.options.attr('canGotoPay', 'disabled');
    }
  },

  /**
   * @description event:删除某一个商品
   * @param  {Dom} element 触发事件的元素
   * @param  {Event} event   事件对象
   */
  '.order-delete-item-btn click': function(element, event) {
    event && event.preventDefault();

    var index = element.data('index');
    var product = this.options.products.attr(index);

    var that = this;
    can.when(sf.b2c.mall.model.order.carRemoveProduct(product))
      .done(function(data) {
        if (sf.util.access(data) && data.content[0].value) {
          that.options.products.removeAttr(index);
        }
      })
      .fail(function(data) {

      });
  },

  /**
   * @description event:删除选中的商品
   * @param  {Dom} element 触发事件的元素
   * @param  {Event} event   事件对象
   */
  '.order-delete-selected-btn click': function(element, event) {
    event && event.preventDefault();

    var that = this;
    var arr = [];
    this.options.products.each(function(element, index) {
      if (element.attr('selected')) {
        arr.unshift(index);
      }
    });

    var skus = []
    _.each(arr, function(value, key, list) {
      var product = that.options.products.attr(value);
      skus.push(product);
    });

    var skuList = _.pluck(skus, 'sku');

    sf.b2c.mall.model.order.carBulkDeleteShopCart({
        skulist: skuList
      })
      .done(function(data) {
        if (sf.util.access(data) && data.content[0].value) {
          _.each(arr, function(value, key, list) {
            that.options.products.removeAttr(value);
          });
        }
      })
      .fail(function(data) {

      })
  },

  isOpenPay: function(products) {
    // 如果所有勾选都没有被选中，关上canGotoPay按钮
    var selectNone = _.reduce(products, function(memo, value, key, list) {
      return memo && !value.selected;
    }, true);



    if (selectNone) {
      this.options.attr('canGotoPay', 'disabled');
    } else {
      this.options.attr('canGotoPay', '');
    }
  },

  '.input_txt keyup': function(element, event) {
    var num = element.val();
    num = window.parseInt(num);
    if (!num || num < 1) {
      element.val(1)
    } else if (num > 2) {
      element.val(2)
    } else {
      element.val(num)
    }
  },

  /**
   * @description event:选中某一个商品
   * @param  {Dom} element 触发事件的元素
   * @param  {Event} event   事件对象
   */
  '.order-select-one click': function(element, event) {

    var products = this.options.products.attr();
    this.options.error.attr('errorMsg', null);

    // 确认
    // 1. 是不是所有的product都被选中
    // 2. 是不是没有任何的product被选中

    // 如果所有的选项都被选中了，那么打开支付按钮，同时把selectAll勾选
    var selectAll = _.reduce(products, function(memo, value, key, list) {
      return memo && value.selected;
    }, true);

    if (selectAll) {
      this.options.attr('selectAll', true);
    } else {
      this.options.attr('selectAll', false);
    }

    // 如果所有勾选都没有被选中，关上canGotoPay按钮
    this.isOpenPay(products);
  },

  '#order-goto-pay click': function(element, event) {
    event && event.preventDefault();
    var flag = false;
    var error = ''
    var products = this.options.products.attr();

    for(var p in products){
      var num = window.parseInt(products[p].num);

      if (!num || num < 0 || num > 2) {
        error = '每次只能购买2件商品';
        break;
      }

      if (products[p].selected && num > 0 && num < 3) {
        flag = true;
      }
    }

    if (flag) {
      can.route.attr('type', 'confirm');
    }else if(error){
      this.options.error.attr(error);
    }else{
      this.options.error.attr('errorMsg', '请选择需要结算的商品')
    }
  }

});