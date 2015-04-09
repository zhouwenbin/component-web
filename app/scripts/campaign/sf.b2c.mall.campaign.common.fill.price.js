define(
  'sf.b2c.mall.campaign.common.fill.price',
  [
    'JSON',
    'can',
    'underscore',
    'sf.b2c.mall.framework.comm',
    'sf.b2c.mall.api.b2cmall.getProductHotDataList',
    'imglazyload',
    'sf.b2c.mall.component.header',
    'sf.b2c.mall.component.footer'
  ],

  function(JSON, can, _, SFFrameworkComm, SFGetProductHotDataList, SFImglazyload, SFHeader, SFFooter) {

    SFFrameworkComm.register(1);

    return can.Control.extend({

      init: function() {
        $(".img-lazyload").imglazyload();
        this.component = {};
        this.paint();
      },

      paint: function() {
        this.render();

        var that = this;

        var itemIds = this.getItemList();
        if (_.isArray(itemIds) && itemIds.length > 0) {
          can.when(this.requestItemList(itemIds))
            .done(function(data) {
              _.each(data.value, function(value, key, list) {
                var $el = that.element.find('[data-itemId=' + value.itemId + ']');
                $el.find('.product-origin-price').text(value.originPrice/100);
                $el.find('.product-selling-price').text(value.sellingPrice/100);

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
        this.component.header = new SFHeader('.sf-b2c-mall-header');
        this.component.footer = new SFFooter('.sf-b2c-mall-footer');
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
        var $el = this.element.find('[data-itemId]');
        var ids = [];

        _.each($el, function(el) {
          var id = $(el).attr('data-itemId');
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

  });