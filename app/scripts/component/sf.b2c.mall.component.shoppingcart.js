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
    'sf.b2c.mall.api.product.findRecommendProducts',
    'sf.b2c.mall.widget.message'
  ],
  function(can, $, _, SFFrameworkComm, SFFn, helpers, SFBusiness, SFGetCart, SFRefreshCart, SFRemoveItemsInCart, SFUpdateItemNumInCart, SFFindRecommendProducts, SFMessage) {

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
        console.log(data.scopeGroups);
        if (data.scopeGroups.length > 0) {
          this.options.hasGoods = true;
          this.options.goodItemList = [];
          this.options.order = new can.Map({});
          this.options.order.attr({
            'actualTotalFee': data.cartFeeItem.actualTotalFee,
            'discountFee': data.cartFeeItem.discountFee,
            'goodsTotalFee': data.cartFeeItem.goodsTotalFee,
            'limitAmount': data.limitAmount
          });
          this.options.isShowOverLimitPrice = (data.errorCode === 15000600);
          //获取商品数据
          _.each(this.options.scopeGroups, function(cartItem) {
            //是否显示满件        
            that.options.goodItemList.push(cartItem.goodItemList[0]);
          });

          _.each(that.options.goodItemList, function(goodsItem) {
            var result = new Array();
            _.each(goodsItem.specs, function(item) {
              result.push(item.specName + ":" + item.value);
            });
            goodsItem.specs = result.join('&nbsp;/&nbsp;');
            if (typeof goodsItem.promotionInfo !== 'undefined') {
              goodsItem.isDiscount = (goodsItem.promotionInfo.promotionList[0].type === 'DISCOUNT');
              goodsItem.isFlash = (goodsItem.promotionInfo.promotionList[0].type === 'FLASH');
            };

          });
        } else {
          this.options.hasGoods = false;
          var findRecommendProducts = new SFFindRecommendProducts({
            'itemId': -1,
            'size': 4
          });
          findRecommendProducts.sendRequest()
            .fail(function(error) {
              //console.error(error);
            })
            .done(function(data) {
              that.options.recommendGoods = data.value;
              _.each(that.options.recommendGoods, function(item) {
                item.linkUrl = that.detailUrl + "/" + item.itemId + ".html";
                item.imageName = item.imageName + "@102h_102w_80Q_1x.jpg";
                item.sellingPrice = item.sellingPrice / 100;
              });
            })
        }
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
      refreshCartList: function(listItem) {
        var that = this;
        var goodsStr = JSON.stringify(listItem);
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
      '.selectAll click': function(element, options) {

        var array = new Array();
        var isSelectedAll = true;
        $('.sfcheckbox').each(function(index, element) {
          var good = $(element).closest('tr').data('goods');
          isSelectedAll = isSelectedAll && good.isSelected;
          array.push(good);
        });

        if (isSelectedAll) {
          _.each(array, function(item, index) {
            array[index].isSelected = 0;
          });
        } else {
          _.each(array, function(item, index) {
            array[index].isSelected = 1;
          });
        }
        var result = [];
        _.each(array, function(value, i) {
          var obj = {
            itemId: value.itemId,
            isSelected: value.isSelected
          };
          result.push(obj);

        });
        this.refreshCartList(result);
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
        var obj = {
          itemId: $(element).closest('tr').data('goods').itemId,
          isSelected: $(element).attr('data-isSelected')
        };
        var result = [];
        result.push(obj);
        this.refreshCartList(result);
      },
      //删除单个商品
      '.deleteSingleOrder click': function(element, event) {
        event && event.preventDefault();
        var that = this;
        var itemIds = [];
        itemIds.push($(item).data('goods').itemId);
        if (itemIds.length > 0) {
          var message = new SFMessage(null, {
            'tip': '确认要删除该商品？',
            'type': 'confirm',
            'okFunction': _.bind(that.deleteCartOrder, that, itemIds)
          });
        };

      },
      //删除选中商品
      '#deletedSelectGoods click': function(element, event) {
        event && event.preventDefault();
        var that = this;
        var itemIds = [];
        _.each($("tr[data-isSelected='1']"), function(item) {
          itemIds.push($(item).data('goods').itemId);
        });
        if (itemIds.length > 0) {
          var message = new SFMessage(null, {
            'tip': '确认要删除选中商品？',
            'type': 'confirm',
            'okFunction': _.bind(that.deleteCartOrder, that, itemIds)
          });
        }

      },
      //清除购物车内无效商品
      '#cleanInvalidItemsInCart click': function(element, event) {
        event && event.preventDefault();
        var itemIds = [];
        _.each($('.cart-disable'), function(item) {
          itemIds.push($(item).data('goods').itemId);
        });
        if (itemIds.length > 0) {
          this.deleteCartOrder(itemIds);
        };

      },
      /**
       * 增加商品数量
       */
      '.btn-num-add click': function(element, event) {
        event && event.preventDefault();
        var num = parseInt($(element).siblings('input').val());
        var itemId = $(element).closest('tr').data('goods').itemId;
        var limitQuantity = $(element).closest('tr').data('goods').limitQuantity;
        if (num >= limitQuantity) {
          $(element).siblings('input').val(limitQuantity);
          return false;
        } else {
          $(element).siblings('input').val(num + 1);
          this.updateItemNumInCart(itemId, parseInt($(element).siblings('input').val()));
        }
      },

      /**
       * 减少商品数量
       */
      '.btn-num-reduce click': function(element, event) {
        event && event.preventDefault();
        var num = parseInt($(element).siblings('input').val());
        var itemId = $(element).closest('tr').data('goods').itemId;
        var limitQuantity = $(element).closest('tr').data('goods').limitQuantity;
        if (num <= 1) {
          $(element).siblings('input').val(1);
          $(element).addClass('disable');
        } else {
          $(element).removeClass('disable');
          $(element).siblings('input').val(num - 1);
          this.updateItemNumInCart(itemId, parseInt($(element).siblings('input').val()));
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
        var itemId = $(element).closest('tr').data('goods').itemId;
        var limitQuantity = $(element).closest('tr').data('goods').limitQuantity;
        if (amount < 0 || isNaN(amount)) {
          $(element).val(1);
          return false;
        } else if (amount >= limitQuantity) {
          $(element).val(limitQuantity);
          this.updateItemNumInCart(itemId, parseInt($(element).val()));
        } else {
          this.updateItemNumInCart(itemId, parseInt($(element).val()));
        }

      },

      /**
       * 去结算
       */
      '#gotopay click': function(element, event) {
        event && event.preventDefault();
        if ($(element).hasClass('btn-disable')) {
          return false;
        };
        window.location.href = 'order.html';
      }

    });

  })