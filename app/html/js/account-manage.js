$(function(){
	$('.myorder-tab li').click(function(){
    var index = $('.myorder-tab li').index(this);
    $(this).addClass('active').siblings().removeClass('active');
    $('.account-manage').eq(index).addClass('active').siblings().removeClass('active');
    return false;
  })
})