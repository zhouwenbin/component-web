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
    'sf.b2c.mall.widget.message',
    'sf.b2c.mall.api.shopcart.addItemToCart',
    'sf.b2c.mall.api.shopcart.isShowCart'
  ],
  function(can, $, _, SFFrameworkComm, SFFn, helpers, SFBusiness, SFGetCart, SFRefreshCart, SFRemoveItemsInCart, SFUpdateItemNumInCart, SFFindRecommendProducts, SFMessage, SFAddItemToCart, SFIsShowCart) {

    SFFrameworkComm.register(1);
    SFFn.monitor();
    var handler = null;
    return can.Control.extend({

      helpers: {
        //获取第一张图片
        firstimages: function(images, options) {
          if (typeof images !== 'undefined') {
            return images[0];
          };
        },
        //去结算按钮是否可操作
        isShowBtn: function(canOrder, options) {
          if (canOrder === 0) {
            return options.fn(options.context || this);
          };
        },
        //单选框是否选中
        isChecked: function(isSelected, options) {
          if (isSelected === 1) {
            return options.fn(options.context || this);
          };
        },
        //加号是否可点击
        isShowDisable: function(canAddNum, options) {
          if (canAddNum === 0) {
            return options.fn(options.context || this);
          };
        },
        //是否显示原价
        isShowOriginPrice: function(price, activityPrice, canUseActivityPrice, options) {
          if (canUseActivityPrice == 1) {
            if ((price !== activityPrice && price > activityPrice) || canUseActivityPrice == 0) {
              return options.fn(options.context || this);
            };
          } else {
            return options.inverse(options.contexts || this);
          }

        },
        // 0 不能使用activityPrice，1可以使用
        isShowActivityPrice: function(canUseActivityPrice, options) {
          if (canUseActivityPrice == 1) {
            return options.fn(options.context || this);
          } else {
            return options.inverse(options.contexts || this);
          }
        },
        //展示参加了几个满减活动
        countNumActivity: function(reduceInfos, options) {
          if (reduceInfos.length > 0) {
            return reduceInfos.length;
          };
        },

        'sf-is-select-all': function(goods, options) {
          var isSelectedAll = true;
          _.each(goods, function(value, key, list) {
            isSelectedAll = isSelectedAll && value.isSelected
          });

          if (isSelectedAll) {
            return options.fn(options.contexts || this);
          } else {
            return options.inverse(options.contexts || this);
          }
        }
      },
      /**
       * [init 初始化]
       */
      init: function() {
        var that = this;
        if (SFFrameworkComm.prototype.checkUserLogin.call(this)) {
          // 从cookie中获得值确认购物车是不是显示
          var uinfo = $.cookie('1_uinfo');
          var arr = [];
          if (uinfo) {
            arr = uinfo.split(',');
          }
          // 判断纬度，用户>总开关
          // 第四位标示是否能够展示购物车
          // 0表示听从总开关的，1表示显示，2表示不显示
          var flag = arr[4];

          // 如果判断开关关闭，使用dom操作不显示购物车
          if (typeof flag == 'undefined' || flag == '2') {

          } else if (flag == '0') {
            // @todo 请求总开关进行判断
            var isShowCart = new SFIsShowCart();
            isShowCart
              .sendRequest()
              .done(function(info) {
                if (info.value) {
                  var getCart = new SFGetCart();
                  getCart.sendRequest()
                    .done(function(data) {
                      that.render(data);
                    }).fail(function() {

                    })
                }
              })
              .fail(function() {

              })
          } else {
            var getCart = new SFGetCart();
            getCart.sendRequest()
              .done(function(data) {
                that.render(data);
              }).fail(function() {

              })
          }
        } else {
          window.location.href = 'www.sfht.com';
        }

      },

      /**
       * [render 渲染]
       */
      render: function(data) {
        var that = this;
        this.options.canOrder = this.btnStateMap[data.canOrder];
        this.options.scopeGroups = data.scopeGroups;
        if (data.scopeGroups.length > 0) {
          this.options.hasGoods = true;
          this.options.goodItemList = [];
          this.options.order = new can.Map({});
          this.options.order.attr({
            'actualTotalFee': data.cartFeeItem.actualTotalFee,
            'discountFee': data.cartFeeItem.discountFee,
            'goodsTotalFee': data.cartFeeItem.goodsTotalFee,
            'limitAmount': data.limitAmount,
            'invalidItems': false
          });
          this.options.isShowOverLimitPrice = (data.errorCode === 15000600);
          this.options.isShowReduceInfos = (typeof data.cartFeeItem.reduceInfos[0] !== 'undefined' && data.cartFeeItem.reduceInfos[0].reducePrice !== 0);
          if (typeof data.cartFeeItem.reduceInfos[0] !== 'undefined') {
            this.options.reduceInfos = data.cartFeeItem.reduceInfos;
          };

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
            if (typeof goodsItem.promotionInfo !== 'undefined' && goodsItem.promotionInfo.promotionList.length > 0) {
              goodsItem.isDiscount = (goodsItem.promotionInfo.promotionList[0].type === 'DISCOUNT');
              goodsItem.isFlash = (goodsItem.promotionInfo.promotionList[0].type === 'FLASH');
              goodsItem.discountInfo = goodsItem.promotionInfo.promotionList[0].useRuleDesc;

              var promotionInfoArray = new Array();
              //便利满件折促销信息
              _.each(goodsItem.promotionInfo.promotionList, function(promotionItem) {
                _.each(promotionItem.promotionRuleList, function(item) {
                  promotionInfoArray.push('再买1件,打' + item.preferential / 10 + '折');
                });
              });

              var quantity = goodsItem.quantity;
              if (promotionInfoArray.length > quantity) {
                goodsItem.otherDiscountInfo = promotionInfoArray[quantity];
              }
            }
          });

          var html = can.view('templates/component/sf.b2c.mall.component.shoppingcart.mustache', this.options, this.helpers);
          that.element.html(html);
          var invalidItems = $('.cart-disable').length;
          if (invalidItems) {
            this.options.order.attr('invalidItems', true);
          };
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
                item.imageName = item.imageName;
                item.sellingPrice = item.sellingPrice;
              });

              var html = can.view('templates/component/sf.b2c.mall.component.shoppingcart.mustache', that.options, that.helpers);
              that.element.html(html);
            })
        }

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
        itemIds.push($(element).closest('tr').data('goods').itemId);
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
        var that = this;
        if ($(element).hasClass('disable')) {
          return false;
        };
        var num = parseInt($(element).siblings('input').val());
        var itemId = $(element).closest('tr').data('goods').itemId;
        var limitQuantity = $(element).closest('tr').data('goods').limitQuantity;
        //var stock =
        if (num >= limitQuantity) {
          $(element).siblings('input').val(limitQuantity);
          return false;
        } else {
          clearTimeout(handler);
          handler = null;
          $(element).siblings('input').val(num + 1);
          handler = setTimeout(function() {
            that.updateItemNumInCart(itemId, parseInt($(element).siblings('input').val()));
          }, 300);

        }
      },

      /**
       * 减少商品数量
       */
      '.btn-num-reduce click': function(element, event) {
        event && event.preventDefault();
        var that = this;
        if ($(element).hasClass('disable')) {
          return false;
        };
        var num = parseInt($(element).siblings('input').val());
        var itemId = $(element).closest('tr').data('goods').itemId;
        var limitQuantity = $(element).closest('tr').data('goods').limitQuantity;
        if (num <= 1) {
          $(element).siblings('input').val(1);
          $(element).addClass('disable');
        } else {
          $(element).removeClass('disable');
          //设置一个全局句柄变量，每次点击的时候清除句柄，数量加减1，然后300ms后发起请求
          clearTimeout(handler);
          handler = null;
          $(element).siblings('input').val(num - 1);
          handler = setTimeout(function() {
            that.updateItemNumInCart(itemId, parseInt($(element).siblings('input').val()));
          }, 300);
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
        if (amount < 0 || isNaN(amount) || amount == '') {
          $(element).val(1);
          return false;
        } else if (amount >= limitQuantity) {
          $(element).val(limitQuantity);
          this.updateItemNumInCart(itemId, parseInt($(element).val()));
        } else {
          this.updateItemNumInCart(itemId, parseInt($(element).val()));
        }

      },
      //购物车内无商品是，推荐商品加入购物车
      addCart: function(itemId, num) {
        var that = this;
        var itemsStr = JSON.stringify([{
          itemId: itemId,
          num: num || 1
        }]);
        var addItemToCart = new SFAddItemToCart({
          items: itemsStr
        });

        // 添加购物车发送请求
        addItemToCart.sendRequest()
          .done(function(data) {
            if (data.value) {
              // 更新mini购物车
              can.trigger(window, 'updateCart');
              window.location.reload();
            }
          })
          .fail(function(data) {
            if (data == 15000800) {
              var $el = $('<div class="dialog-cart"><div class="dialog-cart-inner">您的购物车已满</div></div>');
              $(document.body).append($el)
              setTimeout(function() {
                $el.remove();
              }, 1000);
            }
          })
      },
      '.addCart click': function(element, event) {
        event && event.preventDefault();
        var itemId = $(element).closest('li').data('goods').itemId;
        this.addCart(itemId);
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