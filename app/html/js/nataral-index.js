$(function(){
  var nav_height=$('.nav').height();
  var nataral_pruduct0=$('#nataral-pruduct0').offset().top-nav_height;
  var nataral_pruduct1=$('#nataral-pruduct1').offset().top-nav_height;
	var nataral_pruduct2=$('#nataral-pruduct2').offset().top-nav_height;
  $(window).scroll(function(){
    if($(window).scrollTop()>nataral_pruduct0&&$(window).scrollTop()<nataral_pruduct1){
      $('.nataral-top li').eq(0).addClass('active').siblings().removeClass('active');
    }else if($(window).scrollTop()>nataral_pruduct1&&$(window).scrollTop()<nataral_pruduct2){
      $('.nataral-top li').eq(1).addClass('active').siblings().removeClass('active');
    }else if($(window).scrollTop()>nataral_pruduct2){
      $('.nataral-top li').eq(2).addClass('active').siblings().removeClass('active');
    }else{
      $('.nataral-top li').removeClass('active');
    }

  })
})