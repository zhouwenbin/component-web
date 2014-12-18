'use strict';

define('sf.b2c.mall.product.detailcontent', [
    'can',
    'sf.b2c.mall.adapter.detailcontent'
  ],
  function(can, SFDetailcontentAdapter) {
    return can.Control.extend({

      helpers: {
        'sf-is-soldout': function(soldOut, options) {
          if (soldOut()) {
            return options.fn(options.contexts || this);
          } else {
            return options.inverse(options.contexts || this);
          }
        },

        'sf-is-restriction': function(soldOut, accountRestriction, options) {
          if (!soldOut() && accountRestriction() > 0) {
            return options.fn(options.contexts || this);
          } else {
            return options.inverse(options.contexts || this);
          }
        },

        'sf-is-isPromotion': function(soldOut, isPromotion, options) {
          if (!soldOut() && isPromotion() > 0) {
            return options.fn(options.contexts || this);
          } else {
            return options.inverse(options.contexts || this);
          }
        }
      },

      /**
       * 初始化控件
       * @param  {DOM} element 容器element
       * @param  {Object} options 传递的参数
       */
      init: function(element, options) {
        this.render();
      },

      render: function() {
        var that = this;

        can.ajax({
            url: 'json/sf-b2c.mall.detail.getItemInfo.json'
          })
          .then(function(itemInfoData) {
            that.options.detailContentInfo = {};
            SFDetailcontentAdapter.formatItemInfo(that.options.detailContentInfo, itemInfoData);

            return can.ajax({
              url: 'json/sf-b2c.mall.detail.getSkuInfoByItemIdPrice.json'
            })
          })
          .done(function(priceData) {
            SFDetailcontentAdapter.formatPrice(that.options.detailContentInfo, priceData);

          })
          .then(function() {
            return can.ajax({
              url: 'json/sf-b2c.mall.detail.getRecommendProducts.json'
            })
          })
          .done(function(recommendProducts) {
            SFDetailcontentAdapter.formatRecommendProducts(that.options.detailContentInfo, recommendProducts);

            that.options.detailContentInfo = SFDetailcontentAdapter.format(that.options.detailContentInfo);

            var html = can.view('templates/product/sf.b2c.mall.product.detailcontent.mustache', that.options.detailContentInfo, that.helpers);
            that.element.html(html);

            //设置为选中
            that.setFirstPicSelected();

            that.interval = setInterval(function() {
              that.setCountDown(that.options.detailContentInfo.priceInfo)
            }, '1000')
          })

      },

      /**
       * [setFirstPicSelected 设置图片为选中]
       */
      setFirstPicSelected: function() {
        $('.thumb-item:lt(1)').addClass('active');
      },

      supplement: function() {},

      /**
       * @description event:点击thumb-item切换图片
       * @param  {Dom} element 触发事件的元素
       * @param  {Event} event   事件对象
       */
      '.thumb-item click': function(element, event) {
        event && event.preventDefault() && event.stopPropogation();
        // 删除所有的focus class
        $('.thumb-item').removeClass('active');
        element.addClass('active');

        var image = $(element)[0].dataset.bigPic;
        this.options.detailContentInfo.itemInfo.attr("currentImage", image);
      },

      /**
       * @description event:数量增加，限制是accountRestriction
       * @param  {Dom} element 触发事件的元素
       * @param  {Event} event   事件对象
       */
      '.btn-num-add click': function(element, event) {
        event && event.preventDefault();

        var priceInfo = this.options.detailContentInfo.priceInfo;
        var input = this.options.detailContentInfo.input;

        if (priceInfo.soldOut) {
          return false;
        }

        var amount = parseInt(input.attr("buyNum"));
        if (priceInfo.accountRestriction > 0 && amount > priceInfo.accountRestriction - 1) {
          input.attr("showRestrictionTips", true);
          return false;
        }

        input.attr('buyNum', amount + 1);
        return false;
      },

      /**
       * @description event:数量减少，限制最小是1
       * @param  {Dom} element 触发事件的元素
       * @param  {Event} event   事件对象
       */
      '.btn-num-reduce click': function(element, event) {
        event && event.preventDefault();

        var priceInfo = this.options.detailContentInfo.priceInfo;
        var input = this.options.detailContentInfo.input;

        input.attr("showRestrictionTips", false);

        if (input.buyNum > 1) {
          input.attr('buyNum', --input.buyNum);
        }
        return false;
      },

      /**
       * [description 购买数量手工输入]
       * @param  {[type]} element
       * @param  {[type]} event
       * @return {[type]}
       */
      '.input_txt keyup': function(element, event) {
        event && event.preventDefault();

        this.dealBuyNumByInput(element);

        return false;
      },

      /**
       * [description 购买数量手工输入]
       * @param  {[type]} element
       * @param  {[type]} event
       * @return {[type]}
       */
      '.input_txt blur': function(element, event) {
        event && event.preventDefault();

        this.dealBuyNumByInput(element);

        return false;
      },

      /**
       * [description 购买数量手工输入]
       * @param  {[type]} element
       * @return {[type]}
       */
      dealBuyNumByInput: function(element) {
        var priceInfo = this.options.detailContentInfo.priceInfo;
        var input = this.options.detailContentInfo.input;

        if (priceInfo.soldOut) {
          return false;
        }

        var amount = element[0].value;
        if (priceInfo.accountRestriction > 0 && amount > priceInfo.accountRestriction) {
          input.attr("showRestrictionTips", true);
          element.val(priceInfo.accountRestriction);
          return false;
        }

        input.attr('buyNum', amount);
        input.attr("showRestrictionTips", false);
      },

      /**
       * [description 规格选择]
       * @param  {[type]} element
       * @param  {[type]} event
       * @return {[type]}
       */
      '.btn-goods click': function(element, event) {
        event && event.preventDefault();
        if (element.hasClass("disable")) {
          return false;
        }

        //获得数据信息
        var orderId = $(element)[0].parentElement.dataset.specidorder;
        var specId = $(element)[0].dataset.specid;

        var group = _.find(this.options.detailContentInfo.itemInfo.specGroups, function(group) {
          return group.specIdOrder == orderId;
        })

        //修改选择状态
        _.each(group.specs, function(spec) {
          if (spec.specId == specId) {
            spec.attr("selected", true);
            spec.attr("canSelected", false);
          } else {
            if (spec.attr("selected")) {
              spec.attr("canSelected", true);
            }
            spec.attr("selected", false);
          }
        })

        //去获得最新的sku信息
        this.gotoNewItem();
        return false;
      },

      getSKUIdBySpecs: function(saleSkuSpecTupleList, gotoItemSpec) {
        var saleSkuSpecTuple = _.find(saleSkuSpecTupleList, function(saleSkuSpecTuple) {
          return saleSkuSpecTuple.skuSpecTuple.specIds.indexOf(gotoItemSpec) > -1;
        });

        return saleSkuSpecTuple.skuSpecTuple.skuId;
      },

      /**
       * [gotoNewItem description]
       * @return {[type]}
       */
      gotoNewItem: function() {
        //获得选中的表示列表
        var gotoItemSpec = "";
        _.each(this.options.detailContentInfo.itemInfo.specGroups, function(group) {
          _.each(group.specs, function(spec) {
            if (spec.attr("selected")) {
              gotoItemSpec += spec.specId;
            }
          })
        })

        var skuId = this.getSKUIdBySpecs(this.options.detailContentInfo.itemInfo.saleSkuSpecTupleList, gotoItemSpec);

        var that = this;
        can.ajax({
            url: 'json/sf-b2c.mall.detail.getSkuInfo.json'
          })
          .then(function(skuInfoData) {
            that.options.detailContentInfo.itemInfo.attr("basicInfo", skuInfoData);
            SFDetailcontentAdapter.reSetSelectedAndCanSelectedSpec(that.options.detailContentInfo, gotoItemSpec);

            //设置为选中
            that.setFirstPicSelected();
          })
      },

      /**
       * [showCountDown 参考倒计时]
       * @param  {[type]} currentTime
       * @param  {[type]} destTime
       * @return {[type]}
       */
      setCountDown: function(item) {
        var now = new Date();
        var endDate = item.endTime;
        var leftTime = endDate - now.getTime();
        var leftsecond = parseInt(leftTime / 1000);
        var day1 = Math.floor(leftsecond / (60 * 60 * 24));
        var hour = Math.floor((leftsecond - day1 * 24 * 60 * 60) / 3600);
        var minute = Math.floor((leftsecond - day1 * 24 * 60 * 60 - hour * 3600) / 60);
        var second = Math.floor(leftsecond - day1 * 24 * 60 * 60 - hour * 3600 - minute * 60);
        item.attr('time', day1 + "天" + hour + "小时" + minute + "分" + second + "秒");
      }

    });
  })