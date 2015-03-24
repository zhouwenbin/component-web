define(
  'sf.b2c.mall.module.slider',
  [
    'can',
    'jquery',
    'sf.b2c.mall.widget.slide',
    'sf.b2c.mall.business.config',
    'sf.b2c.mall.framework.comm'
  ],
  function(can, $, SFSlide, SFConfig, SFFrameworkComm) {

    SFFrameworkComm.register(1);

    var main = can.Control.extend({
      renderMap: {
        'slide': function () {
          var $el = this.element.find('.sf-b2c-mall-main-slider.serverRendered');

          var that = this;
          if ($el.length === 0) {
            var request = new SFApiGetBanner();
            can.when(request.sendRequest())
              .done(function (data) {
                var arr = [];
                _.each(data.value, function(value, key, list){
                  arr.push({
                    imgUrl: value.imgUrl,
                    url: value.link
                  });
                });
                that.component.slide = new SFSlide('.sf-b2c-mall-main-slider', {imgs: arr});
              })
              .fail(function () {

              })
          }else{
            that.component.slide = new SFSlide('.sf-b2c-mall-main-slider');
          }
        }
      },

      render: function() {
        this.renderMap.slide.call(this);
      }
    })

    new main('body');
  })