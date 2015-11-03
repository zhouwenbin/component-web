$(function(){
  $('.goods-activity').click(function(){
  	$(this).toggleClass('active');
  	var active = $(this).hasClass('active');
  	var $text = $(this).find('.goods-activity-text');
  	var $info = $(this).find('.goods-activity-info');
  	if(active){
  		$text.text('收起');
  		$info.text('共2条 优惠信息')
  	}else{
  		$text.text('更多优惠');
  		$info.html('买一送一活动 <a class="goods-activity-link" href="#">去看看</a>')

  	}
  })
  //----------加入购物车-------------//
  $('.goods').on("click", '#addtocart-btn', function(){
    var that = $('.addtocart-img:last-child');
    if($(window).scrollTop() > 166){
        var target=$('.nav .icon100').eq(1).offset()
    }else{
        var target=$('.nav .icon100').eq(0).offset()
    }
    var targetX=target.left,
        targetY=target.top,
        current=that.offset(),
        currentX=current.left,
        currentY=current.top,
        cart_num=$('.cart-num').eq(0).text();
    that.clone().appendTo(that.parent());
    that.css({
      left:targetX-currentX,
      top:targetY-currentY,
      transform:'rotate(360deg)',
      zIndex:3,
      visibility:'hidden'
    })
    
    setTimeout(function(){
        that.remove();
    },1000);
    cart_num++;
    $('.cart-num').text(cart_num);
    $('.nav .label-error').addClass('active');
    setTimeout(function(){
        $('.nav .label-error').removeClass('active');
    },500)
    return false;
  });
})