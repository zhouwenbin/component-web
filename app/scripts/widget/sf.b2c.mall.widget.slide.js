define(
  'sf.b2c.mall.widget.slide',

  [
    'jquery',
    'can'
  ],

  function ($, can) {
    return can.Control.extend({

      init: function (element, options) {
        this.options.sliderIndex = 0;
        this.render(this.options);
      },

      /**
       * @description 向前浏览banner
       */
      sliderPreving: function(){
        this.options.sliderIndex--;

        if(this.options.sliderIndex < 0){
          var length = this.element.find('.slider-img li').length;
          this.options.sliderIndex = length-1;
        }

        this.sliderSwitch();
      },

      /**
       * @description 向后浏览banner
       */
      sliderNexting: function(){
        this.options.sliderIndex++;

        var length = this.element.find('.slider-img li').length;
        if(this.options.sliderIndex > length-1){
          this.options.sliderIndex = 0;
        }

        this.sliderSwitch();
      },

      /**
       * @description 切换banner的内容
       */
      sliderSwitch: function(){
        this.element.find('.slider-num li').removeClass('active').eq(this.options.sliderIndex).addClass("active");
        this.element.find('.slider-img li').removeClass('active').eq(this.options.sliderIndex).addClass("active");
      },

      hoverOver: function (element, event) {
        this.element.find('.slider .btn-prev').show().stop(true, false).animate({ left:  0, opacity: 1 }, 500);
        this.element.find('.slider .btn-next').show().stop(true, false).animate({ right: 0, opacity: 1 }, 500);
        clearInterval(this.options.silderTimer);
      },

      hoverOut: function (element, event) {
        this.element.find('.slider .btn-prev').stop(true, false).animate({ left:  '-50px', opacity: 0 }, 500, function(){ this.element.find('.slider .btn-prev').hide() });
        this.element.find('.slider .btn-next').stop(true, false).animate({ right: '-50px', opacity: 0 }, 500, function(){ this.element.find('.slider .btn-prev').hide() });
        this.options.silderTimer=setInterval(_.bind(this.sliderNexting, this),5000);
      },

      '.slider .btn-prev click': function (element, event) {
        this.sliderPreving();
      },

      '.slider .btn-next click': function (element, event) {
        this.sliderNexting();
      },

      '.slider-num li click': function (element, event) {
        this.options.sliderIndex = this.element.find('.slider-num li').index(element);
        this.sliderSwitch();
        clearInterval(this.options.silderTimer);
      },

      template: function () {
        return  '<div class="slider">' +
                  '<ul class="slider-img">' +
                    '{{#imgs}}' +
                    '<li><a href="{{url}}" style="background-image: url({{imgUrl}})"></a></li>' +
                    '{{/imgs}}' +
                  '</ul>' +
                  '<ul class="slider-num">'+
                    '{{#imgs}}' +
                      '<li><a href="###"></a></li>' +
                    '{{/imgs}}' +
                  '</ul>' +
                  '<a href="###" class="btn btn-prev">向前</a>' +
                  '<a href="###" class="btn btn-next">向后</a>' +
                '</div>'
      },

      render: function () {
        if (this.options.imgs && this.options.imgs.length > 0) {
          var template = can.view.mustache(this.template())
          this.element.html(template(this.options));
        }

        this.options.silderTimer = setInterval(_.bind(this.sliderNexting, this), 5000);
        this.element.hover(_.bind(this.hoverOver, this), _.bind(this.hoverOut, this));
        this.element.find('.slider-img li').eq(0).addClass('active');
        this.element.find('.slider-num li').eq(0).addClass('active');
      }
    });
  })