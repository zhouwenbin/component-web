$(function(){
  var nav_height=$('.nav').height();
  var num=$('.nataral-top li').length;
  var nataral_pruduct=['#nataral-pruduct0','#nataral-pruduct1','#nataral-pruduct2'];
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
})