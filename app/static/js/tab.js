$('.tab li').hover(function(){
	var index = $('.tab li').index(this);
	$('.tab li').eq(index).addClass('active').siblings().removeClass('active');
	$('.tab-content').eq(index).addClass('active').siblings().removeClass('active');
})