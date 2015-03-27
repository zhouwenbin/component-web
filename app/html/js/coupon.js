$(function(){
  $('.mycoupon-h li').click(function(){
    var index = $('.mycoupon-h li').index(this);
    $('.mycoupon-h li').removeClass('active');
    $(this).addClass('active');
    $('.mycoupon-b').removeClass('active');
    $('.mycoupon-b').eq(index).addClass('active');
    return false;
  })
})