'use strict';

define(
  'sf.b2c.mall.component.shoppingcart', [
    'text',
    'can',
    'jquery',
    'underscore',
    'sf.b2c.mall.framework.comm',
    'sf.util',
    'sf.helpers',
    'sf.b2c.mall.business.config',
    'sf.b2c.mall.api.shopcart.getCart',
    'sf.b2c.mall.api.shopcart.refreshCart',
    'sf.b2c.mall.api.shopcart.removeItemsForCart',
    'sf.b2c.mall.api.shopcart.updateItemNumForCart',
    'sf.b2c.mall.api.product.findRecommendProducts',
    'sf.b2c.mall.widget.message',
    'sf.b2c.mall.api.shopcart.addItemsToCart',
    'sf.b2c.mall.api.shopcart.isShowCart',
    'text!template_component_shoppingcart'
  ],
  function(text, can, $, _, SFFrameworkComm, SFFn, helpers, SFBusiness, SFGetCart, SFRefreshCart, SFRemoveItemsInCart, SFUpdateItemNumInCart, SFFindRecommendProducts, SFMessage, SFAddItemToCart, SFIsShowCart, template_component_shoppingcart) {

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
        //是否为全选
        'sf-is-select-all': function(goods, options) {
          var isSelectedAll = true;
          _.each(goods, function(value, key, list) {
            _.each(value, function(item) {
              isSelectedAll = isSelectedAll && item.isSelected
            })

          });

          if (isSelectedAll) {
            return options.fn(options.contexts || this);
          } else {
            return options.inverse(options.contexts || this);
          }
        },
        //是否为搭配商品中的主商品
        'isTheMainProduct': function(index, options) {
          if (index == 0) {
            return options.fn(options.contexts || this);
          } else {
            return options.inverse(options.contexts || this);
          }
        },
        //搭配商品展示总价
        'totalPartScopePrice': function(goods, options) {
          var total = 0;
          _.each(goods, function(items) {
            total += items.perTotalPrice;
          });
          return total / 100;
        },
        //搭配商品总单价
        'partScopePrice': function(goods, options) {
          var total = 0;
          _.each(goods, function(items) {
            if (items.canUseActivityPrice == 1) {
              total += items.activityPrice;
            } else {
              total += items.price;
            }
          });
          return total / 100;
        },
        'sf-is-freepostage': function(order, options) {
          var cartFeeItem = order.cartFeeItem;
          if (cartFeeItem.reductPostageInfos !== 'undefined' && cartFeeItem.reductPostageInfos.length > 0) {
            var limit = cartFeeItem.reductPostageInfos[0].useRule.limit / 100;
            var actualTotalFee = cartFeeItem.actualTotalFee / 100;
            if (limit > actualTotalFee) {
              return options.fn(options.contexts || this);
            }
          } else {
            return options.inverse(options.contexts || this);
          }
        },
        'sf-left-freepostage': function(order, options) {
          var cartFeeItem = order.cartFeeItem,
            limit = cartFeeItem.reductPostageInfos[0].useRule.limit / 100,
            actualTotalFee = cartFeeItem.actualTotalFee / 100;
          return limit - actualTotalFee;

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
                } else {
                  window.location.href = 'index.html';
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
          window.location.href = 'index.html';
        }

      },

      /**
       * [render 渲染]
       */
      render: function(data) {
        var that = this;
        this.options.canOrder = this.btnStateMap[data.canOrder];
        this.options.partScopeGroups = [];
        this.options.singleScope = [];
        that.options.goodItemList = [];
        this.options.hasGoods = false;

        if (typeof data.scopeGroups != 'undefined' && data.scopeGroups.length > 0) {
          this.options.hasGoods = true;
          this.options.order = new can.Map({
            'cartFeeItem': data.cartFeeItem,
            'actualTotalFee': data.cartFeeItem.actualTotalFee,
            'discountFee': data.cartFeeItem.discountFee,
            'goodsTotalFee': data.cartFeeItem.goodsTotalFee,
            'limitAmount': data.limitAmount,
            'invalidItems': false
          });
          this.options.isShowOverLimitPrice = (data.errorCode === 15000600);
          this.options.isShowReduceInfos = (typeof data.cartFeeItem.reduceInfos[0] !== 'undefined' && data.cartFeeItem.reduceInfos[0].reducePrice !== 0 && this.options.isShowOverLimitPrice == false);
          if (typeof data.cartFeeItem.reduceInfos[0] !== 'undefined') {
            this.options.reduceInfos = data.cartFeeItem.reduceInfos;
          };

          //获取商品数据
          _.each(data.scopeGroups, function(cartItem) {
            if (cartItem.scope == 'SINGLE') {
              that.options.singleScope.push(cartItem);
            } else {
              that.options.partScopeGroups.push(cartItem);
            }
          });

          //遍历scope: "single"的商品数据
          _.each(this.options.singleScope, function(singleScope) {
            that.options.goodItemList.push(singleScope.goodItemList);
            _.each(singleScope.goodItemList, function(goodsItem) {
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
          })

          _.each(this.options.partScopeGroups, function(partItem) {

            that.options.goodItemList.push(partItem.goodItemList);
            //重组数据，把主商品放在第一位
            partItem.firstGoodItem = [];
            var found = _.find(partItem.goodItemList, function(goodsItem) {
              return goodsItem.itemId == goodsItem.mainItemId;
            });
            if (found) {
              partItem.goodItemList = _.reject(partItem.goodItemList, function(goodsItem) {
                return goodsItem.itemId == goodsItem.mainItemId;
              });
              partItem.goodItemList.splice(0, 0, found);
            }
            partItem.firstGoodItem.push(partItem.goodItemList[0]);
            _.each(partItem.goodItemList, function(goodsItem) {
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
          })


        }
        var renderFn = can.mustache(template_component_shoppingcart);
        var html = renderFn(that.options, that.helpers);
        that.element.html(html);
        //首单减促销信息展示
        var cartFeeItem = this.options.order.attr('cartFeeItem');
        if (typeof cartFeeItem.firstOrderInfos !== 'undefined' && cartFeeItem.firstOrderInfos.length > 0) {
          var useRuleDesc = cartFeeItem.firstOrderInfos[0].useRule.ruleDesc;
          var firstHtml = '<tr><td colspan="6"><span>首单减</span>' + useRuleDesc + '</td></tr>';
          $('.sign-for-first').append(firstHtml);
        };
        //满额包邮信息展示
        if (typeof cartFeeItem.reductPostageInfos !== 'undefined' && cartFeeItem.reductPostageInfos.length > 0) {
          var useRuleDesc = cartFeeItem.reductPostageInfos[0].useRule.ruleDesc,
            limit = cartFeeItem.reductPostageInfos[0].useRule.limit / 100,
            preferential = cartFeeItem.reductPostageInfos[0].useRule.preferential / 100,
            firstHtml = '';
          if (typeof useRuleDesc != 'undefined') {
            firstHtml = '<tr><td colspan="6">' + useRuleDesc + '</td></tr>';
          } else {
            firstHtml = '<tr><td colspan="6">全场满' + limit + '元即可减免' + preferential + '元运费</td></tr>';

          }
          $('.sign-for-freepostage').append(firstHtml);
        };
        //如果没有无效商品，不展示清除无效商品按钮
        var invalidItems = $('.items-disable').length;
        if (invalidItems) {
          this.options.order.attr('invalidItems', true);
        };

        var itemid = -1;
        if (data.scopeGroups && data.scopeGroups.length > 0 && data.scopeGroups[0].goodItemList) {
          itemid = data.scopeGroups[0].goodItemList[0].itemId;
        }

        that.renderRecommendGoods(itemid);
      },

      renderRecommendGoods: function(itemid) {
        var that = this;

        var findRecommendProducts = new SFFindRecommendProducts({
          'itemId': itemid,
          'size': 4
        });
        findRecommendProducts.sendRequest()
          .done(function(data) {
            if (data.value) {
              that.options.recommendGoods = data.value;
              _.each(that.options.recommendGoods, function(item, index) {
                item.linkUrl = "http://www.sfht.com/detail/" + item.itemId + ".html" + "?_spm=0.rec1109." + item.itemId + "." + (index + 1);
                item.imageName = item.imageName;
                item.sellingPrice = item.sellingPrice;
              });

              var recommendProductsTemplate = can.view.mustache(that.getRecommendGoodsHTML());
              $('#recommendproducts').html(recommendProductsTemplate(that.options, that.helpers));
            }

          })
          .fail(function(error) {
            //console.error(error);
          })
      },


      getRecommendGoodsHTML: function() {
        return '<div class="product">' +
          '<ul class="myorder-tab">' +
          '<li><a href="">大家都在买</a></li>' +
          '</ul>' +
          '<div class="mb">' +
          '<ul class="clearfix product-list">' +
          '{{#each recommendGoods}}' +
          '<li {{data "goods"}}>' +
          '<div class="product-r1">' +
          '<a href="{{linkUrl}}"><img src="{{sf.img imageName}}" alt="" ></a><span></span>' +
          '</div>' +
          '<h3><a href="{{linkUrl}}">{{productName}}</a></h3>' +
          '<div class="product-r2 clearfix">' +
          '<div class="product-r2c1 fl">' +
          '<span>￥</span><strong>{{sf.price sellingPrice}}</strong>' +
          '</div>' +
          '<div class="product-r2c2 fr"><a href="javascript:" class="icon icon90 addCart">购买</a></div>' +
          '</div>' +
          '</li>' +
          '{{/each}}' +
          '</ul>' +
          '</div>' +
          '</div>'
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
      updateItemNumInCart: function(itemId, num, mainItemId) {
        var that = this;
        var updateItemNumInCart = new SFUpdateItemNumInCart({
          itemId: itemId,
          num: num,
          mainItemId: mainItemId
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
        var itemStr = JSON.stringify(itemIds);
        var deleteorder = new SFRemoveItemsInCart({
          items: itemStr
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
          if (value.groupKey) {
            var obj = {
              itemId: value.itemId,
              isSelected: value.isSelected,
              mainItemId: value.groupKey
            };
          } else {
            var obj = {
              itemId: value.itemId,
              isSelected: value.isSelected
            };
          }

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
        var good = $(element).closest('tr').data('goods');
        if (good.groupKey) {
          var obj = {
            itemId: good.itemId,
            isSelected: $(element).attr('data-isSelected'),
            mainItemId: good.groupKey
          }
        } else {
          var obj = {
            itemId: good.itemId,
            isSelected: $(element).attr('data-isSelected')
          }
        }

        var result = [];
        result.push(obj);
        this.refreshCartList(result);
      },
      //删除单个商品
      '.deleteSingleOrder click': function(element, event) {
        event && event.preventDefault();
        var that = this;
        var itemIds = [];
        var good = $(element).closest('tr').data('goods');
        if (good.groupKey) {
          var obj = {
            itemId: good.itemId,
            mainItemId: good.groupKey
          };
          itemIds.push(obj);
        } else {
          var obj = {
            itemId: good.itemId
          };
          itemIds.push(obj);
        }

        if (itemIds.length > 0) {
          var message = new SFMessage(null, {
            'tip': '确认要删除该商品？',
            'type': 'confirm',
            'okFunction': _.bind(that.deleteCartOrder, that, itemIds)
          });
        }

      },
      //删除选中商品
      '#deletedSelectGoods click': function(element, event) {
        event && event.preventDefault();
        var that = this;
        var itemIds = [];
        _.each($("tr[data-isSelected='1']"), function(item) {
          var good = $(item).closest('tr').data('goods');
          if (good.groupKey) {
            var obj = {
              itemId: good.itemId,
              mainItemId: good.groupKey
            }
          } else {
            var obj = {
              itemId: good.itemId
            }
          }
          itemIds.push(obj);
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
        _.each($('.items-disable'), function(item) {
          var good = $(item).closest('tr').data('goods');
          if (good.groupKey) {
            var obj = {
              itemId: good.itemId,
              mainItemId: good.groupKey
            }
          } else {
            var obj = {
              itemId: good.itemId
            }
          }
          itemIds.push(obj);
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
        var good = $(element).closest('tr').data('goods');

        var itemId = good.itemId;
        var limitQuantity = good.limitQuantity;
        var mainItemId = good.groupKey || '';
        //var stock =
        if (num >= limitQuantity) {
          $(element).siblings('input').val(limitQuantity);
          return false;
        } else {
          clearTimeout(handler);
          handler = null;
          $(element).siblings('input').val(num + 1);

          handler = setTimeout(function() {
            that.updateItemNumInCart(itemId, parseInt($(element).siblings('input').val()), mainItemId);
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
        var good = $(element).closest('tr').data('goods');
        var itemId = good.itemId;
        var limitQuantity = good.limitQuantity;
        var mainItemId = good.groupKey || '';
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
            that.updateItemNumInCart(itemId, parseInt($(element).siblings('input').val()), mainItemId);
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
        var good = $(element).closest('tr').data('goods');
        var itemId = good.itemId;
        var limitQuantity = good.limitQuantity;
        var mainItemId = good.groupKey || '';
        if (amount < 0 || isNaN(amount) || amount == '') {
          $(element).val(1);
          return false;
        } else if (amount >= limitQuantity) {
          $(element).val(limitQuantity);
          this.updateItemNumInCart(itemId, parseInt($(element).val()), mainItemId);
        } else {
          this.updateItemNumInCart(itemId, parseInt($(element).val()), mainItemId);
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
            if (data.isSuccess) {
              // 更新mini购物车
              can.trigger(window, 'updateCart');
              window.location.reload();
            } else {
              var $el = $('<div class="dialog-cart" style="z-index:9999;"><div class="dialog-cart-inner" style="width:242px;padding:20px 60px;"><p style="margin-bottom:10px;">' + data.resultMsg + '</p></div><a href="javascript:" class="icon icon108 closeDialog">关闭</a></div>');
              if ($('.dialog-cart').length > 0) {
                return false;
              };
              $(document.body).append($el);
              $('.closeDialog').click(function(event) {
                $el.remove();
              });
              setTimeout(function() {
                $el.remove();
              }, 3000);
            }
          })
          .fail(function(data) {})
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
        window.location.href = 'order.html?from=shoppingcart';
        // window.location.replace('order.html');
      }

    });

  })