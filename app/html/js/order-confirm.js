$(function(){
	//收货地址选择
  $('.address li').not('.add').click(function(){
  	$(this).addClass('active').siblings().removeClass('active');
  });
  //选择默认收货地址
  $('.address-default').click(function(){
  	$(this).parents('li').addClass('default').siblings().removeClass('default');
  	return false;
  });
  $('.address li:gt(3)').hide();
  //展开全部收货地址
  $('#address-all').click(function(){
    $(this).addClass('active');
  	$('.address li').show();
  })
  //使用优惠券
  $('#coupon-use').click(function(){
    $(this).toggleClass('active');
    $('#coupon-use-detail').toggle(300);
  })
  //优惠券切换
  $('.coupons-tab li').click(function(){
    $(this).addClass('active').siblings().removeClass('active');
    var index = $('.coupons-tab li').index(this);
    $('.coupons-list').eq(index).addClass('active').siblings().removeClass('active');
  })
  //展开更多
  $('#coupon-more').click(function(){
    $(this).toggleClass('active');
    if($(this).hasClass('active')){
      $('#coupon-more-text').text('展开更多');
      $('#coupons').show();
    }else{
      $('#coupon-more-text').text('收起');
      $('#coupons').hide();
    }
      
  })
})