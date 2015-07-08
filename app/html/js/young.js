$(function(){
  $( '#st-stack' ).stackslider();


	$('.young-tab-h li').click(function(){
    var index = $('.young-tab-h li').index(this);
    $(this).addClass('active').siblings().removeClass('active');
    $('.young-tab-b>li').eq(index).addClass('active').siblings().removeClass('active');
  })
})