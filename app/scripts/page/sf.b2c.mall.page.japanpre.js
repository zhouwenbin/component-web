define(
  'sf.b2c.mall.page.japanpre',
  [
    'can',
    'jquery',
    'sf.b2c.mall.framework.comm',
    'sf.util',
    'sf.b2c.mall.business.config',
    'sf.b2c.mall.module.header',
    'sf.b2c.mall.module.footer'
  ],
  function(can, $, SFFrameworkComm, SFFn, SFBusiness) {

    SFFrameworkComm.register(1);
    SFFn.monitor();

    var japanPage = can.Control.extend({

      /**
       * [init 初始化]
       */
      init: function() {
        var thumbList = $(".japan-video-list-pic-list");

        $(".japan-video-box").on("click", ".down", function() {
          var limit = 132;
          var top = getTop();
          if (top <= -limit) {
            return;
          }
          
          var dest = top - 66;
          if (dest < -limit) {
            dest = -limit;
          }

          thumbList.css({
            top: dest + "px"
          })
          return false;
        })
        .on("click", ".up", function() {

          var top = getTop();
          if (top >= 0) {
            return;
          }

          var dest = top + 66;
          if (dest >= 0) {
            dest = 0;
          }

          //thumbList.stop();
          thumbList.css({
            top: dest + "px"
          })
          return false;
        });

        $(".japan-video-box .japan-video-list-pic-list").on("click", "li", function() {
          $(this).siblings(".active").removeClass("active");
          $(this).addClass("active");

          var index = thumbList.find("li").index($(this));

          $(".japan-video-list li:visible").hide();
          var destination = $(".japan-video-list li").eq(index);
          destination.show();
          var videoSrc = destination.data("video");
          $(".japan-video video").attr("src", videoSrc);
        });


        var getTop = function() {
          var top = thumbList.css("top");
          if (top == "auto") {
            top = 0;
          } else {
            top = top.substr(0, top.length - 2);
          }
          
          return Number.parseInt(top, 10);
        };

        $(".japan-video-list li").on("click", function() {
          $(".japan-video").show();
          $('video')[0].play();
        });

        $(".japan-video-close").on("click", function() {
          $(".japan-video").hide();
          $('video')[0].pause();
        });
      },


    });

    new japanPage('#sf-b2c-mall-search');
  })
