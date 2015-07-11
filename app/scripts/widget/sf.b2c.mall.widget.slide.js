define(
  'sf.b2c.mall.widget.slide',

  [
    'jquery',
    'can'
  ],

  function($, can) {
    return can.Control.extend({

      init: function(element, options) {
        this.options.sliderIndex = 0;
        this.render(this.options);
        this.initEvents(element);
      },

      /**
       * @description 向前浏览banner
       */
      sliderPreving: function() {
        this.options.sliderIndex--;

        if (this.options.sliderIndex < 0) {
          var length = this.element.find('.slider-img li').length;
          this.options.sliderIndex = length - 1;
        }

        this.sliderSwitch();
      },

      /**
       * @description 向后浏览banner
       */
      sliderNexting: function() {
        this.options.sliderIndex++;

        var length = this.element.find('.slider-img li').length;
        if (this.options.sliderIndex > length - 1) {
          this.options.sliderIndex = 0;
        }

        this.sliderSwitch();
      },

      /**
       * @description 切换banner的内容
       */
      sliderSwitch: function() {
        this.element.find('.slider-num li').removeClass('active').eq(this.options.sliderIndex).addClass("active");
        this.element.find('.slider-img li').removeClass('active').eq(this.options.sliderIndex).addClass("active");
      },

      hoverOver: function(element, event) {
        this.element.find('.btn-prev').show().stop(true, false).animate({
          left: '30px',
          opacity: 1
        }, 500);
        this.element.find('.btn-next').show().stop(true, false).animate({
          right: '30px',
          opacity: 1
        }, 500);
        clearInterval(this.options.silderTimer);
      },

      hoverOut: function(element, event) {
        var that = this;
        this.element.find('.btn-prev').stop(true, false).animate({
          left: '0px',
          opacity: 0
        }, 500, function() {
          that.element.find('.slider .btn-prev').hide()
        });
        this.element.find('.btn-next').stop(true, false).animate({
          right: '0px',
          opacity: 0
        }, 500, function() {
          that.element.find('.slider .btn-prev').hide()
        });

        if (typeof this.element.attr("data-notauto") == 'undefined' || this.element.attr("data-notauto") != "true"){
          this.options.silderTimer = setInterval(_.bind(this.sliderNexting, this), 5000);
        }
      },

      initEvents: function(element) {
        var that = this;

        $(element).on("click", ".btn-prev", function() {
          that.sliderPreving()
        });

        $(element).on("click", ".btn-next", function() {
          that.sliderNexting()
        });

        $(element).on("click", ".slider-num li", function() {
          that.options.sliderIndex = that.element.find('.slider-num li').index(this);
          that.sliderSwitch();
          clearInterval(that.options.silderTimer);
        });
      },

      render: function() {
        if (typeof this.element.attr("data-notauto") == 'undefined' || this.element.attr("data-notauto") != "true"){
          this.options.silderTimer = setInterval(_.bind(this.sliderNexting, this), 5000);
        }

        this.element.hover(_.bind(this.hoverOver, this), _.bind(this.hoverOut, this));
        this.element.find('.slider-img li').eq(0).addClass('active');
        this.element.find('.slider-num li').eq(0).addClass('active');
      }
    });
  })
