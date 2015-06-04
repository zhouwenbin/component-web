$(function(){
  $('#order-detail').click(function(){
  	$(this).toggleClass('active');
  	$('.order-success-detail').toggle();
  })
  $('.gotopay li').click(function(){
  	$(this).addClass('active').siblings().removeClass('active');
  	var text=$(this).find('img').attr('alt');
  	$('#payment').text(text);
  })
})