define(
  'sf.b2c.mall.module.sidelip', [
    'jquery',
    'can',
    'underscore',
    'sf.b2c.mall.framework.comm'
  ],

  function($, can, _, SFFrameworkComm) {

    SFFrameworkComm.register(1);

    var sidelip = can.Control.extend({

      init: function(element, options) {
        var nav_height=$('.nav').height();
        var num=$('.nataral-top li').length;

        var nataral_pruduct = [];

        _.each($(".cms-src-anchor"), function(item) {
          nataral_pruduct.push($(item).attr("href"));
        });

        var nataral_pruduct_offset=[];
        for(i=0;i<num;i++){
          nataral_pruduct_offset[i]=$(nataral_pruduct[i]).offset().top-nav_height;
        }
        $(window).scroll(function(){
          for(i=0;i<num;i++){
            if($(window).scrollTop()>nataral_pruduct_offset[i]-10){
              $('.nataral-top li').eq(i).addClass('active').siblings().removeClass('active');
            }
          }
          if($(window).scrollTop()<nataral_pruduct_offset[0]){
            $('.nataral-top li').removeClass('active');
          }
        })
        $('.nataral-top li').click(function(){
            var index=$('.nataral-top li').index(this);
            $("body,html").animate({scrollTop:nataral_pruduct_offset[index]},500);
            return false;
          })
      }
    });

    new sidelip();
  });
