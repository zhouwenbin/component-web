'use strict';

define(
  'sf.b2c.mall.component.shoppingcart', [
    'can',
    'jquery',
    'underscore',
    'sf.b2c.mall.framework.comm',
    'sf.util',
    'sf.helpers',
    'sf.b2c.mall.business.config',
    'sf.b2c.mall.api.shopcart.getCart',
    'sf.b2c.mall.api.shopcart.refreshCart',
    'sf.b2c.mall.api.shopcart.removeItemsInCart',
    'sf.b2c.mall.api.shopcart.updateItemNumInCart',
    'sf.b2c.mall.widget.message'
  ],
  function(can, $, _, SFFrameworkComm, SFFn, helpers, SFBusiness, SFGetCart, SFRefreshCart, SFRemoveItemsInCart, SFUpdateItemNumInCart, SFMessage) {

    SFFrameworkComm.register(1);
    SFFn.monitor();
    return can.Control.extend({

      helpers: {
        firstimages: function(images, options) {
          return images[0];
        },
        isShowBtn: function(canOrder, options) {
          if (canOrder === 0) {
            return options.fn(options.context || this);
          };
        },
        isChecked: function(isSelected, options) {
          if (isSelected === 1) {
            return options.fn(options.context || this);
          };
        }
      },
      /**
       * [init 初始化]
       */
      init: function() {
        this.render();
      },

      /**
       * [render 渲染]
       */
      render: function(element, options) {
        var that = this;
        var getCart = new SFGetCart();
        getCart.sendRequest()
          .done(function(data) {
            that.options.canOrder = that.btnStateMap[data.canOrder];
            that.options.scopeGroups = data.scopeGroups;
            that.options.goodItemList = [];
            _.each(that.options.scopeGroups, function(cartItem, i) {
              //是否显示活动信息
              cartItem.isHasActivity = (typeof cartItem.promotionInfo !== 'undefined');
              that.options.goodItemList.push(cartItem.goodItemList[0]);
            });
            var html = can.view('templates/component/sf.b2c.mall.component.shoppingcart.mustache', that.options, that.helpers);
            that.element.html(html);

          }).fail(function() {

          })
      },
      //按钮状态
      btnStateMap: {
        '1': 'btn-danger',
        '0': 'btn-disable'
      },
      /**
       * 重新渲染购物车页面
       */
      refreshCartList: function(isSelected, itemId) {
        var that = this;
        var refreshCart = new SFRefreshCart({
          isSelected: isSelected,
          itemId: itemId
        });
        refreshCart.sendRequest()
          .done(function(data) {
            that.render();
          }).fail(function() {

          })

      },
      '.selectAll change': function(element, event) {

      },
      /**
       * 全选
       */
      selectAll: function() {

      },

      /**
       * 单选
       */
      '.sfcheckbox change': function(element, options) {
        var isSelected = $(element).data('goodItemList').isSelected;
        var itemId = $(element).data('goodItemList').itemId;
        this.refreshCartList(isSelected,itemId);
      },
      //删除单个商品
      '.deleteSingleOrder click': function(element, event) {
        event && event.preventDefault();
        var that = this;
        var itemIds = [];
        itemIds.push($(element).attr('data-itemIds'));
        var message = new SFMessage(null, {
          'tip': '确认要删除该商品？',
          'type': 'confirm',
          'okFunction': _.bind(that.deleteCartOrder, that, itemIds)
        });
      },
      //删除选中商品
      '#deletedSelectGoods click': function(element, event) {
        event && event.preventDefault();
        var that = this;


      },
      //清除购物车内无效商品
      '#cleanInvalidItemsInCart click': function(element, event) {
        event && event.preventDefault();
        var itemIds = [];
        itemIds.push($('.cart-disable').attr('data-itemIds'));
        this.deleteCartOrder(itemIds);
      },
      /**
       * 删除单个商品或选中商品
       */
      deleteCartOrder: function(itemIds) {
        var that = this;
        var deleteorder = new SFRemoveItemsInCart({
          itemIds: itemIds
        });
        deleteorder.sendRequest()
          .done(function(data) {
            that.render();
          }).fail(function() {

          })
      },

      /**
       * 增加商品数量
       */
      '.btn-num-add click': function(element, event) {
        event && event.preventDefault();
        var num = parseInt($(element).siblings('input').val());
        var limitQuantity = $(element).data('limitQuantity').limitQuantity;
        var itemId = $(element).data('limitQuantity').itemId;
        if (limitQuantity > 0 && num > limitQuantity - 1) {
          $(element).closest('div').siblings('p').removeClass('visuallyhidden');
          $(element).addClass('disable');
        } else {
          $(element).siblings('.btn-num-reduce').removeClass('disable');
          $(element).removeClass('disable');
          $(element).siblings('input').val(num + 1);
          this.updateItemNumInCart(itemId,num);
        }
      },

      /**
       * 减少商品数量
       */
      '.btn-num-reduce click': function(element, event) {
        event && event.preventDefault();
        var num = parseInt($(element).siblings('input').val());
        var limitQuantity = $(element).data('limitQuantity').limitQuantity;
        $(element).closest('div').siblings('p').addClass('visuallyhidden');
        var itemId = $(element).data('limitQuantity').itemId;
        if (num <= 1) {
          $(element).siblings('input').val(1);
          $(element).addClass('disable');
        } else {
          $(element).siblings('.btn-num-add').removeClass('disable');
          $(element).removeClass('disable');
          $(element).siblings('input').val(num - 1);
          this.updateItemNumInCart(itemId,num);
        }

      },
      '.num-input blur': function(element, event) {
        event && event.preventDefault();
        this.inputBuyNum(element);
        return false;
      },
      '.num-input keyup': function(element, event) {
        event && event.preventDefault();
        this.inputBuyNum(element);
        return false;
      },
      //手工输入商品数量
      inputBuyNum: function(element, options) {
        var amount = $(element).val();
        //var limitQuantity = $(element).closest('div').siblings('')
        if (amount < 0 || isNaN(amount)) {
          $(element).val(1);
        };

      },
      updateItemNumInCart:function(itemId,num){
        var that = this;
        var updateItemNumInCart = new SFUpdateItemNumInCart({
          itemId:itemId,
          num:num
        });
        updateItemNumInCart.sendRequest()
          .done(function(data){

          })
      },
      /**
       * 去结算
       */
      '#gotopay click': function(element, event) {
        event && event.preventDefault();

      }

    });

  })