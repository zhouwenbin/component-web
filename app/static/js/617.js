$(function(){
	$('.m617-tab-h li').click(function(){
    $(this).addClass('active').siblings().removeClass('active');
    var index=$('.m617-tab-h li').index(this);
    $('.m617-tab-b').eq(index).addClass('active').siblings().removeClass('active');
    return false;
  })
})