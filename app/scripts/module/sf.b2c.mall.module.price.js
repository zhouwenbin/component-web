define(
  'sf.b2c.mall.module.price', [
    'can',
    'underscore',
    'store',
    'sf.b2c.mall.api.b2cmall.getProductHotDataList',
    'sf.b2c.mall.api.shopcart.addItemsToCart',
    'sf.b2c.mall.api.shopcart.isShowCart',
    'sf.b2c.mall.business.config',
    'sf.b2c.mall.framework.comm'
  ],

  function(can, _, store, SFGetProductHotDataList, SFAddItemToCart, SFIsShowCart, SFConfig, SFFrameworkComm) {

    SFFrameworkComm.register(1);

    var price = can.Control.extend({

      init: function(element, options) {
        this.render(element);
      },

      render: function(element) {

        var that = this;

        var itemIds = this.getItemList();

        // 如果不存在itemid 直接返回
        if (!_.isArray(itemIds) || itemIds.length <= 0) {
          return false;
        }

        // 渲染
        can.when(this.requestItemHotDataList(itemIds))
          .done(function(data) {

            // 如渲染价格
            that.renderPrice(data, element);
            that.checkCartIsShown.call(that, data, element);

          })
          .fail(function(errorCode) {
            console.error(errorCode);
          })
      },

      checkCartIsShown: function(data, element) {

        var that = this;
        if (SFFrameworkComm.prototype.checkUserLogin.call(this)) {
          // 从cookie中获得值确认购物车是不是显示
          var uinfo = $.cookie('1_uinfo');
          var arr = [];
          if (uinfo) {
            arr = uinfo.split(',');
          }

          // 判断纬度，用户>总开关
          //
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
                  that.paintCart.call(that, data, element);
                }
              })
              .fail(function() {

              })
          } else {
            this.paintCart.call(this, data, element);
          }
        } else {
          var isShowCart = new SFIsShowCart();

          isShowCart
            .sendRequest()
            .done(function(info) {
              if (info.value) {
                that.paintCart.call(that, data, element);
              }
            })
            .fail(function() {

            })
        }
      },

      /**
       * [renderPrice 渲染价格]
       * @param  {[type]} data [description]
       * @return {[type]}      [description]
       */
      renderPrice: function(data, element) {
        var that = this;

        _.each(data.value, function(value, key, list) {

          // 填充价格
          var $el = element.find('[data-cms-itemid=' + value.itemId + ']');

          // 如果有重复的itemid，则进行容错
          if ($el.length && $el.length > 1) {
            _.each($el, function(item) {
              that.fillPrice($(item), value);
            })
          } else {
            that.fillPrice($el, value);
          }

        });
      },

      /**
       * @author Michael.Lee
       * @description 加入购物车
       */
      addCart: function(itemId, num, $el) {
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

              if ($(window).scrollTop() > 166) {
                var target = $('.nav .icon100').eq(1).offset()
              } else {
                var target = $('.nav .icon100').eq(0).offset()
              }

              var targetX = target.left,
                targetY = target.top,
                current = $el.offset(),
                currentX = current.left,
                currentY = current.top,
                cart_num = $('.cart-num').eq(0).text();

              $el.clone().appendTo($el.parent());
              $el.css({
                zIndex: 2,
                left: targetX - currentX,
                top: targetY - currentY,
                visibility: 'hidden'
              });

              cart_num++;
              $('.cart-num').text(cart_num);
              $('.nav .label-error').addClass('active');

              setTimeout(function() {
                $('.nav .label-error').removeClass('active');
              }, 500);
            } else {
              var $el = $('<div class="dialog-cart"><div class="dialog-cart-inner">' + data.resultMsg + '</div></div>');
              $(document.body).append($el)
              setTimeout(function() {
                $el.remove();
              }, 1000);
            }


          })
          .fail(function(data) {

          })
      },

      /**
       * @author Michael.Lee
       * @description 添加购物车动作触发
       * @param  {element} el
       */
      '.addtocart click': function(el, event) {
        event && event.preventDefault();

        var itemId = el.closest('.cms-src-item').attr('data-cms-itemid');
        if (SFFrameworkComm.prototype.checkUserLogin.call(this)) {
          // 用户如果如果登录
          this.addCart(itemId, 1, el);
        } else {
          store.set('temp-action-addCart', {
            itemId: itemId
          });
          can.trigger(window, 'showLogin', [window.location.href]);
        }
      },

      /**
       * [fillPrice 填充价格]
       * @param  {[type]} element [description]
       * @param  {[type]} value   [description]
       * @return {[type]}         [description]
       */
      fillPrice: function(element, value) {
        // 售价
        element.find('.cms-fill-price').text(value.sellingPrice / 100);

        // 如果原价低于卖价，则不展示折扣和原价
        if (value.sellingPrice >= value.referencePrice) {
          element.find('.cms-fill-discountparent')[0].style.display = "none";
          element.find('.cms-fill-referencepriceparent')[0].style.display = "none";
        } else {
          element.find('.cms-fill-referenceprice').text(value.referencePrice / 100);
          element.find('.cms-fill-discount').text((parseInt(value.sellingPrice, 10) * 10 / parseInt(value.referencePrice, 10)).toFixed(1));
        }

        // 做售空处理
        if (value.soldOut) {
          element.find('.cms-fill-gotobuy').addClass('disable').text('已经抢光');
          element.find('.product-r1').append('<div class="mask show"></div>');
          element.find('.product-r1').append('<span class="icon icon24"></span>');
        }


        // 促销活动 暂时不显示
        /*
        if (value.activityTypeDescList && value.activityTypeDescList.length > 0) {
          if (value.activityTypeDescList.length == 1) {
            element.find('.cms-fill-activitytype').text(value.activityTypeDescList[0].substr(0, 10));
          } else if (value.activityTypeDescList.length == 2) {
            element.find('.cms-fill-activitytype').text(value.activityTypeDescList[0].substr(0, 4)
              + "  " + value.activityTypeDescList[1].substr(0, 4));
          } else if (value.activityTypeDescList.length > 2){
            var typeDess = "";
            _.each(value.activityTypeDescLis, function(value, key, list) {
              typeDess += value.substr(0, 4) + " ";
            });
            element.find('.cms-fill-activitytype').text(typeDess)
          }

          element.find('.cms-fill-discountparent')[0].style.display = "none";
        }
        */
      },

      /**
       * @author Michael.Lee
       * @param  {element} element 添加购物车的容器
       * @param  {json} value   数据
       * @return
       */
      paintCart: function(data, element) {
        var that = this;
        _.each(data.value, function(value, key, list) {

          var $el = element.find('[data-cms-itemid=' + value.itemId + ']');

          // 如果有重复的itemid，则进行容错
          if ($el.length && $el.length > 1) {
            _.each($el, function(item) {
              // 判断如果商品已经售完，不再显示添加购物车按钮
              if (!value.soldOut && value.supportShoppingCart) {
                $(item).find('.cms-fill-cart').html('<a href="#" class="icon icon90 addtocart">购买</a>');
              } else {
                // @todo 显示不能添加购物车
                $(item).find('.cms-fill-cart').html('<a href="javascript:void(0)" class="icon icon90 disable">购买</a>');
              }
            });
          } else {
            // 判断如果商品已经售完，不再显示添加购物车按钮
            if (!value.soldOut && value.supportShoppingCart) {
              $el.find('.cms-fill-cart').html('<a href="#" class="icon icon90 addtocart">购买</a>');
            } else {
              // @todo 显示不能添加购物车
              $el.find('.cms-fill-cart').html('<a href="javascript:void(0)" class="icon icon90 disable">购买</a>');
            }
          }
        });
      },

      getItemList: function() {
        var $el = this.element.find('[data-cms-itemid]');
        var ids = [];

        _.each($el, function(el) {
          var id = $(el).attr('data-cms-itemid');
          if (!_.isEmpty(id)) {
            ids.push(window.parseInt(id));
          }
        });

        return _.uniq(ids);
      },

      requestItemHotDataList: function(itemIds) {
        var request = new SFGetProductHotDataList({
          itemIds: JSON.stringify(itemIds)
        });
        return request.sendRequest();
      }
    })

    // 查到所有需要渲染价格的模块
    var priceModules = $('.cms-module-fillprice');

    // 分别进行实例化
    _.each(priceModules, function(priceModule) {
      new price($(priceModule));
    });

  });