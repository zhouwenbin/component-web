$(function(){
  //评分
  $.fn.raty.defaults.path = 'lib/raty/lib/images';
  $('.rating').raty({ readOnly: true,score: 5 });
  //切换
  $('.detail-tab-h li').click(function(){
    var index=$('.detail-tab-h li').index(this);
    $(this).addClass('active').siblings().removeClass('active');
    $('.detail-tab-b').eq(index).addClass('active').siblings().removeClass('active');
  })
  $('.comment-tab li').click(function(){
    $(this).addClass('active').siblings().removeClass('active');
  })
})