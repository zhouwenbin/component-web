'use strict';

define('sf.b2c.mall.product.detailcontent', [
    'can',
    'zoom',
    'store',
    'jquery.cookie',
    'sf.b2c.mall.adapter.detailcontent',
    'sf.b2c.mall.api.b2cmall.getProductHotData',
    'sf.b2c.mall.api.b2cmall.getSkuInfo',
    'sf.b2c.mall.api.product.findRecommendProducts',
    'sf.helpers',
    'sf.b2c.mall.framework.comm',
    'sf.b2c.mall.business.config',
    'sf.b2c.mall.widget.message',
    'sf.b2c.mall.widget.showArea',
    'imglazyload',
    'sf.b2c.mall.api.product.arrivalNotice',
    'sf.b2c.mall.api.b2cmall.checkLogistics',
    'sf.b2c.mall.api.b2cmall.getActivityInfo'
  ],
  function(can, zoom, store, cookie, SFDetailcontentAdapter, SFGetProductHotData, SFGetSKUInfo, SFFindRecommendProducts, helpers, SFComm, SFConfig, SFMessage, SFShowArea, SFImglazyload, SFArrivalNotice, CheckLogistics, SFGetActivityInfo) {
    return can.Control.extend({

      helpers: {
        'sf-showCurrentStock': function(currentStock, options) {
          if (currentStock() != 0 && currentStock() != -1 && currentStock() != -2) {
            return options.fn(options.contexts || this);
          } else {
            return options.inverse(options.contexts || this);
          }
        },

        'sf-is-limitedTimeBuy': function(time, options) {
          if (typeof time() != 'undefined') {
            return options.fn(options.contexts || this);
          } else {
            return options.inverse(options.contexts || this);
          }
        },

        'sf-is-rapidSeaBuy': function(productShape, options) {
          if (productShape() == 'JSHT') {
            return options.fn(options.contexts || this);
          } else {
            return options.inverse(options.contexts || this);
          }
        },

        //生鲜展示
        'sf-is-freshfood': function(productShape, options) {
          if (productShape() == 'FRESHFOOD') {
            return options.fn(options.contexts || this);
          } else {
            return options.inverse(options.contexts || this);
          }
        },

        //如果售卖价格大于原价，则不显示原价
        'sf-not-showOriginPrice': function(sellingPrice, originPrice, options) {
          if (sellingPrice() >= originPrice()) {
            return options.fn(options.contexts || this);
          } else {
            return options.inverse(options.contexts || this);
          }
        },

        //如果售卖价格大于原价，则不显示原价
        'sf-is-showOriginPrice': function(sellingPrice, originPrice, options) {
          if (sellingPrice() < originPrice()) {
            return options.fn(options.contexts || this);
          } else {
            return options.inverse(options.contexts || this);
          }
        },

        //促销展示
        'sf-showActivity': function(activityType, options) {
          if (activityType != 'FLASH') {
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
        // this.detailUrl = SFConfig.setting.api.detailurl;
        var that = this;
        this.component = {};
        this.component.checkLogistics = new CheckLogistics();

        // @todo 需要在配置文件中修改
        this.detailUrl = 'http://www.sfht.com/detail';
        this.mainUrl = SFConfig.setting.api.mainurl;
        this.adapter = new SFDetailcontentAdapter({});
        this.header = this.options.header;

        this.render();

        var areaId = $('#logisticsArea').attr('data-areaid');

        if (areaId != 0) {

          this.component.showArea = new SFShowArea();
          this.component.showArea.show('create', null, $("#logisticsArea"));

          var time = setInterval(function() {
            var provinceId = store.get('provinceId');
            var cityId = store.get('cityId');
            var regionId = store.get('regionId');
            if (typeof provinceId != 'undefined') {
              if (SFComm.prototype.checkUserLogin.call(that)) {
                that.component.showArea.adapter.addr.attr({
                  input: {
                    provinceName: provinceId
                  }
                });
                that.component.showArea.changeCity();
                that.component.showArea.changeRegion();
                that.component.showArea.adapter.addr.attr({
                  input: {
                    cityName: cityId
                  }
                });
                that.component.showArea.changeRegion();
                that.component.showArea.adapter.addr.attr({
                  input: {
                    regionName: regionId
                  }
                });

                clearInterval(time);
              }
            }
          }, 1000);

        }

      },

      /**
       * [render 渲染入口方法]
       */
      render: function() {
        var that = this;

        if (that.options.serverRendered) {
          this.supplement();
          $(".img-lazyload").imglazyload();
        } else {
          can.ajax({
              url: 'json/sf-b2c.mall.detail.getItemInfo.json'
            })
            .then(function(itemInfoData) {
              that.options.detailContentInfo = {};
              that.adapter.formatItemInfo(that.options.detailContentInfo, itemInfoData);

              return can.ajax({
                url: 'json/sf-b2c.mall.detail.getSkuInfoByItemIdPrice.json'
              })
            })
            .done(function(priceData) {
              that.adapter.formatPrice(that.options.detailContentInfo, priceData);

            })
            .then(function() {
              return can.ajax({
                url: 'json/sf-b2c.mall.detail.getRecommendProducts.json'
              })
            })
            .done(function(recommendProducts) {
              that.adapter.formatRecommendProducts(that.options.detailContentInfo, recommendProducts);

              that.options.detailContentInfo = that.adapter.format(that.options.detailContentInfo);

              var html = can.view('templates/product/sf.b2c.mall.product.detailcontent.mustache', that.options.detailContentInfo, that.helpers);
              that.element.html(html);

              //设置为选中
              that.setFirstPicSelected();

              that.interval = setInterval(function() {
                that.setCountDown(that.options.detailContentInfo.priceInfo)
              }, '1000')
            })
        }
      },

      /**
       * [setFirstPicSelected 设置图片为选中]
       */
      setFirstPicSelected: function() {
        $('.thumb-item:lt(1)').addClass('active');
      },

      /**
       * [supplement 客户端渲染]
       * @return {[type]}
       */
      supplement: function() {
        //渲染放大镜
        $(".goods-c1r1 li").zoom();

        //设置为选中
        this.setFirstPicSelected();

        //渲染规格信息
        this.renderSpecInfo();

        //渲染价格信息
        this.renderPriceInfo();

        //渲染推荐商品信息
        this.renderRecommendProducts();

        //加上百度分享

        // window._bd_share_config={"common":{"bdSnsKey":{},"bdText":"","bdMini":"2","bdMiniList":false,"bdPic":"","bdStyle":"0","bdSize":"24"},"share":{}};with(document)0[(getElementsByTagName('head')[0]||body).appendChild(createElement('script')).src='http://bdimg.share.baidu.com/static/api/js/share.js?v=89860593.js?cdnversion='+~(-new Date()/36e5)];
      },

      /**
       * [renderRecommendProducts 渲染推荐商品信息]
       * @return {[type]}
       */
      renderRecommendProducts: function() {
        var that = this;

        var findRecommendProducts = new SFFindRecommendProducts({
          'itemId': $('.sf-b2c-mall-detail-content').eq(0).attr('data-itemid'),
          'size': 4
        });

        findRecommendProducts
          .sendRequest()
          .fail(function(error) {
            //console.error(error);
          })
          .done(function(data) {

            data.hasData = true;

            if ((typeof data.value == "undefined") || (data.value && data.value.length == 0)) {
              data.hasData = false;
            }

            _.each(data.value, function(item) {
              item.linkUrl = that.detailUrl + "/" + item.itemId + ".html";
              item.imageName = item.imageName + "@102h_102w_80Q_1x.jpg";
              //<img src="58dd43abc59b1ebe37508d03f28f3cfd.jpg@71h_71w_50Q_1x.jpg" alt="">
            })

            var template = can.view.mustache(that.recommendProductsTemplate());
            $('#recommend').html(template(data));
          });
      },

      recommendProductsTemplate: function() {
        return '{{#if hasData}}' +
          '<div class="recommend">' +
          '<h2>相关商品</h2>' +
          '<ul class="clearfix" id = "recommendProdList">' +
          '{{#each value}}' +
          '<li><div class="recommend-c2">' +
          '<a class="fl" href="{{linkUrl}}"><img src="{{sf.img imageName}}" alt="" /></a>' +
          '</div><div class="recommend-c1">' +
          '<h3><a href="{{linkUrl}}">{{productName}}</a></h3>' +
          '<div class="recommend-r1">¥{{sf.price sellingPrice}}</div>' +
          '</div>' +
          '</li>' +
          '{{/each}}' +
          '</ul>' +
          '</div>' +
          '{{/if}}';
      },

      /**
       * [renderSpecInfo 渲染规格信息]
       */
      renderSpecInfo: function() {
        this.options.detailContentInfo = {};
        this.options.detailContentInfo.input = {};
        if ($('#specArea').eq(0).attr('data-specgroups') == null || $('#specArea').eq(0).attr('data-specgroups') == "") {
          this.options.detailContentInfo = this.adapter.format(this.options.detailContentInfo);
          return false;
        }

        var specGroups = JSON.parse($('#specArea').eq(0).attr('data-specgroups'));
        var specId = JSON.parse($('#specArea').eq(0).attr('data-skuspectuple'));
        var saleSkuSpecTupleList = JSON.parse($('#specArea').eq(0).attr('data-saleskuspectuplelist'));

        var index = 0;

        this.options.detailContentInfo.itemInfo = {};
        this.options.detailContentInfo.itemInfo.specGroups = specGroups;
        this.options.detailContentInfo.itemInfo.saleSkuSpecTupleList = saleSkuSpecTupleList;

        var that = this;

        _.each(this.options.detailContentInfo.itemInfo.specGroups, function(group) {
          //设置选中
          that.adapter.setSelectedSpec(index, specId, group);
          //设置可选
          that.adapter.setCanSelectedSpec(index, specId, group, saleSkuSpecTupleList);

          ++index;
        })

        this.options.detailContentInfo = that.adapter.format(this.options.detailContentInfo);

        var template = can.view.mustache(this.specTemplate());
        $('#specArea').html(template(this.options.detailContentInfo));
      },

      /**
       * [renderPriceInfo 渲染价格信息]
       */
      renderPriceInfo: function() {
        var that = this;
        var itemid = $('.sf-b2c-mall-detail-content').eq(0).attr('data-itemid');

        var getProductHotData = new SFGetProductHotData({
          'itemId': itemid
        });

        getProductHotData
          .sendRequest()
          .fail(function(error) {
            //console.error(error);
          })
          .done(function(data) {
            //获得服务器时间
            var currentServerTime = getProductHotData.getServerTime();


            //设置价格相关信息
            data.discount = (data.sellingPrice * 10 / data.originPrice).toFixed(1);
            data.lessspend = data.originPrice - data.sellingPrice;
            data.showDiscount = data.originPrice > data.sellingPrice;

            var currentClientTime = new Date().getTime();
            var distance = currentServerTime - currentClientTime;

            that.options.detailContentInfo.attr("priceInfo", data);

            if (that.interval) {
              clearInterval(that.interval);
            }

            //设置倒计时
            //如果当前时间活动已经结束了 就不要走倒计时设定了
            if (data.endTime - new Date().getTime() + distance > 0) {
              that.interval = setInterval(function() {

                //走倒计时过程中 如果发现活动时间已经结束了，则去刷新下当前页面
                if (data.endTime - new Date().getTime() + distance <= 0) {
                  that.refreshPage();
                } else {
                  that.setCountDown(that.options.detailContentInfo.priceInfo, distance, data.endTime);
                }
              }, '1000')
            } else {
              that.options.detailContentInfo.priceInfo.attr("timeIcon", "");
            }

            var productShape = $('#buyInfo').attr('data-productshape');
            if (productShape == 'FRESHFOOD') {
              that.options.detailContentInfo.priceInfo.attr("showTax", false);
            } else {
              that.options.detailContentInfo.priceInfo.attr("showTax", true);
            }

            //渲染购买信息
            that.renderBuyInfo(that.options.detailContentInfo);
            //渲染活动信息
            that.renderActivityInfo();



            //渲染模板
            var itemPriceTemplate = can.view.mustache(that.itemPriceTemplate());
            $('#itemPrice').html(itemPriceTemplate(that.options.detailContentInfo, that.helpers));
          });
      },

      /**
       * [renderActivityInfo 渲染活动信息]
       */
      renderActivityInfo: function() {
        var that = this;
        var itemid = $('.sf-b2c-mall-detail-content').eq(0).attr('data-itemid');

        var getActivityInfo = new SFGetActivityInfo({
          'itemId': itemid
        });

        getActivityInfo
          .sendRequest()
          .fail(function(error) {
            //console.error(error);
          })
          .done(function(data) {


            if (data && data.value && data.value.length > 0) {
              _.each(data.value, function(element, index, list) {
                //处理活动规则，翻译成html
                element.rulesHtml = "";
                if (element.promotionRules) {
                  for (var index = 0, tempRule; tempRule = element.promotionRules[index]; index++) {
                    if (index != 0) {
                      element.rulesHtml += "<br />";
                    }
                    element.rulesHtml += (index+1) + "." + tempRule.ruleDesc;
                  }
                }

                //处理限时促销
                if (element.activityType == "FLASH") {
                  that.options.detailContentInfo.priceInfo.attr("activityTitle", element.activityTitle);
                }

              });
            }


            //活动信息模板
            var activityTemplate = can.view.mustache(that.activityTemplate());
            $('.goods-activityinfos')
              .html(activityTemplate(data, that.helpers))
              .off("click", ".goods-activity-c1 a")
              .on("click", ".goods-activity-c1 a", function() {
              $(this).parents(".goods-activity").toggleClass("active");
            })
          });
      },

      refreshPage: function() {
        this.gotoNewItem();
        clearInterval(this.interval);
        this.options.detailContentInfo.priceInfo.attr("timeIcon", "");
      },

      /**
       * [renderBuyInfo 渲染购买信息]
       * @param  {[type]} detailContentInfo
       * @return {[type]}
       */
      renderBuyInfo: function(detailContentInfo) {
        detailContentInfo.input.attr("buyNum", 1);
        detailContentInfo.input.attr("reduceDisable", "disable");
        detailContentInfo.input.attr("addDisable", "");
        detailContentInfo.input.attr("showRestrictionTips", false);

        var logisticsstart = $('#buyInfo').eq(0).attr('data-logisticsstart');
        var logisticsend = $('#buyInfo').eq(0).attr('data-logisticsend');

        if (parseInt(logisticsend, 10) > parseInt(logisticsstart, 10)) {
          detailContentInfo.priceInfo.attr("sendTime", logisticsstart + '-' + logisticsend);
        } else {
          detailContentInfo.priceInfo.attr("sendTime", logisticsstart);
        }

        detailContentInfo.priceInfo.attr("productShape", $('#buyInfo').eq(0).attr('data-productshape'));

        var template = can.view.mustache(this.buyInfoTemplate());
        $('#buyInfo').html(template(detailContentInfo, this.helpers));

      },

      '#getNotify click': function(element, event) {
        event && event.preventDefault();

        var that = this;

        $("#getNotifyStep1").show();

        $("#getNotifyMobileSubmit")[0].onclick = _.bind(that.getMobileData, that, element);

        $(".closeGetNotifyStep1icon")[0].onclick = function() {
          $("#getNotifyStep1").hide();
        }

        $(".closeGetNotifyStep2icon")[0].onclick = function() {
          $("#getNotifyStep2").hide();
        }

        $("#closeGetNotifyStep2")[0].onclick = function() {
          $("#getNotifyStep2").hide();
        }
      },

      getMobileData: function(element) {
        var mobile = element.parents().find('#getNotifyMobile').val();

        if (!mobile || !/^1[0-9]{10}$/.test(mobile)) {
          this.dialogerror();
          $("#getNotifyMobile").focus();
          return false;
        } else {
          var itemid = $(".sf-b2c-mall-detail-content").eq(0).attr('data-itemid');
          var arrivalNotice = new SFArrivalNotice({
            "itemId": itemid,
            "mobileNumber": mobile
          });
          arrivalNotice.sendRequest()
            .done(function(data) {
              $("#getNotifyStep1").hide();
              $("#getNotifyStep2").show();
            })
            .fail(function(error) {
              console.error(error);
            })
          return true;
        }
      },

      dialogerror: function() {
        $('.dialog').animate({
            "left": "48%"
          }, 100)
          .animate({
            "left": "52%"
          }, 100)
          .animate({
            "left": "48%"
          }, 100)
          .animate({
            "left": "52%"
          }, 100)
          .animate({
            "left": "50%"
          }, 100);
      },

      checkMobile: function(mobile) {
        if (!mobile) {
          this.data.attr({
            'msgType': 'icon26',
            'msg': ERROR_NO_INPUT_MOBILE
          });
          return false;
        } else if (!/^1[0-9]{10}$/.test(mobile)) {
          this.data.attr({
            'msgType': 'icon26',
            'msg': ERROR_INPUT_MOBILE
          })
          return false;
        } else {
          return true;
        }
      },

      '#gotobuy click': function(element, event) {
        event && event.preventDefault();
        $('#areaErrorTips').hide();

        var areaId = $('#logisticsArea').attr('data-areaid');
        var that = this;
        if (typeof areaId != "undefined" && areaId != 0) {
          var provinceId = this.component.showArea.adapter.addr.input.attr('provinceName');
          var cityId = this.component.showArea.adapter.addr.input.attr('cityName');
          var districtId = this.component.showArea.adapter.addr.input.attr('regionName');

          this.component.checkLogistics.setData({
            areaId: areaId,
            provinceId: provinceId,
            cityId: cityId,
            districtId: districtId
          });

          this.component.checkLogistics.sendRequest()
            .done(function(data) {
              if (data.value == false) {
                //that.component.showArea.adapter.addr.attr('errorTips','无法配送到此区域');
                $('#areaErrorTips').text('无法配送到此区域').show();
                return false;
              }

              var amount = that.options.detailContentInfo.input.buyNum;
              if (amount < 1 || isNaN(amount)) {
                that.options.detailContentInfo.input.attr("buyNum", 1);
                var message = new SFMessage(null, {
                  'tip': '请输入正确的购买数量！',
                  'type': 'error'
                });
                return false;
              }

              var currentStock = that.options.detailContentInfo.priceInfo.currentStock;
              if (currentStock > 0 && amount > currentStock) {
                var message = new SFMessage(null, {
                  'tip': '商品库存仅剩' + currentStock + '件！',
                  'type': 'error'
                });
                return false;
              }

              var gotoUrl = 'http://www.sfht.com/order.html' + '?' + $.param({
                "itemid": $('.sf-b2c-mall-detail-content').eq(0).attr('data-itemid'),
                "saleid": $('.sf-b2c-mall-detail-content').eq(0).attr('data-saleid'),
                "amount": that.options.detailContentInfo.input.buyNum
              });

              if (!SFComm.prototype.checkUserLogin.call(that)) {
                that.header.showLogin(gotoUrl);
                return false;
              }

              window.location.href = gotoUrl;
            }).fail(function() {

            })
        } else {
          var amount = that.options.detailContentInfo.input.buyNum;
          if (amount < 1 || isNaN(amount)) {
            that.options.detailContentInfo.input.attr("buyNum", 1);
            var message = new SFMessage(null, {
              'tip': '请输入正确的购买数量！',
              'type': 'error'
            });
            return false;
          }

          var currentStock = that.options.detailContentInfo.priceInfo.currentStock;
          if (currentStock > 0 && amount > currentStock) {
            var message = new SFMessage(null, {
              'tip': '商品库存仅剩' + currentStock + '件！',
              'type': 'error'
            });
            return false;
          }

          var gotoUrl = 'http://www.sfht.com/order.html' + '?' + $.param({
            "itemid": $('.sf-b2c-mall-detail-content').eq(0).attr('data-itemid'),
            "saleid": $('.sf-b2c-mall-detail-content').eq(0).attr('data-saleid'),
            "amount": that.options.detailContentInfo.input.buyNum
          });

          if (!SFComm.prototype.checkUserLogin.call(that)) {
            that.header.showLogin(gotoUrl);
            return false;
          }

          window.location.href = gotoUrl;
        }


      },
      '#s2 change': function(element, event) {
        this.checkAreaLogistics();
      },
      '#s3 change': function(element, event) {
        this.checkAreaLogistics();
      },
      '#s4 change': function(element, event) {
        this.checkAreaLogistics();
      },
      checkAreaLogistics: function() {
        $('#areaErrorTips').hide();
        var areaId = $('#logisticsArea').attr('data-areaid');
        var provinceId = this.component.showArea.adapter.addr.input.attr('provinceName');
        var cityId = this.component.showArea.adapter.addr.input.attr('cityName');
        var districtId = this.component.showArea.adapter.addr.input.attr('regionName');

        this.component.checkLogistics.setData({
          areaId: areaId,
          provinceId: provinceId,
          cityId: cityId,
          districtId: districtId
        });

        var that = this;
        this.component.checkLogistics.sendRequest()
          .done(function(data) {
            if (data.value == false) {
              //that.component.showArea.adapter.addr.attr('errorTips', '无法配送到此区域');
              $('#areaErrorTips').text('无法配送到此区域').show();
              return false;
            }
          }).fail(function() {

          })
      },

      buyInfoTemplate: function() {
        return '<div class="goods-num"><label>数 量</label>' +
          '<span class="btn btn-num">' +
          '<a class="btn-num-reduce {{input.reduceDisable}}" href="javascript:void(0);">-</a><a class="btn-num-add {{input.addDisable}}" href="javascript:void(0);">+</a>' +
          '<input type="text" class="input_txt" value="{{input.buyNum}}"></span>' +
          '{{#if input.showRestrictionTips}}<span class="icon icon62"></span><span class="text-important" id="showrestrictiontipsspan">每人限购{{priceInfo.limitBuy}}件</span>{{/if}}' +
          '</div>' +
          '<div class="goods-c2r2 clearfix">' +
          '<div class="fl">' +

          '{{#if priceInfo.soldOut}}' +
          '<a href="javascript:void(0);" class="btn btn-buy disable">立即购买</a>' +
          '<a href="javascript:void(0);" class="btn btn-buy border" id="getNotify">到货通知</a>' +
          '{{/if}}' +
          '{{^if priceInfo.soldOut}}' +
            '{{^priceInfo.isPromotion}}' +
            '<a href="javascript:void(0);" class="btn btn-buy" id="gotobuy">立即购买</a>' +
            '{{/priceInfo.isPromotion}}' +
            '{{#priceInfo.isPromotion}}' +
              '{{#if priceInfo.activitySoldOut}}' +
              '<a href="javascript:void(0);" class="btn btn-buy disable">卖完了</a>' +
              '<a href="javascript:void(0);" class="btn btn-buy border" id="gotobuy">原价购买</a>' +
              '{{/if}}' +
              '{{^if priceInfo.activitySoldOut}}' +
              '<a href="javascript:void(0);" class="btn btn-buy" id="gotobuy">立即购买</a>' +
              '{{/if}}' +
            '{{/priceInfo.isPromotion}}' +
          '{{/if}}' +

          '</div>' +
          '</div>';
      },

      itemPriceTemplate: function() {
        return '<div class="goods-price-c1 fl">' +

          '{{#sf-not-showOriginPrice priceInfo.sellingPrice priceInfo.originPrice}}' +
          '<div class="goods-price-r1">价格：<span>¥</span><strong>{{sf.price priceInfo.sellingPrice}}</strong></div>' +
          '<div class="goods-price-r2">国内参考价：￥{{sf.price priceInfo.referencePrice}}</div>' +
          '{{/sf-not-showOriginPrice}}' +

          '{{#sf-is-showOriginPrice priceInfo.sellingPrice priceInfo.originPrice}}' +
          '<div class="goods-price-r1">促销价：<span>¥</span><strong>{{sf.price priceInfo.sellingPrice}}</strong>{{#priceInfo.isPromotion}}<i>（活动：{{priceInfo.activityTitle}}）</i>{{/priceInfo.isPromotion}}</div>' +
          '<div class="goods-price-r2">原价：￥{{sf.price priceInfo.originPrice}}   国内参考价：￥{{sf.price priceInfo.referencePrice}}</div>' +
          '{{/sf-is-showOriginPrice}}' +
          '</div>' +

          '{{#sf-is-limitedTimeBuy priceInfo.time}}' +
          '<div class="goods-price-c2">' +
          '<span class="icon icon56"></span><b>剩余</b><span class="text-important">{{{priceInfo.time}}}</span>' +
          '</div>' +
          '{{/sf-is-limitedTimeBuy}}';
      },

      activityTemplate: function() {
        return '{{#each value}}{{#sf-showActivity activityType}}' +
          '<div class="goods-activity">' +
          '{{#rulesHtml}}<div class="goods-activity-c1 fr"><a href="javascript:void(0);">活动详情<span class="icon icon67"></span></a></div>{{/rulesHtml}}' +
          '<div class="goods-activity-c2">' +
            '<b>促销信息：</b>' +
            '{{#pcActivityLink}}' +
            '<a href="{{pcActivityLink}}" class="label label-soon">{{activityTypeDesc}}</a><a  href="{{pcActivityLink}}">{{activityTitle}}</a>' +
            '{{/pcActivityLink}}' +
            '{{^pcActivityLink}}' +
            '<a href="javascript:void(0);" class="label label-soon">{{activityTypeDesc}}</a>{{activityTitle}}' +
            '{{/pcActivityLink}}' +
            '</div>' +
          '<div class="goods-activity-detail">{{{rulesHtml}}}</div>' +
          '</div>' +
          '{{/activityType}}{{/each}}';

      },

      specTemplate: function() {
        return '{{#each itemInfo.specGroups}}' +
          '<li data-specidorder="{{specIdOrder}}"><label>{{sf.split specName}}</label>' +
          '{{#each specs}}' +
          '<span data-specid="{{specId}}" id="1" data-specIndex="{{specIndex}}" data-compose="{{compose}}" class="btn btn-goods {{selected}} {{canShowDottedLine}} {{disabled}}" >{{specValue}}<span class="icon icon23"></span></span>' +
          '{{/each}}' +
          '</li>' +
          '{{/each}}'
      },

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

        var image = $(element).eq(0).attr('data-big-pic');

        if (this.options.serverRendered) {
          $('#bigPicArea')[0].innerHTML = '<ul>' +
            '<li class="active"><img src="' + image + '"/><span></span></li>' +
            '</ul>';
        }

        $(".goods-c1r1 li").zoom();

        //this.options.detailContentInfo.itemInfo.attr("currentImage", image);
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
        if (priceInfo.limitBuy > 0 && amount > priceInfo.limitBuy - 1) {
          input.attr("showRestrictionTips", true);
          $('#showrestrictiontipsspan').show();
          input.attr("addDisable", "disable");
          return false;
        }

        input.attr("reduceDisable", "");
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
        $('#showrestrictiontipsspan').hide();

        if (input.buyNum > 1) {
          input.attr('buyNum', --input.buyNum);
        } else {
          input.attr("reduceDisable", "disable");
        }

        input.attr("addDisable", "");
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
        if (amount < 1 || isNaN(amount)) {
          element.val(1);
        }
        if (priceInfo.limitBuy > 0 && amount > priceInfo.limitBuy) {
          input.attr("showRestrictionTips", true);
          $('#showrestrictiontipsspan').show();
          element.val(priceInfo.limitBuy);
          return false;
        }

        input.attr('buyNum', amount);
        input.attr("showRestrictionTips", false);
        $('#showrestrictiontipsspan').hide();
      },

      /**
       * [description 规格选择]
       * @param  {[type]} element
       * @param  {[type]} event
       * @return {[type]}
       */
      '.btn-goods click': function(element, event) {
        event && event.preventDefault();

        var type = "";
        if (element.hasClass("disable") || element.hasClass("active")) {
          return false;
        }

        if (element.hasClass("dashed")) {
          type = "dashed";
        }

        //获得数据信息
        var orderId = $($(element)[0].parentElement).eq(0).attr('data-specidorder');
        var specId = $(element).eq(0).attr('data-specid');

        if (typeof specId == 'undefined') {
          return false;
        }

        _.each(this.options.detailContentInfo.itemInfo.specGroups, function(group) {

          if (group.specIdOrder == orderId) {
            //修改选择状态  如果之前选中的 则要修改为未选中状态
            _.each(group.specs, function(spec) {
              if (spec.selected) {
                spec.attr("selected", "");
              }
            })
          } else {
            //修改选择状态
            _.each(group.specs, function(spec) {
              if (spec.specId == specId) {
                spec.attr("selected", "active");
                spec.attr("canSelected", "");
              } else {
                if (spec.selected) {
                  spec.attr("canSelected", "");
                  spec.attr("selected", "");
                }
              }
            })
          }
        })

        //去获得最新的sku信息
        this.gotoNewItem(element, type);

        return false;
      },

      getSKUIdBySpecs: function(saleSkuSpecTupleList, gotoItemSpec, element, type) {
        var saleSkuSpecTuple;
        if (type == 'dashed') {
          saleSkuSpecTuple = _.find(saleSkuSpecTupleList, function(saleSkuSpecTuple) {
            return saleSkuSpecTuple.skuSpecTuple.specIds.join(",") == $(element).eq(0).attr('data-compose');
          })
        } else {
          saleSkuSpecTuple = _.find(saleSkuSpecTupleList, function(saleSkuSpecTuple) {
            return saleSkuSpecTuple.skuSpecTuple.specIds.join(",") == gotoItemSpec;
          });
        }

        //重新设定itemid
        $(".sf-b2c-mall-detail-content").eq(0).attr('data-itemid', saleSkuSpecTuple.itemId);
        return saleSkuSpecTuple.skuSpecTuple.skuId;
      },

      /**
       * [gotoNewItem description]
       * @return {[type]}
       */
      gotoNewItem: function(element, type) {
        //获得选中的表示列表
        var gotoItemSpec = new String($(element).eq(0).attr('data-compose')).split(",");

        var skuId = this.getSKUIdBySpecs(this.options.detailContentInfo.itemInfo.saleSkuSpecTupleList, gotoItemSpec.join(","), element, type);

        var that = this;
        var getSKUInfo = new SFGetSKUInfo({
          'skuId': skuId
        });
        getSKUInfo
          .sendRequest()
          .fail(function(error) {
            console.error(error);
          })
          .done(function(skuInfoData) {
            that.options.detailContentInfo.itemInfo.attr("basicInfo", new can.Map(skuInfoData));
            that.adapter.reSetSelectedAndCanSelectedSpec(that.options.detailContentInfo, gotoItemSpec);

            that.renderPriceInfo();

            that.renderSkuInfo();

            //设置为选中
            that.setFirstPicSelected();

            $(".goods-c1r1 li").zoom();
          })
      },

      /**
       * [renderSkuInfo 渲染sku变化信息]
       */
      renderSkuInfo: function() {
        this.renderBreadScrumbInfo();

        this.renderTitleInfo();

        //如果是生鲜商品，不渲染品牌
        var productShape = $('#buyInfo').attr('data-productshape');
        if (productShape != 'FRESHFOOD') {
          this.renderBandInfo();
        };

        this.renderPicInfo();

        //小编推荐
        this.renderRecommend2();

        //详情属性
        this.renderDetailattributes();

        //详情
        this.renderDetail();
      },

      renderRecommend2: function() {
        var template = can.view.mustache(this.recommend2Template());
        $('#recommend2').html(template(this.options.detailContentInfo))
        if (this.options.detailContentInfo &&
          this.options.detailContentInfo.itemInfo &&
          this.options.detailContentInfo.itemInfo.basicInfo &&
          this.options.detailContentInfo.itemInfo.basicInfo.recommend) {
          $('#recommend2').addClass('recommend2').show();
        } else {
          $('#recommend2').removeClass('recommend2').hide();
        }
      },

      renderDetailattributes: function() {
        var template = can.view.mustache(this.detailattributesTemplate());
        $('#detailattributes').html(template(this.options.detailContentInfo.attr()));
      },

      renderDetail: function() {
        var template = can.view.mustache(this.detailTemplate());
        $('#detailcontent').html(template(this.options.detailContentInfo));

        $(".img-lazyload").imglazyload();
      },

      recommend2Template: function() {
        return '<h2>小编推荐</h2>' +
          '<p>{{&itemInfo.basicInfo.recommend}}</p>';
      },

      detailattributesTemplate: function() {
        return '{{#each itemInfo.basicInfo.attributes}}' +
          '<li title={{value}}>【{{key}}】 {{value}}</li>' +
          '{{/each}}';
      },

      detailTemplate: function() {
        return '{{&itemInfo.basicInfo.description}}';
      },

      /**
       * [renderTitleInfo 渲染标题信息]
       * @return {[type]}
       */
      renderTitleInfo: function() {
        var template = can.view.mustache(this.titleTemplate());
        $('#titleInfo').html(template(this.options.detailContentInfo, this.helpers));
      },

      /**
       * [renderBandInfo 渲染品牌信息]
       * @return {[type]}
       */
      renderBandInfo: function() {
        var template = can.view.mustache(this.bandInfoTemplate());
        $('#bandInfo').html(template(this.options.detailContentInfo));
      },

      /**
       * [renderPicInfo 渲染图片信息]
       * @return {[type]}
       */
      renderPicInfo: function() {
        this.options.detailContentInfo.itemInfo.attr("currentImage", this.options.detailContentInfo.itemInfo.basicInfo.images[0].bigImgUrl);
        var template = can.view.mustache(this.picInfoTemplate());
        $('#allSkuImages').html(template(this.options.detailContentInfo));
      },

      renderBreadScrumbInfo: function() {
        var template = can.view.mustache(this.breadScrumbTemplate());
        $('.sf-b2c-mall-product-breadcrumb-title').html(template(this.options.detailContentInfo));
      },

      /**
       * [titleTemplate 获得图片模板]
       * @return {[type]}
       */
      titleTemplate: function() {
        return '<h1>{{itemInfo.basicInfo.title}}</h1>' +
          '<p>{{itemInfo.basicInfo.subtitle}}</p>';
      },

      /**
       * [bandInfoTemplate 获得品牌模板]
       * @return {[type]}
       */
      bandInfoTemplate: function() {
        //return '品牌：<label class="btn btn-brand active">{{itemInfo.basicInfo.brand}}</label>';
        return '品牌：<label class="">{{itemInfo.basicInfo.brand}}</label>';
      },

      /**
       * [picInfoTemplate 获得图片模板]
       * @return {[type]}
       */
      picInfoTemplate: function() {
        return '<div class="goods-c3 fl" id="itemImages">' +
          '<ul class="clearfix">' +
          '{{#each itemInfo.basicInfo.images}}' +
          '<li class="thumb-item" data-big-pic="{{bigImgUrl}}"><a href=""><img src="{{thumbImgUrl}}" alt="" /></a><span></span></li>' +
          '{{/each}}' +
          '</ul>' +
          '</div>' +
          '<div class="goods-c1 fl">' +
          '<div class="goods-c1r1" id="bigPicArea">' +
          '<ul>' +
          '<li class="active">' +
          '<img src="{{itemInfo.currentImage}}" alt="">' +
          '<span></span>' +
          '</li>' +
          '</ul>' +
          '</div>' +
          '</div>';
      },

      breadScrumbTemplate: function() {
        return '{{itemInfo.basicInfo.title}}'
      },

      /**
       * [showCountDown 参考倒计时]
       * @param  {[type]} currentTime
       * @param  {[type]} destTime
       * @return {[type]}
       */
      setCountDown: function(item, distance, endDate) {
        var leftTime = endDate - new Date().getTime() + distance;
        var leftsecond = parseInt(leftTime / 1000);
        var day1 = Math.floor(leftsecond / (60 * 60 * 24));
        var hour = Math.floor((leftsecond - day1 * 24 * 60 * 60) / 3600);
        var minute = Math.floor((leftsecond - day1 * 24 * 60 * 60 - hour * 3600) / 60);
        var second = Math.floor(leftsecond - day1 * 24 * 60 * 60 - hour * 3600 - minute * 60);
        item.attr('time', "<strong>" + day1 + "</strong>" + "天" + "<strong>" + hour + "</strong>" + "小时" + "<strong>" + minute + "</strong>" + "分" + "<strong>" + second + "</strong>" + "秒");
        item.attr('timeIcon', "icon4");
      }

    });
  })
