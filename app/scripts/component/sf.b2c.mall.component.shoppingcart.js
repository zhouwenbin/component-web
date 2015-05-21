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
          if (typeof images !== 'undefined') {
            return images[0];
          };

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
        },
        isShowDisable: function(canAddNum, options) {
          if (canAddNum === 0) {
            return options.fn(options.context || this);
          };
        }
      },
      /**
       * [init 初始化]
       */
      init: function() {
        var that = this;
        var getCart = new SFGetCart();
        getCart.sendRequest()
          .done(function(data) {
            that.render(data);
          }).fail(function() {

          })

      },

      /**
       * [render 渲染]
       */
      render: function(data) {
        var that = this;
        this.options.canOrder = this.btnStateMap[data.canOrder];
        this.options.scopeGroups = data.scopeGroups;
        this.options.goodItemList = [];
        this.options.order = new can.Map({});
        this.options.order.attr('actualTotalFee', data.cartFeeItem.actualTotalFee);
        this.options.order.attr('discountFee', data.cartFeeItem.discountFee);
        this.options.order.attr('goodsTotalFee', data.cartFeeItem.goodsTotalFee);
        this.options.isShowOverLimitPrice = (this.options.order.attr('actualTotalFee') > 100000);
        _.each(this.options.scopeGroups, function(cartItem, i) {
          //是否显示活动信息
          cartItem.isHasActivity = (typeof cartItem.promotionInfo !== 'undefined');
          //展示商品规格
          var result = new Array();
          _.each(cartItem.goodItemList[0].specs, function(item) {
            result.push(item.specName + ":" + item.value);
          });
          
          cartItem.specs = result.join('&nbsp;/&nbsp;');
          that.options.goodItemList.push(cartItem.goodItemList[0]);
        });
        var html = can.view('templates/component/sf.b2c.mall.component.shoppingcart.mustache', this.options, this.helpers);
        that.element.html(html);
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
        var goodsStr = JSON.stringify([{
          isSelected: isSelected,
          itemId: itemId
        }]);
        var refreshCart = new SFRefreshCart({
          goods: goodsStr
        });
        refreshCart.sendRequest()
          .done(function(data) {
            that.render(data);
          }).fail(function() {

          })

      },
      // 更新购物车商品数量
      updateItemNumInCart: function(itemId, num) {
        var that = this;
        var updateItemNumInCart = new SFUpdateItemNumInCart({
          itemId: itemId,
          num: num
        });
        updateItemNumInCart.sendRequest()
          .done(function(data) {
            that.render(data);
          })
      },
      /**
       * 删除单个商品或选中商品
       */
      deleteCartOrder: function(itemIds) {
        var that = this;
        var deleteorder = new SFRemoveItemsInCart({
          itemIds: JSON.stringify(itemIds)
        });
        deleteorder.sendRequest()
          .done(function(data) {
            that.render(data);
          }).fail(function() {

          })
      },
      /**
       * 全选
       */
      '.selectAll change': function(element, options) {
       
        if ($(element)[0].checked) {
          $(".sfcheckbox:checkbox").each(function() {
            $(this).attr("checked", true);
          })
        } else {
          $(".sfcheckbox:checkbox").each(function() {
            $(this).attr("checked", false);
          })
        }

      },

      /**
       * 单选
       */
      '.sfcheckbox change': function(element, options) {
        var isSelected = $(element).attr('data-isSelected');
        if (isSelected == "1") {
          $(element).attr('data-isSelected', 0);
        } else {
          $(element).attr('data-isSelected', 1);
        }
        var itemId = $(element).closest('tr').attr('data-itemIds');
        this.refreshCartList($(element).attr('data-isSelected'), itemId);
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
        var itemIds = [];
        _.each($('tr[data-isSelected="1"]'), function(item) {
          itemIds.push($(item).attr('data-itemIds'));
        })

        var message = new SFMessage(null, {
          'tip': '确认要删除选中商品？',
          'type': 'confirm',
          'okFunction': _.bind(that.deleteCartOrder, that, itemIds)
        });
      },
      //清除购物车内无效商品
      '#cleanInvalidItemsInCart click': function(element, event) {
        event && event.preventDefault();
        var itemIds = [];
        _.each($('.cart-disable'), function(item) {
          itemIds.push(item.attr('data-itemIds'));
        });
        this.deleteCartOrder(itemIds);
      },


      /**
       * 增加商品数量
       */
      '.btn-num-add click': function(element, event) {
        event && event.preventDefault();
        var num = parseInt($(element).siblings('input').val());
        var itemId = $(element).closest('tr').attr('data-itemIds');
        
        $(element).siblings('input').val(num + 1);
        this.updateItemNumInCart(itemId, parseInt($(element).siblings('input').val()));
      },

      /**
       * 减少商品数量
       */
      '.btn-num-reduce click': function(element, event) {
        event && event.preventDefault();
        var num = parseInt($(element).siblings('input').val());
        var limitQuantity = $(element).data('limitQuantity').limitQuantity;
        $(element).closest('div').siblings('p').addClass('visuallyhidden');
        var itemId = $(element).closest('tr').attr('data-itemIds');
        if (num <= 1) {
          $(element).siblings('input').val(1);
          $(element).addClass('disable');
        } else {
          $(element).siblings('.btn-num-add').removeClass('disable');
          $(element).removeClass('disable');
          $(element).siblings('input').val(num - 1);
          this.updateItemNumInCart(itemId, parseInt($(element).siblings('input').val()));
        }

      },
      '.num-input blur': function(element, event) {
        event && event.preventDefault();
        this.inputBuyNum(element);
        var itemId = $(element).closest('tr').attr('data-itemIds');
        this.updateItemNumInCart(itemId, parseInt($(element).val()));
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
        if (amount < 0 || isNaN(amount)) {
          $(element).val(1);
        };

      },

      /**
       * 去结算
       */
      '#gotopay click': function(element, event) {
        event && event.preventDefault();
        window.location.href = 'order.html';
      }

    });

  })