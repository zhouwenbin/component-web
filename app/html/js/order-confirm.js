$(function(){
	
  $('.address li').not('.add').click(function(){
  	$(this).addClass('active').siblings().removeClass('active');
  });
  $('.address-default').click(function(){
  	$(this).parents('li').addClass('default').siblings().removeClass('default');
  	return false;
  });
  $('.address li:gt(3)').hide();
  $('#address-all').click(function(){
  	$('.address li').show();
  })
  $('.cart-coupon li:gt(0)').hide();
  $('#cart-coupon-all').click(function(){
  	$('.cart-coupon li').show();
  });
  $('.cart-coupon li').click(function(){
  	$(this).addClass('active').siblings().removeClass('active');
  })
})