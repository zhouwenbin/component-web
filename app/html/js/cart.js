$(function(){
  $(window).scroll(function(){
    var cart_height=$('.cart').height();
    var window_height=$(window).height();
    if($(window).scrollTop()>190+cart_height-window_height){
      $('.cart-footer').removeClass('cart-footer-fixed');
    }else{
      $('.cart-footer').addClass('cart-footer-fixed');
    }
  })
})