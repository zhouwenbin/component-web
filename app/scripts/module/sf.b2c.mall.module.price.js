define(
  'sf.b2c.mall.module.price',
  [
    'can',
    'underscore',
    'sf.b2c.mall.api.b2cmall.getProductHotDataList',
    'sf.b2c.mall.business.config',
    'sf.b2c.mall.framework.comm'
  ],

  function(can, _, SFGetProductHotDataList, SFConfig, SFFrameworkComm) {

    SFFrameworkComm.register(1);

    var price = can.Control.extend({

      init: function() {
        // $(".img-lazyload").imglazyload();
        this.component = {};
        this.paint();
      },

      paint: function() {
        // this.render();

        var that = this;

        var itemIds = this.getItemList();
        if (_.isArray(itemIds) && itemIds.length > 0) {
          can.when(this.requestItemList(itemIds))
            .done(function(data) {
              _.each(data.value, function(value, key, list) {
                var $el = that.element.find('[data-cms-itemid=' + value.itemId + ']');
                $el.find('.cms-fill-originprice').text(value.originPrice/100);
                $el.find('.cms-fill-price').text(value.sellingPrice/100);
                $el.find('.cms-fill-discount').text(parseInt(value.sellingPrice,10) * 10 / parseInt(value.originPrice, 10));

                if (parseInt(value.sellingPrice,10) >= parseInt(value.originPrice, 10)){
                  $el.find('.cms-fill-discountparent')[0].style.display = "none";
                }

                if (value.soldOut) {
                  $el.find('.btn1').removeClass('btn1').addClass('btn1').text('已经抢光')
                  $el.find('.product-r1').append('<div class="mask-live"></div>');
                  $el.find('.product-r1').append('<div class="icon-sold"></div>');
                }
              });

            })
            .fail(function(errorCode) {

            })
        }
      },

      render: function() {
        this.setHandler();
      },

      setHandler: function () {
        $(window).scroll(function(){
          if($(window).scrollTop() > 600){
            $(".btn-top").fadeIn(500);
          }else{
            $(".btn-top").fadeOut(500);
          }
        })

        $(".btn-top").click(function(){
          $("body,html").animate({scrollTop:0},1000);
          return false;
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

      requestItemList: function(itemIds) {
        var request = new SFGetProductHotDataList({
          itemIds: JSON.stringify(itemIds)
        });
        return request.sendRequest();
      }

    })

    new price("body");

  });