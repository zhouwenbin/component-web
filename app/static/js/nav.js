$(function(){
    //----------导航-------------//
    $(window).scroll(function(){
      if($(window).scrollTop() > 166){
          $(".nav-fixed").stop(true,false).animate({
            top:'0px',
            opacity:1
          },300);
      }else{
          $(".nav-fixed").stop(true,false).animate({
            top:'-56px',
            opacity:0
          },0);
      }
  })

  
  //----------加入购物车-------------//
  $('.product-1').on("click", '.btn-black', function(){
    if($(window).scrollTop() > 166){
        var target=$('.nav-fixed-cart').offset()
    }else{
        var target=$('.cart-num').offset()
    }
    var that = $(this),
        targetX=target.left,
        targetY=target.top,
        current=$(this).offset(),
        currentX=current.left,
        currentY=current.top,
        cart_num=$('.cart-num-inner').eq(0).text();
    $(this).find('.addtocart-img').eq(-1).clone().appendTo($(this));
    $(this).find('.addtocart-img').eq(0).css({
      left:targetX-currentX,
      top:targetY-currentY,
      zIndex:1000,
      visibility:'hidden'
    })
    
    setTimeout(function(){
        that.find('.addtocart-img').eq(0).remove();
    },1000);
    cart_num++;
    $('.cart-num-inner').text(cart_num);
    $('.nav .label-error').addClass('active');
    setTimeout(function(){
        $('.nav .label-error').removeClass('active');
    },500)
    return false;
  });
})